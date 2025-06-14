import type { Chapter } from "@/lib/types"

// Mock data - in a real app, this would come from your file system or database
const mockChapters: Chapter[] = [
  {
    slug: "the-beginning",
    title: "The Beginning",
    chapterNumber: 1,
    status: "complete",
    wordCount: 2500,
    pov: "John",
    location: "Village Square",
    timeline: "Day 1",
    summary: "Our hero begins his journey in the small village where he grew up.",
    content: "# The Beginning\n\nIt was a day like any other...",
  },
  {
    slug: "the-call",
    title: "The Call to Adventure",
    chapterNumber: 2,
    status: "review",
    wordCount: 3200,
    pov: "John",
    location: "Village Outskirts",
    timeline: "Day 1 - Evening",
    summary: "A mysterious stranger arrives with urgent news.",
    content: "# The Call to Adventure\n\nAs the sun set...",
  },
  {
    slug: "the-discovery",
    title: "The Discovery",
    chapterNumber: 3,
    status: "draft",
    wordCount: 1800,
    pov: "John",
    location: "Ancient Forest",
    timeline: "Day 2",
    summary: "Hidden secrets are revealed in the ancient forest.",
    content: "# The Discovery\n\nThe forest was darker than expected...",
  },
]

export async function getAllChapters(): Promise<Chapter[]> {
  // Simulate API delay
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockChapters.sort((a, b) => a.chapterNumber - b.chapterNumber)
}

export async function getChapterBySlug(slug: string): Promise<Chapter | null> {
  await new Promise((resolve) => setTimeout(resolve, 100))
  return mockChapters.find((chapter) => chapter.slug === slug) || null
}

export async function createChapter(chapter: Omit<Chapter, "slug">): Promise<Chapter> {
  const slug = chapter.title
    .toLowerCase()
    .replace(/\s+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
  const newChapter: Chapter = {
    ...chapter,
    slug,
    createdAt: new Date(),
    updatedAt: new Date(),
  }

  mockChapters.push(newChapter)
  return newChapter
}

export async function updateChapter(slug: string, updates: Partial<Chapter>): Promise<Chapter | null> {
  const index = mockChapters.findIndex((chapter) => chapter.slug === slug)
  if (index === -1) return null

  mockChapters[index] = {
    ...mockChapters[index],
    ...updates,
    updatedAt: new Date(),
  }

  return mockChapters[index]
}

export async function deleteChapter(slug: string): Promise<boolean> {
  const index = mockChapters.findIndex((chapter) => chapter.slug === slug)
  if (index === -1) return false

  mockChapters.splice(index, 1)
  return true
}
