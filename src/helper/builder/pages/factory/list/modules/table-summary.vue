<template>
  <div>
    <div class="btn-wrap clearfix summary">
      <template v-for="(item, index) in summaryItems">
        <ConfigButton :value="item" :key="index" @change="summaryItemConfirm" />
      </template>
    </div>
  </div>
</template>
<script>
import ConfigButton from '@/helper/builder/pages/factory/common/config-button'
export default {
  components: {
    ConfigButton
  },
  data () {
    return {
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
      },
      summaryItems: [
        {
          url: undefined,
          method: undefined,
          params: undefined,
          title: '列表'
        },
        {
          url: undefined,
          method: undefined,
          params: undefined,
          title: '创建'
        },
        {
          url: undefined,
          method: undefined,
          params: undefined,
          title: '申请'
        },
        {
          url: undefined,
          method: undefined,
          params: undefined,
          title: '审批'
        },
        {
          url: undefined,
          method: undefined,
          params: undefined,
          title: '撤回'
        },
        {
          url: undefined,
          method: undefined,
          params: undefined,
          title: '废弃'
        },
        {
          url: undefined,
          method: undefined,
          params: undefined,
          title: '关闭'
        },
        {
          url: undefined,
          method: undefined,
          params: undefined,
          title: '转审'
        },
        {
          url: undefined,
          method: undefined,
          params: undefined,
          title: '导出'
        }
      ],
      modal: {
        show: false,
        data: undefined
      }
    }
  },
  methods: {
    editSummaryItem (item) {
      this.modal.show = true
      this.modal.data = item
    },
    summaryItemConfirm (summaryInfo) {
      this.summaryItems.forEach((item) => {
        if (item.title === summaryInfo.title) {
          item.url = summaryInfo.url
          item.method = summaryInfo.method
          item.params = summaryInfo.params
        }
      })
      this.$emit('update', this.summaryItems)
    }
  }
}
</script>
<style lang="less" scoped>
.summary-disabled {
    color: rgba(0, 0, 0, 0.25);
    background-color: #f5f5f5;
    border-color: #d9d9d9;
    text-shadow: none;
    -webkit-box-shadow: none;
    box-shadow: none;
}
</style>
