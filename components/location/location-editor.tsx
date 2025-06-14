"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { ImageManager } from "@/components/common/image-manager"
import type { Location } from "@/lib/types"
import { Save, ArrowLeft } from "lucide-react"
import Link from "next/link"

interface LocationEditorProps {
  location: Location
}

export function LocationEditor({ location: initialLocation }: LocationEditorProps) {
  const [location, setLocation] = useState(initialLocation)
  const [saving, setSaving] = useState(false)

  const handleSave = async () => {
    setSaving(true)
    try {
      console.log("Saving location:", location)
      // In a real app, you'd call an API endpoint
    } catch (error) {
      console.error("Failed to save location:", error)
    } finally {
      setSaving(false)
    }
  }

  const updateLocation = (field: keyof Location, value: any) => {
    setLocation((prev) => ({ ...prev, [field]: value }))
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/locations">
            <Button variant="ghost" size="sm">
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Locations
            </Button>
          </Link>
          <h1 className="text-2xl font-bold">Edit Location</h1>
        </div>
        <Button onClick={handleSave} disabled={saving}>
          <Save className="w-4 h-4 mr-2" />
          {saving ? "Saving..." : "Save Location"}
        </Button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Basic Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={location.name}
                  onChange={(e) => updateLocation("name", e.target.value)}
                  placeholder="Location name"
                />
              </div>

              <div>
                <Label htmlFor="type">Type</Label>
                <Select value={location.type} onValueChange={(value) => updateLocation("type", value)}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="city">City</SelectItem>
                    <SelectItem value="building">Building</SelectItem>
                    <SelectItem value="landmark">Landmark</SelectItem>
                    <SelectItem value="region">Region</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={location.description}
                  onChange={(e) => updateLocation("description", e.target.value)}
                  placeholder="Describe this location"
                  rows={4}
                />
              </div>

              <div>
                <Label htmlFor="significance">Significance</Label>
                <Textarea
                  id="significance"
                  value={location.significance}
                  onChange={(e) => updateLocation("significance", e.target.value)}
                  placeholder="Why is this location important to your story?"
                  rows={3}
                />
              </div>

              <div>
                <Label htmlFor="climate">Climate</Label>
                <Input
                  id="climate"
                  value={location.climate || ""}
                  onChange={(e) => updateLocation("climate", e.target.value)}
                  placeholder="Weather and climate"
                />
              </div>

              <div>
                <Label htmlFor="population">Population</Label>
                <Input
                  id="population"
                  value={location.population || ""}
                  onChange={(e) => updateLocation("population", e.target.value)}
                  placeholder="Population size or density"
                />
              </div>
            </CardContent>
          </Card>
        </div>

        <div className="space-y-6">
          <ImageManager
            images={location.images || []}
            onImagesChange={(images) => updateLocation("images", images)}
            title="Location Images"
            type="location"
          />

          <Card>
            <CardHeader>
              <CardTitle>Connections</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Connected Chapters</Label>
                <div className="text-sm text-gray-600">
                  {location.connectedChapters?.length || 0} chapters reference this location
                </div>
              </div>

              <div>
                <Label>Connected Characters</Label>
                <div className="text-sm text-gray-600">
                  {location.connectedCharacters?.length || 0} characters are associated with this location
                </div>
              </div>

              {location.parentLocation && (
                <div>
                  <Label>Parent Location</Label>
                  <div className="text-sm text-gray-600">{location.parentLocation}</div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
