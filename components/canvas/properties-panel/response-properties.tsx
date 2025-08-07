"use client"

import { useState } from "react"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Plus, X } from 'lucide-react'
import type { Node } from "@xyflow/react"
import type { ResponseNodeData, Rule } from "@/types/canvas"
import { getOperatorOptions, getConditionSummary } from "./utils"

interface ResponsePropertiesProps {
  data: ResponseNodeData
  nodeId: string
  nodeType: string
  nodes: Node[]
  onUpdateNodeData: (nodeId: string, newData: any) => void
  onCreateFallbackNode: (selectedNodeId: string, selectedNodePosition: { x: number; y: number }) => void
  validateField: (field: string, value: any, nodeType: string) => void
  getFieldError: (field: string) => string | undefined
  selectedNodePosition: { x: number; y: number }
}

export function ResponseProperties({ 
  data, 
  nodeId, 
  nodeType, 
  nodes, 
  onUpdateNodeData, 
  onCreateFallbackNode,
  validateField, 
  getFieldError,
  selectedNodePosition
}: ResponsePropertiesProps) {
  const [newKeyword, setNewKeyword] = useState("")
  const [newRule, setNewRule] = useState<Partial<Rule>>({
    conditionType: "textLength",
    operator: "greaterThan",
    value: "",
    targetNodeId: "",
  })

  const availableNodes = nodes.filter((node) => node.id !== nodeId)

  const addKeyword = () => {
    if (newKeyword.trim()) {
      const currentKeywords = data.keywords || []
      if (!currentKeywords.includes(newKeyword.trim())) {
        onUpdateNodeData(nodeId, { keywords: [...currentKeywords, newKeyword.trim()] })
      }
      setNewKeyword("")
    }
  }

  const removeKeyword = (keywordToRemove: string) => {
    const currentKeywords = data.keywords || []
    onUpdateNodeData(nodeId, { keywords: currentKeywords.filter((k) => k !== keywordToRemove) })
  }

  const addOption = () => {
    const currentOptions = data.options || []
    const newOption = {
      id: `option-${Date.now()}`,
      text: "",
      nextNodeId: undefined,
    }
    onUpdateNodeData(nodeId, { options: [...currentOptions, newOption] })
  }

  const updateOption = (optionId: string, field: "text" | "nextNodeId", value: string) => {
    const currentOptions = data.options || []
    const updatedOptions = currentOptions.map((option) =>
      option.id === optionId ? { ...option, [field]: value === "" ? undefined : value } : option,
    )
    onUpdateNodeData(nodeId, { options: updatedOptions })
  }

  const removeOption = (optionId: string) => {
    const currentOptions = data.options || []
    onUpdateNodeData(nodeId, { options: currentOptions.filter((option) => option.id !== optionId) })
  }

  const addRule = () => {
    if (newRule.conditionType && newRule.operator && newRule.value && newRule.targetNodeId) {
      const currentRules = data.rules || []
      const rule: Rule = {
        id: `rule-${Date.now()}`,
        conditionType: newRule.conditionType as Rule["conditionType"],
        operator: newRule.operator as Rule["operator"],
        value: newRule.value,
        targetNodeId: newRule.targetNodeId,
      }
      onUpdateNodeData(nodeId, { rules: [...currentRules, rule] })
      setNewRule({
        conditionType: "textLength",
        operator: "greaterThan",
        value: "",
        targetNodeId: "",
      })
    }
  }

  const removeRule = (ruleId: string) => {
    const currentRules = data.rules || []
    onUpdateNodeData(nodeId, { rules: currentRules.filter((rule) => rule.id !== ruleId) })
  }

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
          onChange={(e) => onUpdateNodeData(nodeId, { timeLimit: Number.parseInt(e.target.value) || 60 })}
          onBlur={(e) => validateField("timeLimit", Number.parseInt(e.target.value) || 60, nodeType)}
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
          onValueChange={(value) => onUpdateNodeData(nodeId, { responseType: value })}
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
                  onUpdateNodeData(nodeId, {
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
                  onUpdateNodeData(nodeId, {
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
                        {String(node.data?.label || node.id)}
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
              onUpdateNodeData(nodeId, {
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
              onValueChange={(value) => onUpdateNodeData(nodeId, { fallbackNodeId: value })}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select fallback node" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="none">No connection</SelectItem>
                {availableNodes.map((node) => (
                  <SelectItem key={node.id} value={node.id}>
                    {String(node.data?.label || node.id)}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <Button 
              size="sm" 
              variant="outline" 
              onClick={() => onCreateFallbackNode(nodeId, selectedNodePosition)} 
              className="w-full bg-transparent"
            >
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
                <div className="text-xs text-blue-700">→ {String(targetNode?.data?.label || "Unknown Node")}</div>
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
                  {String(node.data?.label || node.id)}
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
