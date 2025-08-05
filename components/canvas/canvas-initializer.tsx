"use client"

import { useEffect } from "react"
import { useReactFlow } from "@xyflow/react"

export function CanvasInitializer() {
  const { fitView } = useReactFlow()

  useEffect(() => {
    // Use requestAnimationFrame to ensure DOM is ready before fitting view
    requestAnimationFrame(() => {
      fitView()
    })
  }, [fitView])

  return null // This component doesn't render anything visible
}
