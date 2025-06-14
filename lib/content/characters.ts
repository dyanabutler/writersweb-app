import type { Character } from "@/lib/types"

// Mock data - in a real app, this would come from your file system or database
const mockCharacters: Character[] = [
  {
    slug: "john-hero",
    name: "John",
    role: "Protagonist",
    age: 25,
    status: "alive",
    location: "Village Square",
    affiliations: ["Village Guard", "Heroes Guild"],
    relationships: ["Mary - Love Interest", "Elder - Mentor"],
    firstAppearance: "Chapter 1",
    description: "A brave young man with a mysterious past.",
    backstory: "Orphaned at a young age, raised by the village elder.",
    images: ["/placeholder.svg?height=400&width=400&text=John+Portrait"], // Add this line
  },
  {
    slug: "mary-companion",
    name: "Mary",
    role: "Supporting Character",
    age: 23,
    status: "alive",
    location: "Village Square",
    affiliations: ["Village Healers"],
    relationships: ["John - Love Interest", "Elder - Teacher"],
    firstAppearance: "Chapter 1",
    description: "A skilled healer with a kind heart.",
    backstory: "Daughter of the village healer, trained in ancient arts.",
    images: ["/placeholder.svg?height=400&width=400&text=Mary+Healer"], // Add this line
  },
  {
    slug: "dark-lord",
    name: "Dark Lord Malachar",
    role: "Antagonist",
    age: 500,
    status: "alive",
    location: "Dark Castle",
    affiliations: ["Shadow Legion", "Dark Sorcerers"],
    relationships: ["John - Enemy", "Shadow General - Lieutenant"],
    firstAppearance: "Chapter 5",
    description: "An ancient evil seeking to conquer the realm.",
    backstory: "Once a noble wizard, corrupted by dark magic centuries ago.",
    images: ["/placeholder.svg?height=400&width=400&text=Dark+Lord"], // Add this line
  },
]

export async function getAllCharacters(): Promise<Character[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockCharacters.sort((a, b) => a.name.localeCompare(b.name))
}

export async function getCharacterBySlug(slug: string): Promise<Character | null> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockCharacters.find((character) => character.slug === slug) || null
}

export async function createCharacter(character: Omit<Character, "slug">): Promise<Character> {
  const slug = character.name
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
  const newCharacter: Character = {
    ...character,
    slug,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  mockCharacters.push(newCharacter)
  return newCharacter
}

export async function updateCharacter(slug: string, updates: Partial<Character>): Promise<Character | null> {
  const index = mockCharacters.findIndex((character) => character.slug === slug)
  if (index === -1) return null

  mockCharacters[index] = {
    ...mockCharacters[index],
    ...updates,
    updatedAt: new Date(),
  }

  return mockCharacters[index]
}

export async function deleteCharacter(slug: string): Promise<boolean> {
  const index = mockCharacters.findIndex((character) => character.slug === slug)
  if (index === -1) return false

  mockCharacters.splice(index, 1)
  return true
}
