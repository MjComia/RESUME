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
        mono: ["var(--font-jetbrains-mono)", "ui-monospace", "SFMono-Regular", "monospace"],
        sans: ["var(--font-inter)", "ui-sans-serif", "system-ui", "sans-serif"],
      },
      colors: {
        canvas: "rgb(var(--color-canvas) / <alpha-value>)",
        panel: "rgb(var(--color-panel) / <alpha-value>)",
        elevated: "rgb(var(--color-elevated) / <alpha-value>)",
        ink: "rgb(var(--color-ink) / <alpha-value>)",
        muted: "rgb(var(--color-muted) / <alpha-value>)",
        faint: "rgb(var(--color-faint) / <alpha-value>)",
        hairline: "rgb(var(--color-hairline) / <alpha-value>)",
        code: {
          DEFAULT: "rgb(var(--color-code) / <alpha-value>)",
          soft: "rgb(var(--color-code-soft) / <alpha-value>)",
        },
        data: {
          DEFAULT: "rgb(var(--color-data) / <alpha-value>)",
          soft: "rgb(var(--color-data-soft) / <alpha-value>)",
        },
      },
      borderRadius: {
        xs: "var(--radius-xs)",
        sm: "var(--radius-sm)",
        md: "var(--radius-md)",
        lg: "var(--radius-lg)",
      },
      spacing: {
        "grid-1": "var(--space-1)",
        "grid-2": "var(--space-2)",
        "grid-3": "var(--space-3)",
        "grid-4": "var(--space-4)",
        "grid-5": "var(--space-5)",
        "grid-6": "var(--space-6)",
        "grid-8": "var(--space-8)",
        "grid-10": "var(--space-10)",
        "grid-12": "var(--space-12)",
      },
    },
  },
  plugins: [],
};

export default config;

