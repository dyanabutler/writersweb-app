import { notFound } from "next/navigation"
import { supabase } from "@/lib/supabase/server"
import { PublicProfile } from "@/components/profile/public-profile"
import { auth } from "@clerk/nextjs/server"

interface ProfilePageProps {
  params: Promise<{ userId: string }>
}

async function getPublicProfile(userId: string) {
  try {
    console.log("Getting profile for userId:", userId)
    
    // Check if current user is viewing their own profile
    const { userId: currentUserId } = await auth()
    const isOwnProfile = currentUserId === userId
    console.log("Current user:", currentUserId, "Viewing own profile:", isOwnProfile)

    // Get user profile - show to owner regardless of public_profile setting
    const { data: profile, error: profileError } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId)
      .single()

    console.log("Profile data:", profile)
    console.log("Profile error:", profileError)

    if (profileError || !profile) {
      console.error("Profile error:", profileError)
      return null
    }

    // If not the owner, check if profile is public
    if (!isOwnProfile && !profile.public_profile) {
      console.log("Profile is private and not owner")
      return null
    }

    // Get all featured content for this user
    const [storiesResult, charactersResult, locationsResult, scenesResult] = await Promise.all([
      supabase
        .from("stories")
        .select("*")
        .eq("user_id", userId)
        .order("created_at", { ascending: false }),
      
      supabase
        .from("characters")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false }),
      
      supabase
        .from("locations")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false }),
      
      supabase
        .from("scenes")
        .select("*")
        .eq("user_id", userId)
        .order("updated_at", { ascending: false })
    ])

    console.log("Featured content results:", {
      stories: storiesResult,
      characters: charactersResult,
      locations: locationsResult,
      scenes: scenesResult
    })

    return { 
      profile, 
      stories: storiesResult.data || [],
      characters: charactersResult.data || [],
      locations: locationsResult.data || [],
      scenes: scenesResult.data || []
    }
  } catch (error) {
    console.error("Error in getPublicProfile:", error)
    return null
  }
}

export default async function ProfilePage({ params }: ProfilePageProps) {
  const { userId } = await params
  const profileData = await getPublicProfile(userId)

  if (!profileData) {
    notFound()
  }

  return <PublicProfile 
    profile={profileData.profile} 
    stories={profileData.stories}
    characters={profileData.characters}
    locations={profileData.locations}
    scenes={profileData.scenes}
  />
}

export async function generateMetadata({ params }: ProfilePageProps) {
  const { userId } = await params
  const profileData = await getPublicProfile(userId)

  if (!profileData) {
    return {
      title: "Profile Not Found",
    }
  }

  return {
    title: `${profileData.profile.full_name || "Writer"}'s Profile | Story Manager`,
    description: `Check out ${profileData.profile.full_name || "this writer"}'s featured stories, characters, and chapters.`,
    openGraph: {
      title: `${profileData.profile.full_name || "Writer"}'s Profile`,
      description: `Check out ${profileData.profile.full_name || "this writer"}'s featured stories, characters, and chapters.`,
      images: profileData.profile.avatar_url ? [profileData.profile.avatar_url] : [],
    },
  }
} 