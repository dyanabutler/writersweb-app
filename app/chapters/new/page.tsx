"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ArrowLeft, Save, Loader2 } from "lucide-react"
import { useDesignSystem } from "@/components/design-system"
import { useAuth } from "@/lib/auth/clerk-auth-context"
import { createChapter } from "@/lib/content/chapters-supabase"
import { supabase } from "@/lib/supabase/client"
import Link from "next/link"
import type { Chapter } from "@/lib/types"
import { getOrCreateStoryId } from "@/lib/content/get-story-id"

export default function NewChapterPage() {
  const { tokens } = useDesignSystem()
  const { user } = useAuth()
  const router = useRouter()
  
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [storyId, setStoryId] = useState<string | null>(null)
  const [formData, setFormData] = useState({
    title: "",
    chapterNumber: 1,
    status: "draft" as Chapter["status"],
    pov: "",
    location: "",
    timeline: "",
    summary: "",
    content: "",
    wordCount: 0
  })

  // Get or create a story for the user
  useEffect(() => {
    const load = async () => {
      if (!user?.id) return
      try {
        const id = await getOrCreateStoryId(user.id)
        setStoryId(id)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [user?.id])

  const handleInputChange = (field: string, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    // Auto-calculate word count for content
    if (field === "content") {
      const wordCount = value.toString().trim().split(/\s+/).filter(word => word.length > 0).length
      setFormData(prev => ({ ...prev, wordCount }))
    }
  }

  const handleSave = async () => {
    if (!user || !formData.title.trim() || !storyId) {
      alert("Please fill in the chapter title")
      return
    }

    setSaving(true)
    try {
      const chapter = await createChapter({
        title: formData.title,
        chapterNumber: formData.chapterNumber,
        status: formData.status,
        wordCount: formData.wordCount,
        pov: formData.pov,
        location: formData.location,
        timeline: formData.timeline,
        summary: formData.summary,
        content: formData.content,
      }, storyId)

      if (chapter) {
        router.push(`/chapters/${chapter.slug}`)
      } else {
        alert("Failed to create chapter. Please try again.")
      }
    } catch (error) {
      console.error("Error creating chapter:", error)
      alert("Failed to create chapter. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" />
          <p className="text-gray-600">Setting up your story...</p>
        </div>
      </div>
    )
  }

  if (!storyId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2">Unable to create chapter</h2>
          <p className="text-gray-600 mb-4">There was an issue setting up your story.</p>
          <Link href="/chapters">
            <Button>Back to Chapters</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Link href="/chapters">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Chapters
            </Button>
          </Link>
          <h1 className="text-3xl font-bold" style={{ color: tokens.colors.text.primary }}>
            New Chapter
          </h1>
        </div>
        
        <Button onClick={handleSave} disabled={saving || !formData.title.trim()}>
          {saving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save Chapter
        </Button>
      </div>

      {/* Main Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Primary Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
            <CardHeader>
              <CardTitle>Chapter Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="title">Chapter Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleInputChange("title", e.target.value)}
                    placeholder="Enter chapter title..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="chapterNumber">Chapter Number</Label>
                  <Input
                    id="chapterNumber"
                    type="number"
                    min="1"
                    value={formData.chapterNumber}
                    onChange={(e) => handleInputChange("chapterNumber", parseInt(e.target.value) || 1)}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="pov">Point of View</Label>
                  <Input
                    id="pov"
                    value={formData.pov}
                    onChange={(e) => handleInputChange("pov", e.target.value)}
                    placeholder="e.g., Sarah Johnson, Third Person..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="location">Primary Location</Label>
                  <Input
                    id="location"
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="e.g., Coffee Shop, Downtown..."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="timeline">Timeline/Setting</Label>
                <Input
                  id="timeline"
                  value={formData.timeline}
                  onChange={(e) => handleInputChange("timeline", e.target.value)}
                  placeholder="e.g., Morning, Day 3, Winter 2023..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Chapter Content */}
          <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                Chapter Content
                <span className="text-sm font-normal" style={{ color: tokens.colors.text.muted }}>
                  {formData.wordCount} words
                </span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="summary">Chapter Summary</Label>
                <Textarea
                  id="summary"
                  value={formData.summary}
                  onChange={(e) => handleInputChange("summary", e.target.value)}
                  placeholder="Brief summary of what happens in this chapter..."
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="content">Chapter Content</Label>
                <Textarea
                  id="content"
                  value={formData.content}
                  onChange={(e) => handleInputChange("content", e.target.value)}
                  placeholder="Write your chapter content here..."
                  rows={20}
                  className="font-mono"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
            <CardHeader>
              <CardTitle>Publishing</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="status">Status</Label>
                <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="review">In Review</SelectItem>
                    <SelectItem value="complete">Complete</SelectItem>
                    <SelectItem value="published">Published</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4">
                <div className="text-sm space-y-2" style={{ color: tokens.colors.text.muted }}>
                  <div className="flex justify-between">
                    <span>Word Count:</span>
                    <span>{formData.wordCount}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Status:</span>
                    <span className="capitalize">{formData.status}</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Quick Tips */}
          <Card style={{ backgroundColor: tokens.colors.background.tertiary }}>
            <CardHeader>
              <CardTitle className="text-sm">Writing Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2" style={{ color: tokens.colors.text.muted }}>
                <li>• Start with a compelling hook</li>
                <li>• Maintain consistent POV</li>
                <li>• End with a cliffhanger or resolution</li>
                <li>• Show, don't tell</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 