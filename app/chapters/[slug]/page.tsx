import { ChapterEditor } from "@/components/chapter/chapter-editor"
import { getChapterBySlug } from "@/lib/content/chapters"
import { notFound } from "next/navigation"

interface ChapterPageProps {
  params: Promise<{ slug: string }>
}

export default async function ChapterPage({ params }: ChapterPageProps) {
  const { slug } = await params
  const chapter = await getChapterBySlug(slug)

  if (!chapter) {
    notFound()
  }

  return <ChapterEditor chapter={chapter} />
}
