export interface Chapter {
  slug: string
  title: string
  chapterNumber: number
  status: "draft" | "review" | "complete" | "published"
  wordCount: number
  pov: string
  location: string
  timeline: string
  summary: string
  content?: string
  scenes?: Scene[]
  characters?: string[]
  images?: string[]
  createdAt?: Date
  updatedAt?: Date
}

export interface Character {
  slug: string
  name: string
  role: string
  age: number
  status: "alive" | "deceased" | "missing" | "unknown"
  location: string
  affiliations: string[]
  relationships: string[]
  firstAppearance: string
  description?: string
  backstory?: string
  images?: string[]
  createdAt?: Date
  updatedAt?: Date
}

export interface Scene {
  id: string
  title: string
  slug: string
  order: number
  summary: string
  content: string
  chapterSlug: string
  characters?: string[]
  location?: string
  timeline?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface StoryMetadata {
  title: string
  author: string
  genre: string
  status: "planning" | "writing" | "editing" | "complete"
  wordCountGoal?: number
  currentWordCount: number
  createdAt: Date
  updatedAt: Date
}

export interface Location {
  slug: string
  name: string
  type: "city" | "building" | "landmark" | "region" | "other"
  description: string
  significance: string
  images?: string[]
  connectedChapters?: string[]
  connectedCharacters?: string[]
  parentLocation?: string
  climate?: string
  population?: string
  createdAt?: Date
  updatedAt?: Date
}

export interface StoryImage {
  id: string
  filename: string
  url: string
  alt: string
  type: "character" | "location" | "scene" | "reference"
  connectedTo: {
    characters?: string[]
    locations?: string[]
    chapters?: string[]
    scenes?: string[]
  }
  tags?: string[]
  createdAt: Date
}
