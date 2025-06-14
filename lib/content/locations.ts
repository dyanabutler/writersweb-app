import type { Location } from "@/lib/types"

// Mock data - in a real app, this would come from your file system or database
const mockLocations: Location[] = [
  {
    slug: "village-square",
    name: "Village Square",
    type: "landmark",
    description:
      "The heart of the small village where our story begins. A cobblestone square surrounded by shops and the old well.",
    significance: "This is where John first meets the mysterious stranger who changes his life.",
    images: ["/placeholder.svg?height=400&width=600&text=Village+Square"],
    connectedChapters: ["the-beginning", "the-call"],
    connectedCharacters: ["john-hero", "mary-companion"],
    climate: "Temperate, mild seasons",
    population: "Village center, ~50 people daily",
  },
  {
    slug: "ancient-forest",
    name: "Ancient Forest",
    type: "region",
    description:
      "A mysterious forest that has stood for thousands of years. The trees are massive and the canopy blocks most sunlight.",
    significance: "Contains ancient secrets and magical artifacts crucial to the story.",
    images: ["/placeholder.svg?height=400&width=600&text=Ancient+Forest"],
    connectedChapters: ["the-discovery"],
    connectedCharacters: ["john-hero"],
    climate: "Cool and damp, perpetual twilight",
    population: "Uninhabited by humans",
  },
  {
    slug: "dark-castle",
    name: "Dark Castle",
    type: "building",
    description: "A foreboding fortress built on a mountain peak, shrouded in perpetual storm clouds.",
    significance: "The stronghold of the Dark Lord and the final destination of our hero's journey.",
    images: ["/placeholder.svg?height=400&width=600&text=Dark+Castle"],
    connectedChapters: [],
    connectedCharacters: ["dark-lord"],
    climate: "Stormy, cold, perpetual darkness",
    population: "Dark Lord and his minions",
  },
]

export async function getAllLocations(): Promise<Location[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockLocations.sort((a, b) => a.name.localeCompare(b.name))
}

export async function getLocationBySlug(slug: string): Promise<Location | null> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockLocations.find((location) => location.slug === slug) || null
}

export async function createLocation(location: Omit<Location, "slug">): Promise<Location> {
  const slug = location.name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
  const newLocation: Location = {
    ...location,
    slug,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  mockLocations.push(newLocation)
  return newLocation
}

export async function updateLocation(slug: string, updates: Partial<Location>): Promise<Location | null> {
  const index = mockLocations.findIndex((location) => location.slug === slug)
  if (index === -1) return null

  mockLocations[index] = {
    ...mockLocations[index],
    ...updates,
    updatedAt: new Date(),
  }

  return mockLocations[index]
}

export async function deleteLocation(slug: string): Promise<boolean> {
  const index = mockLocations.findIndex((location) => location.slug === slug)
  if (index === -1) return false

  mockLocations.splice(index, 1)
  return true
}
