"use client"

import type React from "react"
import { useState, useCallback, useEffect, useMemo, useRef } from "react"
import {
ReactFlow, // Corrected: ReactFlow is a named export
Controls,
Background,
useNodesState,
useEdgesState,
addEdge,
type Node,
type Edge,
type Connection,
BackgroundVariant,
useReactFlow,
type IsValidConnection,
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
import type { ResponseNodeData, ChatNodeData, Rule } from "@/types/canvas"
import type { Persona } from "@/types/persona"
import { ConditionalEdge } from "@/components/canvas/conditional-edge"
import { useCanvasHistory } from "@/store/canvas-history"
import { useToast } from "@/hooks/use-toast"
import { useDnD } from "@/components/canvas/dnd-context"

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

const initialNodes: Node[] = []
const initialEdges: Edge[] = []

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

export function CanvasWorkflow({ // Corrected: Named export
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
const { screenToFlowPosition, deleteElements } = useReactFlow()

const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
const [selectedNode, setSelectedNode] = useState<Node | null>(null)

const canvasHistory = useCanvasHistory()
const { toast } = useToast()
const [copiedNodes, setCopiedNodes] = useState<{ nodes: Node[]; edges: Edge[] } | null>(null)

// State for properties panel resizing
const [propertiesPanelWidth, setPropertiesPanelWidth] = useState(256); // Default width for w-64 (256px)
const [isResizingPanel, setIsResizingPanel] = useState(false);
const initialMouseX = useRef(0);
const initialPanelWidth = useRef(0);
const MIN_PANEL_WIDTH = 256;
const MAX_PANEL_WIDTH = 600;
const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null); // Debounce timeout ref

const onConnect = useCallback(
  (params: Edge | Connection) => {
    const newEdge = {
      ...params,
      markerEnd: MarkerType.ArrowClosed,
    }
    return setEdges((eds) => addEdge(newEdge, eds))
  },
  [setEdges],
)

const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
  setSelectedNode(node)
}, [])

const onPaneClick = useCallback(() => {
  setSelectedNode(null)
}, [])

const onDeleteNode = useCallback(
  (nodeId: string) => {
    deleteElements({ nodes: [{ id: nodeId }] })
    setSelectedNode(null) // Close the panel after deleting
    toast({
      title: "Node Deleted",
      description: `Node ${nodeId} has been removed.`,
    })
  },
  [deleteElements, toast],
)

const fallbackEdges = useMemo(() => {
  const fbEdges: Edge[] = []

  nodes.forEach((node) => {
    if (node.type === "responseNode") {
      const data = node.data as unknown as ResponseNodeData
      if (data.hasFallback && data.fallbackNodeId) {
        const targetNode = nodes.find((n) => n.id === data.fallbackNodeId)
        if (targetNode) {
          fbEdges.push({
            id: `fallback-${node.id}-${data.fallbackNodeId}`,
            source: node.id,
            target: data.fallbackNodeId,
            type: "fallbackEdge",
            selectable: false,
            markerEnd: MarkerType.ArrowClosed,
          })
        }
      }
    }
  })

  return fbEdges
}, [nodes])

const conditionalEdges = useMemo(() => {
  const condEdges: Edge[] = []

  nodes.forEach((node) => {
    if (node.type === "responseNode") {
      const data = node.data as unknown as ResponseNodeData
      if (data.rules && data.rules.length > 0) {
        data.rules.forEach((rule) => {
          const targetNode = nodes.find((n) => n.id === rule.targetNodeId)
          if (targetNode) {
            condEdges.push({
              id: `conditional-${node.id}-${rule.id}`,
              source: node.id,
              target: rule.targetNodeId,
              type: "conditionalEdge",
              data: {
                condition: getConditionSummary(rule),
              },
              selectable: false,
              markerEnd: MarkerType.ArrowClosed,
            })
          }
        })
      }
    }
  })

  return condEdges
}, [nodes])

const getConditionSummary = (rule: Rule) => {
  const conditionLabels: Record<string, string> = {
    textLength: "Text Length",
    keywordMatch: "Keywords",
    timeTaken: "Time Taken",
  }

  const operatorLabels: Record<string, string> = {
    greaterThan: ">",
    lessThan: "<",
    equals: "=",
    contains: "contains",
    notContains: "!contains",
  }

  return `${conditionLabels[rule.conditionType]} ${operatorLabels[rule.operator]} ${rule.value}`
}

const allEdges = useMemo(() => {
  return [...edges, ...fallbackEdges, ...conditionalEdges]
}, [edges, fallbackEdges, conditionalEdges])

