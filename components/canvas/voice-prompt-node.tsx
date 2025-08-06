"use client"

import { Handle, Position, type NodeProps, type Node } from "@xyflow/react"
import { useState } from "react"
import { Phone, Clock, User, AlertTriangle } from "lucide-react" // Changed Mic to Phone and added AlertTriangle
import type { VoicePromptNodeData } from "@/types/canvas"

interface VoicePromptNodeProps extends NodeProps {
  isOrphaned?: boolean
}

export function VoicePromptNode({ data, selected, isOrphaned }: VoicePromptNodeProps) {
  const nodeData = data as unknown as VoicePromptNodeData
  const [isHovered, setIsHovered] = useState(false)
  const hasValidationErrors = !nodeData.script || nodeData.script.trim() === ""

  return (
    <div
      className={`px-4 py-3 shadow-md rounded-md bg-purple-50 border-2 transition-all duration-200 min-w-[200px] ${
        selected ? "border-purple-500 shadow-lg" : isHovered ? "border-purple-400 shadow-lg" : "border-purple-200"
      } ${isOrphaned ? "border-dashed border-orange-400 bg-orange-50" : ""} ${hasValidationErrors ? "border-red-400" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`Voice call node: ${nodeData.label || "Voice Call"}`}
      aria-selected={selected ? true : false}
      aria-invalid={hasValidationErrors}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="h-5 w-5 !bg-blue-500 z-10"
        aria-label="Input connection point"
      />
      <div className="flex items-center gap-2 mb-2">
        <Phone className="w-4 h-4 text-purple-600" />
        <div className="text-sm font-semibold text-purple-900">Voice Call</div>
        {isOrphaned && (
          <AlertTriangle className="w-3 h-3 text-orange-500" aria-label="Orphaned node - not connected to workflow" />
        )}
        {hasValidationErrors && (
          <AlertTriangle className="w-3 h-3 text-red-500" aria-label="Validation errors - check properties" />
        )}
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-1 text-xs text-purple-700">
          <User className="w-3 h-3" />
          <span>{nodeData.voiceProfile || "Default voice"}</span>
        </div>
        {nodeData.callDuration && (
          <div className="flex items-center gap-1 text-xs text-purple-700">
            <Clock className="w-3 h-3" />
            <span>{nodeData.callDuration}s duration</span>
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="h-5 w-5 !bg-green-500 z-10"
        aria-label="Output connection point"
      />
    </div>
  )
}
