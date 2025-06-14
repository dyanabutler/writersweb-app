import { PricingPlans } from "@/components/pricing/pricing-plans"

export default function PricingPage() {
  return (
    <div className="space-y-6">
      <div className="text-center space-y-4">
        <h1 className="text-4xl font-bold" style={{ color: "var(--text-primary)" }}>
          Choose Your Plan
        </h1>
        <p className="text-xl" style={{ color: "var(--text-secondary)" }}>
          Write locally for free, or sync across all your devices with Pro
        </p>
      </div>

      <PricingPlans />
    </div>
  )
}
