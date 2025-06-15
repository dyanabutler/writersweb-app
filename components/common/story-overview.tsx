"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Clock, FileText, MapPin } from "lucide-react"
import { useDataLayerContext } from "@/lib/content/data-layer"
import { useDesignSystem } from "@/lib/contexts/design-system-context"

interface StoryStats {
  chapterCount: number
  characterCount: number
  locationCount: number
  sceneCount: number
  totalWords: number
}

export function StoryOverview() {
  const { dataLayer } = useDataLayerContext()
  const { tokens } = useDesignSystem()
  const [stats, setStats] = useState<StoryStats>({
    chapterCount: 0,
    characterCount: 0,
    locationCount: 0,
    sceneCount: 0,
    totalWords: 0
  })
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStats() {
      try {
        setLoading(true)
        
        // Load all data
        const [chapters, characters, locations, scenes] = await Promise.all([
          dataLayer.getAllChapters(),
          dataLayer.getAllCharacters(), 
          dataLayer.getAllLocations(),
          dataLayer.getAllScenes()
        ])

        // Calculate total words from chapters
        const totalWords = chapters.reduce((sum, chapter) => sum + (chapter.wordCount || 0), 0)

        setStats({
          chapterCount: chapters.length,
          characterCount: characters.length,
          locationCount: locations.length,
          sceneCount: scenes.length,
          totalWords
        })
      } catch (error) {
        console.error('Error loading story stats:', error)
      } finally {
        setLoading(false)
      }
    }

    loadStats()
  }, [dataLayer])

  const statItems = [
    { 
      label: "Total Chapters", 
      value: stats.chapterCount, 
      icon: BookOpen, 
      color: tokens.colors.primary[600]
    },
    { 
      label: "Characters", 
      value: stats.characterCount, 
      icon: Users, 
      color: tokens.colors.secondary[600] 
    },
    { 
      label: "Locations", 
      value: stats.locationCount, 
      icon: MapPin, 
      color: tokens.colors.icons.accent 
    },
    { 
      label: "Scenes", 
      value: stats.sceneCount, 
      icon: Clock, 
      color: tokens.colors.neutral[600] 
    },
    { 
      label: "Total Words", 
      value: stats.totalWords.toLocaleString(), 
      icon: FileText, 
      color: tokens.colors.primary[500] 
    },
  ]

  if (loading) {
    return (
      <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
        <CardHeader>
          <CardTitle style={{ color: tokens.colors.text.primary }}>Story Overview</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[1, 2, 3, 4].map((i) => (
              <div 
                key={i} 
                className="text-center p-4 rounded-lg animate-pulse"
                style={{ backgroundColor: tokens.colors.background.tertiary }}
              >
                <div className="w-8 h-8 mx-auto mb-2 bg-gray-300 rounded"></div>
                <div className="h-6 bg-gray-300 rounded mb-2"></div>
                <div className="h-4 bg-gray-300 rounded"></div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
      <CardHeader>
        <CardTitle style={{ color: tokens.colors.text.primary }}>Story Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-5 gap-4">
          {statItems.map((stat) => (
            <div 
              key={stat.label} 
              className="text-center p-4 rounded-lg"
              style={{ backgroundColor: tokens.colors.background.tertiary }}
            >
              <stat.icon 
                className="w-8 h-8 mx-auto mb-2" 
                style={{ color: stat.color }}
              />
              <div 
                className="text-2xl font-bold"
                style={{ color: tokens.colors.text.primary }}
              >
                {stat.value}
              </div>
              <div 
                className="text-sm"
                style={{ color: tokens.colors.text.muted }}
              >
                {stat.label}
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
