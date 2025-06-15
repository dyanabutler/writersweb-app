"use client"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Badge } from "@/components/ui/badge"
import { User, Settings, Cloud, CreditCard, LogOut, Crown } from "lucide-react"
import { useDesignSystem } from "@/components/design-system"
import Link from "next/link"

interface UserMenuProps {
  user: {
    id: string
    name: string
    email: string
    subscription: "free" | "pro"
    avatar: string
  }
  onLogout: () => void
}

export function UserMenu({ user, onLogout }: UserMenuProps) {
  const { tokens } = useDesignSystem()

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button variant="neutral-ghost" className="relative h-10 w-10 rounded-full">
          <Image
            src={user.avatar || "/placeholder.svg"}
            alt={user.name}
            width={40}
            height={40}
            className="rounded-full"
          />
          {user.subscription === "pro" && (
            <Crown className="absolute -top-1 -right-1 w-4 h-4" style={{ color: tokens.colors.primary[500] }} />
          )}
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent className="w-56" align="end">
        <div className="flex items-center justify-start gap-2 p-2">
          <div className="flex flex-col space-y-1 leading-none">
            <p className="font-medium">{user.name}</p>
            <p className="text-xs" style={{ color: tokens.colors.text.muted }}>
              {user.email}
            </p>
            <Badge
              variant={user.subscription === "pro" ? "default" : "secondary"}
              className="w-fit"
              style={
                user.subscription === "pro"
                  ? {
                      backgroundColor: tokens.colors.primary[100],
                      color: tokens.colors.primary[700],
                    }
                  : {}
              }
            >
              {user.subscription === "pro" ? "Pro" : "Free"}
            </Badge>
          </div>
        </div>
        <DropdownMenuSeparator />
        <DropdownMenuItem asChild>
          <Link href="/profile" className="flex items-center">
            <User className="mr-2 h-4 w-4" />
            My Profile
          </Link>
        </DropdownMenuItem>
        <DropdownMenuItem asChild>
          <Link href="/settings" className="flex items-center">
            <Settings className="mr-2 h-4 w-4" />
            Settings
          </Link>
        </DropdownMenuItem>
        {user.subscription === "free" ? (
          <DropdownMenuItem asChild>
            <Link href="/pricing" className="flex items-center">
              <Cloud className="mr-2 h-4 w-4" />
              Upgrade to Pro
            </Link>
          </DropdownMenuItem>
        ) : (
          <DropdownMenuItem asChild>
            <Link href="/billing" className="flex items-center">
              <CreditCard className="mr-2 h-4 w-4" />
              Billing
            </Link>
          </DropdownMenuItem>
        )}
        <DropdownMenuSeparator />
        <DropdownMenuItem onClick={onLogout}>
          <LogOut className="mr-2 h-4 w-4" />
          Log out
        </DropdownMenuItem>
      </DropdownMenuContent>
    </DropdownMenu>
  )
}
