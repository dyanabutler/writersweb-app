"use client"

import type React from "react"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Crown, CreditCard, Download, Calendar } from "lucide-react"
import { useDesignSystem } from "@/components/design-system"

export function BillingPanel() {
  const { tokens } = useDesignSystem()

  const mockSubscription = {
    plan: "Pro",
    status: "active",
    nextBilling: "2024-02-15",
    amount: "$8.00",
    paymentMethod: "**** **** **** 4242",
  }

  const invoices = [
    { date: "2024-01-15", amount: "$8.00", status: "paid", downloadUrl: "#" },
    { date: "2023-12-15", amount: "$8.00", status: "paid", downloadUrl: "#" },
    { date: "2023-11-15", amount: "$8.00", status: "paid", downloadUrl: "#" },
  ]

  return (
    <div className="space-y-6">
      {/* Current Subscription */}
      <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
        <CardHeader>
          <CardTitle className="flex items-center gap-2" style={{ color: tokens.colors.text.primary }}>
            <Crown className="w-5 h-5" style={{ color: tokens.colors.primary[600] }} />
            Current Subscription
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-lg font-semibold" style={{ color: tokens.colors.text.primary }}>
                  Story Manager Pro
                </h3>
                <Badge style={{ backgroundColor: tokens.colors.status.complete.bg, color: tokens.colors.status.complete.text }}>
                  Active
                </Badge>
              </div>
              <p className="text-sm" style={{ color: tokens.colors.text.secondary }}>
                Cloud sync across all devices
              </p>
            </div>
            <div className="text-right">
              <div className="text-2xl font-bold" style={{ color: tokens.colors.text.primary }}>
                {mockSubscription.amount}
              </div>
              <div className="text-sm" style={{ color: tokens.colors.text.muted }}>
                per month
              </div>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4 border-t">
            <div>
              <Label className="text-sm font-medium">Next billing date</Label>
              <div className="flex items-center gap-2 mt-1">
                <Calendar className="w-4 h-4" style={{ color: tokens.colors.icons.muted }} />
                <span className="text-sm">{mockSubscription.nextBilling}</span>
              </div>
            </div>
            <div>
              <Label className="text-sm font-medium">Payment method</Label>
              <div className="flex items-center gap-2 mt-1">
                <CreditCard className="w-4 h-4" style={{ color: tokens.colors.icons.muted }} />
                <span className="text-sm">{mockSubscription.paymentMethod}</span>
              </div>
            </div>
          </div>

          <div className="flex gap-2 pt-4">
            <Button variant="neutral-outline">Update Payment Method</Button>
            <Button variant="neutral-outline">Cancel Subscription</Button>
          </div>
        </CardContent>
      </Card>

      {/* Usage Stats */}
      <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
        <CardHeader>
          <CardTitle style={{ color: tokens.colors.text.primary }}>Usage This Month</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: tokens.colors.background.tertiary }}>
              <div className="text-2xl font-bold" style={{ color: tokens.colors.primary[600] }}>
                47
              </div>
              <div className="text-sm" style={{ color: tokens.colors.text.muted }}>
                Sync operations
              </div>
            </div>
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: tokens.colors.background.tertiary }}>
              <div className="text-2xl font-bold" style={{ color: tokens.colors.primary[600] }}>
                3.2 MB
              </div>
              <div className="text-sm" style={{ color: tokens.colors.text.muted }}>
                Data synced
              </div>
            </div>
            <div className="text-center p-4 rounded-lg" style={{ backgroundColor: tokens.colors.background.tertiary }}>
              <div className="text-2xl font-bold" style={{ color: tokens.colors.icons.accent }}>
                5
              </div>
              <div className="text-sm" style={{ color: tokens.colors.text.muted }}>
                Devices connected
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Billing History */}
      <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
        <CardHeader>
          <CardTitle style={{ color: tokens.colors.text.primary }}>Billing History</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            {invoices.map((invoice, index) => (
              <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                <div className="flex items-center gap-3">
                  <div>
                    <div className="font-medium" style={{ color: tokens.colors.text.primary }}>
                      {invoice.date}
                    </div>
                    <div className="text-sm" style={{ color: tokens.colors.text.muted }}>
                      Story Manager Pro
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-3">
                  <Badge variant="outline" style={{ color: tokens.colors.primary[600] }}>
                    {invoice.status}
                  </Badge>
                  <span className="font-medium" style={{ color: tokens.colors.text.primary }}>
                    {invoice.amount}
                  </span>
                  <Button variant="neutral-ghost" size="sm">
                    <Download className="w-4 h-4" />
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

function Label({ children, className }: { children: React.ReactNode; className?: string }) {
  return <div className={className}>{children}</div>
}
