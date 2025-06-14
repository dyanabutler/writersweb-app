import { NextResponse } from "next/server"
import { clerkClient } from "@clerk/nextjs/server"
import { auth } from "@clerk/nextjs/server"

export async function POST(req: Request) {
  try {
    // Check if user is authenticated (you might want to add admin role check)
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const { targetUserId, subscription, subscriptionStatus, subscriptionTier } = await req.json()

    if (!targetUserId) {
      return NextResponse.json({ error: "Missing targetUserId" }, { status: 400 })
    }

    const client = await clerkClient()
    
    // Update user metadata
    await client.users.updateUserMetadata(targetUserId, {
      publicMetadata: {
        subscription: subscription || "free",
        subscriptionStatus: subscriptionStatus || "active", 
        subscriptionTier: subscriptionTier || "free"
      }
    })

    return NextResponse.json({ 
      message: "User metadata updated successfully",
      userId: targetUserId,
      metadata: {
        subscription: subscription || "free",
        subscriptionStatus: subscriptionStatus || "active",
        subscriptionTier: subscriptionTier || "free"
      }
    })

  } catch (error) {
    console.error("Error updating user metadata:", error)
    return NextResponse.json(
      { error: "Failed to update user metadata" },
      { status: 500 }
    )
  }
}

// GET endpoint to retrieve user metadata
export async function GET(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const url = new URL(req.url)
    const targetUserId = url.searchParams.get("userId")

    if (!targetUserId) {
      return NextResponse.json({ error: "Missing userId parameter" }, { status: 400 })
    }

    const client = await clerkClient()
    const user = await client.users.getUser(targetUserId)

    return NextResponse.json({
      userId: targetUserId,
      metadata: user.publicMetadata
    })

  } catch (error) {
    console.error("Error fetching user metadata:", error)
    return NextResponse.json(
      { error: "Failed to fetch user metadata" },
      { status: 500 }
    )
  }
} 