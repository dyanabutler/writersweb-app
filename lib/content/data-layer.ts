import { useUser } from "@clerk/nextjs"
import { createContext, useContext, ReactNode } from "react"
import type { Chapter, Character, Location, Scene, StoryImage, StoryMetadata } from "@/lib/types"

// Local imports
import * as chaptersLocal from "./chapters"
import * as charactersLocal from "./characters"
import * as locationsLocal from "./locations"
import * as imagesLocal from "./images"

// Supabase imports
import * as chaptersSupabase from "./chapters-supabase"
import * as charactersSupabase from "./characters-supabase"
import * as locationsSupabase from "./locations-supabase"
import * as scenesSupabase from "./scenes-supabase"
import * as imagesSupabase from "./images-supabase"
import * as storiesSupabase from "./stories-supabase"

// Types for the unified interface
export interface DataLayerInterface {
  // Story management
  getAllStories(): Promise<(StoryMetadata & { id: string })[]>
  createStory(story: Omit<StoryMetadata, "createdAt" | "updatedAt">): Promise<(StoryMetadata & { id: string }) | null>
  updateStory(id: string, updates: Partial<StoryMetadata>): Promise<(StoryMetadata & { id: string }) | null>
  deleteStory(id: string): Promise<boolean>
  
  // Chapters
  getAllChapters(storyId?: string): Promise<Chapter[]>
  getChapterBySlug(slug: string, storyId?: string): Promise<Chapter | null>
  createChapter(chapter: Omit<Chapter, "slug" | "createdAt" | "updatedAt">, storyId?: string): Promise<Chapter | null>
  updateChapter(slug: string, updates: Partial<Chapter>, storyId?: string): Promise<Chapter | null>
  deleteChapter(slug: string, storyId?: string): Promise<boolean>
  
  // Characters
  getAllCharacters(storyId?: string): Promise<Character[]>
  getCharacterBySlug(slug: string, storyId?: string): Promise<Character | null>
  createCharacter(character: Omit<Character, "slug" | "createdAt" | "updatedAt">, storyId?: string): Promise<Character | null>
  updateCharacter(slug: string, updates: Partial<Character>, storyId?: string): Promise<Character | null>
  deleteCharacter(slug: string, storyId?: string): Promise<boolean>
  
  // Locations
  getAllLocations(storyId?: string): Promise<Location[]>
  getLocationBySlug(slug: string, storyId?: string): Promise<Location | null>
  createLocation(location: Omit<Location, "slug" | "createdAt" | "updatedAt">, storyId?: string): Promise<Location | null>
  updateLocation(slug: string, updates: Partial<Location>, storyId?: string): Promise<Location | null>
  deleteLocation(slug: string, storyId?: string): Promise<boolean>
  
  // Scenes
  getAllScenes(chapterId?: string): Promise<Scene[]>
  getSceneBySlug(slug: string, chapterId?: string): Promise<Scene | null>
  createScene(scene: Omit<Scene, "id" | "slug" | "createdAt" | "updatedAt">, chapterId?: string): Promise<Scene | null>
  updateScene(slug: string, updates: Partial<Scene>, chapterId?: string): Promise<Scene | null>
  deleteScene(slug: string, chapterId?: string): Promise<boolean>
  
  // Images
  getAllImages(storyId?: string): Promise<StoryImage[]>
  uploadImage(file: File, storyId: string, imageData: Omit<StoryImage, "id" | "url" | "filename" | "createdAt">): Promise<StoryImage | null>
  deleteImage(id: string): Promise<boolean>
}

// Helper function to check if user is pro
function isProUser(user: any): boolean {
  return user?.publicMetadata?.subscription === 'pro' || 
         user?.publicMetadata?.subscriptionStatus === 'active'
}

// Local storage fallback for free users
class LocalDataLayer implements DataLayerInterface {
  // Story management (local uses single story concept)
  async getAllStories(): Promise<(StoryMetadata & { id: string })[]> {
    // For local storage, we simulate a single story
    return [{
      id: 'local-story',
      title: 'My Story',
      author: 'Unknown Author',
      genre: '',
      status: 'planning' as const,
      currentWordCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
    }]
  }
  
  async createStory(story: Omit<StoryMetadata, "createdAt" | "updatedAt">): Promise<(StoryMetadata & { id: string }) | null> {
    // For local, just return the story with a static ID
    return {
      id: 'local-story',
      ...story,
      createdAt: new Date(),
      updatedAt: new Date(),
    }
  }
  
  async updateStory(id: string, updates: Partial<StoryMetadata>): Promise<(StoryMetadata & { id: string }) | null> {
    // For local, simulate successful update
    return {
      id: 'local-story',
      title: 'My Story',
      author: 'Unknown Author',
      genre: '',
      status: 'planning' as const,
      currentWordCount: 0,
      createdAt: new Date(),
      updatedAt: new Date(),
      ...updates,
    }
  }
  
