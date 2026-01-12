/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        candy: {
          dark: '#0F1021', // Deep Void (n8n specific dark)
          bg: '#1A1D2D', // Panel Color
          green: '#ffffff', // Primary Text (White)
          white: '#ffffff',
          'btn-start': '#FF6D5A', // Orange
          'btn-end': '#904BCE', // Purple
          'btn-hover': '#FF8F7D',
          light: '#e0e0e0', // Soft Light Text
        }
      },
      fontFamily: {
        sans: ['Inter', 'system-ui', 'sans-serif'],
        mono: ['Fira Code', 'monospace'],
      },
      animation: {
        'shimmer': 'shimmer 2s linear infinite',
      },
      keyframes: {
        shimmer: {
          '0%': { transform: 'translateX(-100%)' },
          '100%': { transform: 'translateX(100%)' },
        }
      }
    },
  },
  plugins: [],
}
