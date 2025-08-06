"use client"

import type { Node } from "@xyflow/react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useReactFlow } from "@xyflow/react"
import { Plus, X, Trash2 } from 'lucide-react' // Import Trash2
import { useState } from "react"
import type { EmailPromptNodeData, ResponseNodeData, VoicePromptNodeData, ChatNodeData, Rule } from "@/types/canvas"
import type { Persona } from "@/types/persona"

interface PropertiesPanelProps {
  selectedNode: Node | null
  nodes: Node[]
  personas: Persona[]
  onClosePanel: () => void // Add onClosePanel prop
  onDeleteNode: (nodeId: string) => void // Add onDeleteNode prop
  style?: React.CSSProperties // Add style prop
}

export function PropertiesPanel({ selectedNode, nodes, personas, onClosePanel, onDeleteNode, style }: PropertiesPanelProps) {
  const { setNodes } = useReactFlow()
  const [newKeyword, setNewKeyword] = useState("")
  const [newRule, setNewRule] = useState<Partial<Rule>>({
    conditionType: "textLength",
    operator: "greaterThan",
    value: "",
    targetNodeId: "",
  })

  const updateNodeData = (nodeId: string, newData: any) => {
    setNodes((nodes) =>
      nodes.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node)),
    )
  }

  const addKeyword = () => {
    if (newKeyword.trim() && selectedNode) {
      const currentKeywords = (selectedNode.data as ResponseNodeData).keywords || []
      if (!currentKeywords.includes(newKeyword.trim())) {
        updateNodeData(selectedNode.id, { keywords: [...currentKeywords, newKeyword.trim()] })
      }
      setNewKeyword("")
    }
  }

  const removeKeyword = (keywordToRemove: string) => {
    if (selectedNode) {
      const currentKeywords = (selectedNode.data as ResponseNodeData).keywords || []
      updateNodeData(selectedNode.id, { keywords: currentKeywords.filter((k) => k !== keywordToRemove) })
    }
  }

  const addOption = () => {
    if (selectedNode) {
      const currentOptions = (selectedNode.data as ResponseNodeData).options || []
      const newOption = {
        id: `option-${Date.now()}`,
        text: "",
        nextNodeId: undefined,
      }
      updateNodeData(selectedNode.id, { options: [...currentOptions, newOption] })
    }
  }

  const updateOption = (optionId: string, field: "text" | "nextNodeId", value: string) => {
    if (selectedNode) {
      const currentOptions = (selectedNode.data as ResponseNodeData).options || []
      const updatedOptions = currentOptions.map((option) =>
        option.id === optionId ? { ...option, [field]: value === "" ? undefined : value } : option,
      )
      updateNodeData(selectedNode.id, { options: updatedOptions })
    }
  }

  const removeOption = (optionId: string) => {
    if (selectedNode) {
      const currentOptions = (selectedNode.data as ResponseNodeData).options || []
      updateNodeData(selectedNode.id, { options: currentOptions.filter((option) => option.id !== optionId) })
    }
  }

  const createFallbackNode = () => {
    if (selectedNode) {
      const newNode = {
        id: `fallback-${Date.now()}`,
        type: "customNode", // This will be removed in a later step if customNode is fully deprecated
        position: {
          x: selectedNode.position.x + 200,
          y: selectedNode.position.y + 100,
        },
        data: { label: "Fallback Node" },
      }
      setNodes((nodes) => [...nodes, newNode])
      updateNodeData(selectedNode.id, { fallbackNodeId: newNode.id })
    }
  }

  const addRule = () => {
    if (selectedNode && newRule.conditionType && newRule.operator && newRule.value && newRule.targetNodeId) {
      const currentRules = (selectedNode.data as ResponseNodeData).rules || []
      const rule: Rule = {
        id: `rule-${Date.now()}`,
        conditionType: newRule.conditionType as Rule["conditionType"],
        operator: newRule.operator as Rule["operator"],
        value: newRule.value,
        targetNodeId: newRule.targetNodeId,
      }
      updateNodeData(selectedNode.id, { rules: [...currentRules, rule] })
      setNewRule({
        conditionType: "textLength",
        operator: "greaterThan",
        value: "",
        targetNodeId: "",
      })
    }
  }

  const updateRule = (ruleId: string, field: keyof Rule, value: any) => {
    if (selectedNode) {
      const currentRules = (selectedNode.data as ResponseNodeData).rules || []
      const updatedRules = currentRules.map((rule) => (rule.id === ruleId ? { ...rule, [field]: value } : rule))
      updateNodeData(selectedNode.id, { rules: updatedRules })
    }
  }

  const removeRule = (ruleId: string) => {
    if (selectedNode) {
      const currentRules = (selectedNode.data as ResponseNodeData).rules || []
      updateNodeData(selectedNode.id, { rules: currentRules.filter((rule) => rule.id !== ruleId) })
    }
  }

  const getOperatorOptions = (conditionType: Rule["conditionType"]) => {
    switch (conditionType) {
      case "textLength":
      case "timeTaken":
        return [
          { value: "greaterThan", label: "Greater than" },
          { value: "lessThan", label: "Less than" },
          { value: "equals", label: "Equals" },
        ]
      case "keywordMatch":
        return [
          { value: "contains", label: "Contains" },
          { value: "notContains", label: "Does not contain" },
        ]
      default:
        return []
    }
  }

  const getConditionSummary = (rule: Rule) => {
    const conditionLabels = {
      textLength: "Text Length",
      keywordMatch: "Keywords",
      timeTaken: "Time Taken",
    }

    const operatorLabels = {
      greaterThan: ">",
      lessThan: "<",
      equals: "=",
      contains: "contains",
      notContains: "!contains",
    }

    return `${conditionLabels[rule.conditionType]} ${operatorLabels[rule.operator]} ${rule.value}`
  }

  const [validationErrors, setValidationErrors] = useState<Record<string, string>>({})

  const validateField = (field: string, value: any, nodeType: string) => {
    const errors: Record<string, string> = { ...validationErrors }

    switch (nodeType) {
      case "emailPromptNode":
        if (field === "sender" && (!value || !value.includes("@"))) {
          errors[field] = "Valid email address required"
        } else if (field === "subject" && (!value || value.trim() === "")) {
          errors[field] = "Subject is required"
        } else if (field === "body" && (!value || value.trim() === "")) {
          errors[field] = "Email body is required"
        } else {
          delete errors[field]
        }
        break
      case "voicePromptNode":
        if (field === "script" && (!value || value.trim() === "")) {
          errors[field] = "Script is required"
        } else {
          delete errors[field]
        }
        break
      case "responseNode":
        if (field === "timeLimit" && (!value || value <= 0)) {
          errors[field] = "Time limit must be greater than 0"
        } else {
          delete errors[field]
        }
        break
      case "chatNode":
        if (field === "personaId" && !value) {
          errors[field] = "Persona selection is required"
        } else {
          delete errors[field]
        }
        break
    }

    setValidationErrors(errors)
  }

  const getFieldError = (field: string) => validationErrors[field]

  if (!selectedNode) {
    return (
      <div className="w-64 bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Properties</h3>
        <div className="text-sm text-gray-500">Select a node to edit its properties</div>
      </div>
    )
  }

  const renderEmailPromptProperties = (data: EmailPromptNodeData) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="email-sender" className="text-xs font-medium text-gray-700">
          Sender
        </Label>
        <Input
          id="email-sender"
          value={data.sender || ""}
          onChange={(e) => updateNodeData(selectedNode.id, { sender: e.target.value })}
          onBlur={(e) => validateField("sender", e.target.value, selectedNode.type)}
          className={`mt-1 ${getFieldError("sender") ? "border-red-500" : ""}`}
          placeholder="sender@company.com"
          aria-invalid={!!getFieldError("sender")}
          aria-describedby={getFieldError("sender") ? "sender-error" : undefined}
        />
        {getFieldError("sender") && (
          <div id="sender-error" className="text-xs text-red-600 mt-1" role="alert">
            {getFieldError("sender")}
          </div>
        )}
      </div>
      <div>
        <Label htmlFor="email-subject" className="text-xs font-medium text-gray-700">
          Subject
        </Label>
        <Input
          id="email-subject"
          value={data.subject || ""}
          onChange={(e) => updateNodeData(selectedNode.id, { subject: e.target.value })}
          onBlur={(e) => validateField("subject", e.target.value, selectedNode.type)}
          className={`mt-1 ${getFieldError("subject") ? "border-red-500" : ""}`}
          placeholder="Email subject"
          aria-invalid={!!getFieldError("subject")}
          aria-describedby={getFieldError("subject") ? "subject-error" : undefined}
        />
        {getFieldError("subject") && (
          <div id="subject-error" className="text-xs text-red-600 mt-1" role="alert">
            {getFieldError("subject")}
          </div>
        )}
      </div>
      <div>
        <Label htmlFor="email-body" className="text-xs font-medium text-gray-700">
          Body
        </Label>
        <Textarea
          id="email-body"
          value={data.body || ""}
          onChange={(e) => updateNodeData(selectedNode.id, { body: e.target.value })}
          onBlur={(e) => validateField("body", e.target.value, selectedNode.type)}
          className={`mt-1 ${getFieldError("body") ? "border-red-500" : ""}`}
          placeholder="Email content..."
          rows={4}
          aria-invalid={!!getFieldError("body")}
          aria-describedby={getFieldError("body") ? "body-error" : undefined}
        />
        {getFieldError("body") && (
          <div id="body-error" className="text-xs text-red-600 mt-1" role="alert">
            {getFieldError("body")}
          </div>
        )}
      </div>
    </div>
  )

  const renderVoicePromptProperties = (data: VoicePromptNodeData) => (
    <div className="space-y-4">
      <div>
        <Label htmlFor="voice-script" className="text-xs font-medium text-gray-700">
          Script
        </Label>
        <Textarea
          id="voice-script"
          value={data.script || ""}
          onChange={(e) => updateNodeData(selectedNode.id, { script: e.target.value })}
          onBlur={(e) => validateField("script", e.target.value, selectedNode.type)}
          className={`mt-1 ${getFieldError("script") ? "border-red-500" : ""}`}
          placeholder="Voice script content..."
          rows={4}
          aria-invalid={!!getFieldError("script")}
          aria-describedby={getFieldError("script") ? "script-error" : undefined}
        />
        {getFieldError("script") && (
          <div id="script-error" className="text-xs text-red-600 mt-1" role="alert">
            {getFieldError("script")}
          </div>
        )}
      </div>
      <div>
        <Label htmlFor="voice-profile" className="text-xs font-medium text-gray-700">
          Voice Profile
        </Label>
        <Select
          value={data.voiceProfile || ""}
          onValueChange={(value) => updateNodeData(selectedNode.id, { voiceProfile: value })}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select voice profile" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="default">Default</SelectItem>
            <SelectItem value="professional">Professional</SelectItem>
            <SelectItem value="friendly">Friendly</SelectItem>
            <SelectItem value="authoritative">Authoritative</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label htmlFor="call-duration" className="text-xs font-medium text-gray-700">
          Call Duration (seconds)
        </Label>
        <Input
          id="call-duration"
          type="number"
          value={data.callDuration || ""}
          onChange={(e) =>
            updateNodeData(selectedNode.id, {
              callDuration: e.target.value ? Number.parseInt(e.target.value) : undefined,
            })
          }
          className="mt-1"
          placeholder="30"
          min="1"
        />
      </div>
      <div>
        <Label htmlFor="call-sentiment" className="text-xs font-medium text-gray-700">
          Call Sentiment
        </Label>
        <Select
          value={data.callSentiment || ""}
          onValueChange={(value) => updateNodeData(selectedNode.id, { callSentiment: value })}
        >
          <SelectTrigger className="mt-1">
            <SelectValue placeholder="Select sentiment" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="neutral">Neutral</SelectItem>
            <SelectItem value="positive">Positive</SelectItem>
            <SelectItem value="negative">Negative</SelectItem>
            <SelectItem value="urgent">Urgent</SelectItem>
          </SelectContent>
        </Select>
      </div>
    </div>
  )

  const renderChatNodeProperties = (data: ChatNodeData) => (
    <div className="space-y-4">
      <div>
        <Label className="text-xs font-medium text-gray-700">Assigned Persona</Label>
        <Select
          value={data.personaId || "none"}
          onValueChange={(value) => {
            updateNodeData(selectedNode.id, { personaId: value === "none" ? undefined : value })
            validateField("personaId", value === "none" ? undefined : value, selectedNode.type)
          }}
          onBlur={() => validateField("personaId", data.personaId || "none", selectedNode.type)}
        >
          <SelectTrigger className={`mt-1 ${getFieldError("personaId") ? "border-red-500" : ""}`}>
            <SelectValue placeholder="Select persona" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="none">No persona assigned</SelectItem>
            {personas.map((persona) => (
              <SelectItem key={persona.id} value={persona.id}>
                {persona.name} ({persona.type})
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        {getFieldError("personaId") && (
          <div className="text-xs text-red-600 mt-1" role="alert">
            {getFieldError("personaId")}
          </div>
        )}
      </div>
      {data.personaId && (
        <div className="p-3 bg-orange-50 rounded-lg">
          {(() => {
            const persona = personas.find((p) => p.id === data.personaId)
            if (!persona) return null
            return (
              <div>
                <div className="text-sm font-medium text-orange-900 mb-1">{persona.name}</div>
                <Badge variant="secondary" className="text-xs mb-2">
                  {persona.type}
                </Badge>
                {persona.responseStyle && <p className="text-xs text-orange-700 mb-1">{persona.responseStyle}</p>}
                <div className="text-xs text-orange-600">Tone: {persona.tone}/10</div>
              </div>
            )
          })()}
        </div>
      )}
    </div>
  )

  const renderResponseProperties = (data: ResponseNodeData) => {
    const availableNodes = nodes.filter((node) => node.id !== selectedNode.id)

    return (
      <div className="space-y-4">
        <div>
          <Label htmlFor="response-time-limit" className="text-xs font-medium text-gray-700">
            Time Limit (seconds)
          </Label>
          <Input
            id="response-time-limit"
            type="number"
            value={data.timeLimit || 60}
            onChange={(e) => updateNodeData(selectedNode.id, { timeLimit: Number.parseInt(e.target.value) || 60 })}
            onBlur={(e) => validateField("timeLimit", Number.parseInt(data.timeLimit) || 60, selectedNode.type)}
            className={`mt-1 ${getFieldError("timeLimit") ? "border-red-500" : ""}`}
            placeholder="60"
            min="1"
            aria-invalid={!!getFieldError("timeLimit")}
            aria-describedby={getFieldError("timeLimit") ? "timeLimit-error" : undefined}
          />
          {getFieldError("timeLimit") && (
            <div id="timeLimit-error" className="text-xs text-red-600 mt-1" role="alert">
              {getFieldError("timeLimit")}
            </div>
          )}
        </div>

        <div>
          <Label className="text-xs font-medium text-gray-700">Response Type</Label>
          <Select
            value={data.responseType || "text"}
            onValueChange={(value) => updateNodeData(selectedNode.id, { responseType: value })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="text">Text Input</SelectItem>
              <SelectItem value="keywords">Keyword Match</SelectItem>
              <SelectItem value="multipleChoice">Multiple Choice</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Text Length Constraints */}
        {data.responseType === "text" && (
          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-700">Text Length Constraints</Label>
            <div className="grid grid-cols-2 gap-2">
              <div>
                <Input
                  type="number"
                  placeholder="Min"
                  value={data.minLength || ""}
                  onChange={(e) =>
                    updateNodeData(selectedNode.id, {
                      minLength: e.target.value ? Number.parseInt(e.target.value) : undefined,
                    })
                  }
                  min="0"
                />
              </div>
              <div>
                <Input
                  type="number"
                  placeholder="Max"
                  value={data.maxLength || ""}
                  onChange={(e) =>
                    updateNodeData(selectedNode.id, {
                      maxLength: e.target.value ? Number.parseInt(e.target.value) : undefined,
                    })
                  }
                  min="1"
                />
              </div>
            </div>
          </div>
        )}

        {/* Keyword Match */}
        {data.responseType === "keywords" && (
          <div className="space-y-2">
            <Label className="text-xs font-medium text-gray-700">Required Keywords</Label>
            <div className="flex gap-2">
              <Input
                placeholder="Add keyword"
                value={newKeyword}
                onChange={(e) => setNewKeyword(e.target.value)}
                onKeyPress={(e) => e.key === "Enter" && addKeyword()}
              />
              <Button size="sm" onClick={addKeyword}>
                <Plus className="w-3 h-3" />
              </Button>
            </div>
            <div className="flex flex-wrap gap-1">
              {(data.keywords || []).map((keyword) => (
                <Badge key={keyword} variant="secondary" className="text-xs">
                  {keyword}
                  <button onClick={() => removeKeyword(keyword)} className="ml-1 hover:text-red-600">
                    <X className="w-3 h-3" />
                  </button>
                </Badge>
              ))}
            </div>
          </div>
        )}

        {/* Multiple Choice Options */}
        {data.responseType === "multipleChoice" && (
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label className="text-xs font-medium text-gray-700">Options</Label>
              <Button size="sm" variant="outline" onClick={addOption}>
                <Plus className="w-3 h-3 mr-1" />
                Add
              </Button>
            </div>
            <div className="space-y-2">
              {(data.options || []).map((option) => (
                <div key={option.id} className="space-y-1 p-2 border rounded">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Option text"
                      value={option.text}
                      onChange={(e) => updateOption(option.id, "text", e.target.value)}
                    />
                    <Button size="sm" variant="ghost" onClick={() => removeOption(option.id)}>
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  <Select
                    value={option.nextNodeId || "none"}
                    onValueChange={(value) => updateOption(option.id, "nextNodeId", value)}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Next node (optional)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="none">No connection</SelectItem>
                      {availableNodes.map((node) => (
                        <SelectItem key={node.id} value={node.id}>
                          {node.data?.label || node.id}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Fallback Settings */}
        <div className="space-y-2 pt-2 border-t">
          <div className="flex items-center justify-between">
            <Label className="text-xs font-medium text-gray-700">Enable Fallback</Label>
            <Switch
              checked={data.hasFallback || false}
              onCheckedChange={(checked) =>
                updateNodeData(selectedNode.id, {
                  hasFallback: checked,
                  fallbackNodeId: checked ? data.fallbackNodeId : undefined,
                })
              }
            />
          </div>

          {data.hasFallback && (
            <div className="space-y-2">
              <Label className="text-xs font-medium text-gray-700">Fallback Target</Label>
              <Select
                value={data.fallbackNodeId || "none"}
                onValueChange={(value) => updateNodeData(selectedNode.id, { fallbackNodeId: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select fallback node" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="none">No connection</SelectItem>
                  {availableNodes.map((node) => (
                    <SelectItem key={node.id} value={node.id}>
                      {node.data?.label || node.id}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button size="sm" variant="outline" onClick={createFallbackNode} className="w-full bg-transparent">
                Create New Fallback Node
              </Button>
            </div>
          )}
        </div>

        {/* Branching Rules */}
        <div className="space-y-2 pt-2 border-t">
          <Label className="text-xs font-medium text-gray-700">Branching Rules</Label>

          {/* Existing Rules */}
          <div className="space-y-2">
            {(data.rules || []).map((rule) => {
              const targetNode = availableNodes.find((n) => n.id === rule.targetNodeId)
              return (
                <div key={rule.id} className="p-2 border rounded bg-blue-50">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs font-medium text-blue-900">{getConditionSummary(rule)}</span>
                    <Button size="sm" variant="ghost" onClick={() => removeRule(rule.id)}>
                      <X className="w-3 h-3" />
                    </Button>
                  </div>
                  <div className="text-xs text-blue-700">→ {targetNode?.data?.label || "Unknown Node"}</div>
                </div>
              )
            })}
          </div>

          {/* Add New Rule */}
          <div className="space-y-2 p-2 border rounded bg-gray-50">
            <Label className="text-xs font-medium text-gray-700">Add New Rule</Label>

            <Select
              value={newRule.conditionType || "textLength"}
              onValueChange={(value) =>
                setNewRule({ ...newRule, conditionType: value as Rule["conditionType"], operator: "greaterThan" })
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="textLength">Text Length</SelectItem>
                <SelectItem value="keywordMatch">Keyword Match</SelectItem>
                <SelectItem value="timeTaken">Time Taken</SelectItem>
              </SelectContent>
            </Select>

            <Select
              value={newRule.operator || "greaterThan"}
              onValueChange={(value) => setNewRule({ ...newRule, operator: value as Rule["operator"] })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {getOperatorOptions(newRule.conditionType || "textLength").map((option) => (
                  <SelectItem key={option.value} value={option.value}>
                    {option.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            {newRule.conditionType === "keywordMatch" ? (
              <Input
                placeholder="Enter keywords (comma-separated)"
                value={Array.isArray(newRule.value) ? newRule.value.join(", ") : newRule.value || ""}
                onChange={(e) =>
                  setNewRule({
                    ...newRule,
                    value: e.target.value
                      .split(",")
                      .map((k) => k.trim())
                      .filter((k) => k),
                  })
                }
              />
            ) : (
              <Input
                type="number"
                placeholder={newRule.conditionType === "timeTaken" ? "Seconds" : "Characters"}
                value={newRule.value || ""}
                onChange={(e) => setNewRule({ ...newRule, value: Number(e.target.value) })}
                min="0"
              />
            )}

            <Select
              value={newRule.targetNodeId || ""}
              onValueChange={(value) => setNewRule({ ...newRule, targetNodeId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select target node" />
              </SelectTrigger>
              <SelectContent>
                {availableNodes.map((node) => (
                  <SelectItem key={node.id} value={node.id}>
                    {node.data?.label || node.id}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>

            <Button
              size="sm"
              onClick={addRule}
              disabled={!newRule.conditionType || !newRule.operator || !newRule.value || !newRule.targetNodeId}
              className="w-full"
            >
              <Plus className="w-3 h-3 mr-1" />
              Add Rule
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const renderPropertiesByType = () => {
    switch (selectedNode.type) {
      case "emailPromptNode":
        return renderEmailPromptProperties(selectedNode.data as EmailPromptNodeData)
      case "voicePromptNode":
        return renderVoicePromptProperties(selectedNode.data as VoicePromptNodeData)
      case "chatNode":
        return renderChatNodeProperties(selectedNode.data as ChatNodeData)
      case "responseNode":
        return renderResponseProperties(selectedNode.data as ResponseNodeData)
      default:
        return <div className="text-sm text-gray-500">Unknown node type</div>
    }
  }

  return (
    <div className="bg-white border-b border-gray-200 p-0 max-h-full overflow-y-auto" style={style}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex flex-col">
          <h3 className="text-base font-semibold text-gray-900">{selectedNode.data?.label || "Node Properties"}</h3>
          <p className="text-xs text-gray-500">{selectedNode.type}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => onDeleteNode(selectedNode.id)} aria-label="Delete node">
            <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-500" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClosePanel} aria-label="Close panel">
            <X className="w-4 h-4 text-gray-600 hover:text-gray-900" />
          </Button>
        </div>
      </div>

      <div className="p-2">
        {renderPropertiesByType()}

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="space-y-2">
            <div>
              <Label className="text-xs font-medium text-gray-700">Node ID</Label>
              <div className="mt-1 text-xs text-gray-500 font-mono">{selectedNode.id}</div>
            </div>
            <div>
              <Label className="text-xs font-medium text-gray-700">Type</Label>
              <div className="mt-1 text-xs text-gray-500">{selectedNode.type}</div>
            </div>
            <div>
              <Label className="text-xs font-medium text-gray-700">Position</Label>
              <div className="mt-1 text-xs text-gray-500">
                X: {Math.round(selectedNode.position.x)}, Y: {Math.round(selectedNode.position.y)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
