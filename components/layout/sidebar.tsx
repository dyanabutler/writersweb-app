"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import { BookOpen, Users, MapPin, ImageIcon, Clock, FileText, Home } from "lucide-react"
import { useDesignSystem } from "@/lib/contexts/design-system-context"

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
    <div
      className="w-16 shadow-sm border-r border-gray-200 flex flex-col"
      style={{ backgroundColor: tokens.colors.background.secondary }}
      role="navigation"
      aria-label="Story management navigation"
    >
      {/* Logo */}
      <div className="p-3 border-b border-gray-200">
        <div 
          className="w-10 h-10 rounded-lg flex items-center justify-center text-white font-bold text-lg"
          style={{ backgroundColor: tokens.colors.primary[600] }}
        >
          S
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-2 py-4 space-y-2">
        {navigation.map((item) => {
          const isActive = pathname === item.href || (item.href !== "/" && pathname.startsWith(item.href))

          return (
            <Link
              key={item.name}
              href={item.href}
              className={cn(
                "flex items-center justify-center w-12 h-12 rounded-lg transition-colors group relative",
                isActive ? "text-white" : "hover:text-gray-900",
              )}
              style={{
                backgroundColor: isActive ? tokens.colors.primary[600] : "transparent",
                color: isActive ? "white" : tokens.colors.text.secondary,
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
              aria-label={item.name}
              title={item.name}
            >
              <item.icon className="w-5 h-5" />
              
              {/* Tooltip */}
              <div 
                className="absolute left-16 px-2 py-1 bg-gray-800 text-white text-sm rounded opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap z-50"
                role="tooltip"
              >
                {item.name}
              </div>
            </Link>
          )
        })}
      </nav>
    </div>
  )
}
