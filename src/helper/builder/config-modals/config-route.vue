<template>
  <a-modal
    :title="'路由配置'"
    v-model="modal.show"
    width="60%"
  >
    <template slot="footer">
      <a-button key="back" @click="modal.show = false">取消</a-button>
      <a-button
        :loading="loading"
        type="primary"
        @click="confirm"
      >
        确定
      </a-button>
    </template>
    <a-form :form="form">
      <a-row>
        <a-col :span="parentLayout.span">
          <a-form-item label="父级菜单" :label-col="{span: parentLayout.label}" :wrapper-col="{span: parentLayout.wrapper}">
            <RouterModuleSelect
              :disabled="isModify"
              v-decorator="['parent', {
                initialValue: modal.data.parent,
                rules: [ { required: true, message: '请确认父级菜单' }]
              }]"
              @change="routerModuleChange"
            />
          </a-form-item>
        </a-col>
        <div v-if="isInTopRouteState">
          <a-col :span="dyncButtonLayout.span">
            <a-form-item :label-col="{span: 8}" :wrapper-col="{span: 16}">
              <template slot="label">
                <span>
                  是否新增顶层菜单
                  <a-tooltip title="如果选择“否”，其菜单效果可以参考“首页”或者“人才库”">
                    <a-icon type="question-circle-o" />
                  </a-tooltip>
                </span>
              </template>
              <a-radio-group default-value="0" button-style="solid" v-model="isUpdateTopRoute">
                <a-radio-button value="1">是</a-radio-button>
                <a-radio-button value="0">否</a-radio-button>
              </a-radio-group>
            </a-form-item>
          </a-col>
          <a-col v-if="isUpdateTopRoute === '1'" :span="12">
            <a-form-item label="顶层菜单名" :label-col="{span: 8}" :wrapper-col="{span: 16}">
              <a-input
                allow-clear
                :disabled="isModify"
                placeholder="只支持中文、大写字母"
                v-decorator="['newParentMenuName', {
                  initialValue: modal.data.newParentMenuName,
                  rules: [
                    { required: true, message: '请确认顶层菜单名' },
                    { pattern: /^(([A-Z]*[\u4e00-\u9fa5]+)|([A-Z]+[\u4e00-\u9fa5]*))$/g, message: '只支持中文、大写字母'}
                  ]
                }]"
              />
            </a-form-item>
          </a-col>
          <a-col v-if="isUpdateTopRoute === '1'" :span="12">
            <a-form-item :label-col="{span: 8}" :wrapper-col="{span: 16}">
              <template slot="label">
                <span>
                  顶层项目名
                  <a-tooltip title="主要作为新构建代码的存放目录">
                    <a-icon type="question-circle-o" />
                  </a-tooltip>
                </span>
              </template>
              <a-input
                allow-clear
                :disabled="isModify"
                placeholder="只支持小写字母、-"
                v-decorator="['newParentName', {
                  initialValue: modal.data.newParentName,
                  rules: [
                    { required: true, message: '请确认顶层项目名' },
                    { pattern: /^[a-z]([a-z-]*)$/g, message: '只支持小写字母、-'}
                  ]
                }]"
              />
            </a-form-item>
          </a-col>
        </div>
        <a-col :span="12">
          <a-form-item label="项目菜单名" :label-col="{span: 8}" :wrapper-col="{span: 16}">
            <a-input
              allow-clear
              :disabled="isModify"
              placeholder="只支持中文、大写字母"
              v-decorator="['menuName', {
                initialValue: modal.data.menuName,
                rules: [
                  { required: true, message: '请确认项目菜单名' },
                  { pattern: /^[A-Z\u4e00-\u9fa5\(\)-]+$/g, message: '只支持中文、大写字母、()、-'}
                ]
              }]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="12">
          <a-form-item label="项目名" :label-col="{span: 8}" :wrapper-col="{span: 16}">
            <a-input
              allow-clear
              :disabled="isModify"
              placeholder="只支持小写字母、-"
              v-decorator="['name', {
                initialValue: modal.data.name,
                rules: [
                  { required: true, message: '请确认项目关键字' },
                  { pattern: /^[a-z]([a-z-]*)$/g, message: '只支持小写字母、-'}
                ]
              }]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="URL访问路径" :label-col="{span: 4}" :wrapper-col="{span: 20}">
            <a-input
              allow-clear
              placeholder="/xxx/xxx/xxx"
              v-decorator="['path', {
                initialValue: modal.data.path,
                rules: [{ required: true, message: '请确认URL访问地址' }]
              }]"
            />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>
