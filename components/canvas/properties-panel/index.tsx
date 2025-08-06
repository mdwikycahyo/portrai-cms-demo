"use client"

import type { Node } from "@xyflow/react"
import { useReactFlow } from "@xyflow/react"
import { Label } from "@/components/ui/label"
import { Button } from "@/components/ui/button"
import { Trash2, X } from 'lucide-react'
import type { EmailPromptNodeData, ResponseNodeData, VoicePromptNodeData, ChatNodeData } from "@/types/canvas"
import type { Persona } from "@/types/persona"
import { useNodeUpdater } from "./use-node-updater"
import { useValidation } from "./use-validation"
import { EmailProperties } from "./email-properties"
import { VoiceProperties } from "./voice-properties"
import { ChatProperties } from "./chat-properties"
import { ResponseProperties } from "./response-properties"

interface PropertiesPanelProps {
  selectedNode: Node | null
  nodes: Node[]
  personas: Persona[]
  onClosePanel: () => void
  onDeleteNode: (nodeId: string) => void
  onCreateFallbackNode: (selectedNodeId: string, selectedNodePosition: { x: number; y: number }) => void
  style?: React.CSSProperties
}

export function PropertiesPanel({ 
  selectedNode, 
  nodes, 
  personas, 
  onClosePanel, 
  onDeleteNode,
  onCreateFallbackNode,
  style 
}: PropertiesPanelProps) {
  const { updateNodeData } = useNodeUpdater()
  const { validateField, getFieldError } = useValidation()
  
  // Use the useReactFlow hook to get the latest node data
  const { getNode } = useReactFlow()

  if (!selectedNode) {
    return (
      <div className="w-64 bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Properties</h3>
        <div className="text-sm text-gray-500">Select a node to edit its properties</div>
      </div>
    )
  }

  const renderPropertiesByType = () => {
    // Get the latest node data from the canvas
    const latestNode = getNode(selectedNode.id) || selectedNode
    
    const commonProps = {
      nodeId: latestNode.id,
      nodeType: latestNode.type || "",
      onUpdateNodeData: updateNodeData,
      validateField,
      getFieldError,
    }

    // Ensure we're using the correct data type by merging with selectedNode.data
    // This preserves the type information while using the latest values
    const mergedData = latestNode.data ? { ...selectedNode.data, ...latestNode.data } : selectedNode.data

    // Helper function to safely cast data to the required type
    function safeDataCast<T>(data: unknown): T {
      // First cast to unknown, then to the target type as recommended by TypeScript
      return data as unknown as T;
    }

    switch (latestNode.type) {
      case "emailPromptNode":
        return (
          <EmailProperties
            {...commonProps}
            data={safeDataCast<EmailPromptNodeData>(mergedData)}
          />
        )
      case "voicePromptNode":
        return (
          <VoiceProperties
            {...commonProps}
            data={safeDataCast<VoicePromptNodeData>(mergedData)}
          />
        )
      case "chatNode":
        return (
          <ChatProperties
            {...commonProps}
            data={safeDataCast<ChatNodeData>(mergedData)}
            personas={personas}
          />
        )
      case "responseNode":
        return (
          <ResponseProperties
            {...commonProps}
            data={safeDataCast<ResponseNodeData>(mergedData)}
            nodes={nodes}
            onCreateFallbackNode={onCreateFallbackNode}
            selectedNodePosition={latestNode.position}
          />
        )
      default:
        return <div className="text-sm text-gray-500">Unknown node type</div>
    }
  }

  return (
    <div className="bg-white border-b border-gray-200 p-0 max-h-full overflow-y-auto" style={style}>
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex flex-col">
          <h3 className="text-base font-semibold text-gray-900">
            {(() => {
              const nodeData = getNode(selectedNode.id)?.data || selectedNode.data;
              return (nodeData && typeof nodeData.label === 'string') ? nodeData.label : "Node Properties";
            })()}
          </h3>
          <p className="text-xs text-gray-500">{selectedNode.type}</p>
        </div>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" onClick={() => onDeleteNode(selectedNode.id)} aria-label="Delete node">
            <Trash2 className="w-4 h-4 text-gray-600 hover:text-red-500" />
          </Button>
          <Button variant="ghost" size="icon" onClick={onClosePanel} aria-label="Close panel">
            <X className="w-4 h-4 text-gray-600 hover:text-gray-900" />
          </Button>
        </div>
      </div>

      <div className="p-2">
        {renderPropertiesByType()}
      </div>
    </div>
  )
}
