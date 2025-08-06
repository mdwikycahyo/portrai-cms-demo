"use client"

import { Handle, Position, type NodeProps } from "@xyflow/react"
import { useState } from "react"
import { MessageCircle, AlertTriangle } from "lucide-react"
import type { ChatNodeData } from "@/types/canvas"

interface ChatNodeProps extends NodeProps {
  personas?: Array<{ id: string; name: string; type: string }>
  isOrphaned?: boolean
  isConnected?: boolean // Add this line
}

export function ChatNode({ data, selected, personas = [], isOrphaned, isConnected }: ChatNodeProps) {
  const nodeData = data as unknown as ChatNodeData
  const [isHovered, setIsHovered] = useState(false)
  const assignedPersona = personas.find((p) => p.id === nodeData.personaId)
  const hasValidationErrors = !nodeData.personaId

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
      aria-label={`Chat node: ${assignedPersona ? assignedPersona.name : "No persona assigned"}`}
      aria-selected={selected ? true : false}
      aria-invalid={hasValidationErrors}
    >
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0 bg-orange-100">
          <MessageCircle className="w-8 h-8 text-orange-600" />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="text-sm font-medium text-gray-700">Chat</div>
          <div className="text-base font-semibold text-gray-900 truncate">
            {assignedPersona ? assignedPersona.name : "No Detail"}
          </div>
        </div>
      </div>
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
