<script>
import utils from '@/utils'
import api from '@/api'
const indexKey = '_index_'
// 如果文本长度超过20，就省略掉
const cellMaxCharLen = 20
export default {
  title: '标准表格',
  name: 'STable',
  props: {
    columns: {
      type: Array,
      default: () => []
    },
    dataSource: {
      type: Array,
      default: null
    },
    dataApi: {
      // api名字，STable会以api[this.dataApi]的方式调用
      type: String | Function,
      default: null
    },
    searchor: {
      type: Array, // 查询组件定制模板
      default: () => []
    },
    dataParams: {
      // 插入查询参数，这个参数会触发fetch
      type: Object,
      default: null
    },
    dataDir: {
      // 由于数据接口的不统一，使用这个来确定列表数据在接口中的位置
      type: String,
      default: null
    },
    flowStatusField: {
      // 用来指定每一行数据的状态字段名, 默认'flowNode'
      type: String,
      default: 'flowNode'
    },
    expandApi: {
      // 如果是树级列表，点击展开的时候，需要单独的expandApi拉取子项的数据
      type: String | Function,
      default: null
    },
    deleteApi: {
      // 删除的接口
      type: String | Function,
      default: null
    },
    exportApi: {
      // 导出的接口
      type: String | Function,
      default: null
    },
    importApi: {
      // 导入的接口
      type: String | Function,
      default: null
    },
    templateApi: {
      // 下载导入模板的接口
      type: String | Function,
      default: null
    },
    abandonApi: {
      // 批量放弃
      type: String | Function,
      default: null
    },
    cancelApi: {
      // 批量作废
      type: String | Function,
      default: null
    },
    passApi: {
      // 批量通过
      type: String | Function,
      default: null
    },
    unpassApi: {
      // 批量不通过（大部分情况下，和驳回同一个接口）
      type: String | Function,
      default: null
    },
    rejectApi: {
      // 批量驳回
      type: String | Function,
      default: null
    },
    revokeApi: {
      // 批量撤回
      type: String | Function,
      default: null
    },
    transferApi: {
      // 批量转审
      type: String | Function,
      default: null
    },
    closeApi: {
      // 批量关闭
      type: String | Function,
      default: null
    },
    fetchImmediate: {
      // 是否立即查询数据
      type: Boolean,
      default: true
    },
    mergeIndexBy: {
      type: String,
      default: ''
    },
    mergeKeys: {
      type: Array,
      default: () => []
    },
    isPagination: {
      // 是否使用翻页
      type: Boolean,
      default: true
    },
    isSelection: {
      // 是否需要勾选框
      type: Boolean,
      default: true
    },
    isRank: {
      // 显示序号
      type: Boolean,
      default: false
    },
    isHideEmptyCol: {
      type: Boolean,
      default: false
    },
    rowKey: {
      // 确定每行的key绑定的字段
      type: String,
      default: 'id'
    },
    selectMode: {
      // 单选还是多选
      type: String,
      default: 'checkbox'
    },
    tableName: {
      // 当前列表名，主要用于下载列表
      type: String,
      default: '列表'
    },
    anchorFunction: {
      // 详情锚点的函数
      type: Function,
      default: null
    },
    bridge: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      mergeIndexRowCount: 0,
      mergeSpanRecords: {},
      queryParams: {},
      dataList: [],
      fileList: [],
      isLoading: false,
      isReset: false,
      // isSearchorExpand: true,
      searchorGroups: [], // 显示搜索栏
      dataParamsCache: {},
      selectedRows: [],
      selectedRowKeys: [],
      expandedRowKeys: [],
      columnSlots: [],
      columnScopedSlots: [],
      columnModifyDelayEvalutions: [],
      scope: this,
      modal: {
        show: false,
        info: {},
        form: this.$form.createForm(this)
      },
      pagination: {
        current: 1,
        pageSize: this.$props.mergeIndexBy ? 5 : 10,
        total: 0,
        showSizeChanger: true,
        showTotal: (total) => `共 ${total} 条`,
        pageSizeOptions: ['5', '10', '20', '50', '100']
      }
    }
  },
  computed: {
    modalinfomap() {
      return {
        pass: {
          type: 'pass',
          label: '通过',
          api: this.passApi,
          columns: [],
          approvalResult: '1',
          listTitle: '通过项目:',
          reasonTitle: '审批说明:',
          opreationTips: '审批成功'
        },
        reject: {
          type: 'reject',
          label: '驳回',
          api: this.rejectApi,
          columns: [],
          approvalResult: '2',
          listTitle: '驳回项目:',
          reasonTitle: '驳回原因:',
          opreationTips: '驳回成功'
        },
        unpass: {
          type: 'unpass',
          label: '不通过',
          api: this.unpassApi,
          columns: [],
          approvalResult: '3',
          listTitle: '不通过项目:',
          reasonTitle: '不通过原因:',
          opreationTips: '操作成功'
        },
        revoke: {
          type: 'revoke',
          label: '撤回',
          api: this.revokeApi,
          columns: [],
          approvalResult: '4',
          listTitle: '撤回项目:',
          reasonTitle: '撤回原因:',
          opreationTips: '撤回成功'
        },
        close: {
          type: 'close',
          label: '关闭',
          api: this.closeApi,
          columns: [],
          approvalResult: '7',
          listTitle: '关闭项目:',
          reasonTitle: '关闭原因:',
          opreationTips: '关闭成功'
        },
        cancel: {
          type: 'cancel',
          label: '作废',
          api: this.cancelApi,
          columns: [],
          approvalResult: '7',
          listTitle: '作废项目:',
          reasonTitle: '作废原因:',
          opreationTips: '作废成功'
        },
        abandon: {
          type: 'abandon',
          label: '放弃',
          api: this.abandonApi,
          columns: [],
          approvalResult: '10',
          listTitle: '放弃项目:',
          reasonTitle: '放弃原因:',
          opreationTips: '放弃成功'
        },
        transfer: {
          type: 'transfer',
          label: '转审',
          api: this.transferApi,
          columns: [],
          approvalResult: '8',
          listTitle: '转审项目:',
          reasonTitle: '',
          opreationTips: '转审成功'
        },
        delete: {
          type: 'delete',
          label: '删除',
          api: this.deleteApi,
          columns: [],
          approvalResult: '1',
          listTitle: '删除项目:',
          reasonTitle: '',
          opreationTips: '删除成功'
        }
      }
    },
    modalColumns() {
      const res = []
      this.columns.forEach((colItem) => {
        if (res.length < 5) {
          res.push(colItem)
        }
      })
      return res
    },
    user() {
      return this.$store.state.global.user
    },
    autoScroll() {
      const scroll = { x: 0, y: 0 }
      if (this.$props.height) {
        scroll.y = this.$props.height
      }
      if (this.$props.width) {
        scroll.x = this.$props.width
      } else {
        this.countColumnsSize(this.columns, scroll)
      }
      return scroll
    },
    supportSeries() {
      const dicts = this.$store.getters.getDictByGroupCode(
        'upload_file_suffix_while_list'
      )
      const supports = dicts.map((item) => {
        return '.' + item.itemCode
      })
      return this.accept ? this.accept : supports.join(',')
    },
    finalSearchor() {
      return this.searchor.filter((i) => {
        const permissions = i.permissions?.map((i) => Number(i)) || [0, 1]
        return permissions.includes(this.user.roleId)
      })
    },
    _mergeKeys() {
      return this.$props.mergeKeys.length
        ? this.$props.mergeKeys
        : this.$props.columns
            .filter((i) => i.isMerge)
            .map((i) => i.dataIndex || i.key)
    }
  },
  watch: {
    // 监听dataParams参数，使其能触发fetchData()
    dataParams: {
      handler(params) {
        if (JSON.stringify(params) !== JSON.stringify(this.dataParamsCache)) {
          this.search()
          this.dataParamsCache = utils.clone(params)
        }
      },
      deep: true,
      immediate: true
    },
    columns: {
      handler(columns) {
        if (this.isLoading) {
          this.columnModifyDelayEvalutions.push(this.evalFinalColumnsEvent)
        } else {
          this.evalFinalColumnsEvent()
        }
      },
      immediate: true
    },
    isLoading: {
      handler(isLoading) {
        if (!isLoading) {
          this.evalFinalColumns()
        }
      }
    },
    dataSource: {
      handler(data) {
        if (data) {
          this.loadNativeData()
        }
      },
      immediate: true
    },
    searchor: {
      handler() {
        this.initialize()
      }
    }
  },
  async mounted() {
    this.fixFields()
    await this.initialize()
    this.fetchImmediate && (await this.fetchData())
  },
  methods: {
    evalFinalColumnsEvent() {
      this.columnsSlots = []
      this.columnScopedSlots = []
      this.finalColumns = utils.clone(this.columns).filter((i) => {
        const permissions = i.permissions?.map((i) => Number(i)) || [0, 1]
        return permissions.includes(this.user.roleId)
      })
      this.insertIndexCol(this.finalColumns)
      this.flattenColumns(
        this.finalColumns,
        this.columnSlots,
        this.columnScopedSlots
      )
    },
    queryNativeByPageSize(dataSource = []) {
      const curPageSize = this.pagination.pageSize || 10
      const startIndex = (this.pagination.current - 1) * curPageSize
      const endIndex = this.pagination.current * curPageSize
      return dataSource.filter((row, index) => {
        const matchIndex = this.$props.mergeIndexBy ? row[indexKey] - 1 : index
        return matchIndex >= startIndex && matchIndex < endIndex
      })
    },
    evalNativeListTotal(dataList) {
      if (this.$props.mergeIndexBy) {
        this.pagination.total = dataList.length - this.mergeIndexRowCount
      } else {
        this.pagination.total = dataList.length
      }
    },
    tryCutEmptyCols(dataList) {
      if (this.isHideEmptyCol && dataList.length) {
        this.finalColumns = this.finalColumns.filter((col) => {
          return !!dataList.find((row) =>
            utils.isValuable(row[col.key || col.dataIndex])
          )
        })
      }
    },
    evalIndexValue(dataList, rowSpan, index) {
      if (rowSpan >= 1) {
        const rankIndex = index + 1 - this.mergeIndexRowCount
        this.mergeIndexRowCount += rowSpan - 1
        return rankIndex
      }
      if (rowSpan === 0) {
        return dataList[index - 1]?.[indexKey]
      }
    },
    markRowSpan(dataList = []) {
      if (this.$props.mergeIndexBy) {
        this.mergeIndexRowCount = 0
        dataList.forEach((row, index) => {
          const mergeRecord = this.mergeSpanRecords[index] || {}
          if (!this.mergeSpanRecords[index]) {
            this.$set(this.mergeSpanRecords, index, mergeRecord)
          }
          const indexSpan = utils.mergeRows(
            dataList,
            this.$props.mergeIndexBy,
            index
          )
          this.$set(mergeRecord, indexKey, indexSpan)
          this.$set(
            row,
            indexKey,
            this.evalIndexValue(dataList, indexSpan, index)
          )
        })
      }
      if (this._mergeKeys.length) {
        dataList.forEach((row, index) => {
          const mergeRecord = this.mergeSpanRecords[index] || {}
          if (!this.mergeSpanRecords[index]) {
            this.$set(this.mergeSpanRecords, index, mergeRecord)
          }
          this._mergeKeys.forEach((key) => {
            // 如果 index 被合并，那么就 index 的合并值
            const indexSpan = mergeRecord[indexKey]
            const countRowSpan = utils.isValuable(indexSpan)
              ? indexSpan
              : utils.mergeRows(dataList, key, index)
            this.$set(mergeRecord, key, countRowSpan)
          })
        })
      }
    },
    evalFinalColumns() {
      if (this.columnModifyDelayEvalutions.length) {
        const evalution = this.columnModifyDelayEvalutions.pop()
        utils.isFunction(evalution) && evalution()
        this.columnModifyDelayEvalutions = []
      }
    },
    fixFields() {
      // 兼容 title === label、key === dataIndex
      this.searchor &&
        this.searchor.forEach((item) => {
          item.label = item.label || item.title
          item.title = item.label || item.title
          item.key = item.key || item.dataIndex
          item.dataIndex = item.key || item.dataIndex
          item.componentName = item.component
            ? item.component.name
              ? item.component.name
              : item.component
            : ''
        })
      this.columns &&
        this.columns.forEach((item) => {
          item.key = item.key || item.dataIndex
          item.dataIndex = item.key || item.dataIndex
        })
    },
    insertIndexCol(columns) {
      if (this.isRank && !hasIndexColumn(columns)) {
        columns.unshift({
          title: '序号',
          width: 60,
          dataIndex: indexKey,
          align: 'center',
          customRender: (text, record, index) => {
            const mergeRecord = this.mergeSpanRecords[index] || {}
            if (this.$props.mergeIndexBy) {
              return {
                children: record[indexKey],
                attrs: { rowSpan: mergeRecord[indexKey] }
              }
            } else {
              return (
                index +
                1 +
                (this.pagination.current - 1) * this.pagination.pageSize
              )
            }
          }
        })
      }
      function hasIndexColumn(columns) {
        let res = false
        for (let i = 0; i < columns.length; i++) {
          const col = columns[i]
          if (col.key === indexKey || col.dataIndex === indexKey) {
            res = true
            break
          }
        }
        return res
      }
    },
    countColumnsSize(columns, scrollObj) {
      columns &&
        columns.forEach((col) => {
          if (col.width) {
            scrollObj.x += col.width ? Number.parseFloat(col.width) : 100
          }
          if (col.children && col.children.length) {
            this.countColumnsSize(col.children, scrollObj)
          }
        })
    },
    flattenColumns(columns, columnSlots, columnScopedSlots) {
      const vm = this.scope
      const hFunc = this.$createElement
      const anchorFunction =
        this.$props.anchorFunction || this.bridge.projectApproval
      columns &&
        columns.forEach((col) => {
          // 支持用 anchor属性 的方式增加详情页的锚点
          if (col.anchor) {
            col.customRender = function (text, record) {
              return <a onClick={() => anchorFunction(record)}>{text}</a>
            }
          }
          if (col.slots || col.slotsRender) {
            columnSlots.push(col)
          }
          if (this._mergeKeys.includes(col.dataIndex || col.key)) {
            const filter =
              col.filter ||
              function (val) {
                return val
              }
            const rowSpanKey = col.dataIndex || col.key
            const customRender = col.customRender || ''
            const scopedSlotsRender = col.scopedSlotsRender
            const newRender = (text, record, index) => {
              const mergeRecord = this.mergeSpanRecords[index] || {}
              const content = customRender
                ? customRender(text, record, index)
                : scopedSlotsRender
                ? scopedSlotsRender(hFunc, record, vm, index)
                : filter(text)
              return {
                children: content,
                attrs: { rowSpan: mergeRecord[rowSpanKey] }
              }
            }
            if (!col._isAssignRender) {
              col.customRender = newRender
              col._isAssignRender = true
            }
          }
          if (
            !col.children &&
            !col.customRender &&
            !col.scopedSlots &&
            !col.slotsRender &&
            !col.scopedSlotsRender
          ) {
            col.customRender = this.fixTextWrapper(this.$createElement)
          }
          if ((col.scopedSlots || col.scopedSlotsRender) && !col.customRender) {
            columnScopedSlots.push(col)
          }
          if (col.children && col.children.length) {
            this.flattenColumns(col.children, columnSlots, columnScopedSlots)
          }
        })
    },
    fixTextWrapper(h) {
      return (text) => {
        if (utils.isString(text)) {
          // 确认文本长度超过20，才使用SLine组件
          // 防止每个cell单元格都跑去对文本进行精确的宽度计算，造成卡顿
          if (text.length > cellMaxCharLen) {
            return <SLine len={cellMaxCharLen} value={text} />
          } else return text
        } else {
          return text
        }
      }
    },
    async showmodal(type) {
      // 判断有没有勾选
      if (!this.selectedRows || !this.selectedRows.length) {
        return this.$modal.warning({
          title: '提示',
          content: '请至少勾选一项！'
        })
      }
      await this.verfiyBatchOperatility(type)
      this.modal.form.setFieldsValue({
        approvalContent: '',
        transfer: []
      })
      this.modal.info = this.modalinfomap[type]
      this.modal.show = true
    },
    verfiyBatchOperatility(type) {
      // 根据选择项的操作类型给出提示
      // 1. 【】流程已结束，不支持此操作
      const endSigns = ['end', 'flowend', 'nodeend', 'closed', 'cancelled']
      const endDisableds = [
        'pass',
        'reject',
        'unpass',
        'revoke',
        'delete',
        'transfer',
        'abandon'
      ]
      const endNode = this.selectedRows.find((i) =>
        endSigns.includes((i[this.flowStatusField] || '').toLowerCase())
      )
      const startSigns = ['start', 'restart', 'resubmit', 'submit']
      const startDisableds = ['reject', 'unpass']
      const startNode = this.selectedRows.find((i) =>
        startSigns.includes((i[this.flowStatusField] || '').toLowerCase())
      )
      if (endNode && endDisableds.includes(type)) {
        this.$modal.info({
          title: '提示',
          okText: '确定',
          content: `${
            endNode['flowNo'] || endNode[this.rowKey]
          } 流程已结束，不支持此操作`
        })
        return Promise.reject(new Error())
      } else if (startNode && startDisableds.includes(type)) {
        this.$modal.info({
          title: '提示',
          okText: '确定',
          content: `${
            startNode['flowNode'] || startNode[this.rowKey]
          } 流程需要重新提交，不支持此操作`
        })
        return Promise.reject(new Error())
      } else {
        return Promise.resolve(0)
      }
    },
    modalSubmitEvent() {
      this.modal.form.validateFields(async (err, values) => {
        if (err) return
        const modalInfo = this.modal.info || {}
        const params = {
          approvalResult: modalInfo.approvalResult,
          instanceIds: this.selectedRowKeys,
          ids: this.selectedRows.map((item) => item.id),
          currentAccount: this.user.employeeNumber,
          currentName: this.user.name,
          selectedRows: this.selectedRows
        }
        // 专门处理转审的参数
        if (values.transfer) {
          params['transferAccount'] = utils.splitUser(values.transfer)[0]
          params['transferName'] = utils.splitUser(values.transfer)[1]
          params['ids'] = this.selectedRows.map((row) => row.id)
        }
        if (!modalInfo.api) {
          throw new Error('STable未绑定对应的接口！', modalInfo)
        }
        const res = await this.getApiFunction(modalInfo.api)({
          ...values,
          ...params
        })
        if (res.code === 200) {
          this.$message.success(modalInfo.opreationTips)
          this.reload()
        } else {
          this.$modal.warning({
            title: '提示',
            content: res.message
          })
        }
        this.modal.show = false
      })
    },
    async initialize() {
      this.searchorGroups = []
      for (let index = 0; index < this.searchor.length; index++) {
        const searchItem = this.searchor[index]
        this.searchorGroups.push(searchItem)
        if (searchItem.beforeRender) {
          searchItem.beforeRender(this.queryParams, searchItem, this.scope)
        }
        let itemValue
        if (utils.isFunction(searchItem.default)) {
          itemValue = await searchItem.default(searchItem, this.scope)
        } else {
          itemValue = searchItem.default
        }
        if (searchItem.value) {
          itemValue = searchItem.value
        }
        if (searchItem.key) {
          this.$set(this.queryParams, searchItem.key, itemValue)
          if (utils.isValuable(itemValue)) {
            this.simpleSelectEvent(itemValue, null, searchItem)
          }
        }
        if (searchItem.keys) {
          this.multiSelectEvent(itemValue, null, searchItem)
        }
      }
    },
    setSearchItem(searchItem, value) {
      searchItem.value = value
    },
    simpleSelectEvent(e, optionItem, searchItem) {
      // 赋值元素视图
      const value = e && e.currentTarget ? e.currentTarget.value : e
      // 手动变更的数据，防止render的时候使用旧数据
      this.setSearchItem(searchItem, value)
      // 手动赋值html的视图
      this.setComponentView(searchItem, value)
      // this.cacheDefaultView(searchItem, value)
      // 重置操作
      if (
        utils.isNone(value) ||
        utils.isEmptyArray(value) ||
        utils.isEmptyObject(value)
      ) {
        this.queryParams[searchItem.key] = undefined
        return this.queryParams
      }

      if (isuserOption(value)) {
        const userOption = value.length ? JSON.parse(value[0].key) : undefined
        this.queryParams[searchItem.key] = userOption
          ? userOption['key']
          : undefined
      } else {
        this.queryParams[searchItem.key] = value
      }
      function isuserOption(value) {
        return (
          utils.isArray(value) &&
          value.length &&
          value[0].label &&
          value[0].key &&
          utils.isJSONString(value[0].key)
        )
      }
    },
    // 有两类选项
    multiSelectEvent(value, optionItem, searchItem) {
      // 赋值元素视图
      this.setComponentView(searchItem, value)
      // 暂存value
      this.cacheDefaultView(searchItem, value)

      // 重置操作
      if (
        utils.isNone(value) ||
        utils.isEmptyArray(value) ||
        utils.isEmptyObject(value)
      ) {
        return searchItem.keys.forEach((key, index) => {
          this.queryParams[key] = null
        })
      }

      // 主要场景 UserSelect
      if (searchItem.componentName === 'UserSelect') {
        // userSelect的选项被构造了一次，需要重新解构出来
        const userOption = value.length ? JSON.parse(value[0].key) : null
        searchItem.keys.forEach((key, index) => {
          const optionKey = searchItem.optionKeys[index]
          this.queryParams[key] = userOption ? userOption[optionKey] : null
        })
      }

      // 主要场景：DepatmentSelect
      if (searchItem.componentName === 'DepatmentSelect') {
        searchItem.keys.forEach((key, index) => {
          const optionKey = searchItem.optionKeys[index]
          this.queryParams[key] = optionItem ? optionItem[optionKey] : null
        })
      }

      // value = 'Array', optionItem = 'Array' => Select multi, RangPicker
      if (utils.isArray(value)) {
        searchItem.keys.forEach((key, index) => {
          this.queryParams[key] = utils.isArray(optionItem)
            ? optionItem[index]
            : value[index]
        })
      }
    },
    async expandEvent(opr, record) {
      if (opr && this.expandApi) {
        this.expandedRowKeys.push(record[this.rowKey])
        const res = await this.getApiFunction(this.expandApi)(
          this.formatQueryParams({ ...record })
        )
        if (res.code === 200) {
          if (res.data) {
            const children = this.evalDataListFromApi(res.data)

            // 关联父级节点数据
            const cpyParent = { ...record }
            delete cpyParent.children
            children.forEach((child) => {
              child.parentId = cpyParent[this.rowKey]
              child.parent = cpyParent
            })

            // 把子节点插入整棵树
            this.insertTreeNode(this.dataList, record[this.rowKey], children)

            // 刷新数据
            this.update()
          }
        } else {
          this.$modal.warning({
            title: '提示',
            okText: '确定',
            content: res.message
          })
        }
      }
      if (!opr) {
        // 收起时，把 record 从 this.expandedRowKeys 中剔除
        this.spliceExpandRowKeys(record)
      }
    },
    spliceExpandRowKeys(record) {
      for (let index = 0; index < this.expandedRowKeys.length; index++) {
        const key = this.expandedRowKeys[index]
        if (key === record[this.rowKey]) {
          this.expandedRowKeys.splice(index, 1)
          break
        }
      }
    },
    update() {
      this.evalFinalColumns()
      this.$emit('update', this.dataList, this.formatQueryParams(), this.scope)
    },
    insertTreeNode(loopNodes, insertNodeId, willInsertNodes, resolve) {
      for (let index = 0; index < loopNodes.length; index++) {
        const loopNode = loopNodes[index]
        if (loopNode[this.rowKey] === insertNodeId) {
          // 先把子项从 this.expandedRowKeys 中剔除，再插入树中
          willInsertNodes.forEach((node) => {
            this.spliceExpandRowKeys(node)
          })
          loopNode.children = willInsertNodes
          return false
        }
        if (utils.isArray(loopNode.children) && loopNode.children.length) {
          this.insertTreeNode(
            loopNode.children,
            insertNodeId,
            willInsertNodes,
            resolve
          )
        }
      }
    },
    // table全选功能
    onSelectChange(selectedRowKeys, selectedRows) {
      this.selectedRowKeys = selectedRowKeys
      this.selectedRows = selectedRows
      this.$emit('selectChange', selectedRowKeys, selectedRows)
    },
    /**
     * @injectParam 一般是由父级组件调用时，传入的
     */
    search(injectParam = {}) {
      this.isReset = false
      this.pagination.current = 1
      if (this.$props.dataSource) {
        this.$emit('search', this.formatQueryParams(injectParam))
      } else {
        this.fetchData({ ...injectParam })
      }
    },
    // 重置
    async reset() {
      // 充填必填的表单，选取默认值
      this.searchor.forEach((searchItem) => {
        // if (!searchItem.required) {
        if (searchItem.key) {
          this.resetByFieldType(this.queryParams, searchItem.key)
        }
        if (searchItem.keys) {
          searchItem.keys.forEach((key) => {
            this.resetByFieldType(this.queryParams, key)
          })
        }
        // 置空 default 和 value，避免重新渲染的时候会进行默认赋值
        this.resetByFieldType(searchItem, 'value')
        this.resetByFieldType(searchItem, 'default')
        setTimeout(() => {
          this.setComponentView(searchItem, undefined)
        })
        // }
      })
      this.pagination.current = 1
      this.pagination.pageSize = 10
      this.pagination.total = 0
      this.dataList.length = 0
      this.isReset = true
      this.$emit('reset', this.scope)
      await this.initialize()
      this.fetchImmediate && (await this.fetchData())
    },
    // 设置组件的视图
    // ****************************************
    // * 注意：这个函数会触发组件的change事件
    // * 所以，谨慎在change事件函数中对
    // * “searchItem.value” 或者 “searchItem.default”
    // * 字段进行赋值操作，会造成死循环
    // ****************************************
    setComponentView(searchItem, view) {
      const ref = this.spillComponentRef(searchItem)
      const comp = this.$refs[ref]
      // if (comp) {
      if (utils.isObject(comp)) {
        comp.value = view // 会触发change事件
      }
      if (utils.isArray(comp)) {
        comp[0].value = view // 会触发change事件
      }
      // } else {
      //   return setTimeout(() => {
      //     this.setComponentView(searchItem, view)
      //   }, 150)
      // }
    },
    // 暂存组件的视图,帮助“required”字段在刷新时不会被刷掉
    cacheDefaultView(searchItem, view) {
      searchItem.default = view
    },
    // 根据value类型，进行置空操作
    resetByFieldType(obj, key) {
      if (utils.isObject(obj[key])) {
        obj[key] = {}
      } else if (utils.isArray(obj[key])) {
        obj[key] = []
      } else {
        obj[key] = undefined
      }
    },
    // 导入
    async beforeUpload(file) {
      const pass = utils.verifyUploadType(file.name, this.supportSeries)
      if (!pass) return false
      if (!this.importApi) return false
      const params = new FormData()
      params.append('file', file)
      const res = await this.getApiFunction(this.importApi)(params)
      if (res.code === 200) {
        this.$message.success('导入成功')
        this.fetchData()
      } else {
        this.$modal.warning({
          title: '提示',
          okText: '确定',
          content: res.message
        })
      }
      return false
    },
    hasRequiredItemEmpty(injectParam) {
      let emptyItem
      const params = this.formatQueryParams(injectParam)
      this.searchor.forEach((i) => {
        let value
        if (i.key) {
          value = params[i.key]
        }
        if (i.keys) {
          i.keys.forEach((k) => {
            value = params[k]
          })
        }
        if (i.required && utils.isNone(value)) {
          emptyItem = i
        }
      })
      // 如果点击 重置 按钮，就不用给校验提示
      if (!!emptyItem && !this.isReset) {
        this.$message.warning('请确认必须填')
      }
      return emptyItem
    },
    /**
     * 提供语义化接口，功能和fetchData一致
     */
    reload() {
      this.fetchData()
    },
    formatQueryParams(injectparams) {
      const queryParams = utils.clone(this.queryParams)
      // 处理 UserSelect 组件的取值
      // UserSelect 有两种用法
      // 1. searchItem.key 只获取一个值，选中项是个数据，需要format处理，默认只获取code
      // 2. searchItem.keys 获取多个值，但是 this.multiSelectEvent 已经对取值进行处理了
      // 原始取值样例：[{key: "{"key":"51000001","label":"Hongkui Yang"}", label: "51000001 Hongkui Yang"}]
      this.searchor.forEach((searchItem) => {
        if (searchItem.componentName === 'UserSelect') {
          if (searchItem.key && utils.isArray(queryParams[searchItem.key])) {
            if (utils.isArray(queryParams[searchItem.key])) {
              if (queryParams[searchItem.key][0]) {
                const itemOption = JSON.parse(
                  queryParams[searchItem.key][0].key
                )
                queryParams[searchItem.key] = itemOption.key
              }
            }
          }
        }
      })

      // 逐级处理
      Object.keys(queryParams).forEach((key) => {
        const val = queryParams[key]
        // 清掉空值
        if (
          utils.isNone(val) ||
          utils.isEmptyArray(val) ||
          utils.isEmptyObject(val)
        ) {
          delete queryParams[key]
        }

        // 裁掉边际空格
        if (utils.isString(val)) {
          queryParams[key] = utils.trim(val)
        }

        // 转换 Moment 类型的值
        if (utils.isMoment(val)) {
          queryParams[key] = utils.moment(val).format('YYYY-MM-DD')
        }
      })

      // 分页参数
      const pageParam = this.isPagination
        ? {
            pageSize: this.pagination.pageSize,
            pageNum: this.pagination.current,
            current: this.pagination.current
          }
        : {}
      // 【queryParams】来源：
      //    页面上的搜索栏
      // 【injectparams】来源：
      //    当外部直接调用this.search方法时，有可能注入额外参数
      //    或者当前是树级表格，点击展开触发的this.expandEvent方法，会把当前行数据当作参数传入
      // 【this.dataParams】来源：
      //    由父级组件定制，当前组件不会对这个数据进行过滤，所以定制时，保持数据的纯净（可以直接交到后端）
      return this.handleParamsByCustom({
        ...queryParams,
        ...injectparams,
        ...pageParam,
        ...this.dataParams
      })
    },

    // 最后交给定制的回调参数进行调整
    handleParamsByCustom(finalParams) {
      this.searchor.forEach((searchItem) => {
        if (
          searchItem.paramTransform &&
          utils.isFunction(searchItem.paramTransform)
        ) {
          searchItem.paramTransform(finalParams, searchItem, this.scope)
        }
      })
      return finalParams
    },

    // 导出
    exportParams() {
      // if (this.dataList.length === 0) {
      //   return this.$modal.warning({
      //     title: '提示',
      //     okText: '确定',
      //     content: '暂无数据导出!'
      //   })
      // }
      // eslint-disable-next-line no-unused-vars
      const ids = []
      if (this.selectedRows && this.selectedRows.length > 0) {
        this.selectedRows.filter((item) => {
          ids.push(item.id)
        })
        // ids = ids.substring(0, ids.length - 1)
      }
      return this.formatQueryParams({ selectedRows: this.selectedRows, ids })
    },
    // 导入模板下载
    downLoadTemplate() {
      if (utils.isFunction(this.templateApi)) {
        return this.templateApi(this)
      }
      const exchangeName = this.templateName ? this.templateName : ''
      if (utils.isString(this.templateApi)) {
        if (api[this.templateApi]) {
          return api[this.templateApi](exchangeName)
        } else {
          return utils.exportGetFile(this.templateApi, {
            fileName: exchangeName
          })
        }
      }
      // 如果不提供模板地址，就使用默认的
      if (utils.isNone(this.templateApi) && utils.isString(exchangeName)) {
        return api['getfilestemple'](exchangeName)
      }
    },
    getApiFunction(apiNameOrFunction) {
      if (utils.isFunction(apiNameOrFunction)) {
        return apiNameOrFunction
      }
      if (utils.isString(apiNameOrFunction)) {
        return api[apiNameOrFunction] || function () {}
      }
      if (utils.isUndefined(apiNameOrFunction)) {
        return function () {}
      }
    },
    evalDataListFromApi(data) {
      let res = {}
      if (
        this.$props.dataTransform &&
        utils.isFunction(this.$props.dataTransform)
      ) {
        res = this.$props.dataTransform(data)
      } else if (this.$props.dataDir && utils.isString(this.$props.dataDir)) {
        res = eval(this.$props.dataDir)
      }
      return res
    },
    detectTotal(data) {
      let pageRecord = utils.clone(data)
      if (this.$props.dataDir && utils.isString(this.$props.dataDir)) {
        // 一般后端的模型，都把分页数据放在了实例数据的同一层结构
        // 比如：res.data.pageinfo.records
        // 那么：res.data.pageinfo.total
        const dicts = this.$props.dataDir.split('.')
        if (dicts && dicts.length > 1) {
          dicts.pop()
          if (dicts.length > 1) {
            pageRecord = eval(dicts.join('.'))
          }
        }
      }
      return pageRecord.hasOwnProperty('total')
        ? pageRecord.total
        : this.dataList.length
    },
    loadNativeData() {
      this.$loading.mount()
      let dataSource = this.$props.dataSource
      const params = this.formatQueryParams()
      const rowKeys = Object.keys(dataSource[0] || {}) || []
      const paramsKeys = Object.keys(params).filter((key) =>
        rowKeys.includes(key)
      )
      if (paramsKeys.length) {
        dataSource = dataSource.filter((row) => {
          return !!paramsKeys.find((key) =>
            new RegExp(row[key]).test(params[key])
          )
        })
      }
      dataSource.length && this.markRowSpan(dataSource)
      this.evalNativeListTotal(dataSource)
      this.dataList = this.queryNativeByPageSize(dataSource)
      this.tryCutEmptyCols(this.dataList)
      setTimeout(() => {
        this.update()
        this.$loading.unmount()
      }, 150)
    },
    // 获取列表数据
    async fetchData(injectparams = {}) {
      if (this.isLoading) return false
      if (this.$props.dataSource) return this.loadNativeData()
      if (this.hasRequiredItemEmpty(injectparams)) return false
      if (!this.dataApi) return false
      this.isLoading = true
      this.selectedRows = []
      this.selectedRowKeys = []
      const res = await this.getApiFunction(this.dataApi)(
        this.formatQueryParams(injectparams)
      )
      this.isLoading = false
      if (res.code === 200) {
        if (res.data) {
          this.dataList = this.evalDataListFromApi(res.data)
          this.dataList.length && this.markRowSpan(this.dataList)
          this.dataList.length && this.tryCutEmptyCols(this.dataList)
          this.pagination.total = this.detectTotal(res.data)
          this.expandedRowKeys = []
        } else {
          this.dataList = []
          this.pagination.total = 0
        }
        this.update()
      } else {
        this.$modal.warning({
          title: '提示',
          okText: '确定',
          content: res.message
        })
      }
    },
    // 服务费用分页
    onChangePage(page, size) {
      this.pagination.current = page
      this.pagination.pageNum = page
      this.pagination.pageSize = size
      this.$emit('pageChange', this.pagination, this.scope)
      this.fetchData()
    },

    spillComponentRef(searchItem) {
      if (utils.isValuable(searchItem.key)) {
        return `${searchItem.key}`
      } else if (utils.isValuable(searchItem.keys)) {
        return `${searchItem.keys[0]}`
      }
    }
  },
  render(h) {
    const batchHandleButtons = buildBatchHandleButtons.call(this, h)
    const summaryButtons = buildsummaryBaseButtons.call(this, h)
    const batchHandleModal = buildModal.call(this, h)
    const mainTable = buildMainTable.call(this, h)
    const searchorGroup = buildSearchorGroup.call(this, h)
    const summarySlots = getSummarySlots.call(this, h)
    const paginationSlots = getPaginationSlots.call(this, h)
    return (
      <div>
        {searchorGroup}
        <div class={'panel-content'}>
          {hasSummary(summarySlots, batchHandleButtons, summaryButtons) && (
            <div class={'btn-wrap clearfix summary-bar'}>
              {...summarySlots}
              {...batchHandleButtons}
              {...summaryButtons}
            </div>
          )}
        </div>
        <div>{mainTable}</div>
        <div>{paginationSlots}</div>
        <div>{batchHandleModal}</div>
      </div>
    )
    function hasSummary(summarySlots, batchHandleButtons, summaryButtons) {
      return !!(
        summarySlots.length ||
        batchHandleButtons.length ||
        summaryButtons.length
      )
    }
  }
}

