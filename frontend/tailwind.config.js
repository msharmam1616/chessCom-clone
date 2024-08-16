/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors:{
        'black-rgba': 'rgba(90, 89, 96, 0.75)' 
      }
    },
  },
  plugins: [],
}