  async deleteStory(id: string): Promise<boolean> {
    // For local, always return true (can't really delete the single story)
    return true
  }

  // Chapters
  async getAllChapters(): Promise<Chapter[]> {
    return chaptersLocal.getAllChapters()
  }
  
  async getChapterBySlug(slug: string): Promise<Chapter | null> {
    return chaptersLocal.getChapterBySlug(slug)
  }
  
  async createChapter(chapter: Omit<Chapter, "slug" | "createdAt" | "updatedAt">): Promise<Chapter | null> {
    return chaptersLocal.createChapter(chapter)
  }
  
  async updateChapter(slug: string, updates: Partial<Chapter>): Promise<Chapter | null> {
    return chaptersLocal.updateChapter(slug, updates)
  }
  
  async deleteChapter(slug: string): Promise<boolean> {
    return chaptersLocal.deleteChapter(slug)
  }

  // Characters
  async getAllCharacters(): Promise<Character[]> {
    return charactersLocal.getAllCharacters()
  }
  
  async getCharacterBySlug(slug: string): Promise<Character | null> {
    return charactersLocal.getCharacterBySlug(slug)
  }
  
  async createCharacter(character: Omit<Character, "slug" | "createdAt" | "updatedAt">): Promise<Character | null> {
    return charactersLocal.createCharacter(character)
  }
  
  async updateCharacter(slug: string, updates: Partial<Character>): Promise<Character | null> {
    return charactersLocal.updateCharacter(slug, updates)
  }
  
  async deleteCharacter(slug: string): Promise<boolean> {
    return charactersLocal.deleteCharacter(slug)
  }

  // Locations
  async getAllLocations(): Promise<Location[]> {
    return locationsLocal.getAllLocations()
  }
  
  async getLocationBySlug(slug: string): Promise<Location | null> {
    return locationsLocal.getLocationBySlug(slug)
  }
  
  async createLocation(location: Omit<Location, "slug" | "createdAt" | "updatedAt">): Promise<Location | null> {
    return locationsLocal.createLocation(location)
  }
  
  async updateLocation(slug: string, updates: Partial<Location>): Promise<Location | null> {
    return locationsLocal.updateLocation(slug, updates)
  }
  
  async deleteLocation(slug: string): Promise<boolean> {
    return locationsLocal.deleteLocation(slug)
  }

  // Scenes - fallback to empty for local
  async getAllScenes(): Promise<Scene[]> {
    return []
  }
  
  async getSceneBySlug(): Promise<Scene | null> {
    return null
  }
  
  async createScene(): Promise<Scene | null> {
    return null
  }
  
  async updateScene(): Promise<Scene | null> {
    return null
  }
  
  async deleteScene(): Promise<boolean> {
    return false
  }

  // Images
  async getAllImages(): Promise<StoryImage[]> {
    return imagesLocal.getAllImages()
  }
  
  async uploadImage(): Promise<StoryImage | null> {
    // Local image upload not implemented - return null
    return null
  }
  
  async deleteImage(): Promise<boolean> {
    return false
  }
}

// Cloud storage for pro users
class CloudDataLayer implements DataLayerInterface {
  constructor(private userId: string) {}

  // Stories
  async getAllStories(): Promise<(StoryMetadata & { id: string })[]> {
    return storiesSupabase.getAllStories(this.userId)
  }
  
  async createStory(story: Omit<StoryMetadata, "createdAt" | "updatedAt">): Promise<(StoryMetadata & { id: string }) | null> {
    return storiesSupabase.createStory(story, this.userId)
  }
  
  async updateStory(id: string, updates: Partial<StoryMetadata>): Promise<(StoryMetadata & { id: string }) | null> {
    return storiesSupabase.updateStory(id, updates, this.userId)
  }
  
  async deleteStory(id: string): Promise<boolean> {
    return storiesSupabase.deleteStory(id, this.userId)
  }

  // Chapters
  async getAllChapters(storyId?: string): Promise<Chapter[]> {
    return chaptersSupabase.getAllChapters(storyId)
  }
  
  async getChapterBySlug(slug: string, storyId?: string): Promise<Chapter | null> {
    return chaptersSupabase.getChapterBySlug(slug, storyId)
  }
  
  async createChapter(chapter: Omit<Chapter, "slug" | "createdAt" | "updatedAt">, storyId?: string): Promise<Chapter | null> {
    if (!storyId) throw new Error("Story ID is required for cloud storage")
    return chaptersSupabase.createChapter(chapter, storyId)
  }
  
