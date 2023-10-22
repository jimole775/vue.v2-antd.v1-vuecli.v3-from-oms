<script>
import { mapState } from 'vuex'
import STable from '@/components/STable'
import utils from '@/utils'
import baseMixins from '@/mixins/baseMixins.js'

export default {
  components: {
    STable
  },
  mixins: [baseMixins],
  props: {
    list: {
      type: Object,
      required: true
    },
    apimap: {
      type: Object,
      required: true
    },
    transferSearchor: {
      type: Function,
      required: true
    },
    bridge: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      scope: this,
      dataList: [],
      selectRows: []
    }
  },
  computed: {
    ...mapState({
      user: state => state.global.user,
      roleType: state => state.global.userRole.type
    }),
    listapi () {
      return this.apimap.list || { batch: {} }
    },
    isOutsideStuff () {
      return this.roleType === 'SUPPLIER' || this.roleType === 'OUT'
    },
    summary () {
      return this.list.summary || []
    },
    searchor () {
      return this.transferSearchor(this.queryPermissionItem(this.list.searchor || []))
    },
    columns () {
      const columns = this.list.columns || []
      return this.queryPermissionItem(columns)
    }
  },
  methods: {
    evalBatchApi (apiObject = {}) {
      const api = apiObject.api || ''
      const permission = apiObject.permission || ''
      if (permission === undefined) {
        return api
      } else {
        return this.vaildateBatchButton(permission) ? api : ''
      }
    },
    vaildateBatchButton (ability) {
      if (utils.isValuable(ability)) {
        return this.hasCatalogButton(ability)
      } else {
        return true
      }
    },
    queryPermissionItem (list) {
      // 外部人员标识为1，内部为0
      const SIGN = this.isOutsideStuff ? 1 : 0
      return list.filter(item => {
        if (!utils.isEmpty(item.permission)) {
          // item.permission 中被填入的有可能时字符串，也有可能是数字
          return item.permission.includes(SIGN) || item.permission.includes(SIGN + '')
        } else {
          return true
        }
      })
    },
    fixTextWrapper () {
      // 如果文本长度超过20，就省略掉
      const h = this.$createElement
      const maxLen = 20
      return (text, record, index) => {
        if (utils.isString(text) && text.length > maxLen) {
          return h('a-tooltip', {
            props: {
              title: text
            }
          }, [
            h('span', text.substring(0, maxLen) + '...')
          ])
        } else {
          return text
        }
      }
    },
    projectApproval (record) {
      this.$emit('addDetailTab', '2', record)
    },
    projectApply () {
      this.$emit('addDetailTab', '1')
    },
    selectChange (selectKeys, selectRows) {
      this.selectRows = selectRows
    },
    updateDataSet (val) {
      this.selectRows = []
      this.dataList = val
    },
    async reload () {
      await this.$refs.STableRef
      this.$refs.STableRef.reload()
    }
  },
  render (h) {
    const summarySlots = getSummarySlots.call(this, h)
    const { batch = {}, table = {} } = this.listapi
    const bridge = {
      ...this.bridge,
      reload: this.reload,
      projectApply: this.projectApply,
      projectApproval: this.projectApproval
    }
    return (
      <div>
        <STable
          ref={'STableRef'}
          bridge={bridge}
          columns={this.columns}
          searchor={this.searchor}
          data-api={table.dataApi}
          data-dir={table.dataDir}
          is-selection={table.isSelection}
          flow-status-field={table.flowStatusField}
          row-key={table.rowKey || 'flowInstanceId'}
          pass-api={this.evalBatchApi(batch.pass)}
          close-api={this.evalBatchApi(batch.close)}
          template-api={this.evalBatchApi(batch.template)}
          import-api={this.evalBatchApi(batch.import)}
          export-api={this.evalBatchApi(batch.export)}
          unpass-api={this.evalBatchApi(batch.unpass)}
          revoke-api={this.evalBatchApi(batch.revoke)}
          cancel-api={this.evalBatchApi(batch.cancel)}
          delete-api={this.evalBatchApi(batch.delete)}
          reject-api={this.evalBatchApi(batch.reject)}
          abandon-api={this.evalBatchApi(batch.abandon)}
          transfer-api={this.evalBatchApi(batch.transfer)}
          is-pagination={true}
          onUpdate={this.updateDataSet}
          onSelectChange={this.selectChange}
        >
          { summarySlots }
        </STable>
      </div>
    )
  }
}

// 获取插槽提供的按钮
function getSummarySlots (h) {
  const applyInfo = this.apimap.apply || {}
  const anchorText = applyInfo.anchorText || '申请'
  return (
    <template slot="summary">
      {
        this.evalBatchApi({ api: applyInfo.submit, permission: applyInfo.permission }) &&
        <a-button
          type="primary"
          onClick={() => this.projectApply()}
        >
          { anchorText }
        </a-button>
      }
      { this.summary.map((summRender) => summRender(this.$createElement, this.scope)) }
    </template>
  )
}

</script>
