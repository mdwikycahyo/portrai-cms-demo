"use client"

import type React from "react"
import { useCallback } from "react"
import { useReactFlow } from "@xyflow/react"
import { Mail, UserRoundCog, Phone, MessageCircle, GripVertical } from "lucide-react"
import { useDnD } from "@/components/canvas/dnd-context"

type CanvasSidebarProps = {}

export function CanvasSidebar({}: CanvasSidebarProps) {
  const { setNodes } = useReactFlow()
  const [, setDndType] = useDnD()
  // Removed activeCategory state

  const onDragStart = (event: React.DragEvent, nodeType: string) => {
    event.dataTransfer.setData("application/reactflow", nodeType)
    event.dataTransfer.effectAllowed = "move"
    setDndType(nodeType)
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
      label: "Email",
      description: "System-initiated email interaction",
      icon: Mail,
      iconBgColor: "bg-blue-100",
      iconTextColor: "text-blue-600",
      category: "Behavior Prompts",
    },
    {
      type: "chatNode",
      label: "Chat",
      description: "Persona-based chat interaction",
      icon: MessageCircle,
      iconBgColor: "bg-orange-100",
      iconTextColor: "text-orange-600",
      category: "Behavior Prompts",
    },
    {
      type: "voicePromptNode",
      label: "Voice Call",
      description: "System-initiated voice call interaction",
      icon: Phone,
      iconBgColor: "bg-purple-100",
      iconTextColor: "text-purple-600",
      category: "Behavior Prompts",
    },
    {
      type: "responseNode",
      label: "Response",
      description: "Participant response point",
      icon: UserRoundCog,
      iconBgColor: "bg-green-100",
      iconTextColor: "text-green-600",
      category: "Participant Response",
    },
    // Removed customNode object
  ]

  const groupedNodeTypes = allNodeTypes.reduce(
    (acc, nodeType) => {
      ;(acc[nodeType.category] = acc[nodeType.category] || []).push(nodeType)
      return acc
    },
    {} as Record<string, typeof allNodeTypes>,
  )

  const categories = Object.keys(groupedNodeTypes)
  // Removed nodesInActiveCategory

  return (
    <div className="w-64 bg-white border-b border-gray-200 border-r border-gray-200 rounded-br-lg p-0 max-h-[calc(100vh-70px)] overflow-y-auto flex flex-col">
      {/* Single Column: Categories and Nodes */}
      {categories.map((category) => (
        <div key={category} className="mb-2">
          <div className="bg-gray-100 px-3 py-2">
            <h4 className="text-sm font-semibold text-gray-700 uppercase">{category}</h4>
          </div>
          <div className="flex flex-col gap-1 p-2">
            {groupedNodeTypes[category].map((nodeType) => {
              const Icon = nodeType.icon
              return (
                <div
                  key={nodeType.type}
                  className={`p-2 border rounded-md cursor-grab transition-colors flex items-center bg-white border-gray-200 hover:border-blue-500`}
                  draggable="true"
                  onDragStart={(event) => onDragStart(event, nodeType.type)}
                  onClick={() => addNode(nodeType.type)}
                  role="button"
                  tabIndex={0}
                  aria-label={`Add ${nodeType.label} node`}
                >
                  <GripVertical className="w-4 h-4 text-gray-400 mr-2 flex-shrink-0" />
                  <div
                    className={`w-10 h-10 rounded-md flex items-center justify-center flex-shrink-0 ${nodeType.iconBgColor}`}
                  >
                    <Icon className={`w-6 h-6 ${nodeType.iconTextColor}`} />
                  </div>
                  <div className="ml-2 flex flex-col">
                    <div className="text-sm font-medium text-gray-700">{nodeType.label}</div>
                    <div className="text-xs text-gray-500 leading-tight">{nodeType.description}</div>
                  </div>
                </div>
              )
            })}
            {groupedNodeTypes[category].length === 0 && (
              <div className="text-center text-gray-500 py-4 text-sm">
                <p>No nodes in this category.</p>
              </div>
            )}
          </div>
        </div>
      ))}
      <div className="mt-1 text-xs text-gray-500 px-3 pb-3">Drag nodes to canvas or click to add</div>
    </div>
  )
}