// 获取插槽提供的按钮
function getSummarySlots() {
  const slots = this.$slots || {}
  return slots.summary || []
}

// 获取自定义的pagination
function getPaginationSlots() {
  const slots = this.$slots || {}
  return slots.pagination || []
}

// 创建批处理按钮
function buildBatchHandleButtons(h) {
  return Object.keys(this.modalinfomap)
    .map((key) => {
      const buttonItem = this.modalinfomap[key]
      if (buttonItem.api) {
        return (
          <a-button
            disabled={this.selectedRowKeys.length === 0}
            type={'primary'}
            onClick={() => this.showmodal(buttonItem.type)}
          >
            <span>{buttonItem.label || buttonItem.title}</span>
          </a-button>
        )
      } else {
        return null
      }
    })
    .filter((item) => item)
}

// 创建基础按钮 （导入，导出，下载模板）
function buildsummaryBaseButtons(h) {
  const buttons = []
  if (this.importApi) {
    buttons.push(
      <a-upload
        name={'file'}
        accept={'.xls, .xlsx'}
        before-upload={this.beforeUpload}
        file-list={this.fileList}
        class={'import-table'}
      >
        <a-tooltip>
          <template slot={'title'}>导入</template>
          <a-button class={'cir-button button-import'} />
        </a-tooltip>
      </a-upload>
    )
  }
  if (this.exportApi && this.dataList.length > 0) {
    buttons.push(
      <span style="padding: 0 0.5rem">
        <ExportInterface
          api={this.exportApi}
          params={() => this.exportParams()}
          file-name={this.tableName}
        />
      </span>
    )
  }
  if (this.templateApi) {
    buttons.push(
      <a-tooltip>
        <template slot={'title'}>导入模板下载</template>
        <a-button
          onClick={() => this.downLoadTemplate()}
          class={'cir-button button-import-template-down'}
        />
      </a-tooltip>
    )
  }
  return buttons
}

