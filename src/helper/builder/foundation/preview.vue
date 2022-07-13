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
      :list="list"
      :apimap="apimap"
      :approval="approval"
    />
  </a-modal>
</template>
<script>
import utils from '@/utils'
import { jsx2vue, string2func } from '@builder/utils'
import SApprovallor from '@/components/SApprovallor'
import makeApiMethod from '@builder/utils/make-api-method'
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
      list: {},
      apimap: {},
      approval: {}
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
          this.list = scopeData.list
          this.approval = this.reconstructsOperator(scopeData.approval)
          this.apimap = makeApiMethod(scopeData.apimap)
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    reconstructsOperator (approval) {
      const res = {}
      Object.keys(approval).forEach(tabIndex => {
        const currentTab = approval[tabIndex]
        res[tabIndex] = {
          panels: utils.clone(currentTab.panels),
          operator: {
            title: '审批操作',
            component: 'Operator',
            option: utils.clone(currentTab.operator)
          }
        }
      })
      return res
    },
    // 把jsx类型的render函数字符串转成vue类型的render
    // 使eval执行不会报错
    transferFunction (data) {
      let allFormItems = []
      let { list, approval } = data
      let tabIndexs = Object.keys(list)
      tabIndexs.forEach((tabIndex) => {
        const curList = list[tabIndex]
        const { columns, searchor } = curList
        allFormItems = [...allFormItems, ...columns, ...searchor]
      })

      tabIndexs = Object.keys(approval)
      tabIndexs.forEach((tabIndex) => {
        const curAppr = approval[tabIndex]
        const panels = curAppr.panels
        const inputs = curAppr.operator.inputs || []
        const radios = curAppr.operator.radios || []
        panels.forEach((panel) => {
          const formItems = panel.formItems
          if (formItems) {
            allFormItems = [...allFormItems, ...formItems]
          }
        })
        allFormItems = [...allFormItems, ...inputs, radios]
      })

      allFormItems.forEach((formItem) => {
        const keys = Object.keys(formItem)
        keys.forEach((key) => {
          if (isFuncStr(formItem[key])) {
            if (isNodeRender(formItem[key])) {
              formItem[key] = string2func(jsx2vue(formItem[key]))
            } else {
              formItem[key] = string2func(formItem[key])
            }
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

</script>
