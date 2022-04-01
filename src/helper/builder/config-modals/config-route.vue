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
        <a-col :span="24">
          <a-form-item label="父级目录名" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-input :disabled="isModify" v-decorator="['parent']" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="项目名" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-input
              :disabled="isModify"
              v-decorator="['name', {
                rules: [
                  { required: true, message: '请确认项目名' },
                  { pattern: /^[a-z]([a-z-]*)$/g, message: '只支持小写字母、-'}
                ]
              }]"
            />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="URL访问地址" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-input placeholder="/xxx/xxx/xxx" v-decorator="['path', {rules: [{ required: true, message: '请确认URL访问地址' }]}]" />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
  </a-modal>
</template>
<script>
import api from '@/api'
import utils from '@/utils'
import mixins from '@builder/mixins'
import base from '@/mixins/base'
export default {
  mixins: [mixins, base],
  props: {
    modal: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      form: this.$form.createForm(this)
    }
  },
  computed: {
    isModify () {
      return this.$store.state.builder.editType === 'modify'
    },
    isNew () {
      return this.$store.state.builder.editType === 'new'
    }
  },
  watch: {
    modal: {
      handler ({ data, show }) {
        if (show) {
          setTimeout(() => {
            this.form.setFieldsValue(data)
          })
        } else {
          this.form.resetFields()
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
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
              content: '项目已存在！' // 只提示 “项目已存在”，不必让用户知道具体信息
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
      if (this.projects && this.projects.length) {
        if (this.projects.includes(name)) {
          res.message = '项目已存在！'
        }
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
      recursion(routes, res)
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
