import { StoryOverview } from "@/components/common/story-overview"
import { RecentActivity } from "@/components/common/recent-activity"
import { QuickActions } from "@/components/common/quick-actions"

export default function HomePage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
            Dashboard
          </h1>
          <p className="mt-1" style={{ color: "var(--text-secondary)" }}>
            Welcome back! Here's what's happening with your stories.
          </p>
        </div>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <StoryOverview />
        </div>
        <div className="space-y-6">
          <QuickActions />
          <RecentActivity />
        </div>
      </div>
    </div>
  )
}
