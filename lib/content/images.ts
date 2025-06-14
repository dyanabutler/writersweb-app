import type { StoryImage } from "@/lib/types"

// Mock data - in a real app, this would come from your file system or database
const mockImages: StoryImage[] = [
  {
    id: "1",
    filename: "john-portrait.jpg",
    url: "/placeholder.svg?height=400&width=400&text=John+Portrait",
    alt: "John - Hero Portrait",
    type: "character",
    connectedTo: {
      characters: ["john-hero"],
      chapters: ["the-beginning"],
    },
    tags: ["portrait", "hero", "main character"],
    createdAt: new Date("2024-01-01"),
  },
  {
    id: "2",
    filename: "village-square.jpg",
    url: "/placeholder.svg?height=400&width=600&text=Village+Square",
    alt: "Village Square at Dawn",
    type: "location",
    connectedTo: {
      locations: ["village-square"],
      chapters: ["the-beginning", "the-call"],
    },
    tags: ["village", "square", "dawn", "setting"],
    createdAt: new Date("2024-01-02"),
  },
  {
    id: "3",
    filename: "mary-healer.jpg",
    url: "/placeholder.svg?height=400&width=400&text=Mary+Healer",
    alt: "Mary the Healer",
    type: "character",
    connectedTo: {
      characters: ["mary-companion"],
      locations: ["village-square"],
    },
    tags: ["portrait", "healer", "supporting character"],
    createdAt: new Date("2024-01-03"),
  },
  {
    id: "4",
    filename: "ancient-forest.jpg",
    url: "/placeholder.svg?height=400&width=600&text=Ancient+Forest",
    alt: "The Ancient Forest",
    type: "location",
    connectedTo: {
      locations: ["ancient-forest"],
      chapters: ["the-discovery"],
      characters: ["john-hero"],
    },
    tags: ["forest", "ancient", "mysterious", "trees"],
    createdAt: new Date("2024-01-04"),
  },
  {
    id: "5",
    filename: "dark-lord.jpg",
    url: "/placeholder.svg?height=400&width=400&text=Dark+Lord",
    alt: "Dark Lord Malachar",
    type: "character",
    connectedTo: {
      characters: ["dark-lord"],
      locations: ["dark-castle"],
    },
    tags: ["villain", "dark lord", "antagonist", "evil"],
    createdAt: new Date("2024-01-05"),
  },
  {
    id: "6",
    filename: "magic-artifact.jpg",
    url: "/placeholder.svg?height=300&width=300&text=Magic+Artifact",
    alt: "Ancient Magic Artifact",
    type: "reference",
    connectedTo: {
      chapters: ["the-discovery"],
      locations: ["ancient-forest"],
    },
    tags: ["magic", "artifact", "ancient", "power"],
    createdAt: new Date("2024-01-06"),
  },
]

export async function getAllImages(): Promise<StoryImage[]> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockImages.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
}

export async function getImageById(id: string): Promise<StoryImage | null> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockImages.find((image) => image.id === id) || null
}

export async function createImage(image: Omit<StoryImage, "id" | "createdAt">): Promise<StoryImage> {
  const newImage: StoryImage = {
    ...image,
    id: Date.now().toString(),
    createdAt: new Date(),
  }

  mockImages.push(newImage)
  return newImage
}

export async function updateImage(id: string, updates: Partial<StoryImage>): Promise<StoryImage | null> {
  const index = mockImages.findIndex((image) => image.id === id)
  if (index === -1) return null

  mockImages[index] = {
    ...mockImages[index],
    ...updates,
  }

  return mockImages[index]
}

export async function deleteImage(id: string): Promise<boolean> {
  const index = mockImages.findIndex((image) => image.id === id)
  if (index === -1) return false

  mockImages.splice(index, 1)
  return true
}
