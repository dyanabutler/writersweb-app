import { headers } from "next/headers"
import { NextResponse } from "next/server"
import { Webhook } from "svix"
import { supabase } from "@/lib/supabase/server"

const webhookSecret = process.env.CLERK_WEBHOOK_SECRET

if (!webhookSecret) {
  throw new Error("Please add CLERK_WEBHOOK_SECRET to your environment variables")
}

export async function POST(req: Request) {
  // Get the headers
  const headerPayload = headers()
  const svix_id = headerPayload.get("svix-id")
  const svix_timestamp = headerPayload.get("svix-timestamp")
  const svix_signature = headerPayload.get("svix-signature")

  // If there are no headers, error out
  if (!svix_id || !svix_timestamp || !svix_signature) {
    return new Response("Error occured -- no svix headers", {
      status: 400,
    })
  }

  // Get the body
  const payload = await req.json()
  const body = JSON.stringify(payload)

  // Create a new Svix instance with your secret.
  const wh = new Webhook(webhookSecret)

  let evt: any

  // Verify the payload with the headers
  try {
    evt = wh.verify(body, {
      "svix-id": svix_id,
      "svix-timestamp": svix_timestamp,
      "svix-signature": svix_signature,
    })
  } catch (err) {
    console.error("Error verifying webhook:", err)
    return new Response("Error occured", {
      status: 400,
    })
  }

  // Handle the webhook
  const eventType = evt.type
  const { id, email_addresses, first_name, last_name, image_url, created_at, updated_at } = evt.data

  console.log(`Webhook received: ${eventType}`)

  try {
    switch (eventType) {
      case "user.created":
        await handleUserCreated({
          id,
          email: email_addresses[0]?.email_address,
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
          createdAt: created_at,
        })
        break

      case "user.updated":
        await handleUserUpdated({
          id,
          email: email_addresses[0]?.email_address,
          firstName: first_name,
          lastName: last_name,
          imageUrl: image_url,
          updatedAt: updated_at,
        })
        break

      case "user.deleted":
        await handleUserDeleted(id)
        break

      default:
        console.log(`Unhandled event type: ${eventType}`)
    }

    return NextResponse.json({ message: "Webhook processed successfully" })
  } catch (error) {
    console.error("Error processing webhook:", error)
    return new Response("Error processing webhook", { status: 500 })
  }
}

async function handleUserCreated({
  id,
  email,
  firstName,
  lastName,
  imageUrl,
  createdAt,
}: {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  imageUrl: string | null
  createdAt: number
}) {
  const fullName = [firstName, lastName].filter(Boolean).join(" ")

  const { error } = await supabase.from("profiles").insert({
    id,
    email,
    full_name: fullName || null,
    avatar_url: imageUrl,
    subscription_tier: "free",
    created_at: new Date(createdAt).toISOString(),
  })

  if (error) {
    console.error("Error creating profile:", error)
    throw error
  }

  console.log(`Profile created for user ${id}`)
}

async function handleUserUpdated({
  id,
  email,
  firstName,
  lastName,
  imageUrl,
  updatedAt,
}: {
  id: string
  email: string
  firstName: string | null
  lastName: string | null
  imageUrl: string | null
  updatedAt: number
}) {
  const fullName = [firstName, lastName].filter(Boolean).join(" ")

  const { error } = await supabase
    .from("profiles")
    .update({
      email,
      full_name: fullName || null,
      avatar_url: imageUrl,
      updated_at: new Date(updatedAt).toISOString(),
    })
    .eq("id", id)

  if (error) {
    console.error("Error updating profile:", error)
    throw error
  }

  console.log(`Profile updated for user ${id}`)
}

async function handleUserDeleted(id: string) {
  // First, delete all user's data (cascade should handle this, but let's be explicit)
  const { error: storiesError } = await supabase.from("stories").delete().eq("user_id", id)

  if (storiesError) {
    console.error("Error deleting user stories:", storiesError)
  }

  // Delete the profile
  const { error: profileError } = await supabase.from("profiles").delete().eq("id", id)

  if (profileError) {
    console.error("Error deleting profile:", profileError)
    throw profileError
  }

  console.log(`Profile and data deleted for user ${id}`)
}
