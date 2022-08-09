import Vue from 'vue'
let observer
let sider // 左边框
let contenter // 审批页
let defaultPaddingBottom // 审批页 默认底部间距

const SIDER_SIGN = '.ant-layout-sider'
const CONTENTER_SIGN = '.ant-layout-content'
/**
 * 注意事项：
 * 当前指令封装的组件/dom，不能包裹在 tabs/a-tab-pane 标签里
 * 否则，antd的select组件，计算下拉数据的展示位置的时候会出现误差
 * 导致内容会伸展出屏幕外，无法选取
 */
Vue.directive('operator-panel-style', {
  inserted: function (operator) {
    // 避免挂载多个 watcher
    if (observer) return false
    getSider()
    getContenter()
    savePageBottom() // 存储默认的底部间距
    setPanelStyle(operator) // 设置审批板块的样式
    watchingOperatorChanges(operator)
  },
  unbind: function (operator) {
    resetWatcher()
    revertPageBottom(operator) // 还原默认的底部间距
    resetConst()
  }
})

function getSider () {
  sider = document.querySelector(SIDER_SIGN)
}

function getContenter () {
  contenter = document.querySelector(CONTENTER_SIGN)
}

function resetWatcher () {
  if (observer) {
    observer.disconnect && observer.disconnect()
    clearInterval(observer)
  }
}

function resetConst () {
  sider = null
  observer = null
  contenter = null
  defaultPaddingBottom = null
}

function setPanelStyle (operator) {
  if (!/operator-panel/.test(operator.className)) {
    operator.className = operator.className + ' operator-panel'
  }
  operator.style.position = 'fixed'
  operator.style.bottom = 0
  operator.style.left = (sider.clientWidth + 15) + 'px'
  operator.style.zIndex = 111
  operator.style.padding = 0
  operator.style.margin = 0
  operator.style.boxShadow = '0 0 9px #3333'
  operator.style.width = (contenter.clientWidth - 15 * 2) + 'px'
}

function watchingOperatorChanges (operator) {
  if (MutationObserver) {
    observer = null
    observer = new MutationObserver((mutationList) => {
      setPageBottom(operator) // 重新计算 审批页面 的 paddingBottom 值
    })
    observer.observe(operator, { attributes: true, childList: true, subtree: true })
  } else {
    observer = null
    observer = setTimeout(() => {
      setPageBottom(operator) // 重新计算 审批页面 的 paddingBottom 值
      return watchingOperatorChanges(operator)
    }, 45)
  }
}

function setPageBottom (operator) {
  contenter.style.paddingBottom = operator.offsetHeight + 'px'
}

function revertPageBottom (operator) {
  if (!contenter) contenter = document.querySelector('.ant-layout-content')
  contenter.style.paddingBottom = defaultPaddingBottom
}

function savePageBottom () {
  defaultPaddingBottom = contenter.style.paddingBottom
}
