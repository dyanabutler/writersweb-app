# Clerk Metadata Management

This guide covers how to programmatically manage user subscription metadata in Clerk for the freemium model.

## Overview

The system automatically sets subscription metadata for new users and provides admin endpoints to manage existing users. The metadata structure supports the freemium model by distinguishing between free and pro users.

## Metadata Structure

```typescript
interface UserMetadata {
  subscription: "free" | "pro"
  subscriptionStatus: "active" | "cancelled" | "past_due"
  subscriptionTier: "free" | "pro"
}
```

## 🔄 Automatic Setup

### Webhook Integration

New users automatically receive metadata when they sign up through the Clerk webhook:

**File:** `app/api/webhooks/clerk/route.ts`

```typescript
// Set initial metadata in Clerk (free tier by default)
await client.users.updateUserMetadata(id, {
  publicMetadata: {
    subscription: "free",
    subscriptionStatus: "active",
    subscriptionTier: "free"
  }
})
```

**Default values for new users:**
- `subscription: "free"`
- `subscriptionStatus: "active"`
- `subscriptionTier: "free"`

## 🛠️ Admin API Endpoints

### 1. Update Individual User Metadata

**Endpoint:** `POST /api/admin/update-user-metadata`

**Usage:**
```bash
curl -X POST "https://writersweb.art/api/admin/update-user-metadata" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  -d '{
    "targetUserId": "user_2abc123def",
    "subscription": "pro",
    "subscriptionStatus": "active",
    "subscriptionTier": "pro"
  }'
```

**Response:**
```json
{
  "message": "User metadata updated successfully",
  "userId": "user_2abc123def",
  "metadata": {
    "subscription": "pro",
    "subscriptionStatus": "active",
    "subscriptionTier": "pro"
  }
}
```

### 2. Get User Metadata

**Endpoint:** `GET /api/admin/update-user-metadata?userId={userId}`

**Usage:**
```bash
curl -X GET "https://writersweb.art/api/admin/update-user-metadata?userId=user_2abc123def" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN"
```

**Response:**
```json
{
  "userId": "user_2abc123def",
  "metadata": {
    "subscription": "pro",
    "subscriptionStatus": "active",
    "subscriptionTier": "pro"
  }
}
```

### 3. Bulk Update All Users

**Endpoint:** `POST /api/admin/bulk-update-metadata`

**Usage:**
```bash
curl -X POST "https://writersweb.art/api/admin/bulk-update-metadata" \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_CLERK_TOKEN" \
  -d '{
    "defaultSubscription": "free",
    "defaultStatus": "active"
  }'
```

**Response:**
```json
{
  "message": "Bulk metadata update completed",
  "stats": {
    "total": 150,
    "updated": 25,
    "skipped": 120,
    "failed": 5
  },
  "results": [...]
}
```

## 📚 Helper Functions

**File:** `lib/utils/metadata-helpers.ts`

### Available Functions

```typescript
// Upgrade user to pro
await upgradeUserToPro("user_2abc123def")

// Downgrade user to free
await downgradeUserToFree("user_2abc123def")

// Set subscription status
await setSubscriptionStatus("user_2abc123def", "past_due")

// Get user metadata
const metadata = await getUserMetadata("user_2abc123def")

// Custom metadata update
await updateUserMetadata("user_2abc123def", {
  subscription: "pro",
  subscriptionStatus: "active"
})
```

### Usage Examples

```typescript
import { upgradeUserToPro, downgradeUserToFree } from '@/lib/utils/metadata-helpers'

// In a Stripe webhook after successful payment
await upgradeUserToPro(stripeCustomer.metadata.clerkUserId)

// In a subscription cancellation handler
await downgradeUserToFree(userId)
```

## 🚀 Quick Start Commands

### Initialize Existing Users

Set all existing users to free tier (safe for existing deployments):

```bash
curl -X POST "https://writersweb.art/api/admin/bulk-update-metadata" \
  -H "Content-Type: application/json" \
  -d '{"defaultSubscription": "free", "defaultStatus": "active"}'
```

### Test Your Setup

1. **Check your own user metadata:**
```bash
curl -X GET "https://writersweb.art/api/admin/update-user-metadata?userId=YOUR_USER_ID"
```

2. **Upgrade yourself to pro for testing:**
```bash
curl -X POST "https://writersweb.art/api/admin/update-user-metadata" \
  -H "Content-Type: application/json" \
  -d '{
    "targetUserId": "YOUR_USER_ID",
    "subscription": "pro",
    "subscriptionStatus": "active"
  }'
```

3. **Verify the change:**
```bash
curl -X GET "https://writersweb.art/api/admin/update-user-metadata?userId=YOUR_USER_ID"
```

## 🔐 Security Notes

- All admin endpoints require authentication
- Consider adding admin role checks for production use
- The bulk update endpoint processes all users - use carefully
- Webhook endpoint includes error handling to continue profile creation even if metadata fails

## 🔗 Integration with Data Layer

The metadata automatically integrates with your existing freemium system:

```typescript
// In useDataLayer hook
const { user } = useUser()
const isProUser = user?.publicMetadata?.subscription === 'pro'

// Returns CloudDataLayer for pro users, LocalDataLayer for free users
return isProUser ? cloudDataLayer : localDataLayer
```

## Environment Variables Required

Ensure these are set in your environment:

```bash
CLERK_SECRET_KEY=your_clerk_secret_key
CLERK_WEBHOOK_SECRET=your_webhook_secret
```

## Next Steps

1. **Test the webhook:** Sign up a new user and verify metadata is set
2. **Run bulk update:** Initialize metadata for existing users
3. **Test freemium switching:** Verify your app correctly switches between local/cloud data
4. **Integration with Stripe:** Use helper functions in payment webhooks

## Troubleshooting

**Q: Users still showing as free after upgrade**
- Check metadata was actually set: `GET /api/admin/update-user-metadata?userId=...`
- Verify frontend is reading `user.publicMetadata.subscription`
- Ensure user refresh or re-authentication after metadata update

**Q: Bulk update failing**
- Check Clerk API rate limits
- Verify authentication in request
- Check server logs for specific user update errors

**Q: Webhook not setting metadata for new users**
- Verify webhook is configured in Clerk dashboard
- Check webhook secret in environment variables
- Review server logs for webhook processing errors 