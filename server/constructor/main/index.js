module.exports = function buildIndexVue (prevPath) {
  return [{
    path: `${prevPath}/index.vue`,
    content: `<template>
    <OmsLayout>
      <OmsBreadcrumb />
      <SApprovallor
        :list="list"
        :tabs="tabs"
        :apimap="apimap"
        :approval="approval"
        :before-submit="beforeSubmit"
        :before-render="beforeRender"
      />
    </OmsLayout>
  </template>
  <script>
  import SApprovallor from '@/components/SApprovallor'
  import apimap from './config/apimap'
  import list from './config/list'
  import approval from './config/approval'
  import tabs from './config/tabs'
  export default {
    components: {
      SApprovallor
    },
    data () {
      return {
        list,
        tabs,
        apimap,
        approval
      }
    },
    methods: {
      // 补充遗漏字段，比如申请人，申请部门等
      beforeSubmit (params) {
        return params
      },
      beforeRender (dataSource, formItems, vm) {
      }
    }
  }
  </script>`
  }]
}