// 创建弹出框
function buildModal(h) {
  const slots = []
  const scopedSlots = []
  const scope = this.scope
  const vdMap = {
    transfer: [
      'transfer',
      { rules: [{ required: true, message: '请选择审批人' }] }
    ],
    approvalConent: [
      'approvalContent',
      {
        rules: [
          { required: true, message: `请填写 "${this.modal.info.reasonTitle}"` }
        ]
      }
    ]
  }
  this.columnSlots.map((columnSlot) => {
    const slotName = (columnSlot.slots && columnSlot.slots.title) || ''
    if (columnSlot.slotsRender && utils.isFunction(columnSlot.slotsRender)) {
      slots.push(
        <span slot={slotName}>{columnSlot.slotsRender(h, scope)}</span>
      )
    } else {
      slots.push(<span slot={slotName}>...</span>)
    }
  })
  this.columnScopedSlots.map((columnSlot) => {
    const slotName =
      (columnSlot.scopedSlots && columnSlot.scopedSlots.customRender) ||
      columnSlot.dataIndex ||
      columnSlot.key
    scopedSlots[slotName] = function (text, record) {
      if (
        columnSlot.scopedSlotsRender &&
        utils.isFunction(columnSlot.scopedSlotsRender)
      ) {
        return columnSlot.scopedSlotsRender(h, record, scope)
      } else {
        return text
      }
    }
  })
  return (
    <a-modal
      width={'60%'}
      title={'批量操作'}
      v-model={this.modal.show}
      onOk={this.modalSubmitEvent}
    >
      <a-form form={this.modal.form}>
        <a-row>
          {this.modal.info.type === 'transfer' && (
            <a-col>
              <a-form-item
                label="转审人"
                label-col={{ span: 4 }}
                wrapper-col={{ span: 18 }}
              >
                <UserSelect v-decorator={vdMap.transfer} />
              </a-form-item>
            </a-col>
          )}
          {this.modal.info.reasonTitle && (
            <a-col>
              <a-form-item
                label={this.modal.info.reasonTitle}
                label-col={{ span: 4 }}
                wrapper-col={{ span: 18 }}
              >
                <a-textarea rows={4} v-decorator={vdMap.approvalConent} />
              </a-form-item>
            </a-col>
          )}
        </a-row>
        <a-row>
          <a-col>
            <a-form-item
              label={this.modal.info.listTitle || ''}
              label-col={{ span: 3 }}
              wrapper-col={{ span: 18 }}
            >
              <a-table
                bordered
                scopedSlots={scopedSlots}
                row-key={'id'}
                columns={this.modalColumns}
                data-source={this.selectedRows}
                pagination={false}
              >
                {...slots}
              </a-table>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </a-modal>
  )
}

