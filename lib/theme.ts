/**
 * Potluck Theme Configuration
 * A warm, natural theme inspired by linen, cast iron, and dark wood
 */

export const theme = {
  colors: {
    // Warm linen-inspired backgrounds
    linen: {
      50: "#FAF8F5",   // Lightest linen
      100: "#F5F1EA",  // Light linen
      200: "#EDE6DA",  // Soft linen
      300: "#E3D9C8",  // Medium linen
      400: "#D7C9B3",  // Warm linen
      500: "#C8B59E",  // Deep linen
      600: "#B39F88",  // Darker linen
    },
    
    // Cast iron grays
    iron: {
      50: "#F7F7F6",   // Lightest gray
      100: "#E8E7E5",  // Light gray
      200: "#D1CFCC",  // Soft gray
      300: "#A8A5A0",  // Medium gray
      400: "#7F7B74",  // Neutral gray
      500: "#5C5953",  // Cast iron
      600: "#3D3B37",  // Dark iron
      700: "#2B2925",  // Darker iron
      800: "#1F1E1B",  // Very dark iron
      900: "#141311",  // Almost black
    },
    
    // Dark woodsy accents
    wood: {
      50: "#F8F6F4",   // Lightest wood
      100: "#EDE8E3",  // Light birch
      200: "#D9CFC4",  // Light oak
      300: "#BCA595",  // Medium oak
      400: "#9F7B66",  // Warm walnut
      500: "#7A5843",  // Dark walnut
      600: "#5C4232",  // Dark mahogany
      700: "#4A3428",  // Darker wood
      800: "#362518",  // Very dark wood
      900: "#241810",  // Ebony
    },
    
    // Accent colors (herbs and vegetables)
    sage: {
      50: "#F6F8F5",
      100: "#E8EDDF",
      200: "#D4DCC5",
      300: "#B8C5A3",
      400: "#9CAE81",
      500: "#7E9261",  // Primary sage
      600: "#647549",
      700: "#4D5A38",
    },
    
    tomato: {
      50: "#FDF5F4",
      100: "#FAE8E5",
      200: "#F4C9C2",
      300: "#E89B8F",
      400: "#DC6D5C",
      500: "#C94A3B",  // Primary tomato
      600: "#A63829",
      700: "#832C20",
    },
    
    butter: {
      50: "#FFFDF7",
      100: "#FFF9E6",
      200: "#FFF2C7",
      300: "#FFE599",
      400: "#FFD666",
      500: "#FFC533",  // Primary butter
      600: "#E6A714",
      700: "#B38410",
    },
  },
  
  // Semantic color mappings
  semantic: {
    // Backgrounds
    background: {
      primary: "var(--linen-50)",
      secondary: "var(--linen-100)",
      tertiary: "var(--linen-200)",
      paper: "white",
      overlay: "rgba(31, 30, 27, 0.5)", // iron-800 with opacity
    },
    
    // Text colors
    text: {
      primary: "var(--iron-900)",
      secondary: "var(--iron-700)",
      tertiary: "var(--iron-600)",
      muted: "var(--iron-500)",
      inverse: "var(--linen-50)",
    },
    
    // Borders
    border: {
      light: "var(--linen-300)",
      default: "var(--linen-400)",
      dark: "var(--iron-300)",
    },
    
    // Interactive elements
    primary: {
      default: "var(--wood-500)",
      hover: "var(--wood-600)",
      active: "var(--wood-700)",
      disabled: "var(--wood-300)",
    },
    
    secondary: {
      default: "var(--sage-500)",
      hover: "var(--sage-600)",
      active: "var(--sage-700)",
      disabled: "var(--sage-300)",
    },
    
    // Status colors
    success: "var(--sage-500)",
    warning: "var(--butter-500)",
    error: "var(--tomato-500)",
    info: "var(--iron-500)",
  },
  
  // Typography
  typography: {
    fontFamily: {
      sans: ["Inter", "system-ui", "-apple-system", "sans-serif"],
      serif: ["Crimson Text", "Georgia", "serif"],
      mono: ["JetBrains Mono", "Consolas", "monospace"],
    },
    fontSize: {
      xs: "0.75rem",     // 12px
      sm: "0.875rem",    // 14px
      base: "1rem",      // 16px
      lg: "1.125rem",    // 18px
      xl: "1.25rem",     // 20px
      "2xl": "1.5rem",   // 24px
      "3xl": "1.875rem", // 30px
      "4xl": "2.25rem",  // 36px
      "5xl": "3rem",     // 48px
    },
  },
  
  // Spacing
  spacing: {
    xs: "0.25rem",  // 4px
    sm: "0.5rem",   // 8px
    md: "1rem",     // 16px
    lg: "1.5rem",   // 24px
    xl: "2rem",     // 32px
    "2xl": "3rem",  // 48px
    "3xl": "4rem",  // 64px
  },
  
  // Border radius
  borderRadius: {
    none: "0",
    sm: "0.25rem",    // 4px
    default: "0.5rem", // 8px
    md: "0.75rem",    // 12px
    lg: "1rem",       // 16px
    xl: "1.5rem",     // 24px
    full: "9999px",
  },
  
  // Shadows
  shadows: {
    sm: "0 1px 2px 0 rgba(31, 30, 27, 0.05)",
    default: "0 1px 3px 0 rgba(31, 30, 27, 0.1), 0 1px 2px 0 rgba(31, 30, 27, 0.06)",
    md: "0 4px 6px -1px rgba(31, 30, 27, 0.1), 0 2px 4px -1px rgba(31, 30, 27, 0.06)",
    lg: "0 10px 15px -3px rgba(31, 30, 27, 0.1), 0 4px 6px -2px rgba(31, 30, 27, 0.05)",
    xl: "0 20px 25px -5px rgba(31, 30, 27, 0.1), 0 10px 10px -5px rgba(31, 30, 27, 0.04)",
  },
  
  // Transitions
  transitions: {
    fast: "150ms ease-in-out",
    default: "250ms ease-in-out",
    slow: "350ms ease-in-out",
  },
};

// Helper function to generate CSS custom properties
export function generateCSSVariables() {
  const cssVars: string[] = [];
  
  // Generate color variables
  Object.entries(theme.colors).forEach(([colorName, shades]) => {
    Object.entries(shades).forEach(([shade, value]) => {
      cssVars.push(`--${colorName}-${shade}: ${value};`);
    });
  });
  
  return cssVars.join('\n  ');
}

// Export individual color palettes for easier access
export const { linen, iron, wood, sage, tomato, butter } = theme.colors;