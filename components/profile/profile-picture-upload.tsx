"use client"

import { useState, useRef } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Camera, Upload, X, Loader2 } from "lucide-react"
import { useDesignSystem } from "@/components/design-system"

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
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const file = files[0]
    if (!file.type.startsWith('image/')) {
      alert('Please select an image file')
      return
    }

    if (file.size > 5 * 1024 * 1024) { // 5MB limit
      alert('Image must be smaller than 5MB')
      return
    }

    setUploading(true)
    try {
      const formData = new FormData()
      formData.append('file', file)

      const response = await fetch('/api/upload/profile-picture', {
        method: 'POST',
        body: formData,
      })

      if (!response.ok) {
        throw new Error('Upload failed')
      }

      const { url } = await response.json()
      onImageUpload(url)
      alert('✅ Profile picture uploaded! Click "Save Changes" to make it permanent.')
    } catch (error) {
      console.error('Upload error:', error)
      alert('Failed to upload image. Please try again.')
    } finally {
      setUploading(false)
    }
  }

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFiles(e.dataTransfer.files)
  }

  return (
    <div className="space-y-4">
      <Label>Profile Picture</Label>
      
      {currentImageUrl ? (
        <div className="flex items-center gap-4">
          <div className="relative">
            <Image
              src={currentImageUrl}
              alt="Profile"
              width={80}
              height={80}
              className="rounded-full object-cover"
            />
          </div>
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => inputRef.current?.click()}
              disabled={uploading || loading}
            >
              {uploading ? (
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              ) : (
                <Camera className="w-4 h-4 mr-2" />
              )}
              Change
            </Button>
            <Button
              variant="outline"
              size="sm"
              onClick={onImageRemove}
              disabled={uploading || loading}
            >
              <X className="w-4 h-4 mr-2" />
              Remove
            </Button>
          </div>
        </div>
      ) : (
        <Card
          className={`border-2 border-dashed transition-colors cursor-pointer ${
            dragActive 
              ? 'border-blue-400 bg-blue-50' 
              : 'border-gray-300 hover:border-gray-400'
          }`}
          style={{ backgroundColor: tokens.colors.background.tertiary }}
          onDragEnter={handleDrag}
          onDragLeave={handleDrag}
          onDragOver={handleDrag}
          onDrop={handleDrop}
          onClick={() => inputRef.current?.click()}
        >
          <CardContent className="p-8 text-center">
            {uploading ? (
              <div className="space-y-2">
                <Loader2 className="w-8 h-8 mx-auto animate-spin" style={{ color: tokens.colors.primary[600] }} />
                <p className="text-sm" style={{ color: tokens.colors.text.muted }}>
                  Uploading...
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                <Upload className="w-8 h-8 mx-auto" style={{ color: tokens.colors.icons.muted }} />
                <p className="text-sm" style={{ color: tokens.colors.text.secondary }}>
                  Drop an image here or click to browse
                </p>
                <p className="text-xs" style={{ color: tokens.colors.text.muted }}>
                  PNG, JPG up to 5MB
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      )}

      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        onChange={(e) => handleFiles(e.target.files)}
        className="hidden"
        disabled={uploading || loading}
      />
    </div>
  )
} 