useEffect(() => {
  const nodeIds = new Set(nodes.map((n) => n.id))
  let nodesChanged = false

  const updatedNodes = nodes.map((node) => {
    if (node.type === "responseNode") {
      const data = node.data as unknown as ResponseNodeData
      if (data.hasFallback && data.fallbackNodeId && !nodeIds.has(data.fallbackNodeId)) {
        nodesChanged = true
        return {
          ...node,
          data: {
            ...data,
            fallbackNodeId: undefined,
            hasFallback: false,
          },
        }
      }
    }
    return node
  })

  if (nodesChanged) {
    setNodes(updatedNodes)
  }
}, [nodes, setNodes])

useEffect(() => {
  const personaIds = new Set(personas.map((p) => p.id))
  let nodesChanged = false

  const updatedNodes = nodes.map((node) => {
    if (node.type === "chatNode") {
      const data = node.data as unknown as ChatNodeData
      if (data.personaId && !personaIds.has(data.personaId)) {
        nodesChanged = true
        return {
          ...node,
          data: {
            ...data,
            personaId: undefined,
          },
        }
      }
    }
    return node
  })

  if (nodesChanged) {
    setNodes(updatedNodes)
  }
}, [personas, nodes, setNodes])

const isValidConnection: IsValidConnection = useCallback(
  (connection) => {
    const sourceNode = nodes.find((n) => n.id === connection.source)
    const targetNode = nodes.find((n) => n.id === connection.target)

    if (!sourceNode || !targetNode) {
      toast({
        title: "Invalid Connection",
        description: "Cannot connect to non-existent nodes",
        variant: "destructive",
      })
      return false
    }

    if (
      sourceNode.type === "emailPromptNode" &&
      !["responseNode", "chatNode", "customNode"].includes(targetNode.type || "")
    ) {
      toast({
        title: "Invalid Connection",
        description: "Email Prompt can only connect to Response, Chat, or Custom nodes",
        variant: "destructive",
      })
      return false
    }

    if (
      sourceNode.type === "voicePromptNode" &&
      !["responseNode", "chatNode", "customNode"].includes(targetNode.type || "")
    ) {
      toast({
        title: "Invalid Connection",
        description: "Voice Call can only connect to Response, Chat, or Custom nodes",
        variant: "destructive",
      })
      return false
    }

    return true
  },
  [nodes, toast],
)

const handleUndo = useCallback(() => {
  const previousState = canvasHistory.undo()
  if (previousState) {
    setNodes(previousState.nodes)
    setEdges(previousState.edges)
  }
}, [canvasHistory, setNodes, setEdges])

const handleRedo = useCallback(() => {
  const nextState = canvasHistory.redo()
  if (nextState) {
    setNodes(nextState.nodes)
    setEdges(nextState.edges)
  }
}, [canvasHistory, setNodes, setEdges])

const pushToHistory = useCallback(() => {
  canvasHistory.pushState(nodes, edges)
}, [canvasHistory, nodes, edges])

const handleCopy = useCallback(() => {
  const selectedNodes = nodes.filter((node) => node.selected)
  if (selectedNodes.length === 0) return

  const selectedNodeIds = new Set(selectedNodes.map((n) => n.id))
  const selectedEdges = edges.filter((edge) => selectedNodeIds.has(edge.source) && selectedNodeIds.has(edge.target))

  setCopiedNodes({ nodes: selectedNodes, edges: selectedEdges })
  toast({
    title: "Copied",
    description: `Copied ${selectedNodes.length} node(s)`,
  })
}, [nodes, edges, toast])

const handlePaste = useCallback(() => {
  if (!copiedNodes) return

  const nodeIdMap = new Map<string, string>()
  const newNodes = copiedNodes.nodes.map((node) => {
    const newId = `${node.type}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
    nodeIdMap.set(node.id, newId)
    return {
      ...node,
      id: newId,
      position: {
        x: node.position.x + 20,
        y: node.position.y + 20,
      },
      selected: true,
    }
  })

  const newEdges = copiedNodes.edges.map((edge) => ({
    ...edge,
    id: `${edge.type || "default"}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
    source: nodeIdMap.get(edge.source) || edge.source,
    target: nodeIdMap.get(edge.target) || edge.target,
    markerEnd: edge.markerEnd || MarkerType.ArrowClosed,
  }))

  setNodes((prevNodes) => [...prevNodes.map((node) => ({ ...node, selected: false })), ...newNodes])
  setEdges((prevEdges) => [...prevEdges, ...newEdges])

  toast({
    title: "Pasted",
    description: `Pasted ${newNodes.length} node(s)`,
  })
}, [copiedNodes, setNodes, setEdges, toast])

