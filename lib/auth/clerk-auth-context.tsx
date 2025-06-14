"use client"

import type React from "react"
import { createContext, useContext, useEffect, useState } from "react"
import { useUser, useAuth as useClerkAuth, useSignIn, useSignUp } from "@clerk/nextjs"
import { supabase } from "@/lib/supabase/client"
import type { Database } from "@/lib/supabase/database.types"

type Profile = Database["public"]["Tables"]["profiles"]["Row"]

interface AuthContextType {
  user: any | null
  profile: Profile | null
  loading: boolean
  signOut: () => Promise<void>
  signIn: (email: string, password: string) => Promise<{ error: any }>
  signUp: (email: string, password: string, fullName: string) => Promise<{ error: any }>
  updateProfile: (updates: Partial<Profile>) => Promise<{ error: any }>
  isSignedIn: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function ClerkAuthProvider({ children }: { children: React.ReactNode }) {
  const { user, isLoaded } = useUser()
  const { signOut: clerkSignOut } = useClerkAuth()
  const { signIn: clerkSignIn, isLoaded: signInReady } = useSignIn()
  const { signUp: clerkSignUp, isLoaded: signUpReady } = useSignUp()
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
      const { data, error } = await supabase.from("profiles").select("*").eq("id", userId).single()

      if (error) {
        console.error("Error fetching profile:", error)
        // Profile might not exist yet (webhook hasn't processed)
        // This is normal for new users
      } else if (data) {
        setProfile(data)
      }
    } catch (error) {
      console.error("Error in fetchProfile:", error)
    } finally {
      setLoading(false)
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

  const signIn = async (email: string, password: string) => {
    if (!signInReady) return { error: new Error("Auth not ready") }
    try {
      await clerkSignIn?.create({ identifier: email, password })
      return { error: null }
    } catch (error: any) {
      return { error }
    }
  }

  const signUp = async (email: string, password: string, fullName: string) => {
    if (!signUpReady) return { error: new Error("Auth not ready") }
    try {
      await clerkSignUp?.create({ emailAddress: email, password })
      // optional: set full name in public metadata
      await clerkSignUp?.prepareEmailAddressVerification({ strategy: "email_code" })
      return { error: null }
    } catch (error: any) {
      return { error }
    }
  }

  const value = {
    user,
    profile,
    loading: loading || !isLoaded,
    signOut,
    signIn,
    signUp,
    updateProfile,
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
