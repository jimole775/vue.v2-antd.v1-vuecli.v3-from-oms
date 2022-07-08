<template>
  <div class="panel-content operator-flow">
    <a-timeline>
      <a-timeline-item
        v-for="(item, index) in timeLineItems"
        :key="index"
      >
        <a-icon
          v-if="matchStatus(item.approvalStatus) === 'finish'"
          slot="dot"
          type="check-circle"
          theme="filled"
          class="dot-finish"
        />
        <div v-if="matchStatus(item.approvalStatus) === 'process'" slot="dot">
          <a-tooltip title="当前节点">
            <a-icon type="clock-circle-o" theme="filled" class="dot-process" />
          </a-tooltip>
        </div>
        <div class="description">
          <div class="node-name"><span>{{ item.nodeName }}</span></div>
          <div class="dashed-bg" />
          <div class="handler">
            <div class="handler-info">
              <a-popover
                v-for="(appr, apprIndex) in item.approvallorList"
                :key="apprIndex"
                placement="bottom"
                trigger="click"
              >
                <template slot="content">
                  <div class="person-card">
                    <a-form-item :label="'姓名'" :label-col="{span: 4}" :wrapper-col="{span: 20}">
                      <span>{{ appr.name }}</span>
                      <a-button
                        ghost
                        type="primary"
                        class="call-them-btn"
                        @click="() => callTT(appr)"
                      >
                        联系TA
                      </a-button>
                    </a-form-item>
                    <a-form-item :label="'工号'" :label-col="{span: 4}" :wrapper-col="{span: 20}">
                      {{ appr.account }}
                    </a-form-item>
                    <a-form-item :label="'岗位'" :label-col="{span: 4}" :wrapper-col="{span: 20}">
                      {{ appr.dutiesName }}
                    </a-form-item>
                    <a-form-item :label="'部门'" :label-col="{span: 4}" :wrapper-col="{span: 20}">
                      {{ appr.departmentName }}
                    </a-form-item>
                  </div>
                </template>
                <a>{{ appr.name }}({{ appr.account }})<span v-if="apprIndex !== item.approvallorList.length - 1">、</span></a>
              </a-popover>
            </div>
            <div v-if="item.operatorName" class="log">
              <span class="apr-name">{{ item.operatorName }}&nbsp;于</span>
              <span class="apr-time">{{ item.createdDate }}</span>
              <span><SLine :value="item.content" :len="60" /></span>
            </div>
          </div>
        </div>
      </a-timeline-item>
    </a-timeline>
  </div>
</template>
<script>
import api from '@/api'
import utils from '@/utils'
export default {
  name: 'OperatorFlow',
  props: {
    bridge: {
      type: Object
    },
    businessId: {
      type: [String, Number]
    },
    businessType: {
      type: String
    }
  },
  data () {
    return {
      timeLineItems: []
    }
  },
  watch: {
    businessId: {
      handler () {
        this.loadTimeLine()
      },
      immediate: true
    },
    businessType: {
      handler () {
        this.loadTimeLine()
      },
      immediate: true
    },
    bridge: {
      handler () {
        this.loadTimeLine()
      },
      immediate: true
    }
  },
  methods: {
    callTT (item) {
    },
    iShowTheDetail (index) {
      return index < this.timeLineItems.length - 1
    },
    async loadTimeLine () {
      const id = this.businessId
      const type = this.businessType
      if (utils.isNone(id)) return false
      if (utils.isNone(type)) return false
      const res = await api.postpooperationloglist({
        pageNum: 1,
        pageSize: 99,
        businessId: id,
        businessType: type
      })
      if (res.code === 200) {
        const records = (res.data && res.data.records) || []
        this.timeLineItems = records.map((item) => {
          item.createdDate = utils.date2YMDHM(item.createdDate)
          return item
        })
      }
    },
    matchStatus (approvalStatus) {
      // approvalStatus ：0：未处理，1：处理中，2：已处理
      const map = {
        0: 'wait',
        1: 'process',
        2: 'finish'
      }
      return map[approvalStatus]
    }
  }
}
</script>
<style lang="less" scoped>
.operator-flow {
  overflow: auto;
  padding: 1rem;
  /deep/.ant-timeline-item {
    margin-bottom: 1.6rem;
    &:last-child {
      margin-bottom: 0;
      padding-bottom: 0;
    }
    /deep/.ant-timeline-item-head {
      font-size: 16px;
      color: #999;
      border-color: #999;
    }
    .dot-process {
      color: #d3c300;
      border-color: #d3c300;
    }
    .dot-finish {
      color: #53d468;
      border-color: #53d468;
    }
    .description {
      .node-name {
        display: inline-block;
        width: 7rem;
        z-index: 1;
        position: relative;
        > span {
          padding: 0 0.5rem;
          background: #fff;
        }
      }
    }
    .dashed-bg {
      display: inline-block;
      width: 12rem;
      position: absolute;
      left: 0;
      top: 0.7rem;
      border-top: 1px dashed #cbcbcb;
      z-index: 0;
    }
    .handler {
      display: inline-block;
      position: absolute;
      left: 13rem;
      top: 0;
      .line-standard {
        line-height: 1;
      }
      .log {
        color: #aeaeae;
        margin-top: 0.5rem;
        font-size: 0.8rem;
        span {
          padding-right: 0.5rem;
        }
        .line-standard {
          display: inline-block;
          line-height: 1.25;
        }
      }
    }
  }
}
.person-card {
  width: 300px;
}
.call-them-btn {
  margin-left: 3rem;
}
</style>
