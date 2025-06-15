"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { useDataLayerContext } from "@/lib/content/data-layer"
import { useDesignSystem } from "@/components/design-system"
import { getStatusColor } from "@/components/design-system"
import type { Chapter, Scene } from "@/lib/types"

interface TimelineEvent {
  id: string
  title: string
  chapter: string
  timeline?: string
  location?: string
  characters: string[]
  status: string
  type: 'chapter' | 'scene'
  order: number
}

export function TimelineView() {
  const { dataLayer } = useDataLayerContext()
  const { tokens } = useDesignSystem()
  const [timelineEvents, setTimelineEvents] = useState<TimelineEvent[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadTimelineData = async () => {
      try {
        setLoading(true)
        
        // Load chapters and scenes
        const [chapters, scenes] = await Promise.all([
          dataLayer.getAllChapters(),
          dataLayer.getAllScenes()
        ])

        // Create timeline events from chapters and scenes
        const events: TimelineEvent[] = []

                 // Add chapters to timeline
         chapters.forEach((chapter: Chapter) => {
           events.push({
             id: `chapter-${chapter.slug}`,
             title: chapter.title,
             chapter: `Chapter ${chapter.chapterNumber}`,
             timeline: chapter.timeline,
             location: chapter.location,
             characters: chapter.characters || [],
             status: chapter.status,
             type: 'chapter',
             order: chapter.chapterNumber * 1000 // Multiply by 1000 to leave room for scenes
           })
         })

         // Add scenes to timeline
         scenes.forEach((scene: Scene) => {
           const chapter = chapters.find(c => c.slug === scene.chapterSlug)
           events.push({
             id: `scene-${scene.id}`,
             title: scene.title,
             chapter: chapter ? `Chapter ${chapter.chapterNumber}` : 'Unassigned',
             timeline: scene.timeline,
             location: scene.location,
             characters: scene.characters || [],
             status: 'draft', // Scenes don't have status in the type
             type: 'scene',
             order: (chapter?.chapterNumber || 0) * 1000 + scene.order
           })
         })

        // Sort events by order
        events.sort((a, b) => a.order - b.order)
        
        setTimelineEvents(events)
      } catch (error) {
        console.error('Error loading timeline data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadTimelineData()
  }, [dataLayer])

  if (loading) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8" style={{ color: tokens.colors.text.muted }}>
          Loading timeline...
        </div>
      </div>
    )
  }

  if (timelineEvents.length === 0) {
    return (
      <div className="space-y-4">
        <div className="text-center py-8" style={{ color: tokens.colors.text.muted }}>
          No timeline events found. Create some chapters and scenes to see your story timeline.
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        {timelineEvents.map((event, index) => (
          <div key={event.id} className="relative flex items-start space-x-4 pb-8">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {index + 1}
            </div>

            <Card className="flex-1">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <div className="text-sm text-gray-500 mt-1">
                      {event.chapter} • {event.timeline} • {event.location}
                    </div>
                  </div>
                  <Badge style={{ backgroundColor: getStatusColor(event.status, tokens).bg, color: getStatusColor(event.status, tokens).text }}>{event.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {event.characters.map((character) => (
                    <Badge key={character} variant="outline">
                      {character}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
