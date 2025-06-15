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

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded, isSignedIn } = useUser()
  const { getToken, signOut: clerkSignOut } = useClerkAuth()
  const [profile, setProfile] = useState<Profile | null>(null)
  const [profileLoaded, setProfileLoaded] = useState(false)

  // 🔥 Critical: Set Supabase auth token from Clerk
  useEffect(() => {
    const syncAuth = async () => {
      if (!isSignedIn) {
        await supabase.auth.signOut()
        return
      }

      const token = await getToken({ template: "supabase" })
      if (token) {
        await supabase.auth.setSession({
          access_token: token,
          refresh_token: token,
        })
      }
      await ensureProfile(user)
    }

    if (isLoaded) void syncAuth()
  }, [isLoaded, isSignedIn, user])

  // Fetch profile using API instead of direct Supabase call
  const fetchProfile = async () => {
    try {
      const response = await fetch('/api/profile')
      
      if (response.ok) {
        const { profile } = await response.json()
        setProfile(profile)
      } else if (response.status === 404) {
        // Profile doesn't exist, create one
        const createResponse = await fetch('/api/profile', {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            email: user?.emailAddresses?.[0]?.emailAddress || "",
            full_name: user?.fullName || "",
            avatar_url: user?.imageUrl || "",
          })
        })
        
        if (createResponse.ok) {
          const { profile } = await createResponse.json()
          setProfile(profile)
        }
      } else {
        console.error("Error fetching profile:", response.statusText)
      }
    } catch (error) {
      console.error("Error fetching profile:", error)
    } finally {
      setProfileLoaded(true)
    }
  }

  useEffect(() => {
    if (isSignedIn && user?.id) {
      fetchProfile()
    } else {
      setProfile(null)
      setProfileLoaded(true)
    }
  }, [isSignedIn, user?.id])

  const updateProfile = async (updates: Partial<Profile>): Promise<{ error: any }> => {
    if (!user?.id) return { error: "Not authenticated" }

    try {
      const response = await fetch('/api/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(updates)
      })

      if (!response.ok) {
        const errorData = await response.json()
        return { error: errorData.error || 'Failed to update profile' }
      }

      const { profile } = await response.json()
      setProfile(profile)
      return { error: null }
    } catch (error) {
      return { error }
    }
  }

  const refreshProfile = async () => {
    if (!user?.id) return
    
    try {
      setProfileLoaded(false)
      const response = await fetch('/api/profile')
      
      if (response.ok) {
        const { profile } = await response.json()
        setProfile(profile)
        console.log('✅ Profile refreshed successfully')
      } else {
        console.error('❌ Error refreshing profile:', response.statusText)
      }
    } catch (error) {
      console.error('❌ Error refreshing profile:', error)
    } finally {
      setProfileLoaded(true)
    }
  }

  const signOut = async () => {
    await supabase.auth.signOut()
    await clerkSignOut()
  }

  const value = {
    user,
    profile,
    loading: !isLoaded || !profileLoaded,
    signOut,
    updateProfile,
    refreshProfile,
    isSignedIn: isSignedIn ?? false,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}

// helper 🔽
async function ensureProfile(u: any) {
  if (!u?.id) return
  await supabase
    .from("profiles")
    .upsert(
      {
        id: u.id,
        email: u.emailAddresses?.[0]?.emailAddress ?? "",
        full_name: u.fullName ?? "",
        avatar_url: u.imageUrl ?? "",
      },
      { onConflict: "id" }
    )
}
