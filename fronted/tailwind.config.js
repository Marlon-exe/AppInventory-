// tailwind.config.js
const {heroui} = require("@heroui/theme");

/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./node_modules/@heroui/theme/dist/components/(autocomplete|button|calendar|modal|navbar|pagination|table|ripple|spinner|form|input|listbox|divider|popover|scroll-shadow|checkbox).js"
],
  theme: {
    extend: {},
  },
  darkMode: "class",
  plugins: [heroui()],
};