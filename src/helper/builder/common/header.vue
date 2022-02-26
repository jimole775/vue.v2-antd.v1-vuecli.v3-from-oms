<template>
  <div>
    <a-button @click="handup">完成配置</a-button>
    <a-button @click="showPreview">预览</a-button>
    <div class="pull-right">
      <a-avatar icon="user" class="mr5" :src="user.image" />
      <span class="black" v-text="user.name" />
      (<span style="margin: 0 0.2rem;font-size: 12px;" v-text="user.employeeNumber" />)
    </div>
    <Preview :modal="previewModal" />
  </div>
</template>

<script>
import Vue from 'vue'
import api from '@/api'
import utils from '@/utils'
import Preview from './preview.vue'
export default {
  components: { Preview },
  name: 'Header',
  data () {
    return {
      previewModal: {
        show: false,
        data: {}
      },
      buildData: {
        tabs: [],
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
          //   appliable: '$services.com.xxx', // 是否有权限申请
          //   approvalable: '$services.com.xxx', // 是否有权限审批
          //   viewable: '$services.com.xxx', // 是否有权限查看
          //   passable: '', // 是否有权限批量通过
          //   unpassable: '', // 是否有权限批量不通过
          //   closable: '$services.com.xxx', // 是否有权限批量关闭
          //   revokable: '$services.com.xxx', // 是否有权限批量撤回
          //   rejectable: '', // 是否有权限批量驳回
          //   logType: 'key_events_flow' // 日志的type
          // }
        },
        // “数据列表”配置项，参数参考 [STable](./STable.md) 文档
        listConfig: {},
        // “申请页面” 配置项
        applyConfig: {},
        // “审批详情” 配置项
        approvalConfig: {},
        routerConfig: {}
      }
    }
  },
  computed: {
    user () {
      return this.$store.state.global.user
    }
  },
  created () {
    Vue.bus.$on('__tabs__', (value) => {
      this.buildData['tabs'] = value
    })

    Vue.bus.$on('__apimap__', (tabIndex, value) => {
      if (!this.buildData['apimap'][tabIndex]) {
        this.buildData['apimap'][tabIndex] = Object.create(null)
      }

      const already = this.buildData['apimap'][tabIndex]
      this.buildData['apimap'][tabIndex] = {
        ...already,
        ...value
      }
    })

    Vue.bus.$on('__list__', (tabIndex, value) => {
      if (!this.buildData['listConfig'][tabIndex]) {
        this.buildData['listConfig'][tabIndex] = Object.create(null)
      }
      this.$set(this.buildData['listConfig'], tabIndex, value)
    })

    Vue.bus.$on('__apply__', (tabIndex, value) => {
      this.$set(this.buildData['applyConfig'], tabIndex, value)
    })

    Vue.bus.$on('__approval__', async (tabIndex, value) => {
      this.$set(this.buildData['approvalConfig'], tabIndex, value)
    })

    Vue.bus.$on('__router__', async (value) => {
      this.$set(this.buildData['routerConfig'], value)
    })
  },
  methods: {
    showPreview () {
      this.previewModal.show = true
      this.previewModal.data = utils.clone(this.buildData)
    },
    validBuildedData () {
      // 根据api来判断是否需要提交相关的tab数据
      // 比如：发起API没有填写，那么即使有formItems数据，也不需要提交
      const {
        tabs,
        apimap,
        listConfig,
        applyConfig,
        approvalConfig,
        routerConfig
      } = this.buildData
      const err = []
      tabs.forEach((tab, index) => {
        const api = apimap[index]
        const list = listConfig[index]
        const apply = applyConfig[index]
        const approval = approvalConfig[index]
        if (!routerConfig || !routerConfig.name || !routerConfig.path) {
          err.push('请先在左侧菜单栏配置【路由】地址！')
        }
        if (!api || !api.list || !(api.list && api.list.url && api.list.method)) {
          err.push('请先配置【列表】的访问地址！')
        }
        if (!list || !(list && list.columns && list.columns.length)) {
          err.push('请先配置【列表】的表头字段！')
        }
        if (!list || !(list && list.columns && list.columns.length)) {
          err.push('请先配置【列表】的表头数据！')
        }
        if ((apply && apply.panels && apply.panels.length) && (!api || !api.list || !(api.list && api.list.url && api.list.method))) {
          err.push('请先配置【申请】模块的访问地址！')
        }
        if ((!apply || !apply.panels || !apply.panels.length) && (api && api.apply && api.apply.url && api.apply.method)) {
          err.push('请先配置【申请】模块的基本信息！')
        }
        if (api && api.approval && api.approval.url && api.approval.method) {
          if (!approval) {
            err.push('【审批详情】模块未配置！')
          } else {
            Object.keys(approval).forEach(node => {
              const { permission, dispermission } = approval[node]['panels']
              if (permission.length === 0) {
                err.push('请先配置【审批详情】模块的审批操作！')
              }
              if (dispermission.length === 0) {
                err.push('请先配置【审批详情】模块的基本信息！')
              }
            })
          }
        }
      })
      return err
    },
    handup () {
      const err = this.validBuildedData()
      if (err.length) {
        this.$modal.warning({
          title: '提示',
          content: err[0]
        })
      } else {
        this.$modal.confirm({
          title: '提示',
          content: '是否提交？',
          onOk: async () => {
            const res = await api.postbuild({ buildConstructs: this.buildData })
            if (res.code === 200) {
              this.$message.success('提交并构建成功！')
            } else {
              this.$message.warning('构建失败！')
            }
          }
        })
      }
    }
  }
}
</script>
