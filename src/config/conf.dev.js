import store from '@/store'
if (['local', 'dev'].includes(process.env.VUE_APP_ENV)) {
  // mock data开关
  store.commit('setMockEnv', true)

  // 加载模拟数据
  require('@/mock')
}
