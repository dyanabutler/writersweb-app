"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Film, Star, Quote, BookOpen, Eye, Clock } from "lucide-react"
import { useDesignSystem } from "@/components/design-system"
import { useState } from "react"
import type { Scene } from "@/lib/types"

interface FeaturedScenesWritingSamplesProps {
  scenes: Scene[]
  authorName?: string
}

export function FeaturedScenesWritingSamples({ scenes, authorName }: FeaturedScenesWritingSamplesProps) {
  const { tokens } = useDesignSystem()
  const [expandedScenes, setExpandedScenes] = useState<Set<string>>(new Set())
  
  const featuredScenes = scenes.filter(scene => scene.featured)
  
  if (featuredScenes.length === 0) return null

  const toggleExpanded = (sceneSlug: string) => {
    const newExpanded = new Set(expandedScenes)
    if (newExpanded.has(sceneSlug)) {
      newExpanded.delete(sceneSlug)
    } else {
      newExpanded.add(sceneSlug)
    }
    setExpandedScenes(newExpanded)
  }

  const truncateText = (text: string, maxLength: number = 300) => {
    if (text.length <= maxLength) return text
    return text.substring(0, maxLength).trim() + "..."
  }

  const getWordCount = (text: string) => {
    return text.trim().split(/\s+/).length
  }

  const getReadingTime = (wordCount: number) => {
    const wordsPerMinute = 200
    const minutes = Math.ceil(wordCount / wordsPerMinute)
    return minutes
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: tokens.colors.secondary[100] }}
          >
            <Film className="w-6 h-6" style={{ color: tokens.colors.secondary[600] }} />
          </div>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: tokens.colors.text.primary }}>
              Writing Samples
            </h2>
            <p className="text-sm" style={{ color: tokens.colors.text.muted }}>
              Featured scenes showcasing {authorName}'s writing style
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          {featuredScenes.length} Scene{featuredScenes.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="space-y-8">
        {featuredScenes.map((scene, index) => {
          const isExpanded = expandedScenes.has(scene.slug)
          const content = scene.content || ""
          const wordCount = getWordCount(content)
          const readingTime = getReadingTime(wordCount)
          
          return (
            <Card 
              key={scene.slug}
              className="group hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-purple-200 relative overflow-hidden"
              style={{ backgroundColor: tokens.colors.background.secondary }}
            >
              {/* Featured Star */}
              <div className="absolute top-4 right-4 z-10">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>

              {/* Scene Number */}
              <div className="absolute top-4 left-4 z-10">
                <Badge 
                  className="text-xs"
                  style={{ 
                    backgroundColor: tokens.colors.primary[100],
                    color: tokens.colors.primary[700]
                  }}
                >
                  Sample {index + 1}
                </Badge>
              </div>

              <CardHeader className="pt-12 pb-4">
                <div className="space-y-3">
                  <CardTitle className="text-xl group-hover:text-purple-600 transition-colors">
                    {scene.title}
                  </CardTitle>
                  
                  {scene.summary && (
                    <p 
                      className="text-sm leading-relaxed italic"
                      style={{ color: tokens.colors.text.muted }}
                    >
                      {scene.summary}
                    </p>
                  )}

                  <div className="flex flex-wrap gap-2">
                    {wordCount > 0 && (
                      <div className="flex items-center gap-1 text-xs" style={{ color: tokens.colors.text.muted }}>
                        <BookOpen className="w-3 h-3" />
                        {wordCount} words
                      </div>
                    )}
                    
                    {readingTime > 0 && (
                      <div className="flex items-center gap-1 text-xs" style={{ color: tokens.colors.text.muted }}>
                        <Clock className="w-3 h-3" />
                        {readingTime} min read
                      </div>
                    )}

                    {scene.location && (
                      <Badge variant="outline" className="text-xs">
                        📍 {scene.location}
                      </Badge>
                    )}

                    {scene.characters && scene.characters.length > 0 && (
                      <Badge variant="outline" className="text-xs">
                        👥 {scene.characters.length} character{scene.characters.length !== 1 ? 's' : ''}
                      </Badge>
                    )}
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 space-y-4">
                {content && (
                  <div className="space-y-4">
                    {/* Quote decoration */}
                    <div className="flex items-start gap-3">
                      <Quote 
                        className="w-6 h-6 shrink-0 mt-1 opacity-30" 
                        style={{ color: tokens.colors.icons.muted }} 
                      />
                      <div className="flex-1">
                        <div 
                          className="prose prose-sm max-w-none leading-relaxed"
                          style={{ color: tokens.colors.text.primary }}
                        >
                          <div 
                            className="font-serif text-base leading-7"
                            style={{ 
                              fontFamily: "'Crimson Text', 'Times New Roman', serif",
                              lineHeight: "1.7"
                            }}
                          >
                            {isExpanded ? (
                              <div className="whitespace-pre-wrap">
                                {content}
                              </div>
                            ) : (
                              <div className="whitespace-pre-wrap">
                                {truncateText(content)}
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>

                    {content.length > 300 && (
                      <div className="flex justify-center pt-4 border-t" style={{ borderColor: tokens.colors.neutral[200] }}>
                        <Button
                          variant="ghost"
                          onClick={() => toggleExpanded(scene.slug)}
                          className="text-sm"
                          style={{ color: tokens.colors.primary[600] }}
                        >
                          <Eye className="w-4 h-4 mr-2" />
                          {isExpanded ? "Show Less" : "Read Full Scene"}
                        </Button>
                      </div>
                    )}
                  </div>
                )}

                {scene.characters && scene.characters.length > 0 && (
                  <div className="pt-4 border-t" style={{ borderColor: tokens.colors.neutral[200] }}>
                    <p className="text-xs font-medium mb-2" style={{ color: tokens.colors.text.secondary }}>
                      Featured Characters:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {scene.characters.map((character, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {character}
                        </Badge>
                      ))}
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>

      {featuredScenes.length > 3 && (
        <div className="text-center pt-6">
          <p className="text-sm" style={{ color: tokens.colors.text.muted }}>
            Showing {Math.min(3, featuredScenes.length)} of {featuredScenes.length} featured writing samples
          </p>
        </div>
      )}
    </section>
  )
} 