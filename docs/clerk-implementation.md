# Clerk Authentication Implementation

## Why Clerk is Perfect for This Project

Clerk is a managed authentication service that handles ALL the complexity for you:

- ✅ **Drop-in React components** (just like Stripe Elements)
- ✅ **User management dashboard** (like Stripe Dashboard)
- ✅ **Webhooks for user events** (just like Stripe webhooks)
- ✅ **Social logins** (Google, GitHub, etc.) with zero config
- ✅ **Magic links, passwords, 2FA** - all built-in
- ✅ **User profiles and metadata** - perfect for subscription info
- ✅ **Organizations/teams** - ready for future collaboration features

## Implementation Guide

### 1. Install Clerk

\`\`\`bash
npm install @clerk/nextjs
\`\`\`

### 2. Environment Variables

\`\`\`env
# .env.local
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
\`\`\`

### 3. Wrap Your App

\`\`\`typescript
// app/layout.tsx
import { ClerkProvider } from '@clerk/nextjs'

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <ClerkProvider>
      <html lang="en">
        <body>
          <DesignSystemProvider>
            {children}
          </DesignSystemProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
\`\`\`

### 4. Replace Auth Components

\`\`\`typescript
// components/layout/header.tsx
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs'
import { SyncStatus } from '@/components/sync/sync-status'

export function Header() {
  const { tokens } = useDesignSystem()

  return (
    <header style={{ backgroundColor: tokens.colors.background.secondary }}>
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          {/* Search bar */}
        </div>

        <div className="flex items-center space-x-4">
          <SignedIn>
            <SyncStatus />
            <UserButton 
              appearance={{
                elements: {
                  avatarBox: "w-10 h-10"
                }
              }}
            />
          </SignedIn>
          
          <SignedOut>
            <SignInButton mode="modal">
              <Button>Sign In</Button>
            </SignInButton>
          </SignedOut>
        </div>
      </div>
    </header>
  )
}
\`\`\`

### 5. Protect Routes

\`\`\`typescript
// middleware.ts
import { authMiddleware } from "@clerk/nextjs"

export default authMiddleware({
  // Routes that don't require authentication
  publicRoutes: ["/", "/pricing", "/about"],
  // Routes that require authentication
  ignoredRoutes: ["/api/webhooks/(.*)"]
})

export const config = {
  matcher: ["/((?!.+\\.[\\w]+$|_next).*)", "/", "/(api|trpc)(.*)"],
}
\`\`\`

### 6. Get User Data

\`\`\`typescript
// In any component
import { useUser } from '@clerk/nextjs'

export function MyComponent() {
  const { user, isLoaded } = useUser()
  
  if (!isLoaded) return <div>Loading...</div>
  
  return (
    <div>
      <h1>Welcome {user?.firstName}!</h1>
      <p>Subscription: {user?.publicMetadata?.subscription || 'free'}</p>
    </div>
  )
}

// In API routes
import { auth } from '@clerk/nextjs/server'

export async function GET() {
  const { userId } = auth()
  
  if (!userId) {
    return new Response('Unauthorized', { status: 401 })
  }
  
  // Your API logic here
}
\`\`\`

### 7. Clerk Webhooks (for Stripe Integration)

\`\`\`typescript
// app/api/webhooks/clerk/route.ts
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'

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
    return new Response('Error occured', { status: 400 })
  }

  switch (evt.type) {
    case 'user.created':
      // Create user in your database
      await createUserInDatabase(evt.data)
      break
    
    case 'user.updated':
      // Update user subscription info
      await updateUserSubscription(evt.data)
      break
  }

  return new Response('', { status: 200 })
}
\`\`\`

### 8. Store Subscription Data in Clerk

\`\`\`typescript
// When user subscribes (in your Stripe webhook)
import { clerkClient } from '@clerk/nextjs'

async function handleStripeSubscription(subscription: Stripe.Subscription) {
  const customer = await stripe.customers.retrieve(subscription.customer)
  
  if ('email' in customer) {
    // Find user by email
    const users = await clerkClient.users.getUserList({
      emailAddress: [customer.email]
    })
    
    if (users.length > 0) {
      // Update user metadata
      await clerkClient.users.updateUserMetadata(users[0].id, {
        publicMetadata: {
          subscription: 'pro',
          stripeCustomerId: customer.id,
          subscriptionId: subscription.id
        }
      })
    }
  }
}
\`\`\`

## Why This is Better Than DIY Auth

### 🔒 **Security**
- Clerk handles password hashing, session management, CSRF protection
- SOC 2 Type II compliant
- Regular security audits
- Automatic security updates

### 🎨 **UI Components**
- Beautiful, customizable components
- Dark mode support
- Mobile responsive
- Matches your design system

### 🚀 **Features You Get for Free**
- Social logins (Google, GitHub, Discord, etc.)
- Magic links
- Phone number verification
- Two-factor authentication
- Password reset flows
- Email verification
- User profiles
- Organizations/teams

### 📊 **Admin Dashboard**
- User management
- Analytics
- Logs and debugging
- Webhook monitoring
- A/B testing

### 💰 **Pricing**
- **Free tier**: 10,000 monthly active users
- **Pro**: $25/month for 100,000 MAU
- Much cheaper than building/maintaining yourself

## Integration with Your Story Manager

### User Data Structure
\`\`\`typescript
// Clerk automatically provides:
interface ClerkUser {
  id: string
  firstName: string
  lastName: string
  emailAddresses: EmailAddress[]
  imageUrl: string
  publicMetadata: {
    subscription?: 'free' | 'pro'
    stripeCustomerId?: string
    subscriptionId?: string
    onboardingComplete?: boolean
  }
  privateMetadata: {
    // Sensitive data only your backend can access
  }
}
\`\`\`

### Sync Status Component
\`\`\`typescript
// components/sync/sync-status.tsx
import { useUser } from '@clerk/nextjs'

export function SyncStatus() {
  const { user } = useUser()
  const subscription = user?.publicMetadata?.subscription as string
  
  if (subscription === 'pro') {
    return <ProSyncStatus />
  }
  
  return <FreeSyncStatus />
}
\`\`\`

### Protected API Routes
\`\`\`typescript
// app/api/chapters/route.ts
import { auth } from '@clerk/nextjs/server'

export async function POST(req: Request) {
  const { userId } = auth()
  
  if (!userId) {
    return Response.json({ error: 'Unauthorized' }, { status: 401 })
  }
  
  // Your chapter creation logic
  const chapter = await createChapter({ ...data, userId })
  return Response.json(chapter)
}
\`\`\`

## Migration Strategy

1. **Install Clerk** alongside existing auth
2. **Add Clerk components** to new pages first
3. **Migrate user data** using Clerk's import API
4. **Update API routes** one by one
5. **Remove old auth code** once everything works

This approach lets you migrate gradually without breaking existing functionality.
