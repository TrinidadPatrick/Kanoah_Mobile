/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./App.{js,jsx,ts,tsx}", "./Components/**/*.{js,jsx,ts,tsx}"],
  theme: {
    extend: {
      colors: {
        themeBlue : "#0E2F41",
        white : "#ffffff",
        themeOrange : "#EB6B23",
        themeGray : "#505050"
        
      },
    },
  },
  plugins: [],
}

