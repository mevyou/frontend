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
        // App specific colors
        sidebar: "#121214", // Sidebar and header background
        "main-layout": "#242429", // Main layout background
        "search-input": "#242429", // Search bar input
        "news-ticker-bg": "#242429", // News ticker background
        "news-ticker-border": "#363636", // News ticker border
        "selected-state": "#1A1A1E", // Selected state in sidebar
        "create-bet-border": "#02FEFE80", // Create bet border
        "create-bet-fill": "#02FEFE1A", // Create bet fill
        // CSS variables
        background: "var(--background)",
        foreground: "var(--foreground)",
      },
    },
  },
  plugins: [],
};
export default config;
