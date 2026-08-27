/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hospital: {
          50: '#f0f9ff',
          100: '#e0f2fe',
          200: '#bae6fd',
          300: '#7dd3fc',
          400: '#38bdf8',
          500: '#0ea5e9',
          600: '#0284c7',
          700: '#0369a1',
          800: '#075985',
          900: '#0c4a6e',
        },
        apollo: {
          blue: '#0F4C81',
          teal: '#00A896',
          coral: '#EB5E55',
          amber: '#F4A261',
          navy: '#1D2D44',
          slate: '#3E5C76',
        }
      },
    },
  },
  plugins: [],
}
