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

export function SyncStatus() {
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
      <div className="flex items-center gap-2 text-sm text-gray-500">
        <div className="animate-pulse w-4 h-4 bg-gray-300 rounded"></div>
        <span>Loading...</span>
      </div>
    )
  }

  const getStatusIcon = () => {
    if (isLocal) return <CloudOff className="w-4 h-4 text-gray-500" />
    if (!isOnline) return <WifiOff className="w-4 h-4 text-gray-400" />
    return <Cloud className="w-4 h-4 text-green-500" />
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
            <Badge variant={getStatusColor()} className="flex items-center gap-1">
              {getStatusIcon()}
              <span className="text-xs">{getStatusText()}</span>
            </Badge>
          </TooltipTrigger>
          <TooltipContent side="bottom">
            <div className="space-y-1">
              {isLocal ? (
                <>
                  <p className="font-medium">Local Storage Mode</p>
                  <p className="text-sm text-gray-600">
                    Your data is stored locally on this device only.
                  </p>
                  <p className="text-sm text-gray-600">
                    Upgrade to Pro for cloud sync across devices.
                  </p>
                </>
              ) : (
                <>
                  <p className="font-medium">Cloud Sync Active</p>
                  <p className="text-sm text-gray-600">
                    Your data is automatically synced to the cloud.
                  </p>
                  {!isOnline && (
                    <p className="text-sm text-orange-600">
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
              <Button size="sm" variant="outline" className="h-6 px-2">
                <Zap className="w-3 h-3 mr-1" />
                <span className="text-xs">Upgrade</span>
              </Button>
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
