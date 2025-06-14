"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { useDesignSystem } from "@/lib/contexts/design-system-context"
import { MarkdownRenderer } from "@/components/docs/markdown-renderer"
import { ArrowLeft, Clock, User, ExternalLink } from "lucide-react"
import Link from "next/link"

const setupGuideContent = `
# Story Management App - Complete Setup Guide

## Overview
This comprehensive guide will walk you through setting up your complete Story Manager application with all features including profile management, public profiles, and file uploads.

## Prerequisites
- Node.js 18+ installed
- A Supabase account and project
- A Clerk account and application
- (Optional) Cloud storage service (Cloudinary, Vercel Blob, AWS S3)

## Step 1: Environment Configuration

Create a \`.env.local\` file in your project root:

\`\`\`env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_anon_key_here
SUPABASE_SERVICE_ROLE_KEY=your_service_role_key_here

# File Upload Service (choose one)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
\`\`\`

## Step 2: Database Setup

### 2.1 Create Tables
Run this SQL in your Supabase SQL editor:

\`\`\`sql
-- Create profiles table
CREATE TABLE profiles (
  id TEXT PRIMARY KEY,
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  bio TEXT,
  public_profile BOOLEAN DEFAULT false,
  subscription_tier TEXT DEFAULT 'free',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);
\`\`\`

### 2.2 Enable Row Level Security
\`\`\`sql
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can view own profile" ON profiles
  FOR SELECT USING (auth.uid()::TEXT = id);
\`\`\`

## Step 3: Clerk Configuration

### 3.1 JWT Template Setup
1. Go to Clerk Dashboard → JWT Templates
2. Create template named "supabase"
3. Use these settings:
   - Algorithm: HS256
   - Claims: Default template

### 3.2 Webhook Configuration
1. Create webhook endpoint: \`/api/webhooks/clerk\`
2. Select events: user.created, user.updated
3. Copy webhook secret to environment variables

## Step 4: Install Dependencies

\`\`\`bash
npm install @clerk/nextjs @supabase/supabase-js
npm install cloudinary  # For file uploads
\`\`\`

## Step 5: Test Your Setup

1. Start development server: \`npm run dev\`
2. Sign in with Clerk
3. Go to profile page
4. Test profile editing features
5. Upload a profile picture
6. Verify changes persist after refresh

## Success Checklist

- [ ] Environment variables configured
- [ ] Database schema created
- [ ] Clerk JWT template setup
- [ ] Profile management working
- [ ] File uploads functional
- [ ] Changes persist after refresh

## Need Help?

If you encounter issues, check our troubleshooting guides or contact support.
`

export default function SetupGuidePage() {
  const { tokens } = useDesignSystem()

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <Button variant="outline" asChild>
          <Link href="/help/docs">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Docs
          </Link>
        </Button>
        
        <div className="flex gap-2">
          <Badge className="bg-blue-100 text-blue-800">setup</Badge>
          <Badge className="bg-green-100 text-green-800 flex items-center gap-1">
            <User className="w-3 h-3" />
            beginner
          </Badge>
        </div>
      </div>

      {/* Content */}
      <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
        <CardHeader>
          <div className="flex items-center gap-2 text-sm" style={{ color: tokens.colors.text.muted }}>
            <Clock className="w-4 h-4" />
            Last updated: January 15, 2024
          </div>
        </CardHeader>
        <CardContent className="prose max-w-none">
          <MarkdownRenderer content={setupGuideContent} />
        </CardContent>
      </Card>

      {/* Related Docs */}
      <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
        <CardHeader>
          <CardTitle>Related Documentation</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <Link href="/help/docs/jwt-template-setup" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <h4 className="font-semibold mb-2">JWT Template Setup</h4>
              <p className="text-sm text-gray-600">Configure Clerk JWT templates</p>
            </Link>
            <Link href="/help/docs/database-setup" className="p-4 border rounded-lg hover:bg-gray-50 transition-colors">
              <h4 className="font-semibold mb-2">Database Configuration</h4>
              <p className="text-sm text-gray-600">Complete database schema setup</p>
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 