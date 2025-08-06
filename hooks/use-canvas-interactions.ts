import { useState, useCallback, useEffect, useRef } from "react"
import { useReactFlow, type Node, type Edge, MarkerType } from "@xyflow/react"
import { useCanvasHistory } from "@/store/canvas-history"
import { useToast } from "@/hooks/use-toast"
import { useDnD } from "@/components/canvas/dnd-context"

interface UseCanvasInteractionsProps {
  nodes: Node[]
  edges: Edge[]
  setNodes: (nodes: Node[] | ((nodes: Node[]) => Node[])) => void
  setEdges: (edges: Edge[] | ((edges: Edge[]) => Edge[])) => void
  setSelectedNode: (node: Node | null) => void
}

export function useCanvasInteractions({
  nodes,
  edges,
  setNodes,
  setEdges,
  setSelectedNode,
}: UseCanvasInteractionsProps) {
  const { screenToFlowPosition, deleteElements } = useReactFlow()
  const canvasHistory = useCanvasHistory()
  const { toast } = useToast()
  const [dndType, setDndType] = useDnD()
  const [copiedNodes, setCopiedNodes] = useState<{ nodes: Node[]; edges: Edge[] } | null>(null)

  const onNodeClick = useCallback((_: React.MouseEvent, node: Node) => {
    setSelectedNode(node)
  }, [setSelectedNode])

  const onPaneClick = useCallback(() => {
    setSelectedNode(null)
  }, [setSelectedNode])

  const onDeleteNode = useCallback(
    (nodeId: string) => {
      deleteElements({ nodes: [{ id: nodeId }] })
      setSelectedNode(null)
      toast({
        title: "Node Deleted",
        description: `Node ${nodeId} has been removed.`,
      })
    },
    [deleteElements, setSelectedNode, toast],
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

  const onDragOver = useCallback((event: React.DragEvent) => {
    event.preventDefault()
    event.dataTransfer.dropEffect = "move"
  }, [])

  const onDrop = useCallback(
    (event: React.DragEvent, reactFlowWrapper: React.RefObject<HTMLDivElement>) => {
      event.preventDefault()

      let type = event.dataTransfer.getData("application/reactflow")

      if ((!type || type === "") && dndType) {
        type = dndType
        setDndType(null)
      }

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

  // Keyboard shortcuts
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

  // Push to history when nodes or edges change
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (nodes.length > 0 || edges.length > 0) {
        pushToHistory()
      }
    }, 500)

    return () => clearTimeout(timeoutId)
  }, [nodes, edges, pushToHistory])

  return {
    onNodeClick,
    onPaneClick,
    onDeleteNode,
    handleUndo,
    handleRedo,
    handleCopy,
    handlePaste,
    onDragOver,
    onDrop,
  }
}
