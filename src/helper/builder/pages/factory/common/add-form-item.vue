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
          <a-form-item label="字段名" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-input v-decorator="['key', {rules: [{ required: true, message: '请确认关键字' }]}]" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="字段标签" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-input v-decorator="['title', {rules: [{ required: true, message: '请确认字段标签' }]}]" />
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item label="宽度调整" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <div class="width-adjust" style="display: flex;">
              <span class="width-adjust-label">span: </span>
              <a-input-number v-decorator="['span', { rules: [{ required: false }]}]" />
              <span class="width-adjust-label">label: </span>
              <a-input-number v-decorator="['label', { rules: [{ required: false }]}]" />
              <span class="width-adjust-label">wrapper: </span>
              <a-input-number v-decorator="['wrapper', { rules: [{ required: false }]}]" />
            </div>
          </a-form-item>
        </a-col>
        <a-col :span="24">
          <a-form-item :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <span slot="label">
              提交字段调整
              <a-tooltip title="当一个组件需要提交至少两个字段时，可以使用。">
                <a-icon type="question-circle-o" />
              </a-tooltip>
            </span>
            <code v-if="showParamTransfer">
              <span>paramTransfer (params, vm) {</span>
              <a-textarea v-decorator="['paramTransfer', {rules: [{ required: false }]}]" />
              <span>}</span>
            </code>
            <a v-else @click="showParamTransfer = true"><a-icon type="plus-circle" /></a>
          </a-form-item>
        </a-col>
        <a-col v-if="getTabType === '2'" :span="24">
          <a-form-item :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <span slot="label">
              控制节点
              <a-tooltip title="勾选即显示">
                <a-icon type="question-circle-o" />
              </a-tooltip>
            </span>
            <a-checkbox-group
              v-decorator="['stepNodes', {rules: [{ required: false }]}]"
              :options="getStepNodes"
            />
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
            <a-form-item label="组件" :label-col="{span: 6}" :wrapper-col="{span: 16}">
              <CompSelect
                v-decorator="['component', {rules: [{ required: true, message: '请确认查询组件' }]}]"
                @change="componentChange"
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
                      <a-button @click="() => reduceProp(index)">-</a-button>
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
                      <span>
                        {{ param.key }}
                        <span v-if="$utils.isArray(param.type)" :style="style.selected">
                          (<template v-for="t in param.type">
                            <a :key="t" :style="param.typeSelected === t ? style.selected : style.unselect" @click="() => typeChanged(param, t)">
                              {{ t | type2string }}
                            </a>
                          </template>)
                        </span>
                        <span v-else-if="$utils.isValuable(param.type)" :style="style.selected">
                          ({{ param.type | type2string }})
                        </span>
                      </span>
                    </template>
                    <div v-if="$utils.isNone(param.type)">
                      <a-textarea v-model="param.value" />
                    </div>
                    <div v-else-if="$utils.isArray(param.type)">
                      <div v-for="(t, i) in param.type" :key="i">
                        <div v-if="param.typeSelected === t">
                          <div v-if="$utils.isNumberConstructor(t)">
                            <a-input-number allow-clear v-model="param.value" />
                          </div>
                          <div v-else-if="$utils.isStringConstructor(t)">
                            <a-input allow-clear v-model="param.value" />
                          </div>
                          <div v-else-if="$utils.isBooleanConstructor(t)">
                            <a-radio-group v-model="param.value">
                              <a-radio :value="true">
                                true
                              </a-radio>
                              <a-radio :value="false">
                                false
                              </a-radio>
                            </a-radio-group>
                          </div>
                          <div class="reference-object" v-else-if="$utils.isObjectConstructor(t)">
                            <span>{</span>
                            <a-textarea v-model="param.value" />
                            <span>}</span>
                          </div>
                          <div class="reference-object" v-else-if="$utils.isArrayConstructor(t)">
                            <span>[</span>
                            <a-textarea v-model="param.value" />
                            <span>]</span>
                          </div>
                          <div v-else-if="$utils.isFunctionConstructor(t)">
                            <span>{{ param.value.head }}</span>
                            <a-textarea v-model="param.value.body" />
                            <span>{{ param.value.tail }}</span>
                          </div>
                          <div v-else>
                            <a-textarea v-model="param.value" />
                          </div>
                        </div>
                      </div>
                    </div>
                    <div v-else>
                      <div v-if="$utils.isNumberConstructor(param.type)">
                        <a-input-number allow-clear v-model="param.value" />
                      </div>
                      <div v-else-if="$utils.isStringConstructor(param.type)">
                        <a-input allow-clear v-model="param.value" />
                      </div>
                      <div v-else-if="$utils.isBooleanConstructor(param.type)">
                        <a-radio-group v-model="param.value">
                          <a-radio :value="true">
                            true
                          </a-radio>
                          <a-radio :value="false">
                            false
                          </a-radio>
                        </a-radio-group>
                      </div>
                      <div class="reference-object" v-else-if="$utils.isObjectConstructor(param.type)">
                        <span>{</span>
                        <a-textarea v-model="param.value" />
                        <span>}</span>
                      </div>
                      <div class="reference-object" v-else-if="$utils.isArrayConstructor(param.type)">
                        <span>[</span>
                        <a-textarea v-model="param.value" />
                        <span>]</span>
                      </div>
                      <div v-else-if="$utils.isFunctionConstructor(param.type)">
                        <span>{{ param.value.head }}</span>
                        <a-textarea v-model="param.value.body" />
                        <span>{{ param.value.tail }}</span>
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
import { mapGetters } from 'vuex'
import CompSelect from '@/helper/builder/common/comp-select.vue'
// const itemModel = {
//   key: '',
//   title: '',
//   span: 6,
//   label: 6,
//   wrapper: 16
// }
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
      configType: 'selection',
      showParamTransfer: false,
      style: {
        selected: { color: 'rgb(171 176 29)' },
        unselect: { color: 'rgb(200 200 200)' }
      }
    }
  },
  filters: {
    type2string
  },
  computed: {
    ...mapGetters(['getStepNodes', 'getTabType'])
  },
  watch: {
    modal: {
      handler ({ data, show }) {
        if (show) {
          if (data) {
            this.initialize(data)
          } else {
            this.$nextTick(() => {
              this.form.setFieldsValue({
                span: 6,
                label: 6,
                wrapper: 16,
                stepNodes: this.getStepNodes
              })
            })
          }
        } else {
          this.reset()
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    initialize (data) {
      let itemInfo = {
        key: data.key,
        title: data.title,
        stepNodes: data.stepNodes || this.getStepNodes,
        span: data.layout ? data.layout.span : 6,
        label: data.layout ? data.layout.label : 6,
        wrapper: data.layout ? data.layout.wrapper : 16
      }
      if (data.wrapperCustomRender) {
        this.configType = 'function'
        itemInfo.wrapperCustomRender = data.wrapperCustomRender
        this.$nextTick(() => {
          this.form.setFieldsValue(itemInfo)
        })
      } else {
        this.configType = 'selection'
        const props = this.deployProps(data)
        itemInfo.props = props
        itemInfo.component = data.component
        this.$nextTick(() => {
          this.form.setFieldsValue(itemInfo)
          this.componentChange(data.key, itemInfo)
        })
      }
    },
    reset () {
      this.form.resetFields()
      this.showParamTransfer = false
      this.configType = 'selection'
      this.defaultProps = []
      this.customProps = [{ key: '', value: '' }]
    },
    deployProps (data) {
      const res = utils.clone(data.originProps || {})
      const props = utils.clone(data.props || {})
      Object.keys(res).forEach((key) => {
        const item = res[key]
        if (props[key]) {
          item.default = props[key]
        }
      })
      return res
    },
    typeChanged (param, t) {
      param.typeSelected = t
      param.value = adjustDefault({
        ...utils.clone(param),
        type: t
      })
    },
    addProp () {
      this.customProps.push({ key: '', value: '' })
    },
    reduceProp (i) {
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
          stepNodes: values.stepNodes,
          configType: this.configType,
          layout: {
            span: values.span,
            label: values.label,
            wrapper: values.wrapper
          }
        }
        if (this.configType === 'selection') {
          model.component = values.component
          model.originProps = this.defaultProps.originProps
          model.props = {
            ...getModifyProps(this.defaultProps),
            ...array2object(this.customProps)
          }
        } else {
          model.wrapperCustomRender = values.wrapperCustomRender
        }
        this.$emit('update', utils.clone(model))
      })
    },
    componentChange (val, option) {
      this.defaultProps = []
      if (utils.isNone(val)) return false
      if (utils.isNone(option)) return false
      const props = option.props || {}
      Object.keys(props).forEach((key) => {
        let def = adjustDefault(props[key])
        let type = props[key].hasOwnProperty('type') ? props[key].type : undefined
        let required = props[key].hasOwnProperty('required') ? props[key].required : false
        let typeSelected = utils.isArray(type) ? type[0] : type
        this.defaultProps.push({
          key,
          type,
          required,
          value: def,
          typeSelected,
          default: utils.clone(def)
        })
      })
      // 暂存起来，主要为了在编辑状态的时候，可以用来数据回填
      this.defaultProps.originProps = utils.clone(option.props)
    }
  }
}

