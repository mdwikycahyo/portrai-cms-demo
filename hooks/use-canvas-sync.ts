import { useCallback, useEffect } from "react"
import type { Node, Edge } from "@xyflow/react"
import type { Persona } from "@/types/persona"

interface UseCanvasSyncProps {
  nodes: Node[]
  edges: Edge[]
  simulationName: string
  personas: Persona[]
  setNodes: (nodes: Node[]) => void
  setEdges: (edges: Edge[]) => void
  setSimulationName: (name: string) => void
  onPersonasChange: (personas: Persona[]) => void
}

export function useCanvasSync({
  nodes,
  edges,
  simulationName,
  personas,
  setNodes,
  setEdges,
  setSimulationName,
  onPersonasChange,
}: UseCanvasSyncProps) {
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

  // Load data on mount
  useEffect(() => {
    loadFromLocalStorage()
    loadPersonas()
  }, [loadFromLocalStorage, loadPersonas])

  return {
    saveToLocalStorage,
    loadFromLocalStorage,
    savePersonas,
    loadPersonas,
  }
}
