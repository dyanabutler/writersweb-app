"use client"

import { ReactNode } from "react"
import { DataLayerContext, useDataLayer } from "./data-layer"

export function DataLayerProvider({ children }: { children: ReactNode }) {
  const dataLayerState = useDataLayer()
  
  return (
    <DataLayerContext.Provider value={dataLayerState}>
      {children}
    </DataLayerContext.Provider>
  )
} 