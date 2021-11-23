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
      extend: {}
    },
    variants: {},
    plugins: []
};
