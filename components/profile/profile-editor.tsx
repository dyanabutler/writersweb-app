"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { ProfilePictureUpload } from "./profile-picture-upload"
import { useAuth } from "@/lib/auth/clerk-auth-context"
import { useDesignSystem } from "@/lib/contexts/design-system-context"
import { Save, X, Loader2, Settings } from "lucide-react"
import Link from "next/link"

interface ProfileEditorProps {
  initialData: {
    full_name: string
    avatar_url: string | null
    bio: string
    public_profile: boolean
  }
  onSave: (data: any) => Promise<void>
  onCancel: () => void
  loading?: boolean
}

export function ProfileEditor({
  initialData,
  onSave,
  onCancel,
  loading = false
}: ProfileEditorProps) {
  const { user } = useAuth()
  const { tokens } = useDesignSystem()
  
  const [formData, setFormData] = useState({
    full_name: initialData.full_name || user?.fullName || "",
    avatar_url: initialData.avatar_url || user?.imageUrl || null,
    bio: initialData.bio || "",
    public_profile: initialData.public_profile || false
  })

  const [hasChanges, setHasChanges] = useState(false)

  useEffect(() => {
    const hasFormChanges = 
      formData.full_name !== (initialData.full_name || user?.fullName || "") ||
      formData.avatar_url !== (initialData.avatar_url || user?.imageUrl || null) ||
      formData.bio !== (initialData.bio || "") ||
      formData.public_profile !== (initialData.public_profile || false)
    
    setHasChanges(hasFormChanges)
  }, [formData, initialData, user])

  const handleSave = async () => {
    await onSave(formData)
  }

  const handleImageUpload = (imageUrl: string) => {
    setFormData(prev => ({ ...prev, avatar_url: imageUrl }))
  }

  const handleImageRemove = () => {
    setFormData(prev => ({ ...prev, avatar_url: null }))
  }

  return (
    <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle>Quick Profile Edit</CardTitle>
          <div className="flex gap-2">
            <Button variant="outline" asChild>
              <Link href="/settings">
                <Settings className="w-4 h-4 mr-2" />
                Full Settings
              </Link>
            </Button>
            <Button
              onClick={handleSave}
              disabled={loading || !hasChanges}
              style={{ backgroundColor: tokens.colors.primary[600] }}
            >
              {loading ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Saving...
                </>
              ) : (
                <>
                  <Save className="w-4 h-4 mr-2" />
                  Save
                </>
              )}
            </Button>
            <Button variant="outline" onClick={onCancel} disabled={loading}>
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </div>
        </div>
      </CardHeader>
      
      <CardContent className="space-y-6">
        {/* Profile Picture Upload */}
        <ProfilePictureUpload
          currentImageUrl={formData.avatar_url || undefined}
          onImageUpload={handleImageUpload}
          onImageRemove={handleImageRemove}
          loading={loading}
        />

        {/* Display Name */}
        <div className="space-y-2">
          <Label htmlFor="full_name">Display Name</Label>
          <Input
            id="full_name"
            value={formData.full_name}
            onChange={(e) => setFormData(prev => ({ ...prev, full_name: e.target.value }))}
            placeholder="Your display name"
            disabled={loading}
          />
        </div>

        {/* Bio */}
        <div className="space-y-2">
          <Label htmlFor="bio">Bio</Label>
          <Textarea
            id="bio"
            value={formData.bio}
            onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
            placeholder="Tell people about yourself and your writing..."
            rows={3}
            disabled={loading}
          />
        </div>

        {/* Public Profile Toggle */}
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <Label>Public Profile</Label>
            <p className="text-sm" style={{ color: tokens.colors.text.muted }}>
              Make your profile visible to others
            </p>
          </div>
          <Switch
            checked={formData.public_profile}
            onCheckedChange={(checked) => 
              setFormData(prev => ({ ...prev, public_profile: checked }))
            }
            disabled={loading}
          />
        </div>

        {hasChanges && (
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <p className="text-sm text-blue-800 flex items-center justify-between">
              You have unsaved changes
              <Link href="/settings" className="text-blue-600 hover:text-blue-800 underline text-xs">
                Go to Settings for more options
              </Link>
            </p>
          </div>
        )}
      </CardContent>
    </Card>
  )
} 