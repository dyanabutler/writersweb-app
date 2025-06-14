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
import { useDesignSystem } from "@/lib/contexts/design-system-context"
import { ClerkAuthWrapper } from "@/components/auth/clerk-auth-wrapper"
import { SyncStatus } from "@/components/sync/sync-status"
import { useAuth } from "@/lib/auth/clerk-auth-context"
import Image from "next/image"
import Link from "next/link"

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
                placeholder="Search stories, characters..."
                className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent w-80"
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
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-2 p-2">
                    <Image
                      src={user.imageUrl || "/placeholder.svg"}
                      alt={user.fullName || "User"}
                      width={32}
                      height={32}
                      className="rounded-full"
                    />
                    <span className="hidden md:block text-sm font-medium">
                      {user.firstName || "User"}
                    </span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <div className="px-2 py-1.5">
                    <p className="text-sm font-medium">{user.fullName || user.firstName}</p>
                    <p className="text-xs text-gray-500">{user.emailAddresses?.[0]?.emailAddress}</p>
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
