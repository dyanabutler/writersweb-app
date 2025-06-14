# Supabase Database Setup & Organization

## Overview
This document outlines the proper setup and organization for the WritersWeb story management database in Supabase, with Clerk authentication compatibility.

## SQL Editor Tab Organization

### Tab 1: "🗑️ DROP & RECREATE"
**Purpose**: Clean slate setup - removes any existing conflicting tables

```sql
-- Drop existing tables to fix UUID/TEXT mismatch
DROP TABLE IF EXISTS story_images CASCADE;
DROP TABLE IF EXISTS scenes CASCADE; 
DROP TABLE IF EXISTS locations CASCADE;
DROP TABLE IF EXISTS characters CASCADE;
DROP TABLE IF EXISTS chapters CASCADE;
DROP TABLE IF EXISTS stories CASCADE;
DROP TABLE IF EXISTS profiles CASCADE;

-- Drop any existing triggers
DROP TRIGGER IF EXISTS update_profiles_updated_at ON profiles;
DROP TRIGGER IF EXISTS update_stories_updated_at ON stories;
DROP TRIGGER IF EXISTS update_characters_updated_at ON characters;
DROP TRIGGER IF EXISTS update_locations_updated_at ON locations;
DROP TRIGGER IF EXISTS update_scenes_updated_at ON scenes;

-- Drop trigger function if exists
DROP FUNCTION IF EXISTS update_updated_at_column();
```

### Tab 2: "✅ MASTER SCHEMA"
**Purpose**: The correct, production-ready schema with Clerk TEXT user IDs

```sql
-- Story Management Application Database Schema
-- Using TEXT type for Clerk user IDs from the start

-- Create profiles table with TEXT id for Clerk compatibility
CREATE TABLE IF NOT EXISTS profiles (
    id TEXT PRIMARY KEY, -- Clerk user ID like "user_2yVD8iSsstAMK7gyjpWH6hP5wVx"
    bio TEXT,
    public_profile BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create stories table
CREATE TABLE IF NOT EXISTS stories (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    genre TEXT,
    status TEXT DEFAULT 'draft',
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create characters table
CREATE TABLE IF NOT EXISTS characters (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    personality TEXT,
    backstory TEXT,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create locations table
CREATE TABLE IF NOT EXISTS locations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    description TEXT,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create scenes table
CREATE TABLE IF NOT EXISTS scenes (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
    title TEXT NOT NULL,
    content TEXT,
    scene_order INTEGER,
    featured BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Create story_images table
CREATE TABLE IF NOT EXISTS story_images (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id TEXT NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
    story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
    url TEXT NOT NULL,
    alt_text TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT now(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT now()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_images ENABLE ROW LEVEL SECURITY;

-- Create RLS policies with proper TEXT casting

-- Profiles policies
CREATE POLICY "Users can view all public profiles" ON profiles
    FOR SELECT USING (public_profile = true);

CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid()::TEXT = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid()::TEXT = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid()::TEXT = id);

-- Stories policies
CREATE POLICY "Users can view own stories" ON stories
    FOR SELECT USING (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can insert own stories" ON stories
    FOR INSERT WITH CHECK (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can update own stories" ON stories
    FOR UPDATE USING (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can delete own stories" ON stories
    FOR DELETE USING (auth.uid()::TEXT = user_id);

-- Characters policies
CREATE POLICY "Users can view own characters" ON characters
    FOR SELECT USING (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can insert own characters" ON characters
    FOR INSERT WITH CHECK (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can update own characters" ON characters
    FOR UPDATE USING (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can delete own characters" ON characters
    FOR DELETE USING (auth.uid()::TEXT = user_id);

-- Locations policies
CREATE POLICY "Users can view own locations" ON locations
    FOR SELECT USING (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can insert own locations" ON locations
    FOR INSERT WITH CHECK (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can update own locations" ON locations
    FOR UPDATE USING (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can delete own locations" ON locations
    FOR DELETE USING (auth.uid()::TEXT = user_id);

-- Scenes policies
CREATE POLICY "Users can view own scenes" ON scenes
    FOR SELECT USING (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can insert own scenes" ON scenes
    FOR INSERT WITH CHECK (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can update own scenes" ON scenes
    FOR UPDATE USING (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can delete own scenes" ON scenes
    FOR DELETE USING (auth.uid()::TEXT = user_id);

-- Story images policies
CREATE POLICY "Users can view own story images" ON story_images
    FOR SELECT USING (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can insert own story images" ON story_images
    FOR INSERT WITH CHECK (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can update own story images" ON story_images
    FOR UPDATE USING (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can delete own story images" ON story_images
    FOR DELETE USING (auth.uid()::TEXT = user_id);

-- Create indexes for better performance
CREATE INDEX IF NOT EXISTS idx_stories_user_id ON stories(user_id);
CREATE INDEX IF NOT EXISTS idx_characters_user_id ON characters(user_id);
CREATE INDEX IF NOT EXISTS idx_characters_story_id ON characters(story_id);
CREATE INDEX IF NOT EXISTS idx_locations_user_id ON locations(user_id);
CREATE INDEX IF NOT EXISTS idx_locations_story_id ON locations(story_id);
CREATE INDEX IF NOT EXISTS idx_scenes_user_id ON scenes(user_id);
CREATE INDEX IF NOT EXISTS idx_scenes_story_id ON scenes(story_id);
CREATE INDEX IF NOT EXISTS idx_story_images_user_id ON story_images(user_id);
CREATE INDEX IF NOT EXISTS idx_story_images_story_id ON story_images(story_id);
```

