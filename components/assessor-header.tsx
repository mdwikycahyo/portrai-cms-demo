"use client"

import { ChevronDown, LogOut, Undo, Redo, Upload, Save, ArrowLeft } from "lucide-react"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import type { Persona } from "@/types/persona"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

interface AssessorHeaderProps {
  personas?: Persona[]
  onPersonasChange?: (personas: Persona[]) => void
  simulationName?: string
  setSimulationName?: (name: string) => void
  onUndo?: () => void
  onRedo?: () => void
  canUndo?: boolean
  canRedo?: boolean
  onLoad?: () => void
  onSave?: () => void
  onBackToDashboard?: () => void
}

export function AssessorHeader({
  personas = [],
  onPersonasChange,
  simulationName,
  setSimulationName,
  onUndo,
  onRedo,
  canUndo,
  canRedo,
  onLoad,
  onSave,
  onBackToDashboard,
}: AssessorHeaderProps) {
  const handleLogout = () => {
    console.log("Logging out...")
    // Redirect to the specified URL
    window.location.href = "https://portrai-participant-demo.vercel.app/"
  }

  // Check if we are on the canvas page by checking for canvas-specific props
  const isCanvasPage =
    simulationName !== undefined ||
    setSimulationName !== undefined ||
    onUndo !== undefined ||
    onRedo !== undefined ||
    canUndo !== undefined ||
    canRedo !== undefined ||
    onLoad !== undefined ||
    onSave !== undefined ||
    onBackToDashboard !== undefined

  return (
    <div className={`px-6 py-4 flex justify-between items-center ${isCanvasPage ? 'border-b border-gray-200' : ''}`}>
      <div className="flex items-center gap-4">
        {isCanvasPage && (
          <>
            <Button variant="ghost" size="sm" onClick={onBackToDashboard} className="text-gray-600 hover:text-black hover:bg-gray-200 cursor-pointer">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <Separator orientation="vertical" className="h-6" />
            <Input
              value={simulationName || ""}
              onChange={(e) => setSimulationName?.(e.target.value)}
              className="text-lg font-semibold border-none shadow-none p-0 h-auto focus-visible:ring-0"
              placeholder="Simulation Name"
            />
          </>
        )}
      </div>
      <div className="flex items-center gap-2">
        {isCanvasPage ? (
          <>
            <Button variant="ghost" size="sm" onClick={onUndo} disabled={!canUndo}>
              <Undo className="w-4 h-4 mr-2" />
              Undo
            </Button>
            <Button variant="ghost" size="sm" onClick={onRedo} disabled={!canRedo}>
              <Redo className="w-4 h-4 mr-2" />
              Redo
            </Button>
            <Button variant="ghost" disabled size="sm" onClick={onLoad}>
              <Upload className="w-4 h-4 mr-2" />
              Load
            </Button>
            <Button size="sm" disabled onClick={onSave}>
              <Save className="w-4 h-4 mr-2" />
              Save
            </Button>
            <Separator orientation="vertical" className="h-6" />
          </>
        ) : (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="flex items-center gap-3 hover:bg-gray-50 p-2 rounded-lg transition-colors">
                <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                  <span className="text-white font-medium text-sm">DA</span>
                </div>
                <span className="font-medium text-gray-900">Dwiky Admin</span>
                <ChevronDown size={16} className="text-gray-500" />
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="w-48">
              <DropdownMenuItem onClick={handleLogout} className="text-red-600 focus:text-red-600">
                <LogOut size={16} className="mr-2" />
                Logout
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        )}
      </div>
    </div>
  )
}
