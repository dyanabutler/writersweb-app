import Link from "next/link"
import Image from "next/image" // Import Image component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import type { Character } from "@/lib/types"
import { Users, MapPin } from "lucide-react"
import { useDesignSystem } from "@/lib/contexts/design-system-context"
import { getCharacterStatusColor } from "@/lib/design-system"

interface CharacterCardProps {
  character: Character
}

export function CharacterCard({ character }: CharacterCardProps) {
  const { tokens } = useDesignSystem()
  const statusColors = getCharacterStatusColor(character.status, tokens)

  return (
    <Link href={`/characters/${character.slug}`}>
      <Card className="hover:shadow-md transition-shadow cursor-pointer">
        {character.images && character.images.length > 0 && (
          <div className="relative h-48 w-full">
            <Image
              src={character.images[0] || "/placeholder.svg"}
              alt={character.name}
              fill
              className="object-cover rounded-t-lg"
            />
          </div>
        )}

        <CardHeader className="pb-3">
          <div className="flex items-start justify-between">
            <CardTitle className="text-lg">{character.name}</CardTitle>
            <Badge style={{ backgroundColor: statusColors.bg, color: statusColors.text }}>{character.status}</Badge>
          </div>
          <div className="text-sm text-gray-500">{character.role}</div>
        </CardHeader>

        <CardContent className="space-y-3">
          <div className="flex items-center justify-between text-sm">
            <span className="text-gray-600">Age: {character.age || "Unknown"}</span>
            {character.firstAppearance && <span className="text-gray-600">First: {character.firstAppearance}</span>}
          </div>

          {character.location && (
            <div className="flex items-center text-sm text-gray-600">
              <MapPin className="w-3 h-3 mr-1" />
              {character.location}
            </div>
          )}

          {character.affiliations && character.affiliations.length > 0 && (
            <div className="flex items-center text-sm text-gray-600">
              <Users className="w-3 h-3 mr-1" />
              {character.affiliations.slice(0, 2).join(", ")}
              {character.affiliations.length > 2 && ` +${character.affiliations.length - 2} more`}
            </div>
          )}
        </CardContent>
      </Card>
    </Link>
  )
}
