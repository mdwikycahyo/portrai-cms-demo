"use client"

import { Handle, Position, type NodeProps } from "@xyflow/react"
import { useState } from "react"
import { Phone, Clock, User, AlertTriangle } from "lucide-react" // Changed Mic to Phone and added AlertTriangle
import type { VoicePromptNodeData } from "@/types/canvas"

interface VoicePromptNodeProps extends NodeProps<VoicePromptNodeData> {
  isOrphaned?: boolean
}

export function VoicePromptNode({ data, selected, isOrphaned }: VoicePromptNodeProps) {
  const [isHovered, setIsHovered] = useState(false)
  const hasValidationErrors = !data.script || data.script.trim() === ""

  return (
    <div
      className={`px-4 py-3 shadow-md rounded-md bg-purple-50 border-2 transition-all duration-200 min-w-[200px] ${
        selected ? "border-purple-500 shadow-lg" : isHovered ? "border-purple-400 shadow-lg" : "border-purple-200"
      } ${isOrphaned ? "border-dashed border-orange-400 bg-orange-50" : ""} ${hasValidationErrors ? "border-red-400" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`Voice call node: ${data.label || "Voice Call"}`}
      aria-selected={selected}
      aria-invalid={hasValidationErrors}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-16 !bg-purple-500"
        aria-label="Input connection point"
      />
      <div className="flex items-center gap-2 mb-2">
        <Phone className="w-4 h-4 text-purple-600" />
        <div className="text-sm font-semibold text-purple-900">Voice Call</div>
        {isOrphaned && (
          <AlertTriangle className="w-3 h-3 text-orange-500" title="Orphaned node - not connected to workflow" />
        )}
        {hasValidationErrors && (
          <AlertTriangle className="w-3 h-3 text-red-500" title="Validation errors - check properties" />
        )}
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-1 text-xs text-purple-700">
          <User className="w-3 h-3" />
          <span>{data.voiceProfile || "Default voice"}</span>
        </div>
        {data.callDuration && (
          <div className="flex items-center gap-1 text-xs text-purple-700">
            <Clock className="w-3 h-3" />
            <span>{data.callDuration}s duration</span>
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-16 !bg-purple-500"
        aria-label="Output connection point"
      />
    </div>
  )
}
