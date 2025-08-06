"use client"

import { Handle, Position, type NodeProps } from "@xyflow/react"
import { useState } from "react"
import { Phone, Clock, User, AlertTriangle } from "lucide-react" // Corrected import
import type { VoicePromptNodeData } from "@/types/canvas" // Corrected import

interface VoicePromptNodeProps extends NodeProps {
  isOrphaned?: boolean
  isConnected?: boolean // Add this line
}

export function VoicePromptNode({ data, selected, isOrphaned, isConnected }: VoicePromptNodeProps) {
  const nodeData = data as unknown as VoicePromptNodeData
  const [isHovered, setIsHovered] = useState(false)
  const hasValidationErrors = !nodeData.script || nodeData.script.trim() === ""

  return (
    <div
      className={`px-4 py-3 shadow-md rounded-md bg-white border-2 transition-all duration-200 min-w-[200px] ${
        selected
          ? "border-blue-500 shadow-lg"
          : (isHovered || isConnected)
            ? "border-blue-400 shadow-lg"
            : "border-gray-200"
      } ${isOrphaned ? "border-dashed border-orange-400 bg-orange-50" : ""}`}
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
        className="!w-6 !h-6 !bg-white !border-1 !border-blue-400 !rounded-full"
        style={{
          top: "50%",
          transform: "translateY(-50%)",
          left: "-10px", // Adjusted to center 16px handle on the node's left edge
          background: "radial-gradient(circle, transparent 30%, #60a5fa 30%)",
        }}
        aria-label="Input connection point"
      />
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0 bg-purple-100">
          <Phone className="w-8 h-8 text-purple-600" />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="text-sm font-medium text-gray-700">Voice Call</div>
          <div className="text-base font-semibold text-gray-900 truncate">
            {nodeData.script
              ? nodeData.script.substring(0, 25) + (nodeData.script.length > 25 ? "..." : "")
              : "No Detail"}
          </div>
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Right}
        className="!w-6 !h-6 !bg-white !border-1 !border-orange-400 !rounded-full"
        style={{
          top: "50%",
          transform: "translateY(-50%)",
          right: "-10px", // Adjusted to center 16px handle on the node's right edge
          background: "radial-gradient(circle, transparent 30%, #fb923c 30%)",
        }}
        aria-label="Output connection point"
      />
    </div>
  )
}
