"use client"

import { Handle, Position, type NodeProps } from "@xyflow/react"
import { useState } from "react"
import { MessageCircle, User, AlertTriangle } from "lucide-react"
import type { ChatNodeData } from "@/types/canvas"

interface ChatNodeProps extends NodeProps<ChatNodeData> {
  personas?: Array<{ id: string; name: string }>
  isOrphaned?: boolean
}

export function ChatNode({ data, selected, personas = [], isOrphaned }: ChatNodeProps) {
  const [isHovered, setIsHovered] = useState(false)
  const assignedPersona = personas.find((p) => p.id === data.personaId)
  const hasValidationErrors = !data.personaId

  return (
    <div
      className={`px-4 py-3 shadow-md rounded-md bg-orange-50 border-2 transition-all duration-200 min-w-[180px] ${
        selected ? "border-orange-500 shadow-lg" : isHovered ? "border-orange-400 shadow-lg" : "border-orange-200"
      } ${isOrphaned ? "border-dashed border-orange-400 bg-orange-50" : ""} ${hasValidationErrors ? "border-red-400" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`Chat node: ${assignedPersona ? assignedPersona.name : "No persona assigned"}`}
      aria-selected={selected}
      aria-invalid={hasValidationErrors}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-16 !bg-orange-500"
        aria-label="Input connection point"
      />
      <div className="flex items-center gap-2 mb-2">
        <MessageCircle className="w-4 h-4 text-orange-600" />
        <div className="text-sm font-semibold text-orange-900">Chat</div>
        {isOrphaned && (
          <AlertTriangle className="w-3 h-3 text-orange-500" title="Orphaned node - not connected to workflow" />
        )}
        {hasValidationErrors && (
          <AlertTriangle className="w-3 h-3 text-red-500" title="Validation errors - check properties" />
        )}
      </div>
      <div className="flex items-center gap-1 text-xs text-orange-700">
        <User className="w-3 h-3" />
        <span>{assignedPersona ? assignedPersona.name : "No persona assigned"}</span>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-16 !bg-orange-500"
        aria-label="Output connection point"
      />
    </div>
  )
}
