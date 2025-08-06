"use client"

import { Handle, Position, type NodeProps, type Node } from "@xyflow/react"
import { useState } from "react"
import { AlertTriangle } from "lucide-react"

export interface CustomNodeData {
  label: string
}

interface CustomNodeProps extends NodeProps {
  isOrphaned?: boolean
}

export function CustomNode({ data, selected, isOrphaned }: CustomNodeProps) {
  const nodeData = data as unknown as CustomNodeData
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
      aria-label={`Custom node: ${nodeData.label || "Node"}`}
      aria-selected={selected ? true : false}
    >
      <Handle 
        type="target" 
        position={Position.Left} 
        // className="h-5 w-5 !bg-blue-500 z-10" 
        style={{ background: '#fff' }}
        aria-label="Input connection point" 
      />
      <div className="flex items-center gap-2">
        <div className="text-sm font-medium text-gray-900">{nodeData.label || "Node"}</div>
        {isOrphaned && (
          <AlertTriangle className="w-3 h-3 text-orange-500" aria-label="Orphaned node - not connected to workflow" />
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
