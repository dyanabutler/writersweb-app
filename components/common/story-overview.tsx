"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { BookOpen, Users, Clock, FileText } from "lucide-react"

export function StoryOverview() {
  const stats = [
    { label: "Total Chapters", value: 12, icon: BookOpen, color: "text-blue-600" },
    { label: "Characters", value: 8, icon: Users, color: "text-green-600" },
    { label: "Scenes", value: 34, icon: Clock, color: "text-purple-600" },
    { label: "Total Words", value: "45,230", icon: FileText, color: "text-orange-600" },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Story Overview</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <div key={stat.label} className="text-center p-4 bg-gray-50 rounded-lg">
              <stat.icon className={`w-8 h-8 mx-auto mb-2 ${stat.color}`} />
              <div className="text-2xl font-bold">{stat.value}</div>
              <div className="text-sm text-gray-600">{stat.label}</div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
