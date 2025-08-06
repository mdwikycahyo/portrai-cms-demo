import { useCallback } from "react"
import { useReactFlow } from "@xyflow/react"

export const useNodeUpdater = () => {
  const { setNodes } = useReactFlow()

  const updateNodeData = useCallback((nodeId: string, newData: any) => {
    setNodes((nodes) =>
      nodes.map((node) => (node.id === nodeId ? { ...node, data: { ...node.data, ...newData } } : node)),
    )
  }, [setNodes])

  return { updateNodeData }
}
