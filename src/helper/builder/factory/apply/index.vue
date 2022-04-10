<template>
  <div>
    <BuildCollapsePanels :data-source="collapsePanels" @update="panelsUpdate" />
    <SubmitBar @update="apiUpdate" />
  </div>
</template>
<script>
import utils from '@/utils'
import mixins from '@builder/mixins'
import BuildCollapsePanels from '@builder/config-modules/build-collapse-panels'
import SubmitBar from './submit-bar.vue'
export default {
  mixins: [mixins],
  components: {
    SubmitBar,
    BuildCollapsePanels
  },
  data () {
    return {
      collapsePanels: []
    }
  },
  watch: {
    viewData: {
      handler (data) {
        if (data.apply) {
          const currentModule = data.apply[this.currentRank]
          this.collapsePanels = currentModule.collapsePanels || []
        }
      },
      immediate: true
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
    },
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
