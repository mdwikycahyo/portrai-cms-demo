"use client"

import { useState, useCallback } from "react"
import { ReactFlowProvider } from "@xyflow/react"
import { AssessorHeader } from "@/components/assessor-header"
import { CanvasWorkflow } from "@/components/canvas/canvas-workflow"
import { CanvasInitializer } from "@/components/canvas/canvas-initializer"
import { useCanvasHistory } from "@/store/canvas-history"
import type { Persona } from "@/types/persona"
import { DnDProvider } from "@/components/canvas/dnd-context"

export default function CanvasPage() {
  const [simulationName, setSimulationName] = useState("Untitled Simulation")
  const [personas, setPersonas] = useState<Persona[]>([])

  const canvasHistory = useCanvasHistory()

  const handleBackToDashboard = useCallback(() => {
    window.location.href = "/"
  }, [])

  // These functions are now passed down to CanvasWorkflow
  const handleUndo = useCallback(() => {
    // Logic handled by CanvasWorkflow, but we need to trigger history update
    // This will be handled by the useCanvasHistory hook directly in CanvasWorkflow
  }, [])

  const handleRedo = useCallback(() => {
    // Logic handled by CanvasWorkflow
  }, [])

  const loadFromLocalStorage = useCallback(() => {
    // Logic handled by CanvasWorkflow
  }, [])

  const saveToLocalStorage = useCallback(() => {
    // Logic handled by CanvasWorkflow
  }, [])

  const savePersonas = useCallback((newPersonas: Persona[]) => {
    setPersonas(newPersonas)
    localStorage.setItem("hr-simulation-personas", JSON.stringify(newPersonas))
  }, [])

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-gray-50">
        <AssessorHeader
          personas={personas}
          onPersonasChange={savePersonas}
          simulationName={simulationName}
          setSimulationName={setSimulationName}
          onUndo={canvasHistory.undo} // Directly use history functions
          onRedo={canvasHistory.redo} // Directly use history functions
          canUndo={canvasHistory.canUndo()}
          canRedo={canvasHistory.canRedo()}
          onLoad={() => {
            // This will trigger the load in CanvasWorkflow
            // For now, we'll let CanvasWorkflow handle its own loading on mount
            // or we can add a specific prop to trigger it.
            // For simplicity, I'll remove direct load/save calls from header for now
            // as CanvasWorkflow handles it internally on mount/changes.
          }}
          onSave={() => {
            // This will trigger the save in CanvasWorkflow
          }}
          onBackToDashboard={handleBackToDashboard}
        />
        <div className="">
          <DnDProvider>
            <ReactFlowProvider>
              <CanvasInitializer />
              <CanvasWorkflow
                personas={personas}
                onPersonasChange={savePersonas}
                simulationName={simulationName}
                setSimulationName={setSimulationName}
                onUndo={canvasHistory.undo}
                onRedo={canvasHistory.redo}
                canUndo={canvasHistory.canUndo()}
                canRedo={canvasHistory.canRedo()}
                onLoad={() => {
                  // This is a placeholder. Actual load logic is inside CanvasWorkflow's useEffect.
                  // If a manual trigger is needed, we'd add a state to CanvasWorkflow.
                }}
                onSave={() => {
                  // This is a placeholder. Actual save logic is inside CanvasWorkflow's useEffect.
                  // If a manual trigger is needed, we'd add a state to CanvasWorkflow.
                }}
              />
            </ReactFlowProvider>
          </DnDProvider>
        </div>
      </div>
    </div>
  )
}
