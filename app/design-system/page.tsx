import { DesignSystemEditor } from "@/components/design-system/design-system-editor"

export default function DesignSystemPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold" style={{ color: "var(--text-primary)" }}>Design System</h1>
        <p style={{ color: "var(--text-secondary)" }}>Customize your story management system's appearance</p>
      </div>

      <DesignSystemEditor />
    </div>
  )
}
