"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { BookOpen, Star, Calendar, Type, Bookmark } from "lucide-react"
import { useDesignSystem } from "@/components/design-system"
import type { StoryMetadata } from "@/lib/types"

interface FeaturedStoriesShowcaseProps {
  stories: (StoryMetadata & { id: string })[]
  authorName?: string
}

export function FeaturedStoriesShowcase({ stories, authorName }: FeaturedStoriesShowcaseProps) {
  const { tokens } = useDesignSystem()
  
  const featuredStories = stories.filter(story => story.featured)
  
  if (featuredStories.length === 0) return null

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: tokens.colors.primary[100] }}
          >
            <BookOpen className="w-6 h-6" style={{ color: tokens.colors.primary[600] }} />
          </div>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: tokens.colors.text.primary }}>
              Featured Stories
            </h2>
            <p className="text-sm" style={{ color: tokens.colors.text.muted }}>
              {authorName}'s most compelling narratives
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          {featuredStories.length} Story{featuredStories.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredStories.map((story) => (
          <Card 
            key={story.id}
            className="group hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-amber-200"
            style={{ backgroundColor: tokens.colors.background.secondary }}
          >
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-2">
                    <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
                    <Badge variant="outline" className="text-xs">
                      Featured
                    </Badge>
                  </div>
                  <CardTitle className="text-lg leading-tight group-hover:text-amber-600 transition-colors">
                    {story.title}
                  </CardTitle>
                </div>
              </div>
              
              <div className="flex flex-wrap gap-2 mt-3">
                {story.genre && (
                  <Badge 
                    className="text-xs"
                    style={{ 
                      backgroundColor: tokens.colors.primary[100],
                      color: tokens.colors.primary[700]
                    }}
                  >
                    {story.genre}
                  </Badge>
                )}
                <Badge variant="outline" className="text-xs capitalize">
                  {story.status}
                </Badge>
              </div>
            </CardHeader>

            <CardContent className="pt-0 space-y-4">
              {story.description && (
                <p 
                  className="text-sm leading-relaxed line-clamp-3"
                  style={{ color: tokens.colors.text.muted }}
                >
                  {story.description}
                </p>
              )}

              <div className="grid grid-cols-2 gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <Type className="w-3 h-3" style={{ color: tokens.colors.icons.muted }} />
                  <span style={{ color: tokens.colors.text.muted }}>
                    {story.currentWordCount.toLocaleString()} words
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Calendar className="w-3 h-3" style={{ color: tokens.colors.icons.muted }} />
                  <span style={{ color: tokens.colors.text.muted }}>
                    {new Date(story.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </div>

              {story.wordCountGoal && (
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span style={{ color: tokens.colors.text.muted }}>Progress</span>
                    <span style={{ color: tokens.colors.text.muted }}>
                      {Math.round((story.currentWordCount / story.wordCountGoal) * 100)}%
                    </span>
                  </div>
                  <div 
                    className="w-full h-2 rounded-full"
                    style={{ backgroundColor: tokens.colors.neutral[200] }}
                  >
                    <div
                      className="h-full rounded-full transition-all duration-300"
                      style={{
                        width: `${Math.min((story.currentWordCount / story.wordCountGoal) * 100, 100)}%`,
                        backgroundColor: tokens.colors.primary[500]
                      }}
                    />
                  </div>
                </div>
              )}

              {(story.characters?.length || 0) > 0 && (
                <div className="flex items-center gap-2 pt-2 border-t" style={{ borderColor: tokens.colors.neutral[200] }}>
                  <Bookmark className="w-3 h-3" style={{ color: tokens.colors.icons.muted }} />
                  <span className="text-xs" style={{ color: tokens.colors.text.muted }}>
                    {story.characters?.length} character{(story.characters?.length || 0) !== 1 ? 's' : ''}
                  </span>
                </div>
              )}
            </CardContent>
          </Card>
        ))}
      </div>
    </section>
  )
} 