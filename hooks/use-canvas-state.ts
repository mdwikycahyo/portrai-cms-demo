import { useState, useCallback, useMemo, useEffect } from "react"
import {
  useNodesState,
  useEdgesState,
  addEdge,
  type Node,
  type Edge,
  type Connection,
  type IsValidConnection,
  MarkerType,
} from "@xyflow/react"
import type { ResponseNodeData, ChatNodeData, Rule } from "@/types/canvas"
import type { Persona } from "@/types/persona"
import { useToast } from "@/hooks/use-toast"

const initialNodes: Node[] = []
const initialEdges: Edge[] = []

interface UseCanvasStateProps {
  personas: Persona[]
}

export function useCanvasState({ personas }: UseCanvasStateProps) {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes)
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges)
  const [selectedNode, setSelectedNode] = useState<Node | null>(null)
  const { toast } = useToast()

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

  const getConditionSummary = useCallback((rule: Rule) => {
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
  }, [])

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
  }, [nodes, getConditionSummary])

  const allEdges = useMemo(() => {
    return [...edges, ...fallbackEdges, ...conditionalEdges]
  }, [edges, fallbackEdges, conditionalEdges])

  const orphanedNodeIds = useMemo(() => {
    const connectedNodeIds = new Set<string>()

    allEdges.forEach((edge) => {
      connectedNodeIds.add(edge.source)
      connectedNodeIds.add(edge.target)
    })

    return nodes.filter((node) => !connectedNodeIds.has(node.id) && nodes.length > 1).map((node) => node.id)
  }, [nodes, allEdges])

  const connectedNodeIds = useMemo(() => {
    const ids = new Set<string>()
    allEdges.forEach((edge) => {
      ids.add(edge.source)
      ids.add(edge.target)
    })
    return ids
  }, [allEdges])

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

  // Clean up fallback references when nodes are deleted
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

  // Clean up persona references when personas are deleted
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

  // Close properties panel if selected node is deleted
  useEffect(() => {
    if (selectedNode) {
      const nodeExists = nodes.some((node) => node.id === selectedNode.id)
      if (!nodeExists) {
        setSelectedNode(null)
      }
    }
  }, [nodes, selectedNode])

  return {
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
  }
}
