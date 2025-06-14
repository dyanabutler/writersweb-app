"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { MapPin, Star, Mountain, Building, Landmark, Globe, TreePine } from "lucide-react"
import { useDesignSystem } from "@/lib/contexts/design-system-context"
import type { Location } from "@/lib/types"

interface FeaturedLocationsShowcaseProps {
  locations: Location[]
  authorName?: string
}

const locationTypeIcons = {
  city: Building,
  building: Building,
  landmark: Landmark,
  region: Mountain,
  other: Globe
}

const locationTypeColors = {
  city: "text-blue-600 bg-blue-100",
  building: "text-gray-600 bg-gray-100",
  landmark: "text-purple-600 bg-purple-100", 
  region: "text-green-600 bg-green-100",
  other: "text-orange-600 bg-orange-100"
}

export function FeaturedLocationsShowcase({ locations, authorName }: FeaturedLocationsShowcaseProps) {
  const { tokens } = useDesignSystem()
  
  const featuredLocations = locations.filter(location => location.featured)
  
  if (featuredLocations.length === 0) return null

  const getLocationIcon = (type: string) => {
    const IconComponent = locationTypeIcons[type as keyof typeof locationTypeIcons] || locationTypeIcons.other
    return IconComponent
  }

  return (
    <section className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div 
            className="p-2 rounded-lg"
            style={{ backgroundColor: tokens.colors.primary[100] }}
          >
            <MapPin className="w-6 h-6" style={{ color: tokens.colors.primary[600] }} />
          </div>
          <div>
            <h2 className="text-2xl font-bold" style={{ color: tokens.colors.text.primary }}>
              Featured Locations
            </h2>
            <p className="text-sm" style={{ color: tokens.colors.text.muted }}>
              Explore the worlds {authorName} has crafted
            </p>
          </div>
        </div>
        <Badge variant="secondary" className="px-3 py-1">
          {featuredLocations.length} Location{featuredLocations.length !== 1 ? 's' : ''}
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {featuredLocations.map((location) => {
          const LocationIcon = getLocationIcon(location.type)
          
          return (
            <Card 
              key={location.slug}
              className="group hover:shadow-lg transition-all duration-300 border-2 border-transparent hover:border-green-200 relative overflow-hidden"
              style={{ backgroundColor: tokens.colors.background.secondary }}
            >
              {/* Featured Star */}
              <div className="absolute top-3 right-3 z-10">
                <Star className="w-4 h-4 fill-amber-400 text-amber-400" />
              </div>

              {/* Atmospheric Background Gradient */}
              <div 
                className="absolute inset-0 opacity-5"
                style={{
                  background: `linear-gradient(135deg, ${tokens.colors.primary[100]} 0%, ${tokens.colors.primary[50]} 100%)`
                }}
              />

              <CardHeader className="pb-3 relative z-10">
                <div className="flex items-start gap-3">
                                     <div 
                     className="p-2 rounded-lg shrink-0"
                     style={{ backgroundColor: tokens.colors.secondary[100] }}
                   >
                     <LocationIcon className="w-5 h-5" style={{ color: tokens.colors.secondary[600] }} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <CardTitle className="text-lg leading-tight group-hover:text-green-600 transition-colors truncate">
                      {location.name}
                    </CardTitle>
                    <Badge 
                      className={`text-xs mt-2 ${locationTypeColors[location.type] || locationTypeColors.other}`}
                    >
                      {location.type.charAt(0).toUpperCase() + location.type.slice(1)}
                    </Badge>
                  </div>
                </div>
              </CardHeader>

              <CardContent className="pt-0 space-y-4 relative z-10">
                {location.description && (
                  <p 
                    className="text-sm leading-relaxed line-clamp-3"
                    style={{ color: tokens.colors.text.muted }}
                  >
                    {location.description}
                  </p>
                )}

                {location.significance && (
                  <div className="space-y-2">
                    <p className="text-xs font-semibold" style={{ color: tokens.colors.text.secondary }}>
                      Story Significance:
                    </p>
                    <p 
                      className="text-sm leading-relaxed line-clamp-2"
                      style={{ color: tokens.colors.text.muted }}
                    >
                      {location.significance}
                    </p>
                  </div>
                )}

                <div className="grid grid-cols-1 gap-3">
                  {location.climate && (
                    <div className="flex items-center gap-2">
                      <TreePine className="w-3 h-3" style={{ color: tokens.colors.icons.muted }} />
                      <span className="text-xs" style={{ color: tokens.colors.text.muted }}>
                        <span className="font-medium">Climate:</span> {location.climate}
                      </span>
                    </div>
                  )}

                  {location.population && (
                    <div className="flex items-center gap-2">
                      <Globe className="w-3 h-3" style={{ color: tokens.colors.icons.muted }} />
                      <span className="text-xs" style={{ color: tokens.colors.text.muted }}>
                        <span className="font-medium">Population:</span> {location.population}
                      </span>
                    </div>
                  )}

                  {location.parentLocation && (
                    <div className="flex items-center gap-2">
                      <MapPin className="w-3 h-3" style={{ color: tokens.colors.icons.muted }} />
                      <span className="text-xs" style={{ color: tokens.colors.text.muted }}>
                        <span className="font-medium">Located in:</span> {location.parentLocation}
                      </span>
                    </div>
                  )}
                </div>

                {location.connectedCharacters && location.connectedCharacters.length > 0 && (
                  <div className="pt-3 border-t" style={{ borderColor: tokens.colors.neutral[200] }}>
                    <p className="text-xs font-medium mb-2" style={{ color: tokens.colors.text.secondary }}>
                      Connected Characters:
                    </p>
                    <div className="flex flex-wrap gap-1">
                      {location.connectedCharacters.slice(0, 3).map((character, index) => (
                        <Badge key={index} variant="outline" className="text-xs">
                          {character}
                        </Badge>
                      ))}
                      {location.connectedCharacters.length > 3 && (
                        <Badge variant="outline" className="text-xs">
                          +{location.connectedCharacters.length - 3} more
                        </Badge>
                      )}
                    </div>
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