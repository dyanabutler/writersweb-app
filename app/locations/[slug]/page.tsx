import { LocationEditor } from "@/components/location/location-editor"
import { getLocationBySlug } from "@/lib/content/locations"
import { notFound } from "next/navigation"

interface LocationPageProps {
  params: Promise<{ slug: string }>
}

export default async function LocationPage({ params }: LocationPageProps) {
  const { slug } = await params
  const location = await getLocationBySlug(slug)

  if (!location) {
    notFound()
  }

  return <LocationEditor location={location} />
}
