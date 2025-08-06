"use client"

import { Handle, Position, type NodeProps } from "@xyflow/react"
import { useState } from "react"
import { Mail } from 'lucide-react'
import { getSenderById } from "@/data/mock-senders"
import type { EmailPromptNodeData } from "@/types/canvas"

interface EmailPromptNodeProps extends NodeProps {
  isOrphaned?: boolean
  isConnected?: boolean
}

export function EmailPromptNode({ data, selected, isOrphaned, isConnected }: EmailPromptNodeProps) {
  const nodeData = data as unknown as EmailPromptNodeData
  const [isHovered, setIsHovered] = useState(false)
  
  // Get sender information
  const sender = getSenderById(nodeData.senderId || "")
  const senderDisplay = sender ? `${sender.name} (${sender.roleName})` : "No sender selected"

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
      aria-label={`Email prompt node: ${nodeData.subject || "No subject"}`}
      aria-selected={selected ? true : false}
    >
      <Handle
        type="target"
        position={Position.Left}
        className="!w-6 !h-6 !bg-white !border-1 !border-blue-400 !rounded-full"
        style={{
          top: "50%",
          transform: "translateY(-50%)",
          left: "-10px",
          background: "radial-gradient(circle, transparent 30%, #60a5fa 30%)",
        }}
        aria-label="Input connection point"
      />
      
      <div className="flex items-center gap-3">
        <div className="w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0 bg-blue-100">
          <Mail className="w-8 h-8 text-blue-600" />
        </div>
        <div className="flex flex-col min-w-0 flex-1">
          <div className="text-base font-semibold text-gray-900 truncate">Email</div>
          <div className="text-xs text-gray-600 truncate">
            <span className="font-medium text-gray-900">From:</span> {senderDisplay}
          </div>
          <div className="text-xs text-gray-600 truncate">
            <span className="font-medium text-gray-900">Subject:</span> {nodeData.subject || "No subject"}
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
          right: "-10px",
          background: "radial-gradient(circle, transparent 30%, #fb923c 30%)",
        }}
        aria-label="Output connection point"
      />
    </div>
  )
}
