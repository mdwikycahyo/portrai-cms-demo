import { create } from "zustand"
import type { Node, Edge } from "@xyflow/react"

interface CanvasState {
  nodes: Node[]
  edges: Edge[]
}

interface CanvasHistoryStore {
  history: CanvasState[]
  currentIndex: number
  maxHistorySize: number
  pushState: (nodes: Node[], edges: Edge[]) => void
  undo: () => CanvasState | null
  redo: () => CanvasState | null
  canUndo: () => boolean
  canRedo: () => boolean
  clear: () => void
}

export const useCanvasHistory = create<CanvasHistoryStore>((set, get) => ({
  history: [],
  currentIndex: -1,
  maxHistorySize: 50,

  pushState: (nodes: Node[], edges: Edge[]) => {
    const { history, currentIndex, maxHistorySize } = get()

    // Remove any future history if we're not at the end
    const newHistory = history.slice(0, currentIndex + 1)

    // Add new state
    newHistory.push({ nodes: JSON.parse(JSON.stringify(nodes)), edges: JSON.parse(JSON.stringify(edges)) })

    // Limit history size
    if (newHistory.length > maxHistorySize) {
      newHistory.shift()
    }

    set({
      history: newHistory,
      currentIndex: newHistory.length - 1,
    })
  },

  undo: () => {
    const { history, currentIndex } = get()
    if (currentIndex > 0) {
      const newIndex = currentIndex - 1
      set({ currentIndex: newIndex })
      return history[newIndex]
    }
    return null
  },

  redo: () => {
    const { history, currentIndex } = get()
    if (currentIndex < history.length - 1) {
      const newIndex = currentIndex + 1
      set({ currentIndex: newIndex })
      return history[newIndex]
    }
    return null
  },

  canUndo: () => {
    const { currentIndex } = get()
    return currentIndex > 0
  },

  canRedo: () => {
    const { history, currentIndex } = get()
    return currentIndex < history.length - 1
  },

  clear: () => {
    set({ history: [], currentIndex: -1 })
  },
}))
