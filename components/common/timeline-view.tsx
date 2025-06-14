"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"

export function TimelineView() {
  const timelineEvents = [
    {
      id: "1",
      title: "The Beginning",
      chapter: "Chapter 1",
      timeline: "Day 1",
      location: "Village Square",
      characters: ["John", "Mary"],
      status: "complete",
    },
    {
      id: "2",
      title: "The Discovery",
      chapter: "Chapter 3",
      timeline: "Day 2",
      location: "Ancient Forest",
      characters: ["John", "Elder"],
      status: "draft",
    },
    {
      id: "3",
      title: "The Confrontation",
      chapter: "Chapter 7",
      timeline: "Day 5",
      location: "Castle Throne Room",
      characters: ["John", "Dark Lord", "Mary"],
      status: "draft",
    },
  ]

  const statusColors = {
    draft: "bg-yellow-100 text-yellow-800",
    complete: "bg-green-100 text-green-800",
    review: "bg-blue-100 text-blue-800",
  }

  return (
    <div className="space-y-4">
      <div className="relative">
        <div className="absolute left-4 top-0 bottom-0 w-0.5 bg-gray-200"></div>

        {timelineEvents.map((event, index) => (
          <div key={event.id} className="relative flex items-start space-x-4 pb-8">
            <div className="flex-shrink-0 w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">
              {index + 1}
            </div>

            <Card className="flex-1">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div>
                    <CardTitle className="text-lg">{event.title}</CardTitle>
                    <div className="text-sm text-gray-500 mt-1">
                      {event.chapter} • {event.timeline} • {event.location}
                    </div>
                  </div>
                  <Badge className={statusColors[event.status as keyof typeof statusColors]}>{event.status}</Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="flex flex-wrap gap-2">
                  {event.characters.map((character) => (
                    <Badge key={character} variant="outline">
                      {character}
                    </Badge>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        ))}
      </div>
    </div>
  )
}
