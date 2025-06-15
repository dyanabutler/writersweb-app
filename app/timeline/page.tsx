import { TimelineView } from "@/components/common/timeline-view"

export default function TimelinePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Story Timeline</h1>
      </div>

      <TimelineView />
    </div>
  )
}
