"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProfilePictureUpload } from "@/components/profile/profile-picture-upload"
import { useAuth } from "@/lib/auth/clerk-auth-context"
import { DesignSystemEditor } from "@/components/design-system/design-system-editor"
import { UserProfile } from "@clerk/nextjs"

import { 
  Share2, 
  ExternalLink, 
  Crown, 
  Save, 
  User,
  Loader2,
  Palette,
  HelpCircle,
  Shield
} from "lucide-react"
import { useDesignSystem } from "@/components/design-system"
import Link from "next/link"

export default function SettingsPage() {
  const { user, profile, refreshProfile } = useAuth()
  const { tokens } = useDesignSystem()
  
  const [loading, setLoading] = useState(false)
  const [hasChanges, setHasChanges] = useState(false)
  
  const [formData, setFormData] = useState({
    full_name: "",
    avatar_url: null as string | null,
    bio: "",
    public_profile: false
  })

  const profileUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/profile/${user?.id}` 
    : ""

  useEffect(() => {
    if (profile && user) {
      const initialData = {
        full_name: profile.full_name || user.fullName || "",
        avatar_url: profile.avatar_url || user.imageUrl || null,
        bio: profile.bio || "",
        public_profile: profile.public_profile || false
      }
      setFormData(initialData)
    }
  }, [profile, user])

  // Track changes
  useEffect(() => {
    if (!profile || !user) return
    
    const hasFormChanges = 
      formData.full_name !== (profile.full_name || user.fullName || "") ||
      formData.avatar_url !== (profile.avatar_url || user.imageUrl || null) ||
      formData.bio !== (profile.bio || "") ||
      formData.public_profile !== (profile.public_profile || false)
    
    setHasChanges(hasFormChanges)
  }, [formData, profile, user])

  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      if (!user) throw new Error("No user logged in")
      
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData)
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update profile')
      }

      // Refresh profile data
      await refreshProfile()
      alert("Profile updated successfully!")
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Error updating profile: " + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleImageUpload = async (imageUrl: string) => {
    setFormData(prev => ({ ...prev, avatar_url: imageUrl }))
    
    // Auto-save the profile picture immediately
    try {
      setLoading(true)
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ...formData, 
          avatar_url: imageUrl 
        })
      })

      if (!response.ok) {
        throw new Error('Failed to save profile picture')
      }

      // Refresh profile data to get latest from DB
      await refreshProfile()
      console.log('✅ Profile picture saved successfully')
    } catch (error) {
      console.error('❌ Error saving profile picture:', error)
      alert('Profile picture uploaded but failed to save. Please click Save Changes.')
    } finally {
      setLoading(false)
    }
  }

  const handleImageRemove = async () => {
    setFormData(prev => ({ ...prev, avatar_url: null }))
    
    // Auto-save the removal immediately
    try {
      setLoading(true)
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ 
          ...formData, 
          avatar_url: null 
        })
      })

      if (!response.ok) {
        throw new Error('Failed to remove profile picture')
      }

      await refreshProfile()
      console.log('✅ Profile picture removed successfully')
    } catch (error) {
      console.error('❌ Error removing profile picture:', error)
      alert('Failed to remove profile picture. Please click Save Changes.')
    } finally {
      setLoading(false)
    }
  }

  const handleShareProfile = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Writer Profile",
          text: "Check out my writing!",
          url: profileUrl,
        })
      } catch (err) {
        console.log("Error sharing:", err)
      }
    } else {
      navigator.clipboard.writeText(profileUrl)
      alert("Profile link copied to clipboard!")
    }
  }

  if (!user) {
    return (
      <div className="text-center py-12">
        <p>Please sign in to access settings.</p>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold" style={{ color: tokens.colors.text.primary }}>
          Settings
        </h1>
        {hasChanges && (
          <Button 
            onClick={handleSaveProfile} 
            disabled={loading}
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
                Save Changes
              </>
            )}
          </Button>
        )}
      </div>

      {/* Change Indicator */}
      {hasChanges && (
        <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
          <p className="text-sm text-blue-800">
            You have unsaved changes. Click "Save Changes" to apply them.
          </p>
        </div>
      )}

      {/* Tabbed Interface */}
      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="profile" className="flex items-center gap-2">
            <User className="w-4 h-4" />
            Profile
          </TabsTrigger>
          <TabsTrigger value="account" className="flex items-center gap-2">
            <Shield className="w-4 h-4" />
            Account
          </TabsTrigger>
          <TabsTrigger value="design-system" className="flex items-center gap-2">
            <Palette className="w-4 h-4" />
            Design System
          </TabsTrigger>
          <TabsTrigger value="help" className="flex items-center gap-2">
            <HelpCircle className="w-4 h-4" />
            Help & Support
          </TabsTrigger>
        </TabsList>

        {/* Profile Tab */}
        <TabsContent value="profile" className="space-y-6">
          {/* Profile Settings */}
          <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <User className="w-5 h-5" />
                Profile Information
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Profile Picture */}
              <ProfilePictureUpload
                currentImageUrl={formData.avatar_url || undefined}
                onImageUpload={(url) => setFormData(prev => ({ ...prev, avatar_url: url }))}
                onImageRemove={() => setFormData(prev => ({ ...prev, avatar_url: null }))}
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
                <p className="text-xs" style={{ color: tokens.colors.text.muted }}>
                  This is how your name will appear on your public profile
                </p>
              </div>

              {/* Bio */}
              <div className="space-y-2">
                <Label htmlFor="bio">Bio</Label>
                <Textarea
                  id="bio"
                  placeholder="Tell people about yourself and your writing..."
                  value={formData.bio}
                  onChange={(e) => 
                    setFormData(prev => ({ ...prev, bio: e.target.value }))
                  }
                  rows={3}
                  disabled={loading}
                />
              </div>

              {/* Public Profile Toggle */}
              <div className="flex items-center justify-between">
                <div className="space-y-1">
                  <Label>Public Profile</Label>
                  <p className="text-sm" style={{ color: tokens.colors.text.muted }}>
                    Make your profile visible to others and showcase your work
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

              {/* Public Profile URL */}
              {formData.public_profile && (
                <div className="border-t pt-6">
                  <div className="flex items-center justify-between mb-3">
                    <div>
                      <h4 className="font-semibold">Your Profile URL</h4>
                      <p className="text-sm" style={{ color: tokens.colors.text.muted }}>
                        Share this link to showcase your work
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="primary-outline" onClick={handleShareProfile}>
                        <Share2 className="w-4 h-4 mr-2" />
                        Share
                      </Button>
                      <Button asChild variant="primary-outline">
                        <Link href={`/profile/${user.id}`} target="_blank">
                          <ExternalLink className="w-4 h-4 mr-2" />
                          Preview
                        </Link>
                      </Button>
                    </div>
                  </div>
                  <div className="p-2  rounded text-sm font-mono break-all">
                    {profileUrl}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Account Information */}
          <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
            <CardHeader>
              <CardTitle>Account Information</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <Label>Email</Label>
                <div className="flex items-center gap-2">
                  <Input 
                    value={user.emailAddresses?.[0]?.emailAddress || ""} 
                    disabled 
                    className=" flex-1"
                  />
                  <Button 
                    variant="primary-outline" 
                    size="sm"
                    asChild
                  >
                    <Link href="/account">
                      Manage
                    </Link>
                  </Button>
                </div>
                <p className="text-xs mt-1" style={{ color: tokens.colors.text.muted }}>
                  Change email, password, and security settings
                </p>
              </div>
              
              <div className="flex items-center gap-3">
                <Label>Subscription</Label>
                <Badge 
                  variant={user.publicMetadata?.subscription === "pro" ? "default" : "secondary"}
                  className="flex items-center gap-1"
                >
                  {user.publicMetadata?.subscription === "pro" && (
                    <Crown className="w-3 h-3" />
                  )}
                  {user.publicMetadata?.subscription === "pro" ? "Pro Writer" : "Free Writer"}
                </Badge>
              </div>

              <div>
                <Label>Member Since</Label>
                <p className="text-sm" style={{ color: tokens.colors.text.muted }}>
                  {new Date(user.createdAt || "").toLocaleDateString()}
                </p>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Account Tab - Clerk UserProfile */}
        <TabsContent value="account">
          <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="w-5 h-5" />
                Account & Security
              </CardTitle>
              <p className="text-sm" style={{ color: tokens.colors.text.muted }}>
                Manage your email, password, and security settings
              </p>
            </CardHeader>
            <CardContent>
              <UserProfile 
                routing="hash"
                appearance={{
                  elements: {
                    rootBox: "w-full",
                    cardBox: "border-0 shadow-none bg-transparent",
                    avatarBox: "hidden",
                    profileSectionPrimaryButton: "hidden",
                  }
                }}
              />
            </CardContent>
          </Card>
        </TabsContent>

        {/* Design System Tab */}
        <TabsContent value="design-system">
          <DesignSystemEditor />
        </TabsContent>

        {/* Help & Support Tab */}
        <TabsContent value="help">
          <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <HelpCircle className="w-5 h-5" />
                Help & Support
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Documentation</h4>
                  <p className="text-sm mb-4" style={{ color: tokens.colors.text.muted }}>
                    Complete guides and tutorials
                  </p>
                  <Button asChild variant="primary-outline" className="w-full">
                    <Link href="/help/docs">
                      Browse Documentation
                    </Link>
                  </Button>
                </div>
                
                <div className="p-4 border rounded-lg">
                  <h4 className="font-semibold mb-2">Quick Help</h4>
                  <p className="text-sm mb-4" style={{ color: tokens.colors.text.muted }}>
                    Get help and support
                  </p>
                  <Button asChild variant="primary-outline" className="w-full">
                    <Link href="/help">
                      Visit Help Center
                    </Link>
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
