"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { 
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Search, Bell, Settings, HelpCircle, Palette, User, LogOut } from "lucide-react"
import { useDesignSystem } from "@/components/design-system"
import { ClerkAuthWrapper } from "@/components/auth/clerk-auth-wrapper"
import { SyncStatus } from "@/components/sync/sync-status"
import { useAuth } from "@/lib/auth/clerk-auth-context"
import Image from "next/image"
import Link from "next/link"

export function Header() {
  const { tokens } = useDesignSystem()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const { user, profile, isSignedIn, loading, signOut } = useAuth()

  // Get display name and avatar from profile or fallback to Clerk data
  const displayName = profile?.full_name || user?.fullName || user?.firstName || "User"
  const firstName = profile?.full_name?.split(' ')[0] || user?.firstName || "User"
  const avatarUrl = profile?.avatar_url || user?.imageUrl || "/placeholder.svg"

  if (loading) {
    return (
      <header
        className="shadow-sm border-b px-6 py-4"
        style={{ 
          backgroundColor: tokens.colors.background.secondary,
          borderColor: tokens.colors.border.secondary
        }}
      >
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <div className="h-10 w-64 rounded animate-pulse" style={{ backgroundColor: tokens.colors.neutral[300] }} />
          </div>
          <div className="flex items-center space-x-4">
            <div className="h-8 w-20 rounded animate-pulse" style={{ backgroundColor: tokens.colors.neutral[300] }} />
          </div>
        </div>
      </header>
    )
  }

  return (
    <>
      <header
        className="shadow-sm border-b px-6 py-4"
        style={{ 
          backgroundColor: tokens.colors.background.secondary,
          borderColor: tokens.colors.border.secondary
        }}
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
                placeholder="Search stories, characters..."
                className="pl-10 pr-4 py-2 border rounded-md focus:outline-none focus:ring-2 focus:border-transparent w-80"
                style={{
                  backgroundColor: tokens.colors.background.primary,
                  color: tokens.colors.text.primary,
                  borderColor: tokens.colors.border.primary,
                  ...({"--tw-ring-color": tokens.colors.primary[500]} as any),
                }}
              />
            </div>
          </div>

          <div className="flex items-center space-x-4">
            {isSignedIn && <SyncStatus />}

            <Button variant="neutral-ghost" size="sm">
              <Bell className="w-5 h-5" style={{ color: tokens.colors.icons.secondary }} />
            </Button>

            {isSignedIn && user ? (
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <button className="flex items-center gap-2 p-2 rounded-lg transition-colors hover:bg-opacity-10" style={{ backgroundColor: 'transparent' }}>
                    <Image
                      src={avatarUrl}
                      alt={displayName}
                      width={32}
                      height={32}
                      className="rounded-full object-cover"
                    />
                    <span className="hidden md:block text-sm font-medium" style={{ color: tokens.colors.text.primary }}>
                      {firstName}
                    </span>
                  </button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium" style={{ color: tokens.colors.text.primary }}>{displayName}</p>
                    <p className="text-xs" style={{ color: tokens.colors.text.muted }}>{user.emailAddresses?.[0]?.emailAddress}</p>
                  </div>
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem asChild>
                    <Link href="/profile" className="flex items-center">
                      <User className="w-4 h-4 mr-2" />
                      My Profile
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem asChild>
                    <Link href="/settings" className="flex items-center">
                      <Settings className="w-4 h-4 mr-2" />
                      Settings
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuSeparator />
                  
                  <DropdownMenuItem asChild>
                    <Link href="/help" className="flex items-center">
                      <HelpCircle className="w-4 h-4 mr-2" />
                      Help & Support
                    </Link>
                  </DropdownMenuItem>
                  
                  <DropdownMenuItem 
                    onClick={async () => await signOut()}
                    className="text-red-600 focus:text-red-600"
                  >
                    <LogOut className="w-4 h-4 mr-2" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
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
