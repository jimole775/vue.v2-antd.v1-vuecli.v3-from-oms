<script>
import utils from '@/utils'
import AddColumnsItem from '../modals/add-columns-item.vue'
export default {
  components: {
    AddColumnsItem
  },
  props: {
    dataSource: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      modal: {
        show: false,
        data: undefined
      },
      scope: this,
      columns: [],
      dataList: []
    }
  },
  watch: {
    dataSource: {
      handler (data) {
        const row = data[0] || {}
        this.defaultList(row)
        this.defaultColumns(row)
        this.$emit('update', this.columns)
      },
      immediate: true
    }
  },
  methods: {
    defaultColumns (row) {
      this.columns = [
        {
          width: 100,
          dataIndex: '__addition__',
          slots: { title: '__addition__Title' }
        },
        ...Object.keys(row).map((key) => ({
          width: 100,
          dataIndex: key,
          slots: { title: key + 'Title' },
          slotsRender (h, vm) {
            return key
          },
          props: {
            width: 100,
            title: key,
            dataIndex: key
          }
        }))
      ]
    },
    defaultList (row) {
      this.dataList = [{
        __addition__: '新增操作',
        ...row
      }]
    },
    projectApproval () {
      this.$emit('projectApproval')
    },
    callScopedSlotsRender (item) {
      return item.scopedSlotsRender(this.$createElement, this.dataList[0], this)
    },
    callSlotsRender (item) {
      return item.slotsRender(this.$createElement, this)
    },
    reduceColumnsItem (index) {
      this.$modal.confirm({
        title: '提示',
        content: '是否删除？',
        onOk: () => {
          this.columns.splice(index, 1)
        }
      })
    },
    addColumnsItem () {
      this.modal.show = true
      this.modal.data = undefined
    },
    editColumnsItem (item) {
      this.modal.show = true
      this.modal.data = item
    },
    columnsItemConfirm (column) {
      const aColumn = adjustColumn(column)
      let insertIndex = null
      for (let i = 0; i < this.columns.length; i++) {
        const item = this.columns[i]
        if (item.dataIndex === aColumn.dataIndex) {
          insertIndex = i
          break
        }
      }
      if (insertIndex === null) {
        this.columns.push(aColumn)
      } else {
        this.columns[insertIndex] = aColumn
        this.$forceUpdate()
      }
      if (this.dataList[0]) {
        const val = this.dataList[0][aColumn.dataIndex]
        !val && (this.dataList[0][aColumn.dataIndex] = '样例数据')
      }
      this.$emit('update', this.columns)
    },
    buildTHead () {
      return this.columns.map((item, index) => {
        const titleNode = {
          __addition__: (<a-button ghost type="primary" onClick={() => this.addColumnsItem()}>+</a-button>),
          __columns__: (<a onClick={() => this.editColumnsItem(item)}><a-icon type="edit" /></a>)
        }
        const reduceNode = {
          __addition__: ' ',
          __columns__: (<a style="color: red;" onClick={() => this.reduceColumnsItem(index)}><a-icon type="minus-circle" /></a>)
        }
        return (
          <template slot={item.slots && item.slots.title}>
            <div>
              {
                reduceNode[item.dataIndex] ? reduceNode[item.dataIndex] : reduceNode['__columns__']
              }
              <span style="padding: 0 0.3rem;">{ item.slotsRender ? this.callSlotsRender(item) : item.title }</span>
              {
                titleNode[item.dataIndex] ? titleNode[item.dataIndex] : titleNode['__columns__']
              }
            </div>
          </template>
        )
      })
    },
    buildTBody () {
      return this.columns.map((item) => {
        return (
          <template slot={item.scopedSlots && item.scopedSlots.customRender}>
            <div>
              {
                item.scopedSlotsRender
                  ? this.callScopedSlotsRender(item)
                  : this.dataList[0][item.dataIndex]
              }
            </div>
          </template>
        )
      })
    }
  },
  render (h) {
    return (<div>
      <a-table
        columns={this.columns}
        data-source={this.dataList}
      >
        {
          this.buildTHead()
        }
        {
          this.buildTBody()
        }
      </a-table>
      <AddColumnsItem modal={this.modal} onUpdate={this.columnsItemConfirm} onProjectApproval={this.projectApproval} />
    </div>)
  }
}

function adjustColumn (column) {
  const res = utils.clone(column)
  // 默认设置 【slots】
  // 使可以填充 【edit】按钮
  if (!res.slots) {
    res.slots = { title: res.dataIndex + 'Title' }
    res.slotsRender = (h, vm) => {
      return res.originTitle
    }
  }
  delete res.title
  return res
}
</script>
