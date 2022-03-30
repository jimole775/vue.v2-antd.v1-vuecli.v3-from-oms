<template>
  <a-modal
    :title="'路由配置'"
    v-model="modal.show"
    width="60%"
    @ok="confirm"
  >
    <a-form :form="form">
      <a-row>
        <a-col :span="24">
          <a-form-item label="父级目录名" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-input :disabled="isModify" v-decorator="['parent']" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="文件存放目录名" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-input
              :disabled="isModify"
              v-decorator="['name', {
                rules: [
                  { required: true, message: '请确认文件存放目录' },
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
import utils from '@/utils'
export default {
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
      this.form.validateFields((err, values) => {
        if (err) {
          return false
        }
        const res = this.validateRoute(values)
        if (res.message) {
          return this.$modal.warning({
            title: '提示',
            content: res.message
          })
        }
        this.modal.show = false
        this.$emit('update', utils.clone(values))
      })
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
            res.message = '文件存放目录名已存在'
            break
          }
          if (!res.message && item.children) {
            recursion(item.children, res)
          }
        }
      }
      return res
    }
  }
}

</script>
