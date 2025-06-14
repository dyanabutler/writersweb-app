"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useUser, useAuth as useClerkAuth } from "@clerk/nextjs"
import { supabase } from "@/lib/supabase/client"
import type { Database } from "@/lib/supabase/database.types"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

interface AuthContextType {
  user: any | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>
  refreshProfile: () => Promise<void>
  isSignedIn: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function ClerkAuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser()
  const { signOut: clerkSignOut } = useClerkAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isLoaded) {
      if (user) {
        fetchProfile(user.id)
      } else {
        setProfile(null)
        setLoading(false)
      }
    }
  }, [user, isLoaded])

  const fetchProfile = async (userId: string) => {
    try {
      console.log("Fetching profile for user:", userId)
      
      // Use API endpoint instead of direct Supabase query
      const response = await fetch('/api/profile')
      
      if (response.ok) {
        const result = await response.json()
        console.log("Profile fetched successfully:", result.profile)
        setProfile(result.profile)
      } else if (response.status === 404) {
        // Profile doesn't exist, create it
        console.log("Profile doesn't exist, creating one for user:", userId)
        await createProfile(userId)
      } else {
        console.error("Error fetching profile:", response.statusText)
        await createProfile(userId)
      }
    } catch (error) {
      console.error("Error in fetchProfile:", error)
      await createProfile(userId)
    } finally {
      setLoading(false)
    }
  }

  const createProfile = async (userId: string) => {
    try {
      console.log("Creating profile for user:", userId)
      
      const profileData = {
        id: userId,
        email: user?.emailAddresses?.[0]?.emailAddress || "",
        full_name: user?.fullName || user?.firstName || null,
        avatar_url: user?.imageUrl || null,
        subscription_tier: "free",
        bio: null,
        public_profile: false
      }

      const { data, error } = await supabase
        .from("profiles")
        .insert(profileData)
        .select()
        .single()

      if (error) {
        console.error("Error creating profile:", error)
      } else if (data) {
        console.log("Profile created successfully:", data)
        setProfile(data)
      }
    } catch (error) {
      console.error("Error in createProfile:", error)
    }
  }

  const signOut = async () => {
    await clerkSignOut()
    setProfile(null)
  }

  const updateProfile = async (updates: Partial<Profile>) => {
    if (!user) return { error: new Error("No user logged in") }

    const { data, error } = await supabase.from("profiles").update(updates).eq("id", user.id).select().single()

    if (!error && data) {
      setProfile(data)
    }

    return { error }
  }

  const refreshProfile = async () => {
    if (user) {
      setLoading(true)
      await fetchProfile(user.id)
    }
  }

  const value = {
    user,
    profile,
    loading: loading || !isLoaded,
    signOut,
    updateProfile,
    refreshProfile,
    isSignedIn: !!user,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within a ClerkAuthProvider")
  }
  return context
}
