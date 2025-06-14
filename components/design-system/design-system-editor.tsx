"use client"

import type React from "react"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { useDesignSystem } from "@/lib/contexts/design-system-context"
import { ColorPicker } from "./color-picker"
import { DesignPreview } from "./design-preview"
import { Palette, RotateCcw, Download, Upload, Paintbrush } from "lucide-react"

export function DesignSystemEditor() {
  const { tokens, updateTokens, resetToDefaults } = useDesignSystem()
  const [activeTab, setActiveTab] = useState("foundation")

  const updateColor = (path: string, color: string) => {
    const pathArray = path.split(".")
    const newTokens = { ...tokens }

    // Navigate to the nested property and update it
    let current: any = newTokens
    for (let i = 0; i < pathArray.length - 1; i++) {
      current = current[pathArray[i]]
    }
    current[pathArray[pathArray.length - 1]] = color

    updateTokens(newTokens)
  }

  const exportDesignSystem = () => {
    const dataStr = JSON.stringify(tokens, null, 2)
    const dataUri = "data:application/json;charset=utf-8," + encodeURIComponent(dataStr)

    const exportFileDefaultName = "design-system.json"

    const linkElement = document.createElement("a")
    linkElement.setAttribute("href", dataUri)
    linkElement.setAttribute("download", exportFileDefaultName)
    linkElement.click()
  }

  const importDesignSystem = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      const reader = new FileReader()
      reader.onload = (e) => {
        try {
          const importedTokens = JSON.parse(e.target?.result as string)
          updateTokens(importedTokens)
        } catch (error) {
          console.error("Failed to import design system:", error)
        }
      }
      reader.readAsText(file)
    }
  }

  return (
    <div className="space-y-6">
      {/* Header Actions */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Palette className="w-6 h-6" style={{ color: tokens.colors.icons.accent }} />
          <h2 className="text-xl font-semibold" style={{ color: tokens.colors.text.primary }}>
            Customize Your Design System
          </h2>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={exportDesignSystem}>
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <div className="relative">
            <Input
              type="file"
              accept=".json"
              onChange={importDesignSystem}
              className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            />
            <Button variant="outline">
              <Upload className="w-4 h-4 mr-2" />
              Import
            </Button>
          </div>
          <Button variant="outline" onClick={resetToDefaults}>
            <RotateCcw className="w-4 h-4 mr-2" />
            Reset
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Design System Editor */}
        <div className="lg:col-span-2">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="foundation">Foundation</TabsTrigger>
              <TabsTrigger value="colors">Colors</TabsTrigger>
              <TabsTrigger value="status">Status</TabsTrigger>
              <TabsTrigger value="types">Types</TabsTrigger>
              <TabsTrigger value="spacing">Layout</TabsTrigger>
            </TabsList>

            <TabsContent value="foundation" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Paintbrush className="w-5 h-5" style={{ color: tokens.colors.icons.accent }} />
                    App Foundation
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">Background Colors</Label>
                    <div className="grid grid-cols-1 gap-4 mt-3">
                      <ColorPicker
                        label="Primary Background (Main app background)"
                        color={tokens.colors.background.primary}
                        onChange={(newColor) => updateColor("colors.background.primary", newColor)}
                      />
                      <ColorPicker
                        label="Secondary Background (Cards, panels)"
                        color={tokens.colors.background.secondary}
                        onChange={(newColor) => updateColor("colors.background.secondary", newColor)}
                      />
                      <ColorPicker
                        label="Tertiary Background (Subtle areas)"
                        color={tokens.colors.background.tertiary}
                        onChange={(newColor) => updateColor("colors.background.tertiary", newColor)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Text Colors</Label>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <ColorPicker
                        label="Primary Text"
                        color={tokens.colors.text.primary}
                        onChange={(newColor) => updateColor("colors.text.primary", newColor)}
                      />
                      <ColorPicker
                        label="Secondary Text"
                        color={tokens.colors.text.secondary}
                        onChange={(newColor) => updateColor("colors.text.secondary", newColor)}
                      />
                      <ColorPicker
                        label="Muted Text"
                        color={tokens.colors.text.muted}
                        onChange={(newColor) => updateColor("colors.text.muted", newColor)}
                      />
                      <ColorPicker
                        label="Inverse Text"
                        color={tokens.colors.text.inverse}
                        onChange={(newColor) => updateColor("colors.text.inverse", newColor)}
                      />
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Icon Colors</Label>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      <ColorPicker
                        label="Primary Icons"
                        color={tokens.colors.icons.primary}
                        onChange={(newColor) => updateColor("colors.icons.primary", newColor)}
                      />
                      <ColorPicker
                        label="Secondary Icons"
                        color={tokens.colors.icons.secondary}
                        onChange={(newColor) => updateColor("colors.icons.secondary", newColor)}
                      />
                      <ColorPicker
                        label="Muted Icons"
                        color={tokens.colors.icons.muted}
                        onChange={(newColor) => updateColor("colors.icons.muted", newColor)}
                      />
                      <ColorPicker
                        label="Accent Icons"
                        color={tokens.colors.icons.accent}
                        onChange={(newColor) => updateColor("colors.icons.accent", newColor)}
                      />
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="colors" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Brand Colors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-6">
                  <div>
                    <Label className="text-base font-medium">Primary Colors</Label>
                    <div className="grid grid-cols-3 gap-4 mt-3">
                      {Object.entries(tokens.colors.primary).map(([shade, color]) => (
                        <ColorPicker
                          key={shade}
                          label={`Primary ${shade}`}
                          color={color}
                          onChange={(newColor) => updateColor(`colors.primary.${shade}`, newColor)}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Secondary Colors</Label>
                    <div className="grid grid-cols-3 gap-4 mt-3">
                      {Object.entries(tokens.colors.secondary).map(([shade, color]) => (
                        <ColorPicker
                          key={shade}
                          label={`Secondary ${shade}`}
                          color={color}
                          onChange={(newColor) => updateColor(`colors.secondary.${shade}`, newColor)}
                        />
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="status" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Chapter Status Colors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(tokens.colors.status).map(([status, colors]) => (
                    <div key={status} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge style={{ backgroundColor: colors.bg, color: colors.text }}>{status}</Badge>
                        <span className="capitalize font-medium">{status}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ColorPicker
                          label="Background"
                          color={colors.bg}
                          onChange={(newColor) => updateColor(`colors.status.${status}.bg`, newColor)}
                          size="sm"
                        />
                        <ColorPicker
                          label="Text"
                          color={colors.text}
                          onChange={(newColor) => updateColor(`colors.status.${status}.text`, newColor)}
                          size="sm"
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Character Status Colors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(tokens.colors.characterStatus).map(([status, colors]) => (
                    <div key={status} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge style={{ backgroundColor: colors.bg, color: colors.text }}>{status}</Badge>
                        <span className="capitalize font-medium">{status}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ColorPicker
                          label="Background"
                          color={colors.bg}
                          onChange={(newColor) => updateColor(`colors.characterStatus.${status}.bg`, newColor)}
                          size="sm"
                        />
                        <ColorPicker
                          label="Text"
                          color={colors.text}
                          onChange={(newColor) => updateColor(`colors.characterStatus.${status}.text`, newColor)}
                          size="sm"
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="types" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Location Type Colors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(tokens.colors.locationType).map(([type, colors]) => (
                    <div key={type} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge style={{ backgroundColor: colors.bg, color: colors.text }}>{type}</Badge>
                        <span className="capitalize font-medium">{type}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ColorPicker
                          label="Background"
                          color={colors.bg}
                          onChange={(newColor) => updateColor(`colors.locationType.${type}.bg`, newColor)}
                          size="sm"
                        />
                        <ColorPicker
                          label="Text"
                          color={colors.text}
                          onChange={(newColor) => updateColor(`colors.locationType.${type}.text`, newColor)}
                          size="sm"
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Image Type Colors</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {Object.entries(tokens.colors.imageType).map(([type, colors]) => (
                    <div key={type} className="flex items-center justify-between p-3 border rounded-lg">
                      <div className="flex items-center space-x-3">
                        <Badge style={{ backgroundColor: colors.bg, color: colors.text }}>{type}</Badge>
                        <span className="capitalize font-medium">{type}</span>
                      </div>
                      <div className="flex items-center space-x-2">
                        <ColorPicker
                          label="Background"
                          color={colors.bg}
                          onChange={(newColor) => updateColor(`colors.imageType.${type}.bg`, newColor)}
                          size="sm"
                        />
                        <ColorPicker
                          label="Text"
                          color={colors.text}
                          onChange={(newColor) => updateColor(`colors.imageType.${type}.text`, newColor)}
                          size="sm"
                        />
                      </div>
                    </div>
                  ))}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="spacing" className="space-y-4">
              <Card>
                <CardHeader>
                  <CardTitle>Spacing & Layout</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <Label className="text-base font-medium">Spacing Scale</Label>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      {Object.entries(tokens.spacing).map(([size, value]) => (
                        <div key={size} className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="font-medium">{size}</span>
                          <Input
                            value={value}
                            onChange={(e) => updateColor(`spacing.${size}`, e.target.value)}
                            className="w-20 text-right"
                          />
                        </div>
                      ))}
                    </div>
                  </div>

                  <div>
                    <Label className="text-base font-medium">Border Radius</Label>
                    <div className="grid grid-cols-2 gap-4 mt-3">
                      {Object.entries(tokens.borderRadius).map(([size, value]) => (
                        <div key={size} className="flex items-center justify-between p-3 border rounded-lg">
                          <span className="font-medium">{size}</span>
                          <Input
                            value={value}
                            onChange={(e) => updateColor(`borderRadius.${size}`, e.target.value)}
                            className="w-20 text-right"
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>

        {/* Live Preview */}
        <div className="lg:col-span-1">
          <DesignPreview />
        </div>
      </div>
    </div>
  )
}
