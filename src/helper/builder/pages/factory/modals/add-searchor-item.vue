<template>
  <a-modal
    title="搜索项配置"
    v-model="modal.show"
    width="60%"
    @ok="confirm"
  >
    <a-form :form="form">
      <a-row>
        <a-col :span="24">
          <a-form-item label="字段码" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-input v-decorator="['key', {rules: [{ required: true, message: '请确认字段码' }]}]" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="字段名" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-input v-decorator="['title', {rules: [{ required: true, message: '请确认字段名' }]}]" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="配置类型" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-radio-group v-model="configType">
              <a-radio value="selection">
                配选
              </a-radio>
              <a-radio value="function">
                手写
              </a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
        <div v-if="configType === 'selection'">
          <a-col :span="24">
            <a-form-item label="查询组件" :label-col="{span: 6}" :wrapper-col="{span: 16}">
              <CompSelect
                v-decorator="['component', {rules: [{ required: true, message: '请确认查询组件' }]}]"
                @change="compChange"
              />
            </a-form-item>
          </a-col>
          <a-col :span="24">
            <a-form-item label="自定义参数" :label-col="{span: 6}" :wrapper-col="{span: 16}">
              <a-row>
                <a-col v-for="(item, index) in customProps" :key="index">
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
                      <a-button @click="() => redProp(index)">-</a-button>
                    </div>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form-item>
          </a-col>
          <a-col v-if="defaultProps.length" :span="24">
            <a-form-item label="默认参数" :label-col="{span: 6}" :wrapper-col="{span: 16}">
              <a-row>
                <a-col :span="24" v-for="param in defaultProps" :key="param.key">
                  <a-form-item
                    :required="param.required"
                    :label-col="{span: 8}"
                    :wrapper-col="{span: 16}"
                  >
                    <template slot="label">
                      <!-- <a-tooltip :title="type2string(param.type)">
                        &nbsp;<a-icon type="question-circle-o" />
                      </a-tooltip> -->
                      <span>
                        {{ `${param.key}` }}
                        <span v-if="$utils.isValuable(param.type)" style="color: rgb(171 176 29)">
                          ({{ param.type | type2string }})
                        </span>
                      </span>
                    </template>
                    <div v-if="$utils.isNone(param.type)">
                      <a-textarea v-model="param.value" />
                    </div>
                    <div v-else-if="$utils.isArray(param.type)">
                      <a-textarea v-model="param.value" />
                    </div>
                    <div v-else>
                      <div v-if="param.type === Number">
                        <a-input-number allow-clear v-model="param.value" />
                      </div>
                      <div v-else-if="param.type === String">
                        <a-input allow-clear v-model="param.value" />
                      </div>
                      <div v-else-if="param.type === Boolean">
                        <a-radio-group v-model="param.value">
                          <a-radio :value="true">
                            true
                          </a-radio>
                          <a-radio :value="false">
                            false
                          </a-radio>
                        </a-radio-group>
                        <!-- <a-select allow-clear v-model="param.value">
                          <a-select-option :key="true">true</a-select-option>
                          <a-select-option :key="false">false</a-select-option>
                        </a-select> -->
                      </div>
                      <div v-else-if="param.type === Object">
                        <a-row>
                          <a-col v-for="(item, index) in param.value" :key="index">
                            <a-form-item
                              :label-col="{span: 8}"
                              :wrapper-col="{span: 16}"
                            >
                              <template slot="label">
                                <a-input allow-clear v-model="item.key" />
                              </template>
                              <div class="object-ctrl">
                                <a-input allow-clear v-model="item.value" />
                                <a-button @click="() => addDefParamItem(param.value)">+</a-button>
                                <a-button @click="() => redDefParamItem(param.value, index)">-</a-button>
                              </div>
                            </a-form-item>
                          </a-col>
                        </a-row>
                      </div>
                      <div v-else-if="param.type === Array">
                        <a-row>
                          <a-col v-for="(item, index) in param.value" :key="index">
                            <a-form-item
                              :label-col="{span: 8}"
                              :wrapper-col="{span: 16}"
                            >
                              <template slot="label">
                                <a-input allow-clear v-model="item.key" />
                              </template>
                              <div class="object-ctrl">
                                <a-input allow-clear v-model="item.value" />
                                <a-button @click="() => addDefParamItem(param.value)">+</a-button>
                                <a-button @click="() => redDefParamItem(param.value, index)">-</a-button>
                              </div>
                            </a-form-item>
                          </a-col>
                        </a-row>
                      </div>
                      <div v-else>
                        <a-textarea v-model="param.value" />
                      </div>
                    </div>
                  </a-form-item>
                </a-col>
              </a-row>
            </a-form-item>
          </a-col>
        </div>
        <div v-if="configType === 'function'">
          <a-col :span="24">
            <a-form-item label="自定义组件" :label-col="{span: 6}" :wrapper-col="{span: 16}">
              <code>
                <span>wrapperCustomRender (h, formItem, vm) {</span>
                <a-textarea v-decorator="['wrapperCustomRender', {rules: [{ required: true, message: '请输入函数实体' }]}]" />
                <span>}</span>
              </code>
            </a-form-item>
          </a-col>
        </div>
      </a-row>
    </a-form>
  </a-modal>
