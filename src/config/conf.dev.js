if (process.env.NODE_ENV === 'development') {
  console.log('is dev!')
  require('@/mock') // mock data开关
  require('@/plugins/highlight')
}
