<template>
  <div class="handler-bar">
    <a-button type="primary" :loading="loading" @click="builded">提交</a-button>
    <a-button type="primary" :loading="loading" @click="() => stage(1)">暂存</a-button>
    <a-button type="primary" ghost @click="showPreview">预览</a-button>
    <a-button type="primary" ghost @click="backToProjects">选择其他项目</a-button>
    <div class="pull-right">
      <a-avatar icon="user" class="mr5" :src="user.image" />
      <span class="black" v-text="user.name" />
      (<span style="margin: 0 0.2rem;font-size: 12px;" v-text="user.employeeNumber" />)
    </div>
    <Preview :modal="previewModal" />
  </div>
</template>

<script>
import api from '@/api'
import utils from '@/utils'
import builder from '@/mixins/builder'
import base from '@/mixins/base'
import Preview from './preview.vue'
export default {
  mixins: [builder, base],
  name: 'Header',
  components: { Preview },
  data () {
    return {
      previewModal: {
        show: false,
        data: {}
      }
    }
  },
  computed: {
    user () {
      return this.$store.state.global.user
    }
  },
  created () {
    // this.createListener()
  },
  mounted () {
    // revert(this.buildData)
  },
  methods: {
    backToProjects () {
      this.setProjectName('')
    },
    showPreview () {
      this.previewModal.show = true
      this.previewModal.data = utils.clone(this.buildData)
    },
    validBuildedData () {
      // 根据api来判断是否需要提交相关的tab数据
      // 比如：发起API没有填写，那么即使有formItems数据，也不需要提交
      const {
        tabs = [],
        apimap = {},
        list = {},
        apply = {},
        approval = {},
        router = {}
      } = this.buildData
      const err = []
      if (!tabs.length) {
        err.push('请先进行配置！')
      }
      tabs.forEach((tab, index) => {
        const api = apimap[index]
        const listConfig = list[index]
        const applyConfig = apply[index]
        const approvalConfig = approval[index]
        if (!router || !router.path) {
          err.push('请先在左侧菜单栏配置【路由】地址！')
        }
        if (!api || !api.list || !(api.list && api.list.url && api.list.method)) {
          err.push('请先配置【列表】的数据接口！')
        }
        if (!listConfig || !(listConfig && listConfig.columns && listConfig.columns.length)) {
          err.push('请先配置【列表】的表头字段！')
        }
        if (!listConfig || !(listConfig && listConfig.columns && listConfig.columns.length)) {
          err.push('请先配置【列表】的表头数据！')
        }
        if ((applyConfig && applyConfig.panels && applyConfig.panels.length) && (!api || !api.apply || !(api.apply && api.apply.url && api.apply.method))) {
          err.push('请先配置【申请】模块的发起接口！')
        }
        if ((!applyConfig || !applyConfig.panels || !applyConfig.panels.length) && (api && api.apply && api.apply.url && api.apply.method)) {
          err.push('请先配置【申请】模块的基本信息！')
        }
        if (api && api.approval && api.approval.url && api.approval.method) {
          if (!approvalConfig) {
            err.push('【审批详情】模块未配置！')
          } else {
            Object.keys(approvalConfig).forEach(node => {
              const { permission, dispermission } = approvalConfig[node]['panels']
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
    builded () {
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
            const res = await api.postbuilderbuilded({ buildData: this.buildData })
            if (res.code === 200) {
              this.$message.success('提交并构建成功！')
              this.stage(0)
            } else {
              this.$message.warning(res.message)
            }
          }
        })
      }
    },
    async stage (callAlert) {
      if (this.viewData.isEmpty) {
        this.$message.warning('没有数据可以保存！')
      } else {
        const res = await api.postbuilderstage({ viewData: this.viewData })
        if (res.code === 200) {
          callAlert && this.$message.success('保存成功')
          // 暂存之后，变更编辑类型
          this.setEditType('modify')
        } else {
          this.$message.warning(res.message)
        }
      }
    }
  }
}

</script>
<style lang="less" scoped>
.handler-bar {
  .ant-btn {
    margin: 0 0.5rem;
  }
}
</style>
