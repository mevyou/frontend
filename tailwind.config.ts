import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      fontFamily: {
        "nunito-sans": ["var(--font-nunito-sans)", "sans-serif"],
      },
      colors: {
        // App Brand Colors
        primary: {
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
      },
    },
  },
  plugins: [],
};
export default config;
