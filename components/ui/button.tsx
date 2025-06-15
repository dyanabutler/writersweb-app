"use client"

import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"
import { useDesignSystem } from "@/components/design-system"
import { Loader2 } from "lucide-react"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap font-medium transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg]:shrink-0 relative overflow-hidden border-[0.5px] shadow-[4px_4px_0px_0px_rgba(0,0,0,0.25)] hover:shadow-[2px_2px_0px_0px_rgba(0,0,0,0.25)] hover:translate-x-[2px] hover:translate-y-[2px] active:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.25)] active:translate-x-[3px] active:translate-y-[3px] hover:[background-color:var(--hover-bg,_var(--bg))]",
  {
    variants: {
      variant: {
        // Primary variants - colors applied via dynamic styles
        primary: "",
        "primary-outline": "bg-transparent",
        "primary-ghost": "bg-transparent border-transparent hover:bg-opacity-10",
        "primary-soft": "",
        
        // Neutral variants - colors applied via dynamic styles
        neutral: "",
        "neutral-outline": "bg-transparent",
        "neutral-ghost": "bg-transparent border-transparent hover:bg-opacity-10",
        "neutral-soft": "",
        
        // Status variants - colors applied via dynamic styles
        success: "",
        "success-outline": "bg-transparent",
        "success-ghost": "bg-transparent border-transparent hover:bg-opacity-10",
        
        warning: "",
        "warning-outline": "bg-transparent",
        "warning-ghost": "bg-transparent border-transparent hover:bg-opacity-10",
        
        danger: "",
        "danger-outline": "bg-transparent",
        "danger-ghost": "bg-transparent border-transparent hover:bg-opacity-10",
        
        // Special variants
        gradient: "",
        glass: "backdrop-blur-md",
        link: "underline-offset-4 hover:underline border-transparent shadow-none hover:shadow-none hover:translate-x-0 hover:translate-y-0 active:translate-x-0 active:translate-y-0",
        minimal: "border-transparent shadow-[2px_2px_0px_0px_rgba(0,0,0,0.1)] hover:shadow-[1px_1px_0px_0px_rgba(0,0,0,0.1)]",
      },
      size: {
        xs: "h-7 px-2 text-xs rounded-sm [&_svg]:size-3",
        sm: "h-8 px-3 text-sm rounded-sm [&_svg]:size-3.5",
        default: "h-10 px-4 text-sm rounded [&_svg]:size-4",
        lg: "h-12 px-6 text-base rounded [&_svg]:size-5",
        xl: "h-14 px-8 text-lg rounded-md [&_svg]:size-6",
        icon: "h-10 w-10 rounded [&_svg]:size-4",
        "icon-sm": "h-8 w-8 rounded-sm [&_svg]:size-3.5",
        "icon-lg": "h-12 w-12 rounded [&_svg]:size-5",
        "icon-xl": "h-14 w-14 rounded-md [&_svg]:size-6",
      },
      fullWidth: {
        true: "w-full",
        false: "",
      },
      rounded: {
        none: "rounded-none",
        sm: "rounded-sm",
        default: "", // Uses variant default
        lg: "rounded-lg",
        xl: "rounded-xl",
        full: "rounded-full",
      },
    },
    defaultVariants: {
      variant: "primary",
      size: "default",
      fullWidth: false,
      rounded: "default",
    },
  }
)

export interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean
  loading?: boolean
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  loadingText?: string
}

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ 
    className, 
    variant, 
    size, 
    fullWidth,
    rounded,
    asChild = false, 
    loading = false,
    leftIcon,
    rightIcon,
    loadingText,
    children,
    disabled,
    style,
    ...props 
  }, ref) => {
    const { tokens } = useDesignSystem()
    const Comp = asChild ? Slot : "button"
    
    // Generate dynamic styles based on design tokens
    const getVariantStyles = () => {
      const baseColors = {
        primary: {
          bg: tokens.colors.primary[600],
          bgHover: tokens.colors.primary[700],
          bgActive: tokens.colors.primary[900],
          bgSoft: tokens.colors.primary[100],
          text: tokens.colors.text.inverse,
          textSoft: tokens.colors.primary[900],
          border: tokens.colors.primary[600],
          borderSoft: tokens.colors.primary[100],
        },
        neutral: {
          bg: tokens.colors.neutral[600],
          bgHover: tokens.colors.neutral[700],
          bgActive: tokens.colors.neutral[900],
          bgSoft: tokens.colors.neutral[200],
          text: tokens.colors.text.inverse,
          textSoft: tokens.colors.neutral[900],
          border: tokens.colors.neutral[600],
          borderSoft: tokens.colors.neutral[300],
        },
        success: {
          bg: "#10b981",
          bgHover: "#059669",
          bgActive: "#047857",
          bgSoft: "#d1fae5",
          text: tokens.colors.text.inverse,
          textSoft: "#047857",
          border: "#10b981",
          borderSoft: "#6ee7b7",
        },
        warning: {
          bg: "#f59e0b",
          bgHover: "#d97706",
          bgActive: "#b45309",
          bgSoft: "#fef3c7",
          text: tokens.colors.text.inverse,
          textSoft: "#b45309",
          border: "#f59e0b",
          borderSoft: "#fbbf24",
        },
        danger: {
          bg: "#ef4444",
          bgHover: "#dc2626",
          bgActive: "#b91c1c",
          bgSoft: "#fee2e2",
          text: tokens.colors.text.inverse,
          textSoft: "#b91c1c",
          border: "#ef4444",
          borderSoft: "#f87171",
        },
      }

      const variantKey = variant?.split('-')[0] as keyof typeof baseColors
      const variantType = variant?.split('-')[1] || 'solid'
      const colors = baseColors[variantKey] || baseColors.primary

      switch (variant) {
        // Primary variants
        case 'primary':
          return {
            backgroundColor: colors.bg,
            color: colors.text,
            borderColor: colors.border,
            '--bg': colors.bg,
            '--hover-bg': colors.bgHover,
          } as React.CSSProperties
        case 'primary-outline':
          return {
            backgroundColor: 'transparent',
            color: colors.bg,
            borderColor: colors.border,
          }
        case 'primary-ghost':
          return {
            backgroundColor: 'transparent',
            color: colors.bg,
            borderColor: 'transparent',
          }
                         case 'primary-soft':
          return {
            backgroundColor: colors.bgSoft,
            color: colors.textSoft,
            borderColor: colors.borderSoft,
          }



        // Neutral variants
        case 'neutral':
          return {
            backgroundColor: colors.bg,
            color: colors.text,
            borderColor: colors.border,
            '--bg': colors.bg,
            '--hover-bg': colors.bgHover,
          } as React.CSSProperties
        case 'neutral-outline':
          return {
            backgroundColor: 'transparent',
            color: colors.bg,
            borderColor: colors.border,
          }
        case 'neutral-ghost':
          return {
            backgroundColor: 'transparent',
            color: colors.bg,
            borderColor: 'transparent',
          }
                         case 'neutral-soft':
          return {
            backgroundColor: colors.bgSoft,
            color: colors.textSoft,
            borderColor: colors.borderSoft,
          }

        // Status variants
        case 'success':
        case 'warning':
        case 'danger':
          return {
            backgroundColor: colors.bg,
            color: colors.text,
            borderColor: colors.border,
            '--bg': colors.bg,
            '--hover-bg': colors.bgHover,
          } as React.CSSProperties
        case 'success-outline':
        case 'warning-outline':
        case 'danger-outline':
          return {
            backgroundColor: 'transparent',
            color: colors.bg,
            borderColor: colors.border,
          }
        case 'success-ghost':
        case 'warning-ghost':
        case 'danger-ghost':
          return {
            backgroundColor: 'transparent',
            color: colors.bg,
            borderColor: 'transparent',
          }

        // Special variants
        case 'gradient':
          return {
            background: `linear-gradient(135deg, ${tokens.colors.primary[600]} 0%, ${tokens.colors.neutral[600]} 100%)`,
            color: tokens.colors.text.inverse,
            borderColor: 'transparent',
          }
        case 'glass':
          return {
            backgroundColor: `${tokens.colors.background.secondary}80`,
            color: tokens.colors.text.primary,
            borderColor: tokens.colors.border.primary,
            backdropFilter: 'blur(12px)',
          }
        case 'link':
          return {
            backgroundColor: 'transparent',
            color: tokens.colors.primary[600],
            borderColor: 'transparent',
          }
        case 'minimal':
          return {
            backgroundColor: tokens.colors.background.tertiary,
            color: tokens.colors.text.primary,
            borderColor: 'transparent',
          }

        default:
          return {
            backgroundColor: colors.bg,
            color: colors.text,
            borderColor: colors.border,
          }
      }
    }

    const dynamicStyles = getVariantStyles()
    const combinedStyle = { ...dynamicStyles, ...style }

    const isDisabled = disabled || loading

    // When asChild is true, we need to render only the children to avoid React.Children.only error
    if (asChild) {
      return (
        <Comp
          className={cn(buttonVariants({ variant, size, fullWidth, rounded, className }))}
          ref={ref}
          style={combinedStyle}
          {...props}
        >
          {children}
        </Comp>
      )
    }

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, fullWidth, rounded, className }))}
        ref={ref}
        disabled={isDisabled}
        style={combinedStyle}
        {...props}
      >
        {loading && (
          <Loader2 className="animate-spin" />
        )}
        {!loading && leftIcon && leftIcon}
        {loading ? (loadingText || "Loading...") : children}
        {!loading && rightIcon && rightIcon}
      </Comp>
    )
  }
)
Button.displayName = "Button"

export { Button, buttonVariants }
