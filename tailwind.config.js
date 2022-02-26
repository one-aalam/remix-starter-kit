const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    content: [
      "./app/**/*.tsx",
      "./app/**/*.jsx",
      "./app/**/*.js",
      "./app/**/*.ts"
    ],
    theme: {
      extend: {
        fontFamily: {
            sans: ['Work Sans', ...defaultTheme.fontFamily.sans],
        },
      }
    },
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/line-clamp'),
        require('@tailwindcss/aspect-ratio'),
        require('daisyui')
    ]
};
