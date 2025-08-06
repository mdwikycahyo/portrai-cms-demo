import { useState, useCallback, useRef, useEffect } from "react"

const MIN_PANEL_WIDTH = 256
const MAX_PANEL_WIDTH = 600

export function usePropertiesPanel() {
  const [propertiesPanelWidth, setPropertiesPanelWidth] = useState(256)
  const [isResizingPanel, setIsResizingPanel] = useState(false)
  const initialMouseX = useRef(0)
  const initialPanelWidth = useRef(0)
  const resizeTimeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      setIsResizingPanel(true)
      initialMouseX.current = e.clientX
      initialPanelWidth.current = propertiesPanelWidth
      e.preventDefault()
    },
    [propertiesPanelWidth],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!isResizingPanel) return
      const dx = initialMouseX.current - e.clientX
      let newWidth = initialPanelWidth.current + dx
      newWidth = Math.max(MIN_PANEL_WIDTH, Math.min(MAX_PANEL_WIDTH, newWidth))

      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
      resizeTimeoutRef.current = setTimeout(() => {
        setPropertiesPanelWidth(newWidth)
      }, 10)
    },
    [isResizingPanel],
  )

  const handleMouseUp = useCallback(() => {
    setIsResizingPanel(false)
    if (resizeTimeoutRef.current) {
      clearTimeout(resizeTimeoutRef.current)
    }
  }, [])

  useEffect(() => {
    if (isResizingPanel) {
      window.addEventListener("mousemove", handleMouseMove)
      window.addEventListener("mouseup", handleMouseUp)
    } else {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
    }

    return () => {
      window.removeEventListener("mousemove", handleMouseMove)
      window.removeEventListener("mouseup", handleMouseUp)
      if (resizeTimeoutRef.current) {
        clearTimeout(resizeTimeoutRef.current)
      }
    }
  }, [isResizingPanel, handleMouseMove, handleMouseUp])

  return {
    propertiesPanelWidth,
    handleMouseDown,
  }
}
