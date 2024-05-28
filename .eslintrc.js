module.exports = {
  root: true,
  env: {
    node: true
  },
  // 'parser': '@babel/eslint-parser',
  parser: 'babel-eslint',
  parserOptions: {
    'requireConfigFile': false,
    'babelOptions': { // 支持 可选链 语法
      'plugins': ['@babel/plugin-syntax-optional-chaining']
    }
  },
  extends: [
    'plugin:vue/strongly-recommended',
    '@vue/standard'
  ],
  rules: {
    'vue/no-mutating-props': 'off',
    'no-console': 'off',
    'no-new-func': 'off',
    'no-debugger': 'off',
    'no-eval': 'off',
    'no-useless-escape': 'off',
    'object-property-newline': 'off',
    'space-before-function-paren': 'off',
    'vue/attribute-hyphenation': 'off',
    'vue/html-self-closing': 'off',
    'vue/require-default-prop': 'off',
    'vue/no-unused-components': 'off',
    'vue/require-prop-type-constructor': 'off',
    'vue/max-attributes-per-line': [
      'error',
      {
        'singleline': 4,
        'multiline': {
          'max': 1,
          'allowFirstLine': false
        }
      }
    ],
    'vue/singleline-html-element-content-newline': 0
  }
}
