// const path = require('path');
// const utils = require('./utils');
console.log('vue-loader.conf: xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx')
const vueLoaderOptions = {
  // 这些选项将会传递给 vue-template-compiler
  compilerOptions: {
    preserveWhitespace: false
  },
  // 这允许你传递选项给 vue-loader
  loaderOptions: {
    // 给 vue-style-loader 传递选项
    // style: {
    //   // options here
    // },
    // 给 css-loader 传递选项
    // css: {
    //   // options here
    // },
    // 给 postcss-loader 传递选项
    // postcss: {
    //   // options here
    // },
    // 给 sass-loader 传递选项
    // sass: {
    //   // options here
    // },
    // 给 scss-loader 传递选项
    // scss: {
    //   // options here
    // },
    // 给 less-loader 传递选项
    // less: {
    //   // options here
    // },
    // 给 stylus-loader 传递选项
    // stylus: {
    //   // options here
    // },
    // 给 ts-loader 传递选项（如果直接在这里配置）
    // 注意：通常 ts-loader 的配置在 webpack 的 rules 中进行
    ts: {
      appendTsSuffixTo: [/\.vue$/],
      loader: 'ts-loader'
      // 其他 ts-loader 选项
    }
    // 给 tsx-loader 传递选项（如果你使用 tsx-loader 的话）
    // tsx: {
    //   // tsx-loader 的选项
    // },
    // 如果你使用的是 babel 来转译 TypeScript，你可以在这里配置 babel-loader
    // babel: {
    //   // options here
    // },
    // 其他 loader 的配置...

    // 重要的是，确保你的 webpack 配置中的 ts-loader 或相应的 loader
    // 可以处理 .vue 文件中的 <script lang="ts"> 或 <script lang="tsx">
    // 这通常是在 webpack 的 module.rules 中配置的
  }
  // 其他 vue-loader 选项...
}

module.exports = vueLoaderOptions
