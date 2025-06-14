"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Users, Star, Heart, Sword, Crown, Shield } from "lucide-react"
import { useDesignSystem } from "@/lib/contexts/design-system-context"
import type { Character } from "@/lib/types"

interface FeaturedCharactersGalleryProps {
  characters: Character[]
  authorName?: string
}

const roleIcons = {
  protagonist: Crown,
  antagonist: Sword,
  supporting: Heart,
  mentor: Shield,
  hero: Crown,
  villain: Sword,
  sidekick: Heart,
  default: Users
}

const statusColors = {
  alive: "text-green-600 bg-green-100",
  deceased: "text-red-600 bg-red-100", 
  missing: "text-orange-600 bg-orange-100",
  unknown: "text-gray-600 bg-gray-100"
}

export function FeaturedCharactersGallery({ characters, authorName }: FeaturedCharactersGalleryProps) {
  const { tokens } = useDesignSystem()
  
  const featuredCharacters = characters.filter(character => character.featured)
  
  if (featuredCharacters.length === 0) return null

  const getInitials = (name: string) => {
    return name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2)
  }

  const getRoleIcon = (role: string) => {
    const lowerRole = role.toLowerCase()
    const IconComponent = roleIcons[lowerRole as keyof typeof roleIcons] || roleIcons.default
    return IconComponent
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: tokens.colors.secondary[100] }}
          >
            <Users className="w-6 h-6" style={{ color: tokens.colors.secondary[600] }} />
          </div>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: tokens.colors.text.primary }}>
              Featured Characters
            </h2>
            <p className="text-sm" style={{ color: tokens.colors.text.muted }}>
              Meet {authorName}'s most memorable personalities
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          {featuredCharacters.length} Character{featuredCharacters.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
        {featuredCharacters.map((character) => {
          const RoleIcon = getRoleIcon(character.role)
          
          return (
            <Card 
              key={character.slug}
              className="group hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-blue-200 relative overflow-hidden"
              style={{ backgroundColor: tokens.colors.background.secondary }}
            >
              {/* Featured Star */}
              <div className="absolute top-2 right-2 z-10">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>

              <CardHeader className="pb-3 text-center">
                <div className="flex justify-center mb-3">
                  <Avatar className="w-16 h-16 border-2 border-white shadow-md">
                    <AvatarImage src={character.images?.[0]} alt={character.name} />
                    <AvatarFallback 
                      className="text-lg font-semibold"
                      style={{ 
                        backgroundColor: tokens.colors.primary[100],
                        color: tokens.colors.primary[700]
                      }}
                    >
                      {getInitials(character.name)}
                    </AvatarFallback>
                  </Avatar>
                </div>
                
                <CardTitle className="text-lg group-hover:text-blue-600 transition-colors">
                  {character.name}
                </CardTitle>
                
                <div className="flex flex-wrap justify-center gap-1 mt-2">
                  <Badge 
                    className="text-xs flex items-center gap-1"
                    style={{ 
                      backgroundColor: tokens.colors.secondary[100],
                      color: tokens.colors.secondary[700]
                    }}
                  >
                    <RoleIcon className="w-3 h-3" />
                    {character.role}
                  </Badge>
                  
                  <Badge 
                    className={`text-xs ${statusColors[character.status] || statusColors.unknown}`}
                  >
                    {character.status}
                  </Badge>
                </div>
              </CardHeader>

              <CardContent className="pt-0 space-y-3">
                {character.description && (
                  <p 
                    className="text-sm leading-relaxed text-center line-clamp-3"
                    style={{ color: tokens.colors.text.muted }}
                  >
                    {character.description}
                  </p>
                )}

                {character.age && character.age > 0 && (
                  <div className="text-center">
                    <span className="text-xs px-2 py-1 rounded-full" style={{ 
                      backgroundColor: tokens.colors.neutral[100],
                      color: tokens.colors.text.muted 
                    }}>
                      Age {character.age}
                    </span>
                  </div>
                )}

                {character.location && (
                  <div className="text-center">
                    <span className="text-xs" style={{ color: tokens.colors.text.muted }}>
                      📍 {character.location}
                    </span>
                  </div>
                )}

                {character.affiliations && character.affiliations.length > 0 && (
                  <div className="space-y-1">
                    <p className="text-xs font-medium" style={{ color: tokens.colors.text.secondary }}>
                      Affiliations:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {character.affiliations.slice(0, 2).map((affiliation, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {affiliation}
                        </Badge>
                      ))}
                      {character.affiliations.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{character.affiliations.length - 2} more
                        </Badge>
                      )}
                    </div>
                  </div>
                )}

                {character.firstAppearance && (
                  <div className="text-center pt-2 border-t" style={{ borderColor: tokens.colors.neutral[200] }}>
                    <span className="text-xs" style={{ color: tokens.colors.text.muted }}>
                      First appears in {character.firstAppearance}
                    </span>
                  </div>
                )}
              </CardContent>
            </Card>
          )
        })}
      </div>
    </section>
  )
} 