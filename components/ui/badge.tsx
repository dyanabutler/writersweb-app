import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@/lib/utils"
import { useDesignSystem } from "@/components/design-system"

const badgeVariants = cva(
  "inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent",
        secondary: "border-transparent", 
        destructive: "border-transparent",
        outline: "",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, style, ...props }: BadgeProps) {
  const { tokens } = useDesignSystem()
  
  const getVariantStyles = () => {
    switch (variant) {
      case 'default':
        return {
          backgroundColor: tokens.colors.primary[600],
          color: tokens.colors.text.inverse,
          borderColor: 'transparent',
        }
      case 'secondary':
        return {
          backgroundColor: tokens.colors.neutral[200],
          color: tokens.colors.neutral[800],
          borderColor: 'transparent',
        }
      case 'destructive':
        return {
          backgroundColor: '#ef4444',
          color: tokens.colors.text.inverse,
          borderColor: 'transparent',
        }
      case 'outline':
        return {
          backgroundColor: 'transparent',
          color: tokens.colors.text.primary,
          borderColor: tokens.colors.border.primary,
        }
      default:
        return {
          backgroundColor: tokens.colors.primary[600],
          color: tokens.colors.text.inverse,
          borderColor: 'transparent',
        }
    }
  }

  const dynamicStyles = getVariantStyles()
  const combinedStyle = { ...dynamicStyles, ...style }

  return (
    <div 
      className={cn(badgeVariants({ variant }), className)} 
      style={combinedStyle}
      {...props} 
    />
  )
}

export { Badge, badgeVariants }
