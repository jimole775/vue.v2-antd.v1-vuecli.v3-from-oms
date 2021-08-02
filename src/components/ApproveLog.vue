<template>
  <a-table
    :columns="columns"
    :row-key="record => record.id"
    :data-source="dataList"
    :pagination="false"
    bordered
  >
    <template slot="processContent" slot-scope="text,record">
      <div>
        <a-tooltip :trigger="'click'">
          <template slot="title">
            {{ record.processContent }}
          </template>
          <div class="overHidden3">{{ text }}</div>
        </a-tooltip>
      </div>
    </template>
    <template slot="receiverName" slot-scope="text, record">
      <HandlerTableCell :name="record.receiverName" :account="record.receiverAccount" />
    </template>
  </a-table>
</template>

<script>
import _ from 'lodash'
import api from '@/api/'
import utils from '@/utils/'

export default {
  name: 'ApproveLog',
  props: {
    businessId: {
      type: [String, Number],
      required: true
    },
    businessCategory: {
      type: String,
      default: 'RECRUITION'
    },
    isSupplier: {
      type: Boolean,
      default: false
    }
  },
  data () {
    return {
      dataList: [],
      isSupplierFlag: false,
      columns: [
        {
          title: '时间',
          dataIndex: 'processDate'
        },
        {
          title: '状态',
          dataIndex: 'statusName'
        },
        {
          title: '操作人',
          dataIndex: 'receiverName',
          scopedSlots: { customRender: 'receiverName' }
        },
        {
          title: '操作结果',
          dataIndex: 'processResult'
        },
        {
          title: '操作意见',
          dataIndex: 'processContent',
          scopedSlots: { customRender: 'processContent' }
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
    async loadList () {
      this.isSupplierFlag = await this.isSupplier
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
      let res = await api.tasksByBusiness({
        businessId: this.businessId.toString(),
        businessCategory: this.businessCategory
      })
      if (res.code === 200 && _.isArray(res.data.content)) {
        this.dataList = res.data.content
        this.dataList.forEach(item => {
          if (this.businessCategory === 'PostApplyProcess') {
            item.processDate = utils.strToTime(item.lastUpdateDate)
          } else {
            item.processDate = utils.strToTime(item.processDate)
          }
          if (this.isSupplierFlag) {
            for (var i = 0; i < this.columns.length; i++) {
              if (this.columns[i].dataIndex === 'receiverName') {
                this.columns.splice(i, 1)
              }
            }
          }
        })
      } else {
        this.dataList = []
      }
    }
  }
}
</script>
