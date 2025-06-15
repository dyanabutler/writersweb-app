"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Check, Cloud, Smartphone, Laptop, Tablet, Crown, Zap } from "lucide-react"
import { useDesignSystem } from "@/components/design-system"

export function PricingPlans() {
  const { tokens } = useDesignSystem()

  const plans = [
    {
      name: "Free",
      price: "$0",
      period: "forever",
      description: "Perfect for local writing",
      features: [
        "Unlimited chapters & characters",
        "Full design system customization",
        "Local file storage",
        "All writing features",
        "Timeline & scene management",
        "Image gallery",
        "Export capabilities",
      ],
      limitations: ["Single device only", "No cloud backup", "No cross-device sync"],
      cta: "Current Plan",
      popular: false,
      icon: <Laptop className="w-6 h-6" />,
    },
    {
      name: "Pro",
      price: "$8",
      period: "per month",
      description: "For writers who work everywhere",
      features: [
        "Everything in Free",
        "Cloud sync across all devices",
        "Automatic backups",
        "Real-time collaboration",
        "Version history",
        "Priority support",
        "Advanced export options",
        "Team sharing (coming soon)",
      ],
      limitations: [],
      cta: "Upgrade to Pro",
      popular: true,
      icon: <Crown className="w-6 h-6" />,
    },
  ]

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-4xl mx-auto">
      {plans.map((plan) => (
        <Card
          key={plan.name}
          className={`relative ${plan.popular ? "ring-2" : ""}`}
          style={{
            backgroundColor: tokens.colors.background.secondary,
            ringColor: plan.popular ? tokens.colors.primary[500] : "transparent",
          }}
        >
          {plan.popular && (
            <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
              <Badge
                className="px-3 py-1"
                style={{
                  backgroundColor: tokens.colors.primary[600],
                  color: tokens.colors.text.inverse,
                }}
              >
                <Zap className="w-3 h-3 mr-1" />
                Most Popular
              </Badge>
            </div>
          )}

          <CardHeader className="text-center pb-4">
            <div className="flex items-center justify-center mb-2">
              <div className="p-3 rounded-full" style={{ backgroundColor: tokens.colors.primary[50] }}>
                <div style={{ color: tokens.colors.primary[600] }}>{plan.icon}</div>
              </div>
            </div>
            <CardTitle className="text-2xl" style={{ color: tokens.colors.text.primary }}>
              {plan.name}
            </CardTitle>
            <div className="space-y-1">
              <div className="flex items-baseline justify-center gap-1">
                <span className="text-4xl font-bold" style={{ color: tokens.colors.text.primary }}>
                  {plan.price}
                </span>
                <span className="text-lg" style={{ color: tokens.colors.text.muted }}>
                  /{plan.period}
                </span>
              </div>
              <p className="text-sm" style={{ color: tokens.colors.text.secondary }}>
                {plan.description}
              </p>
            </div>
          </CardHeader>

          <CardContent className="space-y-6">
            <div className="space-y-3">
              <h4 className="font-medium" style={{ color: tokens.colors.text.primary }}>
                What's included:
              </h4>
              <ul className="space-y-2">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-start gap-2">
                    <Check className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: tokens.colors.secondary[600] }} />
                    <span className="text-sm" style={{ color: tokens.colors.text.secondary }}>
                      {feature}
                    </span>
                  </li>
                ))}
              </ul>
            </div>

            {plan.limitations.length > 0 && (
              <div className="space-y-3">
                <h4 className="font-medium" style={{ color: tokens.colors.text.primary }}>
                  Limitations:
                </h4>
                <ul className="space-y-2">
                  {plan.limitations.map((limitation, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <div
                        className="w-4 h-4 mt-0.5 flex-shrink-0 rounded-full border-2"
                        style={{ borderColor: tokens.colors.text.muted }}
                      />
                      <span className="text-sm" style={{ color: tokens.colors.text.muted }}>
                        {limitation}
                      </span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <Button
              className="w-full"
              variant={plan.name === "Free" ? "outline" : "default"}
              disabled={plan.name === "Free"}
              style={
                plan.name === "Pro"
                  ? {
                      backgroundColor: tokens.colors.primary[600],
                      color: tokens.colors.text.inverse,
                    }
                  : {}
              }
            >
              {plan.cta}
            </Button>

            {plan.name === "Pro" && (
              <div className="text-center space-y-2">
                <p className="text-xs" style={{ color: tokens.colors.text.muted }}>
                  30-day money-back guarantee
                </p>
                <div
                  className="flex items-center justify-center gap-4 text-xs"
                  style={{ color: tokens.colors.text.muted }}
                >
                  <div className="flex items-center gap-1">
                    <Smartphone className="w-3 h-3" />
                    Mobile
                  </div>
                  <div className="flex items-center gap-1">
                    <Tablet className="w-3 h-3" />
                    Tablet
                  </div>
                  <div className="flex items-center gap-1">
                    <Laptop className="w-3 h-3" />
                    Desktop
                  </div>
                  <div className="flex items-center gap-1">
                    <Cloud className="w-3 h-3" />
                    Web
                  </div>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      ))}
    </div>
  )
}
