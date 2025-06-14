import { DesignSystemEditor } from "@/components/design-system/design-system-editor"

export default function DesignSystemPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-3xl font-bold text-gray-900 dark:text-gray-100">Design System</h1>
        <p className="text-gray-600 dark:text-gray-400">Customize your story management system's appearance</p>
      </div>

      <DesignSystemEditor />
    </div>
  )
}
