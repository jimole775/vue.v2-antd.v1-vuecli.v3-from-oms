import store from '@/store'

const devEnvs = ['native']

if (devEnvs.includes(process.env.VUE_APP_SERVER_ENV)) {
  // mock data开关
  store.commit('setMockEnv', true)

  // 加载模拟数据
  require('@/mock')

  // 加载 代码高亮 工具
  require('@/directives/highlight')
}

// 主入口
require('./main')
