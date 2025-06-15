"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { useDataLayerContext } from "@/lib/content/data-layer"
import { useDesignSystem } from "@/lib/contexts/design-system-context"
import { formatDistanceToNow } from "date-fns"

interface Activity {
  action: string
  time: string
  type: 'chapter' | 'character' | 'location' | 'scene'
}

export function RecentActivity() {
  const { dataLayer } = useDataLayerContext()
  const { tokens } = useDesignSystem()
  const [activities, setActivities] = useState<Activity[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadRecentActivity() {
      try {
        setLoading(true)
        
        // Load all data to find recent updates
        const [chapters, characters, locations] = await Promise.all([
          dataLayer.getAllChapters(),
          dataLayer.getAllCharacters(), 
          dataLayer.getAllLocations()
        ])

        // Combine and sort by updatedAt
        const allItems = [
          ...chapters.map(item => ({
            ...item,
            type: 'chapter' as const,
            actionPrefix: 'Updated chapter'
          })),
          ...characters.map(item => ({
            ...item,
            type: 'character' as const,
            actionPrefix: 'Updated character'
          })),
          ...locations.map(item => ({
            ...item,
            type: 'location' as const,
            actionPrefix: 'Updated location'
          }))
        ]

        // Sort by updatedAt (most recent first) and take top 6
        const recentItems = allItems
          .filter(item => item.updatedAt)
          .sort((a, b) => new Date(b.updatedAt!).getTime() - new Date(a.updatedAt!).getTime())
          .slice(0, 6)

        const recentActivities: Activity[] = recentItems.map(item => ({
          action: `${item.actionPrefix}: ${item.type === 'chapter' ? item.title : item.name}`,
          time: formatDistanceToNow(new Date(item.updatedAt!), { addSuffix: true }),
          type: item.type
        }))

        setActivities(recentActivities)
      } catch (error) {
        console.error('Error loading recent activity:', error)
        // Fallback to empty state
        setActivities([])
      } finally {
        setLoading(false)
      }
    }

    loadRecentActivity()
  }, [dataLayer])

  if (loading) {
    return (
      <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
        <CardHeader>
          <CardTitle style={{ color: tokens.colors.text.primary }}>Recent Activity</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className="flex justify-between items-center animate-pulse">
                <div className="h-4 bg-gray-300 rounded w-2/3"></div>
                <div className="h-3 bg-gray-300 rounded w-20"></div>
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
        <CardTitle style={{ color: tokens.colors.text.primary }}>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        {activities.length > 0 ? (
          <div className="space-y-3">
            {activities.map((activity, index) => (
              <div key={index} className="flex justify-between items-center text-sm">
                <span style={{ color: tokens.colors.text.secondary }}>
                  {activity.action}
                </span>
                <span style={{ color: tokens.colors.text.muted }}>
                  {activity.time}
                </span>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8">
            <p style={{ color: tokens.colors.text.muted }}>
              No recent activity yet. Create your first chapter, character, or location to get started!
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
}
