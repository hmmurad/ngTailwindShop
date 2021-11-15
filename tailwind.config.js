const tailwindcss = require("tailwindcss");

module.exports = {
  mode: '',
  // These paths are just examples, customize them to match your project structure
  purge: [],
  darkMode: 'media', // or 'media' or 'class'
  theme: {
    extend: {},
  },
  variants: {
    extend: {transitionDuration: ['hover', 'focus'],},
  },
  plugins: [
    require('@tailwindcss/forms')
   ],
}
