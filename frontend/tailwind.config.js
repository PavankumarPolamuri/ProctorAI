/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        navy: {
          950: '#050816',
          900: '#0B1026',
          850: '#101735',
          800: '#111936',
          750: '#151B3D',
          700: '#18181a',
          border: '#27325A',
        },
        violet: {
          50: '#f5f3ff',
          100: '#ede9fe',
          200: '#ddd6fe',
          300: '#c4b5fd',
          400: '#a78bfa',
          500: '#8b5cf6',
          600: '#7c3aed',
          700: '#6d28d9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        purple: {
          highlight: '#E879F9',
          electric: '#A855F7',
          soft: '#D8B4FE',
          light: '#C084FC',
        },
        brand: {
          50: '#f5f3ff',
          100: '#ede9fe',
          300: '#C084FC',
          400: '#A855F7',
          500: '#8B5CF6',
          600: '#7C3AED',
          700: '#6D28D9',
          800: '#5b21b6',
          900: '#4c1d95',
        },
        bg: {
          dark: '#050816',
          surface: '#0B1026',
          'surface-hover': '#151B3D',
        }
      },
      boxShadow: {
        'soft': '0 10px 40px -10px rgba(0,0,0,0.5)',
        'soft-lg': '0 20px 60px -15px rgba(0,0,0,0.7)',
        'glow-violet': '0 0 40px -10px rgba(139, 92, 246, 0.45)',
        'glow-purple': '0 0 40px -10px rgba(168, 85, 247, 0.4)',
        'glow-orange': '0 0 40px -10px rgba(139, 92, 246, 0.45)', // legacy alias mapped to violet for safety
        'glow-blue': '0 0 20px -5px rgba(59, 130, 246, 0.5)',
        'glow-green': '0 0 20px -5px rgba(16, 185, 129, 0.5)',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
