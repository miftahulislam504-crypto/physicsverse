import type { Config } from "tailwindcss";

const config: Config = {
  darkMode: "class",
  content: [
    "./src/pages/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/components/**/*.{js,ts,jsx,tsx,mdx}",
    "./src/app/**/*.{js,ts,jsx,tsx,mdx}",
  ],
  theme: {
    extend: {
      // ─── PhysicsVerse Design Tokens ───────────────────────────────
      colors: {
        // Primary — Electric Blue (energy, motion, electricity)
        primary: {
          50:  "#eff8ff",
          100: "#dbeffe",
          200: "#b0deff",
          300: "#6dc7ff",
          400: "#22aaff",
          500: "#0090f0",  // ← Brand blue
          600: "#0071cc",
          700: "#005aa3",
          800: "#054d87",
          900: "#0a3f70",
          950: "#07284a",
        },
        // Accent — Quantum Violet (modern physics, mystery)
        accent: {
          50:  "#f3f0ff",
          100: "#e9e3ff",
          200: "#d5cbfe",
          300: "#b8a5fd",
          400: "#9775fa",
          500: "#7c4ef5",  // ← Brand violet
          600: "#6b30e8",
          700: "#5a22cc",
          800: "#4b1ea8",
          900: "#3e1a88",
          950: "#250f5c",
        },
        // Surface — Deep Space (background system)
        surface: {
          50:  "#f0f4f8",
          100: "#d9e2ec",
          200: "#bcccdc",
          300: "#9fb3c8",
          400: "#829ab1",
          500: "#627d98",
          600: "#486581",
          700: "#334e68",
          800: "#1f2d3d", // ← Dark card
          900: "#0d1b2a", // ← Dark bg
          950: "#060d14", // ← Darkest
        },
        // Semantic
        success: "#22c55e",
        warning: "#f59e0b",
        error:   "#ef4444",
        info:    "#0090f0",

        // Physics domain colors (used for zone badges)
        zone: {
          mechanics:    "#f97316", // orange
          electricity:  "#facc15", // yellow
          waves:        "#34d399", // teal
          optics:       "#60a5fa", // light blue
          thermal:      "#fb7185", // rose
          modern:       "#a78bfa", // purple
          space:        "#94a3b8", // slate
          quantum:      "#e879f9", // fuchsia
        },
      },

      fontFamily: {
        // Display — space/science feel
        display: ["var(--font-space-grotesk)", "system-ui", "sans-serif"],
        // Body — clean, readable
        body:    ["var(--font-inter)", "system-ui", "sans-serif"],
        // Bengali — Hind Siliguri works best for physics text
        bengali: ["var(--font-hind-siliguri)", "system-ui", "sans-serif"],
        // Math / Code
        mono:    ["var(--font-jetbrains-mono)", "Menlo", "monospace"],
      },

      fontSize: {
        "2xs": ["0.625rem", { lineHeight: "1rem" }],
        xs:   ["0.75rem",  { lineHeight: "1.125rem" }],
        sm:   ["0.875rem", { lineHeight: "1.375rem" }],
        base: ["1rem",     { lineHeight: "1.625rem" }],
        lg:   ["1.125rem", { lineHeight: "1.75rem" }],
        xl:   ["1.25rem",  { lineHeight: "1.875rem" }],
        "2xl":["1.5rem",   { lineHeight: "2rem" }],
        "3xl":["1.875rem", { lineHeight: "2.375rem" }],
        "4xl":["2.25rem",  { lineHeight: "2.75rem" }],
        "5xl":["3rem",     { lineHeight: "3.5rem" }],
        "6xl":["3.75rem",  { lineHeight: "4.25rem" }],
        "7xl":["4.5rem",   { lineHeight: "1.1" }],
      },

      spacing: {
        "4.5": "1.125rem",
        "13":  "3.25rem",
        "15":  "3.75rem",
        "18":  "4.5rem",
        "22":  "5.5rem",
        "26":  "6.5rem",
        "30":  "7.5rem",
      },

      borderRadius: {
        "4xl": "2rem",
        "5xl": "2.5rem",
      },

      boxShadow: {
        "glow-blue":   "0 0 20px rgba(0,144,240,0.35)",
        "glow-violet": "0 0 20px rgba(124,78,245,0.35)",
        "glow-white":  "0 0 15px rgba(255,255,255,0.1)",
        "card":        "0 1px 3px rgba(0,0,0,0.12), 0 1px 2px rgba(0,0,0,0.24)",
        "card-hover":  "0 10px 30px rgba(0,0,0,0.2), 0 4px 8px rgba(0,0,0,0.15)",
      },

      backgroundImage: {
        "physics-grid":
          "linear-gradient(rgba(0,144,240,0.06) 1px, transparent 1px), linear-gradient(90deg, rgba(0,144,240,0.06) 1px, transparent 1px)",
        "hero-glow":
          "radial-gradient(ellipse 80% 60% at 50% -10%, rgba(0,144,240,0.25), transparent)",
        "card-shine":
          "linear-gradient(135deg, rgba(255,255,255,0.05) 0%, transparent 50%)",
      },

      backgroundSize: {
        "grid-sm": "24px 24px",
        "grid-md": "40px 40px",
        "grid-lg": "60px 60px",
      },

      animation: {
        "float":       "float 6s ease-in-out infinite",
        "pulse-glow":  "pulseGlow 2s ease-in-out infinite",
        "spin-slow":   "spin 8s linear infinite",
        "orbit":       "orbit 12s linear infinite",
        "shimmer":     "shimmer 2s linear infinite",
        "fade-up":     "fadeUp 0.5s ease-out forwards",
        "fade-in":     "fadeIn 0.4s ease-out forwards",
      },

      keyframes: {
        float: {
          "0%, 100%": { transform: "translateY(0)" },
          "50%":      { transform: "translateY(-10px)" },
        },
        pulseGlow: {
          "0%, 100%": { boxShadow: "0 0 10px rgba(0,144,240,0.3)" },
          "50%":      { boxShadow: "0 0 25px rgba(0,144,240,0.6)" },
        },
        orbit: {
          "0%":   { transform: "rotate(0deg) translateX(60px) rotate(0deg)" },
          "100%": { transform: "rotate(360deg) translateX(60px) rotate(-360deg)" },
        },
        shimmer: {
          "0%":   { backgroundPosition: "-200% 0" },
          "100%": { backgroundPosition: "200% 0" },
        },
        fadeUp: {
          "0%":   { opacity: "0", transform: "translateY(16px)" },
          "100%": { opacity: "1", transform: "translateY(0)" },
        },
        fadeIn: {
          "0%":   { opacity: "0" },
          "100%": { opacity: "1" },
        },
      },

      transitionTimingFunction: {
        "spring": "cubic-bezier(0.34, 1.56, 0.64, 1)",
        "smooth": "cubic-bezier(0.4, 0, 0.2, 1)",
      },
    },
  },
  plugins: [],
};

export default config;
