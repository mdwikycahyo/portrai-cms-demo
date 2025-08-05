"use client"

import { Handle, Position, type NodeProps } from "@xyflow/react"
import { useState } from "react"
import { AlertTriangle } from "lucide-react"

interface CustomNodeData {
  label: string
}

interface CustomNodeProps extends NodeProps<CustomNodeData> {
  isOrphaned?: boolean
}

export function CustomNode({ data, selected, isOrphaned }: CustomNodeProps) {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <div
      className={`px-4 py-2 shadow-md rounded-md bg-white border-2 transition-all duration-200 ${
        selected ? "border-blue-500 shadow-lg" : isHovered ? "border-gray-400 shadow-lg" : "border-gray-200"
      } ${isOrphaned ? "border-dashed border-orange-400 bg-orange-50" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`Custom node: ${data.label || "Node"}`}
      aria-selected={selected}
    >
      <Handle type="target" position={Position.Top} className="w-16 !bg-teal-500" aria-label="Input connection point" />
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium text-gray-900">{data.label || "Node"}</div>
        {isOrphaned && (
          <AlertTriangle className="w-3 h-3 text-orange-500" title="Orphaned node - not connected to workflow" />
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-16 !bg-teal-500"
        aria-label="Output connection point"
      />
    </div>
  )
}
