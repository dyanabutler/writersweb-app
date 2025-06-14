import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

export function RecentActivity() {
  const activities = [
    { action: "Updated Chapter 3", time: "2 hours ago" },
    { action: "Created new character: Sarah", time: "1 day ago" },
    { action: "Reordered chapters 5-7", time: "2 days ago" },
    { action: "Added scene to Chapter 1", time: "3 days ago" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Recent Activity</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {activities.map((activity, index) => (
            <div key={index} className="flex justify-between items-center text-sm">
              <span>{activity.action}</span>
              <span className="text-gray-500">{activity.time}</span>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
