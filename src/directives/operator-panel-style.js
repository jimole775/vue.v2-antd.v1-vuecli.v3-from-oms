import Vue from 'vue'
let observer
let interval
let sider // 左边框
let contenter // 审批页
let defaultPaddingBottom // 审批页 默认底部间距

Vue.directive('operator-panel-style', {
  inserted: function (operator) {
    sider = document.querySelector('.ant-layout-sider')
    contenter = document.querySelector('.ant-layout-content')
    savePageBottom() // 存储默认的底部间距
    setPanelStyle(operator) // 设置审批板块的样式
    watchingOperatorChanges(operator)
  },
  unbind: function (operator) {
    observer && observer.disconnect()
    interval && clearInterval(interval)
    revertPageBottom(operator) // 还原默认的底部间距
    resetConst()
  }
})

function resetConst () {
  sider = null
  observer = null
  interval = null
  contenter = null
  defaultPaddingBottom = null
}

function setPanelStyle (operator) {
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
    observer = new MutationObserver((mutationList) => {
      setPageBottom(operator) // 重新计算 审批页面 的 paddingBottom 值
    })
    observer.observe(operator, { attributes: true, childList: true, subtree: true })
  } else {
    interval = null
    interval = setTimeout(() => {
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
