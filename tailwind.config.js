const defaultTheme = require('tailwindcss/defaultTheme')

module.exports = {
    mode: 'jit',
    purge: [
      "./app/**/*.tsx",
      "./app/**/*.jsx",
      "./app/**/*.js",
      "./app/**/*.ts"
    ],
    darkMode: false, // or 'media' or 'class'
    theme: {
      extend: {
        fontFamily: {
            sans: ['Work Sans', ...defaultTheme.fontFamily.sans],
        },
      }
    },
    variants: {},
    plugins: [
        require('@tailwindcss/typography'),
        require('@tailwindcss/line-clamp'),
        require('@tailwindcss/aspect-ratio'),
        require('daisyui')
    ]
};
