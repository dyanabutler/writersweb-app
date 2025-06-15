import { CharacterList } from "@/components/character/character-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function CharactersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Characters</h1>
        <Link href="/characters/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Character
          </Button>
        </Link>
      </div>

      <CharacterList />
    </div>
  )
}
