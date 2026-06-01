/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["Roboto", "Arial", "sans-serif"],
      },
      colors: {
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        primary: {
          DEFAULT: "hsl(var(--primary))",
          foreground: "hsl(var(--primary-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        /* Figma design system tokens */
        fig: {
          primary: "var(--fig-primary)",
          "primary-hover": "var(--fig-primary-hover)",
          "primary-light": "var(--fig-primary-light)",
          text: "var(--fig-text)",
          "text-muted": "var(--fig-text-muted)",
          "text-dark": "var(--fig-text-dark)",
          surface: "var(--fig-surface)",
          "surface-card": "var(--fig-surface-card)",
          "surface-hover": "var(--fig-surface-hover)",
          border: "var(--fig-border)",
          "border-medium": "var(--fig-border-medium)",
          danger: "var(--fig-danger)",
          "danger-bg": "var(--fig-danger-bg)",
          success: "var(--fig-success)",
          "success-bg": "var(--fig-success-bg)",
          warning: "var(--fig-warning)",
          "warning-bg": "var(--fig-warning-bg)",
          info: "var(--fig-info)",
          "info-bg": "var(--fig-info-bg)",
        },
      },
      borderRadius: {
        "fig-sm": "var(--fig-radius-sm)",
        "fig-md": "var(--fig-radius-md)",
        "fig-lg": "var(--fig-radius-lg)",
        "fig-xl": "var(--fig-radius-xl)",
        "fig-pill": "var(--fig-radius-pill)",
      },
      boxShadow: {
        "fig-sm": "var(--fig-shadow-sm)",
        "fig-md": "var(--fig-shadow-md)",
        "fig-lg": "var(--fig-shadow-lg)",
      },
    },
  },
  plugins: [],
};
