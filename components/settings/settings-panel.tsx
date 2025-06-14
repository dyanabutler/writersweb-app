"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Save, User, FileText } from "lucide-react"
import { useDesignSystem } from "@/components/design-system"

export function SettingsPanel() {
  const { tokens } = useDesignSystem()
  const [autoSave, setAutoSave] = useState(true)
  const [wordCountGoal, setWordCountGoal] = useState("50000")
  const [authorName, setAuthorName] = useState("")
  const [storyTitle, setStoryTitle] = useState("")
  const [genre, setGenre] = useState("")
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      // Save settings to API or localStorage
      const settings = {
        autoSave,
        wordCountGoal,
        authorName,
        storyTitle,
        genre,
      }
      localStorage.setItem("storySettings", JSON.stringify(settings))
      console.log("Settings saved:", settings)
    } catch (error) {
      console.error("Failed to save settings:", error)
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: tokens.colors.text.primary }}>
              <FileText className="w-5 h-5" style={{ color: tokens.colors.icons.primary }} />
              Writing Preferences
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="space-y-0.5">
                <Label style={{ color: tokens.colors.text.primary }}>Auto-save</Label>
                <div className="text-sm" style={{ color: tokens.colors.text.muted }}>Automatically save changes as you type</div>
              </div>
              <Switch checked={autoSave} onCheckedChange={setAutoSave} />
            </div>

            <div>
              <Label htmlFor="wordCountGoal" style={{ color: tokens.colors.text.primary }}>Daily Word Count Goal</Label>
              <Input
                id="wordCountGoal"
                type="number"
                value={wordCountGoal}
                onChange={(e) => setWordCountGoal(e.target.value)}
                placeholder="1000"
                style={{
                  backgroundColor: tokens.colors.background.primary,
                  color: tokens.colors.text.primary,
                  borderColor: tokens.colors.neutral[300],
                }}
              />
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
          <CardHeader>
            <CardTitle className="flex items-center gap-2" style={{ color: tokens.colors.text.primary }}>
              <User className="w-5 h-5" style={{ color: tokens.colors.icons.primary }} />
              Story Information
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="storyTitle" style={{ color: tokens.colors.text.primary }}>Story Title</Label>
              <Input
                id="storyTitle"
                value={storyTitle}
                onChange={(e) => setStoryTitle(e.target.value)}
                placeholder="Enter your story title"
                style={{
                  backgroundColor: tokens.colors.background.primary,
                  color: tokens.colors.text.primary,
                  borderColor: tokens.colors.neutral[300],
                }}
              />
            </div>

            <div>
              <Label htmlFor="authorName" style={{ color: tokens.colors.text.primary }}>Author Name</Label>
              <Input
                id="authorName"
                value={authorName}
                onChange={(e) => setAuthorName(e.target.value)}
                placeholder="Your name"
                style={{
                  backgroundColor: tokens.colors.background.primary,
                  color: tokens.colors.text.primary,
                  borderColor: tokens.colors.neutral[300],
                }}
              />
            </div>

            <div>
              <Label htmlFor="genre" style={{ color: tokens.colors.text.primary }}>Genre</Label>
              <Select value={genre} onValueChange={setGenre}>
                <SelectTrigger style={{
                  backgroundColor: tokens.colors.background.primary,
                  color: tokens.colors.text.primary,
                  borderColor: tokens.colors.neutral[300],
                }}>
                  <SelectValue placeholder="Select genre" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="fantasy">Fantasy</SelectItem>
                  <SelectItem value="sci-fi">Science Fiction</SelectItem>
                  <SelectItem value="mystery">Mystery</SelectItem>
                  <SelectItem value="romance">Romance</SelectItem>
                  <SelectItem value="thriller">Thriller</SelectItem>
                  <SelectItem value="historical">Historical Fiction</SelectItem>
                  <SelectItem value="literary">Literary Fiction</SelectItem>
                  <SelectItem value="other">Other</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>
      </div>

      <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
        <CardHeader>
          <CardTitle style={{ color: tokens.colors.text.primary }}>Export & Backup</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Button variant="primary-outline">Export as PDF</Button>
            <Button variant="primary-outline">Export as EPUB</Button>
            <Button variant="primary-outline">Backup Data</Button>
          </div>

          <div className="text-sm" style={{ color: tokens.colors.text.muted }}>
            Export your story in various formats or create a backup of all your data.
          </div>
        </CardContent>
      </Card>

      <div className="flex justify-end">
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Settings"}
        </Button>
      </div>
    </div>
  )
}
