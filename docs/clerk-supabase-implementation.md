# Clerk + Supabase Implementation Guide

## Why This Combo is PERFECT

### 🔐 **Clerk (Authentication)**
- User management, OAuth, security
- Beautiful UI components
- Zero maintenance required

### 🗄️ **Supabase (Database + More)**
- PostgreSQL database with real-time subscriptions
- Built-in file storage for images
- Row Level Security (RLS)
- Edge functions for serverless logic
- Real-time sync across devices

### 🤖 **v0 Integration**
- I can help generate Supabase schemas
- I can create database queries
- I can set up real-time subscriptions

## Architecture Overview

\`\`\`
┌─────────────┐    ┌─────────────┐    ┌─────────────┐
│    Clerk    │    │   Your App  │    │  Supabase   │
│             │    │             │    │             │
│ • Auth      │◄──►│ • UI        │◄──►│ • Database  │
│ • Users     │    │ • Logic     │    │ • Storage   │
│ • Sessions  │    │ • State     │    │ • Real-time │
└─────────────┘    └─────────────┘    └─────────────┘
                           │
                           ▼
                   ┌─────────────┐
                   │   Stripe    │
                   │             │
                   │ • Payments  │
                   │ • Billing   │
                   └─────────────┘
\`\`\`

## Implementation Steps

### 1. Install Dependencies

\`\`\`bash
npm install @clerk/nextjs @supabase/supabase-js stripe @stripe/stripe-js
\`\`\`

### 2. Environment Variables

\`\`\`env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...

# Supabase Database
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...
SUPABASE_SERVICE_ROLE_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Stripe Payments
STRIPE_SECRET_KEY=sk_test_...
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_...
STRIPE_WEBHOOK_SECRET=whsec_...
\`\`\`

### 3. Supabase Schema

\`\`\`sql
-- Enable RLS
ALTER TABLE auth.users ENABLE ROW LEVEL SECURITY;

-- Create profiles table (synced with Clerk)
CREATE TABLE profiles (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT UNIQUE NOT NULL,
  email TEXT NOT NULL,
  first_name TEXT,
  last_name TEXT,
  avatar_url TEXT,
  subscription_plan TEXT DEFAULT 'free',
  stripe_customer_id TEXT UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create subscriptions table
CREATE TABLE subscriptions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT REFERENCES profiles(clerk_user_id) ON DELETE CASCADE,
  stripe_subscription_id TEXT UNIQUE,
  stripe_customer_id TEXT,
  plan TEXT NOT NULL DEFAULT 'free',
  status TEXT NOT NULL DEFAULT 'active',
  current_period_end TIMESTAMP WITH TIME ZONE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stories table
CREATE TABLE stories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT REFERENCES profiles(clerk_user_id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  description TEXT,
  genre TEXT,
  status TEXT DEFAULT 'planning',
  word_count_goal INTEGER,
  current_word_count INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chapters table
CREATE TABLE chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT REFERENCES profiles(clerk_user_id) ON DELETE CASCADE,
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  content TEXT,
  chapter_number INTEGER NOT NULL,
  status TEXT DEFAULT 'draft',
  word_count INTEGER DEFAULT 0,
  pov TEXT,
  location TEXT,
  timeline TEXT,
  summary TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(clerk_user_id, slug)
);

-- Create characters table
CREATE TABLE characters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT REFERENCES profiles(clerk_user_id) ON DELETE CASCADE,
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  role TEXT NOT NULL,
  age INTEGER,
  status TEXT DEFAULT 'alive',
  location TEXT,
  affiliations TEXT[] DEFAULT '{}',
  relationships TEXT[] DEFAULT '{}',
  first_appearance TEXT,
  description TEXT,
  backstory TEXT,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(clerk_user_id, slug)
);

-- Create locations table
CREATE TABLE locations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT REFERENCES profiles(clerk_user_id) ON DELETE CASCADE,
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  slug TEXT NOT NULL,
  name TEXT NOT NULL,
  type TEXT DEFAULT 'other',
  description TEXT,
  significance TEXT,
  images TEXT[] DEFAULT '{}',
  connected_chapters TEXT[] DEFAULT '{}',
  connected_characters TEXT[] DEFAULT '{}',
  parent_location TEXT,
  climate TEXT,
  population TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(clerk_user_id, slug)
);

-- Create scenes table
CREATE TABLE scenes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  clerk_user_id TEXT REFERENCES profiles(clerk_user_id) ON DELETE CASCADE,
  chapter_id UUID REFERENCES chapters(id) ON DELETE CASCADE,
  title TEXT NOT NULL,
  slug TEXT NOT NULL,
  order_number INTEGER NOT NULL,
  summary TEXT,
  content TEXT,
  characters TEXT[] DEFAULT '{}',
  location TEXT,
  timeline TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Row Level Security Policies
CREATE POLICY "Users can view own profile" ON profiles FOR SELECT USING (clerk_user_id = current_setting('app.current_user_id'));
CREATE POLICY "Users can update own profile" ON profiles FOR UPDATE USING (clerk_user_id = current_setting('app.current_user_id'));

CREATE POLICY "Users can view own stories" ON stories FOR SELECT USING (clerk_user_id = current_setting('app.current_user_id'));
CREATE POLICY "Users can insert own stories" ON stories FOR INSERT WITH CHECK (clerk_user_id = current_setting('app.current_user_id'));
CREATE POLICY "Users can update own stories" ON stories FOR UPDATE USING (clerk_user_id = current_setting('app.current_user_id'));
CREATE POLICY "Users can delete own stories" ON stories FOR DELETE USING (clerk_user_id = current_setting('app.current_user_id'));

CREATE POLICY "Users can view own chapters" ON chapters FOR SELECT USING (clerk_user_id = current_setting('app.current_user_id'));
CREATE POLICY "Users can insert own chapters" ON chapters FOR INSERT WITH CHECK (clerk_user_id = current_setting('app.current_user_id'));
CREATE POLICY "Users can update own chapters" ON chapters FOR UPDATE USING (clerk_user_id = current_setting('app.current_user_id'));
CREATE POLICY "Users can delete own chapters" ON chapters FOR DELETE USING (clerk_user_id = current_setting('app.current_user_id'));

CREATE POLICY "Users can view own characters" ON characters FOR SELECT USING (clerk_user_id = current_setting('app.current_user_id'));
CREATE POLICY "Users can insert own characters" ON characters FOR INSERT WITH CHECK (clerk_user_id = current_setting('app.current_user_id'));
CREATE POLICY "Users can update own characters" ON characters FOR UPDATE USING (clerk_user_id = current_setting('app.current_user_id'));
CREATE POLICY "Users can delete own characters" ON characters FOR DELETE USING (clerk_user_id = current_setting('app.current_user_id'));

CREATE POLICY "Users can view own locations" ON locations FOR SELECT USING (clerk_user_id = current_setting('app.current_user_id'));
CREATE POLICY "Users can insert own locations" ON locations FOR INSERT WITH CHECK (clerk_user_id = current_setting('app.current_user_id'));
CREATE POLICY "Users can update own locations" ON locations FOR UPDATE USING (clerk_user_id = current_setting('app.current_user_id'));
CREATE POLICY "Users can delete own locations" ON locations FOR DELETE USING (clerk_user_id = current_setting('app.current_user_id'));

CREATE POLICY "Users can view own scenes" ON scenes FOR SELECT USING (clerk_user_id = current_setting('app.current_user_id'));
CREATE POLICY "Users can insert own scenes" ON scenes FOR INSERT WITH CHECK (clerk_user_id = current_setting('app.current_user_id'));
CREATE POLICY "Users can update own scenes" ON scenes FOR UPDATE USING (clerk_user_id = current_setting('app.current_user_id'));
CREATE POLICY "Users can delete own scenes" ON scenes FOR DELETE USING (clerk_user_id = current_setting('app.current_user_id'));

-- Enable RLS on all tables
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE subscriptions ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenes ENABLE ROW LEVEL SECURITY;

-- Create indexes for performance
CREATE INDEX idx_chapters_clerk_user_id ON chapters(clerk_user_id);
CREATE INDEX idx_chapters_story_id ON chapters(story_id);
CREATE INDEX idx_characters_clerk_user_id ON characters(clerk_user_id);
CREATE INDEX idx_characters_story_id ON characters(story_id);
CREATE INDEX idx_locations_clerk_user_id ON locations(clerk_user_id);
CREATE INDEX idx_locations_story_id ON locations(story_id);
CREATE INDEX idx_scenes_clerk_user_id ON scenes(clerk_user_id);
CREATE INDEX idx_scenes_chapter_id ON scenes(chapter_id);

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
CREATE TRIGGER update_subscriptions_updated_at BEFORE UPDATE ON subscriptions FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_stories_updated_at BEFORE UPDATE ON stories FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_chapters_updated_at BEFORE UPDATE ON chapters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_characters_updated_at BEFORE UPDATE ON characters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scenes_updated_at BEFORE UPDATE ON scenes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
\`\`\`

### 4. Supabase Client Setup

\`\`\`typescript
// lib/supabase.ts
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

export const supabase = createClient(supabaseUrl, supabaseAnonKey)

// Server-side client with service role
export const supabaseAdmin = createClient(
  supabaseUrl,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
)
\`\`\`

### 5. Database Hooks with Clerk Integration

\`\`\`typescript
// lib/hooks/use-chapters.ts
import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import type { Chapter } from '@/lib/types'

export function useChapters(storyId?: string) {
  const { user } = useUser()
  const [chapters, setChapters] = useState<Chapter[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return

    const fetchChapters = async () => {
      // Set RLS context
      await supabase.rpc('set_current_user_id', { user_id: user.id })
      
      let query = supabase
        .from('chapters')
        .select('*')
        .eq('clerk_user_id', user.id)
        .order('chapter_number')

      if (storyId) {
        query = query.eq('story_id', storyId)
      }

      const { data, error } = await query

      if (error) {
        console.error('Error fetching chapters:', error)
      } else {
        setChapters(data || [])
      }
      setLoading(false)
    }

    fetchChapters()

    // Set up real-time subscription
    const subscription = supabase
      .channel('chapters')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chapters',
          filter: `clerk_user_id=eq.${user.id}`,
        },
        (payload) => {
          console.log('Chapter change received:', payload)
          fetchChapters() // Refetch data
        }
      )
      .subscribe()

    return () => {
      subscription.unsubscribe()
    }
  }, [user, storyId])

  const createChapter = async (chapterData: Partial<Chapter>) => {
    if (!user) return null

    await supabase.rpc('set_current_user_id', { user_id: user.id })
    
    const { data, error } = await supabase
      .from('chapters')
      .insert({
        ...chapterData,
        clerk_user_id: user.id,
      })
      .select()
      .single()

    if (error) {
      console.error('Error creating chapter:', error)
      return null
    }

    return data
  }

  const updateChapter = async (id: string, updates: Partial<Chapter>) => {
    if (!user) return null

    await supabase.rpc('set_current_user_id', { user_id: user.id })
    
    const { data, error } = await supabase
      .from('chapters')
      .update(updates)
      .eq('id', id)
      .eq('clerk_user_id', user.id)
      .select()
      .single()

    if (error) {
      console.error('Error updating chapter:', error)
      return null
    }

    return data
  }

  const deleteChapter = async (id: string) => {
    if (!user) return false

    await supabase.rpc('set_current_user_id', { user_id: user.id })
    
    const { error } = await supabase
      .from('chapters')
      .delete()
      .eq('id', id)
      .eq('clerk_user_id', user.id)

    if (error) {
      console.error('Error deleting chapter:', error)
      return false
    }

    return true
  }

  return {
    chapters,
    loading,
    createChapter,
    updateChapter,
    deleteChapter,
  }
}
\`\`\`

### 6. Real-time Sync Component

\`\`\`typescript
// components/sync/real-time-sync.tsx
'use client'
import { useUser } from '@clerk/nextjs'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Cloud, CloudOff, Wifi, WifiOff } from 'lucide-react'

export function RealTimeSync() {
  const { user } = useUser()
  const [isOnline, setIsOnline] = useState(true)
  const [lastSync, setLastSync] = useState<Date>(new Date())
  const [syncStatus, setSyncStatus] = useState<'connected' | 'disconnected' | 'syncing'>('connected')

  useEffect(() => {
    if (!user) return

    // Monitor online status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Set up Supabase real-time connection
    const channel = supabase.channel('sync-status')
    
    channel
      .on('presence', { event: 'sync' }, () => {
        setSyncStatus('connected')
        setLastSync(new Date())
      })
      .on('presence', { event: 'join' }, () => {
        setSyncStatus('connected')
      })
      .on('presence', { event: 'leave' }, () => {
        setSyncStatus('disconnected')
      })
      .subscribe(async (status) => {
        if (status === 'SUBSCRIBED') {
          await channel.track({ user_id: user.id, online_at: new Date().toISOString() })
        }
      })

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
      channel.unsubscribe()
    }
  }, [user])

  const getStatusIcon = () => {
    if (!isOnline) return <WifiOff className="w-4 h-4 text-gray-400" />
    if (syncStatus === 'connected') return <Cloud className="w-4 h-4 text-green-500" />
    if (syncStatus === 'syncing') return <Cloud className="w-4 h-4 text-blue-500 animate-pulse" />
    return <CloudOff className="w-4 h-4 text-red-500" />
  }

  const getStatusText = () => {
    if (!isOnline) return 'Offline'
    if (syncStatus === 'connected') return `Synced ${lastSync.toLocaleTimeString()}`
    if (syncStatus === 'syncing') return 'Syncing...'
    return 'Disconnected'
  }

  if (!user?.publicMetadata?.subscription || user.publicMetadata.subscription === 'free') {
    return (
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <CloudOff className="w-4 h-4" />
        Local only
      </div>
    )
  }

  return (
    <div className="flex items-center gap-2 text-sm">
      {getStatusIcon()}
      <span className={isOnline && syncStatus === 'connected' ? 'text-green-600' : 'text-gray-500'}>
        {getStatusText()}
      </span>
    </div>
  )
}
\`\`\`

### 7. File Storage for Images

\`\`\`typescript
// lib/storage.ts
import { supabase } from '@/lib/supabase'

export class StorageManager {
  async uploadImage(file: File, userId: string, type: 'character' | 'location' | 'scene'): Promise<string | null> {
    const fileExt = file.name.split('.').pop()
    const fileName = `${userId}/${type}/${Date.now()}.${fileExt}`

    const { data, error } = await supabase.storage
      .from('story-images')
      .upload(fileName, file)

    if (error) {
      console.error('Error uploading file:', error)
      return null
    }

    const { data: { publicUrl } } = supabase.storage
      .from('story-images')
      .getPublicUrl(data.path)

    return publicUrl
  }

  async deleteImage(url: string): Promise<boolean> {
    // Extract path from URL
    const path = url.split('/').slice(-3).join('/')
    
    const { error } = await supabase.storage
      .from('story-images')
      .remove([path])

    if (error) {
      console.error('Error deleting file:', error)
      return false
    }

    return true
  }
}

export const storageManager = new StorageManager()
\`\`\`

### 8. Clerk Webhooks (Sync with Supabase)

\`\`\`typescript
// app/api/webhooks/clerk/route.ts
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { supabaseAdmin } from '@/lib/supabase'

export async function POST(req: Request) {
  const WEBHOOK_SECRET = process.env.CLERK_WEBHOOK_SECRET

  const headerPayload = headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  const body = await req.text()

  const wh = new Webhook(WEBHOOK_SECRET)
  let evt: WebhookEvent

  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    }) as WebhookEvent
  } catch (err) {
    return new Response('Error occurred', { status: 400 })
  }

  switch (evt.type) {
    case 'user.created':
      await handleUserCreated(evt.data)
      break
    
    case 'user.updated':
      await handleUserUpdated(evt.data)
      break
      
    case 'user.deleted':
      await handleUserDeleted(evt.data)
      break
  }

  return new Response('', { status: 200 })
}

async function handleUserCreated(userData: any) {
  // Create profile in Supabase
  const { error: profileError } = await supabaseAdmin
    .from('profiles')
    .insert({
      clerk_user_id: userData.id,
      email: userData.email_addresses[0].email_address,
      first_name: userData.first_name,
      last_name: userData.last_name,
      avatar_url: userData.image_url,
    })

  if (profileError) {
    console.error('Error creating profile:', profileError)
    return
  }

  // Create default story
  const { error: storyError } = await supabaseAdmin
    .from('stories')
    .insert({
      clerk_user_id: userData.id,
      title: "My First Story",
      description: "Start writing your story here!",
    })

  if (storyError) {
    console.error('Error creating default story:', storyError)
  }
}

async function handleUserUpdated(userData: any) {
  const { error } = await supabaseAdmin
    .from('profiles')
    .update({
      email: userData.email_addresses[0].email_address,
      first_name: userData.first_name,
      last_name: userData.last_name,
      avatar_url: userData.image_url,
    })
    .eq('clerk_user_id', userData.id)

  if (error) {
    console.error('Error updating profile:', error)
  }
}

async function handleUserDeleted(userData: any) {
  // Delete user data (cascading deletes will handle related data)
  const { error } = await supabaseAdmin
    .from('profiles')
    .delete()
    .eq('clerk_user_id', userData.id)

  if (error) {
    console.error('Error deleting user data:', error)
  }
}
\`\`\`

## Benefits of This Architecture

### 🚀 **Performance**
- **Real-time updates** across all devices
- **Optimistic updates** for instant UI feedback
- **Edge functions** for serverless logic
- **CDN-delivered** static assets

### 🔒 **Security**
- **Row Level Security** - users only see their data
- **Clerk handles auth** - enterprise-grade security
- **API keys** managed securely
- **HTTPS everywhere**

### 🛠️ **Developer Experience**
- **Type-safe** database queries
- **Real-time subscriptions** out of the box
- **File storage** included
- **v0 can help** generate queries and schemas

### 💰 **Cost Effective**
- **Clerk**: Free for 10K users, then $25/month
- **Supabase**: Free tier, then $25/month
- **Stripe**: 2.9% + 30¢ per transaction
- **Total**: ~$50/month for a full-featured SaaS

### 🔄 **Real-time Features**
- **Live collaboration** (future feature)
- **Instant sync** across devices
- **Presence indicators** (who's online)
- **Conflict resolution** built-in

This is the PERFECT stack for your Story Manager! 🎉
