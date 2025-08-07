"use client"

import type React from "react"
import { useRef } from "react"
import {
  ReactFlow,
  Controls,
  Background,
  BackgroundVariant,
  MarkerType,
} from "@xyflow/react"
import "@xyflow/react/dist/style.css"
import { EmailPromptNode } from "@/components/canvas/email-prompt-node"
import { ResponseNode } from "@/components/canvas/response-node"
import { VoicePromptNode } from "@/components/canvas/voice-prompt-node"
import { ChatNode } from "@/components/canvas/chat-node"
import { FallbackEdge } from "@/components/canvas/fallback-edge"
import { CanvasSidebar } from "@/components/canvas/canvas-sidebar"
import { PropertiesPanel } from "@/components/canvas/properties-panel"
import type { Persona } from "@/types/persona"
import { ConditionalEdge } from "@/components/canvas/conditional-edge"
import { useCanvasState } from "@/hooks/use-canvas-state"
import { useCanvasInteractions } from "@/hooks/use-canvas-interactions"
import { useCanvasSync } from "@/hooks/use-canvas-sync"
import { usePropertiesPanel } from "@/hooks/use-properties-panel"

const nodeTypes = {
  emailPromptNode: EmailPromptNode as any,
  responseNode: ResponseNode as any,
  voicePromptNode: VoicePromptNode as any,
  chatNode: ChatNode as any,
}

const edgeTypes = {
  fallbackEdge: FallbackEdge,
  conditionalEdge: ConditionalEdge,
}

interface CanvasWorkflowProps {
  personas: Persona[]
  onPersonasChange: (personas: Persona[]) => void
  simulationName: string
  setSimulationName: (name: string) => void
  onUndo: () => void
  onRedo: () => void
  canUndo: boolean
  canRedo: boolean
  onLoad: () => void
  onSave: () => void
}

export function CanvasWorkflow({
  personas,
  onPersonasChange,
  simulationName,
  setSimulationName,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onLoad,
  onSave,
}: CanvasWorkflowProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null)

  // Custom hooks for state management
  const {
    nodes,
    edges,
    selectedNode,
    setNodes,
    setEdges,
    setSelectedNode,
    onNodesChange,
    onEdgesChange,
    onConnect,
    allEdges,
    orphanedNodeIds,
    connectedNodeIds,
    isValidConnection,
  } = useCanvasState({ personas })

  // Custom hooks for interactions
  const {
    onNodeClick,
    onPaneClick,
    onDeleteNode,
    handleUndo,
    handleRedo,
    handleCopy,
    handlePaste,
    onDragOver,
    onDrop,
  } = useCanvasInteractions({
    nodes,
    edges,
    setNodes,
    setEdges,
    setSelectedNode,
  })

  // Custom hooks for local storage sync
  const { savePersonas } = useCanvasSync({
    nodes,
    edges,
    simulationName,
    personas,
    setNodes,
    setEdges,
    setSimulationName,
    onPersonasChange,
  })

  // Custom hooks for properties panel
  const { propertiesPanelWidth, handleMouseDown } = usePropertiesPanel()

  return (
    <div className="flex gap-0 h-[calc(100vh-70px)]">
      <CanvasSidebar personas={personas} setPersonas={savePersonas} />
      <div className="flex-1 overflow-hidden" ref={reactFlowWrapper}>
        <ReactFlow
          nodes={nodes.map((node) => ({
            ...node,
            data: {
              ...node.data,
              isOrphaned: orphanedNodeIds.includes(node.id),
              isConnected: connectedNodeIds.has(node.id),
            },
          }))}
          edges={allEdges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onConnect={onConnect}
          onNodeClick={onNodeClick}
          onPaneClick={onPaneClick}
          nodeTypes={nodeTypes}
          edgeTypes={edgeTypes}
          isValidConnection={isValidConnection}
          className="bg-gray-50"
          onDragOver={onDragOver}
          onDrop={(event) => onDrop(event, reactFlowWrapper as React.RefObject<HTMLDivElement>)}
          deleteKeyCode={["Backspace", "Delete"]}
          defaultEdgeOptions={{
            markerEnd: MarkerType.ArrowClosed,
            style: {
              strokeWidth: 2,
              stroke: "#4b5563",
            },
          }}
        >
          <Controls />
          <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
        </ReactFlow>
      </div>
      {selectedNode && (
        <>
          <div
            className="w-1 bg-gray-200 cursor-ew-resize hover:bg-gray-500 transition-colors duration-100 h-full"
            onMouseDown={handleMouseDown}
            aria-label="Resize properties panel"
          />
          <PropertiesPanel
            selectedNode={selectedNode}
            nodes={nodes}
            personas={personas}
            onClosePanel={() => setSelectedNode(null)}
            onDeleteNode={onDeleteNode}
            onCreateFallbackNode={(selectedNodeId, selectedNodePosition) => {
              const newNode = {
                id: `fallback-${Date.now()}`,
                type: "customNode",
                position: {
                  x: selectedNodePosition.x + 200,
                  y: selectedNodePosition.y + 100,
                },
                data: { label: "Fallback Node" },
              }
              setNodes((nodes) => [...nodes, newNode])
              setNodes((nodes) =>
                nodes.map((node) => 
                  node.id === selectedNodeId 
                    ? { ...node, data: { ...node.data, fallbackNodeId: newNode.id } }
                    : node
                )
              )
            }}
            style={{ width: propertiesPanelWidth, height: '100%' }}
          />
        </>
      )}
    </div>
  )
}
