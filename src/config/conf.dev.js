import store from '@/store'
if (['local'].includes(process.env.VUE_APP_ENV)) {
  // mock data开关
  store.commit('setMockEnv', true)

  // 加载模拟数据
  require('@/mock')

  // 加载 代码高亮 工具
  require('@/directives/highlight')
}
