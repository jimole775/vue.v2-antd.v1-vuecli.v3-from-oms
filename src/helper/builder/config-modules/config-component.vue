<template>
  <div>
    <a-row>
      <a-col :span="24">
        <a-form-item label="组件" :label-col="{span: 6}" :wrapper-col="{span: 16}">
          <ComponentSelect
            :value="dataInfo.component"
            @change="componentChange"
          />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col :span="24">
        <a-form-item label="自定义参数" :label-col="{span: 6}" :wrapper-col="{span: 16}">
          <CustomParams v-model="customParams" />
        </a-form-item>
      </a-col>
    </a-row>
    <a-row>
      <a-col v-if="defaultPropsList.length" :span="24">
        <a-form-item label="默认参数" :label-col="{span: 6}" :wrapper-col="{span: 16}">
          <a-row>
            <a-col :span="24" v-for="(param, dpIndex) in defaultPropsList" :key="dpIndex">
              <a-form-item
                :required="param.required"
                :label-col="{span: 8}"
                :wrapper-col="{span: 16}"
              >
                <!-- key字段 -->
                <template slot="label">
                  <span>
                    {{ param.key }}
                    <span v-if="$utils.isArray(param.type)" :style="typeStyle.selected">
                      (<template v-for="(t, i) in param.type">
                        <a
                          :key="i"
                          :style="typeSelectStyle(param, t)"
                          @click="() => typeChanged(param, t)"
                        >
                          {{ t | type2string }}
                        </a>
                      </template>)
                    </span>
                    <span v-else-if="$utils.isValuable(param.type)" :style="typeStyle.selected">
                      ({{ param.type | type2string }})
                    </span>
                  </span>
                </template>
                <!-- value字段 -->
                <div v-if="$utils.isNone(param.type)">
                  <a-textarea v-model="param.value" />
                </div>
                <!-- 这里需要判断是否是 Array 实例 -->
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
                      <div v-else-if="$utils.isObjectConstructor(t)" class="reference-object">
                        <span>{</span>
                        <a-textarea v-model="param.value" />
                        <span>}</span>
                      </div>
                      <div v-else-if="$utils.isArrayConstructor(t)" class="reference-object">
                        <span>[</span>
                        <a-textarea v-model="param.value" />
                        <span>]</span>
                      </div>
                      <div v-else-if="$utils.isFunctionConstructor(t)">
                        <span>{{ param.value && param.value.head }}</span>
                        <a-textarea v-if="param.value" v-model="param.value.body" />
                        <span>{{ param.value && param.value.tail }}</span>
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
                  <div v-else-if="$utils.isObjectConstructor(param.type)" class="reference-object">
                    <span>{</span>
                    <a-textarea v-model="param.value" />
                    <span>}</span>
                  </div>
                  <div v-else-if="$utils.isArrayConstructor(param.type)" class="reference-object">
                    <span>[</span>
                    <a-textarea v-model="param.value" />
                    <span>]</span>
                  </div>
                  <div v-else-if="$utils.isFunctionConstructor(param.type)">
                    <span>{{ param.value && param.value.head }}</span>
                    <a-textarea v-if="param.value" v-model="param.value.body" />
                    <span>{{ param.value && param.value.tail }}</span>
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
    </a-row>
  </div>
