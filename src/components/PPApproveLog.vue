<template>
  <a-table
    :columns="columns"
    :row-key="record => record.id"
    :data-source="dataList"
    :pagination="pagination"
    @change="onChangePage"
    bordered
  >
    <!-- <template slot="processContent" slot-scope="text,record">
      <div>
        <a-tooltip :trigger="'click'">
          <template slot="title">
            {{ record.processContent }}
          </template>
          <div class="overHidden3">{{ text }}</div>
        </a-tooltip>
      </div>
    </template> -->
    <template slot="createdDate" slot-scope="text">
      <span>{{ moment(text).format('YYYY-MM-DD LTS') }}</span>
    </template>
    <template slot="content" slot-scope="text">
      <SLines :content="text" :len="20" />
    </template>
    <template slot="operatorName" slot-scope="text, record">
      <HandlerTableCell :name="record.operatorName" :account="record.operatorAccount" />
    </template>
  </a-table>
</template>

<script>
// import _ from 'lodash'
import api from '@/api/'
import utils from '@/utils/'
export default {
  name: 'PPApproveLog',
  props: {
    businessId: {
      type: [String, Number],
      required: true
    },
    businessType: {
      type: String,
      default: ''
    }
  },
  data () {
    return {
      dataList: [],
      pagination: {
        current: 1,
        pageSize: 10,
        total: 0,
        showTotal: total => `共 ${total} 条`,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100']
      },
      isSupplierFlag: false,
      columns: [
        {
          title: '时间',
          dataIndex: 'createdDate',
          scopedSlots: { customRender: 'createdDate' }
        },
        {
          title: '状态',
          dataIndex: 'operationType'
        },
        {
          title: '操作人',
          dataIndex: 'operatorName',
          scopedSlots: { customRender: 'operatorName' }
        },
        // {
        //   title: '操作结果',
        //   dataIndex: 'processResult'
        // },
        {
          title: '操作内容',
          dataIndex: 'content',
          scopedSlots: { customRender: 'content' }
        }
      ]
    }
  },
  watch: {
    businessId (val) {
      this.loadList()
    }
  },
  mounted () {
    this.loadList()
  },
  methods: {
    moment: utils.moment,
    // 服务费用分页
    onChangePage (val) {
      this.pagination.current = val.current
      this.pagination.pageSize = val.pageSize
      this.loadList()
    },
    async loadList () {
      await api.currentRole().then(res => {
        if (res.code === 200) {
          if (res.data.type === 'SUPPLIER') {
            this.isSupplierFlag = true
          }
        }
      })
      if (!this.businessId) {
        return
      }
      let res = await api.getppoperationlog({
        pageNum: this.pagination.current,
        pageSize: this.pagination.pageSize,
        businessId: this.businessId.toString(),
        businessType: this.businessType
      })
      if (res.code === 200) {
        this.dataList = res.data.records
        this.dataList.forEach(item => {
          // if (this.businessCategory === 'PostApplyProcess') {
          //   item.processDate = utils.strToTime(item.lastUpdateDate)
          // } else {
          //   item.processDate = utils.strToTime(item.processDate)
          // }
          if (this.isSupplierFlag) {
            for (var i = 0; i < this.columns.length; i++) {
              if (this.columns[i].dataIndex === 'operatorName') {
                this.columns.splice(i, 1)
              }
            }
          }
        })
        this.pagination.total = res.data.total || 0
      } else {
        this.dataList = []
      }
    }
  }
}
</script>
