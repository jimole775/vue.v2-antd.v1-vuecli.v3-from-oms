import buildApproval from './approval'
import buildApply from './apply'
import buildList from './list'
import buildRouter from './router'
import buildTabs from './tabs'
import buildApimap from './apimap'
export default function (buildConstructs) {
  if (buildConstructs) {
    const { applyConfig, approvalConfig, listConfig, apimapConfig, routerConfig, tabsConfig } = buildConstructs
    const applyFileInfos = buildApply(applyConfig)
    const approvalFileInfos = buildApproval(approvalConfig)
    const listFileInfos = buildList(listConfig)
    const apimapFileInfos = buildApimap(apimapConfig)
    const routerFileInfos = buildRouter(routerConfig)
    const tabsFileInfos = buildTabs(tabsConfig)
    console.log('applyFileInfos:', applyFileInfos)
    console.log('approvalFileInfos:', approvalFileInfos)
    console.log('listFileInfos:', listFileInfos)
    console.log('apimapFileInfos:', apimapFileInfos)
    console.log('routerFileInfos:', routerFileInfos)
    console.log('tabsFileInfos:', tabsFileInfos)
  }
}
