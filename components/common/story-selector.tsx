"use client"

import { useState, useEffect } from "react"
import { Check, ChevronDown, Plus, BookOpen } from "lucide-react"
import { useDataLayerContext } from "@/lib/content/data-layer"
import type { StoryMetadata } from "@/lib/types"
import { Button } from "@/components/ui/button"
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
} from "@/components/ui/command"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"

interface StorySelectorProps {
  selectedStoryId?: string
  onStorySelect: (story: StoryMetadata & { id: string }) => void
}

export function StorySelector({ selectedStoryId, onStorySelect }: StorySelectorProps) {
  const { dataLayer, isLocal, isPro, isLoading } = useDataLayerContext()
  const [open, setOpen] = useState(false)
  const [stories, setStories] = useState<(StoryMetadata & { id: string })[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadStories() {
      try {
        const fetchedStories = await dataLayer.getAllStories()
        setStories(fetchedStories)
        
        // Auto-select first story if none selected
        if (!selectedStoryId && fetchedStories.length > 0) {
          onStorySelect(fetchedStories[0])
        }
      } catch (error) {
        console.error("Error loading stories:", error)
      } finally {
        setLoading(false)
      }
    }

    loadStories()
  }, [dataLayer, selectedStoryId, onStorySelect])

  const selectedStory = stories.find(story => story.id === selectedStoryId)

  const handleCreateStory = async () => {
    // This would open a create story dialog
    // For now, just create a default story
    const newStory = await dataLayer.createStory({
      title: `New Story ${stories.length + 1}`,
      author: "Unknown Author",
      genre: "",
      status: "planning",
      currentWordCount: 0,
      featured: false,
    })

    if (newStory) {
      setStories(prev => [newStory, ...prev])
      onStorySelect(newStory)
    }
    setOpen(false)
  }

  if (isLoading || loading) {
    return (
      <div className="flex items-center gap-2">
        <div className="animate-pulse w-6 h-6 bg-gray-300 rounded"></div>
        <div className="animate-pulse w-32 h-4 bg-gray-300 rounded"></div>
      </div>
    )
  }

  // For local/free users, show simple story indicator
  if (isLocal) {
    return (
      <div className="flex items-center gap-2">
        <BookOpen className="w-5 h-5 text-gray-600" />
        <span className="font-medium text-gray-900">
          {selectedStory?.title || "My Story"}
        </span>
        <Badge variant="secondary">Local</Badge>
      </div>
    )
  }

  // For pro users, show story selector dropdown
  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          role="combobox"
          aria-expanded={open}
          className="w-[300px] justify-between"
        >
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4" />
            <span className="truncate">
              {selectedStory?.title || "Select a story..."}
            </span>
          </div>
          <ChevronDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[300px] p-0">
        <Command>
          <CommandInput placeholder="Search stories..." />
          <CommandEmpty>No stories found.</CommandEmpty>
          <CommandGroup>
            {stories.map((story) => (
              <CommandItem
                key={story.id}
                onSelect={() => {
                  onStorySelect(story)
                  setOpen(false)
                }}
              >
                <div className="flex-1 space-y-1">
                  <div className="flex items-center justify-between">
                    <span className="font-medium">{story.title}</span>
                    <Check
                      className={cn(
                        "ml-2 h-4 w-4",
                        selectedStoryId === story.id ? "opacity-100" : "opacity-0"
                      )}
                    />
                  </div>
                  <div className="flex items-center gap-2 text-xs text-gray-500">
                    <Badge variant="outline" className="text-xs">
                      {story.status}
                    </Badge>
                    <span>{story.currentWordCount.toLocaleString()} words</span>
                    {story.genre && <span>• {story.genre}</span>}
                  </div>
                </div>
              </CommandItem>
            ))}
          </CommandGroup>
          <div className="border-t p-2">
            <Button
              variant="ghost"
              size="sm"
              className="w-full justify-start"
              onClick={handleCreateStory}
            >
              <Plus className="w-4 h-4 mr-2" />
              Create New Story
            </Button>
          </div>
        </Command>
      </PopoverContent>
    </Popover>
  )
} 