// 获取变更的属性
function getModifyProps (src = []) {
  const res = Object.create(null)
  src.forEach((item) => {
    if (item.type === Function) {
      if (item.default.body !== item.value.body) {
        res[item.key] = parseFunctionType(item.value)
      }
    } else {
      if (item.default !== item.value) {
        // res[item.key] = item.value
        if (item.type === Object) {
          res[item.key] = parseObjectType(item.value)
        } else if (item.type === Function) {
          res[item.key] = parseFunctionType(item.value)
        } else if (item.type === Array) {
          res[item.key] = parseArrayType(item.value)
        } else {
          res[item.key] = item.value
        }
      }
    }
  })
  return res
}

function adjustDefault (propItem) {
  let def = propItem.hasOwnProperty('default') ? propItem.default : undefined
  let res
  if (propItem.type === Object) {
    res = deparseObjectType(def)
  } else if (propItem.type === Array) {
    res = deparseArrayType(def)
  } else if (propItem.type === Function) { // Function类型，转成 String 方便输入
    res = deparseFunctionType(def)
  } else if (utils.isNone(propItem.type)) { // 如果没有限定类型，那么只能根据def来强制一个类型了
    if (utils.isFunction(def)) {
      propItem.type = Function
      res = deparseFunctionType(def)
    } else if (utils.isObject(def)) {
      propItem.type = Object
      res = deparseObjectType(def)
    } else if (utils.isArray(def)) {
      propItem.type = Array
      res = deparseArrayType(def)
    } else if (utils.isString(def)) {
      propItem.type = String
    } else if (utils.isNumber(def)) {
      propItem.type = Number
    } else if (utils.isBoolean(def)) {
      propItem.type = Boolean
    } else {
      res = def
    }
  } else {
    res = def
  }
  return res
}

