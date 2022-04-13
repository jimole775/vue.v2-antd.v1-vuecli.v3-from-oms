<template>
  <div>
    <BuildCollapsePanels :data-source="collapsePanels" @update="panelsUpdate" />
    <SubmitBar />
  </div>
</template>
<script>
import utils from '@/utils'
import builder from '@/mixins/builder'
import BuildCollapsePanels from '@builder/config-modules/build-collapse-panels'
import SubmitBar from './submit-bar.vue'
export default {
  mixins: [builder],
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
    panelsUpdate (data) {
      this.collapsePanels = data
      this.handup()
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
