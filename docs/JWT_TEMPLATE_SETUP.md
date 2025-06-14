# JWT Template Setup Guide

## Overview
Complete guide to setting up Clerk JWT templates for Supabase integration. This enables proper authentication between Clerk and Supabase with Row Level Security (RLS).

## 🎯 Why JWT Templates?

### The Problem
- **Clerk handles authentication** - Users sign in through Clerk
- **Supabase handles data** - Stories, profiles stored in Supabase
- **RLS needs verification** - Supabase RLS policies need to verify user identity
- **Token bridge required** - JWT templates bridge Clerk auth to Supabase

### The Solution
JWT templates create tokens that Supabase can verify, allowing RLS policies to work with Clerk authentication.

## 📋 Step-by-Step Setup

### Step 1: Access Clerk Dashboard
1. Go to [https://dashboard.clerk.com](https://dashboard.clerk.com)
2. Select your project
3. Navigate to **JWT Templates** in left sidebar

### Step 2: Create New Template
1. Click **+ New template**
2. Choose **Blank** (Supabase preset if available)
3. Configure template settings:

#### Template Configuration
```json
{
  "app_metadata": {},
  "aud": "authenticated",
  "email": "{{user.primary_email_address}}",
  "role": "authenticated", 
  "user_metadata": {}
}
```

#### Template Settings
- **Name**: `supabase` (exactly this name)
- **Signing Algorithm**: `HS256` (keep default)
- **Token Lifetime**: `3600` (1 hour)
- **Include in session**: `false` (leave unchecked)

### Step 3: Save Template
1. Click **Save** to create the template
2. Verify template appears in your JWT Templates list
3. Note the template name is exactly `supabase`

## 🔧 Integration Code

### Auth Context Integration
```typescript
// lib/auth/clerk-auth-context.tsx
import { useAuth as useClerkAuth } from "@clerk/nextjs"

const { getToken } = useClerkAuth()

const setupSupabaseAuth = async () => {
  try {
    // Get JWT token using the template
    const token = await getToken({ template: "supabase" })
    
    if (token) {
      // Set token for Supabase client
      await supabase.auth.setSession({
        access_token: token,
        refresh_token: "placeholder", // Clerk handles refresh
      })
    }
  } catch (error) {
    console.error("Error setting up Supabase auth:", error)
  }
}
```

### API Route Usage
```typescript
// app/api/example/route.ts
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  const { userId } = await auth()
  
  // userId matches the JWT 'sub' claim
  // This works with RLS policies like:
  // auth.uid()::TEXT = user_id
}
```

## 🛡️ RLS Policy Compatibility

### Database Policies
Your RLS policies work with JWT tokens:

```sql
-- Profile access policy
CREATE POLICY "Users can view own profile" ON profiles
    FOR SELECT USING (auth.uid()::TEXT = id);

-- Story access policy  
CREATE POLICY "Users can view own stories" ON stories
    FOR SELECT USING (auth.uid()::TEXT = user_id);
```

### How It Works
1. **User signs in** through Clerk
2. **Frontend requests JWT** using template
3. **JWT sent to Supabase** with requests
4. **Supabase verifies JWT** and extracts user ID
5. **RLS policies check** `auth.uid()` against data
6. **Access granted/denied** based on ownership

## 🚨 Troubleshooting

### Common Issues

#### "Can't use reserved claim: sub"
- **Problem**: Trying to manually set `sub` claim
- **Solution**: Remove `"sub": "{{user.id}}"` - Clerk sets this automatically

#### "Property expected" JSON Error
- **Problem**: Invalid JSON syntax in template
- **Solution**: Use the exact template provided above

#### RLS Policies Still Failing
- **Problem**: JWT not being sent properly
- **Solution**: Check auth context setup and token retrieval

#### Template Not Found
- **Problem**: Template name mismatch
- **Solution**: Ensure template is named exactly `supabase`

### Debug Steps
1. **Check template exists**: Verify in Clerk dashboard
2. **Test token generation**: Log token in browser console
3. **Verify token claims**: Decode JWT at jwt.io
4. **Check Supabase logs**: Look for auth errors
5. **Test RLS policies**: Use Supabase SQL editor

## 🔍 Testing Your Setup

### Frontend Test
```typescript
// Test JWT token generation
const testAuth = async () => {
  const { getToken } = useAuth()
  
  try {
    const token = await getToken({ template: "supabase" })
    console.log("JWT Token:", token)
    
    if (token) {
      // Decode and inspect claims
      const claims = JSON.parse(atob(token.split('.')[1]))
      console.log("JWT Claims:", claims)
    }
  } catch (error) {
    console.error("Token generation failed:", error)
  }
}
```

### Database Test
```sql
-- Test RLS policy in Supabase SQL editor
SELECT auth.uid(); -- Should return user ID when authenticated
SELECT * FROM profiles WHERE id = auth.uid()::TEXT;
```

## 📈 Verification Checklist

- [ ] JWT template created with name `supabase`
- [ ] Template uses default HS256 algorithm  
- [ ] Auth context sets up Supabase session
- [ ] API routes use Clerk auth verification
- [ ] RLS policies cast `auth.uid()::TEXT`
- [ ] Profile updates work and persist
- [ ] Public profiles display correctly

## 🎯 Success Indicators

### Working Correctly
- ✅ Profile changes save successfully
- ✅ Changes persist after page refresh
- ✅ No RLS policy violation errors
- ✅ Public profiles load correctly
- ✅ API endpoints respond properly

### Still Having Issues
- ❌ Profile saves fail with auth errors
- ❌ Changes don't persist after refresh
- ❌ RLS violation errors in logs
- ❌ JWT token generation fails
- ❌ Supabase queries return empty results

## 🚀 Next Steps

After successful JWT setup:
1. **Test profile management** - Upload pictures, edit names
2. **Verify public profiles** - Check public profile sharing
3. **Monitor performance** - Watch for auth-related slowdowns
4. **Plan enhancements** - Consider additional JWT claims for features

---

## 🎉 Success!

With JWT templates properly configured, your Clerk + Supabase integration is production-ready! Users can manage profiles seamlessly with proper security and data persistence. 🔐✨ 