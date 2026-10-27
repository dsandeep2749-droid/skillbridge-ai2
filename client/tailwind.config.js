/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class',
  theme: {
    extend: {
      colors: {
        background: '#0B1020',
        card: '#11182B',
        'card-hover': '#162038',
        'card-border': '#1E293B',
        primary: {
          DEFAULT: '#7C5CFC',
          hover: '#6845EE',
          light: '#9B82FD',
        },
        cyan: {
          DEFAULT: '#38BDF8',
          glow: '#0EA5E9',
        },
        accent: {
          violet: '#8B5CF6',
          blue: '#3B82F6',
          teal: '#14B8A6',
          rose: '#F43F5E',
          amber: '#F59E0B',
          emerald: '#10B981',
        },
        muted: {
          DEFAULT: '#94A3B8',
          foreground: '#64748B',
        },
        foreground: '#F8FAFC',
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', '-apple-system', 'sans-serif'],
      },
      boxShadow: {
        'glow-primary': '0 0 25px -5px rgba(124, 92, 252, 0.3)',
        'glow-cyan': '0 0 25px -5px rgba(56, 189, 248, 0.3)',
        'card': '0 4px 20px -2px rgba(0, 0, 0, 0.5)',
      },
      animation: {
        'pulse-slow': 'pulse 4s cubic-bezier(0.4, 0, 0.6, 1) infinite',
      }
    },
  },
  plugins: [],
}
