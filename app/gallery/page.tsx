import { ImageGallery } from "@/components/gallery/image-gallery"

export default function GalleryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Image Gallery</h1>
      </div>

      <ImageGallery />
    </div>
  )
}
