"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ChapterCard } from "@/components/chapter/chapter-card"
import { CharacterCard } from "@/components/character/character-card"
import { LocationCard } from "@/components/location/location-card"
import type { Chapter, Character, Location } from "@/lib/types"
import { getAllChapters } from "@/lib/content/chapters"
import { getAllCharacters } from "@/lib/content/characters"
import { getAllLocations } from "@/lib/content/locations"
import { BookOpen, Users, MapPin } from "lucide-react"

export function DraftsList() {
  const [draftChapters, setDraftChapters] = useState<Chapter[]>([])
  const [draftCharacters, setDraftCharacters] = useState<Character[]>([])
  const [draftLocations, setDraftLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadDrafts = async () => {
      try {
        const [chapters, characters, locations] = await Promise.all([
          getAllChapters(),
          getAllCharacters(),
          getAllLocations(),
        ])

        // Filter for draft status - for characters and locations, we'll consider incomplete ones as drafts
        setDraftChapters(chapters.filter((chapter) => chapter.status === "draft"))
        setDraftCharacters(characters.filter((character) => !character.description || !character.backstory))
        setDraftLocations(locations.filter((location) => !location.description || !location.significance))
      } catch (error) {
        console.error("Failed to load drafts:", error)
      } finally {
        setLoading(false)
      }
    }

    loadDrafts()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading drafts...</div>
  }

  const totalDrafts = draftChapters.length + draftCharacters.length + draftLocations.length

  return (
    <div className="space-y-6">
      <Tabs defaultValue="chapters" className="space-y-4">
        <TabsList>
          <TabsTrigger value="chapters">Chapters ({draftChapters.length})</TabsTrigger>
          <TabsTrigger value="characters">Characters ({draftCharacters.length})</TabsTrigger>
          <TabsTrigger value="locations">Locations ({draftLocations.length})</TabsTrigger>
        </TabsList>

        <TabsContent value="chapters" className="space-y-4">
          {draftChapters.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <BookOpen className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No draft chapters found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {draftChapters.map((chapter) => (
                <ChapterCard key={chapter.slug} chapter={chapter} />
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="characters" className="space-y-4">
          {draftCharacters.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <Users className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No incomplete characters found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {draftCharacters.map((character) => (
                <div key={character.slug} className="relative">
                  <CharacterCard character={character} />
                  <Badge className="absolute top-2 right-2 bg-orange-100 text-orange-800">Incomplete</Badge>
                </div>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="locations" className="space-y-4">
          {draftLocations.length === 0 ? (
            <div className="text-center py-8 text-gray-500">
              <MapPin className="w-12 h-12 mx-auto mb-4 text-gray-300" />
              <p>No incomplete locations found</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {draftLocations.map((location) => (
                <div key={location.slug} className="relative">
                  <LocationCard location={location} />
                  <Badge className="absolute top-2 right-2 bg-orange-100 text-orange-800">Incomplete</Badge>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
