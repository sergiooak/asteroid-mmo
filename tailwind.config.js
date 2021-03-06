// tailwind.config.js
const plugin = require('tailwindcss/plugin')

module.exports = {
  darkMode: false, // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {},
  },
  plugins: [require('@tailwindcss/aspect-ratio')]
}