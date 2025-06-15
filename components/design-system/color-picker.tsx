"use client"

import type React from "react"

import { useState } from "react"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover"
import { useDesignSystem } from "./provider"

interface ColorPickerProps {
  label: string
  color: string
  onChange: (color: string) => void
  size?: "sm" | "md"
}

export function ColorPicker({ label, color, onChange, size = "md" }: ColorPickerProps) {
  const { tokens } = useDesignSystem()
  const [isOpen, setIsOpen] = useState(false)
  const [inputValue, setInputValue] = useState(color)

  const handleColorChange = (newColor: string) => {
    setInputValue(newColor)
    onChange(newColor)
  }

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newColor = e.target.value
    setInputValue(newColor)
    if (newColor.match(/^#[0-9A-F]{6}$/i)) {
      onChange(newColor)
    }
  }

  const presetColors = [
    "#ef4444",
    "#f97316",
    "#f59e0b",
    "#eab308",
    "#84cc16",
    "#22c55e",
    "#10b981",
    "#14b8a6",
    "#06b6d4",
    "#0ea5e9",
    "#3b82f6",
    "#6366f1",
    "#8b5cf6",
    "#a855f7",
    "#d946ef",
    "#ec4899",
    "#f43f5e",
    "#64748b",
  ]

  return (
    <div className="space-y-2">
      <Label 
        className={size === "sm" ? "text-xs" : "text-sm"}
        style={{ color: tokens.colors.text.primary }}
      >
        {label}
      </Label>
      <div className="flex items-center space-x-2">
        <Popover open={isOpen} onOpenChange={setIsOpen}>
          <PopoverTrigger asChild>
            <Button
              variant="primary-outline"
              className={`${size === "sm" ? "w-8 h-8" : "w-12 h-12"} p-0 border`}
              style={{ 
                backgroundColor: color,
                borderColor: tokens.colors.border.primary,
                borderWidth: '1px'
              }}
            >
              <span className="sr-only">Pick color</span>
            </Button>
          </PopoverTrigger>
          <PopoverContent 
            className="w-64"
            style={{ 
              backgroundColor: tokens.colors.background.secondary,
              borderColor: tokens.colors.border.secondary,
              borderWidth: '1px'
            }}
          >
            <div className="space-y-3">
              <div>
                <Label style={{ color: tokens.colors.text.primary }}>Color Picker</Label>
                <input
                  type="color"
                  value={color}
                  onChange={(e) => handleColorChange(e.target.value)}
                  className="w-full h-10 rounded cursor-pointer border"
                  style={{ borderColor: tokens.colors.border.muted }}
                />
              </div>

              <div>
                <Label style={{ color: tokens.colors.text.primary }}>Hex Value</Label>
                <Input 
                  value={inputValue} 
                  onChange={handleInputChange} 
                  placeholder="#000000" 
                  className="font-mono" 
                  style={{ 
                    backgroundColor: tokens.colors.background.tertiary,
                    borderColor: tokens.colors.border.primary,
                    color: tokens.colors.text.primary
                  }}
                />
              </div>

              <div>
                <Label style={{ color: tokens.colors.text.primary }}>Presets</Label>
                <div className="grid grid-cols-6 gap-2 mt-2">
                  {presetColors.map((presetColor) => (
                    <button
                      key={presetColor}
                      className="w-8 h-8 rounded transition-colors border"
                      style={{ 
                        backgroundColor: presetColor,
                        borderColor: tokens.colors.border.muted
                      }}
                      onClick={() => handleColorChange(presetColor)}
                    />
                  ))}
                </div>
              </div>
            </div>
          </PopoverContent>
        </Popover>

        {size !== "sm" && (
          <Input 
            value={inputValue} 
            onChange={handleInputChange} 
            className="font-mono text-xs" 
            placeholder="#000000"
            style={{ 
              backgroundColor: tokens.colors.background.tertiary,
              borderColor: tokens.colors.border.primary,
              color: tokens.colors.text.primary
            }}
          />
        )}
      </div>
    </div>
  )
}
