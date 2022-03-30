import utils from '@/utils'
export default function viewToBuild (tabs = []) {
  const lists = []
  const applies = []
  const approvals = []
  tabs.forEach((tab) => {
    const copyTab = utils.clone(tab)
    const disabledFields = ['component', 'api']
    disabledFields.forEach((key) => {
      delete copyTab[key] // 删掉 component
    })
    copyTab.type = { 0: 'list', 1: 'apply', 2: 'detail' }[copyTab.type]
    if (copyTab.type === 'list') {
      lists.push(copyTab)
    }
    if (copyTab.type === 'apply') {
      applies.push(copyTab)
    }
    if (copyTab.type === 'detail') {
      approvals.push(copyTab)
    }
  })

  // 把"申请"和"审批"的标签名绑到 list.proxyName
  lists.forEach((list) => {
    applies.forEach((apply) => {
      if (list.rank === apply.rank) {
        if (!list.proxyName) list.proxyName = { apply: '', detail: '' }
        list.proxyName.apply = apply.tabName
      }
    })
    approvals.forEach((approval) => {
      if (list.rank === approval.rank) {
        if (!list.proxyName) list.proxyName = { apply: '', detail: '' }
        list.proxyName.detail = approval.tabName
      }
    })
  })

  // 只返回 list 类型
  return lists
}
