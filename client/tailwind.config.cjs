/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: {
          50: '#f5f8ff',
          100: '#e6f0ff',
          500: '#4f46e5',
          700: '#3730a3'
        },
        accent: '#06b6d4',
        glass: 'rgba(255,255,255,0.08)'
      },
      fontFamily: {
        sans: ['Poppins', 'Inter', 'ui-sans-serif', 'system-ui']
      },
      backgroundImage: {
        'hero-gradient': 'linear-gradient(90deg, #6366f1 0%, #06b6d4 100%)'
      },
    },
  },
  plugins: [],
}
