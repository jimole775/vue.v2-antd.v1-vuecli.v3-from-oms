import '@/directives/operator-panel-style'
if (['local', 'dev'].includes(process.env.VUE_APP_ENV)) {
  // 加载 代码高亮 工具
  require('@/directives/highlight')
}
