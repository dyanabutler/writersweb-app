import { supabase } from "@/lib/supabase/client"
import type { Scene } from "@/lib/types"
import type { Database } from "@/lib/supabase/database.types"

type SceneRow = Database["public"]["Tables"]["scenes"]["Row"]

// Helper function to convert database row to Scene type
function dbRowToScene(row: SceneRow): Scene {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    order: row.order_index,
    summary: row.summary || "",
    content: row.content || "",
    chapterSlug: row.chapter_id, // Note: This would need proper join to get chapter slug
    characters: row.characters || [],
    location: row.location || "",
    timeline: row.timeline || "",
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

export async function getAllScenes(chapterId?: string): Promise<Scene[]> {
  try {
    let query = supabase.from("scenes").select("*").order("order_index", { ascending: true })

    if (chapterId) {
      query = query.eq("chapter_id", chapterId)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching scenes:", error)
      return []
    }

    return data?.map(dbRowToScene) || []
  } catch (error) {
    console.error("Error in getAllScenes:", error)
    return []
  }
}

export async function getSceneBySlug(slug: string, chapterId?: string): Promise<Scene | null> {
  try {
    let query = supabase.from("scenes").select("*").eq("slug", slug).single()

    if (chapterId) {
      query = query.eq("chapter_id", chapterId)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching scene:", error)
      return null
    }

    return data ? dbRowToScene(data) : null
  } catch (error) {
    console.error("Error in getSceneBySlug:", error)
    return null
  }
}

export async function createScene(
  scene: Omit<Scene, "id" | "slug" | "createdAt" | "updatedAt">,
  chapterId: string,
): Promise<Scene | null> {
  try {
    const slug = generateSlug(scene.title)

    const { data, error } = await supabase
      .from("scenes")
      .insert({
        chapter_id: chapterId,
        slug,
        title: scene.title,
        order_index: scene.order,
        summary: scene.summary,
        content: scene.content,
        characters: scene.characters,
        location: scene.location,
        timeline: scene.timeline,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating scene:", error)
      return null
    }

    return data ? dbRowToScene(data) : null
  } catch (error) {
    console.error("Error in createScene:", error)
    return null
  }
}

export async function updateScene(
  slug: string,
  updates: Partial<Scene>,
  chapterId?: string,
): Promise<Scene | null> {
  try {
    const updateData: any = {}

    if (updates.title) updateData.title = updates.title
    if (updates.order !== undefined) updateData.order_index = updates.order
    if (updates.summary) updateData.summary = updates.summary
    if (updates.content) updateData.content = updates.content
    if (updates.characters) updateData.characters = updates.characters
    if (updates.location) updateData.location = updates.location
    if (updates.timeline) updateData.timeline = updates.timeline

    let query = supabase.from("scenes").update(updateData).eq("slug", slug)

    if (chapterId) {
      query = query.eq("chapter_id", chapterId)
    }

    const { data, error } = await query.select().single()

    if (error) {
      console.error("Error updating scene:", error)
      return null
    }

    return data ? dbRowToScene(data) : null
  } catch (error) {
    console.error("Error in updateScene:", error)
    return null
  }
}

export async function deleteScene(slug: string, chapterId?: string): Promise<boolean> {
  try {
    let query = supabase.from("scenes").delete().eq("slug", slug)

    if (chapterId) {
      query = query.eq("chapter_id", chapterId)
    }

    const { error } = await query

    if (error) {
      console.error("Error deleting scene:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in deleteScene:", error)
    return false
  }
}

export async function getScenesByLocation(location: string, chapterId?: string): Promise<Scene[]> {
  try {
    let query = supabase.from("scenes").select("*").eq("location", location)

    if (chapterId) {
      query = query.eq("chapter_id", chapterId)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching scenes by location:", error)
      return []
    }

    return data?.map(dbRowToScene) || []
  } catch (error) {
    console.error("Error in getScenesByLocation:", error)
    return []
  }
}

export async function reorderScenes(chapterId: string, sceneOrders: { slug: string; order: number }[]): Promise<boolean> {
  try {
    // Update all scenes with their new order
    const updates = sceneOrders.map(({ slug, order }) =>
      supabase.from("scenes").update({ order_index: order }).eq("slug", slug).eq("chapter_id", chapterId)
    )

    const results = await Promise.all(updates)
    
    // Check if any updates failed
    const hasErrors = results.some(result => result.error)
    
    if (hasErrors) {
      console.error("Error reordering scenes")
      return false
    }

    return true
  } catch (error) {
    console.error("Error in reorderScenes:", error)
    return false
  }
} 