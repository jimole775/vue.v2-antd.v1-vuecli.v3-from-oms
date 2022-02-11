<template>
  <div>
    <ApprovalNodesMap :api-name="''" :params="{ organizationCode: '' }" />
    <BuildCollapsePanels @update="panelsUpdate" />
    <SubmitBar @update="apiUpdate" />
  </div>
</template>
<script>
import Vue from 'vue'
import ApprovalNodesMap from '@/components/ApprovalNodesMap'
import BuildCollapsePanels from '@/helper/builder/pages/factory/common/build-collapse-panels'
import SubmitBar from './submit-bar.vue'
export default {
  components: {
    SubmitBar,
    ApprovalNodesMap,
    BuildCollapsePanels
  },
  props: {
    rank: {
      type: Number,
      default: 1
    }
  },
  data () {
    return {
    }
  },
  methods: {
    apiUpdate (data) {
      this.handupApi(data)
    },
    panelsUpdate (data) {
      this.handupApply(data)
    },
    handupApi (data) {
      Vue.bus.$emit('_apimap_', this.rank - 1, data)
    },
    handupApply (data) {
      Vue.bus.$emit('_applyConfig_', this.rank - 1, data)
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.ant-row {
  line-height: 2.5;
}
</style>
