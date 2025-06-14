# Story Management App - Backend Setup Guide

## Overview
This guide will help you set up the complete backend integration for your story management application with Supabase + Clerk authentication and the freemium model.

## Prerequisites
- Node.js 18+ installed
- A Supabase account and project
- A Clerk account and application
- (Optional) A Stripe account for payments

## Step 1: Environment Configuration

### 1.1 Create Environment File
Create a `.env.local` file in your project root with the following variables:

```env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_publishable_key_here
CLERK_SECRET_KEY=sk_test_your_secret_key_here
CLERK_WEBHOOK_SECRET=whsec_your_webhook_secret_here

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe Payments (Optional - for pro features)
STRIPE_SECRET_KEY=sk_test_your_stripe_secret_key
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your_stripe_publishable_key
STRIPE_WEBHOOK_SECRET=whsec_your_stripe_webhook_secret

# App Configuration
NEXT_PUBLIC_APP_ENV=development
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

## Step 2: Supabase Setup

### 2.1 Database Schema
Run the following SQL in your Supabase SQL editor:

```sql
-- Create profiles table (synced with Clerk)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT NOT NULL,
  full_name TEXT,
  avatar_url TEXT,
  subscription_tier TEXT DEFAULT 'free',
  subscription_status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stories table
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id TEXT NOT NULL,
  title TEXT NOT NULL,
  author TEXT,
  genre TEXT,
  status TEXT DEFAULT 'planning',
  word_count_goal INTEGER,
  current_word_count INTEGER DEFAULT 0,
  description TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chapters table
CREATE TABLE chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  chapter_number INTEGER NOT NULL,
  status TEXT DEFAULT 'draft',
  word_count INTEGER DEFAULT 0,
  pov TEXT,
  location TEXT,
  timeline TEXT,
  summary TEXT,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create characters table
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT,
  age INTEGER,
  status TEXT DEFAULT 'alive',
  location TEXT,
  affiliations TEXT[] DEFAULT '{}',
  relationships TEXT[] DEFAULT '{}',
  first_appearance TEXT,
  description TEXT,
  backstory TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create locations table
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'other',
  description TEXT,
  significance TEXT,
  parent_location TEXT,
  climate TEXT,
  population TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scenes table
CREATE TABLE scenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  order_index INTEGER NOT NULL,
  summary TEXT,
  content TEXT,
  characters TEXT[] DEFAULT '{}',
  location TEXT,
  timeline TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create story_images table