function deparseObjectType (def) {
  let res = `{}`
  // Object的Function类型，先求值，然后转成 [{key:'',value:''}] 方便渲染
  if (utils.isFunction(def)) {
    def = def()
  }
  // Object类型，转成 [{key:'',value:''}] 方便渲染
  if (utils.isObject(def)) {
    res = JSON.stringify(def)
  }
  return cuteJSONSide(res)
}

function parseObjectType (src) {
  let res = {}
  if (utils.isString(src)) {
    try {
      res = JSON.parse(`{${src}}`)
    } catch (error) {
      res = {}
    }
  }
  return res
}

// 把Array转成字符串
function deparseArrayType (def) {
  let res = `[]`
  // Array的Function类型，先求值，然后转成 [] 方便渲染
  if (utils.isFunction(def)) {
    def = def()
  }
  if (utils.isArray(def)) {
    res = JSON.stringify(def)
  }
  return cuteJSONSide(res)
}

// 把字符串转成Array
function parseArrayType (src) {
  let res = []
  if (utils.isString(src)) {
    try {
      res = JSON.parse(`[${src}]`)
    } catch (error) {
      res = []
    }
  }
  return res
}

// 把函数字符串转成函数
function parseFunctionType (fnObj) {
  let res
  if (fnObj.body && fnObj.body.length > 0) {
    try {
      const args = fnObj.head.replace(/.*?\((.*?)\).*?{/ig, '$1').split(',')
      res = new Function(args, fnObj.body)
    } catch (error) {
      res = new Function(error.message)
    }
  }
  return res
}

// 从函数中获取函数实体
function deparseFunctionType (def) {
  let res = {
    head: '',
    body: '',
    tail: '}'
  }
  if (utils.isFunction(def)) {
    def = def.toString()
  } else {
    def = 'function () {}'
  }
  let regTail = /\}$/
  // 普通函数
  let regHead = /^(async\s)?function\s?([\w\$][\w\d\$]*?)*\s?\([(\r\n)\R\N\t\T]?([\w\d\$]*?,?\s?)*\)\s?{/
  res.head = def.match(regHead)
  if (!res.head) {
    // 箭头函数
    regHead = /^(async\s)?([\w\$][\w\d\$]*?)*\s?\([(\r\n)\R\N\t\T]?([\w\d\$]*?,?\s?)*\)\s?=>\s?{/
    res.head = def.match(regHead)
  }
  if (res.head) {
    res.head = res.head[0]
  }
  res.body = def.replace(regHead, '').replace(regTail, '')
  return res
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

function cuteJSONSide (src) {
  let res = ''
  if (utils.isJSONString(src)) {
    src = src.trim()
    res = src.substring(1, src.length - 1)
  }
  return res
}

</script>
<style lang="less" scoped>
.width-adjust {
  display: flex;
  span.width-adjust-label {
    padding: 0 1rem;
  }
  /deep/.ant-input-number {
    top: 4px;
  }
}
.object-ctrl {
  display: flex;
  padding: 4px;
  button {
    margin-left: 4px;
  }
}
.reference-object {
   display: flex;
   > span {
     padding: 0 0.3rem;
     border: 1px solid rgb(217 217 217);
   }
   > span:first-child {
     border-right: 0;
     border-radius: 0;
     border-radius: 3px 0 0 3px;
   }
   > span:last-child {
     border-left: 0;
     border-radius: 0 3px 3px 0;
   }
   > textarea {
     margin-bottom: 0;
     border-radius: 0;
   }
}
</style>
