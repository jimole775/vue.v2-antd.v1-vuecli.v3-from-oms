const context = require.context('./modules', true, /(\.js)$/)
const monitors = []
context.keys().forEach(item => {
  const modules = context(item)
  monitors.push({
    id: '',
    mount: modules.mount,
    unmount: modules.unmount
  })
})

// 监听 vue 是否挂载，然后再加载监听器
;(function main() {
  setTimeout(() => {
    const pinot = '.oms-app-wrapper'
    const mountPoint = document.querySelector(pinot)
    if (mountPoint && mountPoint.__vue__) {
      console.log('mount!')
      mountHandler()
    } else {
      unmountHandler()
      return main()
    }
  }, 500)
})()

function mountHandler () {
  monitors.forEach(item => {
    item.id = item.mount()
  })
}

function unmountHandler () {
  monitors.forEach(item => {
    if (item.unmount) {
      item.unmount()
    }
    if (item.id || item.id === 0) {
      clearInterval(item.id)
      clearTimeout(item.id)
    }
  })
}
