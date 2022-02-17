<template>
  <OmsLayout>
    <OmsBreadcrumb />
    <SApprovallor
      :tabs="tabs"
      :apimap="apimap"
      :list-config="listConfig"
      :apply-config="applyConfig"
      :approval-config="approvalConfig"
      :before-submit="beforeSubmit"
      :before-render="beforeRender"
    />
  </OmsLayout>
</template>
<script>
import SApprovallor from '@/components/SApprovallor'
import apimap from './config/apimap'
import listConfig from './config/list'
import applyConfig from './config/apply'
import approvalConfig from './config/approval'
import tabs from './config/tabs'
export default {
  components: {
    SApprovallor
  },
  data () {
    return {
      tabs,
      apimap,
      listConfig,
      applyConfig,
      approvalConfig
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
</script>
