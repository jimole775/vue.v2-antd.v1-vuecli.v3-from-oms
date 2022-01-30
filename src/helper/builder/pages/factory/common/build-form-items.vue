<template>
  <div>
    <a-form class="form-wrap">
      <a-row>
        <a-col v-for="(item, index) in formItems" :key="index" :span="item.layout ? item.layout.span : 6">
          <a-form-item
            :label="item.key"
            :label-col="{ span: item.layout ? item.layout.label : 6 }"
            :wrapper-col="{ span: item.layout ? item.layout.wrapper : 16 }"
          >
            <div style="text-align: center;border: 1px solid rgb(45 200 77);">
              {{ item.configType === 'selection' ? item.component : 'Function' }}&nbsp;&nbsp;
              <a @click="() => editFormItem(item)"><a-icon type="edit" /></a>
            </div>
          </a-form-item>
        </a-col>
        <a-col :span="6">
          <a-form-item label=" " :label-col="{ span: 0 }" :wrapper-col="{ span: 16 }">
            <a-tooltip :title="config.anchorTips">
              <a-button type="primary" ghost @click="addFormItem">
                {{ config.anchorText }}
              </a-button>
            </a-tooltip>
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <AddFormItem :modal="modal" @update="formItemConfirm" />
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
      type: Array,
    },
    config: {
      type: Object,
      default: () => ({
        anchorTips: '',
        anchorText: '配置表单'
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
  watch: {
    dataSource: {
      handler (data) {
        if (data) {
          this.formItems = data
        }
      },
      immediate: true
    }
  },
  methods: {
    addFormItem () {
      this.modal.show = true
      this.modal.data = undefined
    },
    editFormItem (item) {
      this.modal.show = true
      this.modal.data = item
    },
    formItemConfirm (componentInfo) {
      let assertIndex = null
      for (let i = 0; i < this.formItems.length; i++) {
        const item = this.formItems[i]
        if (item.key === componentInfo.key) {
          assertIndex = i
          break
        }
      }
      const copy = utils.clone(componentInfo)
      if (assertIndex === null) {
        this.formItems.push(copy)
      } else {
        this.formItems[assertIndex] = copy
        this.$forceUpdate()
      }
      this.$emit('update', this.formItems)
    }
  }
}
</script>
