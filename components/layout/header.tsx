"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Search, Bell } from "lucide-react"
import { useDesignSystem } from "@/lib/contexts/design-system-context"
import { ClerkAuthWrapper } from "@/components/auth/clerk-auth-wrapper"
import { UserMenu } from "@/components/auth/user-menu"
import { SyncStatus } from "@/components/sync/sync-status"
import { useAuth } from "@/lib/auth/clerk-auth-context"

export function Header() {
  const { tokens } = useDesignSystem()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user, isSignedIn, loading, signOut } = useAuth()

  if (loading) {
    return (
      <header
        className="shadow-sm border-b border-gray-200 px-6 py-4"
        style={{ backgroundColor: tokens.colors.background.secondary }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-64 bg-gray-200 rounded animate-pulse" />
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-8 w-20 bg-gray-200 rounded animate-pulse" />
          </div>
        </div>
      </header>
    )
  }

  return (
    <>
      <header
        className="shadow-sm border-b border-gray-200 px-6 py-4"
        style={{ backgroundColor: tokens.colors.background.secondary }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="relative">
              <Search
                className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2"
                style={{ color: tokens.colors.icons.muted }}
              />
              <input
                type="text"
                placeholder="Search chapters, characters..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                style={{
                  backgroundColor: tokens.colors.background.primary,
                  color: tokens.colors.text.primary,
                  borderColor: tokens.colors.neutral[300],
                }}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isSignedIn && <SyncStatus />}

            <Button variant="ghost" size="sm">
              <Bell className="w-5 h-5" style={{ color: tokens.colors.icons.secondary }} />
            </Button>

            {isSignedIn && user ? (
              <UserMenu 
                user={{
                  id: user.id,
                  name: user.fullName || user.firstName || "User",
                  email: user.emailAddresses?.[0]?.emailAddress || "",
                  subscription: (user.publicMetadata?.subscription as "free" | "pro") || "free",
                  avatar: user.imageUrl || ""
                }} 
                onLogout={async () => {
                  await signOut()
                }} 
              />
            ) : (
              <Button onClick={() => setShowAuthModal(true)}>Sign In</Button>
            )}
          </div>
        </div>
      </header>

      <ClerkAuthWrapper isOpen={showAuthModal} onClose={() => setShowAuthModal(false)} />
    </>
  )
}
