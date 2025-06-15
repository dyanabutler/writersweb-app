// Design System Tokens and Types
export interface DesignTokens {
  colors: {
    // App-wide colors
    background: {
      primary: string
      secondary: string
      tertiary: string
    }
    text: {
      primary: string
      secondary: string
      muted: string
      inverse: string
    }
    // Border colors
    border: {
      primary: string
      secondary: string
      muted: string
    }
    // Icon colors
    icons: {
      primary: string
      secondary: string
      muted: string
      accent: string
    }
    // Primary brand colors
    primary: {
      50: string
      100: string
      500: string
      600: string
      700: string
      900: string
    }
    // Secondary colors
    secondary: {
      50: string
      100: string
      500: string
      600: string
      700: string
    }
    // Status colors
    status: {
      draft: {
        bg: string
        text: string
      }
      review: {
        bg: string
        text: string
      }
      complete: {
        bg: string
        text: string
      }
      published: {
        bg: string
        text: string
      }
    }
    // Character status colors
    characterStatus: {
      alive: {
        bg: string
        text: string
      }
      deceased: {
        bg: string
        text: string
      }
      missing: {
        bg: string
        text: string
      }
      unknown: {
        bg: string
        text: string
      }
    }
    // Location type colors
    locationType: {
      city: {
        bg: string
        text: string
      }
      building: {
        bg: string
        text: string
      }
      landmark: {
        bg: string
        text: string
      }
      region: {
        bg: string
        text: string
      }
      other: {
        bg: string
        text: string
      }
    }
    // Image type colors
    imageType: {
      character: {
        bg: string
        text: string
      }
      location: {
        bg: string
        text: string
      }
      scene: {
        bg: string
        text: string
      }
      reference: {
        bg: string
        text: string
      }
    }
    // Neutral colors
    neutral: {
      50: string
      100: string
      200: string
      300: string
      400: string
      500: string
      600: string
      700: string
      800: string
      900: string
    }
  }
  spacing: {
    xs: string
    sm: string
    md: string
    lg: string
    xl: string
    "2xl": string
    "3xl": string
  }
  borderRadius: {
    sm: string
    md: string
    lg: string
    xl: string
  }
  typography: {
    fontFamily: {
      sans: string
      mono: string
    }
    fontSize: {
      xs: string
      sm: string
      base: string
      lg: string
      xl: string
      "2xl": string
      "3xl": string
    }
  }
}

