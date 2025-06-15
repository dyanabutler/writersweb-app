import { supabase } from "@/lib/supabase/client"
import type { StoryImage } from "@/lib/types"
import type { Database } from "@/lib/supabase/database.types"

type ImageRow = Database["public"]["Tables"]["story_images"]["Row"]

// Helper function to convert database row to StoryImage type
function dbRowToStoryImage(row: ImageRow): StoryImage {
  return {
    id: row.id,
    filename: row.filename,
    url: row.storage_path,
    alt: row.alt_text || "",
    type: row.image_type || "reference",
    connectedTo: {
      characters: row.connected_characters || [],
      chapters: row.connected_chapters || [],
      locations: row.connected_locations || [],
    },
    tags: row.tags || [],
    createdAt: new Date(row.created_at),
  }
}

export async function getAllImages(): Promise<StoryImage[]> {
  try {
    const { data, error } = await supabase
      .from("story_images")
      .select("*")
      .order("created_at", { ascending: false })

    if (error) {
      console.error("Error fetching images:", error)
      return []
    }

    return data?.map(dbRowToStoryImage) || []
  } catch (error) {
    console.error("Error in getAllImages:", error)
    return []
  }
}

export async function getImageById(id: string): Promise<StoryImage | null> {
  try {
    const { data, error } = await supabase
      .from("story_images")
      .select("*")
      .eq("id", id)
      .single()

    if (error) {
      console.error("Error fetching image:", error)
      return null
    }

    return data ? dbRowToStoryImage(data) : null
  } catch (error) {
    console.error("Error in getImageById:", error)
    return null
  }
}

export async function createImage(
  image: Omit<StoryImage, "id" | "createdAt">
): Promise<StoryImage | null> {
  try {
    const { data, error } = await supabase
      .from("story_images")
      .insert({
        filename: image.filename,
        url: image.url,
        alt: image.alt,
        type: image.type,
        connected_characters: image.connectedTo.characters || [],
        connected_chapters: image.connectedTo.chapters || [],
        connected_locations: image.connectedTo.locations || [],
        tags: image.tags,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating image:", error)
      return null
    }

    return data ? dbRowToStoryImage(data) : null
  } catch (error) {
    console.error("Error in createImage:", error)
    return null
  }
}

export async function updateImage(
  id: string,
  updates: Partial<StoryImage>
): Promise<StoryImage | null> {
  try {
    const updateData: any = {}

    if (updates.filename) updateData.filename = updates.filename
    if (updates.url) updateData.url = updates.url
    if (updates.alt) updateData.alt = updates.alt
    if (updates.type) updateData.type = updates.type
    if (updates.connectedTo?.characters) updateData.connected_characters = updates.connectedTo.characters
    if (updates.connectedTo?.chapters) updateData.connected_chapters = updates.connectedTo.chapters
    if (updates.connectedTo?.locations) updateData.connected_locations = updates.connectedTo.locations
    if (updates.tags) updateData.tags = updates.tags

    const { data, error } = await supabase
      .from("story_images")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating image:", error)
      return null
    }

    return data ? dbRowToStoryImage(data) : null
  } catch (error) {
    console.error("Error in updateImage:", error)
    return null
  }
}

export async function deleteImage(id: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("story_images")
      .delete()
      .eq("id", id)

    if (error) {
      console.error("Error deleting image:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in deleteImage:", error)
    return false
  }
}
