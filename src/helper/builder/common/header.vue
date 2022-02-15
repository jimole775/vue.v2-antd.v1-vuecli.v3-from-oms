<template>
  <div>
    <a-button>完成配置</a-button>
    <div class="pull-right">
      <a-avatar icon="user" class="mr5" :src="user.image" />
      <span class="black" v-text="user.name" />
      (<span style="margin: 0 0.2rem;font-size: 12px;" v-text="user.employeeNumber" />)
    </div>
  </div>
</template>

<script>
import Vue from 'vue'
export default {
  name: 'Header',
  data () {
    return {
      buildedData: {
        panes: [],
        // 把所有对应的接口都写到 apimap 统一管理
        // 可多不可少
        apimap: {
          // 0: {
          //   apply: 'postkeyeventsstart', // 申请 接口
          //   approval: 'postkeyeventsapprove', // 审批 接口
          //   list: 'postkeyeventspage', // 列表查询 接口
          //   detail: 'getkeyeventsdetail', // 审批详情 接口
          //   export: 'postkeyeventsexport', // 导出列表 接口
          //   pass: '', // 批量审批 【通过】接口
          //   unpass: '', // 批量审批 【不通过】接口
          //   close: 'postkeyeventsbatchClose', // 批量审批 【关闭】接口
          //   revoke: 'postkeyeventsbatchRevoke', // 批量审批 【撤回】接口
          //   reject: '', // 批量审批 【驳回】接口
          //   appliable: '$services.com.oppo.oms.basicdata.key-events-apply', // 是否有权限申请
          //   approvalable: '$services.com.oppo.oms.basicdata.key-events-apply', // 是否有权限审批
          //   viewable: '$services.com.oppo.oms.basicdata.key-events', // 是否有权限查看
          //   passable: '', // 是否有权限批量通过
          //   unpassable: '', // 是否有权限批量不通过
          //   closable: '$services.com.oppo.oms.basicdata.key-events-close', // 是否有权限批量关闭
          //   revokable: '$services.com.oppo.oms.basicdata.key-events-revoke', // 是否有权限批量撤回
          //   rejectable: '', // 是否有权限批量驳回
          //   logType: 'key_events_flow' // 日志的type
          // }
        },
        // “数据列表”配置项，参数参考 [STable](./STable.md) 文档
        listConfig: {
          // 0: {
          //   columns: [],
          //   searchor: []
          // }
        },
        // “申请页面” 配置项
        applyConfig: {
          // 0: {
          // panels: [{
          //   component: 'FormItemRender',
          //   title: '基本信息',
          //   mode: 'edit',
          //   show: true,
          //   formItems: [
          //     {
          //       label: '交付形式',
          //       key: 'deliveryTypeCode',
          //       component: 'AInput'
          //     }
          //   ]
          // }]
          // }
        },
        // “审批详情” 配置项
        approvalConfig: {
          // 0: {
          // 节点名“start”
          // start: {
          //   panels: {
          //     // 没权限审批的，只能看“只读”内容
          //     dispermission: [{
          //       component: 'FormItemRender',
          //       title: '基本信息',
          //       mode: 'readonly',
          //       show: true,
          //       formItems: [
          //         {
          //           label: '交付形式',
          //           key: 'deliveryTypeCode'
          //         }
          //       ]
          //     }],
          //     // 有权限进行审批的
          //     permission: [{
          //         component: 'FormItemRender',
          //         title: '基本信息',
          //         mode: 'edit',
          //         show: true,
          //         formItems: [
          //           {
          //             label: '交付形式',
          //             key: 'deliveryTypeCode',
          //             component: 'AInput'
          //           }
          //         ]
          //       },
          //       {
          //         component: 'ApprovalOperation',
          //         title: '审批操作',
          //         mode: 'edit',
          //         show: true,
          //         operationItem: {
          //           // 提交的选项
          //           radios: [
          //             { label: '通过', value: '1', key: 'approvalResult', title: '', component: 'ARadio', event (val, options, vm) {} },
          //             { label: '驳回', value: '2', key: 'approvalResult', title: '', component: 'ARadio', event (val, options, vm) {} },
          //             { label: '不通过', value: '3', key: 'approvalResult', title: '', component: 'ARadio', event (val, options, vm) {} }
          //           ],
          //           // 必填项
          //           inputs: [
          //             {
          //               label: '审批意见',
          //               key: 'approvalContent',
          //               component: 'ATextarea',
          //               permissions: ['1', '2', '3'],
          //               required: true
          //             }
          //           ]
          //         }
          //       }]
          //     }
          //   }
          // }
        }
      }
    }
  },
  computed: {
    user () {
      return this.$store.state.global.user
    }
  },
  created () {
    Vue.bus.$on('_panes_', (tabIndex, value) => {
      this.buildedData['panes'][tabIndex] = value
      console.log(this.buildedData['panes'])
    })

    Vue.bus.$on('_apimap_', (tabIndex, value) => {
      if (!this.buildedData['apimap'][tabIndex]) {
        this.buildedData['apimap'][tabIndex] = Object.create(null)
      }
      const already = this.buildedData['apimap'][tabIndex]
      this.buildedData['apimap'][tabIndex] = {
        ...already,
        ...value
      }
      console.log(this.buildedData['apimap'])
    })

    Vue.bus.$on('_list_', (tabIndex, value) => {
      if (!this.buildedData['listConfig'][tabIndex]) {
        this.buildedData['listConfig'][tabIndex] = Object.create(null)
      }
      this.buildedData['listConfig'][tabIndex] = value
      console.log(this.buildedData['listConfig'])
    })

    Vue.bus.$on('_apply_', (tabIndex, value) => {
      this.buildedData['applyConfig'][tabIndex] = value
      console.log(this.buildedData['applyConfig'])
    })

    Vue.bus.$on('_approval_', (tabIndex, value) => {
      this.buildedData['approvalConfig'][tabIndex] = value
      console.log(this.buildedData['approvalConfig'])
    })
  },
  methods: {
    validBuildedData () {

    }
  }
}
</script>
