<template>
  <div>
    <a-form class="form-wrap">
      <a-row>
        <a-col v-for="(item, index) in formItems" :key="index" :span="item.layout ? item.layout.span : defaultLayout.span">
          <a-form-item
            :label="item.title"
            :label-col="{ span: item.layout ? item.layout.label : defaultLayout.label }"
            :wrapper-col="{ span: item.layout ? item.layout.wrapper : defaultLayout.wrapper }"
          >
            <div style="text-align: center;border: 1px solid rgb(45 200 77);">
              <a style="color: red;" @click.stop="() => reduceFormItem(index)"><a-icon type="minus-circle" /></a>
              &nbsp;{{ item.component ? item.component : 'Function' }}&nbsp;
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
            <a-tooltip :title="config.anchorTips">
              <a-button type="primary" ghost @click="addFormItem">
                {{ config.anchorText }}
              </a-button>
            </a-tooltip>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <AddFormItem :modal="modal" :config="config" @update="formItemConfirm" />
  </div>
</template>
<script>
import utils from '@/utils'
import AddFormItem from './add-form-item.vue'
export default {
  components: {
    AddFormItem
  },
  props: {
    dataSource: {
      type: Array
    },
    config: {
      type: Object,
      default: () => ({
        anchorTips: '',
        anchorText: '配置表单',
        layout: 'h',
        operations: [] // 显示operations的radio选项
      })
    }
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
    defaultLayout () {
      if (this.config.layout === 'h' || this.config.layout === undefined) {
        return {
          span: 6,
          label: 6,
          wrapper: 16,
          addButton: {
            span: 6,
            label: 0,
            wrapper: 16
          }
        }
      } else {
        return {
          span: 24,
          label: 2,
          wrapper: 16,
          addButton: {
            span: 24,
            label: 2,
            wrapper: 16
          }
        }
      }
    }
  },
  watch: {
    dataSource: {
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
