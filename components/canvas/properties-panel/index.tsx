"use client"

import type { Node } from "@xyflow/react"
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
  style?: React.CSSProperties
}

export function PropertiesPanel({ 
  selectedNode, 
  nodes, 
  personas, 
  onClosePanel, 
  onDeleteNode, 
  style 
}: PropertiesPanelProps) {
  const { updateNodeData } = useNodeUpdater()
  const { validateField, getFieldError } = useValidation()

  const createFallbackNode = (selectedNodeId: string, selectedNodePosition: { x: number; y: number }) => {
    const newNode = {
      id: `fallback-${Date.now()}`,
      type: "customNode",
      position: {
        x: selectedNodePosition.x + 200,
        y: selectedNodePosition.y + 100,
      },
      data: { label: "Fallback Node" },
    }
    // This would need to be passed down from the parent component that has access to setNodes
    // For now, we'll keep the same structure as before
    updateNodeData(selectedNodeId, { fallbackNodeId: newNode.id })
  }

  if (!selectedNode) {
    return (
      <div className="w-64 bg-white border border-gray-200 rounded-lg p-4">
        <h3 className="text-sm font-semibold text-gray-900 mb-4">Properties</h3>
        <div className="text-sm text-gray-500">Select a node to edit its properties</div>
      </div>
    )
  }

  const renderPropertiesByType = () => {
    const commonProps = {
      nodeId: selectedNode.id,
      nodeType: selectedNode.type || "",
      onUpdateNodeData: updateNodeData,
      validateField,
      getFieldError,
    }

    switch (selectedNode.type) {
      case "emailPromptNode":
        return (
          <EmailProperties
            {...commonProps}
            data={selectedNode.data as EmailPromptNodeData}
          />
        )
      case "voicePromptNode":
        return (
          <VoiceProperties
            {...commonProps}
            data={selectedNode.data as VoicePromptNodeData}
          />
        )
      case "chatNode":
        return (
          <ChatProperties
            {...commonProps}
            data={selectedNode.data as ChatNodeData}
            personas={personas}
          />
        )
      case "responseNode":
        return (
          <ResponseProperties
            {...commonProps}
            data={selectedNode.data as ResponseNodeData}
            nodes={nodes}
            onCreateFallbackNode={createFallbackNode}
            selectedNodePosition={selectedNode.position}
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
          <h3 className="text-base font-semibold text-gray-900">{selectedNode.data?.label || "Node Properties"}</h3>
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

        <div className="mt-6 pt-4 border-t border-gray-200">
          <div className="space-y-2">
            <div>
              <Label className="text-xs font-medium text-gray-700">Node ID</Label>
              <div className="mt-1 text-xs text-gray-500 font-mono">{selectedNode.id}</div>
            </div>
            <div>
              <Label className="text-xs font-medium text-gray-700">Type</Label>
              <div className="mt-1 text-xs text-gray-500">{selectedNode.type}</div>
            </div>
            <div>
              <Label className="text-xs font-medium text-gray-700">Position</Label>
              <div className="mt-1 text-xs text-gray-500">
                X: {Math.round(selectedNode.position.x)}, Y: {Math.round(selectedNode.position.y)}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
