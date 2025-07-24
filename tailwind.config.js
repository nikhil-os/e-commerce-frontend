/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    './app/**/*.{js,ts,jsx,tsx}',
    './pages/**/*.{js,ts,jsx,tsx}',
    './components/**/*.{js,ts,jsx,tsx}',
  ],
  theme: {
    extend: {
      keyframes: {
        'border-spin': {
          '0%': { transform: 'rotate(0deg) scaleX(1) scaleY(1)' },
          '100%': { transform: 'rotate(-90deg) scaleX(1.34) scaleY(0.77)' },
        },
      },
      animation: {
        'border-spin': 'border-spin 6s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
      },
    },
  },
  plugins: [],
} 