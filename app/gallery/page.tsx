import { ImageGallery } from "@/components/gallery/image-gallery"

export default function GalleryPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Image Gallery</h1>
      </div>

      <ImageGallery />
    </div>
  )
}
