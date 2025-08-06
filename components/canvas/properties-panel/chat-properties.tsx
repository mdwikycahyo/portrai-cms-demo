"use client"

import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import type { ChatNodeData } from "@/types/canvas"
import type { Persona } from "@/types/persona"

interface ChatPropertiesProps {
  data: ChatNodeData
  nodeId: string
  nodeType: string
  personas: Persona[]
  onUpdateNodeData: (nodeId: string, newData: any) => void
  validateField: (field: string, value: any, nodeType: string) => void
  getFieldError: (field: string) => string | undefined
}

export function ChatProperties({ 
  data, 
  nodeId, 
  nodeType, 
  personas, 
  onUpdateNodeData, 
  validateField, 
  getFieldError 
}: ChatPropertiesProps) {
  return (
    <div className="space-y-4">
      <div>
        <Label className="text-xs font-medium text-gray-700">Assigned Persona</Label>
        <Select
          value={data.personaId || "none"}
          onValueChange={(value) => {
            onUpdateNodeData(nodeId, { personaId: value === "none" ? undefined : value })
            validateField("personaId", value === "none" ? undefined : value, nodeType)
          }}
          onBlur={() => validateField("personaId", data.personaId || "none", nodeType)}
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
}
