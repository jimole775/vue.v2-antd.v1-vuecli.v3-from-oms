<template>
  <div>
    <div class="btn-wrap clearfix summary">
      <template v-for="key in Object.keys(summaryObject)">
        <ApiButton
          :key="key"
          :value="summaryObject[key]"
          @update="summaryItemConfirm"
        >
          <template v-if="key === 'list'" slot="custom">
            <a-col :span="24">
              <a-form-item :label-col="{span: 6}" :wrapper-col="{span: 16}">
                <template slot="label">
                  <a-tooltip title="接口返回的数据的路径，比如：data.records.list，就可以设置为'records.list'">
                    <span>数据路径 <a-icon type="question-circle-o" /></span>
                  </a-tooltip>
                </template>
                <a-input v-decorator="['dataDir', {initialValue: '', rules: [{ required: false }]}]" />
              </a-form-item>
            </a-col>
          </template>
        </ApiButton>
      </template>
    </div>
  </div>
</template>
<script>
import ApiButton from '@/helper/builder/factory/config-modules/api-button'
export default {
  components: {
    ApiButton
  },
  data () {
    return {
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 16 }
      },
      summaryObject: {
        list: {
          key: 'list',
          label: '列表',
          url: undefined,
          method: undefined,
          params: undefined
        },
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
