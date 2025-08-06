"use client"

import React, { createContext, useContext, useState } from "react"

interface DnDContextType {
  type: string | null
  setType: (type: string | null) => void
}

const DnDContext = createContext<DnDContextType | undefined>(undefined)

export function DnDProvider({ children }: { children: React.ReactNode }) {
  const [type, setType] = useState<string | null>(null)

  return <DnDContext.Provider value={{ type, setType }}>{children}</DnDContext.Provider>
}

export function useDnD() {
  const context = useContext(DnDContext)
  if (context === undefined) {
    throw new Error("useDnD must be used within a DnDProvider")
  }
  return [context.type, context.setType] as const
}
