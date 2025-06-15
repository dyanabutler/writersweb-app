"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { useDesignSystem } from "@/components/design-system"
import { 
  Book,
  MessageCircle,
  Mail,
  ChevronRight
} from "lucide-react"
import Link from "next/link"

export default function HelpPage() {
  const { tokens } = useDesignSystem()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h1 className="text-3xl font-bold mb-2" style={{ color: tokens.colors.text.primary }}>
          Help & Support
        </h1>
        <p className="text-lg" style={{ color: tokens.colors.text.muted }}>
          Get help with your Story Manager
        </p>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="text-center">
          <CardContent className="p-8">
            <Book className="w-12 h-12 mx-auto mb-4" style={{ color: tokens.colors.icons.accent }} />
            <h3 className="text-xl font-semibold mb-3" style={{ color: tokens.colors.text.primary }}>
              Documentation
            </h3>
            <p className="mb-6" style={{ color: tokens.colors.text.muted }}>
              Complete guides for setup, features, and troubleshooting
            </p>
            <Button asChild>
              <Link href="/help/docs">
                Browse Documentation
                <ChevronRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-8">
            <MessageCircle className="w-12 h-12 mx-auto mb-4" style={{ color: tokens.colors.icons.accent }} />
            <h3 className="text-xl font-semibold mb-3" style={{ color: tokens.colors.text.primary }}>
              Community
            </h3>
            <p className="mb-6" style={{ color: tokens.colors.text.muted }}>
              Connect with other writers and get community support
            </p>
            <Button variant="outline" disabled>
              Coming Soon
            </Button>
          </CardContent>
        </Card>

        <Card className="text-center">
          <CardContent className="p-8">
            <Mail className="w-12 h-12 mx-auto mb-4" style={{ color: tokens.colors.icons.accent }} />
            <h3 className="text-xl font-semibold mb-3" style={{ color: tokens.colors.text.primary }}>
              Direct Support
            </h3>
            <p className="mb-6" style={{ color: tokens.colors.text.muted }}>
              Get help directly from our support team
            </p>
            <Button variant="outline" disabled>
              Contact Support
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Popular Docs */}
      <Card>
        <CardHeader>
          <CardTitle>Popular Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <Link href="/help/docs/setup-guide" className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Complete Setup Guide</h4>
                  <p className="text-sm text-gray-600">Get your Story Manager up and running</p>
                </div>
                <ChevronRight className="w-5 h-5" />
              </div>
            </Link>
            
            <Link href="/help/docs/profile-features" className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Profile Management</h4>
                  <p className="text-sm text-gray-600">Upload pictures and customize your profile</p>
                </div>
                <ChevronRight className="w-5 h-5" />
              </div>
            </Link>
            
            <Link href="/help/docs/public-profiles" className="block p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <div className="flex items-center justify-between">
                <div>
                  <h4 className="font-semibold">Public Profile Sharing</h4>
                  <p className="text-sm text-gray-600">Share your writing with the world</p>
                </div>
                <ChevronRight className="w-5 h-5" />
              </div>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 