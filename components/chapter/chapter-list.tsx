"use client"

import { useState, useEffect } from "react"
import { ChapterCard } from "./chapter-card"
import { ChapterOrderModal } from "./chapter-order-modal"
import { Button } from "@/components/ui/button"
import { ArrowUpDown } from "lucide-react"
import type { Chapter } from "@/lib/types"
import { getAllChapters } from "@/lib/content/chapters"

export function ChapterList() {
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [showOrderModal, setShowOrderModal] = useState(false)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadChapters = async () => {
      try {
        const chapterData = await getAllChapters()
        setChapters(chapterData)
      } catch (error) {
        console.error("Failed to load chapters:", error)
      } finally {
        setLoading(false)
      }
    }

    loadChapters()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading chapters...</div>
  }

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <p className="text-gray-600">{chapters.length} chapters</p>
        <Button variant="primary-outline" onClick={() => setShowOrderModal(true)}>
          <ArrowUpDown className="w-4 h-4 mr-2" />
          Reorder Chapters
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {chapters.map((chapter) => (
          <ChapterCard key={chapter.slug} chapter={chapter} />
        ))}
      </div>

      {showOrderModal && (
        <ChapterOrderModal chapters={chapters} onClose={() => setShowOrderModal(false)} onReorder={setChapters} />
      )}
    </div>
  )
}
