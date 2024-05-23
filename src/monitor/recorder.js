/**
 * @ Author: Your name
 * @ Create Time: 2024-04-28 00:42:34
 * @ Modified by: Your name
 * @ Modified time: 2024-04-28 00:50:43
 * @ Description: 主要用来记录当前有哪些 循环函数 在调用，方便以后出现性能问题进行追踪
 */
const oSetTimeout = window.setTimeout
const oSetInterval = window.setInterval
const oClearTimeout = window.clearTimeout
const oClearInterval = window.clearInterval

if (!window.$xxx_monitor$) {
  window.$xxx_monitor$ = Object.create(null)
}

window.setTimeout = function (event, delay = 0, description = '') {
  const monitorId = oSetTimeout(() => {
    event && event()
    delete window.$xxx_monitor$[monitorId]
  }, delay)
  recording('setTimeout', monitorId, event, delay, description)
  return monitorId
}

window.setInterval = function (event, delay = 15, description = '') {
  const monitorId = oSetInterval(event, delay)
  recording('setInterval', monitorId, event, delay, description)
  return monitorId
}

window.clearTimeout = function (monitorId) {
  oClearTimeout(monitorId)
  delete window.$xxx_monitor$[monitorId]
}

window.clearInterval = function (monitorId) {
  oClearInterval(monitorId)
  delete window.$xxx_monitor$[monitorId]
}

function recording (type, monitorId, event, delay, description) {
  if (!window.$xxx_monitor$[monitorId]) {
    window.$xxx_monitor$[monitorId] = {
      type,
      event,
      delay,
      description,
      id: monitorId,
      start: new Date().getTime()
    }
  }
}
