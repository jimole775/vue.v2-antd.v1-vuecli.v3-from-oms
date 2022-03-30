<template>
  <div>
    <!-- <ApprovalNodesMap :api-name="''" :params="{ organizationCode: '' }" /> -->
    <!-- <BuildCollapsePanels @update="panelsUpdate" /> -->
    <BuildCollapsePanels :data-source="collapsePanels" @update="panelsUpdate" />
    <SubmitBar @update="apiUpdate" />
  </div>
</template>
<script>
import utils from '@/utils'
import mixins from '@builder/mixins'
// import ApprovalNodesMap from '@/components/ApprovalNodesMap'
import BuildCollapsePanels from '@builder/config-modules/build-collapse-panels'
import SubmitBar from './submit-bar.vue'
export default {
  mixins: [mixins],
  components: {
    SubmitBar,
    // ApprovalNodesMap,
    BuildCollapsePanels
  },
  // props: {
  //   rank: {
  //     type: Number,
  //     default: 0
  //   }
  // },
  data () {
    return {
      collapsePanels: []
    }
  },
  methods: {
    apiUpdate (data) {
      this.handupApi(data)
    },
    panelsUpdate (data) {
      this.collapsePanels = data
      this.handup()
    },
    handupApi (data) {
      this.setViewData({ key: 'apimap', value: data })
      this.setBuildData({ key: 'apimap', value: data })
      // this.setBuildData({ key: 'apimapConfig', rank: this.rank, value: data })
    },
    // handupBuildData (data) {
    //   this.setBuildData({ key: 'applyConfig', rank: this.rank, value: data })
    //   this.handupViewData()
    // },
    handup () {
      const cacheData = {
        collapsePanels: utils.clone(this.collapsePanels)
      }
      this.setViewData({ key: 'apply', value: cacheData })
      this.setBuildData({ key: 'apply', value: cacheData })
    }
  }
}

</script>
<style lang="less" scoped>
/deep/.ant-row {
  line-height: 2.5;
}
</style>
