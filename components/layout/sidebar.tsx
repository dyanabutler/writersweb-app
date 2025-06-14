"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BookOpen, Users, Clock, Settings, Home, FileText, MapPin, ImageIcon, Palette } from "lucide-react"
import { useDesignSystem } from "@/lib/contexts/design-system-context"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Chapters", href: "/chapters", icon: BookOpen },
  { name: "Characters", href: "/characters", icon: Users },
  { name: "Locations", href: "/locations", icon: MapPin },
  { name: "Gallery", href: "/gallery", icon: ImageIcon },
  { name: "Timeline", href: "/timeline", icon: Clock },
  { name: "Drafts", href: "/drafts", icon: FileText },
  { name: "Design System", href: "/design-system", icon: Palette },
  { name: "Settings", href: "/settings", icon: Settings },
]

export function Sidebar() {
  const pathname = usePathname()
  const { tokens } = useDesignSystem()

  return (
    <div
      className="w-64 shadow-sm border-r border-gray-200"
      style={{ backgroundColor: tokens.colors.background.secondary }}
    >
      <div className="p-6">
        <h2 className="text-xl font-bold" style={{ color: tokens.colors.text.primary }}>
          Story Manager
        </h2>
      </div>

      <nav className="px-3 space-y-1">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center px-3 py-2 text-sm font-medium rounded-md transition-colors",
                isActive ? "text-blue-700" : "hover:text-gray-900",
              )}
              style={{
                backgroundColor: isActive ? tokens.colors.primary[50] : "transparent",
                color: isActive ? tokens.colors.primary[700] : tokens.colors.text.secondary,
              }}
              onMouseEnter={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = tokens.colors.background.tertiary
                  e.currentTarget.style.color = tokens.colors.text.primary
                }
              }}
              onMouseLeave={(e) => {
                if (!isActive) {
                  e.currentTarget.style.backgroundColor = "transparent"
                  e.currentTarget.style.color = tokens.colors.text.secondary
                }
              }}
            >
              <item.icon
                className="w-5 h-5 mr-3"
                style={{ color: isActive ? tokens.colors.icons.accent : tokens.colors.icons.secondary }}
              />
              {item.name}
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
