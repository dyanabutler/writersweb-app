// Design System Constants and Tokens
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

// Default design tokens
export const defaultDesignTokens: DesignTokens = {
  colors: {
    background: {
      primary: "#ffffff",
      secondary: "#f9fafb",
      tertiary: "#f3f4f6",
    },
    text: {
      primary: "#111827",
      secondary: "#374151",
      muted: "#6b7280",
      inverse: "#ffffff",
    },
    icons: {
      primary: "#374151",
      secondary: "#6b7280",
      muted: "#9ca3af",
      accent: "#3b82f6",
    },
    primary: {
      50: "#eff6ff",
      100: "#dbeafe",
      500: "#3b82f6",
      600: "#2563eb",
      700: "#1d4ed8",
      900: "#1e3a8a",
    },
    secondary: {
      50: "#f0fdf4",
      100: "#dcfce7",
      500: "#22c55e",
      600: "#16a34a",
      700: "#15803d",
    },
    status: {
      draft: {
        bg: "#fef3c7",
        text: "#92400e",
      },
      review: {
        bg: "#dbeafe",
        text: "#1e40af",
      },
      complete: {
        bg: "#d1fae5",
        text: "#065f46",
      },
      published: {
        bg: "#e9d5ff",
        text: "#7c3aed",
      },
    },
    characterStatus: {
      alive: {
        bg: "#d1fae5",
        text: "#065f46",
      },
      deceased: {
        bg: "#fee2e2",
        text: "#991b1b",
      },
      missing: {
        bg: "#fef3c7",
        text: "#92400e",
      },
      unknown: {
        bg: "#f3f4f6",
        text: "#374151",
      },
    },
    locationType: {
      city: {
        bg: "#dbeafe",
        text: "#1e40af",
      },
      building: {
        bg: "#d1fae5",
        text: "#065f46",
      },
      landmark: {
        bg: "#e9d5ff",
        text: "#7c3aed",
      },
      region: {
        bg: "#fed7aa",
        text: "#c2410c",
      },
      other: {
        bg: "#f3f4f6",
        text: "#374151",
      },
    },
    imageType: {
      character: {
        bg: "#dbeafe",
        text: "#1e40af",
      },
      location: {
        bg: "#d1fae5",
        text: "#065f46",
      },
      scene: {
        bg: "#e9d5ff",
        text: "#7c3aed",
      },
      reference: {
        bg: "#f3f4f6",
        text: "#374151",
      },
    },
    neutral: {
      50: "#f9fafb",
      100: "#f3f4f6",
      200: "#e5e7eb",
      300: "#d1d5db",
      400: "#9ca3af",
      500: "#6b7280",
      600: "#4b5563",
      700: "#374151",
      800: "#1f2937",
      900: "#111827",
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
