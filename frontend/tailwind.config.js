/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  darkMode: 'class', // Enable dark mode with class strategy
  theme: {
    extend: {
      boxShadow: {
        'sm': '0 1px 3px rgba(0,0,0,0.06)',
        'md': '0 4px 12px rgba(0,0,0,0.08)',
      }
    },
  },
  plugins: [],
}