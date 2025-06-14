import { NextResponse } from "next/server"
import { clerkClient } from "@clerk/nextjs/server"
import { auth } from "@clerk/nextjs/server"

export async function POST(req: Request) {
  try {
    const { userId } = await auth()
    if (!userId) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    // Optional: Add admin check here
    // const user = await client.users.getUser(userId)
    // if (!user.publicMetadata?.role === 'admin') {
    //   return NextResponse.json({ error: "Admin access required" }, { status: 403 })
    // }

    const { defaultSubscription = "free", defaultStatus = "active" } = await req.json()

    const client = await clerkClient()
    
    // Get all users (paginated)
    let allUsers: any[] = []
    let hasNextPage = true
    let offset = 0
    const limit = 100

    while (hasNextPage) {
      const response = await client.users.getUserList({
        limit,
        offset
      })
      
      allUsers = [...allUsers, ...response.data]
      
      hasNextPage = response.data.length === limit
      offset += limit
    }

    console.log(`Found ${allUsers.length} users to update`)

    // Update metadata for users who don't have it set
    const updatePromises = allUsers.map(async (user) => {
      if (!user.publicMetadata?.subscription) {
        try {
          await client.users.updateUserMetadata(user.id, {
            publicMetadata: {
              ...user.publicMetadata,
              subscription: defaultSubscription,
              subscriptionStatus: defaultStatus,
              subscriptionTier: defaultSubscription
            }
          })
          return { userId: user.id, success: true }
        } catch (error) {
          console.error(`Failed to update user ${user.id}:`, error)
          return { userId: user.id, success: false, error: String(error) }
        }
      }
      return { userId: user.id, success: true, skipped: true }
    })

    const results = await Promise.all(updatePromises)
    
    const updated = results.filter(r => r.success && !r.skipped).length
    const skipped = results.filter(r => r.skipped).length
    const failed = results.filter(r => !r.success).length

    return NextResponse.json({
      message: "Bulk metadata update completed",
      stats: {
        total: allUsers.length,
        updated,
        skipped,
        failed
      },
      results
    })

  } catch (error) {
    console.error("Error in bulk metadata update:", error)
    return NextResponse.json(
      { error: "Failed to bulk update metadata" },
      { status: 500 }
    )
  }
} 