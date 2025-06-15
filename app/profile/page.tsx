"use client"

import { useState, useEffect } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useAuth } from "@/lib/auth/clerk-auth-context"
import { useDataLayerContext } from "@/lib/content/data-layer"
import { 
  Mail, 
  Calendar, 
  Crown, 
  BookOpen, 
  Users, 
  MapPin, 
  Edit3, 
  ExternalLink,
  Share2,
  Settings
} from "lucide-react"
import { useDesignSystem } from "@/components/design-system"
import Image from "next/image"
import Link from "next/link"
import { ProfileEditor } from "@/components/profile/profile-editor"
import { FeaturedContentManager } from "@/components/profile/featured-content-manager"

export default function PrivateProfilePage() {
  const { user, profile } = useAuth()
  const { dataLayer } = useDataLayerContext()
  const { tokens } = useDesignSystem()
  
  const [loading, setLoading] = useState(false)
  const [editing, setEditing] = useState(false)
  const [stories, setStories] = useState<any[]>([])
  const [stats, setStats] = useState({
    totalStories: 0,
    totalCharacters: 0,
    totalChapters: 0,
    featuredStories: 0
  })
  
  const [profileData, setProfileData] = useState({
    full_name: "",
    avatar_url: null as string | null,
    bio: "",
    public_profile: false
  })

  const profileUrl = typeof window !== "undefined" 
    ? `${window.location.origin}/profile/${user?.id}` 
    : ""

  useEffect(() => {
    if (profile) {
      setProfileData({
        full_name: (profile as any).full_name || user?.fullName || "",
        avatar_url: (profile as any).avatar_url || user?.imageUrl || null,
        bio: (profile as any).bio || "",
        public_profile: (profile as any).public_profile || false
      })
    }
    
    loadUserData()
  }, [profile, user])

  const loadUserData = async () => {
    try {
      const storiesData = await dataLayer.getAllStories()
      setStories(storiesData)
      
      // Calculate stats
      const totalStories = storiesData.length
      const featuredStories = storiesData.filter(s => s.featured || false).length
      
      setStats({
        totalStories,
        totalCharacters: 0, // TODO: Implement proper counts
        totalChapters: 0,
        featuredStories
      })
    } catch (error) {
      console.error("Error loading user data:", error)
    }
  }

  const handleSaveProfile = async (formData: any) => {
    setLoading(true)
    try {
      if (!user) throw new Error("No user logged in")
      
      // Use our API endpoint to update profile
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

      const result = await response.json()
      console.log("Profile updated successfully:", result.profile)
      
      // Update local state
      setProfileData(formData)
      setEditing(false)
      alert("Profile updated successfully!")
    } catch (error) {
      console.error("Error updating profile:", error)
      alert("Error updating profile: " + (error as Error).message)
    } finally {
      setLoading(false)
    }
  }

  const handleShareProfile = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: "My Writer Profile",
          text: "Check out my writing profile!",
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
        <p>Please sign in to view your profile.</p>
      </div>
    )
  }

  if (editing) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-3xl font-bold" style={{ color: tokens.colors.text.primary }}>
            Edit Profile
          </h1>
        </div>
        
        <ProfileEditor
          initialData={profileData}
          onSave={handleSaveProfile}
          onCancel={() => setEditing(false)}
          loading={loading}
        />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold" style={{ color: tokens.colors.text.primary }}>
          My Profile
        </h1>
        <div className="flex gap-2">
          <Button variant="primary-outline" asChild>
            <Link href="/settings">
              <Settings className="w-4 h-4 mr-2" />
              Settings
            </Link>
          </Button>
          {profileData.public_profile && (
            <Button variant="primary-outline" onClick={handleShareProfile}>
              <Share2 className="w-4 h-4 mr-2" />
              Share
            </Button>
          )}
        </div>
      </div>

      {/* Profile Header */}
      <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
        <CardContent className="p-8">
          <div className="flex flex-col md:flex-row items-start gap-6">
            <div className="relative">
              <Image
                src={profileData.avatar_url || "/placeholder.svg"}
                alt={profileData.full_name || "User"}
                width={120}
                height={120}
                className="rounded-full border-4 border-white shadow-lg object-cover"
              />
              {user.publicMetadata?.subscription === "pro" && (
                <Crown 
                  className="absolute -top-2 -right-2 w-8 h-8 p-1 bg-yellow-400 rounded-full" 
                  style={{ color: tokens.colors.background.secondary }} 
                />
              )}
            </div>
            
            <div className="flex-1">
              <div className="flex items-center gap-4 mb-4">
                <h2 
                  className="text-2xl font-bold"
                  style={{ color: tokens.colors.text.primary }}
                >
                  {profileData.full_name || "Writer"}
                </h2>
                <Button 
                  variant="primary-outline" 
                  size="sm"
                  onClick={() => setEditing(true)}
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  Edit Profile
                </Button>
              </div>

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-sm" style={{ color: tokens.colors.text.muted }}>
                  <Mail className="w-4 h-4" />
                  {user.emailAddresses?.[0]?.emailAddress}
                </div>

                <div className="flex items-center gap-2 text-sm" style={{ color: tokens.colors.text.muted }}>
                  <Calendar className="w-4 h-4" />
                  Joined {new Date(user.createdAt || "").toLocaleDateString()}
                </div>

                <div className="flex flex-wrap gap-2">
                  <Badge 
                    variant={user.publicMetadata?.subscription === "pro" ? "default" : "secondary"}
                    className="flex items-center gap-1"
                  >
                    {user.publicMetadata?.subscription === "pro" && (
                      <Crown className="w-3 h-3" />
                    )}
                    {user.publicMetadata?.subscription === "pro" ? "Pro Writer" : "Free Writer"}
                  </Badge>
                  
                  <Badge variant={profileData.public_profile ? "default" : "secondary"}>
                    {profileData.public_profile ? "Public Profile" : "Private Profile"}
                  </Badge>
                </div>

                {profileData.bio && (
                  <p style={{ color: tokens.colors.text.muted }}>
                    {profileData.bio}
                  </p>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Stats Cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
          <CardContent className="p-4 text-center">
            <BookOpen className="w-8 h-8 mx-auto mb-2" style={{ color: tokens.colors.icons.accent }} />
            <div className="text-2xl font-bold" style={{ color: tokens.colors.text.primary }}>
              {stats.totalStories}
            </div>
            <div className="text-sm" style={{ color: tokens.colors.text.muted }}>
              Stories
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
          <CardContent className="p-4 text-center">
            <Users className="w-8 h-8 mx-auto mb-2" style={{ color: tokens.colors.icons.accent }} />
            <div className="text-2xl font-bold" style={{ color: tokens.colors.text.primary }}>
              {stats.totalCharacters}
            </div>
            <div className="text-sm" style={{ color: tokens.colors.text.muted }}>
              Characters
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
          <CardContent className="p-4 text-center">
            <MapPin className="w-8 h-8 mx-auto mb-2" style={{ color: tokens.colors.icons.accent }} />
            <div className="text-2xl font-bold" style={{ color: tokens.colors.text.primary }}>
              {stats.totalChapters}
            </div>
            <div className="text-sm" style={{ color: tokens.colors.text.muted }}>
              Chapters
            </div>
          </CardContent>
        </Card>

        <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
          <CardContent className="p-4 text-center">
            <Crown className="w-8 h-8 mx-auto mb-2" style={{ color: tokens.colors.icons.accent }} />
            <div className="text-2xl font-bold" style={{ color: tokens.colors.text.primary }}>
              {stats.featuredStories}
            </div>
            <div className="text-sm" style={{ color: tokens.colors.text.muted }}>
              Featured
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Featured Content Management */}
      <FeaturedContentManager />

      {/* Public Profile Link */}
      {profileData.public_profile && (
        <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
          <CardHeader>
            <CardTitle>Public Profile</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm" style={{ color: tokens.colors.text.muted }}>
                  Your public profile is live! Share it with others to showcase your work.
                </p>
                <div className="mt-2 p-2 bg-gray-100 rounded text-sm font-mono break-all">
                  {profileUrl}
                </div>
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
          </CardContent>
        </Card>
      )}
    </div>
  )
} 