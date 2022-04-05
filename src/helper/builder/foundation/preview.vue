<template>
  <a-modal
    v-if="modal.show"
    v-model="modal.show"
    width="90%"
    :mask-closable="false"
    :footer="null"
  >
    <SApprovallor
      :tabs="tabs"
      :apimap="apimap"
      :list-config="listConfig"
      :apply-config="applyConfig"
      :approval-config="approvalConfig"
    />
  </a-modal>
</template>
<script>
import utils from '@/utils'
import http from '@/utils/http'
import { jsx2vue, string2func } from '@builder/utils'
import SApprovallor from '@/components/SApprovallor'
export default {
  name: 'Preview',
  components: {
    SApprovallor
  },
  props: {
    modal: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      tabs: [],
      apimap: {},
      listConfig: {},
      applyConfig: {},
      approvalConfig: {}
    }
  },
  watch: {
    modal: {
      async handler (modal) {
        const { data, show } = modal
        if (data && show) {
          const scopeData = utils.clone(data)
          this.transferFunction(scopeData)
          this.tabs = scopeData.tabs
          this.apimap = this.diggingApiUrl(scopeData.apimap)
          this.listConfig = scopeData.listConfig
          this.applyConfig = scopeData.applyConfig
          this.approvalConfig = scopeData.approvalConfig
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    diggingApiUrl (apimap = {}) {
      const tabIndexs = Object.keys(apimap)
      tabIndexs.forEach((tabIndex) => {
        const apimapItem = apimap[tabIndex]
        const apiNames = Object.keys(apimapItem)
        apiNames.forEach((apiName) => {
          const apiItem = apimapItem[apiName]
          apimap[tabIndex][apiName] = packageApi(apiItem)
        })
      })
      return apimap
    },
    // 把jsx类型的render函数字符串转成vue类型的render
    // 使eval执行不会报错
    transferFunction (data) {
      // listConfig: {},
      // // “申请页面” 配置项
      // applyConfig: {},
      // // “审批详情” 配置项
      // approvalConfig: {},
      let allFormItems = []
      let { listConfig, applyConfig, approvalConfig } = data
      let tabIndexs = Object.keys(listConfig)
      tabIndexs.forEach((tabIndex) => {
        const list = listConfig[tabIndex]
        const { columns, searchor } = list
        allFormItems = [...allFormItems, ...columns, ...searchor]
      })

      tabIndexs = Object.keys(applyConfig)
      tabIndexs.forEach((tabIndex) => {
        const apply = applyConfig[tabIndex]
        apply.panels.forEach((panel) => {
          allFormItems = [...allFormItems, ...panel.formItems]
        })
      })

      tabIndexs = Object.keys(approvalConfig)
      tabIndexs.forEach((tabIndex) => {
        const approval = approvalConfig[tabIndex]
        const nodes = Object.keys(approval)
        nodes.forEach((node) => {
          const { permission, dispermission } = approval[node].panels
          permission.concat(dispermission).forEach((panel) => {
            const formItems = panel.formItems
            const operationItem = panel.operationItem
            if (formItems) {
              allFormItems = [...allFormItems, ...formItems]
            }
            if (operationItem) {
              const { radios, inputs } = operationItem
              allFormItems = [...allFormItems, ...radios, ...inputs]
            }
          })
        })
      })

      allFormItems.forEach((formItem) => {
        const keys = Object.keys(formItem)
        keys.forEach((key) => {
          if (isFuncStr(formItem[key]) && isNodeRender(formItem[key])) {
            formItem[key] = string2func(jsx2vue(formItem[key]))
          }
        })
      })
      return data
    }
  }
}

function isNodeRender (string) {
  if (!string) return false
  if (/</.test(string) || /\/>/.test(string)) {
    return true
  } else {
    return false
  }
}

function isFuncStr (string) {
  if (!string) return false
  if (/=>/.test(string) || /function\s?\(/.test(string)) {
    return true
  } else {
    return false
  }
}
// 尝试获取样例数据
function packageApi (apiItem) {
  if (apiItem.url) {
    const fn = http[apiItem.method.toLocaleLowerCase()] || function () {}
    const defaultParams = apiItem.params || {}
    const injectParams = apiItem.method === 'GET' ? { params: defaultParams } : defaultParams
    return (params = {}) => {
      return fn.apply(http, [apiItem.url, {
        ...params,
        ...injectParams
      }])
    }
  }
}

</script>
