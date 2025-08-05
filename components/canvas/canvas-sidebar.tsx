"use client"

import type React from "react"
import { useCallback, useState } from "react"
import { useReactFlow } from "@xyflow/react"
import { Mail, MessageSquare, Phone, MessageCircle, Search } from "lucide-react"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Input } from "@/components/ui/input"
import { PersonaManagerTab } from "@/components/canvas/persona-manager-tab"
import type { Persona } from "@/types/persona"

interface CanvasSidebarProps {
  personas: Persona[]
  onPersonasChange: (personas: Persona[]) => void
}

export function CanvasSidebar({ personas, onPersonasChange }: CanvasSidebarProps) {
  const { setNodes } = useReactFlow()
  const [searchTerm, setSearchTerm] = useState("")

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"
  }

  const addNode = useCallback(
    (nodeType: string) => {
      let newNode
      const baseId = `${nodeType}-${Date.now()}`
      const basePosition = { x: Math.random() * 300, y: Math.random() * 300 }

      switch (nodeType) {
        case "emailPromptNode":
          newNode = {
            id: baseId,
            type: "emailPromptNode",
            position: basePosition,
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
            position: basePosition,
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
            position: basePosition,
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
            position: basePosition,
            data: {
              label: "Chat",
            },
          }
          break
        default:
          console.warn(`Attempted to add unknown node type: ${nodeType}`)
          return
      }

      setNodes((nodes) => [...nodes, newNode])
    },
    [setNodes],
  )

  const allNodeTypes = [
    {
      type: "emailPromptNode",
      label: "Email Prompt",
      description: "System-initiated email interaction",
      icon: Mail,
      color: "bg-blue-50 border-blue-200 hover:bg-blue-100",
      category: "Behavior Prompts",
    },
    {
      type: "voicePromptNode",
      label: "Voice Call",
      description: "System-initiated voice call interaction",
      icon: Phone,
      color: "bg-purple-50 border-purple-200 hover:bg-purple-100",
      category: "Behavior Prompts",
    },
    {
      type: "chatNode",
      label: "Chat",
      description: "Persona-based chat interaction",
      icon: MessageCircle,
      color: "bg-orange-50 border-orange-200 hover:bg-orange-100",
      category: "Behavior Prompts",
    },
    {
      type: "responseNode",
      label: "Response",
      description: "Participant response point with branching logic",
      icon: MessageSquare,
      color: "bg-green-50 border-green-200 hover:bg-green-100",
      category: "Participant Response",
    },
  ]

  const filteredNodeTypes = allNodeTypes.filter(
    (nodeType) =>
      nodeType.label.toLowerCase().includes(searchTerm.toLowerCase()) ||
      nodeType.description.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const groupedNodeTypes = filteredNodeTypes.reduce(
    (acc, nodeType) => {
      ;(acc[nodeType.category] = acc[nodeType.category] || []).push(nodeType)
      return acc
    },
    {} as Record<string, typeof allNodeTypes>,
  )

  return (
    <div className="w-64 bg-white border border-gray-200 rounded-lg p-4 max-h-[calc(100vh-70px)] overflow-hidden flex flex-col">
      <Tabs defaultValue="nodes" className="flex flex-col flex-1">
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="nodes">Nodes</TabsTrigger>
          <TabsTrigger value="personas">Personas</TabsTrigger>
        </TabsList>

        <TabsContent value="nodes" className="flex-1 overflow-y-auto pr-2 -mr-2">
          {" "}
          {/* Added pr-2 -mr-2 for scrollbar */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" size={16} />
            <Input
              type="text"
              placeholder="Search nodes..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-md focus:outline-none focus:ring-1 focus:ring-blue-500"
            />
          </div>
          {Object.entries(groupedNodeTypes).map(([category, nodes]) => (
            <div key={category} className="mb-6">
              <h4 className="text-xs font-semibold text-gray-700 uppercase mb-2">{category}</h4>
              <div className="grid grid-cols-2 gap-2">
                {" "}
                {/* Grid layout */}
                {nodes.map((nodeType) => {
                  const Icon = nodeType.icon
                  return (
                    <div
                      key={nodeType.type}
                      className={`p-2 border rounded-md cursor-grab transition-colors flex flex-col items-center text-center ${nodeType.color}\`} {/* Compact styling */}
                      draggable
                      onDragStart={(event) => onDragStart(event, nodeType.type)}
                      onClick={() => addNode(nodeType.type)}
                      role="button"
                      tabIndex={0}
                      aria-label={\`Add ${nodeType.label} node`}
                    >
                      <Icon className="w-4 h-4 mb-1" />
                      <div className="text-xs font-medium text-gray-900">{nodeType.label}</div>
                      <div className="text-[10px] text-gray-500 leading-tight">{nodeType.description}</div>
                    </div>
                  )
                })}
              </div>
            </div>
          ))}
          {filteredNodeTypes.length === 0 && (
            <div className="text-center text-gray-500 py-8">
              <p>No nodes found.</p>
            </div>
          )}
          <div className="mt-4 text-xs text-gray-500">Drag nodes to canvas or click to add</div>
        </TabsContent>

        <TabsContent value="personas" className="flex-1 overflow-y-auto pr-2 -mr-2">
          {" "}
          {/* Added pr-2 -mr-2 for scrollbar */}
          <PersonaManagerTab personas={personas} onPersonasChange={onPersonasChange} />
        </TabsContent>
      </Tabs>
    </div>
  )
}
