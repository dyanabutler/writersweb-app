import { clerkClient } from "@clerk/nextjs/server"

export type SubscriptionTier = "free" | "pro"
export type SubscriptionStatus = "active" | "cancelled" | "past_due"

export interface UserMetadata {
  subscription: SubscriptionTier
  subscriptionStatus: SubscriptionStatus
  subscriptionTier: SubscriptionTier
}

/**
 * Update a user's subscription metadata
 */
export async function updateUserMetadata(
  userId: string, 
  metadata: Partial<UserMetadata>
): Promise<void> {
  const client = await clerkClient()
  
  await client.users.updateUserMetadata(userId, {
    publicMetadata: {
      subscription: metadata.subscription || "free",
      subscriptionStatus: metadata.subscriptionStatus || "active",
      subscriptionTier: metadata.subscriptionTier || metadata.subscription || "free"
    }
  })
}

/**
 * Get a user's subscription metadata
 */
export async function getUserMetadata(userId: string): Promise<UserMetadata | null> {
  try {
    const client = await clerkClient()
    const user = await client.users.getUser(userId)
    
    const metadata = user.publicMetadata as any
    
    if (!metadata?.subscription) {
      return null
    }
    
    return {
      subscription: metadata.subscription,
      subscriptionStatus: metadata.subscriptionStatus || "active",
      subscriptionTier: metadata.subscriptionTier || metadata.subscription
    }
  } catch (error) {
    console.error("Error fetching user metadata:", error)
    return null
  }
}

/**
 * Upgrade user to pro
 */
export async function upgradeUserToPro(userId: string): Promise<void> {
  await updateUserMetadata(userId, {
    subscription: "pro",
    subscriptionStatus: "active",
    subscriptionTier: "pro"
  })
}

/**
 * Downgrade user to free
 */
export async function downgradeUserToFree(userId: string): Promise<void> {
  await updateUserMetadata(userId, {
    subscription: "free",
    subscriptionStatus: "active",
    subscriptionTier: "free"
  })
}

/**
 * Set user subscription status (for handling payment failures, etc.)
 */
export async function setSubscriptionStatus(
  userId: string, 
  status: SubscriptionStatus
): Promise<void> {
  const currentMetadata = await getUserMetadata(userId)
  
  await updateUserMetadata(userId, {
    ...currentMetadata,
    subscriptionStatus: status
  })
} 