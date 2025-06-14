"use client"

import { useState, useEffect } from "react"
import { LocationCard } from "./location-card"
import type { Location } from "@/lib/types"
import { getAllLocations } from "@/lib/content/locations"

export function LocationList() {
  const [locations, setLocations] = useState<Location[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadLocations = async () => {
      try {
        const locationData = await getAllLocations()
        setLocations(locationData)
      } catch (error) {
        console.error("Failed to load locations:", error)
      } finally {
        setLoading(false)
      }
    }

    loadLocations()
  }, [])

  if (loading) {
    return <div className="text-center py-8">Loading locations...</div>
  }

  return (
    <div className="space-y-4">
      <p className="text-gray-600">{locations.length} locations</p>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {locations.map((location) => (
          <LocationCard key={location.slug} location={location} />
        ))}
      </div>
    </div>
  )
}
