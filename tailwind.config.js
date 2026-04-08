/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        dark: {
          bg: '#0f172a', // slate-900
          card: '#1e293b', // slate-800
          border: '#334155' // slate-700
        },
        brand: {
          DEFAULT: '#93C572', // Pistachio green
          hover: '#81b65f'
        }
      },
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      }
    },
  },
  plugins: [],
}
