const express = require('express')
const { createProxyMiddleware } = require('http-proxy-middleware')

const app = express()
const port = 8081

// 设置代理规则
const proxy = createProxyMiddleware({
  target: 'http://localhost:8080',
  changeOrigin: true // 如果你的API不支持跨域，这个选项会发送请求时改变origin头信息
})

// 应用代理到所有以 /api 开头的请求
app.use('/', proxy)

// 监听端口
app.listen(port, () => {
  console.log(`Proxy server is running on port ${port}`)
})
