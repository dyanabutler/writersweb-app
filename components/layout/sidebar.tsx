"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BookOpen, Users, MapPin, ImageIcon, Clock, FileText, Home } from "lucide-react"
import { useDesignSystem } from "@/components/design-system"

const navigation = [
  { name: "Dashboard", href: "/", icon: Home },
  { name: "Chapters", href: "/chapters", icon: BookOpen },
  { name: "Characters", href: "/characters", icon: Users },
  { name: "Locations", href: "/locations", icon: MapPin },
  { name: "Gallery", href: "/gallery", icon: ImageIcon },
  { name: "Timeline", href: "/timeline", icon: Clock },
  { name: "Drafts", href: "/drafts", icon: FileText },
]

export function Sidebar() {
  const pathname = usePathname()
  const { tokens } = useDesignSystem()

  return (
    <nav
      className="w-16 shadow-sm border-r flex flex-col"
      style={{ 
        backgroundColor: tokens.colors.background.secondary,
        borderColor: tokens.colors.border.secondary
      }}
    >
      <div className="p-3 border-b" style={{ borderColor: tokens.colors.border.muted }}>
        <Link href="/" className="block">
          <div
            className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
            style={{ backgroundColor: tokens.colors.primary[600] }}
          >
            S
          </div>
        </Link>
      </div>

      <div className="flex-1 py-4">
        <div className="space-y-2">
          {navigation.map((item) => {
            const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))
            return (
              <div key={item.href} className="group relative px-3">
                <Link
                  href={item.href}
                  className="flex items-center justify-center w-10 h-10 rounded-lg transition-colors relative"
                  style={{
                    backgroundColor: isActive ? tokens.colors.primary[100] : "transparent",
                    color: isActive ? tokens.colors.primary[700] : tokens.colors.icons.secondary,
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = tokens.colors.background.tertiary
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.backgroundColor = "transparent"
                    }
                  }}
                >
                  <item.icon className="w-5 h-5" />
                </Link>
                <div
                  className="absolute left-16 px-2 py-1 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50"
                  style={{ backgroundColor: tokens.colors.neutral[800] }}
                >
                  {item.name}
                </div>
              </div>
            )
          })}
        </div>
      </div>
    </nav>
  )
}