// 创建主表格
function buildMainTable(h) {
  const slots = []
  const scopedSlots = {}
  const scope = this.scope
  const selection = this.isSelection
    ? {
        type: this.selectMode,
        selectedRowKeys: this.selectedRowKeys,
        onChange: this.onSelectChange
      }
    : null
  /* 表头渲染 */
  this.columnSlots.map((columnSlot, index) => {
    const slotName = (columnSlot.slots && columnSlot.slots.title) || ''
    if (columnSlot.slotsRender && utils.isFunction(columnSlot.slotsRender)) {
      slots.push(
        <span slot={slotName}>{columnSlot.slotsRender(h, scope)}</span>
      )
    } else {
      slots.push(<span slot={slotName}>...</span>)
    }
  })
  /* 表身渲染 */
  this.columnScopedSlots.map((columnSlot) => {
    const slotName =
      (columnSlot.scopedSlots && columnSlot.scopedSlots.customRender) ||
      columnSlot.dataIndex ||
      columnSlot.key
    scopedSlots[slotName] = function (text, record, index) {
      if (
        columnSlot.scopedSlotsRender &&
        utils.isFunction(columnSlot.scopedSlotsRender)
      ) {
        return columnSlot.scopedSlotsRender(h, record, scope)
      } else {
        const ellipsis = columnSlot.ellipsis
        const len = utils.isNumber(ellipsis) ? ellipsis : 10
        return utils.isValuable(ellipsis) ? (
          <SLine len={len} value={text} />
        ) : (
          text
        )
      }
    }
  })
  return [
    <a-table
      bordered
      scopedSlots={scopedSlots}
      columns={this.columns}
      data-source={this.dataList}
      pagination={false}
      scroll={this.autoScroll}
      row-key={this.rowKey}
      row-selection={selection}
      expanded-row-keys={this.expandedRowKeys}
      onExpand={this.expandEvent}
    >
      {...slots}
    </a-table>,
    !!this.dataList.length && this.isPagination && (
      <a-pagination
        class={'pagination-layout'}
        props={this.pagination}
        onChange={this.onChangePage}
        onShowSizeChange={this.onChangePage}
      />
    )
  ]
}