### Tab 3: "🔍 TESTING & QUERIES"
**Purpose**: Verification queries and ongoing testing

```sql
-- Verify tables were created correctly
SELECT table_name, column_name, data_type 
FROM information_schema.columns 
WHERE table_name IN ('profiles', 'stories', 'characters', 'locations', 'scenes', 'story_images') 
AND column_name IN ('id', 'user_id', 'featured')
ORDER BY table_name, column_name;

-- Check RLS policies
SELECT tablename, policyname, cmd 
FROM pg_policies 
WHERE schemaname = 'public'
ORDER BY tablename, policyname;

-- Verify foreign key relationships
SELECT 
    tc.table_name, 
    kcu.column_name, 
    ccu.table_name AS foreign_table_name,
    ccu.column_name AS foreign_column_name 
FROM 
    information_schema.table_constraints AS tc 
    JOIN information_schema.key_column_usage AS kcu
      ON tc.constraint_name = kcu.constraint_name
      AND tc.table_schema = kcu.table_schema
    JOIN information_schema.constraint_column_usage AS ccu
      ON ccu.constraint_name = tc.constraint_name
      AND ccu.table_schema = tc.table_schema
WHERE tc.constraint_type = 'FOREIGN KEY' 
AND tc.table_schema = 'public'
ORDER BY tc.table_name;

-- Check indexes
SELECT 
    schemaname,
    tablename,
    indexname,
    indexdef
FROM pg_indexes 
WHERE schemaname = 'public' 
AND tablename IN ('profiles', 'stories', 'characters', 'locations', 'scenes', 'story_images')
ORDER BY tablename, indexname;

-- Verify featured fields were added
SELECT 
    table_name,
    column_name,
    column_default,
    is_nullable
FROM information_schema.columns 
WHERE table_name IN ('stories', 'characters', 'locations', 'scenes')
AND column_name = 'featured'
ORDER BY table_name;
```

### Tab 4: "🎯 ADD FEATURED FIELDS & PROFILE COLUMNS"
**Purpose**: Migration to add featured content system and missing profile fields to existing database

