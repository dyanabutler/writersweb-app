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

export async function getAllChapters(storyId?: string): Promise<Chapter[]> {
  try {
    // For now, we'll use the first story if no storyId is provided
    // In a real app, you'd get this from context or props
    let query = supabase.from("chapters").select("*").order("chapter_number", { ascending: true })

    if (storyId) {
      query = query.eq("story_id", storyId)
    }

    const { data, error } = await query

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

export async function getChapterBySlug(slug: string, storyId?: string): Promise<Chapter | null> {
  try {
    let query = supabase.from("chapters").select("*").eq("slug", slug).single()

    if (storyId) {
      query = query.eq("story_id", storyId)
    }

    const { data, error } = await query

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
  chapter: Omit<Chapter, "slug" | "createdAt" | "updatedAt">,
  storyId: string,
): Promise<Chapter | null> {
  try {
    const slug = generateSlug(chapter.title)

    const { data, error } = await supabase
      .from("chapters")
      .insert({
        story_id: storyId,
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
  updates: Partial<Chapter>,
  storyId?: string,
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

    let query = supabase.from("chapters").update(updateData).eq("slug", slug)

    if (storyId) {
      query = query.eq("story_id", storyId)
    }

    const { data, error } = await query.select().single()

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

export async function deleteChapter(slug: string, storyId?: string): Promise<boolean> {
  try {
    let query = supabase.from("chapters").delete().eq("slug", slug)

    if (storyId) {
      query = query.eq("story_id", storyId)
    }

    const { error } = await query

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
