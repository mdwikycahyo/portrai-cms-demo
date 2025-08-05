"use client"

import { Handle, Position, type NodeProps } from "@xyflow/react"
import { useState } from "react"
import { MessageSquare, Clock, Type, Tag, List, AlertTriangle } from "lucide-react"
import type { ResponseNodeData } from "@/types/canvas"

interface ResponseNodeProps extends NodeProps<ResponseNodeData> {
  isOrphaned?: boolean
}

export function ResponseNode({ data, selected, isOrphaned }: ResponseNodeProps) {
  const [isHovered, setIsHovered] = useState(false)

  const getResponseTypeIcon = () => {
    switch (data.responseType) {
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

  const getResponseTypeSummary = () => {
    switch (data.responseType) {
      case "text":
        if (data.minLength || data.maxLength) {
          return `Text: ${data.minLength || 0}-${data.maxLength || "∞"} chars`
        }
        return "Text input"
      case "keywords":
        return `Keywords: ${data.keywords?.length || 0} required`
      case "multipleChoice":
        return `Options: ${data.options?.length || 0}`
      default:
        return "Text input"
    }
  }

  const hasValidationErrors = !data.timeLimit || data.timeLimit <= 0

  return (
    <div
      className={`px-4 py-3 shadow-md rounded-md bg-green-50 border-2 transition-all duration-200 min-w-[180px] ${
        selected ? "border-green-500 shadow-lg" : isHovered ? "border-green-400 shadow-lg" : "border-green-200"
      } ${data.hasFallback ? "border-dashed" : ""} ${isOrphaned ? "border-dashed border-orange-400 bg-orange-50" : ""} ${hasValidationErrors ? "border-red-400" : ""}`}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      role="button"
      tabIndex={0}
      aria-label={`Response node: ${data.label || "Response"}`}
      aria-selected={selected}
      aria-invalid={hasValidationErrors}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="w-16 !bg-green-500"
        aria-label="Input connection point"
      />
      <div className="flex items-center gap-2 mb-2">
        <MessageSquare className="w-4 h-4 text-green-600" />
        <div className="text-sm font-semibold text-green-900">Response</div>
        {data.hasFallback && <AlertTriangle className="w-3 h-3 text-red-500" title="Has fallback path" />}
        {isOrphaned && (
          <AlertTriangle className="w-3 h-3 text-orange-500" title="Orphaned node - not connected to workflow" />
        )}
        {hasValidationErrors && (
          <AlertTriangle className="w-3 h-3 text-red-500" title="Validation errors - check properties" />
        )}
      </div>
      <div className="space-y-1">
        <div className="flex items-center gap-1 text-xs text-green-700">
          <Clock className="w-3 h-3" />
          <span>{data.timeLimit || 0}s time limit</span>
        </div>
        <div className="flex items-center gap-1 text-xs text-green-700">
          {getResponseTypeIcon()}
          <span>{getResponseTypeSummary()}</span>
        </div>
        {data.rules && data.rules.length > 0 && (
          <div className="flex items-center gap-1 text-xs text-blue-700">
            <span>{data.rules.length} rule(s)</span>
          </div>
        )}
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="w-16 !bg-green-500"
        aria-label="Output connection point"
      />
    </div>
  )
}
