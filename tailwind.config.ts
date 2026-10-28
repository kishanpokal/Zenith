import type { Config } from "tailwindcss";

const config: Config = {
  content: [
    "./pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./components/**/*.{js,ts,jsx,tsx,mdx}",
    "./app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  darkMode: "class",
  theme: {
    extend: {
      colors: {
        background: {
          DEFAULT: "#080808",
          secondary: "#101010",
          tertiary: "#141414",
          card: "#0d0d0d",
          hover: "#181818",
        },
        surface: {
          border: "#1f1f1f",
          borderLight: "#2c2c2c",
          muted: "#181818",
        },
        primary: {
          DEFAULT: "#F5F5F2",
          muted: "#A0A09C",
          dim: "#6B7280",
        },
        accent: {
          DEFAULT: "#D7FF64",
          lime: "#D7FF64",
          glow: "rgba(215, 255, 100, 0.35)",
          cyan: "#38bdf8",
          dark: "#1e293b",
          muted: "rgba(215, 255, 100, 0.1)",
        },
        editor: {
          rec: "#FF3B30",
          trackV: "#1e3a5f",
          trackA: "#0f2b48",
          timecode: "#38bdf8",
        }
      },
      fontFamily: {
        outfit: [
          "var(--font-outfit)",
          "-apple-system",
          "sans-serif",
        ],
        display: [
          "var(--font-outfit)",
          "var(--font-display)",
          "-apple-system",
          "sans-serif",
        ],
        serif: [
          "var(--font-serif)",
          "Georgia",
          "serif",
        ],
        condensed: [
          "var(--font-condensed)",
          "Impact",
          "sans-serif",
        ],
        sans: [
          "var(--font-geist-sans)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        mono: [
          "var(--font-geist-mono)",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
      },
      letterSpacing: {
        tighter: "-0.04em",
        tight: "-0.02em",
        widest: "0.2em",
        ultra: "0.28em",
      },
      keyframes: {
        "pulse-record": {
          "0%, 100%": { opacity: "1" },
          "50%": { opacity: "0.2" },
        },
        "waveform": {
          "0%, 100%": { height: "20%" },
          "50%": { height: "95%" },
        },
      },
      animation: {
        "record": "pulse-record 1.5s cubic-bezier(0.4, 0, 0.6, 1) infinite",
      },
    },
  },
  plugins: [],
};
export default config;
