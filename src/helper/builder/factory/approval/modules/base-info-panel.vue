<template>
  <div>
    <a-collapse
      :bordered="false"
      :active-key="['1']"
    >
      <a-collapse-panel
        class="m-block"
        key="1"
      >
        <template slot="header">
          <div>
            <span class="tab-title">{{ panel.title }}</span>
            <a-tooltip class="tab-title" v-if="panel.tips" :title="panel.tips">
              <a-icon type="question-circle-o" />
            </a-tooltip>
            <a-tooltip title="重置表单配置">
              <a class="tab-title" @click.stop="() => resetFormItem()"><a-icon type="redo" /></a>
            </a-tooltip>
            <a-tooltip title="根据列表配置内容，自动构建表单">
              <a class="tab-title" @click.stop="() => importFormItem()"><a-icon type="import" /></a>
            </a-tooltip>
            <a-tooltip title="新增板块">
              <a class="tab-title" @click.stop="addCollapse"><a-icon type="plus-circle" /></a>
            </a-tooltip>
            <a-tooltip title="编辑板块">
              <a class="tab-title" @click.stop="() => editCollapse(panel)"><a-icon type="edit" /></a>
            </a-tooltip>
          </div>
        </template>
        <ConfigFormItems
          :key="panel.formItems && panel.formItems.length"
          :nodes="availNodes"
          :radios="radios"
          :value="panel.formItems"
          @update="formItemConfirm"
        />
      </a-collapse-panel>
    </a-collapse>
    <ConfigBasePanel
      :title="'基础信息'"
      :modal="editModal"
      :nodes="availNodes"
      @update="panelEditionConfirm"
    />
    <ConfigCollapsePanel
      :modal="addModal"
      :radios="radios"
      :nodes="availNodes"
      :component-able="true"
      @update="panelAdditionConfirm"
    />
  </div>
</template>
<script>
import utils from '@/utils'
import ConfigFormItems from '@builder/config-modules/config-form-items'
import ConfigBasePanel from '@builder/config-modals/config-base-panel'
import ConfigCollapsePanel from '@builder/config-modals/config-collapse-panel'

export default {
  components: {
    ConfigFormItems,
    ConfigBasePanel,
    ConfigCollapsePanel
  },
  props: {
    value: { type: Object },
    nodes: { type: Array, default: () => [] },
    radios: { type: Array, default: () => [] } // 显示operations的radio选项
  },
  data () {
    return {
      panel: {
        tips: '',
        title: '基本信息',
        extend: true,
        formItems: []
      },
      editModal: {
        show: false,
        data: {}
      },
      addModal: {
        show: false,
        data: {}
      },
      detailApi: {}
    }
  },
  computed: {
    availNodes () {
      return this.nodes.filter(i => i.value !== '__addition__')
    }
  },
  watch: {
    value: {
      handler ({ panel, detail }) {
        if (!utils.isEmptyObject(panel)) {
          this.panel = utils.clone(panel)
        }
        if (!utils.isEmptyObject(detail)) {
          this.detailApi = detail
        }
        // if (columns) {
        //   this.defaultFormItems(columns)
        // }
      },
      immediate: true
    },
    nodes: {
      handler (nodes) {
        if (nodes && nodes.length) {
          this.panel.showOnNodes = utils.clone(this.availNodes.map(i => i.value))
        }
      },
      immediate: true
    }
  },
  methods: {
    importFormItem () {
      const columns = this.value.columns || []
      if (columns.length) {
        if (this.panel.formItems && this.panel.formItems.length) {
          this.$modal.confirm({
            title: '提示',
            content: '检测到你已经配置了“基本信息”的表单项，如果再次构建，那么将会覆盖当前已配置的内容，请三思！',
            onOk: () => {
              this.buildFormItemFromColumns(columns)
            }
          })
        } else {
          this.buildFormItemFromColumns(columns)
        }
      } else {
        this.$message.warning('请先配置列表！')
      }
    },
    buildFormItemFromColumns (columns = []) {
      const formItems = columns.map((col) => ({
        label: col.title || col.originTitle,
        key: col.dataIndex || col.key,
        layout: { span: 6, label: 8, wrapper: 16 }
      })).filter((i) => i.label)
      if (formItems && formItems.length) {
        this.panel.formItems = formItems
        this.$emit('modify', { panel: this.panel })
      }
    },
    resetFormItem () {
      this.$modal.confirm({
        title: '提示',
        content: '是否重置“基本信息”的表单？',
        onOk: () => {
          this.panel.formItems = []
          this.$emit('modify', { panel: this.panel })
        }
      })
    },
    addCollapse () {
      this.addModal.show = true
      this.addModal.data = undefined
    },
    editCollapse (panel) {
      this.editModal.show = true
      this.editModal.data = { panel: panel, detail: this.detailApi }
    },
    formItemConfirm (formItems = []) {
      this.panel.formItems = formItems
      this.$emit('modify', { panel: this.panel })
    },
    panelEditionConfirm (complexInfo) {
      this.panel = {
        ...utils.clone(complexInfo.panel),
        formItems: this.panel.formItems
      }
      this.detailApi = utils.clone(complexInfo.detail)
      this.$emit('modify', { panel: this.panel, detail: this.detailApi })
    },
    panelAdditionConfirm (panel) {
      this.$emit('increase', {
        ...panel,
        formItems: []
      })
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
