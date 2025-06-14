"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Upload, X, Loader2 } from "lucide-react"
import { useDesignSystem } from "@/lib/contexts/design-system-context"

interface ProfilePictureUploadProps {
  currentImageUrl?: string
  onImageUpload: (imageUrl: string) => void
  onImageRemove: () => void
  loading?: boolean
}

export function ProfilePictureUpload({
  currentImageUrl,
  onImageUpload,
  onImageRemove,
  loading = false
}: ProfilePictureUploadProps) {
  const { tokens } = useDesignSystem()
  const [dragOver, setDragOver] = useState(false)
  const [uploading, setUploading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileSelect = async (file: File) => {
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Image size must be less than 5MB')
      return
    }

    setUploading(true)
    try {
      // TODO: Replace with your preferred upload service
      // For now, create a mock URL - you'll need to implement actual upload
      const mockUrl = await uploadToService(file)
      onImageUpload(mockUrl)
    } catch (error) {
      console.error('Upload failed:', error)
      alert('Upload failed. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  // Mock upload function - replace with actual service
  const uploadToService = async (file: File): Promise<string> => {
    // Simulate upload delay
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    // In production, you'd upload to Cloudinary, Vercel Blob, etc.
    // For now, return a placeholder
    return `/placeholder.svg?height=400&width=400&text=${encodeURIComponent(file.name)}`
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    const file = e.dataTransfer.files[0]
    if (file) handleFileSelect(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
  }

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (file) handleFileSelect(file)
  }

  return (
    <div className="space-y-4">
      <Label>Profile Picture</Label>
      
      <div className="flex items-center gap-4">
        {/* Current Image */}
        <div className="relative">
          <Image
            src={currentImageUrl || "/placeholder.svg"}
            alt="Profile picture"
            width={120}
            height={120}
            className="rounded-full border-4 border-white shadow-lg object-cover"
          />
          {currentImageUrl && (
            <Button
              variant="destructive"
              size="sm"
              className="absolute -top-2 -right-2 rounded-full p-1 h-6 w-6"
              onClick={onImageRemove}
              disabled={loading}
            >
              <X className="h-3 w-3" />
            </Button>
          )}
        </div>

        {/* Upload Area */}
        <Card 
          className={`flex-1 cursor-pointer border-2 border-dashed transition-colors ${
            dragOver ? 'border-blue-500 bg-blue-50' : 'border-gray-300'
          }`}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onClick={() => fileInputRef.current?.click()}
        >
          <CardContent className="p-6 text-center">
            {uploading ? (
              <div className="flex items-center justify-center gap-2">
                <Loader2 className="h-4 w-4 animate-spin" />
                <span>Uploading...</span>
              </div>
            ) : (
              <>
                <Upload className="h-8 w-8 mx-auto mb-2" style={{ color: tokens.colors.icons.muted }} />
                <p className="text-sm" style={{ color: tokens.colors.text.muted }}>
                  <span className="font-medium">Click to upload</span> or drag and drop
                </p>
                <p className="text-xs" style={{ color: tokens.colors.text.muted }}>
                  PNG, JPG, GIF up to 5MB
                </p>
              </>
            )}
          </CardContent>
        </Card>
      </div>

      <Input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        className="hidden"
      />
    </div>
  )
} 