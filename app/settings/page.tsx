"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth/clerk-auth-context"
import { useDataLayerContext } from "@/lib/content/data-layer"
import { Share2, ExternalLink, Crown, Save } from "lucide-react"
import { useDesignSystem } from "@/lib/contexts/design-system-context"
import Link from "next/link"
import { supabase } from "@/lib/supabase/client"

export default function SettingsPage() {
  const { user, profile, updateProfile } = useAuth()
  const { dataLayer } = useDataLayerContext()
  const { tokens } = useDesignSystem()
  
  const [loading, setLoading] = useState(false)
  const [stories, setStories] = useState<any[]>([])
  const [formData, setFormData] = useState({
    bio: "",
    public_profile: false
  })

  const profileUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/profile/${user?.id}` 
    : ""

  useEffect(() => {
    if (profile) {
      setFormData({
        bio: (profile as any).bio || "",
        public_profile: (profile as any).public_profile || false
      })
    }
    
    loadStories()
  }, [profile])

  const loadStories = async () => {
    try {
      const storiesData = await dataLayer.getAllStories()
      setStories(storiesData)
    } catch (error) {
      console.error("Error loading stories:", error)
    }
  }

  const handleSaveProfile = async () => {
    setLoading(true)
    try {
      if (!user) throw new Error("No user logged in")
      
      // Use our API endpoint to update profile (bypasses RLS)
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          bio: formData.bio,
          public_profile: formData.public_profile
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to update profile')
      }

      const result = await response.json()
      console.log("Profile updated successfully:", result.profile)
      alert("Profile updated successfully!")
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Error updating profile: " + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const toggleStoryFeatured = async (storyId: string, featured: boolean) => {
    try {
      setStories(prev => 
        prev.map(story => 
          story.id === storyId ? { ...story, featured } : story
        )
      )
      console.log(`Story ${storyId} featured: ${featured}`)
    } catch (error) {
      alert("Error updating story")
    }
  }

  const handleShareProfile = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Writer Profile",
          text: "Check out my featured stories!",
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
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold" style={{ color: tokens.colors.text.primary }}>
          Settings
        </h1>
      </div>

      {/* Public Profile Settings */}
      <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Share2 className="w-5 h-5" />
            Public Profile
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <div>
                <Label htmlFor="public-profile">Enable Public Profile</Label>
                <p className="text-sm text-gray-500">
                  Allow others to see your featured stories and characters
                </p>
              </div>
              <Switch
                id="public-profile"
                checked={formData.public_profile}
                onCheckedChange={(checked) => 
                  setFormData(prev => ({ ...prev, public_profile: checked }))
                }
              />
            </div>

            <div>
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                placeholder="Tell people about yourself and your writing..."
                value={formData.bio}
                onChange={(e) => 
                  setFormData(prev => ({ ...prev, bio: e.target.value }))
                }
                rows={3}
              />
            </div>

            <Button 
              onClick={handleSaveProfile} 
              disabled={loading}
              style={{ backgroundColor: tokens.colors.primary[600] }}
            >
              <Save className="w-4 h-4 mr-2" />
              {loading ? "Saving..." : "Save Profile"}
            </Button>
          </div>

          {formData.public_profile && (
            <div className="border-t pt-6">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Your Profile URL</h4>
                  <p className="text-sm text-gray-500">Share this link to showcase your work</p>
                </div>
                <div className="flex gap-2">
                  <Button variant="outline" onClick={handleShareProfile}>
                    <Share2 className="w-4 h-4 mr-2" />
                    Share
                  </Button>
                  <Button asChild variant="outline">
                    <Link href={`/profile/${user.id}`} target="_blank">
                      <ExternalLink className="w-4 h-4 mr-2" />
                      Preview
                    </Link>
                  </Button>
                </div>
              </div>
              <div className="mt-2 p-2 bg-gray-100 rounded text-sm font-mono break-all">
                {profileUrl}
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Featured Stories */}
      <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
        <CardHeader>
          <CardTitle>Featured Stories</CardTitle>
          <p className="text-sm text-gray-500">
            Choose which stories to showcase on your public profile
          </p>
        </CardHeader>
        <CardContent>
          {stories.length > 0 ? (
            <div className="space-y-3">
              {stories.map((story) => (
                <div 
                  key={story.id}
                  className="flex items-center justify-between p-3 border rounded-lg"
                  style={{ borderColor: tokens.colors.neutral[200] }}
                >
                  <div className="flex-1">
                    <h4 className="font-medium">{story.title}</h4>
                    {story.description && (
                      <p className="text-sm text-gray-500 truncate">
                        {story.description}
                      </p>
                    )}
                    <div className="flex items-center gap-2 mt-1">
                      {story.genre && (
                        <Badge variant="outline" className="text-xs">
                          {story.genre}
                        </Badge>
                      )}
                      {story.featured && (
                        <Badge className="text-xs bg-green-100 text-green-800">
                          Featured
                        </Badge>
                      )}
                    </div>
                  </div>
                  <Switch
                    checked={story.featured || false}
                    onCheckedChange={(checked) => 
                      toggleStoryFeatured(story.id, checked)
                    }
                    disabled={!formData.public_profile}
                  />
                </div>
              ))}
            </div>
          ) : (
            <p className="text-center py-8 text-gray-500">
              No stories yet. Create your first story to get started!
            </p>
          )}
        </CardContent>
      </Card>

      {/* Account Info */}
      <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
        <CardHeader>
          <CardTitle>Account Information</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Label>Name</Label>
            <Input 
              value={user.fullName || user.firstName || ""} 
              disabled 
              className="bg-gray-50"
            />
          </div>
          <div>
            <Label>Email</Label>
            <Input 
              value={user.emailAddresses?.[0]?.emailAddress || ""} 
              disabled 
              className="bg-gray-50"
            />
          </div>
          <div className="flex items-center gap-2">
            <Label>Subscription</Label>
            <Badge 
              variant={user.publicMetadata?.subscription === "pro" ? "default" : "secondary"}
              className="flex items-center gap-1"
            >
              {user.publicMetadata?.subscription === "pro" && (
                <Crown className="w-3 h-3" />
              )}
              {user.publicMetadata?.subscription === "pro" ? "Pro" : "Free"}
            </Badge>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
