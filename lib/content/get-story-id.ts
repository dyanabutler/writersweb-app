import { supabase } from "@/lib/supabase/client"

export async function getOrCreateStoryId(userId: string) {
  // 1) existing latest story
  const { data, error } = await supabase
    .from("stories")
    .select("id")
    .eq("user_id", userId)
    .order("created_at", { ascending: false })
    .limit(1)
    .single()

  if (data) return data.id

  // 2) none → create default
  const { data: newStory, error: insertErr } = await supabase
    .from("stories")
    .insert({
      user_id: userId,
      title: "My First Story",
      status: "planning",
    })
    .select()
    .single()

  if (insertErr) throw insertErr
  return newStory.id
} 