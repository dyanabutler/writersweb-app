import Link from "next/link"
import Image from "next/image"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Location } from "@/lib/types"
import { Users, BookOpen } from "lucide-react"
import { useDesignSystem } from "@/components/design-system"
import { getLocationTypeColor } from "@/components/design-system"

interface LocationCardProps {
  location: Location
}

export function LocationCard({ location }: LocationCardProps) {
  const { tokens } = useDesignSystem()
  const typeColors = getLocationTypeColor(location.type, tokens)

  return (
    <Link href={`/locations/${location.slug}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        {location.images && location.images.length > 0 && (
          <div className="relative h-48 w-full">
            <Image
              src={location.images[0] || "/placeholder.svg"}
              alt={location.name}
              fill
              className="object-cover rounded-t-lg"
            />
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg">{location.name}</CardTitle>
            <Badge style={{ backgroundColor: typeColors.bg, color: typeColors.text }}>{location.type}</Badge>
          </div>
        </CardHeader>

        <CardContent className="space-y-3">
          {location.description && <p className="text-sm text-gray-600 line-clamp-2">{location.description}</p>}

          <div className="flex items-center justify-between text-xs text-gray-500">
            <div className="flex items-center space-x-3">
              {location.connectedCharacters && location.connectedCharacters.length > 0 && (
                <div className="flex items-center">
                  <Users className="w-3 h-3 mr-1" />
                  {location.connectedCharacters.length} characters
                </div>
              )}
              {location.connectedChapters && location.connectedChapters.length > 0 && (
                <div className="flex items-center">
                  <BookOpen className="w-3 h-3 mr-1" />
                  {location.connectedChapters.length} chapters
                </div>
              )}
            </div>
          </div>

          {location.significance && (
            <div className="text-xs text-gray-600">
              <strong>Significance:</strong> {location.significance}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
