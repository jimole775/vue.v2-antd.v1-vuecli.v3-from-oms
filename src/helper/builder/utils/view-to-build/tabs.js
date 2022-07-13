import utils from '@/utils'
export default function tabs (tabs = [], approvalModule = {}) {
  const listTabs = []
  const approvalTabs = []
  tabs.forEach((tab) => {
    const copyTab = utils.clone(tab)
    const disabledFields = ['component', 'api']
    disabledFields.forEach((key) => {
      delete copyTab[key] // 删掉 component
    })
    copyTab.type = { 0: 'list', 1: 'apply', 2: 'detail' }[copyTab.type]
    if (copyTab.type === 'list') {
      listTabs.push(copyTab)
    }
    if (copyTab.type === 'detail') {
      approvalTabs.push(copyTab)
    }
  })

  // 把"申请"和"审批"的标签名绑到 item.proxyName
  listTabs.forEach((item) => {
    approvalTabs.forEach((apprTab) => {
      if (item.rank === apprTab.rank) {
        if (!item.proxyName) item.proxyName = { apply: '', detail: '' }
        const curApprovalModule = approvalModule[apprTab.rank] || {}
        const nodes = curApprovalModule.nodes || []
        const applyNode = nodes[0] || {}
        const label = applyNode.label || ''
        item.proxyName.apply = label
        item.proxyName.detail = apprTab.tabName
      }
    })
  })

  return listTabs
}
