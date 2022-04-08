module.exports = {
  trailingComma: 'none',
  singleQuote: true,
  semi: false,
  parser: 'babel',
  eslintIntegration: true,
  overrides: [
    {
      files: '*.vue',
      options: {
        parser: 'vue'
      }
    },
    {
      files: '*.js',
      options: {
        parser: 'babel'
      }
    }
  ]
}
