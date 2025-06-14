"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import type { Chapter } from "@/lib/types"
import { GripVertical, X } from "lucide-react"

interface ChapterOrderModalProps {
  chapters: Chapter[]
  onClose: () => void
  onReorder: (chapters: Chapter[]) => void
}

export function ChapterOrderModal({ chapters, onClose, onReorder }: ChapterOrderModalProps) {
  const [orderedChapters, setOrderedChapters] = useState(chapters)

  const moveChapter = (fromIndex: number, toIndex: number) => {
    const newChapters = [...orderedChapters]
    const [movedChapter] = newChapters.splice(fromIndex, 1)
    newChapters.splice(toIndex, 0, movedChapter)

    // Update chapter numbers
    const reorderedChapters = newChapters.map((chapter, index) => ({
      ...chapter,
      chapterNumber: index + 1,
    }))

    setOrderedChapters(reorderedChapters)
  }

  const handleSave = () => {
    onReorder(orderedChapters)
    onClose()
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[80vh] overflow-hidden">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-xl font-bold">Reorder Chapters</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="w-4 h-4" />
          </Button>
        </div>

        <div className="space-y-2 max-h-96 overflow-y-auto mb-4">
          {orderedChapters.map((chapter, index) => (
            <Card key={chapter.slug} className="cursor-move">
              <CardContent className="p-3">
                <div className="flex items-center space-x-3">
                  <GripVertical className="w-4 h-4 text-gray-400" />
                  <div className="flex-1">
                    <div className="flex items-center space-x-2">
                      <span className="text-sm font-medium">Chapter {index + 1}</span>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm">{chapter.title}</span>
                    </div>
                  </div>
                  <div className="flex space-x-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveChapter(index, Math.max(0, index - 1))}
                      disabled={index === 0}
                    >
                      ↑
                    </Button>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => moveChapter(index, Math.min(orderedChapters.length - 1, index + 1))}
                      disabled={index === orderedChapters.length - 1}
                    >
                      ↓
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex justify-end space-x-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>Save Order</Button>
        </div>
      </div>
    </div>
  )
}
