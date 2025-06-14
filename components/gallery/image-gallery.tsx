"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { StoryImage } from "@/lib/types"
import { getAllImages } from "@/lib/content/images"
import { Search, Users, MapPin, BookOpen, Camera, ChevronLeft, ChevronRight } from "lucide-react"
import { useDesignSystem } from "@/lib/contexts/design-system-context"
import { getImageTypeColor } from "@/lib/design-system"

export function ImageGallery() {
  const [images, setImages] = useState<StoryImage[]>([])
  const [filteredImages, setFilteredImages] = useState<StoryImage[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [typeFilter, setTypeFilter] = useState<string>("all")
  const [selectedImageIndex, setSelectedImageIndex] = useState<number | null>(null) // Changed to index
  const { tokens } = useDesignSystem()

  useEffect(() => {
    const loadImages = async () => {
      try {
        const imageData = await getAllImages()
        setImages(imageData)
        setFilteredImages(imageData)
      } catch (error) {
        console.error("Failed to load images:", error)
      } finally {
        setLoading(false)
      }
    }

    loadImages()
  }, [])

  useEffect(() => {
    let filtered = images

    if (searchTerm) {
      filtered = filtered.filter(
        (image) =>
          image.alt.toLowerCase().includes(searchTerm.toLowerCase()) ||
          image.tags?.some((tag) => tag.toLowerCase().includes(searchTerm.toLowerCase())),
      )
    }

    if (typeFilter !== "all") {
      filtered = filtered.filter((image) => image.type === typeFilter)
    }

    setFilteredImages(filtered)
  }, [images, searchTerm, typeFilter])

  const getTypeIcon = (type: string) => {
    switch (type) {
      case "character":
        return <Users className="w-4 h-4" />
      case "location":
        return <MapPin className="w-4 h-4" />
      case "scene":
        return <BookOpen className="w-4 h-4" />
      default:
        return <Camera className="w-4 h-4" />
    }
  }

  const getTypeColor = (type: string) => {
    return getImageTypeColor(type, tokens)
  }

  const handleImageClick = (index: number) => {
    setSelectedImageIndex(index)
  }

  const handleCloseModal = () => {
    setSelectedImageIndex(null)
  }

  const handlePrevImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prevIndex) => (prevIndex === 0 ? filteredImages.length - 1 : (prevIndex as number) - 1))
    }
  }

  const handleNextImage = () => {
    if (selectedImageIndex !== null) {
      setSelectedImageIndex((prevIndex) => (prevIndex === filteredImages.length - 1 ? 0 : (prevIndex as number) + 1))
    }
  }

  const currentImage = selectedImageIndex !== null ? filteredImages[selectedImageIndex] : null

  if (loading) {
    return <div className="text-center py-8">Loading images...</div>
  }

  return (
    <div className="space-y-6">
      {/* Filters */}
      <Card>
        <CardContent className="p-4">
          <div className="flex flex-col sm:flex-row gap-4">
            <div className="relative flex-1">
              <Search className="w-4 h-4 absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
              <Input
                placeholder="Search images by description or tags..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={typeFilter} onValueChange={setTypeFilter}>
              <SelectTrigger className="w-48">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="character">Characters</SelectItem>
                <SelectItem value="location">Locations</SelectItem>
                <SelectItem value="scene">Scenes</SelectItem>
                <SelectItem value="reference">Reference</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Stats */}
      <div className="flex items-center justify-between">
        <p className="text-gray-600">
          {filteredImages.length} of {images.length} images
        </p>
        <div className="flex gap-2">
          {["character", "location", "scene", "reference"].map((type) => {
            const count = images.filter((img) => img.type === type).length
            return (
              <Badge key={type} variant="outline" className="flex items-center gap-1">
                {getTypeIcon(type)}
                {count} {type}s
              </Badge>
            )
          })}
        </div>
      </div>

      {/* Image Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {filteredImages.map((image, index) => {
          const typeColors = getTypeColor(image.type)
          return (
            <Card
              key={image.id}
              className="hover:shadow-md transition-shadow cursor-pointer"
              onClick={() => handleImageClick(index)}
            >
              <div className="relative aspect-square">
                <Image
                  src={image.url || "/placeholder.svg"}
                  alt={image.alt}
                  fill
                  className="object-cover rounded-t-lg"
                />
                <div className="absolute top-2 right-2">
                  <Badge style={{ backgroundColor: typeColors.bg, color: typeColors.text }}>{image.type}</Badge>
                </div>
              </div>
              <CardContent className="p-3">
                <h3 className="font-medium text-sm line-clamp-1">{image.alt}</h3>
                <div className="flex items-center justify-between mt-2 text-xs text-gray-500">
                  <div className="flex items-center gap-2">
                    {image.connectedTo.characters && image.connectedTo.characters.length > 0 && (
                      <div className="flex items-center">
                        <Users className="w-3 h-3 mr-1" />
                        {image.connectedTo.characters.length}
                      </div>
                    )}
                    {image.connectedTo.locations && image.connectedTo.locations.length > 0 && (
                      <div className="flex items-center">
                        <MapPin className="w-3 h-3 mr-1" />
                        {image.connectedTo.locations.length}
                      </div>
                    )}
                    {image.connectedTo.chapters && image.connectedTo.chapters.length > 0 && (
                      <div className="flex items-center">
                        <BookOpen className="w-3 h-3 mr-1" />
                        {image.connectedTo.chapters.length}
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Image Detail/Slideshow Modal */}
      {currentImage && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-background text-foreground rounded-lg max-w-4xl max-h-[90vh] overflow-auto relative">
            <div className="p-6">
              <div className="flex items-start justify-between mb-4">
                <h2 className="text-xl font-bold">{currentImage.alt}</h2>
                <Button variant="ghost" onClick={handleCloseModal}>
                  ×
                </Button>
              </div>

              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <div className="relative aspect-square">
                  <Image
                    src={currentImage.url || "/placeholder.svg"}
                    alt={currentImage.alt}
                    fill
                    className="object-contain rounded-lg" // Changed to object-contain for slideshow
                  />
                  {filteredImages.length > 1 && (
                    <>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/70 dark:bg-gray-800/50 dark:hover:bg-gray-800/70"
                        onClick={handlePrevImage}
                      >
                        <ChevronLeft className="w-6 h-6" />
                      </Button>
                      <Button
                        variant="ghost"
                        size="icon"
                        className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/50 hover:bg-white/70 dark:bg-gray-800/50 dark:hover:bg-gray-800/70"
                        onClick={handleNextImage}
                      >
                        <ChevronRight className="w-6 h-6" />
                      </Button>
                    </>
                  )}
                </div>

                <div className="space-y-4">
                  <div>
                    <Badge className={getTypeColor(currentImage.type)}>{currentImage.type}</Badge>
                  </div>

                  {currentImage.tags && currentImage.tags.length > 0 && (
                    <div>
                      <h3 className="font-medium mb-2">Tags</h3>
                      <div className="flex flex-wrap gap-2">
                        {currentImage.tags.map((tag) => (
                          <Badge key={tag} variant="outline">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  )}

                  <div>
                    <h3 className="font-medium mb-2">Connections</h3>
                    <div className="space-y-2 text-sm">
                      {currentImage.connectedTo.characters && currentImage.connectedTo.characters.length > 0 && (
                        <div>
                          <strong>Characters:</strong> {currentImage.connectedTo.characters.join(", ")}
                        </div>
                      )}
                      {currentImage.connectedTo.locations && currentImage.connectedTo.locations.length > 0 && (
                        <div>
                          <strong>Locations:</strong> {currentImage.connectedTo.locations.join(", ")}
                        </div>
                      )}
                      {currentImage.connectedTo.chapters && currentImage.connectedTo.chapters.length > 0 && (
                        <div>
                          <strong>Chapters:</strong> {currentImage.connectedTo.chapters.join(", ")}
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
