import { useCallback, useState, useEffect } from "react"
import { useReactFlow } from "@xyflow/react"

export const useNodeUpdater = () => {
  const { setNodes, getNode } = useReactFlow()
  const [lastUpdatedNode, setLastUpdatedNode] = useState<{ id: string, data: any } | null>(null)

  const updateNodeData = useCallback((nodeId: string, newData: any) => {
    // Update the nodes in the canvas
    setNodes((nodes) =>
      nodes.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node)),
    )
    
    // Store the last updated node and data for reactive updates
    setLastUpdatedNode({ id: nodeId, data: newData })
  }, [setNodes])

  // This effect ensures that components using this hook will re-render
  // when the node data changes, even if they're using a stale reference
  useEffect(() => {
    if (lastUpdatedNode) {
      // This is just to trigger a re-render in components using this hook
      // The actual data update is already done in updateNodeData
      const currentNode = getNode(lastUpdatedNode.id)
      if (currentNode) {
        // We don't need to do anything here, the effect dependency is enough
        // to trigger re-renders in components using this hook
      }
    }
  }, [lastUpdatedNode, getNode])

  return { updateNodeData }
}
