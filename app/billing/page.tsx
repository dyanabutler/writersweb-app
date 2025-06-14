import { BillingPanel } from "@/components/billing/billing-panel"

export default function BillingPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>
          Billing & Subscription
        </h1>
      </div>

      <BillingPanel />
    </div>
  )
}
