/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        // ── White & Purple Design System ──
        primary: {
          50:  '#F5F3FF',
          100: '#EDE9FE',
          200: '#DDD6FE',
          300: '#C4B5FD',
          400: '#A78BFA',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5B21B6',
          900: '#4C1D95',
        },
        surface: {
          DEFAULT: '#FFFFFF',
          secondary: '#F7F8FC',
          hover: '#F1F0FB',
          border: '#E5E7EB',
        },
        navy: {
          DEFAULT: '#111827',
          light: '#1F2937',
          muted: '#64748B',
        },
        // Legacy aliases for backward-compat (kept for any missed references)
        bg: {
          dark: '#F7F8FC',
          surface: '#FFFFFF',
          'surface-hover': '#F1F0FB',
        },
      },
      boxShadow: {
        'card': '0 1px 3px rgba(0,0,0,0.06), 0 1px 2px rgba(0,0,0,0.04)',
        'card-hover': '0 10px 25px -5px rgba(0,0,0,0.08), 0 4px 10px -5px rgba(0,0,0,0.04)',
        'card-lg': '0 10px 40px -10px rgba(0,0,0,0.1)',
        'purple-glow': '0 0 20px -5px rgba(124, 58, 237, 0.25)',
        'purple-glow-lg': '0 0 35px -5px rgba(124, 58, 237, 0.35)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      },
    },
  },
  plugins: [],
}
