import Vue from 'vue'
import utils from '@/utils'
Vue.directive('panel-header-slot', {
  inserted: async function (dom, binding, vm) {
    vm.elm.style.display = 'flex'
    vm.elm.style.alignItems = 'center'
    vm.elm.style.position = 'absolute'
    vm.elm.style.top = '-2rem'
    vm.elm.style.left = await countMarginLeft(vm.context)
  }
})

async function countMarginLeft (sojourVm) {
  const headerNode = await utils.findVm(sojourVm, 'Panel', '$parent')
  const oneRem = utils.rem2px(1)
  if (!headerNode.$el) return ''
  const headerElement = headerNode.$el.firstChild
  const contentElement = headerNode.$el.lastChild || { style: {} }
  contentElement.style.position = 'relative'
  contentElement.style.overflow = 'inherit'
  const headerStyle = window.getComputedStyle(headerElement) || {}
  const headerFontSize = parseFloat(headerStyle.fontSize || oneRem)
  const paddingLeft = parseFloat(headerStyle.paddingLeft || oneRem)
  const headerTitle = headerElement.innerText || ''
  const rect = utils.countStringSize(headerTitle)
  const textWidth = utils.px2rem(headerFontSize) * rect.width
  return Promise.resolve((textWidth + paddingLeft + oneRem * 2) + 'px')
}