```sql
-- Migration: Add missing profile fields for bio and public profile functionality
ALTER TABLE profiles 
ADD COLUMN IF NOT EXISTS bio TEXT,
ADD COLUMN IF NOT EXISTS public_profile BOOLEAN DEFAULT false;

-- Migration: Add missing columns to match TypeScript types
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS email TEXT NOT NULL DEFAULT '',
ADD COLUMN IF NOT EXISTS full_name TEXT,
ADD COLUMN IF NOT EXISTS avatar_url TEXT,
ADD COLUMN IF NOT EXISTS subscription_tier TEXT DEFAULT 'free' CHECK (subscription_tier IN ('free', 'pro')),
ADD COLUMN IF NOT EXISTS subscription_status TEXT DEFAULT 'active' CHECK (subscription_status IN ('active', 'cancelled', 'past_due'));

-- Migration: Add featured fields to existing tables
-- Run this if you already have the database created

-- Add featured field to stories table
ALTER TABLE stories 
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Add featured field to characters table  
ALTER TABLE characters
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Add featured field to locations table
ALTER TABLE locations
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Add featured field to scenes table
ALTER TABLE scenes
ADD COLUMN IF NOT EXISTS featured BOOLEAN DEFAULT false;

-- Create indexes for better performance on featured content queries
CREATE INDEX IF NOT EXISTS idx_stories_featured ON stories(featured, user_id) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_characters_featured ON characters(featured, user_id) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_locations_featured ON locations(featured, user_id) WHERE featured = true;
CREATE INDEX IF NOT EXISTS idx_scenes_featured ON scenes(featured, user_id) WHERE featured = true;

-- Add featured content policies (users can view featured content from public profiles)
-- Note: CREATE POLICY doesn't support IF NOT EXISTS, so we'll drop first if they exist

DROP POLICY IF EXISTS "Users can view featured stories from public profiles" ON stories;
CREATE POLICY "Users can view featured stories from public profiles" ON stories
    FOR SELECT USING (
        featured = true AND 
        user_id IN (
            SELECT id FROM profiles WHERE public_profile = true
        )
    );

DROP POLICY IF EXISTS "Users can view featured characters from public profiles" ON characters;
CREATE POLICY "Users can view featured characters from public profiles" ON characters
    FOR SELECT USING (
        featured = true AND 
        user_id IN (
            SELECT id FROM profiles WHERE public_profile = true
        )
    );

DROP POLICY IF EXISTS "Users can view featured locations from public profiles" ON locations;
CREATE POLICY "Users can view featured locations from public profiles" ON locations
    FOR SELECT USING (
        featured = true AND 
        user_id IN (
            SELECT id FROM profiles WHERE public_profile = true
        )
    );

DROP POLICY IF EXISTS "Users can view featured scenes from public profiles" ON scenes;
CREATE POLICY "Users can view featured scenes from public profiles" ON scenes
    FOR SELECT USING (
        featured = true AND 
        user_id IN (
            SELECT id FROM profiles WHERE public_profile = true
        )
    );
```

## Execution Steps

### For New Setup:
1. **Run Tab 1** - Execute the DROP statements to clean slate
2. **Run Tab 2** - Execute the complete schema creation
3. **Run Tab 3** - Verify everything was created correctly

### For Existing Database (Adding Featured Content):
1. **Run Tab 4** - Add featured fields to existing tables
2. **Run Tab 3** - Verify featured fields were added correctly

## Key Features

### Clerk Compatibility
- **Profile IDs**: TEXT type to match Clerk user IDs like `"user_2yVD8iSsstAMK7gyjpWH6hP5wVx"`
- **Foreign Keys**: All `user_id` fields are TEXT with proper foreign key constraints
- **RLS Policies**: Use `auth.uid()::TEXT` casting for proper authentication

### Public Profile System
- `profiles.public_profile` - Boolean flag for profile visibility
- `stories.featured` - Boolean flag for featured stories on public profiles
- RLS policies allow public access to profiles marked as public

### Performance Optimization
- Indexes on all foreign key relationships
- Indexes on user_id fields for efficient user data queries
- Indexes on story_id fields for efficient story-related queries

## Problem This Solved

**Original Issue**: UUID/TEXT type mismatch between profile IDs and user_id foreign keys
- Old schema: `profiles.id` was UUID but `stories.user_id` was TEXT
- Error: `operator does not exist: text = uuid`

**Solution**: Consistent TEXT typing throughout for Clerk compatibility
- All user identifiers use TEXT type
- Proper foreign key relationships maintained
- RLS policies work correctly with Clerk authentication

## Schema Overview

```
profiles (id: TEXT PK)
├── stories (user_id: TEXT FK → profiles.id)
│   ├── characters (user_id: TEXT FK, story_id: UUID FK)
│   ├── locations (user_id: TEXT FK, story_id: UUID FK)
│   ├── scenes (user_id: TEXT FK, story_id: UUID FK)
│   └── story_images (user_id: TEXT FK, story_id: UUID FK)
```

## Future Extensions

This schema supports:
- ✅ User story management
- ✅ Public profile sharing
- ✅ Featured story showcasing
- ✅ Freemium model (local vs cloud storage)
- ✅ Multi-tenant security via RLS
- 🔄 Future: Collaboration features
- 🔄 Future: Story publishing workflow 