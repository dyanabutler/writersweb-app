"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { useAuth } from "@/lib/auth/clerk-auth-context"
import { useDataLayerContext } from "@/lib/content/data-layer"
import { 
  BookOpen, 
  Users, 
  MapPin, 
  Film,
  Star,
  Eye,
  EyeOff
} from "lucide-react"
import { useDesignSystem } from "@/components/design-system"
import type { StoryMetadata, Character, Location, Scene } from "@/lib/types"

export function FeaturedContentManager() {
  const { user } = useAuth()
  const { dataLayer } = useDataLayerContext()
  const { tokens } = useDesignSystem()
  
  const [loading, setLoading] = useState(false)
  const [stories, setStories] = useState<(StoryMetadata & { id: string })[]>([])
  const [characters, setCharacters] = useState<Character[]>([])
  const [locations, setLocations] = useState<Location[]>([])
  const [scenes, setScenes] = useState<Scene[]>([])

  useEffect(() => {
    loadAllContent()
  }, [])

  const loadAllContent = async () => {
    setLoading(true)
    try {
      const [storiesData, charactersData, locationsData, scenesData] = await Promise.all([
        dataLayer.getAllStories(),
        dataLayer.getAllCharacters(),
        dataLayer.getAllLocations(),
        dataLayer.getAllScenes(),
      ])
      
      setStories(storiesData)
      setCharacters(charactersData)
      setLocations(locationsData)
      setScenes(scenesData)
    } catch (error) {
      console.error("Error loading content:", error)
    } finally {
      setLoading(false)
    }
  }

  const toggleStoryFeatured = async (storyId: string, featured: boolean) => {
    try {
      await dataLayer.updateStory(storyId, { featured })
      setStories(prev => 
        prev.map(story => 
          story.id === storyId ? { ...story, featured } : story
        )
      )
    } catch (error) {
      console.error("Error updating story:", error)
    }
  }

  const toggleCharacterFeatured = async (characterSlug: string, featured: boolean) => {
    try {
      await dataLayer.updateCharacter(characterSlug, { featured })
      setCharacters(prev => 
        prev.map(character => 
          character.slug === characterSlug ? { ...character, featured } : character
        )
      )
    } catch (error) {
      console.error("Error updating character:", error)
    }
  }

  const toggleLocationFeatured = async (locationSlug: string, featured: boolean) => {
    try {
      await dataLayer.updateLocation(locationSlug, { featured })
      setLocations(prev => 
        prev.map(location => 
          location.slug === locationSlug ? { ...location, featured } : location
        )
      )
    } catch (error) {
      console.error("Error updating location:", error)
    }
  }

  const toggleSceneFeatured = async (sceneSlug: string, featured: boolean) => {
    try {
      await dataLayer.updateScene(sceneSlug, { featured })
      setScenes(prev => 
        prev.map(scene => 
          scene.slug === sceneSlug ? { ...scene, featured } : scene
        )
      )
    } catch (error) {
      console.error("Error updating scene:", error)
    }
  }

  const getFeaturedCount = (items: any[]) => {
    return items.filter(item => item.featured).length
  }

  if (loading) {
    return (
      <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
        <CardHeader>
          <CardTitle>Featured Content</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center py-8">
            <div className="animate-spin w-8 h-8 border-4 border-primary border-t-transparent rounded-full mx-auto mb-4"></div>
            <p>Loading your content...</p>
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <Star className="w-5 h-5" style={{ color: tokens.colors.icons.accent }} />
            Featured Content
          </CardTitle>
          <div className="flex gap-2">
            <Badge variant="outline">
              {getFeaturedCount(stories) + getFeaturedCount(characters) + getFeaturedCount(locations) + getFeaturedCount(scenes)} Featured
            </Badge>
          </div>
        </div>
        <p className="text-sm" style={{ color: tokens.colors.text.muted }}>
          Choose your best content to showcase on your public profile
        </p>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="stories" className="w-full">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="stories" className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Stories ({getFeaturedCount(stories)})
            </TabsTrigger>
            <TabsTrigger value="characters" className="flex items-center gap-2">
              <Users className="w-4 h-4" />
              Characters ({getFeaturedCount(characters)})
            </TabsTrigger>
            <TabsTrigger value="locations" className="flex items-center gap-2">
              <MapPin className="w-4 h-4" />
              Locations ({getFeaturedCount(locations)})
            </TabsTrigger>
            <TabsTrigger value="scenes" className="flex items-center gap-2">
              <Film className="w-4 h-4" />
              Scenes ({getFeaturedCount(scenes)})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="stories" className="space-y-4">
            {stories.length > 0 ? (
              stories.map((story) => (
                <div 
                  key={story.id}
                  className="flex items-center justify-between p-4 border rounded-lg"
                  style={{ borderColor: tokens.colors.neutral[200] }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{story.title}</h4>
                      {story.featured && (
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      {story.genre && (
                        <Badge variant="outline" className="text-xs">
                          {story.genre}
                        </Badge>
                      )}
                      <Badge variant="outline" className="text-xs">
                        {story.status}
                      </Badge>
                    </div>
                    {story.description && (
                      <p className="text-sm text-gray-500 mt-1 truncate">
                        {story.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {story.featured ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                      <Switch
                        checked={story.featured || false}
                        onCheckedChange={(checked) => toggleStoryFeatured(story.id, checked)}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <BookOpen className="w-12 h-12 mx-auto mb-4" style={{ color: tokens.colors.icons.muted }} />
                <p style={{ color: tokens.colors.text.muted }}>No stories yet</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="characters" className="space-y-4">
            {characters.length > 0 ? (
              characters.map((character) => (
                <div 
                  key={character.slug}
                  className="flex items-center justify-between p-4 border rounded-lg"
                  style={{ borderColor: tokens.colors.neutral[200] }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{character.name}</h4>
                      {character.featured && (
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {character.role}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {character.status}
                      </Badge>
                    </div>
                    {character.description && (
                      <p className="text-sm text-gray-500 mt-1 truncate">
                        {character.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {character.featured ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                      <Switch
                        checked={character.featured || false}
                        onCheckedChange={(checked) => toggleCharacterFeatured(character.slug, checked)}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Users className="w-12 h-12 mx-auto mb-4" style={{ color: tokens.colors.icons.muted }} />
                <p style={{ color: tokens.colors.text.muted }}>No characters yet</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="locations" className="space-y-4">
            {locations.length > 0 ? (
              locations.map((location) => (
                <div 
                  key={location.slug}
                  className="flex items-center justify-between p-4 border rounded-lg"
                  style={{ borderColor: tokens.colors.neutral[200] }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{location.name}</h4>
                      {location.featured && (
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      )}
                    </div>
                    <div className="flex items-center gap-2 mt-1">
                      <Badge variant="outline" className="text-xs">
                        {location.type}
                      </Badge>
                    </div>
                    {location.description && (
                      <p className="text-sm text-gray-500 mt-1 truncate">
                        {location.description}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {location.featured ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                      <Switch
                        checked={location.featured || false}
                        onCheckedChange={(checked) => toggleLocationFeatured(location.slug, checked)}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <MapPin className="w-12 h-12 mx-auto mb-4" style={{ color: tokens.colors.icons.muted }} />
                <p style={{ color: tokens.colors.text.muted }}>No locations yet</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="scenes" className="space-y-4">
            {scenes.length > 0 ? (
              scenes.map((scene) => (
                <div 
                  key={scene.slug}
                  className="flex items-center justify-between p-4 border rounded-lg"
                  style={{ borderColor: tokens.colors.neutral[200] }}
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <h4 className="font-medium">{scene.title}</h4>
                      {scene.featured && (
                        <Star className="w-4 h-4 fill-yellow-400 text-yellow-400" />
                      )}
                    </div>
                    {scene.summary && (
                      <p className="text-sm text-gray-500 mt-1 truncate">
                        {scene.summary}
                      </p>
                    )}
                  </div>
                  <div className="flex items-center gap-4">
                    <div className="flex items-center gap-2">
                      {scene.featured ? (
                        <Eye className="w-4 h-4 text-green-600" />
                      ) : (
                        <EyeOff className="w-4 h-4 text-gray-400" />
                      )}
                      <Switch
                        checked={scene.featured || false}
                        onCheckedChange={(checked) => toggleSceneFeatured(scene.slug, checked)}
                      />
                    </div>
                  </div>
                </div>
              ))
            ) : (
              <div className="text-center py-8">
                <Film className="w-12 h-12 mx-auto mb-4" style={{ color: tokens.colors.icons.muted }} />
                <p style={{ color: tokens.colors.text.muted }}>No scenes yet</p>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
} 