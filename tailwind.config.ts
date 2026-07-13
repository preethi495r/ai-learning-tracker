import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      fontFamily: {
        sans: [
          "var(--font-geist-sans)",
          "ui-sans-serif",
          "system-ui",
          "-apple-system",
          "Segoe UI",
          "Roboto",
          "Helvetica Neue",
          "Arial",
          "sans-serif",
        ],
        mono: [
          "var(--font-geist-mono)",
          "ui-monospace",
          "SFMono-Regular",
          "Menlo",
          "monospace",
        ],
      },
      colors: {
        accent: {
          DEFAULT: "#4f46e5",
          fg: "#ffffff",
          soft: "#eef2ff",
        },
      },
      boxShadow: {
        // Crisp, layered elevation. The hairline top highlight keeps cards
        // from looking flat against the tinted canvas.
        card: "0 1px 2px rgba(15,23,42,0.05), 0 8px 24px -14px rgba(15,23,42,0.14)",
        lift: "0 2px 4px rgba(15,23,42,0.05), 0 18px 40px -18px rgba(15,23,42,0.28)",
      },
      transitionTimingFunction: {
        // Exponential ease-out — the "snappy" curve: fast start, soft landing.
        snap: "cubic-bezier(0.22, 1, 0.36, 1)",
      },
      keyframes: {
        "fade-up": {
          "0%": { opacity: "0", transform: "translateY(10px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        "fade-in": {
          "0%": { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },
      animation: {
        "fade-up": "fade-up 0.5s cubic-bezier(0.22, 1, 0.36, 1) both",
        "fade-in": "fade-in 0.5s ease-out both",
      },
    },
  },
  plugins: [],
};

export default config;
