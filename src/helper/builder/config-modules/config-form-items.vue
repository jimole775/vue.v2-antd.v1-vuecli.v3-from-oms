<template>
  <div>
    <a-form class="form-wrap">
      <a-row>
        <a-col v-for="(item, index) in formItems" :key="index" :span="item.layout ? item.layout.span : defaultLayout.span">
          <a-form-item
            :label="item.label"
            :label-col="{ span: item.layout ? item.layout.label : defaultLayout.label }"
            :wrapper-col="{ span: item.layout ? item.layout.wrapper : defaultLayout.wrapper }"
          >
            <div style="text-align: center;border: 1px solid rgb(45 200 77);">
              <a style="color: red;" @click.stop="() => reduceFormItem(index)"><a-icon type="minus-circle" /></a>
              &nbsp;{{ item.component ? item.component : item.wrapperCustomRender ? 'Function' : 'Readonly' }}&nbsp;
              <a @click.stop="() => editFormItem(item)"><a-icon type="edit" /></a>
            </div>
          </a-form-item>
        </a-col>
        <a-col :span="defaultLayout.addButton.span">
          <a-form-item
            label=" "
            :label-col="{ span: defaultLayout.addButton.label }"
            :wrapper-col="{ span: defaultLayout.addButton.wrapper }"
          >
            <a-tooltip :title="anchorTips">
              <a-button type="primary" ghost @click="addFormItem">
                {{ anchorText }}
              </a-button>
            </a-tooltip>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <ConfigFormItem
      :modal="modal"
      :radios="radios"
      :nodes="nodes"
      @update="formItemConfirm"
    />
  </div>
</template>
<script>
import utils from '@/utils'
import ConfigFormItem from '../config-modals/config-form-item.vue'
export default {
  components: {
    ConfigFormItem
  },
  props: {
    value: { type: Array },
    anchorTips: { type: String, default: '' },
    anchorText: { type: String, default: '配置表单' },
    layout: { type: String, default: 'h' },
    nodes: { type: Array, default: () => [] },
    radios: { type: Array, default: () => [] } // 显示operations的radio选项
  },
  data () {
    return {
      formItems: [],
      modal: {
        show: false,
        data: undefined
      }
    }
  },
  computed: {
    isHorizontalLayout () {
      return this.layout === 'h' || this.layout === undefined
    },
    defaultLayout () {
      return this.isHorizontalLayout
        ? { span: 6, label: 8, wrapper: 16, addButton: { span: 6, label: 2, wrapper: 16 } }
        : { span: 24, label: 2, wrapper: 16, addButton: { span: 24, label: 2, wrapper: 16 } }
    }
  },
  watch: {
    value: {
      handler (data) {
        if (data && data.length) {
          this.formItems = data
        }
      },
      immediate: true
    }
  },
  methods: {
    reduceFormItem (index) {
      this.$modal.confirm({
        title: '提示',
        content: '是否删除？',
        onOk: () => {
          this.formItems.splice(index, 1)
          this.update()
        }
      })
    },
    addFormItem () {
      this.modal.show = true
      this.modal.data = {
        layout: {
          span: this.defaultLayout.span,
          label: this.defaultLayout.label,
          wrapper: this.defaultLayout.wrapper
        }
      }
    },
    editFormItem (item) {
      this.modal.show = true
      this.modal.data = item
    },
    formItemConfirm (componentInfo) {
      const copy = utils.clone(componentInfo)
      const insertIndex = this.getInsertIndex(componentInfo)
      if (insertIndex === null) {
        this.formItems.push(copy)
      } else {
        this.formItems[insertIndex] = copy
        this.$forceUpdate()
      }
      this.update()
    },
    // 如果是编辑，就获取需要修改的下标
    getInsertIndex (componentInfo) {
      let insertIndex = null
      for (let i = 0; i < this.formItems.length; i++) {
        const item = this.formItems[i]
        if (item.key === componentInfo.key) {
          insertIndex = i
          break
        }
      }
      return insertIndex
    },
    update () {
      this.$emit('update', this.formItems)
    }
  }
}
</script>
