/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      fontFamily: {
        sans: ['Figtree', 'Plus Jakarta Sans', 'system-ui', '-apple-system', 'sans-serif'],
        mono: ['JetBrains Mono', 'monospace'],
      },
      colors: {
        'apollo-ink': '#002d39',
        'apollo-blue': '#007c9d',
        'apollo-blue-soft': '#def4fa',
        'apollo-orange': '#f58320',
        'apollo-yellow': '#fcd34d',
        'apollo-cream': '#fff8e6',
        'apollo-sky-soft': '#e7f2ff',
        'apollo-green-soft': '#e3f8ec',
        'apollo-surface': '#ffffff',
        'apollo-page': '#f7fbfc',
        'apollo-border': '#d7e7eb',
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
          ink: '#002d39',
          blue: '#007c9d',
          'blue-soft': '#def4fa',
          orange: '#f58320',
          yellow: '#fcd34d',
          cream: '#fff8e6',
          'sky-soft': '#e7f2ff',
          'green-soft': '#e3f8ec',
          surface: '#ffffff',
          page: '#f7fbfc',
          border: '#d7e7eb',
          teal: '#007c9d',
          coral: '#f58320',
          amber: '#f59e0b',
          navy: '#002d39',
          slate: '#475569',
        }
      },
    },
  },
  plugins: [],
}