// Default design tokens - Obsidian theme
export const defaultDesignTokens: DesignTokens = {
  colors: {
    background: {
      primary: "#0a0a0a", // Deep obsidian black
      secondary: "#1a1a1a", // Dark charcoal
      tertiary: "#2a2a2a", // Medium charcoal
    },
    text: {
      primary: "#f8f9fa", // Bright white
      secondary: "#e9ecef", // Off white
      muted: "#adb5bd", // Light gray
      inverse: "#0a0a0a", // Deep black
    },
    border: {
      primary: "#495057", // Medium dark gray
      secondary: "#6c757d", // Medium gray  
      muted: "#343a40", // Darker gray
    },
    icons: {
      primary: "#e9ecef", // Off white
      secondary: "#adb5bd", // Light gray
      muted: "#6c757d", // Medium gray
      accent: "#7c3aed", // Bright purple accent
    },
    primary: {
      50: "#f3f0ff", // Very light purple
      100: "#e0d7ff", // Light purple
      500: "#7c3aed", // Bright purple
      600: "#6d28d9", // Deep purple
      700: "#5b21b6", // Darker purple
      900: "#3b0764", // Very dark purple
    },
    secondary: {
      50: "#ecfdf5", // Light mint
      100: "#d1fae5", // Mint
      500: "#10b981", // Emerald
      600: "#059669", // Deep emerald
      700: "#047857", // Dark emerald
    },
    status: {
      draft: {
        bg: "#fbbf24", // Amber
        text: "#0a0a0a", // Dark text for contrast
      },
      review: {
        bg: "#3b82f6", // Blue
        text: "#ffffff", // White text
      },
      complete: {
        bg: "#10b981", // Emerald
        text: "#ffffff", // White text
      },
      published: {
        bg: "#7c3aed", // Purple
        text: "#ffffff", // White text
      },
    },
    characterStatus: {
      alive: {
        bg: "#10b981", // Emerald
        text: "#ffffff", // White text
      },
      deceased: {
        bg: "#ef4444", // Red
        text: "#ffffff", // White text
      },
      missing: {
        bg: "#f59e0b", // Orange
        text: "#0a0a0a", // Dark text
      },
      unknown: {
        bg: "#6c757d", // Gray
        text: "#ffffff", // White text
      },
    },
    locationType: {
      city: {
        bg: "#3b82f6", // Blue
        text: "#ffffff", // White text
      },
      building: {
        bg: "#10b981", // Emerald
        text: "#ffffff", // White text
      },
      landmark: {
        bg: "#7c3aed", // Purple
        text: "#ffffff", // White text
      },
      region: {
        bg: "#f59e0b", // Orange
        text: "#0a0a0a", // Dark text
      },
      other: {
        bg: "#6c757d", // Gray
        text: "#ffffff", // White text
      },
    },
    imageType: {
      character: {
        bg: "#3b82f6", // Blue
        text: "#ffffff", // White text
      },
      location: {
        bg: "#10b981", // Emerald
        text: "#ffffff", // White text
      },
      scene: {
        bg: "#7c3aed", // Purple
        text: "#ffffff", // White text
      },
      reference: {
        bg: "#6c757d", // Gray
        text: "#ffffff", // White text
      },
    },
    neutral: {
      50: "#f8f9fa", // Nearly white
      100: "#e9ecef", // Light gray
      200: "#dee2e6", // Medium light gray
      300: "#ced4da", // Medium gray
      400: "#adb5bd", // Gray
      500: "#6c757d", // Medium dark gray
      600: "#495057", // Dark gray
      700: "#343a40", // Darker gray
      800: "#212529", // Very dark gray
      900: "#0a0a0a", // Black
    },
  },
  spacing: {
    xs: "0.5rem",
    sm: "0.75rem",
    md: "1rem",
    lg: "1.5rem",
    xl: "2rem",
    "2xl": "3rem",
    "3xl": "4rem",
  },
  borderRadius: {
    sm: "0.25rem",
    md: "0.375rem",
    lg: "0.5rem",
    xl: "0.75rem",
  },
  typography: {
    fontFamily: {
      sans: "Inter, system-ui, sans-serif",
      mono: "JetBrains Mono, monospace",
    },
    fontSize: {
      xs: "0.75rem",
      sm: "0.875rem",
      base: "1rem",
      lg: "1.125rem",
      xl: "1.25rem",
      "2xl": "1.5rem",
      "3xl": "1.875rem",
    },
  },
}

// Design system utilities
export const getStatusColor = (status: string, tokens: DesignTokens) => {
  const statusKey = status as keyof typeof tokens.colors.status
  return tokens.colors.status[statusKey] || tokens.colors.status.draft
}

export const getCharacterStatusColor = (status: string, tokens: DesignTokens) => {
  const statusKey = status as keyof typeof tokens.colors.characterStatus
  return tokens.colors.characterStatus[statusKey] || tokens.colors.characterStatus.unknown
}

export const getLocationTypeColor = (type: string, tokens: DesignTokens) => {
  const typeKey = type as keyof typeof tokens.colors.locationType
  return tokens.colors.locationType[typeKey] || tokens.colors.locationType.other
}

export const getImageTypeColor = (type: string, tokens: DesignTokens) => {
  const typeKey = type as keyof typeof tokens.colors.imageType
  return tokens.colors.imageType[typeKey] || tokens.colors.imageType.reference
} 