import { DraftsList } from "@/components/drafts/drafts-list"

export default function DraftsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Drafts</h1>
        <p className="text-gray-600">All content in draft status</p>
      </div>

      <DraftsList />
    </div>
  )
}
