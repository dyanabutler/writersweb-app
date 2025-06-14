# Production Implementation Guide

This document outlines how to implement real authentication and payment functionality for the Story Management System when moving from v0 to production.

## Overview

The current implementation uses mock authentication and payment systems. This guide covers implementing:

1. **Real Authentication** using Clerk
2. **Payment Processing** using Stripe
3. **Database Setup** for user and subscription management
4. **Security Best Practices**
5. **Environment Configuration**

## 1. Authentication Implementation with Clerk

### Why Clerk?

Clerk is a managed authentication service that handles ALL the complexity:
- Drop-in React components (like Stripe Elements)
- User management dashboard (like Stripe Dashboard) 
- Webhooks for user events (like Stripe webhooks)
- Social logins, magic links, 2FA - all built-in
- Zero maintenance required

### Install Clerk

\`\`\`bash
npm install @clerk/nextjs
\`\`\`

### Setup Clerk

#### Environment Variables
\`\`\`env
# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
CLERK_WEBHOOK_SECRET=whsec_...
NEXT_PUBLIC_CLERK_SIGN_IN_URL=/sign-in
NEXT_PUBLIC_CLERK_SIGN_UP_URL=/sign-up
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL=/
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL=/
\`\`\`

#### Wrap Your App

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
            <div className="flex h-full bg-background">
              <Sidebar />
              <div className="flex-1 flex flex-col overflow-hidden">
                <Header />
                <main className="flex-1 overflow-auto p-6">{children}</main>
              </div>
            </div>
          </DesignSystemProvider>
        </body>
      </html>
    </ClerkProvider>
  )
}
\`\`\`

#### Create Auth Pages

\`\`\`typescript
// app/sign-in/[[...sign-in]]/page.tsx
import { SignIn } from '@clerk/nextjs'

export default function Page() {
  return <SignIn />
}

// app/sign-up/[[...sign-up]]/page.tsx
import { SignUp } from '@clerk/nextjs'

export default function Page() {
  return <SignUp />
}
\`\`\`

#### Update Header Component

\`\`\`typescript
// components/layout/header.tsx
import { SignedIn, SignedOut, UserButton, SignInButton } from '@clerk/nextjs'
import { SyncStatus } from '@/components/sync/sync-status'

export function Header() {
  const { tokens } = useDesignSystem()

  return (
    <header
      className="shadow-sm border-b border-gray-200 px-6 py-4"
      style={{ backgroundColor: tokens.colors.background.secondary }}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-4">
          <div className="relative">
            <Search className="w-5 h-5 absolute left-3 top-1/2 transform -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search chapters, characters..."
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>
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

#### Protect Routes with Middleware

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

#### Update Sync Status Component

\`\`\`typescript
// components/sync/sync-status.tsx
import { useUser } from '@clerk/nextjs'

export function SyncStatus() {
  const { user } = useUser()
  const subscription = user?.publicMetadata?.subscription as string || 'free'
  
  if (subscription === 'pro') {
    return <ProSyncStatus />
  }
  
  return <FreeSyncStatus />
}
\`\`\`

## 2. Database Schema (Simplified with Clerk)

Since Clerk handles user management, your database schema is much simpler:

### Prisma Schema

\`\`\`prisma
// prisma/schema.prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql" // or "mysql", "sqlite"
  url      = env("DATABASE_URL")
}

model Subscription {
  id                   String   @id @default(cuid())
  clerkUserId          String   @unique
  stripeCustomerId     String   @unique
  stripeSubscriptionId String?  @unique
  plan                 String   @default("free") // "free" | "pro"
  status               String   @default("active") // "active" | "canceled" | "past_due"
  currentPeriodEnd     DateTime?
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Story {
  id          String @id @default(cuid())
  title       String
  description String?
  clerkUserId String // Reference to Clerk user ID
  
  chapters    Chapter[]
  characters  Character[]
  locations   Location[]
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
}

model Chapter {
  id            String @id @default(cuid())
  slug          String
  title         String
  content       String? @db.Text
  chapterNumber Int
  status        String @default("draft")
  wordCount     Int @default(0)
  pov           String?
  location      String?
  timeline      String?
  summary       String? @db.Text
  
  clerkUserId String // Reference to Clerk user ID
  storyId     String
  story       Story @relation(fields: [storyId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@unique([clerkUserId, slug])
}

model Character {
  id              String   @id @default(cuid())
  slug            String
  name            String
  role            String
  age             Int?
  status          String   @default("alive")
  location        String?
  affiliations    String[] @default([])
  relationships   String[] @default([])
  firstAppearance String?
  description     String?  @db.Text
  backstory       String?  @db.Text
  images          String[] @default([])
  
  clerkUserId String // Reference to Clerk user ID
  storyId     String
  story       Story @relation(fields: [storyId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@unique([clerkUserId, slug])
}

model Location {
  id                   String   @id @default(cuid())
  slug                 String
  name                 String
  type                 String   @default("other")
  description          String   @db.Text
  significance         String   @db.Text
  images               String[] @default([])
  connectedChapters    String[] @default([])
  connectedCharacters  String[] @default([])
  parentLocation       String?
  climate              String?
  population           String?
  
  clerkUserId String // Reference to Clerk user ID
  storyId     String
  story       Story @relation(fields: [storyId], references: [id], onDelete: Cascade)
  
  createdAt DateTime @default(now())
  updatedAt DateTime @updatedAt
  
  @@unique([clerkUserId, slug])
}
\`\`\`

## 3. Stripe Integration

### Install Stripe

\`\`\`bash
npm install stripe @stripe/stripe-js
\`\`\`

### Setup Stripe

\`\`\`typescript
// lib/stripe.ts
import Stripe from 'stripe'

export const stripe = new Stripe(process.env.STRIPE_SECRET_KEY!, {
  apiVersion: '2023-10-16',
})

// lib/stripe-client.ts
import { loadStripe } from '@stripe/stripe-js'

export const stripePromise = loadStripe(process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY!)
\`\`\`

### Create Stripe Products and Prices

\`\`\`bash
# Create products in Stripe Dashboard or via API
# Pro Plan: $8/month
\`\`\`

### Updated Stripe Integration

\`\`\`typescript
// app/api/create-checkout-session/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { auth, clerkClient } from '@clerk/nextjs/server'
import { stripe } from '@/lib/stripe'

export async function POST(req: NextRequest) {
  try {
    const { userId } = auth()
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    const user = await clerkClient.users.getUser(userId)
    const { priceId } = await req.json()

    // Get or create Stripe customer
    let customer = await stripe.customers.list({
      email: user.emailAddresses[0].emailAddress,
      limit: 1,
    })

    let customerId: string
    if (customer.data.length === 0) {
      const newCustomer = await stripe.customers.create({
        email: user.emailAddresses[0].emailAddress,
        name: `${user.firstName} ${user.lastName}`,
        metadata: {
          clerkUserId: userId,
        },
      })
      customerId = newCustomer.id
    } else {
      customerId = customer.data[0].id
    }

    // Create checkout session
    const checkoutSession = await stripe.checkout.sessions.create({
      customer: customerId,
      payment_method_types: ['card'],
      line_items: [
        {
          price: priceId,
          quantity: 1,
        },
      ],
      mode: 'subscription',
      success_url: `${req.headers.get('origin')}/billing?success=true`,
      cancel_url: `${req.headers.get('origin')}/pricing`,
      metadata: {
        clerkUserId: userId,
      },
    })

    return NextResponse.json({ sessionId: checkoutSession.id })
  } catch (error) {
    console.error('Error creating checkout session:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}
\`\`\`

### Stripe Webhooks

\`\`\`typescript
// app/api/webhooks/stripe/route.ts
import { NextRequest, NextResponse } from 'next/server'
import { headers } from 'next/headers'
import Stripe from 'stripe'
import { stripe } from '@/lib/stripe'
import { prisma } from '@/lib/prisma'

export async function POST(req: NextRequest) {
  const body = await req.text()
  const signature = headers().get('stripe-signature')!

  let event: Stripe.Event

  try {
    event = stripe.webhooks.constructEvent(
      body,
      signature,
      process.env.STRIPE_WEBHOOK_SECRET!
    )
  } catch (err) {
    console.error('Webhook signature verification failed:', err)
    return NextResponse.json({ error: 'Invalid signature' }, { status: 400 })
  }

  try {
    switch (event.type) {
      case 'customer.subscription.created':
      case 'customer.subscription.updated':
        const subscription = event.data.object as Stripe.Subscription
        await handleSubscriptionChange(subscription)
        break

      case 'customer.subscription.deleted':
        const deletedSubscription = event.data.object as Stripe.Subscription
        await handleSubscriptionCancellation(deletedSubscription)
        break

      case 'invoice.payment_succeeded':
        const invoice = event.data.object as Stripe.Invoice
        await handleSuccessfulPayment(invoice)
        break

      case 'invoice.payment_failed':
        const failedInvoice = event.data.object as Stripe.Invoice
        await handleFailedPayment(failedInvoice)
        break

      default:
        console.log(`Unhandled event type: ${event.type}`)
    }

    return NextResponse.json({ received: true })
  } catch (error) {
    console.error('Webhook handler error:', error)
    return NextResponse.json(
      { error: 'Webhook handler failed' },
      { status: 500 }
    )
  }
}

// Update the handleSubscriptionChange function in app/api/webhooks/stripe/route.ts
async function handleSubscriptionChange(subscription: Stripe.Subscription) {
  const customer = await stripe.customers.retrieve(subscription.customer as string)
  
  if ('metadata' in customer && customer.metadata.clerkUserId) {
    const clerkUserId = customer.metadata.clerkUserId

    // Update subscription in database
    await prisma.subscription.upsert({
      where: { clerkUserId },
      update: {
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        plan: subscription.status === 'active' ? 'pro' : 'free',
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
      create: {
        clerkUserId,
        stripeSubscriptionId: subscription.id,
        stripeCustomerId: subscription.customer as string,
        plan: subscription.status === 'active' ? 'pro' : 'free',
        status: subscription.status,
        currentPeriodEnd: new Date(subscription.current_period_end * 1000),
      },
    })

    // Update user metadata in Clerk
    await clerkClient.users.updateUserMetadata(clerkUserId, {
      publicMetadata: {
        subscription: subscription.status === 'active' ? 'pro' : 'free',
        stripeCustomerId: subscription.customer as string,
        subscriptionId: subscription.id,
      }
    })
  }
}

async function handleSubscriptionCancellation(subscription: Stripe.Subscription) {
  await prisma.subscription.updateMany({
    where: { stripeSubscriptionId: subscription.id },
    data: {
      plan: 'free',
      status: 'canceled',
    },
  })
}

async function handleSuccessfulPayment(invoice: Stripe.Invoice) {
  // Handle successful payment (send confirmation email, etc.)
  console.log('Payment succeeded for invoice:', invoice.id)
}

async function handleFailedPayment(invoice: Stripe.Invoice) {
  // Handle failed payment (send notification, etc.)
  console.log('Payment failed for invoice:', invoice.id)
}
\`\`\`

### Clerk Webhooks (for User Management)

\`\`\`typescript
// app/api/webhooks/clerk/route.ts
import { Webhook } from 'svix'
import { headers } from 'next/headers'
import { WebhookEvent } from '@clerk/nextjs/server'
import { prisma } from '@/lib/prisma'

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
      // User signed up - create default story
      await handleUserCreated(evt.data)
      break
    
    case 'user.updated':
      // User updated profile
      await handleUserUpdated(evt.data)
      break
      
    case 'user.deleted':
      // User deleted account - cleanup data
      await handleUserDeleted(evt.data)
      break
  }

  return new Response('', { status: 200 })
}

async function handleUserCreated(userData: any) {
  // Create a default story for new users
  await prisma.story.create({
    data: {
      title: "My First Story",
      description: "Start writing your story here!",
      clerkUserId: userData.id,
    }
  })
}

async function handleUserUpdated(userData: any) {
  // Handle user profile updates if needed
  console.log('User updated:', userData.id)
}

async function handleUserDeleted(userData: any) {
  // Clean up user data when account is deleted
  await prisma.story.deleteMany({
    where: { clerkUserId: userData.id }
  })
  
  await prisma.subscription.deleteMany({
    where: { clerkUserId: userData.id }
  })
}
\`\`\`

## 4. Environment Variables

\`\`\`env
# Database
DATABASE_URL="postgresql://username:password@localhost:5432/storymanager"

# Clerk Authentication
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY="pk_test_..."
CLERK_SECRET_KEY="sk_test_..."
CLERK_WEBHOOK_SECRET="whsec_..."
NEXT_PUBLIC_CLERK_SIGN_IN_URL="/sign-in"
NEXT_PUBLIC_CLERK_SIGN_UP_URL="/sign-up"
NEXT_PUBLIC_CLERK_AFTER_SIGN_IN_URL="/"
NEXT_PUBLIC_CLERK_AFTER_SIGN_UP_URL="/"

# Stripe
STRIPE_SECRET_KEY="sk_test_..."
NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY="pk_test_..."
STRIPE_WEBHOOK_SECRET="whsec_..."

# Email (optional - Clerk handles email)
EMAIL_SERVER_HOST="smtp.gmail.com"
EMAIL_SERVER_PORT=587
EMAIL_SERVER_USER="your-email@gmail.com"
EMAIL_SERVER_PASSWORD="your-app-password"
EMAIL_FROM="noreply@yourdomain.com"
\`\`\`

## 5. Security Considerations

### API Route Protection

\`\`\`typescript
// lib/auth-guard.ts
import { auth } from '@clerk/nextjs/server'
import { NextRequest, NextResponse } from 'next/server'

export async function withAuth(
  handler: (req: NextRequest, userId: string) => Promise<NextResponse>
) {
  return async (req: NextRequest) => {
    const { userId } = auth()
    
    if (!userId) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
    }

    return handler(req, userId)
  }
}

// Usage in API routes
export const POST = withAuth(async (req, userId) => {
  // Your protected API logic here
  const data = await req.json()
  
  const chapter = await prisma.chapter.create({
    data: {
      ...data,
      clerkUserId: userId,
    }
  })
  
  return NextResponse.json(chapter)
})
\`\`\`

### Data Validation

\`\`\`typescript
// lib/validation.ts
import { z } from 'zod'

export const chapterSchema = z.object({
  title: z.string().min(1).max(200),
  content: z.string().optional(),
  chapterNumber: z.number().int().positive(),
  status: z.enum(['draft', 'review', 'complete', 'published']),
  pov: z.string().optional(),
  location: z.string().optional(),
  timeline: z.string().optional(),
  summary: z.string().optional(),
})

export const characterSchema = z.object({
  name: z.string().min(1).max(100),
  role: z.string().min(1).max(100),
  age: z.number().int().positive().optional(),
  status: z.enum(['alive', 'deceased', 'missing', 'unknown']),
  location: z.string().optional(),
  affiliations: z.array(z.string()).optional(),
  relationships: z.array(z.string()).optional(),
  firstAppearance: z.string().optional(),
  description: z.string().optional(),
  backstory: z.string().optional(),
})
\`\`\`

### Rate Limiting

\`\`\`typescript
// lib/rate-limit.ts
import { NextRequest } from 'next/server'

const rateLimitMap = new Map()

export function rateLimit(identifier: string, limit: number = 10, window: number = 60000) {
  const now = Date.now()
  const windowStart = now - window

  if (!rateLimitMap.has(identifier)) {
    rateLimitMap.set(identifier, [])
  }

  const requests = rateLimitMap.get(identifier)
  const requestsInWindow = requests.filter((time: number) => time > windowStart)

  if (requestsInWindow.length >= limit) {
    return false
  }

  requestsInWindow.push(now)
  rateLimitMap.set(identifier, requestsInWindow)
  return true
}
\`\`\`

## 6. Cloud Sync Implementation

### Real-time Sync with Supabase

\`\`\`typescript
// lib/sync.ts
import { createClient } from '@/lib/supabase'

export class SyncManager {
  private supabase = createClient()

  async syncChapter(chapter: Chapter) {
    const { data, error } = await this.supabase
      .from('chapters')
      .upsert(chapter)
      .select()

    if (error) throw error
    return data[0]
  }

  subscribeToChanges(userId: string, onUpdate: (payload: any) => void) {
    return this.supabase
      .channel('story-changes')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'chapters',
          filter: `user_id=eq.${userId}`,
        },
        onUpdate
      )
      .subscribe()
  }
}
\`\`\`

### Offline Support

\`\`\`typescript
// lib/offline-sync.ts
export class OfflineSync {
  private db: IDBDatabase | null = null

  async init() {
    return new Promise<void>((resolve, reject) => {
      const request = indexedDB.open('StoryManagerDB', 1)
      
      request.onerror = () => reject(request.error)
      request.onsuccess = () => {
        this.db = request.result
        resolve()
      }
      
      request.onupgradeneeded = (event) => {
        const db = (event.target as IDBOpenDBRequest).result
        
        // Create object stores for offline data
        if (!db.objectStoreNames.contains('chapters')) {
          const chapterStore = db.createObjectStore('chapters', { keyPath: 'id' })
          chapterStore.createIndex('userId', 'userId', { unique: false })
        }
        
        if (!db.objectStoreNames.contains('pendingSync')) {
          db.createObjectStore('pendingSync', { keyPath: 'id', autoIncrement: true })
        }
      }
    })
  }

  async saveOffline(storeName: string, data: any) {
    if (!this.db) await this.init()
    
    const transaction = this.db!.transaction([storeName], 'readwrite')
    const store = transaction.objectStore(storeName)
    return store.put(data)
  }

  async syncPendingChanges() {
    // Sync offline changes when back online
    if (!navigator.onLine) return

    const pendingChanges = await this.getPendingChanges()
    for (const change of pendingChanges) {
      try {
        await this.syncToServer(change)
        await this.removePendingChange(change.id)
      } catch (error) {
        console.error('Sync failed for change:', change, error)
      }
    }
  }
}
\`\`\`

## 7. Deployment Checklist

### Environment Setup
- [ ] Set up production database (PostgreSQL recommended)
- [ ] Configure Stripe webhook endpoints
- [ ] Set up email service (SendGrid, Resend, etc.)
- [ ] Configure OAuth providers
- [ ] Set up monitoring (Sentry, LogRocket, etc.)

### Security
- [ ] Enable HTTPS
- [ ] Set up CORS properly
- [ ] Implement rate limiting
- [ ] Add input validation
- [ ] Set up CSP headers
- [ ] Enable database row-level security

### Performance
- [ ] Set up CDN for static assets
- [ ] Implement database indexing
- [ ] Add caching layer (Redis)
- [ ] Optimize images
- [ ] Set up monitoring and alerts

### Testing
- [ ] Write unit tests for payment flows
- [ ] Test webhook handling
- [ ] Test subscription lifecycle
- [ ] Test offline sync
- [ ] Load testing

## 8. Monitoring and Analytics

### Key Metrics to Track
- User registration/activation rates
- Free to paid conversion rates
- Churn rates
- Feature usage
- Sync performance
- Payment success rates

### Recommended Tools
- **Analytics**: PostHog, Mixpanel
- **Error Tracking**: Sentry
- **Performance**: Vercel Analytics
- **User Feedback**: Hotjar, FullStory

## 9. Legal Considerations

### Required Pages
- Privacy Policy
- Terms of Service
- Cookie Policy
- GDPR compliance (if serving EU users)
- Data deletion procedures

### Stripe Requirements
- Clear pricing display
- Cancellation policy
- Refund policy
- Contact information

This implementation provides a robust, secure, and scalable foundation for your Story Management SaaS platform. The architecture follows industry best practices and can handle growth from MVP to enterprise scale.
