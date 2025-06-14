"use client"

import type React from "react"

import { useState } from "react"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Plus, X, Upload } from "lucide-react"

interface ImageManagerProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  title: string
  type: "character" | "location" | "chapter"
}

export function ImageManager({ images, onImagesChange, title, type }: ImageManagerProps) {
  const [newImageUrl, setNewImageUrl] = useState("")
  const [showAddForm, setShowAddForm] = useState(false)

  const addImage = () => {
    if (newImageUrl.trim()) {
      onImagesChange([...images, newImageUrl.trim()])
      setNewImageUrl("")
      setShowAddForm(false)
    }
  }

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index))
  }

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      // In a real app, you'd upload to a service like Vercel Blob or Cloudinary
      // For now, we'll create a placeholder URL
      const placeholderUrl = `/placeholder.svg?height=400&width=400&text=${encodeURIComponent(file.name)}`
      onImagesChange([...images, placeholderUrl])
    }
  }

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>{title}</CardTitle>
          <Button size="sm" onClick={() => setShowAddForm(!showAddForm)}>
            <Plus className="w-4 h-4 mr-2" />
            Add Image
          </Button>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {showAddForm && (
          <div className="border rounded-lg p-4 space-y-3">
            <div>
              <Label htmlFor="imageUrl">Image URL</Label>
              <Input
                id="imageUrl"
                value={newImageUrl}
                onChange={(e) => setNewImageUrl(e.target.value)}
                placeholder="https://example.com/image.jpg"
              />
            </div>
            <div>
              <Label htmlFor="imageFile">Or upload file</Label>
              <Input
                id="imageFile"
                type="file"
                accept="image/*"
                onChange={handleFileUpload}
                className="cursor-pointer"
              />
            </div>
            <div className="flex gap-2">
              <Button onClick={addImage} disabled={!newImageUrl.trim()}>
                Add Image
              </Button>
              <Button variant="outline" onClick={() => setShowAddForm(false)}>
                Cancel
              </Button>
            </div>
          </div>
        )}

        {images.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            <Upload className="w-8 h-8 mx-auto mb-2" />
            <p>No images added yet</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 gap-4">
            {images.map((imageUrl, index) => (
              <div key={index} className="relative group">
                <div className="relative aspect-square">
                  <Image
                    src={imageUrl || "/placeholder.svg"}
                    alt={`${type} image ${index + 1}`}
                    fill
                    className="object-cover rounded-lg"
                  />
                  <Button
                    variant="destructive"
                    size="sm"
                    className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={() => removeImage(index)}
                  >
                    <X className="w-3 h-3" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        )}
      </CardContent>
    </Card>
  )
}
