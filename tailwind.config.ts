import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        "nunito-sans": ["var(--font-nunito-sans)", "sans-serif"],
      },
      colors: {
        // App Brand Colors
        primaryColor: {
          DEFAULT: "#02FEFE",
          background: "#02FEFE0D",
          light: "#22FEFE26",
        },
        // Success Colors
        success: {
          DEFAULT: "#22C55E",
          light: "#4ADE80",
        },
        // Error Colors
        error: {
          DEFAULT: "#EF4444",
          light: "#F87171",
        },
        // Default Tailwind colors (keeping for compatibility)
        background: "var(--background)",
        foreground: "var(--foreground)",
        // Custom brand colors
        charcoal: {
          DEFAULT: "#282828",
          50: "#f7f7f7",
          100: "#e3e3e3",
          200: "#c8c8c8",
          300: "#a4a4a4",
          400: "#818181",
          500: "#666666",
          600: "#515151",
          700: "#434343",
          800: "#383838",
          900: "#282828",
          950: "#1a1a1a",
        },
        brand: {
          blue: "#2C2D8C",
          red: "#FC0202",
        },
        // Theme-aware colors
        primary: {
          DEFAULT: "var(--color-primary)",
          foreground: "var(--color-primary-foreground)",
        },
        secondary: {
          DEFAULT: "var(--color-secondary)",
          foreground: "var(--color-secondary-foreground)",
        },
        muted: {
          DEFAULT: "var(--color-muted)",
          foreground: "var(--color-muted-foreground)",
        },
        accent: {
          DEFAULT: "var(--color-accent)",
          foreground: "var(--color-accent-foreground)",
        },
        card: {
          DEFAULT: "var(--color-card)",
          foreground: "var(--color-card-foreground)",
        },
        border: {
          DEFAULT: "var(--color-border)",
        },
        input: "var(--color-input)",
        ring: "var(--color-ring)",
      },
    },
  },
  plugins: [],
};
export default config;