  async updateChapter(slug: string, updates: Partial<Chapter>, storyId?: string): Promise<Chapter | null> {
    return chaptersSupabase.updateChapter(slug, updates, storyId)
  }
  
  async deleteChapter(slug: string, storyId?: string): Promise<boolean> {
    return chaptersSupabase.deleteChapter(slug, storyId)
  }

  // Characters
  async getAllCharacters(storyId?: string): Promise<Character[]> {
    return charactersSupabase.getAllCharacters(storyId)
  }
  
  async getCharacterBySlug(slug: string, storyId?: string): Promise<Character | null> {
    return charactersSupabase.getCharacterBySlug(slug, storyId)
  }
  
  async createCharacter(character: Omit<Character, "slug" | "createdAt" | "updatedAt">, storyId?: string): Promise<Character | null> {
    if (!storyId) throw new Error("Story ID is required for cloud storage")
    return charactersSupabase.createCharacter(character, storyId, this.userId)
  }
  
  async updateCharacter(slug: string, updates: Partial<Character>, storyId?: string): Promise<Character | null> {
    return charactersSupabase.updateCharacter(slug, updates, storyId)
  }
  
  async deleteCharacter(slug: string, storyId?: string): Promise<boolean> {
    return charactersSupabase.deleteCharacter(slug, storyId)
  }

  // Locations
  async getAllLocations(storyId?: string): Promise<Location[]> {
    return locationsSupabase.getAllLocations(storyId)
  }
  
  async getLocationBySlug(slug: string, storyId?: string): Promise<Location | null> {
    return locationsSupabase.getLocationBySlug(slug, storyId)
  }
  
  async createLocation(location: Omit<Location, "slug" | "createdAt" | "updatedAt">, storyId?: string): Promise<Location | null> {
    if (!storyId) throw new Error("Story ID is required for cloud storage")
    return locationsSupabase.createLocation(location, storyId, this.userId)
  }
  
  async updateLocation(slug: string, updates: Partial<Location>, storyId?: string): Promise<Location | null> {
    return locationsSupabase.updateLocation(slug, updates, storyId)
  }
  
  async deleteLocation(slug: string, storyId?: string): Promise<boolean> {
    return locationsSupabase.deleteLocation(slug, storyId)
  }

  // Scenes
  async getAllScenes(chapterId?: string): Promise<Scene[]> {
    return scenesSupabase.getAllScenes(chapterId)
  }
  
  async getSceneBySlug(slug: string, chapterId?: string): Promise<Scene | null> {
    return scenesSupabase.getSceneBySlug(slug, chapterId)
  }
  
  async createScene(scene: Omit<Scene, "id" | "slug" | "createdAt" | "updatedAt">, chapterId?: string): Promise<Scene | null> {
    if (!chapterId) throw new Error("Chapter ID is required for cloud storage")
    return scenesSupabase.createScene(scene, chapterId, this.userId)
  }
  
  async updateScene(slug: string, updates: Partial<Scene>, chapterId?: string): Promise<Scene | null> {
    return scenesSupabase.updateScene(slug, updates, chapterId)
  }
  
  async deleteScene(slug: string, chapterId?: string): Promise<boolean> {
    return scenesSupabase.deleteScene(slug, chapterId)
  }

  // Images
  async getAllImages(storyId?: string): Promise<StoryImage[]> {
    return imagesSupabase.getAllImages(storyId)
  }
  
  async uploadImage(file: File, storyId: string, imageData: Omit<StoryImage, "id" | "url" | "filename" | "createdAt">): Promise<StoryImage | null> {
    return imagesSupabase.uploadImage(file, storyId, imageData)
  }
  
  async deleteImage(id: string): Promise<boolean> {
    return imagesSupabase.deleteImage(id)
  }
}

// Hook to get the appropriate data layer
export function useDataLayer(): {
  dataLayer: DataLayerInterface
  isLocal: boolean
  isPro: boolean
  isLoading: boolean
} {
  const { user, isLoaded } = useUser()
  
  const isPro = user ? isProUser(user) : false
  const isLocal = !isPro
  
  const dataLayer = isPro && user ? 
    new CloudDataLayer(user.id) : 
    new LocalDataLayer()

  return {
    dataLayer,
    isLocal,
    isPro,
    isLoading: !isLoaded,
  }
}

// Context for data layer (exported for use in .tsx files)
export const DataLayerContext = createContext<{
  dataLayer: DataLayerInterface
  isLocal: boolean
  isPro: boolean
  isLoading: boolean
} | null>(null)

export function useDataLayerContext() {
  const context = useContext(DataLayerContext)
  if (!context) {
    throw new Error("useDataLayerContext must be used within a DataLayerProvider")
  }
  return context
} 