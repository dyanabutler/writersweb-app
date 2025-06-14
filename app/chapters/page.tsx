import { ChapterList } from "@/components/chapter/chapter-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function ChaptersPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Chapters</h1>
        <Link href="/chapters/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Chapter
          </Button>
        </Link>
      </div>

      <ChapterList />
    </div>
  )
}
