const { colors } = require('@mui/material')

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        hovered:"#FA4032",
        main:"#FAB12F"
      }
    },
  },
  plugins: [],
}