useEffect(() => {
  const handleKeyDown = (event: KeyboardEvent) => {
    if (event.ctrlKey || event.metaKey) {
      switch (event.key) {
        case "z":
          if (event.shiftKey) {
            event.preventDefault()
            handleRedo()
          } else {
            event.preventDefault()
            handleUndo()
          }
          break
        case "y":
          event.preventDefault()
          handleRedo()
          break
        case "c":
          event.preventDefault()
          handleCopy()
          break
        case "v":
          event.preventDefault()
          handlePaste()
          break
      }
    }
  }

  window.addEventListener("keydown", handleKeyDown)
  return () => window.removeEventListener("keydown", handleKeyDown)
}, [handleUndo, handleRedo, handleCopy, handlePaste])

const orphanedNodeIds = useMemo(() => {
  const connectedNodeIds = new Set<string>()

  allEdges.forEach((edge) => {
    connectedNodeIds.add(edge.source)
    connectedNodeIds.add(edge.target)
  })

  // Return only the IDs of nodes that are not connected
  return nodes.filter((node) => !connectedNodeIds.has(node.id) && nodes.length > 1).map((node) => node.id)
}, [nodes, allEdges])

// Add a new memo for connectedNodeIds
const connectedNodeIds = useMemo(() => {
  const ids = new Set<string>()
  allEdges.forEach((edge) => {
    ids.add(edge.source)
    ids.add(edge.target)
  })
  return ids
}, [allEdges])

const saveToLocalStorage = useCallback(() => {
  const flowData = {
    nodes,
    edges,
    simulationName,
    timestamp: new Date().toISOString(),
  }
  localStorage.setItem("hr-simulation-canvas", JSON.stringify(flowData))
  console.log("Canvas saved to localStorage")
}, [nodes, edges, simulationName])

const loadFromLocalStorage = useCallback(() => {
  const savedData = localStorage.getItem("hr-simulation-canvas")
  if (savedData) {
    try {
      const flowData = JSON.parse(savedData)
      setNodes(flowData.nodes || [])
      setEdges(flowData.edges || [])
      setSimulationName(flowData.simulationName || "Untitled Simulation")
      console.log("Canvas loaded from localStorage")
    } catch (error) {
      console.error("Error loading from localStorage:", error)
    }
  }
}, [setNodes, setEdges, setSimulationName])

const loadPersonas = useCallback(() => {
  const savedPersonas = localStorage.getItem("hr-simulation-personas")
  if (savedPersonas) {
    try {
      const personaData = JSON.parse(savedPersonas)
      onPersonasChange(personaData || [])
      console.log("Personas loaded from localStorage")
    } catch (error) {
      console.error("Error loading personas from localStorage:", error)
    }
  }
}, [onPersonasChange])

const savePersonas = useCallback(
  (newPersonas: Persona[]) => {
    onPersonasChange(newPersonas)
    localStorage.setItem("hr-simulation-personas", JSON.stringify(newPersonas))
    console.log("Personas saved to localStorage")
  },
  [onPersonasChange],
)

useEffect(() => {
  loadFromLocalStorage()
  loadPersonas()
}, [loadFromLocalStorage, loadPersonas])

useEffect(() => {
  const timeoutId = setTimeout(() => {
    if (nodes.length > 0 || edges.length > 0) {
      pushToHistory()
    }
  }, 500)

  return () => clearTimeout(timeoutId)
}, [nodes, edges, pushToHistory])

const onDragOver = useCallback((event: React.DragEvent) => {
  event.preventDefault()
  event.dataTransfer.dropEffect = "move"
}, [])

const [dndType, setDndType] = useDnD()

