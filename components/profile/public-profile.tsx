"use client"

import Image from "next/image"
import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Share2, BookOpen, Users, MapPin, Calendar, Crown, ExternalLink } from "lucide-react"
import { useDesignSystem } from "@/components/design-system"
import { useState } from "react"
import { FeaturedStoriesShowcase } from "./featured-stories-showcase"
import { FeaturedCharactersGallery } from "./featured-characters-gallery"
import { FeaturedLocationsShowcase } from "./featured-locations-showcase"
import { FeaturedScenesWritingSamples } from "./featured-scenes-writing-samples"
import type { StoryMetadata, Character, Location, Scene } from "@/lib/types"

interface PublicProfileProps {
  profile: {
    id: string
    full_name: string | null
    avatar_url: string | null
    bio: string | null
    created_at: string
    subscription_tier: string
    public_profile: boolean
  }
  stories: any[]
  characters: any[]
  locations: any[]
  scenes: any[]
}

export function PublicProfile({ profile, stories, characters, locations, scenes }: PublicProfileProps) {
  const { tokens } = useDesignSystem()
  const [shareUrl] = useState(typeof window !== "undefined" ? window.location.href : "")

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: `${profile.full_name || "Writer"}'s Profile`,
          text: `Check out ${profile.full_name || "this writer"}'s featured stories!`,
          url: shareUrl,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      // Fallback: copy to clipboard
      navigator.clipboard.writeText(shareUrl)
      alert("Profile link copied to clipboard!")
    }
  }

  // Convert raw data to typed objects with proper defaults
  const storyData = stories.map(story => ({
    ...story,
    featured: story.featured || false,
    currentWordCount: story.current_word_count || 0,
    wordCountGoal: story.word_count_goal || null,
    createdAt: story.created_at,
    characters: story.characters || [],
    chapters: story.chapters || []
  }))

  const characterData = characters.map(character => ({
    ...character,
    featured: character.featured || false,
    images: character.image_url ? [character.image_url] : []
  }))

  const locationData = locations.map(location => ({
    ...location,
    featured: location.featured || false,
    connectedCharacters: location.connected_characters || []
  }))

  const sceneData = scenes.map(scene => ({
    ...scene,
    featured: scene.featured || false,
    characters: scene.characters || []
  }))

  const totalCharacters = characters.length
  const totalChapters = stories.reduce((acc, story) => acc + (story.chapters?.length || 0), 0)
  const totalLocations = locations.length
  const totalScenes = scenes.length

  return (
    <div className="min-h-screen" style={{ backgroundColor: tokens.colors.background.primary }}>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Profile Header */}
        <Card className="mb-8" style={{ backgroundColor: tokens.colors.background.secondary }}>
          <CardContent className="p-8">
            <div className="flex flex-col md:flex-row items-center gap-6">
              <div className="relative">
                <Image
                  src={profile.avatar_url || "/placeholder.svg"}
                  alt={profile.full_name || "Writer"}
                  width={120}
                  height={120}
                  className="rounded-full border-4 border-white shadow-lg"
                />
                {profile.subscription_tier === "pro" && (
                  <Crown 
                    className="absolute -top-2 -right-2 w-8 h-8 p-1 bg-yellow-400 rounded-full" 
                    style={{ color: tokens.colors.background.secondary }} 
                  />
                )}
              </div>
              
              <div className="flex-1 text-center md:text-left">
                <h1 
                  className="text-3xl font-bold mb-2"
                  style={{ color: tokens.colors.text.primary }}
                >
                  {profile.full_name || "Anonymous Writer"}
                </h1>
                
                <div className="flex flex-wrap justify-center md:justify-start gap-2 mb-4">
                  <Badge variant="secondary">
                    <Calendar className="w-3 h-3 mr-1" />
                    Writing since {new Date(profile.created_at).getFullYear()}
                  </Badge>
                  {profile.subscription_tier === "pro" && (
                    <Badge className="bg-yellow-100 text-yellow-800">
                      <Crown className="w-3 h-3 mr-1" />
                      Pro Writer
                    </Badge>
                  )}
                </div>

                {profile.bio && (
                  <p 
                    className="text-lg mb-4"
                    style={{ color: tokens.colors.text.muted }}
                  >
                    {profile.bio}
                  </p>
                )}

                <div className="flex flex-wrap justify-center md:justify-start gap-4 mb-4">
                  <div className="flex items-center gap-1">
                    <BookOpen className="w-4 h-4" style={{ color: tokens.colors.icons.accent }} />
                    <span className="text-sm">{stories.length} Stories</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Users className="w-4 h-4" style={{ color: tokens.colors.icons.accent }} />
                    <span className="text-sm">{totalCharacters} Characters</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <MapPin className="w-4 h-4" style={{ color: tokens.colors.icons.accent }} />
                    <span className="text-sm">{totalLocations} Locations</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Calendar className="w-4 h-4" style={{ color: tokens.colors.icons.accent }} />
                    <span className="text-sm">{totalScenes} Scenes</span>
                  </div>
                </div>

                <Button onClick={handleShare} variant="primary-outline">
                  <Share2 className="w-4 h-4 mr-2" />
                  Share Profile
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Featured Content Showcases */}
        <div className="space-y-12">
          <FeaturedStoriesShowcase 
            stories={storyData} 
            authorName={profile.full_name || "This writer"}
          />
          
          <FeaturedCharactersGallery 
            characters={characterData} 
            authorName={profile.full_name || "This writer"}
          />
          
          <FeaturedLocationsShowcase 
            locations={locationData} 
            authorName={profile.full_name || "This writer"}
          />
          
          <FeaturedScenesWritingSamples 
            scenes={sceneData} 
            authorName={profile.full_name || "This writer"}
          />
        </div>

        {/* Empty State - Show only if no featured content exists */}
        {storyData.filter(s => s.featured).length === 0 && 
         characterData.filter(c => c.featured).length === 0 && 
         locationData.filter(l => l.featured).length === 0 && 
         sceneData.filter(s => s.featured).length === 0 && (
          <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
            <CardContent className="text-center py-12">
              <BookOpen className="w-12 h-12 mx-auto mb-4" style={{ color: tokens.colors.icons.muted }} />
              <h3 className="text-lg font-semibold mb-2" style={{ color: tokens.colors.text.primary }}>
                No Featured Content Yet
              </h3>
              <p style={{ color: tokens.colors.text.muted }}>
                {profile.full_name || "This writer"} hasn't featured any content on their profile yet.
              </p>
            </CardContent>
          </Card>
        )}

        {/* Footer */}
        <div className="text-center mt-12 py-8 border-t" style={{ borderColor: tokens.colors.neutral[200] }}>
          <p className="text-sm" style={{ color: tokens.colors.text.muted }}>
            Powered by <strong>Story Manager</strong> - Your digital writing companion
          </p>
        </div>
      </div>
    </div>
  )
} 