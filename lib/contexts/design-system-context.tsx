"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { type DesignTokens, defaultDesignTokens } from "@/lib/design-system"

interface DesignSystemContextType {
  tokens: DesignTokens
  updateTokens: (newTokens: Partial<DesignTokens>) => void
  resetToDefaults: () => void
}

const DesignSystemContext = createContext<DesignSystemContextType | undefined>(undefined)

export function DesignSystemProvider({ children }: { children: React.ReactNode }) {
  const [tokens, setTokens] = useState<DesignTokens>(defaultDesignTokens)

  useEffect(() => {
    // Load saved design tokens from localStorage
    const savedTokens = localStorage.getItem("designTokens")
    if (savedTokens) {
      try {
        const parsedTokens = JSON.parse(savedTokens)
        setTokens({ ...defaultDesignTokens, ...parsedTokens })
      } catch (error) {
        console.error("Failed to parse saved design tokens:", error)
      }
    }
  }, [])

  const updateTokens = (newTokens: Partial<DesignTokens>) => {
    const updatedTokens = { ...tokens, ...newTokens }
    setTokens(updatedTokens)
    localStorage.setItem("designTokens", JSON.stringify(updatedTokens))

    // Apply CSS custom properties for real-time updates
    applyTokensToCSS(updatedTokens)
  }

  const resetToDefaults = () => {
    setTokens(defaultDesignTokens)
    localStorage.removeItem("designTokens")
    applyTokensToCSS(defaultDesignTokens)
  }

  const applyTokensToCSS = (designTokens: DesignTokens) => {
    const root = document.documentElement

    // Apply background colors
    root.style.setProperty("--bg-primary", designTokens.colors.background.primary)
    root.style.setProperty("--bg-secondary", designTokens.colors.background.secondary)
    root.style.setProperty("--bg-tertiary", designTokens.colors.background.tertiary)

    // Apply text colors
    root.style.setProperty("--text-primary", designTokens.colors.text.primary)
    root.style.setProperty("--text-secondary", designTokens.colors.text.secondary)
    root.style.setProperty("--text-muted", designTokens.colors.text.muted)
    root.style.setProperty("--text-inverse", designTokens.colors.text.inverse)

    // Apply icon colors
    root.style.setProperty("--icon-primary", designTokens.colors.icons.primary)
    root.style.setProperty("--icon-secondary", designTokens.colors.icons.secondary)
    root.style.setProperty("--icon-muted", designTokens.colors.icons.muted)
    root.style.setProperty("--icon-accent", designTokens.colors.icons.accent)

    // Apply primary colors
    root.style.setProperty("--primary-50", designTokens.colors.primary[50])
    root.style.setProperty("--primary-100", designTokens.colors.primary[100])
    root.style.setProperty("--primary-500", designTokens.colors.primary[500])
    root.style.setProperty("--primary-600", designTokens.colors.primary[600])
    root.style.setProperty("--primary-700", designTokens.colors.primary[700])
    root.style.setProperty("--primary-900", designTokens.colors.primary[900])

    // Apply secondary colors
    root.style.setProperty("--secondary-50", designTokens.colors.secondary[50])
    root.style.setProperty("--secondary-100", designTokens.colors.secondary[100])
    root.style.setProperty("--secondary-500", designTokens.colors.secondary[500])
    root.style.setProperty("--secondary-600", designTokens.colors.secondary[600])
    root.style.setProperty("--secondary-700", designTokens.colors.secondary[700])

    // Apply to document body for immediate effect
    document.body.style.backgroundColor = designTokens.colors.background.primary
    document.body.style.color = designTokens.colors.text.primary
  }

  useEffect(() => {
    applyTokensToCSS(tokens)
  }, [tokens])

  return (
    <DesignSystemContext.Provider value={{ tokens, updateTokens, resetToDefaults }}>
      {children}
    </DesignSystemContext.Provider>
  )
}

export function useDesignSystem() {
  const context = useContext(DesignSystemContext)
  if (context === undefined) {
    throw new Error("useDesignSystem must be used within a DesignSystemProvider")
  }
  return context
}