const onDrop = useCallback(
  (event: React.DragEvent) => {
    event.preventDefault()

    // Log the dataTransfer to debug
    console.log("DataTransfer types:", event.dataTransfer.types)

    // Try to get the type from dataTransfer first
    let type = event.dataTransfer.getData("application/reactflow")

    // If not found in dataTransfer, use the type from DnD context
    if ((!type || type === "") && dndType) {
      type = dndType
      // Reset the DnD context type after using it
      setDndType(null)
    }

    console.log("Node type used:", type)

    if (typeof type === "undefined" || !type) {
      console.warn("No node type found in dataTransfer or DnD context.")
      return
    }

    const reactFlowBounds = reactFlowWrapper.current?.getBoundingClientRect()
    if (!reactFlowBounds) {
      console.warn("Could not get ReactFlow bounds.")
      return
    }

    const position = screenToFlowPosition({
      x: event.clientX - (reactFlowBounds?.left || 0),
      y: event.clientY - (reactFlowBounds?.top || 0),
    })

    let newNode
    const baseId = `${type}-${Date.now()}`

    switch (type) {
      case "emailPromptNode":
        newNode = {
          id: baseId,
          type: "emailPromptNode",
          position,
          data: {
            label: "Email Prompt",
            sender: "",
            subject: "",
            body: "",
          },
        }
        break
      case "responseNode":
        newNode = {
          id: baseId,
          type: "responseNode",
          position,
          data: {
            label: "Response",
            timeLimit: 60,
            responseType: "text",
            hasFallback: false,
            rules: [],
          },
        }
        break
      case "voicePromptNode":
        newNode = {
          id: baseId,
          type: "voicePromptNode",
          position,
          data: {
            label: "Voice Call",
            script: "",
            voiceProfile: "",
          },
        }
        break
      case "chatNode":
        newNode = {
          id: baseId,
          type: "chatNode",
          position,
          data: {
            label: "Chat",
          },
        }
        break
      default:
        console.warn(`Attempted to add unknown node type on drop: ${type}`)
        return
    }

    setNodes((nds) => nds.concat(newNode))
  },
  [screenToFlowPosition, setNodes, dndType, setDndType],
)

// Handle properties panel resizing
const handleMouseDown = useCallback((e: React.MouseEvent) => {
  setIsResizingPanel(true);
  initialMouseX.current = e.clientX;
  initialPanelWidth.current = propertiesPanelWidth;
  e.preventDefault(); // Prevent text selection
}, [propertiesPanelWidth]);

const handleMouseMove = useCallback((e: MouseEvent) => {
  if (!isResizingPanel) return;
  const dx = initialMouseX.current - e.clientX; // Mouse moves left, width increases
  let newWidth = initialPanelWidth.current + dx;
  newWidth = Math.max(MIN_PANEL_WIDTH, Math.min(MAX_PANEL_WIDTH, newWidth));

  // Debounce the state update
  if (resizeTimeoutRef.current) {
    clearTimeout(resizeTimeoutRef.current);
  }
  resizeTimeoutRef.current = setTimeout(() => {
    setPropertiesPanelWidth(newWidth);
  }, 10); // Small debounce delay, e.g., 10ms
}, [isResizingPanel, MIN_PANEL_WIDTH, MAX_PANEL_WIDTH]); // Add MIN/MAX to dependencies

const handleMouseUp = useCallback(() => {
  setIsResizingPanel(false);
  if (resizeTimeoutRef.current) {
    clearTimeout(resizeTimeoutRef.current);
  }
}, []);

useEffect(() => {
  if (isResizingPanel) {
    window.addEventListener('mousemove', handleMouseMove);
    window.addEventListener('mouseup', handleMouseUp);
  } else {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
  }

  return () => {
    window.removeEventListener('mousemove', handleMouseMove);
    window.removeEventListener('mouseup', handleMouseUp);
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current);
    }
  };
}, [isResizingPanel, handleMouseMove, handleMouseUp]);


return (
  <div className="flex gap-0 h-[calc(100vh-70px)]">
    <CanvasSidebar personas={personas} onPersonasChange={savePersonas} />
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
        onDrop={onDrop}
        deleteKeyCode={["Backspace", "Delete"]}
        defaultEdgeOptions={{ // Apply default styling here
          markerEnd: MarkerType.ArrowClosed,
          style: {
            strokeWidth: 2, // Thicker
            stroke: '#4b5563', // Darker gray
          },
        }}
      >
        <Controls />
        <Background variant={BackgroundVariant.Dots} gap={12} size={1} />
      </ReactFlow>
    </div>
    {selectedNode && (
      <>
        {/* Resizer handle */}
        <div
          className="w-1 bg-gray-200 cursor-ew-resize hover:bg-gray-500 transition-colors duration-100"
          onMouseDown={handleMouseDown}
          aria-label="Resize properties panel"
        />
        <PropertiesPanel
          selectedNode={selectedNode}
          nodes={nodes}
          personas={personas}
          onClosePanel={() => setSelectedNode(null)}
          onDeleteNode={onDeleteNode}
          style={{ width: propertiesPanelWidth }} // Pass width as style
        />
      </>
    )}
  </div>
)
}
