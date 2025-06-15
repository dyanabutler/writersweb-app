"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent } from "@/components/ui/card"
import { Upload, X, Loader2 } from "lucide-react"
import Image from "next/image"

interface ImageManagerProps {
  images: string[]
  onImagesChange: (images: string[]) => void
  maxImages?: number
  storyId?: string
  type?: 'character' | 'location' | 'scene' | 'reference'
}

export function ImageManager({ 
  images, 
  onImagesChange, 
  maxImages = 5,
  storyId = 'default',
  type = 'reference'
}: ImageManagerProps) {
  const [uploading, setUploading] = useState(false)
  const [urlInput, setUrlInput] = useState("")

  const handleFileUpload = async (file: File) => {
    if (images.length >= maxImages) {
      alert(`Maximum ${maxImages} images allowed`)
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)
      formData.append('type', type)
      formData.append('storyId', storyId)

      const response = await fetch('/api/upload/image', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const { url } = await response.json()
      onImagesChange([...images, url])
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const handleUrlAdd = () => {
    if (urlInput && images.length < maxImages) {
      onImagesChange([...images, urlInput])
      setUrlInput("")
    }
  }

  const removeImage = (index: number) => {
    onImagesChange(images.filter((_, i) => i !== index))
  }

  return (
    <div className="space-y-4">
      <Label>Images ({images.length}/{maxImages})</Label>
      
      {/* Upload Area */}
      <Card className="border-2 border-dashed border-gray-300">
        <CardContent className="p-4">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <Button
                type="button"
                variant="outline"
                disabled={uploading || images.length >= maxImages}
                onClick={() => {
                  const input = document.createElement('input')
                  input.type = 'file'
                  input.accept = 'image/*'
                  input.onchange = (e) => {
                    const file = (e.target as HTMLInputElement).files?.[0]
                    if (file) handleFileUpload(file)
                  }
                  input.click()
                }}
              >
                {uploading ? (
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                ) : (
                  <Upload className="w-4 h-4 mr-2" />
                )}
                Upload Image
              </Button>
              <span className="text-sm text-gray-500">or</span>
            </div>
            
            <div className="flex gap-2">
              <Input
                placeholder="https://example.com/image.jpg"
                value={urlInput}
                onChange={(e) => setUrlInput(e.target.value)}
                disabled={images.length >= maxImages}
              />
              <Button 
                type="button"
                onClick={handleUrlAdd}
                disabled={!urlInput || images.length >= maxImages}
              >
                Add URL
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Image Grid */}
      {images.length > 0 && (
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
          {images.map((imageUrl, index) => (
            <div key={index} className="relative group">
              <Image
                src={imageUrl}
                alt={`Image ${index + 1}`}
                width={200}
                height={150}
                className="w-full h-32 object-cover rounded border"
              />
              <Button
                type="button"
                variant="destructive"
                size="sm"
                className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => removeImage(index)}
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
