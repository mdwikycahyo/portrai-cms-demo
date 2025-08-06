"use client"

import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps, MarkerType } from "@xyflow/react"

interface ConditionalEdgeProps extends EdgeProps {
  data?: {
    condition?: string
  }
}

export function ConditionalEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
  data,
}: ConditionalEdgeProps) {
  const [edgePath, labelX, labelY] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
  })

  return (
    <>
      <BaseEdge
        path={edgePath}
        markerEnd={markerEnd || MarkerType.ArrowClosed}
        style={{
          ...style,
          strokeDasharray: "3,3",
          stroke: "#1d4ed8", // Darker blue
          strokeWidth: 3, // Thicker
        }}
      />
      {data?.condition && (
        <EdgeLabelRenderer>
          <div
            style={{
              position: "absolute",
              transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
              fontSize: 10,
              pointerEvents: "all",
            }}
            className="nodrag nopan bg-blue-100 text-blue-800 px-2 py-1 rounded text-xs font-medium"
          >
            {data.condition}
          </div>
        </EdgeLabelRenderer>
      )}
    </>
  )
}