</template>
<script>
import utils from '@/utils'
import CompSelect from '@/helper/builder/common/comp-select.vue'
export default {
  components: {
    CompSelect
  },
  props: {
    modal: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      form: this.$form.createForm(this),
      customProps: [{ key: '', value: '' }],
      defaultProps: [],
      configType: 'selection'
    }
  },
  filters: {
    type2string
  },
  methods: {
    addProp () {
      this.customProps.push({ key: '', value: '' })
    },
    redProp (i) {
      if (this.customProps && this.customProps.length > 1) {
        this.customProps.splice(i, 1)
      }
    },
    addDefParamItem (defParam) {
      defParam.push({ key: '', value: '' })
    },
    redDefParamItem (defParam, i) {
      if (defParam && defParam.length > 1) {
        defParam.splice(i, 1)
      }
    },
    confirm () {
      this.form.validateFields((err, values) => {
        if (err) {
          return false
        }
        this.modal.show = false
        const model = {
          key: values.key,
          title: values.title,
          component: values.component,
          props: {
            ...getModifyProps(this.defaultProps),
            ...array2object(this.customProps)
          }
        }
        console.log(model)
        this.$emit('update', model)
      })
    },
    packageSearchorItem () {

    },
    compChange (val, option) {
      this.defaultProps = []
      if (utils.isNone(val)) return false
      if (utils.isNone(option)) return false
      const props = option.props || {}
      Object.keys(props).forEach((key) => {
        let def = adjustDefault(props[key])
        let type = props[key].hasOwnProperty('type') ? props[key].type : undefined
        let required = props[key].hasOwnProperty('required') ? props[key].required : false
        this.defaultProps.push({
          key,
          type,
          required,
          value: def,
          default: utils.clone(def)
        })
      })
    }
  }
}

function getModifyProps (src = []) {
  const res = Object.create(null)
  src.forEach((item) => {
    debugger
    if (item.default !== item.value) {
      // res[item.key] = item.value
      if (item.type === Object) {
        res[item.key] = deparseObjectType(item.value)
      } else if (item.type === Function) {
        res[item.key] = deparseFunctionType(item.value)
      } else if (item.type === Array) {
        res[item.key] = deparseArrayType(item.value)
      }
    }
  })
  return res
}

function adjustDefault (propItem) {
  let def = propItem.hasOwnProperty('default') ? propItem.default : undefined
  let res
  if (propItem.type === Object) {
    res = parseObjectType(def)
  } else if (propItem.type === Array) {
    res = parseArrayType(def)
  } else if (propItem.type === Function) { // Function类型，转成 String 方便输入
    if (utils.isFunction(def)) {
      res = def.toString()
    }
  } else if (utils.isNone(propItem.type)) { // 如果没有限定类型，那么只能根据def来强制一个类型了
    if (utils.isFunction(def)) {
      propItem.type = Function
      res = parseFunctionType(def)
    }
    if (utils.isObject(def)) {
      propItem.type = Object
      res = parseObjectType(def)
    }
    if (utils.isArray(def)) {
      propItem.type = Array
      res = parseArrayType(def)
    }
    if (utils.isString(def)) {
      propItem.type = String
    }
    if (utils.isNumber(def)) {
      propItem.type = Number
    }
    if (utils.isBoolean(def)) {
      propItem.type = Boolean
    }
  }
  return utils.isValuable(res) ? res : def
}

function parseObjectType (def) {
  const res = []
  // Object的Function类型，先求值，然后转成 [{key:'',value:''}] 方便渲染
  if (utils.isFunction(def)) {
    def = def()
  }
  if (utils.isNone(def)) {
    def = { '': '' }
  }
  // Object类型，转成 [{key:'',value:''}] 方便渲染
  if (utils.isObject(def)) {
    Object.keys(def).forEach((key) => {
      const val = def[key]
      res.push({ key: key, value: val })
    })
    if (res.length === 0) {
      res.push({ key: '', value: '' })
    }
  }
  return res
}

function deparseObjectType (src = []) {
  const res = {}
  src.forEach((item) => {
    if (item.key) {
      res[item.key] = item.value
    }
  })
  return res
}

function parseArrayType (def) {
  let res = ''
  // Object的Function类型，先求值，然后转成 [] 方便渲染
  if (utils.isFunction(def)) {
    def = def()
  }
  res = def.toString()
  return res
}

function deparseArrayType () {
  
}

function parseFunctionType () {

}
function deparseFunctionType () {
  
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

function type2string (src) {
  const res = []
  if (utils.isArray(src)) {
    src.forEach((item) => {
      res.push(item.name || item)
    })
  } else {
    res.push(utils.isValuable(src) ? src.name : src)
  }
  return `${res.join(',')}`
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
