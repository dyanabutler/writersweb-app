  "use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { useDesignSystem } from "@/components/design-system"
import { getStatusColor, getCharacterStatusColor, getLocationTypeColor } from "@/components/design-system"
import { BookOpen, Users, MapPin, ImageIcon, Palette, Settings } from "lucide-react"

export function DesignPreview() {
  const { tokens } = useDesignSystem()

  return (
    <Card className="sticky top-6" style={{ backgroundColor: tokens.colors.background.secondary }}>
      <CardHeader>
        <CardTitle className="flex items-center gap-2" style={{ color: tokens.colors.text.primary }}>
          <div className="w-4 h-4 rounded-full" style={{ backgroundColor: tokens.colors.primary[500] }} />
          Live Preview
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Foundation Preview */}
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2" style={{ color: tokens.colors.text.primary }}>
            <Palette className="w-4 h-4" style={{ color: tokens.colors.icons.accent }} />
            Foundation
          </h4>
          <div className="space-y-2">
            <div className="p-3 rounded-lg" style={{ backgroundColor: tokens.colors.background.primary }}>
              <span style={{ color: tokens.colors.text.primary }}>Base Background (Document & pages)</span>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: tokens.colors.background.secondary }}>
              <span style={{ color: tokens.colors.text.secondary }}>Surface Background (This card & panels)</span>
            </div>
            <div className="p-3 rounded-lg" style={{ backgroundColor: tokens.colors.background.tertiary }}>
              <span style={{ color: tokens.colors.text.muted }}>Subtle Background (Inner sections)</span>
            </div>
          </div>
        </div>

        {/* Icon Colors Preview */}
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2" style={{ color: tokens.colors.text.primary }}>
            <Settings className="w-4 h-4" style={{ color: tokens.colors.icons.accent }} />
            Icon Colors
          </h4>
          <div className="flex items-center gap-3">
            <BookOpen className="w-5 h-5" style={{ color: tokens.colors.icons.primary }} />
            <Users className="w-5 h-5" style={{ color: tokens.colors.icons.secondary }} />
            <MapPin className="w-5 h-5" style={{ color: tokens.colors.icons.muted }} />
            <ImageIcon className="w-5 h-5" style={{ color: tokens.colors.icons.accent }} />
          </div>
        </div>

        {/* Border Colors Preview */}
        <div>
          <h4 className="font-medium mb-2" style={{ color: tokens.colors.text.primary }}>
            Border Colors
          </h4>
          <div className="space-y-2">
            <div 
              className="p-3 rounded border-2"
              style={{ 
                borderColor: tokens.colors.border.primary,
                backgroundColor: tokens.colors.background.tertiary
              }}
            >
              <span style={{ color: tokens.colors.text.secondary }}>Primary Borders</span>
            </div>
            <div 
              className="p-2 rounded border"
              style={{ 
                borderColor: tokens.colors.border.secondary,
                backgroundColor: tokens.colors.background.tertiary
              }}
            >
              <span style={{ color: tokens.colors.text.secondary }}>Secondary Borders</span>
            </div>
            <div 
              className="p-2 rounded border"
              style={{ 
                borderColor: tokens.colors.border.muted,
                backgroundColor: tokens.colors.background.tertiary
              }}
            >
              <span style={{ color: tokens.colors.text.muted }}>Muted Borders</span>
            </div>
          </div>
        </div>

        {/* Chapter Status Preview */}
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2" style={{ color: tokens.colors.text.primary }}>
            <BookOpen className="w-4 h-4" style={{ color: tokens.colors.icons.primary }} />
            Chapter Status
          </h4>
          <div className="space-y-2">
            {Object.keys(tokens.colors.status).map((status) => {
              const colors = getStatusColor(status, tokens)
              return (
                <Badge key={status} style={{ backgroundColor: colors.bg, color: colors.text }} className="mr-2">
                  {status}
                </Badge>
              )
            })}
          </div>
        </div>

        {/* Character Status Preview */}
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2" style={{ color: tokens.colors.text.primary }}>
            <Users className="w-4 h-4" style={{ color: tokens.colors.icons.primary }} />
            Character Status
          </h4>
          <div className="space-y-2">
            {Object.keys(tokens.colors.characterStatus).map((status) => {
              const colors = getCharacterStatusColor(status, tokens)
              return (
                <Badge key={status} style={{ backgroundColor: colors.bg, color: colors.text }} className="mr-2">
                  {status}
                </Badge>
              )
            })}
          </div>
        </div>

        {/* Location Type Preview */}
        <div>
          <h4 className="font-medium mb-2 flex items-center gap-2" style={{ color: tokens.colors.text.primary }}>
            <MapPin className="w-4 h-4" style={{ color: tokens.colors.icons.primary }} />
            Location Types
          </h4>
          <div className="space-y-2">
            {Object.keys(tokens.colors.locationType).map((type) => {
              const colors = getLocationTypeColor(type, tokens)
              return (
                <Badge key={type} style={{ backgroundColor: colors.bg, color: colors.text }} className="mr-2">
                  {type}
                </Badge>
              )
            })}
          </div>
        </div>

        {/* Button Preview */}
        <div>
          <h4 className="font-medium mb-2" style={{ color: tokens.colors.text.primary }}>
            Buttons
          </h4>
          <div className="space-y-2">
            <Button
              style={{
                backgroundColor: tokens.colors.primary[600],
                borderColor: tokens.colors.primary[600],
                color: tokens.colors.text.inverse,
              }}
              className="w-full"
            >
              Primary Button
            </Button>
            <Button
              variant="primary-outline"
              style={{
                borderColor: tokens.colors.primary[600],
                color: tokens.colors.primary[600],
              }}
              className="w-full"
            >
              Secondary Button
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
