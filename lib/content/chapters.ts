import { supabase } from "@/lib/supabase/client"
import type { Chapter } from "@/lib/types"
import type { Database } from "@/lib/supabase/database.types"

type ChapterRow = Database["public"]["Tables"]["chapters"]["Row"]

// Helper function to convert database row to Chapter type
function dbRowToChapter(row: ChapterRow): Chapter {
  return {
    slug: row.slug,
    title: row.title,
    chapterNumber: row.chapter_number,
    status: row.status,
    wordCount: row.word_count,
    pov: row.pov || "",
    location: row.location || "",
    timeline: row.timeline || "",
    summary: row.summary || "",
    content: row.content || "",
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
  }
}

// Helper function to generate slug from title
function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
}

// For local/fallback mode, return empty data instead of mock data
export async function getAllChapters(): Promise<Chapter[]> {
  try {
    const { data, error } = await supabase
      .from("chapters")
      .select("*")
      .order("chapter_number", { ascending: true })

    if (error) {
      console.error("Error fetching chapters:", error)
      return []
    }

    return data?.map(dbRowToChapter) || []
  } catch (error) {
    console.error("Error in getAllChapters:", error)
    return []
  }
}

export async function getChapterBySlug(slug: string): Promise<Chapter | null> {
  try {
    const { data, error } = await supabase
      .from("chapters")
      .select("*")
      .eq("slug", slug)
      .single()

    if (error) {
      console.error("Error fetching chapter:", error)
      return null
    }

    return data ? dbRowToChapter(data) : null
  } catch (error) {
    console.error("Error in getChapterBySlug:", error)
    return null
  }
}

export async function createChapter(
  chapter: Omit<Chapter, "slug" | "createdAt" | "updatedAt">
): Promise<Chapter | null> {
  try {
    const slug = generateSlug(chapter.title)

    const { data, error } = await supabase
      .from("chapters")
      .insert({
        slug,
        title: chapter.title,
        chapter_number: chapter.chapterNumber,
        status: chapter.status,
        word_count: chapter.wordCount,
        pov: chapter.pov,
        location: chapter.location,
        timeline: chapter.timeline,
        summary: chapter.summary,
        content: chapter.content,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating chapter:", error)
      return null
    }

    return data ? dbRowToChapter(data) : null
  } catch (error) {
    console.error("Error in createChapter:", error)
    return null
  }
}

export async function updateChapter(
  slug: string,
  updates: Partial<Chapter>
): Promise<Chapter | null> {
  try {
    const updateData: any = {}

    if (updates.title) updateData.title = updates.title
    if (updates.chapterNumber) updateData.chapter_number = updates.chapterNumber
    if (updates.status) updateData.status = updates.status
    if (updates.wordCount !== undefined) updateData.word_count = updates.wordCount
    if (updates.pov) updateData.pov = updates.pov
    if (updates.location) updateData.location = updates.location
    if (updates.timeline) updateData.timeline = updates.timeline
    if (updates.summary) updateData.summary = updates.summary
    if (updates.content) updateData.content = updates.content

    const { data, error } = await supabase
      .from("chapters")
      .update(updateData)
      .eq("slug", slug)
      .select()
      .single()

    if (error) {
      console.error("Error updating chapter:", error)
      return null
    }

    return data ? dbRowToChapter(data) : null
  } catch (error) {
    console.error("Error in updateChapter:", error)
    return null
  }
}

export async function deleteChapter(slug: string): Promise<boolean> {
  try {
    const { error } = await supabase
      .from("chapters")
      .delete()
      .eq("slug", slug)

    if (error) {
      console.error("Error deleting chapter:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in deleteChapter:", error)
    return false
  }
}
