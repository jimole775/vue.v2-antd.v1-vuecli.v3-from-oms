// const marked = require("marked");
// const renderer = new marked.Renderer();
const webpack = require('webpack')
const path = require('path')
const env = process.env.VUE_APP_SERVER_ENV

const proEntries = './src/main.js'
const devEntries = './src/main.dev.js'

const devEnvs = ['native']
const proEnvs = ['prod']

function resolve (dir) {
  return path.join(__dirname, dir)
}

module.exports = {
  configureWebpack: {
    entry: devEnvs.includes(env) ? devEntries : proEntries,
    devtool: proEnvs.includes(env) ? '' : 'source-map',
    resolve: {
      alias: {
        '@builder': resolve('./src/helper/builder')
      }
    },
    plugins: [
      // 忽略moment的语言包
      new webpack.IgnorePlugin(/^\.\/locale$/, /moment$/)
    ]
  },
  chainWebpack: config => {
    config.module
      .rule('md')
      .test(/\.md$/)
      .use('html-loader')
      .loader('html-loader')
      .end()
      .use('markdown-loader')
      // .tap(options => {
      //   // 修改它的选项...
      //   console.log(options)
      //   options.renderer = renderer
      //   return options
      // })
      .loader('markdown-loader')
      .end()

    // config.module
    //   .rule('ts')
    //   .test(/\.tsx?$/)
    //   .exclude
    //     .add(/node_modules/)
    //     .end()
    //   .use('ts-loader')
    //     .loader('ts-loader')
    //     .options({
    //       appendTsSuffixTo: [/\.vue$/], // 确保 .vue 文件中的 <script lang="ts"> 能被识别
    //       // 其他 ts-loader 选项...
    //     })
    //     .end()
    // ...
    // {
    //   test: /\.vue$/,
    //   loader: 'vue-loader',
    //   // options: require('./vue-loader.conf')
    //   options: {
    //     loaders: {
    //       ts: 'ts-loader', // 使用 ts-loader 处理 TypeScript
    //       tsx: 'ts-loader', // 也可以指定 tsx 的 loader，但通常 ts 就足够了
    //       // ...
    //     },
    //     // 其他 vue-loader 选项
    //   },
    // },
    // 可以使用 htmlWebpackPlugin 插件代替
    config.plugins.delete('prefetch')
  },
  css: {
    loaderOptions: {
      less: {
        lessOptions: {
          modifyVars: {
            'primary-color': '#2DC84D',
            'link-color': '#2DC84D',
            'font-family': '"Microsoft YaHei", "Helvetica Neue"',
            'body-background': '#F2F4F8',
            'layout-header-background': '#F2F4F8',
            'layout-header-padding': '0 15px',
            'layout-footer-background': '#F2F4F8',
            'layout-footer-padding': '17px',
            'layout-header-height': '50px',
            'menu-bg': '#FFFFFF',
            'menu-collapsed-width': '50px',
            'border-radius-base': '3px',
            'text-color': '#666666',
            'item-hover-bg': '#F2FAF7',
            'table-row-hover-bg': '#F2FAF7',
            'table-selected-row-bg': '#F2FAF7'
          },
          javascriptEnabled: true
        }
      }
    }
  }
}
