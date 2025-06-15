"use client"

import { useEffect, useState } from "react"
import { Cloud, CloudOff, Wifi, WifiOff, Zap } from "lucide-react"
import { useDataLayerContext } from "@/lib/content/data-layer"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { 
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip"
import { useDesignSystem } from "@/components/design-system"
import Link from "next/link"

export function SyncStatus() {
  const { tokens } = useDesignSystem()
  const { isLocal, isPro, isLoading } = useDataLayerContext()
  const [isOnline, setIsOnline] = useState(true)
  const [lastSync, setLastSync] = useState<Date>(new Date())

  useEffect(() => {
    // Monitor online status
    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    // Update sync time periodically for pro users
    if (isPro && isOnline) {
      const interval = setInterval(() => {
        setLastSync(new Date())
      }, 30000) // Update every 30 seconds

      return () => {
        clearInterval(interval)
        window.removeEventListener('online', handleOnline)
        window.removeEventListener('offline', handleOffline)
      }
    }

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [isPro, isOnline])

  if (isLoading) {
    return (
      <div className="flex items-center gap-2 text-sm" style={{ color: tokens.colors.text.muted }}>
        <div className="animate-pulse w-4 h-4 rounded" style={{ backgroundColor: tokens.colors.neutral[300] }}></div>
        <span>Loading...</span>
      </div>
    )
  }

  const getStatusIcon = () => {
    if (isLocal) return <CloudOff className="w-4 h-4" style={{ color: tokens.colors.icons.muted }} />
    if (!isOnline) return <WifiOff className="w-4 h-4" style={{ color: tokens.colors.icons.secondary }} />
    return <Cloud className="w-4 h-4" style={{ color: tokens.colors.status.complete.bg }} />
  }

  const getStatusText = () => {
    if (isLocal) return "Local Storage"
    if (!isOnline) return "Offline"
    return `Synced ${lastSync.toLocaleTimeString()}`
  }

  const getStatusColor = () => {
    if (isLocal) return "secondary"
    if (!isOnline) return "destructive"
    return "default"
  }

  return (
    <TooltipProvider>
      <div className="flex items-center gap-2">
        <Tooltip>
          <TooltipTrigger asChild>
            <Badge 
              variant={getStatusColor()} 
              className="flex items-center gap-1 backdrop-blur-md border-[0.5px]"
              style={{
                backgroundColor: `${tokens.colors.background.secondary}80`,
                borderColor: `${tokens.colors.border.primary}80`,
                color: tokens.colors.text.primary,
              }}
            >
              {getStatusIcon()}
              <span className="text-xs">{getStatusText()}</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <div className="space-y-1">
              {isLocal ? (
                <>
                  <p className="font-medium">Local Storage Mode</p>
                  <p className="text-sm" style={{ color: tokens.colors.text.secondary }}>
                    Your data is stored locally on this device only.
                  </p>
                  <p className="text-sm" style={{ color: tokens.colors.text.secondary }}>
                    Upgrade to Pro for cloud sync across devices.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-medium">Cloud Sync Active</p>
                  <p className="text-sm" style={{ color: tokens.colors.text.secondary }}>
                    Your data is automatically synced to the cloud.
                  </p>
                  {!isOnline && (
                    <p className="text-sm" style={{ color: tokens.colors.status.draft.bg }}>
                      Offline - changes will sync when online.
                    </p>
                  )}
                </>
              )}
            </div>
          </TooltipContent>
        </Tooltip>

        {isLocal && (
          <Tooltip>
            <TooltipTrigger asChild>
              <Link href="/pricing">
                <Button size="sm" variant="glass" className="h-6 px-2">
                  <Zap className="w-3 h-3 mr-1" />
                  <span className="text-xs">Upgrade</span>
                </Button>
              </Link>
            </TooltipTrigger>
            <TooltipContent side="bottom">
              <p>Upgrade to Pro for cloud sync, unlimited stories, and more!</p>
            </TooltipContent>
          </Tooltip>
        )}
      </div>
    </TooltipProvider>
  )
}
