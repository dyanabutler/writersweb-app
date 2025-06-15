import Link from "next/link"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Chapter } from "@/lib/types"
import { Clock, MapPin, Eye, FileText } from "lucide-react"
import { useDesignSystem } from "@/components/design-system"
import { getStatusColor } from "@/components/design-system"

interface ChapterCardProps {
  chapter: Chapter
}

export function ChapterCard({ chapter }: ChapterCardProps) {
  const { tokens } = useDesignSystem()
  const statusColors = getStatusColor(chapter.status, tokens)

  return (
    <Link href={`/chapters/${chapter.slug}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg line-clamp-2">{chapter.title}</CardTitle>
            <Badge style={{ backgroundColor: statusColors.bg, color: statusColors.text }}>{chapter.status}</Badge>
          </div>
          <div className="text-sm text-gray-500">Chapter {chapter.chapterNumber}</div>
        </CardHeader>

        {/* Rest of the component remains the same */}
        <CardContent className="space-y-3">
          {chapter.summary && <p className="text-sm text-gray-600 line-clamp-2">{chapter.summary}</p>}

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-3">
              <div className="flex items-center">
                <FileText className="w-3 h-3 mr-1" />
                {chapter.wordCount} words
              </div>
              {chapter.pov && (
                <div className="flex items-center">
                  <Eye className="w-3 h-3 mr-1" />
                  {chapter.pov}
                </div>
              )}
            </div>
          </div>

          {(chapter.location || chapter.timeline) && (
            <div className="flex items-center space-x-3 text-xs text-gray-500">
              {chapter.location && (
                <div className="flex items-center">
                  <MapPin className="w-3 h-3 mr-1" />
                  {chapter.location}
                </div>
              )}
              {chapter.timeline && (
                <div className="flex items-center">
                  <Clock className="w-3 h-3 mr-1" />
                  {chapter.timeline}
                </div>
              )}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
