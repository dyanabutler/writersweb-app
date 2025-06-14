"use client"

import { SignIn, SignUp, useUser } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Cloud } from "lucide-react"
import { useDesignSystem } from "@/lib/contexts/design-system-context"

interface ClerkAuthWrapperProps {
  isOpen: boolean
  onClose: () => void
}

export function ClerkAuthWrapper({ isOpen, onClose }: ClerkAuthWrapperProps) {
  const { tokens } = useDesignSystem()
  const { isSignedIn } = useUser()

  // Auto-close when user signs in
  if (isSignedIn && isOpen) {
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md" style={{ backgroundColor: tokens.colors.background.secondary }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2" style={{ color: tokens.colors.text.primary }}>
              <Cloud className="w-5 h-5" style={{ color: tokens.colors.icons.accent }} />
              Welcome to Story Manager
            </CardTitle>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X className="w-4 h-4" />
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="signin" className="space-y-4">
            <TabsList className="grid w-full grid-cols-2">
              <TabsTrigger value="signin">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>

            <TabsContent value="signin">
              <SignIn
                appearance={{
                  elements: {
                    formButtonPrimary: {
                      backgroundColor: tokens.colors.primary[600],
                    },
                    card: {
                      backgroundColor: "transparent",
                      boxShadow: "none",
                    },
                  },
                }}
                redirectUrl="/"
              />
            </TabsContent>

            <TabsContent value="signup">
              <SignUp
                appearance={{
                  elements: {
                    formButtonPrimary: {
                      backgroundColor: tokens.colors.primary[600],
                    },
                    card: {
                      backgroundColor: "transparent",
                      boxShadow: "none",
                    },
                  },
                }}
                redirectUrl="/"
              />
            </TabsContent>
          </Tabs>

          <div className="mt-6 text-center">
            <p className="text-sm" style={{ color: tokens.colors.text.muted }}>
              Free forever locally. Upgrade for cloud sync across all your devices.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}
