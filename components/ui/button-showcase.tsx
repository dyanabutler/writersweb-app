"use client"

import { Button } from "./button"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { useDesignSystem } from "@/components/design-system"
import { 
  Heart, 
  Download, 
  Settings, 
  Plus, 
  ArrowRight, 
  Star,
  Trash2,
  Edit,
  Save,
  Send
} from "lucide-react"

export function ButtonShowcase() {
  const { tokens } = useDesignSystem()

  return (
    <div className="space-y-8 p-6">
      <div>
        <h1 className="text-3xl font-bold mb-2" style={{ color: tokens.colors.text.primary }}>
          Button Component Showcase
        </h1>
        <p style={{ color: tokens.colors.text.secondary }}>
          Comprehensive button system with design token integration
        </p>
      </div>

      {/* Primary Variants */}
      <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
        <CardHeader>
          <CardTitle style={{ color: tokens.colors.text.primary }}>Primary Variants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="primary">Primary</Button>
            <Button variant="primary-outline">Primary Outline</Button>
            <Button variant="primary-ghost">Primary Ghost</Button>
            <Button variant="primary-soft">Primary Soft</Button>
          </div>
        </CardContent>
      </Card>

      {/* Secondary Variants */}
      <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
        <CardHeader>
          <CardTitle style={{ color: tokens.colors.text.primary }}>Secondary Variants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="secondary">Secondary</Button>
            <Button variant="secondary-outline">Secondary Outline</Button>
            <Button variant="secondary-ghost">Secondary Ghost</Button>
            <Button variant="secondary-soft">Secondary Soft</Button>
          </div>
        </CardContent>
      </Card>

      {/* Status Variants */}
      <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
        <CardHeader>
          <CardTitle style={{ color: tokens.colors.text.primary }}>Status Variants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="success">Success</Button>
            <Button variant="success-outline">Success Outline</Button>
            <Button variant="success-ghost">Success Ghost</Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="warning">Warning</Button>
            <Button variant="warning-outline">Warning Outline</Button>
            <Button variant="warning-ghost">Warning Ghost</Button>
          </div>
          <div className="flex flex-wrap gap-3">
            <Button variant="danger">Danger</Button>
            <Button variant="danger-outline">Danger Outline</Button>
            <Button variant="danger-ghost">Danger Ghost</Button>
          </div>
        </CardContent>
      </Card>

      {/* Special Variants */}
      <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
        <CardHeader>
          <CardTitle style={{ color: tokens.colors.text.primary }}>Special Variants</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="gradient">Gradient</Button>
            <Button variant="glass">Glass</Button>
            <Button variant="link">Link Button</Button>
            <Button variant="minimal">Minimal</Button>
          </div>
        </CardContent>
      </Card>

      {/* Sizes */}
      <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
        <CardHeader>
          <CardTitle style={{ color: tokens.colors.text.primary }}>Sizes</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" size="xs">Extra Small</Button>
            <Button variant="primary" size="sm">Small</Button>
            <Button variant="primary" size="default">Default</Button>
            <Button variant="primary" size="lg">Large</Button>
            <Button variant="primary" size="xl">Extra Large</Button>
          </div>
        </CardContent>
      </Card>

      {/* Icon Buttons */}
      <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
        <CardHeader>
          <CardTitle style={{ color: tokens.colors.text.primary }}>Icon Buttons</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap items-center gap-3">
            <Button variant="primary" size="icon-sm">
              <Plus />
            </Button>
            <Button variant="primary" size="icon">
              <Settings />
            </Button>
            <Button variant="primary" size="icon-lg">
              <Heart />
            </Button>
            <Button variant="primary" size="icon-xl">
              <Star />
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* With Icons */}
      <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
        <CardHeader>
          <CardTitle style={{ color: tokens.colors.text.primary }}>Buttons with Icons</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" leftIcon={<Download />}>
              Download
            </Button>
            <Button variant="secondary" rightIcon={<ArrowRight />}>
              Continue
            </Button>
            <Button variant="success" leftIcon={<Save />}>
              Save Changes
            </Button>
            <Button variant="danger" leftIcon={<Trash2 />}>
              Delete
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Loading States */}
      <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
        <CardHeader>
          <CardTitle style={{ color: tokens.colors.text.primary }}>Loading States</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" loading>
              Loading...
            </Button>
            <Button variant="secondary" loading loadingText="Saving...">
              Save
            </Button>
            <Button variant="success" loading loadingText="Uploading...">
              Upload
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Full Width & Rounded */}
      <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
        <CardHeader>
          <CardTitle style={{ color: tokens.colors.text.primary }}>Layout Options</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <Button variant="primary" fullWidth>
              Full Width Button
            </Button>
            <div className="flex gap-3">
              <Button variant="primary" rounded="none">Square</Button>
              <Button variant="primary" rounded="sm">Small Radius</Button>
              <Button variant="primary" rounded="lg">Large Radius</Button>
              <Button variant="primary" rounded="full">Pill</Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Disabled States */}
      <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
        <CardHeader>
          <CardTitle style={{ color: tokens.colors.text.primary }}>Disabled States</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="flex flex-wrap gap-3">
            <Button variant="primary" disabled>
              Disabled Primary
            </Button>
            <Button variant="secondary" disabled>
              Disabled Secondary
            </Button>
            <Button variant="success" disabled>
              Disabled Success
            </Button>
            <Button variant="danger" disabled>
              Disabled Danger
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Real-world Examples */}
      <Card style={{ backgroundColor: tokens.colors.background.secondary }}>
        <CardHeader>
          <CardTitle style={{ color: tokens.colors.text.primary }}>Real-world Examples</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-3">
            <div className="flex gap-3">
              <Button variant="primary" leftIcon={<Plus />}>
                Create New Story
              </Button>
              <Button variant="secondary-outline" leftIcon={<Edit />}>
                Edit
              </Button>
              <Button variant="danger-ghost" size="icon">
                <Trash2 />
              </Button>
            </div>
            
            <div className="flex gap-3">
              <Button variant="success" leftIcon={<Send />} size="lg">
                Publish Story
              </Button>
              <Button variant="neutral-outline" size="lg">
                Save as Draft
              </Button>
            </div>

            <Button variant="gradient" fullWidth size="lg" rightIcon={<ArrowRight />}>
              Get Started with Premium
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  )
} 