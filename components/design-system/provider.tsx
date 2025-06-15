"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { type DesignTokens, defaultDesignTokens } from "./tokens"

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

    // Apply custom design system variables
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

    // Convert colors to HSL format for UI components
    const hexToHsl = (hex: string) => {
      const r = parseInt(hex.slice(1, 3), 16) / 255
      const g = parseInt(hex.slice(3, 5), 16) / 255
      const b = parseInt(hex.slice(5, 7), 16) / 255

      const max = Math.max(r, g, b)
      const min = Math.min(r, g, b)
      let h = 0, s = 0, l = (max + min) / 2

      if (max !== min) {
        const d = max - min
        s = l > 0.5 ? d / (2 - max - min) : d / (max + min)

        switch (max) {
          case r: h = (g - b) / d + (g < b ? 6 : 0); break
          case g: h = (b - r) / d + 2; break
          case b: h = (r - g) / d + 4; break
        }
        h /= 6
      }

      return `${Math.round(h * 360)} ${Math.round(s * 100)}% ${Math.round(l * 100)}%`
    }

    // Apply UI component CSS variables (HSL format)
    root.style.setProperty("--background", hexToHsl(designTokens.colors.background.primary))
    root.style.setProperty("--foreground", hexToHsl(designTokens.colors.text.primary))
    root.style.setProperty("--card", hexToHsl(designTokens.colors.background.secondary))
    root.style.setProperty("--card-foreground", hexToHsl(designTokens.colors.text.primary))
    root.style.setProperty("--popover", hexToHsl(designTokens.colors.background.secondary))
    root.style.setProperty("--popover-foreground", hexToHsl(designTokens.colors.text.primary))
    root.style.setProperty("--primary", hexToHsl(designTokens.colors.primary[500]))
    root.style.setProperty("--primary-foreground", hexToHsl(designTokens.colors.text.inverse))
    root.style.setProperty("--secondary", hexToHsl(designTokens.colors.secondary[500]))
    root.style.setProperty("--secondary-foreground", hexToHsl(designTokens.colors.text.primary))
    root.style.setProperty("--muted", hexToHsl(designTokens.colors.background.tertiary))
    root.style.setProperty("--muted-foreground", hexToHsl(designTokens.colors.text.muted))
    root.style.setProperty("--accent", hexToHsl(designTokens.colors.primary[500]))
    root.style.setProperty("--accent-foreground", hexToHsl(designTokens.colors.text.primary))
    root.style.setProperty("--destructive", hexToHsl("#ef4444"))
    root.style.setProperty("--destructive-foreground", hexToHsl(designTokens.colors.text.primary))
    root.style.setProperty("--border", hexToHsl(designTokens.colors.neutral[300]))
    root.style.setProperty("--input", hexToHsl(designTokens.colors.background.tertiary))
    root.style.setProperty("--ring", hexToHsl(designTokens.colors.primary[500]))
    
    // Additional UI component variables
    root.style.setProperty("--ring-offset-background", hexToHsl(designTokens.colors.background.primary))
    root.style.setProperty("--ring-offset-color", hexToHsl(designTokens.colors.background.primary))
    root.style.setProperty("--chart-1", hexToHsl(designTokens.colors.primary[500]))
    root.style.setProperty("--chart-2", hexToHsl(designTokens.colors.secondary[500]))
    root.style.setProperty("--chart-3", hexToHsl(designTokens.colors.primary[600]))
    root.style.setProperty("--chart-4", hexToHsl(designTokens.colors.secondary[600]))
    root.style.setProperty("--chart-5", hexToHsl(designTokens.colors.primary[700]))
    
    // Sidebar and navigation variables
    root.style.setProperty("--sidebar-background", hexToHsl(designTokens.colors.background.secondary))
    root.style.setProperty("--sidebar-foreground", hexToHsl(designTokens.colors.text.primary))
    root.style.setProperty("--sidebar-primary", hexToHsl(designTokens.colors.primary[500]))
    root.style.setProperty("--sidebar-primary-foreground", hexToHsl(designTokens.colors.text.inverse))
    root.style.setProperty("--sidebar-accent", hexToHsl(designTokens.colors.background.tertiary))
    root.style.setProperty("--sidebar-accent-foreground", hexToHsl(designTokens.colors.text.primary))
    root.style.setProperty("--sidebar-border", hexToHsl(designTokens.colors.neutral[300]))
    root.style.setProperty("--sidebar-ring", hexToHsl(designTokens.colors.primary[500]))

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