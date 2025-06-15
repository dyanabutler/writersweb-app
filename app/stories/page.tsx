"use client"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase/client"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export default function StoriesPage() {
  const [stories, setStories] = useState<{ id: string; title: string }[]>([])
  const [newTitle, setNewTitle] = useState("")
  const router = useRouter()

  useEffect(() => {
    supabase.from("stories")
      .select("id,title")
      .order("created_at", { ascending: false })
      .then(({ data }) => setStories(data || []))
  }, [])

  const createStory = async () => {
    if (!newTitle.trim()) return
    const { data, error } = await supabase
      .from("stories")
      .insert({ title: newTitle })
      .select("id")
      .single()
    if (!error && data) router.push(`/stories/${data.id}`)
  }

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold">Your Stories</h1>

      <div className="flex gap-2">
        <Input value={newTitle} onChange={e => setNewTitle(e.target.value)} placeholder="New story title" />
        <Button onClick={createStory}>Create</Button>
      </div>

      <ul className="pt-4 space-y-2">
        {stories.map(s => (
          <li key={s.id}>
            <Button variant="link" onClick={() => router.push(`/stories/${s.id}`)}>
              {s.title}
            </Button>
          </li>
        ))}
      </ul>
    </div>
  )
} 