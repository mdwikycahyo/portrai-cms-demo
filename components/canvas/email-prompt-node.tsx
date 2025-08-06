"use client"

import { Handle, Position, type NodeProps, type Node } from "@xyflow/react"
import { useState } from "react"
import { Mail, AlertTriangle } from "lucide-react"
import type { EmailPromptNodeData } from "@/types/canvas"

interface EmailPromptNodeProps extends NodeProps {
  isOrphaned?: boolean
}

export function EmailPromptNode({ data, selected, isOrphaned }: EmailPromptNodeProps) {
  const nodeData = data as unknown as EmailPromptNodeData
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`px-4 py-3 shadow-md rounded-md bg-blue-50 border-2 transition-all duration-200 min-w-[200px] ${
        selected ? "border-blue-500 shadow-lg" : isHovered ? "border-blue-400 shadow-lg" : "border-blue-200"
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
        className="h-5 w-5 !bg-blue-500 z-10" 
        aria-label="Input connection point" 
      />
      <div className="flex items-center gap-2 mb-2">
        <Mail className="w-4 h-4 text-blue-600" />
        <div className="text-sm font-semibold text-blue-900">Email Prompt</div>
        {isOrphaned && (
          <AlertTriangle className="w-3 h-3 text-orange-500" aria-label="Orphaned node - not connected to workflow" />
        )}
      </div>
      <div className="text-xs text-blue-700">
        <div className="font-medium">From: {nodeData.sender || "Not set"}</div>
        <div className="font-medium">Subject: {nodeData.subject || "Not set"}</div>
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
