"use client"

import { useState, useEffect } from "react"
import { CharacterCard } from "./character-card"
import type { Character } from "@/lib/types"
import { getAllCharacters } from "@/lib/content/characters"

export function CharacterList() {
  const [characters, setCharacters] = useState<Character[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadCharacters = async () => {
      try {
        const characterData = await getAllCharacters()
        setCharacters(characterData)
      } catch (error) {
        console.error("Failed to load characters:", error)
      } finally {
        setLoading(false)
      }
    }

    loadCharacters()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading characters...</div>
  }

  return (
    <div className="space-y-4">
      <p className="text-gray-600">{characters.length} characters</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {characters.map((character) => (
          <CharacterCard key={character.slug} character={character} />
        ))}
      </div>
    </div>
  )
}
