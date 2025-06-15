"use client"

import { useState } from "react"
import { SignIn, SignUp, useUser, useSignUp, useSignIn } from "@clerk/nextjs"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { X, Cloud } from "lucide-react"
import { useDesignSystem } from "@/components/design-system"
import { VerificationStep } from "./verification-step"

interface ClerkAuthWrapperProps {
  isOpen: boolean
  onClose: () => void
}

export function ClerkAuthWrapper({ isOpen, onClose }: ClerkAuthWrapperProps) {
  const { tokens } = useDesignSystem()
  const { isSignedIn } = useUser()
  const { signUp } = useSignUp()
  const { signIn } = useSignIn()
  const [showVerification, setShowVerification] = useState(false)
  const [verificationMode, setVerificationMode] = useState<"signUp" | "signIn">("signUp")
  const [verificationEmail, setVerificationEmail] = useState("")

  // Auto-close when user signs in
  if (isSignedIn && isOpen) {
    onClose()
  }

  // Check if we need to show verification
  const needsVerification = 
    (signUp?.status === "missing_requirements" && signUp?.unverifiedFields?.includes("email_address")) ||
    (signIn?.status === "needs_first_factor")

  // Show verification step if needed and not already signed in
  if ((showVerification || needsVerification) && !isSignedIn) {
    const email = verificationEmail || 
      signUp?.emailAddress || 
      signIn?.identifier || ""

    const mode = signUp?.status === "missing_requirements" ? "signUp" : "signIn"

    return (
      <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
        <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto" style={{ backgroundColor: tokens.colors.background.secondary }}>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2" style={{ color: tokens.colors.text.primary }}>
                <Cloud className="w-5 h-5" style={{ color: tokens.colors.icons.accent }} />
                Verify Your Email
              </CardTitle>
              <Button variant="primary-ghost" size="sm" onClick={() => {
                setShowVerification(false)
                // Reset Clerk state
                if (signUp && signUp.status !== "complete") {
                  signUp.reload?.()
                }
                if (signIn && signIn.status !== "complete") {
                  signIn.reload?.()
                }
                onClose()
              }}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardHeader>
          <CardContent>
            <VerificationStep
              mode={mode}
              emailAddress={email}
              onBack={() => {
                setShowVerification(false)
                // Reset Clerk state
                if (signUp && signUp.status !== "complete") {
                  signUp.reload?.()
                }
                if (signIn && signIn.status !== "complete") {
                  signIn.reload?.()
                }
              }}
              onSuccess={() => {
                setShowVerification(false)
                onClose()
              }}
            />
          </CardContent>
        </Card>
      </div>
    )
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <Card className="w-full max-w-md max-h-[90vh] overflow-y-auto" style={{ backgroundColor: tokens.colors.background.secondary }}>
        <CardHeader>
          <div className="flex items-center justify-between">
            <CardTitle className="flex items-center gap-2" style={{ color: tokens.colors.text.primary }}>
              <Cloud className="w-5 h-5" style={{ color: tokens.colors.icons.accent }} />
              Welcome to Story Manager
            </CardTitle>
            <Button variant="primary-ghost" size="sm" onClick={onClose}>
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
                routing="hash"
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
                fallbackRedirectUrl="/"
              />
            </TabsContent>

            <TabsContent value="signup">
              <SignUp
                routing="hash"
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
                fallbackRedirectUrl="/"
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
