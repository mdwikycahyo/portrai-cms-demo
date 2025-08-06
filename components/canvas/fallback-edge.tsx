"use client"

import { BaseEdge, EdgeLabelRenderer, getBezierPath, type EdgeProps, MarkerType } from "@xyflow/react"

export function FallbackEdge({
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  style = {},
  markerEnd,
}: EdgeProps) {
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
          strokeDasharray: "5,5",
          stroke: "#b91c1c", // Darker red
          strokeWidth: 3, // Thicker
        }}
      />
      <EdgeLabelRenderer>
        <div
          style={{
            position: "absolute",
            transform: `translate(-50%, -50%) translate(${labelX}px,${labelY}px)`,
            fontSize: 10,
            pointerEvents: "all",
          }}
          className="nodrag nopan bg-red-100 text-red-800 px-2 py-1 rounded text-xs font-medium"
        >
          Fallback
        </div>
      </EdgeLabelRenderer>
    </>
  )
}
