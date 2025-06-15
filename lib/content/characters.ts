import { supabase } from "@/lib/supabase/client"
import type { Character } from "@/lib/types"
import type { Database } from "@/lib/supabase/database.types"

type CharacterRow = Database["public"]["Tables"]["characters"]["Row"]

// Helper function to convert database row to Character type
function dbRowToCharacter(row: CharacterRow): Character {
  return {
    slug: row.slug,
    name: row.name,
    role: row.role || "",
    age: row.age || 0,
    status: row.status,
    location: row.location || "",
    affiliations: row.affiliations || [],
    relationships: row.relationships || [],
    firstAppearance: row.first_appearance || "",
    description: row.description || "",
    backstory: row.backstory || "",
    images: [], // Images will be handled separately
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}

// Helper function to generate slug from name
function generateSlug(name: string): string {
  return name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
}

export async function getAllCharacters(): Promise<Character[]> {
  try {
    const { data, error } = await supabase
      .from("characters")
      .select("*")
      .order("name", { ascending: true })

    if (error) {
      console.error("Error fetching characters:", error)
      return []
    }

    return data?.map(dbRowToCharacter) || []
  } catch (error) {
    console.error("Error in getAllCharacters:", error)
    return []
  }
}

export async function getCharacterBySlug(slug: string): Promise<Character | null> {
  try {
    const { data, error } = await supabase
      .from("characters")
      .select("*")
      .eq("slug", slug)
      .single()

    if (error) {
      console.error("Error fetching character:", error)
      return null
    }

    return data ? dbRowToCharacter(data) : null
  } catch (error) {
    console.error("Error in getCharacterBySlug:", error)
    return null
  }
}

export async function createCharacter(
  character: Omit<Character, "slug" | "createdAt" | "updatedAt">
): Promise<Character | null> {
  try {
    const slug = generateSlug(character.name)

    const { data, error } = await supabase
      .from("characters")
      .insert({
        slug,
        name: character.name,
        role: character.role,
        age: character.age,
        status: character.status,
        location: character.location,
        affiliations: character.affiliations,
        relationships: character.relationships,
        first_appearance: character.firstAppearance,
        description: character.description,
        backstory: character.backstory,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating character:", error)
      return null
    }

    return data ? dbRowToCharacter(data) : null
  } catch (error) {
    console.error("Error in createCharacter:", error)
    return null
  }
}

export async function updateCharacter(
  slug: string,
  updates: Partial<Character>
): Promise<Character | null> {
  try {
    const updateData: any = {}

    if (updates.name) updateData.name = updates.name
    if (updates.role) updateData.role = updates.role
    if (updates.age !== undefined) updateData.age = updates.age
    if (updates.status) updateData.status = updates.status
    if (updates.location) updateData.location = updates.location
    if (updates.affiliations) updateData.affiliations = updates.affiliations
    if (updates.relationships) updateData.relationships = updates.relationships
    if (updates.firstAppearance) updateData.first_appearance = updates.firstAppearance
    if (updates.description) updateData.description = updates.description
    if (updates.backstory) updateData.backstory = updates.backstory

    const { data, error } = await supabase
      .from("characters")
      .update(updateData)
      .eq("slug", slug)
      .select()
      .single()

    if (error) {
      console.error("Error updating character:", error)
      return null
    }

    return data ? dbRowToCharacter(data) : null
  } catch (error) {
    console.error("Error in updateCharacter:", error)
    return null
  }
}

export async function deleteCharacter(slug: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("characters")
      .delete()
      .eq("slug", slug)

    if (error) {
      console.error("Error deleting character:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in deleteCharacter:", error)
    return false
  }
}
