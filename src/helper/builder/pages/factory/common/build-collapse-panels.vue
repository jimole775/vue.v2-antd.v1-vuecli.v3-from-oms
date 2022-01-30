<template>
  <div>
    <a-collapse
      :bordered="false"
      :active-key="activeKeys"
    >
      <a-collapse-panel
        v-for="(panel, index) in collapsePanels"
        class="m-block"
        :key="`${index}`"
      >
        <template slot="header">
          <div>
            <span class="tab-title">{{ panel.title }}</span>
            <a-tooltip class="tab-title" v-if="panel.tips" :title="panel.tips">
              <a-icon type="question-circle-o" />
            </a-tooltip>
            <a v-if="index === 0" @click.stop="addCollapse"><a-icon type="plus-circle" /></a>
            <span v-else>
              <a class="tab-title warn" @click.stop="() => reduceCollapse(index)"><a-icon type="minus-circle" /></a>
              <a @click.stop="() => editCollapse(panel)"><a-icon type="edit" /></a>
            </span>
          </div>
        </template>
        <BuildFormItems :data-source="panel.formItems" @update="(formItems) => formItemConfirm(panel, formItems)" />
      </a-collapse-panel>
    </a-collapse>
    <AddCollapsePanel :modal="modal" @update="panelChangeConfirm" />
  </div>
</template>
<script>
// import utils from '@/utils'
import BuildFormItems from './build-form-items'
import AddCollapsePanel from './add-collapse-panel'
export default {
  components: {
    BuildFormItems,
    AddCollapsePanel
  },
  props: {
    dataSource: {
      type: Array
    }
  },
  data () {
    return {
      collapsePanels: [{
        tips: '',
        title: '基本信息',
        extend: true,
        formItems: []
      }],
      modal: {
        show: false,
        data: {}
      }
    }
  },
  computed: {
    activeKeys () {
      return this.collapsePanels.map((o, i) => o.extend ? `${i}` : null).filter(o => o)
    }
  },
  watch: {
    dataSource: {
      handler (data) {
        if (data && data.length) {
          this.collapsePanels = data
        }
      },
      immediate: true
    }
  },
  methods: {
    addCollapse () {
      this.modal.show = true
      this.modal.data = undefined
    },
    reduceCollapse (index) {
      this.$modal.confirm({
        title: '提示',
        content: '是否删除？',
        onOk: () => {
          this.collapsePanels.splice(index, 1)
        }
      })
    },
    editCollapse (panel) {
      this.modal.show = true
      this.modal.data = panel
    },
    formItemConfirm (panel, formItems) {
      panel.formItems = formItems
      this.$emit('update', this.collapsePanels)
    },
    panelChangeConfirm (panel) {
      let insertIndex = null
      for (let i = 0; i < this.collapsePanels.length; i++) {
        const item = this.collapsePanels[i]
        if (item.title === panel.title) {
          insertIndex = i
          break
        }
      }
      if (insertIndex === null) {
        this.collapsePanels.push({
          ...panel,
          formItems: []
        })
      } else {
        const cPanel = this.collapsePanels[insertIndex]
        cPanel.extend = panel.extend
        cPanel.title = panel.title
        cPanel.tips = panel.tips
      }
      this.$emit('update', this.collapsePanels)
      this.$forceUpdate()
    }
  }
}
</script>
<style lang="less" scoped>
// .tab-item {
//   position: absolute;
//   top: -0.5rem;
//   height: 1rem;
// }
.tab-title {
  padding: 0 0.5rem 0 0;
}
.warn {
  color: red;
}
</style>
