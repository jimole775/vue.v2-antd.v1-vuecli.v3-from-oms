<template>
  <div>
    <ApprovalNodesMap :api-name="''" :params="{ organizationCode: '' }" />
    <BuildCollapsePanels />
    <SubmitBar />
  </div>
</template>
<script>
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
  },
  data () {
    return {
    }
  },
  methods: {
    dropStage () {
    },
    async saveStage () {
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.ant-row {
  line-height: 2.5;
}
</style>