CREATE TABLE story_images (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  filename TEXT NOT NULL,
  storage_path TEXT NOT NULL,
  alt_text TEXT,
  image_type TEXT DEFAULT 'reference',
  connected_characters TEXT[] DEFAULT '{}',
  connected_locations TEXT[] DEFAULT '{}',
  connected_chapters TEXT[] DEFAULT '{}',
  connected_scenes TEXT[] DEFAULT '{}',
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_images ENABLE ROW LEVEL SECURITY;

-- Create basic RLS policies (for now, allow authenticated users to access their own data)
CREATE POLICY "Users can view own stories" ON stories FOR SELECT USING (auth.uid()::text = user_id);
CREATE POLICY "Users can insert own stories" ON stories FOR INSERT WITH CHECK (auth.uid()::text = user_id);
CREATE POLICY "Users can update own stories" ON stories FOR UPDATE USING (auth.uid()::text = user_id);
CREATE POLICY "Users can delete own stories" ON stories FOR DELETE USING (auth.uid()::text = user_id);

-- Create indexes for performance
CREATE INDEX idx_stories_user_id ON stories(user_id);
CREATE INDEX idx_chapters_story_id ON chapters(story_id);
CREATE INDEX idx_characters_story_id ON characters(story_id);
CREATE INDEX idx_locations_story_id ON locations(story_id);
CREATE INDEX idx_scenes_chapter_id ON scenes(chapter_id);
CREATE INDEX idx_story_images_story_id ON story_images(story_id);

-- Create updated_at trigger function
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Add updated_at triggers
CREATE TRIGGER update_profiles_updated_at BEFORE UPDATE ON profiles FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stories_updated_at BEFORE UPDATE ON stories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chapters_updated_at BEFORE UPDATE ON chapters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_characters_updated_at BEFORE UPDATE ON characters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scenes_updated_at BEFORE UPDATE ON scenes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 2.2 Storage Setup
1. Go to Supabase Dashboard > Storage
2. Create a new bucket called `story-images`
3. Set the bucket to public
4. Configure appropriate RLS policies for the bucket

## Step 3: Clerk Configuration

### 3.1 Basic Setup
1. Create a new Clerk application
2. Configure your allowed redirect URLs:
   - Development: `http://localhost:3000`
   - Production: `https://your-domain.com`

### 3.2 Webhook Configuration
1. In Clerk Dashboard, go to Webhooks
2. Create a new webhook endpoint: `https://your-domain.com/api/webhooks/clerk`
3. Select events: `user.created`, `user.updated`, `user.deleted`
4. Copy the webhook secret to your `.env.local`

### 3.3 User Metadata Setup
Configure user public metadata to include subscription information:
- `subscription`: "free" | "pro"
- `subscriptionStatus`: "active" | "cancelled" | "past_due"

## Step 4: Application Integration

### 4.1 Update Your Layout
Add the DataLayerProvider to your root layout:

```tsx
// app/layout.tsx
import { DataLayerProvider } from "@/lib/content/data-layer-provider"
import { ClerkProvider } from "@clerk/nextjs"

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en">
      <body>
        <ClerkProvider>
          <DataLayerProvider>
            {children}
          </DataLayerProvider>
        </ClerkProvider>
      </body>
    </html>
  )
}
```

### 4.2 Add Sync Status to Your UI
```tsx
// In your main layout/header component
import { SyncStatus } from "@/components/sync/sync-status"

export function Header() {
  return (
    <header className="border-b">
      <div className="flex items-center justify-between p-4">
        <h1>Story Manager</h1>
        <SyncStatus />
      </div>
    </header>
  )
}
```

### 4.3 Add Story Selector
```tsx
// In your main navigation
import { StorySelector } from "@/components/common/story-selector"

export function Navigation() {
  const [selectedStoryId, setSelectedStoryId] = useState<string>()
  
  const handleStorySelect = (story: StoryMetadata & { id: string }) => {
    setSelectedStoryId(story.id)
    // Handle story selection logic
  }

  return (
    <nav className="p-4">
      <StorySelector
        selectedStoryId={selectedStoryId}
        onStorySelect={handleStorySelect}
      />
    </nav>
  )
}
```

## Step 5: Using the Data Layer

### 5.1 In Your Components
```tsx
"use client"

import { useDataLayerContext } from "@/lib/content/data-layer"

export function ChaptersList() {
  const { dataLayer, isPro, isLocal } = useDataLayerContext()
  const [chapters, setChapters] = useState<Chapter[]>([])

  useEffect(() => {
    async function loadChapters() {
      const data = await dataLayer.getAllChapters(selectedStoryId)
      setChapters(data)
    }
    loadChapters()
  }, [dataLayer, selectedStoryId])

  // Your component logic...
}
```

## Step 6: Testing

### 6.1 Test Local Mode
1. Start your development server: `npm run dev`
2. Access the app without signing in
3. Verify that data is stored locally and sync status shows "Local Storage"

### 6.2 Test Cloud Mode
1. Sign up for an account
2. Set user metadata to pro subscription
3. Verify that data syncs to Supabase
4. Test real-time updates

## Step 7: Deployment

### 7.1 Environment Variables
Make sure all environment variables are set in your deployment platform.

### 7.2 Database Migration
Run the database schema creation in your production Supabase instance.

### 7.3 Webhook URLs
Update your Clerk webhook URL to point to your production domain.

## Troubleshooting

### Common Issues

1. **RLS Policies Not Working**
   - Check that your policies match your user identification strategy
   - Verify that `current_setting('app.current_user_id')` is being set correctly

2. **Webhook Failures**
   - Check webhook logs in Clerk dashboard
   - Verify webhook secret matches your environment variable
   - Ensure your webhook endpoint is accessible

3. **Storage Issues**
   - Verify bucket policies are configured correctly
   - Check that file uploads have proper permissions

### Debug Mode
Enable debug logging by adding to your `.env.local`:
```env
NEXT_PUBLIC_DEBUG=true
```

## Next Steps

1. **Real-time Features**: Implement Supabase real-time subscriptions
2. **Offline Support**: Add service worker for offline functionality
3. **Image Optimization**: Implement image resizing and optimization
4. **Search**: Add full-text search across all content
5. **Export**: Implement story export to various formats

## Support

For additional help:
1. Check the component documentation in `/docs`
2. Review the database schema in `/lib/supabase/database.types.ts`
3. Test the API endpoints in `/app/api`

---

**Important**: Make sure to test thoroughly in development before deploying to production. The freemium model switching between local and cloud storage is a critical feature that needs careful testing. 