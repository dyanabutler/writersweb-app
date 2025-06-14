import { supabase } from "@/lib/supabase/client"
import type { StoryMetadata } from "@/lib/types"
import type { Database } from "@/lib/supabase/database.types"

type StoryRow = Database["public"]["Tables"]["stories"]["Row"]

// Helper function to convert database row to StoryMetadata type
function dbRowToStoryMetadata(row: StoryRow): StoryMetadata & { id: string } {
  return {
    id: row.id,
    title: row.title,
    author: row.author || "",
    genre: row.genre || "",
    status: row.status,
    wordCountGoal: row.word_count_goal || undefined,
    currentWordCount: row.current_word_count,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}

export async function getAllStories(userId: string): Promise<(StoryMetadata & { id: string })[]> {
  try {
    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .eq("user_id", userId)
      .order("updated_at", { ascending: false })

    if (error) {
      console.error("Error fetching stories:", error)
      return []
    }

    return data?.map(dbRowToStoryMetadata) || []
  } catch (error) {
    console.error("Error in getAllStories:", error)
    return []
  }
}

export async function getStoryById(id: string, userId: string): Promise<(StoryMetadata & { id: string }) | null> {
  try {
    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .eq("id", id)
      .eq("user_id", userId)
      .single()

    if (error) {
      console.error("Error fetching story:", error)
      return null
    }

    return data ? dbRowToStoryMetadata(data) : null
  } catch (error) {
    console.error("Error in getStoryById:", error)
    return null
  }
}

export async function createStory(
  story: Omit<StoryMetadata, "createdAt" | "updatedAt">,
  userId: string,
): Promise<(StoryMetadata & { id: string }) | null> {
  try {
    const { data, error } = await supabase
      .from("stories")
      .insert({
        user_id: userId,
        title: story.title,
        author: story.author,
        genre: story.genre,
        status: story.status,
        word_count_goal: story.wordCountGoal,
        current_word_count: story.currentWordCount,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating story:", error)
      return null
    }

    return data ? dbRowToStoryMetadata(data) : null
  } catch (error) {
    console.error("Error in createStory:", error)
    return null
  }
}

export async function updateStory(
  id: string,
  updates: Partial<StoryMetadata>,
  userId: string,
): Promise<(StoryMetadata & { id: string }) | null> {
  try {
    const updateData: any = {}

    if (updates.title) updateData.title = updates.title
    if (updates.author) updateData.author = updates.author
    if (updates.genre) updateData.genre = updates.genre
    if (updates.status) updateData.status = updates.status
    if (updates.wordCountGoal !== undefined) updateData.word_count_goal = updates.wordCountGoal
    if (updates.currentWordCount !== undefined) updateData.current_word_count = updates.currentWordCount

    const { data, error } = await supabase
      .from("stories")
      .update(updateData)
      .eq("id", id)
      .eq("user_id", userId)
      .select()
      .single()

    if (error) {
      console.error("Error updating story:", error)
      return null
    }

    return data ? dbRowToStoryMetadata(data) : null
  } catch (error) {
    console.error("Error in updateStory:", error)
    return null
  }
}

export async function deleteStory(id: string, userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("stories")
      .delete()
      .eq("id", id)
      .eq("user_id", userId)

    if (error) {
      console.error("Error deleting story:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in deleteStory:", error)
    return false
  }
}

export async function updateWordCount(storyId: string, wordCount: number, userId: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("stories")
      .update({ current_word_count: wordCount })
      .eq("id", storyId)
      .eq("user_id", userId)

    if (error) {
      console.error("Error updating word count:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in updateWordCount:", error)
    return false
  }
}

export async function getStoriesByStatus(status: StoryMetadata["status"], userId: string): Promise<(StoryMetadata & { id: string })[]> {
  try {
    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .eq("user_id", userId)
      .eq("status", status)
      .order("updated_at", { ascending: false })

    if (error) {
      console.error("Error fetching stories by status:", error)
      return []
    }

    return data?.map(dbRowToStoryMetadata) || []
  } catch (error) {
    console.error("Error in getStoriesByStatus:", error)
    return []
  }
}

export async function getStoriesByGenre(genre: string, userId: string): Promise<(StoryMetadata & { id: string })[]> {
  try {
    const { data, error } = await supabase
      .from("stories")
      .select("*")
      .eq("user_id", userId)
      .eq("genre", genre)
      .order("updated_at", { ascending: false })

    if (error) {
      console.error("Error fetching stories by genre:", error)
      return []
    }

    return data?.map(dbRowToStoryMetadata) || []
  } catch (error) {
    console.error("Error in getStoriesByGenre:", error)
    return []
  }
}

export async function getStoryStats(storyId: string, userId: string): Promise<{
  chapterCount: number
  characterCount: number
  locationCount: number
  sceneCount: number
  imageCount: number
} | null> {
  try {
    // Get chapter count
    const { count: chapterCount, error: chapterError } = await supabase
      .from("chapters")
      .select("*", { count: "exact", head: true })
      .eq("story_id", storyId)

    if (chapterError) {
      console.error("Error getting chapter count:", chapterError)
      return null
    }

    // Get character count
    const { count: characterCount, error: characterError } = await supabase
      .from("characters")
      .select("*", { count: "exact", head: true })
      .eq("story_id", storyId)

    if (characterError) {
      console.error("Error getting character count:", characterError)
      return null
    }

    // Get location count
    const { count: locationCount, error: locationError } = await supabase
      .from("locations")
      .select("*", { count: "exact", head: true })
      .eq("story_id", storyId)

    if (locationError) {
      console.error("Error getting location count:", locationError)
      return null
    }

    // Get scene count (through chapters)
    const { data: chapters, error: sceneError } = await supabase
      .from("chapters")
      .select("id")
      .eq("story_id", storyId)

    if (sceneError) {
      console.error("Error getting chapters for scene count:", sceneError)
      return null
    }

    const chapterIds = chapters?.map(c => c.id) || []
    let sceneCount = 0

    if (chapterIds.length > 0) {
      const { count, error: sceneCountError } = await supabase
        .from("scenes")
        .select("*", { count: "exact", head: true })
        .in("chapter_id", chapterIds)

      if (sceneCountError) {
        console.error("Error getting scene count:", sceneCountError)
        return null
      }

      sceneCount = count || 0
    }

    // Get image count
    const { count: imageCount, error: imageError } = await supabase
      .from("story_images")
      .select("*", { count: "exact", head: true })
      .eq("story_id", storyId)

    if (imageError) {
      console.error("Error getting image count:", imageError)
      return null
    }

    return {
      chapterCount: chapterCount || 0,
      characterCount: characterCount || 0,
      locationCount: locationCount || 0,
      sceneCount,
      imageCount: imageCount || 0,
    }
  } catch (error) {
    console.error("Error in getStoryStats:", error)
    return null
  }
} 