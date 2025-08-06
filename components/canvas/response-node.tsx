"use client"

import { Handle, Position, type NodeProps } from "@xyflow/react"
import { useState } from "react"
import { UserRoundCog, Clock, Type, Tag, List, AlertTriangle } from "lucide-react"
import type { ResponseNodeData } from "@/types/canvas"

interface ResponseNodeProps extends NodeProps {
  isOrphaned?: boolean
  isConnected?: boolean // Add this line
}

export function ResponseNode({ data, selected, isOrphaned, isConnected }: ResponseNodeProps) {
  const nodeData = data as unknown as ResponseNodeData
  const [isHovered, setIsHovered] = useState(false)

  const getResponseTypeIcon = () => {
    switch (nodeData.responseType) {
      case "text":
        return <Type className="w-3 h-3" />
      case "keywords":
        return <Tag className="w-3 h-3" />
      case "multipleChoice":
        return <List className="w-3 h-3" />
      default:
        return <Type className="w-3 h-3" />
    }
  }

  const hasValidationErrors = !nodeData.timeLimit || nodeData.timeLimit <= 0

  return (
    <div
      className={`px-4 py-3 shadow-md rounded-md bg-white border-2 transition-all duration-200 min-w-[180px] ${
        selected
          ? "border-blue-500 shadow-lg"
          : (isHovered || isConnected)
            ? "border-blue-400 shadow-lg"
            : "border-gray-200"
      } ${nodeData.hasFallback ? "border-dashed" : ""} ${isOrphaned ? "border-dashed border-orange-400 bg-orange-50" : ""} ${hasValidationErrors ? "border-red-400" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`Response node: ${nodeData.label || "Response"}`}
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
        <div className="w-12 h-12 rounded-md flex items-center justify-center flex-shrink-0 bg-green-100">
          <UserRoundCog className="w-8 h-8 text-green-600" />
        </div>
        <div className="flex flex-col min-w-0">
          <div className="text-base font-semibold text-gray-900">Participant Response</div>
          <div className="text-sm font-medium text-gray-700 truncate">See detail</div>
        </div>
        {nodeData.hasFallback && (
          <AlertTriangle className="w-3 h-3 text-red-500 ml-auto" aria-label="Has fallback path" />
        )}
        {isOrphaned && (
          <AlertTriangle
            className="w-3 h-3 text-orange-500 ml-auto"
            aria-label="Orphaned node - not connected to workflow"
          />
        )}
        {hasValidationErrors && (
          <AlertTriangle className="w-3 h-3 text-red-500 ml-auto" aria-label="Validation errors - check properties" />
        )}
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
