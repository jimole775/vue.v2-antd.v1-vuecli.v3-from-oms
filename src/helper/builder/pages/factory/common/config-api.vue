<template>
  <a-modal
    :title="title ? `配置【${title}】` : '配置'"
    v-model="modal.show"
    width="60%"
    @ok="confirm"
  >
    <a-form :form="form">
      <a-row>
        <a-col :span="24">
          <a-form-item label="url" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-input v-decorator="['url', {rules: [{ required: true, message: '请确认url' }]}]" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="method" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-select v-decorator="['method', {rules: [{ required: true, message: '请确认method' }]}]">
              <a-select-option value="GET">GET</a-select-option>
              <a-select-option value="POST">POST</a-select-option>
              <a-select-option value="PUT">PUT</a-select-option>
              <a-select-option value="DELETE">DELETE</a-select-option>
            </a-select>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="自定义参数" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-row>
              <a-col v-for="(item, index) in customParams" :key="index">
                <a-form-item
                  :label-col="{span: 8}"
                  :wrapper-col="{span: 16}"
                >
                  <template slot="label">
                    <a-input allow-clear v-model="item.key" />
                  </template>
                  <div class="object-ctrl">
                    <a-input allow-clear v-model="item.value" />
                    <a-button @click="() => addProp()">+</a-button>
                    <a-button @click="() => reduceProp(index)">-</a-button>
                  </div>
                </a-form-item>
              </a-col>
            </a-row>
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
      form: this.$form.createForm(this),
      customParams: [{ key: '', value: '' }]
    }
  },
  watch: {
    modal: {
      handler ({ data, show }) {
        if (show) {
          this.deployParams(data)
          this.form.setFieldsValue(data)
        } else {
          this.form.resetFields()
        }
        if (!this.customParams.length) {
          this.customParams = [{ key: '', value: '' }]
        }
      },
      deep: true,
      immediate: true
    }
  },
  computed: {
    title () {
      return this.modal.data ? this.modal.data.title : ''
    }
  },
  methods: {
    deployParams (data) {
      this.customParams = []
      const params = data.params || {}
      Object.keys(params).forEach((key) => {
        const value = params[key]
        this.customParams.push({ key, value })
      })
    },
    addProp () {
      this.customParams.push({ key: '', value: '' })
    },
    reduceProp (i) {
      if (this.customParams && this.customParams.length > 1) {
        this.customParams.splice(i, 1)
      }
    },
    confirm () {
      this.form.validateFields((err, values) => {
        if (err) {
          return false
        }
        this.modal.show = false
        const model = {
          title: this.modal.data.title,
          url: values.url,
          method: values.method,
          params: array2object(this.customParams)
        }
        this.$emit('update', utils.clone(model))
      })
    }
  }
}

function array2object (src = []) {
  const res = Object.create(null)
  src.forEach((item) => {
    if (utils.isValuable(item.key)) {
      res[item.key] = item.value
    }
  })
  return res
}
</script>
<style lang="less" scoped>
.object-ctrl {
  display: flex;
  padding: 4px;
  button {
    margin-left: 4px;
  }
}
</style>
