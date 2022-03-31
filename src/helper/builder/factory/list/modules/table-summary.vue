<template>
  <div>
    <div class="btn-wrap clearfix summary">
      <template v-for="key in Object.keys(summaryObject)">
        <ApiButton
          :key="key"
          :value="summaryObject[key]"
          @update="summaryItemConfirm"
        />
      </template>
    </div>
  </div>
</template>
<script>
import ApiButton from '@builder/config-modules/api-button'
export default {
  components: {
    ApiButton
  },
  props: {
    dataSource: {
      type: Object,
      default: () => ({})
    }
  },
  watch: {
    dataSource: {
      handler (data) {
        if (!this.$utils.isEmptyObject(data)) {
          Object.keys(data).forEach((key) => {
            this.$set(this.summaryObject, key, data[key])
          })
        }
      },
      immediate: true
    }
  },
  data () {
    return {
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
      },
      summaryObject: {
        approval: {
          url: undefined,
          method: undefined,
          params: undefined,
          key: 'approval',
          label: '审批'
        },
        transfer: {
          url: undefined,
          method: undefined,
          params: undefined,
          key: 'transfer',
          label: '转审'
        },
        revoke: {
          url: undefined,
          method: undefined,
          params: undefined,
          key: 'revoke',
          label: '撤回'
        },
        reject: {
          url: undefined,
          method: undefined,
          params: undefined,
          key: 'reject',
          label: '驳回'
        },
        abandon: {
          url: undefined,
          method: undefined,
          params: undefined,
          key: 'abandon',
          label: '废弃'
        },
        close: {
          url: undefined,
          method: undefined,
          params: undefined,
          key: 'close',
          label: '关闭'
        },
        delete: {
          url: undefined,
          method: undefined,
          params: undefined,
          key: 'delete',
          label: '删除'
        },
        export: {
          url: undefined,
          method: undefined,
          params: undefined,
          key: 'export',
          label: '导出'
        }
      },
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
      const item = this.summaryObject[summaryInfo.key]
      item.url = summaryInfo.url
      item.method = summaryInfo.method
      item.params = summaryInfo.params
      item.permission = summaryInfo.permission
      this.$emit('update', this.summaryObject)
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
