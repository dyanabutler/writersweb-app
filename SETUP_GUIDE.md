# Story Management App - Backend Setup Guide

## Overview
This guide will help you set up the complete backend integration for your story management application with Supabase + Clerk authentication, including the new profile management features with picture upload and display name editing.

## Prerequisites
- Node.js 18+ installed
- A Supabase account and project
- A Clerk account and application
- (Optional) Cloud storage service (Cloudinary, Vercel Blob, AWS S3)
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

# File Upload Service (choose one)
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret

# Or Vercel Blob Storage
BLOB_READ_WRITE_TOKEN=vercel_blob_token

# Or AWS S3
AWS_ACCESS_KEY_ID=your_access_key
AWS_SECRET_ACCESS_KEY=your_secret_key
AWS_S3_BUCKET_NAME=your_bucket_name

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
-- Create profiles table (enhanced for profile management)
CREATE TABLE profiles (
  id TEXT PRIMARY KEY, -- Clerk user ID
  email TEXT NOT NULL,
  full_name TEXT,      -- Display name (separate from Clerk)
  avatar_url TEXT,     -- Profile picture URL
  bio TEXT,            -- User bio
  public_profile BOOLEAN DEFAULT false,
  subscription_tier TEXT DEFAULT 'free',
  subscription_status TEXT DEFAULT 'active',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create stories table
CREATE TABLE stories (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  title TEXT NOT NULL,
  author TEXT,
  genre TEXT,
  status TEXT DEFAULT 'planning' CHECK (status IN ('planning', 'writing', 'editing', 'complete')),
  word_count_goal INTEGER DEFAULT 50000,
  current_word_count INTEGER DEFAULT 0,
  description TEXT,
  featured BOOLEAN DEFAULT false, -- For public profiles
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create chapters table
CREATE TABLE chapters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE NOT NULL,
  slug TEXT NOT NULL,
  title TEXT NOT NULL,
  chapter_number INTEGER NOT NULL,
  status TEXT DEFAULT 'draft' CHECK (status IN ('draft', 'review', 'complete', 'published')),
  word_count INTEGER DEFAULT 0,
  pov TEXT,
  location TEXT,
  timeline TEXT,
  summary TEXT,
  content TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(story_id, slug),
  UNIQUE(story_id, chapter_number)
);

-- Create characters table
CREATE TABLE characters (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  role TEXT,
  age INTEGER,
  background TEXT,
  personality TEXT,
  goals TEXT,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create locations table
CREATE TABLE locations (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  description TEXT,
  type TEXT,
  significance TEXT,
  images TEXT[] DEFAULT '{}',
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create scenes table
CREATE TABLE scenes (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
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

-- Create story_images table
CREATE TABLE story_images (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id TEXT REFERENCES profiles(id) ON DELETE CASCADE NOT NULL,
  story_id UUID REFERENCES stories(id) ON DELETE CASCADE,
  url TEXT NOT NULL,
  alt_text TEXT,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Enable Row Level Security
ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE stories ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE characters ENABLE ROW LEVEL SECURITY;
ALTER TABLE locations ENABLE ROW LEVEL SECURITY;
ALTER TABLE scenes ENABLE ROW LEVEL SECURITY;
ALTER TABLE story_images ENABLE ROW LEVEL SECURITY;

-- Create RLS policies
-- Profiles policies
CREATE POLICY "Users can view all public profiles" ON profiles
    FOR SELECT USING (public_profile = true);

CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid()::TEXT = id);

CREATE POLICY "Users can update own profile" ON profiles
    FOR UPDATE USING (auth.uid()::TEXT = id);

CREATE POLICY "Users can insert own profile" ON profiles
    FOR INSERT WITH CHECK (auth.uid()::TEXT = id);

-- Stories policies (including public access for featured stories)
CREATE POLICY "Users can view own stories" ON stories
    FOR SELECT USING (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can view featured stories of public profiles" ON stories
    FOR SELECT USING (
        featured = true AND 
        EXISTS (
            SELECT 1 FROM profiles 
            WHERE profiles.id = stories.user_id 
            AND profiles.public_profile = true
        )
    );

CREATE POLICY "Users can insert own stories" ON stories
    FOR INSERT WITH CHECK (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can update own stories" ON stories
    FOR UPDATE USING (auth.uid()::TEXT = user_id);

CREATE POLICY "Users can delete own stories" ON stories
    FOR DELETE USING (auth.uid()::TEXT = user_id);

-- Similar policies for other tables...
-- (Add remaining RLS policies as needed)

-- Create indexes for performance
CREATE INDEX idx_stories_user_id ON stories(user_id);
CREATE INDEX idx_stories_featured ON stories(featured) WHERE featured = true;
CREATE INDEX idx_profiles_public ON profiles(public_profile) WHERE public_profile = true;
CREATE INDEX idx_characters_user_id ON characters(user_id);
CREATE INDEX idx_characters_story_id ON characters(story_id);
CREATE INDEX idx_locations_user_id ON locations(user_id);
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
CREATE TRIGGER update_characters_updated_at BEFORE UPDATE ON characters FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_locations_updated_at BEFORE UPDATE ON locations FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_scenes_updated_at BEFORE UPDATE ON scenes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
```

### 2.2 Storage Setup (Optional - for file uploads)
1. Go to Supabase Dashboard > Storage
2. Create a new bucket called `profile-pictures`
3. Set the bucket to public
4. Configure appropriate RLS policies for the bucket

## Step 3: Clerk Configuration

### 3.1 Basic Setup
1. Create a new Clerk application
2. Configure your allowed redirect URLs:
   - Development: `http://localhost:3000`
   - Production: `https://your-domain.com`

### 3.2 JWT Template Setup (CRITICAL)
**This step is essential for profile management to work properly!**

1. In Clerk Dashboard, go to **JWT Templates**
2. Create a new template with these settings:
   - **Name**: `supabase` (exactly this)
   - **Signing Algorithm**: `HS256`
   - **Claims**:
   ```json
   {
     "app_metadata": {},
     "aud": "authenticated",
     "email": "{{user.primary_email_address}}",
     "role": "authenticated",
     "user_metadata": {}
   }
   ```
3. Save the template

### 3.3 Webhook Configuration
1. In Clerk Dashboard, go to Webhooks
2. Create a new webhook endpoint: `https://your-domain.com/api/webhooks/clerk`
3. Select events: `user.created`, `user.updated`, `user.deleted`
4. Copy the webhook secret to your `.env.local`

## Step 4: Install Dependencies

```bash
# Core dependencies (if not already installed)
npm install @clerk/nextjs @supabase/supabase-js

# File upload dependencies (choose one)
npm install cloudinary              # For Cloudinary
npm install @vercel/blob           # For Vercel Blob
npm install @aws-sdk/client-s3     # For AWS S3

# Optional: Additional UI components
npm install lucide-react           # Icons (if not installed)
```

## Step 5: API Routes Setup

The following API routes should already be in your project, but verify they exist:

### 5.1 Profile Management API
```typescript
// app/api/profile/route.ts
// Handles GET (fetch) and PUT (update) for profiles
```

### 5.2 File Upload API (New)
```typescript
// app/api/upload/profile-picture/route.ts
// Handles profile picture uploads
```

### 5.3 Webhook Handler
```typescript
// app/api/webhooks/clerk/route.ts
// Syncs Clerk user changes with Supabase
```

## Step 6: Test Your Setup

### 6.1 Profile Management Test
1. Start your development server: `npm run dev`
2. Sign in with Clerk
3. Go to `/profile`
4. Click "Edit Profile"
5. Try uploading a profile picture
6. Change your display name
7. Add a bio
8. Toggle public profile
9. Save changes
10. Refresh page - changes should persist ✅

### 6.2 Public Profile Test
1. Enable public profile in settings
2. Visit `/profile/[your-user-id]`
3. Verify your public profile displays correctly
4. Test the share functionality

## Step 7: Production Deployment

### 7.1 Environment Variables
Ensure all environment variables are set in your production environment:
- Vercel: Project Settings > Environment Variables
- Netlify: Site Settings > Environment Variables
- Other platforms: Follow platform-specific guides

### 7.2 Database Migration
1. Run the SQL schema in your production Supabase instance
2. Verify RLS policies are active
3. Test API endpoints in production

### 7.3 File Storage
1. Configure your chosen file storage service in production
2. Update CORS settings if needed
3. Test file uploads in production environment

## 🎉 Success Checklist

- [ ] Supabase database schema created
- [ ] Clerk JWT template configured  
- [ ] Environment variables set
- [ ] Dependencies installed
- [ ] Profile picture upload working
- [ ] Display name editing working
- [ ] Changes persist after refresh  
- [ ] Public profiles display correctly
- [ ] File uploads work in production

## 📚 Additional Resources

- **JWT Template Setup**: See `docs/JWT_TEMPLATE_SETUP.md`
- **Profile Management Features**: See `docs/PROFILE_MANAGEMENT_FEATURES.md`
- **Public Profile System**: See `docs/PUBLIC_PROFILE_FEATURE.md`
- **Database Setup**: See `docs/SUPABASE_DATABASE_SETUP.md`

---

## 🚀 You're Ready!

Your Story Management App now has complete profile management with picture uploads, display name editing, and public profile sharing! Users can create rich, professional profiles to showcase their writing. ✨ 