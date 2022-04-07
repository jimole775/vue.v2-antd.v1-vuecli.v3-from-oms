<script>
import utils from '@/utils'
import http from '@/utils/http'
import { string2func, jsx2vue } from '@builder/utils'
import AddColumnsItem from '../modals/add-columns-item.vue'
export default {
  components: {
    AddColumnsItem
  },
  props: {
    tab: {
      type: Object,
      default: () => ({})
    },
    bridge: {
      type: Object,
      default: () => ({})
    },
    dataSource: {
      type: Array,
      default: () => []
    }
  },
  data () {
    return {
      modal: {
        show: false,
        data: undefined,
        columns: []
      },
      scope: this,
      columns: [],
      currentApi: {},
      dataList: []
    }
  },
  watch: {
    dataSource: {
      handler (columns) {
        // todo 把 columns中的props属性解析到最外层
        this.columns = deployDefaultProps(columns)
      },
      immediate: true
    },
    tab: {
      handler (tab) {
        if (tab.api) {
          if (!this.currentApi.url) {
            this.currentApi = tab.api
            this.testFetch(tab.api)
          }
          if (this.currentApi.url !== tab.api.url) {
            // 如果 api 重新赋值，那么 columns 和 dataList 需要置空
            this.columns.length = 0
            this.dataList.length = 0
            this.currentApi = tab.api
            this.testFetch(tab.api)
          }
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    // 尝试获取样例数据
    async testFetch (api) {
      if (api.url) {
        const fn = http[api.method.toLocaleLowerCase()] || function () {}
        const params = api.method === 'GET' ? { params: api.params } : api.params
        try {
          const res = await fn.apply(http, [api.url, params])
          if (res.code === 200) {
            const dataModel = res.data[0]
            this.dataList = [dataModel]
            if (this.columns.length === 0) {
              this.defaultColumns(dataModel)
            }
          }
        } catch (error) {
          console.log(error)
        }
      }
    },
    defaultColumns (row) {
      this.columns = [
        {
          width: 100,
          id: '__addition__',
          dataIndex: '__addition__',
          slots: { title: '__addition__Title' }
        },
        ...Object.keys(row).map((key) => ({
          id: key,
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
    callScopedSlotsRender (col) {
      const aRow = this.dataList[0] || {}
      col.scopedSlotsRender.bind(this)
      return col.scopedSlotsRender(this.$createElement, aRow, this.scope)
    },
    callSlotsRender (item) {
      return item.slotsRender(this.$createElement, this.scope)
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
      this.modal.columns = utils.clone(this.columns)
    },
    editColumnsItem (item) {
      this.modal.show = true
      this.modal.data = item
      this.modal.columns = utils.clone(this.columns)
    },
    columnsItemConfirm (column) {
      const aColumn = adjustColumn(column)
      let insertIndex = null
      for (let i = 0; i < this.columns.length; i++) {
        const item = this.columns[i]
        if (item.id === aColumn.id) {
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
      // if (this.dataList[0]) {
      //   const val = this.dataList[0][aColumn.dataIndex]
      //   !val && (this.dataList[0][aColumn.dataIndex] = '样例数据')
      // }
      this.$emit('update', this.columns)
    },
    buildTHead () {
      return this.columns.map((item, index) => {
        // __addition__: 新增按钮的col
        // __columns__: 普通的col
        const evalReduceNode = (item) => {
          const map = {
            __addition__: ' ',
            __columns__: (<a style="color: red;" onClick={() => this.reduceColumnsItem(index)}><a-icon type="minus-circle" /></a>)
          }
          return map[item.dataIndex] ? map[item.dataIndex] : map['__columns__']
        }
        const evalAddNode = (item) => {
          const map = {
            __addition__: (<a-button ghost type="primary" onClick={() => this.addColumnsItem()}>+</a-button>),
            __columns__: (<a onClick={() => this.editColumnsItem(item)}><a-icon type="edit" /></a>)
          }
          return map[item.dataIndex] ? map[item.dataIndex] : map['__columns__']
        }
        const evalTitleNode = (item) => {
          if (item.title) return <span style="padding: 0 0.3rem;">{ item.title }</span>
          if (item.slotsRender) return <span style="padding: 0 0.3rem;">{ this.callSlotsRender(item) }</span>
          if (item.props && item.props.title) return <span style="padding: 0 0.3rem;">{ item.props.title }</span>
        }
        return (
          <template slot={item.slots && item.slots.title}>
            <div>
              { evalReduceNode(item) }
              { evalTitleNode(item) }
              { evalAddNode(item) }
            </div>
          </template>
        )
      })
    },
    buildTBody () {
      const aRow = this.dataList[0] || {}
      const evalContent = (col) => {
        const text = aRow[col.dataIndex]
        if (col.anchor) {
          return <a onClick={() => this.bridge.projectApproval(aRow)}>{ text }</a>
        } else {
          return col.scopedSlotsRender
            ? this.callScopedSlotsRender(col)
            : text
        }
      }
      return this.columns.map((col) => {
        return (
          <template slot={col.scopedSlots && col.scopedSlots.customRender}>
            <div>{ evalContent(col) }</div>
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
      <AddColumnsItem modal={this.modal} onUpdate={this.columnsItemConfirm} />
    </div>)
  }
}
function deployDefaultProps (columns) {
  return columns.map((col) => {
    const props = col.props
    if (!props) return col
    // 添加表头提示
    if (props.titleTips) {
      if (!props.slotsRender) {
        delete col.title
        // delete col.props.title
        col.slots = { title: props.dataIndex + 'Title' }
        col.slotsRender = (h, vm) => {
          return (
            <a-tooltip title={props.titleTips}>
              { col.originTitle }
              <a-icon type="question-circle-o" />
            </a-tooltip>
          )
        }
      }
    }

    if (props.slotsRender) {
      delete col.title
      // delete col.props.title
      col.slots = { title: props.dataIndex + 'Title' }
      col.slotsRender = (h, vm) => {
        return new Function(props.slotsRender)(h, vm)
      }
    }

    if (props.scopedSlotsRender) {
      col.scopedSlots = { customRender: props.dataIndex }
      // 这里复制必须是 function，如果是 () => {} 可能导致内部的this丢失
      col.scopedSlotsRender = string2func(jsx2vue(`function (h, record, vm) {
        ${props.scopedSlotsRender}
      }`))
    }
    return col
  })
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
