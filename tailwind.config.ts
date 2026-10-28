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
          DEFAULT: "#09090B",
          primary: "#09090B",
          secondary: "#0E0E12",
          tertiary: "#121216",
          card: "#121216",
          elevated: "#16161B",
          hover: "#18181E",
        },
        surface: {
          DEFAULT: "#121216",
          border: "rgba(255, 255, 255, 0.07)",
          borderLight: "rgba(255, 255, 255, 0.12)",
          muted: "#16161C",
        },
        primary: {
          DEFAULT: "#F4F4F6",
          muted: "#8E8E93",
          dim: "#52525B",
        },
        accent: {
          DEFAULT: "#D4AF37",
          gold: "#D4AF37",
          amber: "#F59E0B",
          alabaster: "#F4F4F6",
          glow: "rgba(212, 175, 55, 0.25)",
          muted: "rgba(212, 175, 55, 0.08)",
        },
        editor: {
          rec: "#EF4444",
          trackV: "#1E1E26",
          trackA: "#16161E",
          timecode: "#D4AF37",
        },
      },
      fontFamily: {
        sans: [
          "var(--font-sans)",
          "-apple-system",
          "BlinkMacSystemFont",
          "Segoe UI",
          "Roboto",
          "sans-serif",
        ],
        display: [
          "var(--font-display)",
          "var(--font-sans)",
          "-apple-system",
          "sans-serif",
        ],
        mono: [
          "var(--font-mono)",
          "SFMono-Regular",
          "Menlo",
          "Monaco",
          "Consolas",
          "monospace",
        ],
        serif: [
          "var(--font-serif)",
          "Georgia",
          "serif",
        ],
        // Aliases for compatibility
        outfit: ["var(--font-display)", "sans-serif"],
        condensed: ["var(--font-display)", "sans-serif"],
      },
      letterSpacing: {
        tighter: "-0.04em",
        tight: "-0.02em",
        normal: "0em",
        wide: "0.05em",
        widest: "0.15em",
        ultra: "0.25em",
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
        "pulse-record": "pulse-record 2s cubic-bezier(0.4, 0, 0.6, 1) infinite",
        waveform: "waveform 1.2s ease-in-out infinite",
      },
      borderWidth: {
        hairline: "1px",
      },
    },
  },
  plugins: [],
};
export default config;
