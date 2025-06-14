import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { BookOpen, Users, Clock } from "lucide-react"
import Link from "next/link"

export function QuickActions() {
  const actions = [
    { label: "New Chapter", href: "/chapters/new", icon: BookOpen },
    { label: "New Character", href: "/characters/new", icon: Users },
    { label: "View Timeline", href: "/timeline", icon: Clock },
  ]

  return (
    <Card>
      <CardHeader>
        <CardTitle>Quick Actions</CardTitle>
      </CardHeader>
      <CardContent className="space-y-2">
        {actions.map((action) => (
          <Link key={action.label} href={action.href}>
            <Button variant="outline" className="w-full justify-start">
              <action.icon className="w-4 h-4 mr-2" />
              {action.label}
            </Button>
          </Link>
        ))}
      </CardContent>
    </Card>
  )
}
