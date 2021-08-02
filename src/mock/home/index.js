import mock from 'mockjs'
const context = require.context('./modules', true, /(\.js)$/)
const apiBase = 'mock'
context.keys().forEach((item) => {
  const fileName = item.replace(/^\.[\\\/]/g, '').replace(/(\.js)$/g, '')
  const data = context(item).default || context(item)
  console.log(fileName, data)
  mock.mock(`/${apiBase}/${fileName}`, 'get', data)
})
mock.setup(500)
