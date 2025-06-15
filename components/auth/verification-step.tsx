"use client"

import { useState } from "react"
import { useSignUp, useSignIn } from "@clerk/nextjs"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { ArrowLeft, Mail, Loader2 } from "lucide-react"
import { useDesignSystem } from "@/components/design-system"

interface VerificationStepProps {
  mode: "signUp" | "signIn"
  emailAddress: string
  onBack: () => void
  onSuccess: () => void
}

export function VerificationStep({ mode, emailAddress, onBack, onSuccess }: VerificationStepProps) {
  const [code, setCode] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { signUp } = useSignUp()
  const { signIn } = useSignIn()
  const { tokens } = useDesignSystem()

  const handleVerification = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      if (mode === "signUp" && signUp) {
        const result = await signUp.attemptEmailAddressVerification({ code })
        
        if (result.status === "complete") {
          onSuccess()
        } else {
          setError("Verification incomplete. Please try again.")
        }
      } else if (mode === "signIn" && signIn) {
        const result = await signIn.attemptFirstFactor({
          strategy: "email_code",
          code,
        })
        
        if (result.status === "complete") {
          onSuccess()
        } else {
          setError("Verification incomplete. Please try again.")
        }
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Invalid verification code. Please try again.")
    } finally {
      setLoading(false)
    }
  }

  const resendCode = async () => {
    setLoading(true)
    setError("")

    try {
      if (mode === "signUp" && signUp) {
        await signUp.prepareEmailAddressVerification({ strategy: "email_code" })
      } else {
        setError("Code resending is only available for sign up.")
      }
    } catch (err: any) {
      setError(err.errors?.[0]?.message || "Failed to resend code.")
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center space-y-2">
        <div className="flex justify-center">
          <div 
            className="w-12 h-12 rounded-full flex items-center justify-center"
            style={{ backgroundColor: tokens.colors.primary[100] }}
          >
            <Mail className="w-6 h-6" style={{ color: tokens.colors.primary[600] }} />
          </div>
        </div>
        <h3 
          className="text-lg font-semibold"
          style={{ color: tokens.colors.text.primary }}
        >
          Check your email
        </h3>
        <p 
          className="text-sm"
          style={{ color: tokens.colors.text.muted }}
        >
          We sent a verification code to{" "}
          <span className="font-medium">{emailAddress}</span>
        </p>
      </div>

      <form onSubmit={handleVerification} className="space-y-4">
        <div>
          <Label htmlFor="code">Verification Code</Label>
          <Input
            id="code"
            type="text"
            value={code}
            onChange={(e) => setCode(e.target.value)}
            placeholder="Enter 6-digit code"
            maxLength={6}
            required
            className="text-center text-lg tracking-widest"
          />
        </div>

        {error && (
          <Alert variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        <div className="space-y-3">
          <Button
            type="submit"
            className="w-full"
            disabled={loading || code.length !== 6}
            style={{ backgroundColor: tokens.colors.primary[600] }}
          >
            {loading ? (
              <>
                <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                Verifying...
              </>
            ) : (
              "Verify Email"
            )}
          </Button>

          <div className="text-center">
            <Button
              type="button"
              variant="link"
              onClick={resendCode}
              disabled={loading}
              className="text-sm"
              style={{ color: tokens.colors.primary[600] }}
            >
              Didn't receive the code? Resend
            </Button>
          </div>

          <Button
            type="button"
            variant="ghost"
            onClick={onBack}
            className="w-full"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </form>
    </div>
  )
} 