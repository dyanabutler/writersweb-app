import { SettingsPanel } from "@/components/settings/settings-panel"

export default function SettingsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      </div>

      <SettingsPanel />
    </div>
  )
}
