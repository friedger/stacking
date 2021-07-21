const colors = require('tailwindcss/colors')

module.exports = {
  purge: {
    enabled: true,
    options: {
      keyframes: true,
      content: ["./hugo_stats.json"],
      defaultExtractor: (content) => {
        let els = JSON.parse(content).htmlElements;
        return els.tags.concat(els.classes, els.ids);
      },
    },
  },

  darkMode: false, // or 'media' or 'class'
  theme: {
    colors: {
      // Build your palette here
      transparent: 'transparent',
      current: 'currentColor',
      white: colors.white,
      gray: colors.gray,
      indigo: colors.indigo,
    },
    fontFamily: {
      sans: ['Nunito Sans', 'sans-serif'],
      serif: ['Nunito', 'serif'],
    },
    extend: {
    },
  },
  plugins: [
    require('@tailwindcss/typography'),
  ],
  variants: {
    typography: [],
    extend: {},
  },
}
