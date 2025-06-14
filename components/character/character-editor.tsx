"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import type { Character } from "@/lib/types"
import { Save, ArrowLeft, Plus, X, Star } from "lucide-react"
import Link from "next/link"
import { ImageManager } from "@/components/common/image-manager"
import { Switch } from "@/components/ui/switch"

interface CharacterEditorProps {
  character: Character
}

export function CharacterEditor({ character: initialCharacter }: CharacterEditorProps) {
  const [character, setCharacter] = useState(initialCharacter)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      console.log("Saving character:", character)
      // In a real app, you'd call an API endpoint
    } catch (error) {
      console.error("Failed to save character:", error)
    } finally {
      setSaving(false)
    }
  }

  const updateCharacter = (field: keyof Character, value: any) => {
    setCharacter((prev) => ({ ...prev, [field]: value }))
  }

  const addAffiliation = () => {
    const affiliations = character.affiliations || []
    updateCharacter("affiliations", [...affiliations, ""])
  }

  const updateAffiliation = (index: number, value: string) => {
    const affiliations = [...(character.affiliations || [])]
    affiliations[index] = value
    updateCharacter("affiliations", affiliations)
  }

  const removeAffiliation = (index: number) => {
    const affiliations = character.affiliations || []
    updateCharacter(
      "affiliations",
      affiliations.filter((_, i) => i !== index),
    )
  }

  const addRelationship = () => {
    const relationships = character.relationships || []
    updateCharacter("relationships", [...relationships, ""])
  }

  const updateRelationship = (index: number, value: string) => {
    const relationships = [...(character.relationships || [])]
    relationships[index] = value
    updateCharacter("relationships", relationships)
  }

  const removeRelationship = (index: number) => {
    const relationships = character.relationships || []
    updateCharacter(
      "relationships",
      relationships.filter((_, i) => i !== index),
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/characters">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Characters
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Edit Character</h1>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Character"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Information</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <Label htmlFor="name">Name</Label>
              <Input
                id="name"
                value={character.name}
                onChange={(e) => updateCharacter("name", e.target.value)}
                placeholder="Character name"
              />
            </div>

            <div>
              <Label htmlFor="role">Role in Story</Label>
              <Input
                id="role"
                value={character.role}
                onChange={(e) => updateCharacter("role", e.target.value)}
                placeholder="Protagonist, Antagonist, Supporting, etc."
              />
            </div>

            <div>
              <Label htmlFor="age">Age</Label>
              <Input
                id="age"
                type="number"
                value={character.age || ""}
                onChange={(e) => updateCharacter("age", Number.parseInt(e.target.value) || 0)}
                placeholder="Character age"
              />
            </div>

            <div>
              <Label htmlFor="status">Status</Label>
              <Select value={character.status} onValueChange={(value) => updateCharacter("status", value)}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="alive">Alive</SelectItem>
                  <SelectItem value="deceased">Deceased</SelectItem>
                  <SelectItem value="missing">Missing</SelectItem>
                  <SelectItem value="unknown">Unknown</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div>
              <Label htmlFor="location">Current Location</Label>
              <Input
                id="location"
                value={character.location}
                onChange={(e) => updateCharacter("location", e.target.value)}
                placeholder="Where is this character now?"
              />
            </div>

            <div>
              <Label htmlFor="firstAppearance">First Appearance</Label>
              <Input
                id="firstAppearance"
                value={character.firstAppearance}
                onChange={(e) => updateCharacter("firstAppearance", e.target.value)}
                placeholder="Chapter X"
              />
            </div>

            <div className="flex items-center space-x-2">
              <Switch
                id="featured"
                checked={character.featured || false}
                onCheckedChange={(checked) => updateCharacter("featured", checked)}
              />
              <Label htmlFor="featured" className="flex items-center gap-2">
                <Star className="w-4 h-4" />
                Featured Character
              </Label>
            </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Affiliations</CardTitle>
                <Button size="sm" onClick={addAffiliation}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {(character.affiliations || []).map((affiliation, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={affiliation}
                    onChange={(e) => updateAffiliation(index, e.target.value)}
                    placeholder="Organization, group, etc."
                  />
                  <Button variant="ghost" size="sm" onClick={() => removeAffiliation(index)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {(!character.affiliations || character.affiliations.length === 0) && (
                <p className="text-sm text-gray-500">No affiliations added yet.</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle>Relationships</CardTitle>
                <Button size="sm" onClick={addRelationship}>
                  <Plus className="w-4 h-4 mr-2" />
                  Add
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {(character.relationships || []).map((relationship, index) => (
                <div key={index} className="flex items-center space-x-2">
                  <Input
                    value={relationship}
                    onChange={(e) => updateRelationship(index, e.target.value)}
                    placeholder="Character Name - Relationship"
                  />
                  <Button variant="ghost" size="sm" onClick={() => removeRelationship(index)}>
                    <X className="w-4 h-4" />
                  </Button>
                </div>
              ))}
              {(!character.relationships || character.relationships.length === 0) && (
                <p className="text-sm text-gray-500">No relationships added yet.</p>
              )}
            </CardContent>
          </Card>
          <ImageManager
            images={character.images || []}
            onImagesChange={(images) => updateCharacter("images", images)}
            title="Character Images"
            type="character"
          />
        </div>
      </div>
    </div>
  )
}