<script>
import api from '@/api'
import utils from '@/utils'
import builder from '@builder/mixins/builder'
import baseMixins from '@/mixins/baseMixins'
import RouterModuleSelect from '@/components/RouterModuleSelect'
export default {
  components: {
    RouterModuleSelect
  },
  mixins: [builder, baseMixins],
  props: {
    modal: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      isUpdateTopRoute: '0',
      isInTopRouteState: false,
      dyncButtonLayout: { span: 12, label: 8, wrapper: 16 },
      parentLayout: { span: 24, label: 4, wrapper: 20 },
      form: this.$form.createForm(this)
    }
  },
  computed: {
    isModify () {
      return this.$store.state.builder.editType === 'modify'
    },
    isNew () {
      return this.$store.state.builder.editType === 'new'
    },
    alreadyProjects () {
      return this.modal.data.already || []
    }
  },
  // watch: {
  //   modal: {
  //     handler ({ data, show }) {
  //       if (show) {
  //         setTimeout(() => {
  //           this.form.setFieldsValue(data)
  //         })
  //       }
  //     },
  //     deep: true,
  //     immediate: true
  //   }
  // },
  methods: {
    routerModuleChange (value) {
      this.isInTopRouteState = value === 'views'
      const span = this.isInTopRouteState ? 24 - this.dyncButtonLayout.span : 24
      const label = this.isInTopRouteState ? 8 : 4
      const wrapper = this.isInTopRouteState ? 16 : 20
      this.parentLayout = { span, label, wrapper }
    },
    confirm () {
      this.form.validateFields(async (err, values) => {
        if (err) {
          return false
        }
        // 如果是新项目，需要去校验是否项目已存在
        if (this.isNew) {
          const rMessage = this.validateRoute(values)
          const pMessage = this.validateProject(values.name)
          const bMessage = await this.validateBranch(values.name)
          if (rMessage || pMessage || bMessage) {
            return this.$modal.warning({
              title: '提示',
              content: rMessage || pMessage || bMessage
            })
          }
        }
        this.modal.show = false
        this.$emit('update', utils.clone(values))
      })
    },
    validateProject (name) {
      const res = {
        message: ''
      }
      if (this.alreadyProjects && this.alreadyProjects.length) {
        const already = this.alreadyProjects.find(i => i.name === name)
        res.message = already ? '项目已存在！' : ''
      }
      return res.message
    },
    async validateBranch (name) {
      const res = {
        message: ''
      }
      const serv = await api.getbuilderbranchs()
      if (serv.code === 200) {
        const branchs = serv.data.branchs
        if (branchs && branchs.length) {
          if (branchs.includes(`builder-${name}`)) {
            res.message = '代码库分支已存在！'
          }
        }
      }
      return Promise.resolve(res.message)
    },
    validateRoute (values) {
      // 确保路由是唯一的
      const routes = this.$router.options.routes || []
      const res = {
        path: values.path,
        name: values.name,
        message: ''
      }
      recursion(routes.concat(this.alreadyProjects), res)
      function recursion (children, res) {
        for (let i = 0; i < children.length; i++) {
          const item = children[i]
          if (item.path === res.path) {
            res.message = 'URL访问地址已存在'
            break
          }
          if (item.name === res.name) {
            res.message = '项目名已存在'
            break
          }
          if (!res.message && item.children) {
            recursion(item.children, res)
          }
        }
      }
      return res.message
    }
  }
}

</script>
