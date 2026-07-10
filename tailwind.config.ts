import type { Config } from "tailwindcss";

const config: Config = {
  content: ["./src/**/*.{ts,tsx}"],
  theme: {
    extend: {
      colors: {
        accent: {
          DEFAULT: "#4f46e5",
          fg: "#ffffff",
          soft: "#eef2ff",
        },
      },
    },
  },
  plugins: [],
};

export default config;
