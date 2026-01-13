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
          dark: '#000000', // Pure Black
          bg: '#0a0a0a', // Very Dark Gray (almost black)
          green: '#ffffff', // Primary Text (White)
          white: '#ffffff',
          'btn-start': '#22D3EE', // Cyan-400
          'btn-end': '#10B981', // Emerald-500
          'btn-hover': '#06B6D4', // Cyan-500
          light: '#e0e0e0', // Soft Light Text
        }
      },
      fontFamily: {
        sans: ['Helvetica', 'Arial', 'sans-serif'],
        heading: ['Montserrat', 'system-ui', 'sans-serif'],
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
