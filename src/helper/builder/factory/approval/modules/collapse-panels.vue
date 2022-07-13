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
            <a class="tab-title warn" @click.stop="() => reduceCollapse(index)"><a-icon type="minus-circle" /></a>
            <a @click.stop="() => editCollapse(panel)"><a-icon type="edit" /></a>
          </div>
        </template>
        <ConfigFormItems
          :keys="panel.formItems.length"
          :nodes="availNodes"
          :radios="radios"
          :value="panel.formItems"
          @update="(formItems) => formItemConfirm(panel, formItems)"
        />
      </a-collapse-panel>
    </a-collapse>
    <ConfigCollapsePanel
      :modal="modal"
      :radios="radios"
      :nodes="availNodes"
      :component-able="true"
      @update="panelChangeConfirm"
    />
  </div>
</template>
<script>
// import api from '@/api'
import utils from '@/utils'
import ConfigFormItems from '@builder/config-modules/config-form-items'
import ConfigCollapsePanel from '@builder/config-modals/config-collapse-panel'
export default {
  components: {
    ConfigFormItems,
    ConfigCollapsePanel
  },
  props: {
    value: { type: Array },
    nodes: { type: Array, default: () => [] },
    radios: { type: Array, default: () => [] } // 显示operations的radio选项
  },
  data () {
    return {
      collapsePanels: [],
      modal: {
        show: false,
        data: {}
      }
    }
  },
  computed: {
    activeKeys () {
      return this.collapsePanels.map((o, i) => o.extend ? `${i}` : null).filter(o => o)
    },
    availNodes () {
      return this.nodes.filter(i => i.value !== '__addition__')
    }
  },
  watch: {
    value: {
      handler (data) {
        if (data && data.length) {
          this.collapsePanels = utils.clone(data)
        }
      },
      immediate: true
    }
  },
  methods: {
    reduceCollapse (index) {
      this.$modal.confirm({
        title: '提示',
        content: '是否删除当前板块？',
        onOk: () => {
          this.collapsePanels.splice(index, 1)
          this.$emit('update', this.collapsePanels)
        }
      })
    },
    editCollapse (panel) {
      this.modal.show = true
      this.modal.data = panel
    },
    formItemConfirm (panel, formItems) {
      panel.formItems = formItems
      this.panelChangeConfirm(panel)
    },
    panelChangeConfirm (panel) {
      const insertIndex = this.getInsertIndex(panel)
      const editPanel = this.collapsePanels[insertIndex]
      editPanel.extend = panel.extend
      editPanel.title = panel.title
      editPanel.tips = panel.tips
      editPanel.url = panel.url
      editPanel.method = panel.method
      editPanel.showOnNodes = panel.showOnNodes
      editPanel.component = panel.component
      this.$emit('update', this.collapsePanels)
      this.$forceUpdate()
    },
    // 如果是编辑，就获取需要修改的下标
    getInsertIndex (panel) {
      let insertIndex = null
      for (let i = 0; i < this.collapsePanels.length; i++) {
        const item = this.collapsePanels[i]
        if (item.title === panel.title) {
          insertIndex = i
          break
        }
      }
      return insertIndex
    }
  }
}

</script>
<style lang="less" scoped>
.tab-title {
  padding: 0 0.5rem 0 0;
}
.warn {
  color: red;
}
</style>
