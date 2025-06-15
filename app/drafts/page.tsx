import { DraftsList } from "@/components/drafts/drafts-list"

export default function DraftsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Drafts</h1>
          <p style={{ color: "var(--text-secondary)" }}>All content in draft status</p>
        </div>
      </div>

      <DraftsList />
    </div>
  )
}
