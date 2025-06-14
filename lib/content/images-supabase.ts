import { supabase } from "@/lib/supabase/client"
import type { StoryImage } from "@/lib/types"
import type { Database } from "@/lib/supabase/database.types"

type ImageRow = Database["public"]["Tables"]["story_images"]["Row"]

// Helper function to convert database row to StoryImage type
function dbRowToStoryImage(row: ImageRow): StoryImage {
  return {
    id: row.id,
    filename: row.filename,
    url: getImageUrl(row.storage_path),
    alt: row.alt_text || "",
    type: row.image_type || "reference",
    connectedTo: {
      characters: row.connected_characters || [],
      locations: row.connected_locations || [],
      chapters: row.connected_chapters || [],
      scenes: row.connected_scenes || [],
    },
    tags: row.tags || [],
    createdAt: new Date(row.created_at),
  }
}

// Helper function to get public URL from storage path
function getImageUrl(storagePath: string): string {
  const { data } = supabase.storage.from("story-images").getPublicUrl(storagePath)
  return data.publicUrl
}

export async function getAllImages(storyId?: string): Promise<StoryImage[]> {
  try {
    let query = supabase.from("story_images").select("*").order("created_at", { ascending: false })

    if (storyId) {
      query = query.eq("story_id", storyId)
    }

    const { data, error } = await query

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

export async function uploadImage(
  file: File,
  storyId: string,
  imageData: Omit<StoryImage, "id" | "url" | "filename" | "createdAt">
): Promise<StoryImage | null> {
  try {
    // Generate unique filename
    const fileExt = file.name.split('.').pop()
    const fileName = `${storyId}/${Date.now()}-${Math.random().toString(36).substring(2)}.${fileExt}`

    // Upload file to Supabase Storage
    const { data: uploadData, error: uploadError } = await supabase.storage
      .from("story-images")
      .upload(fileName, file)

    if (uploadError) {
      console.error("Error uploading file:", uploadError)
      return null
    }

    // Create database record
    const { data, error } = await supabase
      .from("story_images")
      .insert({
        story_id: storyId,
        filename: file.name,
        storage_path: uploadData.path,
        alt_text: imageData.alt,
        image_type: imageData.type,
        connected_characters: imageData.connectedTo.characters,
        connected_locations: imageData.connectedTo.locations,
        connected_chapters: imageData.connectedTo.chapters,
        connected_scenes: imageData.connectedTo.scenes,
        tags: imageData.tags,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating image record:", error)
      // Clean up uploaded file
      await supabase.storage.from("story-images").remove([uploadData.path])
      return null
    }

    return data ? dbRowToStoryImage(data) : null
  } catch (error) {
    console.error("Error in uploadImage:", error)
    return null
  }
}

export async function updateImageMetadata(
  id: string,
  updates: Partial<Pick<StoryImage, "alt" | "type" | "connectedTo" | "tags">>
): Promise<StoryImage | null> {
  try {
    const updateData: any = {}

    if (updates.alt) updateData.alt_text = updates.alt
    if (updates.type) updateData.image_type = updates.type
    if (updates.connectedTo?.characters) updateData.connected_characters = updates.connectedTo.characters
    if (updates.connectedTo?.locations) updateData.connected_locations = updates.connectedTo.locations
    if (updates.connectedTo?.chapters) updateData.connected_chapters = updates.connectedTo.chapters
    if (updates.connectedTo?.scenes) updateData.connected_scenes = updates.connectedTo.scenes
    if (updates.tags) updateData.tags = updates.tags

    const { data, error } = await supabase
      .from("story_images")
      .update(updateData)
      .eq("id", id)
      .select()
      .single()

    if (error) {
      console.error("Error updating image metadata:", error)
      return null
    }

    return data ? dbRowToStoryImage(data) : null
  } catch (error) {
    console.error("Error in updateImageMetadata:", error)
    return null
  }
}

export async function deleteImage(id: string): Promise<boolean> {
  try {
    // First get the image to find storage path
    const { data: imageData, error: fetchError } = await supabase
      .from("story_images")
      .select("storage_path")
      .eq("id", id)
      .single()

    if (fetchError) {
      console.error("Error fetching image for deletion:", fetchError)
      return false
    }

    // Delete from storage
    const { error: storageError } = await supabase.storage
      .from("story-images")
      .remove([imageData.storage_path])

    if (storageError) {
      console.error("Error deleting from storage:", storageError)
      // Continue with database deletion even if storage fails
    }

    // Delete from database
    const { error } = await supabase.from("story_images").delete().eq("id", id)

    if (error) {
      console.error("Error deleting image record:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in deleteImage:", error)
    return false
  }
}

export async function getImagesByType(type: StoryImage["type"], storyId?: string): Promise<StoryImage[]> {
  try {
    let query = supabase.from("story_images").select("*").eq("image_type", type)

    if (storyId) {
      query = query.eq("story_id", storyId)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching images by type:", error)
      return []
    }

    return data?.map(dbRowToStoryImage) || []
  } catch (error) {
    console.error("Error in getImagesByType:", error)
    return []
  }
}

export async function getImagesByTags(tags: string[], storyId?: string): Promise<StoryImage[]> {
  try {
    let query = supabase.from("story_images").select("*").overlaps("tags", tags)

    if (storyId) {
      query = query.eq("story_id", storyId)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching images by tags:", error)
      return []
    }

    return data?.map(dbRowToStoryImage) || []
  } catch (error) {
    console.error("Error in getImagesByTags:", error)
    return []
  }
}

export async function getImagesForCharacter(characterSlug: string, storyId?: string): Promise<StoryImage[]> {
  try {
    let query = supabase.from("story_images").select("*").contains("connected_characters", [characterSlug])

    if (storyId) {
      query = query.eq("story_id", storyId)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching images for character:", error)
      return []
    }

    return data?.map(dbRowToStoryImage) || []
  } catch (error) {
    console.error("Error in getImagesForCharacter:", error)
    return []
  }
}

export async function getImagesForLocation(locationSlug: string, storyId?: string): Promise<StoryImage[]> {
  try {
    let query = supabase.from("story_images").select("*").contains("connected_locations", [locationSlug])

    if (storyId) {
      query = query.eq("story_id", storyId)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching images for location:", error)
      return []
    }

    return data?.map(dbRowToStoryImage) || []
  } catch (error) {
    console.error("Error in getImagesForLocation:", error)
    return []
  }
} 