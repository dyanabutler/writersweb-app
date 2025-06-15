"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { SceneManager } from "./scene-manager"
import type { Chapter } from "@/lib/types"
import { Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface ChapterEditorProps {
  chapter: Chapter
}

export function ChapterEditor({ chapter: initialChapter }: ChapterEditorProps) {
  const [chapter, setChapter] = useState(initialChapter)
  const [content, setContent] = useState(initialChapter.content || "")
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      // Save chapter logic here
      console.log("Saving chapter:", chapter)
      // In a real app, you'd call an API endpoint
    } catch (error) {
      console.error("Failed to save chapter:", error)
    } finally {
      setSaving(false)
    }
  }

  const updateChapter = (field: keyof Chapter, value: any) => {
    setChapter((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/chapters">
            <Button variant="primary-ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Chapters
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Edit Chapter</h1>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Chapter"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Chapter Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="title">Title</Label>
                <Input
                  id="title"
                  value={chapter.title}
                  onChange={(e) => updateChapter("title", e.target.value)}
                  placeholder="Chapter title"
                />
              </div>

              <div>
                <Label htmlFor="content">Content</Label>
                <Textarea
                  id="content"
                  value={content}
                  onChange={(e) => setContent(e.target.value)}
                  placeholder="Write your chapter content here..."
                  className="min-h-[400px] font-mono"
                />
              </div>
            </CardContent>
          </Card>

          <SceneManager chapterSlug={chapter.slug} />
        </div>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Chapter Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="chapterNumber">Chapter Number</Label>
                <Input
                  id="chapterNumber"
                  type="number"
                  value={chapter.chapterNumber}
                  onChange={(e) => updateChapter("chapterNumber", Number.parseInt(e.target.value))}
                />
              </div>

              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={chapter.status} onValueChange={(value) => updateChapter("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="review">Review</SelectItem>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="pov">Point of View</Label>
                <Input
                  id="pov"
                  value={chapter.pov}
                  onChange={(e) => updateChapter("pov", e.target.value)}
                  placeholder="Character POV"
                />
              </div>

              <div>
                <Label htmlFor="location">Location</Label>
                <Input
                  id="location"
                  value={chapter.location}
                  onChange={(e) => updateChapter("location", e.target.value)}
                  placeholder="Chapter location"
                />
              </div>

              <div>
                <Label htmlFor="timeline">Timeline</Label>
                <Input
                  id="timeline"
                  value={chapter.timeline}
                  onChange={(e) => updateChapter("timeline", e.target.value)}
                  placeholder="When this takes place"
                />
              </div>

              <div>
                <Label htmlFor="summary">Summary</Label>
                <Textarea
                  id="summary"
                  value={chapter.summary}
                  onChange={(e) => updateChapter("summary", e.target.value)}
                  placeholder="Brief chapter summary"
                  rows={3}
                />
              </div>

              <div>
                <Label>Word Count</Label>
                <div className="text-sm text-gray-600">
                  {content.split(/\s+/).filter((word) => word.length > 0).length} words
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