function buildSearchorGroup(h) {
  if (!this.searchorGroups || !this.searchorGroups.length) return ''
  return (
    <div class={['panel-content', 'border-bottom-1']}>
      <a-form class={['form-wrap']} v-flexible-search-items>
        <a-row>
          {buildSearchItems.call(this)}
          {buildSearchButton.call(this)}
        </a-row>
      </a-form>
    </div>
  )

  function buildSearchItems() {
    if (this.searchorGroups && this.searchorGroups.length) {
      return this.searchorGroups.map((searchItem) => {
        return (
          <a-col span={searchItem.layout ? searchItem.layout.span : 6}>
            <a-form-item
              required={searchItem.required}
              label={searchItem.label || searchItem.title}
              label-col={{
                span: searchItem.layout ? searchItem.layout.label : 8
              }}
              wrapper-col={{
                span: searchItem.layout ? searchItem.layout.wrapper : 16
              }}
            >
              {createFormItem.call(this, searchItem)}
            </a-form-item>
          </a-col>
        )
      })
    } else {
      return ''
    }
  }
  function createFormItem(searchItem) {
    if (searchItem.component) {
      return (
        <searchItem.component
          props={
            utils.isFunction(searchItem.props)
              ? searchItem.props(searchItem, this.scope)
              : searchItem.props
          }
          attrs={
            utils.isFunction(searchItem.attrs)
              ? searchItem.attrs(searchItem, this.scope)
              : searchItem.attrs
          }
          value={
            utils.isFunction(searchItem.value)
              ? searchItem.value(searchItem, this.scope)
              : searchItem.value
          }
          dom-attrs={
            utils.isFunction(searchItem.domAttrs)
              ? searchItem.domAttrs(searchItem, this.scope)
              : searchItem.domAttrs
          }
          allow-clear={!searchItem.required}
          ref={this.spillComponentRef(searchItem)}
          depend={this.queryParams[searchItem.dependKey]}
          onKeyup={(e) => /13/.test(e.keyCode) && this.fetchData()}
          onChange={(value, optionItem) => {
            searchItem.key
              ? this.simpleSelectEvent(value, optionItem, searchItem)
              : this.multiSelectEvent(value, optionItem, searchItem)
          }}
        />
      )
    } else if (searchItem.customRender) {
      return searchItem.customRender(
        this.$createElement,
        searchItem,
        this.scope
      )
    } else {
      return ''
    }
  }

  function buildSearchButton() {
    return (
      <a-col
        span={this.searchorGroups.length < 4 ? 6 : 24}
        class={['t-center', 'mt5']}
      >
        <a-button ghost type={'primary'} onClick={() => this.search()}>
          查询
        </a-button>
        <a-button style="margin-left: 0.5rem" onClick={() => this.reset()}>
          重置
        </a-button>
      </a-col>
    )
  }
}
</script>
<style lang="less" scoped>
.trans {
  transform: rotate(90deg);
}
.trans-reverse {
  transform: rotate(270deg);
}
div.ant-table-wrapper {
  padding: 0;
  background-color: #fff;
}
div.summary-bar {
  display: flex;
  align-items: center;
}
div.searchor-item-required {
  /deep/ div[role='combobox'] {
    border-color: red;
  }
  /deep/ div.ant-select-selection__placeholder {
    color: red;
  }
  /deep/.ant-calendar-picker {
    input {
      border-color: red;
      &::placeholder {
        color: red;
      }
    }
  }
}
ul.pagination-layout {
  padding: 1rem;
  background-color: #fff;
}
</style>
