import { LocationList } from "@/components/location/location-list"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import Link from "next/link"

export default function LocationsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Locations</h1>
        <Link href="/locations/new">
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            New Location
          </Button>
        </Link>
      </div>

      <LocationList />
    </div>
  )
}
