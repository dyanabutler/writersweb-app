"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { ArrowLeft, Save, Loader2, Plus, X } from "lucide-react"
import { useDesignSystem } from "@/components/design-system"
import { useAuth } from "@/lib/auth/clerk-auth-context"
import { createCharacter } from "@/lib/content/characters-supabase"
import { ProfilePictureUpload } from "@/components/profile/profile-picture-upload"
import { supabase } from "@/lib/supabase/client"
import Link from "next/link"
import type { Character } from "@/lib/types"

export default function NewCharacterPage() {
  const { tokens } = useDesignSystem()
  const { user } = useAuth()
  const router = useRouter()
  
  const [saving, setSaving] = useState(false)
  const [loading, setLoading] = useState(true)
  const [storyId, setStoryId] = useState<string | null>(null)
  const [newAffiliation, setNewAffiliation] = useState("")
  const [newRelationship, setNewRelationship] = useState("")
  
  const [formData, setFormData] = useState({
    name: "",
    role: "",
    age: 0,
    status: "alive" as Character["status"],
    location: "",
    affiliations: [] as string[],
    relationships: [] as string[],
    firstAppearance: "",
    description: "",
    backstory: "",
    imageUrl: ""
  })

  // Get or create a story for the user
  useEffect(() => {
    const initializeStory = async () => {
      if (!user?.id) return

      try {
        // First, check if user has any stories
        const { data: existingStories, error: fetchError } = await supabase
          .from("stories")
          .select("id, title")
          .eq("user_id", user.id)
          .order("created_at", { ascending: false })
          .limit(1)

        if (fetchError) {
          console.error("Error fetching stories:", fetchError)
          setLoading(false)
          return
        }

        if (existingStories && existingStories.length > 0) {
          // Use existing story
          setStoryId(existingStories[0].id)
          console.log("Using existing story:", existingStories[0].title)
        } else {
          // Create a default story for the user
          const { data: newStory, error: createError } = await supabase
            .from("stories")
            .insert({
              user_id: user.id,
              title: "My First Story",
              status: "planning",
              current_word_count: 0
            })
            .select()
            .single()

          if (createError) {
            console.error("Error creating default story:", createError)
          } else {
            console.log("Created new story:", newStory.title)
            setStoryId(newStory.id)
          }
        }
      } catch (error) {
        console.error("Error initializing story:", error)
      } finally {
        setLoading(false)
      }
    }

    initializeStory()
  }, [user?.id])

  const handleInputChange = (field: string, value: string | number | string[]) => {
    setFormData(prev => ({ ...prev, [field]: value }))
  }

  const addAffiliation = () => {
    if (newAffiliation.trim() && !formData.affiliations.includes(newAffiliation.trim())) {
      setFormData(prev => ({
        ...prev,
        affiliations: [...prev.affiliations, newAffiliation.trim()]
      }))
      setNewAffiliation("")
    }
  }

  const removeAffiliation = (affiliation: string) => {
    setFormData(prev => ({
      ...prev,
      affiliations: prev.affiliations.filter(a => a !== affiliation)
    }))
  }

  const addRelationship = () => {
    if (newRelationship.trim() && !formData.relationships.includes(newRelationship.trim())) {
      setFormData(prev => ({
        ...prev,
        relationships: [...prev.relationships, newRelationship.trim()]
      }))
      setNewRelationship("")
    }
  }

  const removeRelationship = (relationship: string) => {
    setFormData(prev => ({
      ...prev,
      relationships: prev.relationships.filter(r => r !== relationship)
    }))
  }

  const handleSave = async () => {
    if (!user || !formData.name.trim() || !storyId) {
      alert("Please fill in the character name")
      return
    }

    setSaving(true)
    try {
      const character = await createCharacter({
        name: formData.name,
        role: formData.role,
        age: formData.age,
        status: formData.status,
        location: formData.location,
        affiliations: formData.affiliations,
        relationships: formData.relationships,
        firstAppearance: formData.firstAppearance,
        description: formData.description,
        backstory: formData.backstory,
        featured: false
      }, storyId, user.id)

      if (character) {
        router.push(`/characters/${character.slug}`)
      } else {
        alert("Failed to create character. Please try again.")
      }
    } catch (error) {
      console.error("Error creating character:", error)
      alert("Failed to create character. Please try again.")
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin mx-auto mb-4" style={{ color: tokens.colors.icons.primary }} />
          <p style={{ color: tokens.colors.text.secondary }}>Setting up your story...</p>
        </div>
      </div>
    )
  }

  if (!storyId) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <h2 className="text-xl font-semibold mb-2" style={{ color: tokens.colors.text.primary }}>Unable to create character</h2>
          <p className="mb-4" style={{ color: tokens.colors.text.secondary }}>There was an issue setting up your story.</p>
          <Link href="/characters">
            <Button>Back to Characters</Button>
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
          <Link href="/characters">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Characters
            </Button>
          </Link>
          <h1 className="text-3xl font-bold" style={{ color: tokens.colors.text.primary }}>
            New Character
          </h1>
        </div>
        
        <Button onClick={handleSave} disabled={saving || !formData.name.trim()}>
          {saving ? (
            <Loader2 className="w-4 h-4 mr-2 animate-spin" />
          ) : (
            <Save className="w-4 h-4 mr-2" />
          )}
          Save Character
        </Button>
      </div>

      {/* Main Form */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Primary Details */}
        <div className="lg:col-span-2 space-y-6">
          <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <Label htmlFor="name">Character Name *</Label>
                  <Input
                    id="name"
                    value={formData.name}
                    onChange={(e) => handleInputChange("name", e.target.value)}
                    placeholder="Enter character name..."
                  />
                </div>
                
                <div>
                  <Label htmlFor="role">Role/Occupation</Label>
                  <Input
                    id="role"
                    value={formData.role}
                    onChange={(e) => handleInputChange("role", e.target.value)}
                    placeholder="e.g., Detective, Student, Villain..."
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="age">Age</Label>
                  <Input
                    id="age"
                    type="number"
                    min="0"
                    max="200"
                    value={formData.age}
                    onChange={(e) => handleInputChange("age", parseInt(e.target.value) || 0)}
                    placeholder="Age"
                  />
                </div>
                
                <div>
                  <Label htmlFor="status">Status</Label>
                  <Select value={formData.status} onValueChange={(value) => handleInputChange("status", value)}>
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
                    value={formData.location}
                    onChange={(e) => handleInputChange("location", e.target.value)}
                    placeholder="Where they live/work..."
                  />
                </div>
              </div>

              <div>
                <Label htmlFor="firstAppearance">First Appearance</Label>
                <Input
                  id="firstAppearance"
                  value={formData.firstAppearance}
                  onChange={(e) => handleInputChange("firstAppearance", e.target.value)}
                  placeholder="e.g., Chapter 1, Scene 3..."
                />
              </div>
            </CardContent>
          </Card>

          {/* Relationships & Affiliations */}
          <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
            <CardHeader>
              <CardTitle>Relationships & Affiliations</CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Affiliations */}
              <div>
                <Label>Affiliations</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newAffiliation}
                    onChange={(e) => setNewAffiliation(e.target.value)}
                    placeholder="Add affiliation..."
                    onKeyPress={(e) => e.key === 'Enter' && addAffiliation()}
                  />
                  <Button onClick={addAffiliation} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.affiliations.map((affiliation) => (
                    <Badge key={affiliation} variant="secondary" className="flex items-center gap-1">
                      {affiliation}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => removeAffiliation(affiliation)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>

              {/* Relationships */}
              <div>
                <Label>Relationships</Label>
                <div className="flex gap-2 mt-2">
                  <Input
                    value={newRelationship}
                    onChange={(e) => setNewRelationship(e.target.value)}
                    placeholder="Add relationship..."
                    onKeyPress={(e) => e.key === 'Enter' && addRelationship()}
                  />
                  <Button onClick={addRelationship} size="sm">
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
                <div className="flex flex-wrap gap-2 mt-2">
                  {formData.relationships.map((relationship) => (
                    <Badge key={relationship} variant="secondary" className="flex items-center gap-1">
                      {relationship}
                      <X 
                        className="w-3 h-3 cursor-pointer" 
                        onClick={() => removeRelationship(relationship)}
                      />
                    </Badge>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Character Details */}
          <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
            <CardHeader>
              <CardTitle>Character Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="description">Physical Description</Label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange("description", e.target.value)}
                  placeholder="Describe the character's appearance, mannerisms, etc..."
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="backstory">Backstory</Label>
                <Textarea
                  id="backstory"
                  value={formData.backstory}
                  onChange={(e) => handleInputChange("backstory", e.target.value)}
                  placeholder="Character's history, motivations, secrets..."
                  rows={6}
                />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Sidebar */}
        <div className="space-y-6">
          {/* Character Image */}
          <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
            <CardHeader>
              <CardTitle>Character Image</CardTitle>
            </CardHeader>
            <CardContent>
              <ProfilePictureUpload
                currentImageUrl={formData.imageUrl}
                onImageUpload={(url) => handleInputChange("imageUrl", url)}
                onImageRemove={() => handleInputChange("imageUrl", "")}
              />
            </CardContent>
          </Card>

          {/* Character Summary */}
          <Card style={{ backgroundColor: tokens.colors.background.tertiary }}>
            <CardHeader>
              <CardTitle className="text-sm">Character Summary</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-sm space-y-2" style={{ color: tokens.colors.text.muted }}>
                <div className="flex justify-between">
                  <span>Name:</span>
                  <span>{formData.name || "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Age:</span>
                  <span>{formData.age || "Not set"}</span>
                </div>
                <div className="flex justify-between">
                  <span>Status:</span>
                  <span className="capitalize">{formData.status}</span>
                </div>
                <div className="flex justify-between">
                  <span>Affiliations:</span>
                  <span>{formData.affiliations.length}</span>
                </div>
                <div className="flex justify-between">
                  <span>Relationships:</span>
                  <span>{formData.relationships.length}</span>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Character Tips */}
          <Card style={{ backgroundColor: tokens.colors.background.tertiary }}>
            <CardHeader>
              <CardTitle className="text-sm">Character Development Tips</CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="text-sm space-y-2" style={{ color: tokens.colors.text.muted }}>
                <li>• Give them unique quirks and flaws</li>
                <li>• Define clear motivations and goals</li>
                <li>• Create meaningful relationships</li>
                <li>• Consider their arc throughout the story</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
} 