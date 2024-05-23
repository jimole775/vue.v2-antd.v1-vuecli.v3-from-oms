module.exports = {
  presets: [
    '@vue/babel-preset-app',
    // [
    //   "@babel/preset-env",
    //   {
    //     "useBuiltIns": "entry",
    //     "corejs": "3.22"
    //   }
    // ],
    '@babel/preset-typescript'
  ],
  plugins: [
    [
      'import',
      {
        'libraryName': 'ant-design-vue',
        'libraryDirectory': 'es',
        'style': 'true'
      }
    ],
    [
      '@babel/plugin-proposal-optional-chaining',
      {
        'version': '2023-07'
      }
    ],
    [
      '@babel/plugin-proposal-optional-chaining-assign',
      {
        'version': '2023-07'
      }
    ]
  ]
}