</template>
<script>
import utils from '@/utils'
import { string2func, cutJsonSide } from '@builder/utils'
import CustomParams from '@/components/CustomParams.vue'
import ComponentSelect from '@/components/ComponentSelect.vue'
export default {
  name: 'ConfigComponent',
  components: {
    ComponentSelect,
    CustomParams
  },
  props: {
    value: {
      type: Object,
      default: () => ({
        props: {},
        component: '',
        originProps: {}
      })
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data () {
    return {
      dataInfo: {
        props: {}, // 组件属性的变更项
        component: '', // 组件名
        originProps: {} // 组件的默认属性
      },
      customParams: {},
      defaultPropsList: [],
      typeStyle: {
        selected: { color: 'rgb(171 176 29)' },
        unselect: { color: 'rgb(200 200 200)' }
      }
    }
  },
  filters: {
    type2string
  },
  watch: {
    value: {
      handler (data) {
        // bug: 莫名奇妙刷新两次
        if (data && data.component) {
          this.initialize(data)
        } else {
          this.reset()
        }
      },
      immediate: true
    },
    defaultPropsList: {
      handler (list) {
        const { component, originProps } = this.dataInfo
        this.update(component, { props: originProps })
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    typeSelectStyle (param, t) {
      return param.typeSelected === t ? this.typeStyle.selected : this.typeStyle.unselect
    },
    initialize (data) {
      const props = this.fillProps(data)
      this.dataInfo.component = data.component
      this.dataInfo.originProps = data.originProps
      this.buildDefaultPropsList(props)
    },
    reset () {
      this.defaultPropsList = []
      this.customProps = {}
    },
    // 把 props 的数据回填到 originProps 中，用于视图渲染
    fillProps (data) {
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
    typeChanged (param, type) {
      param.typeSelected = type
      param.value = getViewDefault(type, {
        ...utils.clone(param),
        type
      })
    },
    componentChange (component, option = {}) {
      const props = option.props || {}
      this.buildDefaultPropsList(props)
      this.update(component, option)
    },
    update (component, option) {
      // bug 获取modifyProp的逻辑有问题
      this.dataInfo.props = {
        ...getModifyProps(this.defaultPropsList),
        ...this.customProps
      }
      this.dataInfo.component = component
      // 暂存起来，主要为了在编辑状态的时候，可以用来数据回填
      this.dataInfo.originProps = utils.clone(option.props)
      this.$emit('change', this.dataInfo)
    },
    buildDefaultPropsList (props) {
      this.defaultPropsList = []
      Object.keys(props).forEach((key, index) => {
        let required = props[key].hasOwnProperty('required') ? props[key].required : false
        let defaultType = props[key].hasOwnProperty('type') ? props[key].type : undefined
        let defaultData = props[key].hasOwnProperty('default') ? props[key].default : undefined
        if (utils.isArray(defaultType)) {
          // defaultVal 有值，那么就根据value来设定类型
          // defaultVal 无值，那么就默认取 defaultType 的第一个
          defaultType = defaultData ? setTypeByValue(defaultData) : defaultType[0]
        }
        const setProps = {}
        setProps.key = key
        setProps.required = required
        setProps.value = getViewDefault(defaultType, props[key])
        setProps.type = props[key].type
        setProps.default = utils.clone(defaultData)
        setProps.typeSelected = defaultType
        this.$set(this.defaultPropsList, index, setProps)
      })
    }
  }
}

// 获取变更的属性
function getModifyProps (src = []) {
  const res = Object.create(null)
  src.forEach((item) => {
    if (utils.isFunctionConstructor(item.type)) {
      if (isFunctionAst(item.default)) {
        if (item.default.body !== item.value.body) {
          res[item.key] = function2string(item.value)
        }
      } else {
        res[item.key] = function2string(item.value)
      }
    } else {
      if (item.default !== item.value) {
        if (utils.isObjectConstructor(item.type)) {
          res[item.key] = string2object(item.value)
        } else if (utils.isFunctionConstructor(item.type)) {
          res[item.key] = function2string(item.value)
        } else if (utils.isArrayConstructor(item.type)) {
          res[item.key] = string2array(item.value)
        } else {
          res[item.key] = item.value
        }
      } else if (item.default) {
        res[item.key] = item.default
      }
    }
  })
  return res
}

function getViewDefault (type, propItem) {
  let def = propItem.hasOwnProperty('default') ? propItem.default : undefined
  let res
  if (type === Object) {
    res = object2string(def)
  } else if (type === Array) {
    res = array2string(def)
  } else if (type === Function) { // Function类型，转成 String 方便输入
    res = function2object(def)
  } else if (utils.isNone(type)) { // 如果没有限定类型，那么只能根据def来强制一个类型了
    if (utils.isFunction(def)) {
      res = function2object(def)
    } else if (utils.isObject(def)) {
      res = object2string(def)
    } else if (utils.isArray(def)) {
      res = array2string(def)
    } else {
      res = def
    }
    propItem.type = setTypeByValue(def)
  } else {
    res = def
  }
  return res
}

// 根据 value类型 来设定 type
function setTypeByValue (value) {
  let type
  if (utils.isFunction(value)) {
    type = Function
  } else if (utils.isObject(value)) {
    if (isFunctionAst(value)) {
      type = Function
    } else {
      type = Object
    }
  } else if (utils.isArray(value)) {
    type = Array
  } else if (utils.isString(value)) {
    type = String
  } else if (utils.isNumber(value)) {
    type = Number
  } else if (utils.isBoolean(value)) {
    type = Boolean
  }
  return type
}

function isFunctionAst (src) {
  if (!src) return false
  return /{/.test(src.head) && /}/.test(src.tail)
}

function object2string (def) {
  let res = `{}`
  // Object的Function类型，先求值，然后转成 [{key:'',value:''}] 方便渲染
  if (utils.isFunction(def)) {
    def = def()
  }
  // Object类型，转成 [{key:'',value:''}] 方便渲染
  if (utils.isObject(def)) {
    res = JSON.stringify(def)
  }
  return cutJsonSide(res)
}

function string2object (src) {
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
function array2string (def) {
  let res = `[]`
  // Array的Function类型，先求值，然后转成 [] 方便渲染
  if (utils.isFunction(def)) {
    def = def()
  }
  if (utils.isArray(def)) {
    res = JSON.stringify(def)
  }
  return cutJsonSide(res)
}

// 把字符串转成Array
function string2array (src) {
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

// 把函数字符串转成函数实例
function function2string (fnObj = {}) {
  let res = ''
  if (fnObj.body && fnObj.body.length > 0) {
    res = `${fnObj.head}\n${fnObj.body}\n${fnObj.tail}`
  }
  return res
}

// 从函数中获取函数实体
function function2object (def) {
  if (isFunctionAst(def)) {
    return def
  }
  if (utils.isFunction(def)) {
    def = def.toString()
  }
  if (utils.isNone(def)) {
    def = 'function () {}'
  }
  // let regTail = /\}$/
  // // 普通函数
  // let regHead = /^(async\s)?function\s?([\w\$][\w\d\$]*?)*\s?\([(\r\n)\R\N\t\T]?([\w\d\$]*?,?\s?)*\)\s?{/
  // res.head = def.match(regHead)
  // if (!res.head) {
  //   // 箭头函数
  //   regHead = /^(async\s)?([\w\$][\w\d\$]*?)*\s?\([(\r\n)\R\N\t\T]?([\w\d\$]*?,?\s?)*\)\s?=>\s?{/
  //   res.head = def.match(regHead)
  // }
  // if (res.head) {
  //   res.head = res.head[0]
  // }
  // res.body = def.replace(regHead, '').replace(regTail, '')
  const func = string2func(def)
  return {
    head: func.head,
    body: func.body,
    tail: func.tail
  }
}

// function array2object (src = []) {
//   const res = Object.create(null)
//   src.forEach((item) => {
//     if (utils.isValuable(item.key)) {
//       res[item.key] = item.value
//     }
//   })
//   return res
// }

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
