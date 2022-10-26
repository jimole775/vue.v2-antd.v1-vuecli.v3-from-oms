const api = Object.create(null)
const proModules = require.context('./modules', true, /(\.js)$/)

proModules.keys().forEach((item) => {
  const fileInfo = proModules(item).default || proModules(item)
  Object.keys(fileInfo).forEach((key) => {
    api[key] = fileInfo[key]
  })
})

// 加载 mock 和 builder 环境的api
if (['native'].includes(process.env.VUE_APP_SERVER_ENV)) {
  const mockModules = require.context('./mocks', true, /(\.js)$/)
  mockModules.keys().forEach((item) => {
    const fileInfo = mockModules(item).default || mockModules(item)
    Object.keys(fileInfo).forEach((key) => {
      api[key] = fileInfo[key]
    })
  })
}

export default api
