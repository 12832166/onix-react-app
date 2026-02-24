/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,ts,jsx,tsx}'],
  darkMode: 'class',
  theme: {
    extend: {
      fontFamily: {
        sans: ['Inter', 'sans-serif'],
      },
      colors: {
        primary: {
          DEFAULT: '#6366f1',
          dark: '#4f46e5',
        },
        accent: {
          DEFAULT: '#ec4899',
          dark: '#db2777',
        },
        teal: {
          DEFAULT: '#14b8a6',
          dark: '#0d9488',
        },
      },
    },
  },
  plugins: [],
};
