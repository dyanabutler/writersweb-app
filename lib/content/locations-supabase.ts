import { supabase } from "@/lib/supabase/client"
import type { Location } from "@/lib/types"
import type { Database } from "@/lib/supabase/database.types"

type LocationRow = Database["public"]["Tables"]["locations"]["Row"]

// Helper function to convert database row to Location type
function dbRowToLocation(row: LocationRow): Location {
  return {
    slug: row.slug,
    name: row.name,
    type: row.type || "other",
    description: row.description || "",
    significance: row.significance || "",
    parentLocation: row.parent_location || "",
    climate: row.climate || "",
    population: row.population || "",
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

export async function getAllLocations(storyId?: string): Promise<Location[]> {
  try {
    let query = supabase.from("locations").select("*").order("name", { ascending: true })

    if (storyId) {
      query = query.eq("story_id", storyId)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching locations:", error)
      return []
    }

    return data?.map(dbRowToLocation) || []
  } catch (error) {
    console.error("Error in getAllLocations:", error)
    return []
  }
}

export async function getLocationBySlug(slug: string, storyId?: string): Promise<Location | null> {
  try {
    let query = supabase.from("locations").select("*").eq("slug", slug).single()

    if (storyId) {
      query = query.eq("story_id", storyId)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching location:", error)
      return null
    }

    return data ? dbRowToLocation(data) : null
  } catch (error) {
    console.error("Error in getLocationBySlug:", error)
    return null
  }
}

export async function createLocation(
  location: Omit<Location, "slug" | "createdAt" | "updatedAt">,
  storyId: string,
): Promise<Location | null> {
  try {
    const slug = generateSlug(location.name)

    const { data, error } = await supabase
      .from("locations")
      .insert({
        story_id: storyId,
        slug,
        name: location.name,
        type: location.type,
        description: location.description,
        significance: location.significance,
        parent_location: location.parentLocation,
        climate: location.climate,
        population: location.population,
      })
      .select()
      .single()

    if (error) {
      console.error("Error creating location:", error)
      return null
    }

    return data ? dbRowToLocation(data) : null
  } catch (error) {
    console.error("Error in createLocation:", error)
    return null
  }
}

export async function updateLocation(
  slug: string,
  updates: Partial<Location>,
  storyId?: string,
): Promise<Location | null> {
  try {
    const updateData: any = {}

    if (updates.name) updateData.name = updates.name
    if (updates.type) updateData.type = updates.type
    if (updates.description) updateData.description = updates.description
    if (updates.significance) updateData.significance = updates.significance
    if (updates.parentLocation) updateData.parent_location = updates.parentLocation
    if (updates.climate) updateData.climate = updates.climate
    if (updates.population) updateData.population = updates.population

    let query = supabase.from("locations").update(updateData).eq("slug", slug)

    if (storyId) {
      query = query.eq("story_id", storyId)
    }

    const { data, error } = await query.select().single()

    if (error) {
      console.error("Error updating location:", error)
      return null
    }

    return data ? dbRowToLocation(data) : null
  } catch (error) {
    console.error("Error in updateLocation:", error)
    return null
  }
}

export async function deleteLocation(slug: string, storyId?: string): Promise<boolean> {
  try {
    let query = supabase.from("locations").delete().eq("slug", slug)

    if (storyId) {
      query = query.eq("story_id", storyId)
    }

    const { error } = await query

    if (error) {
      console.error("Error deleting location:", error)
      return false
    }

    return true
  } catch (error) {
    console.error("Error in deleteLocation:", error)
    return false
  }
}

export async function getLocationsByType(type: Location["type"], storyId?: string): Promise<Location[]> {
  try {
    let query = supabase.from("locations").select("*").eq("type", type)

    if (storyId) {
      query = query.eq("story_id", storyId)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching locations by type:", error)
      return []
    }

    return data?.map(dbRowToLocation) || []
  } catch (error) {
    console.error("Error in getLocationsByType:", error)
    return []
  }
}

export async function getLocationsByParent(parentLocation: string, storyId?: string): Promise<Location[]> {
  try {
    let query = supabase.from("locations").select("*").eq("parent_location", parentLocation)

    if (storyId) {
      query = query.eq("story_id", storyId)
    }

    const { data, error } = await query

    if (error) {
      console.error("Error fetching child locations:", error)
      return []
    }

    return data?.map(dbRowToLocation) || []
  } catch (error) {
    console.error("Error in getLocationsByParent:", error)
    return []
  }
} 