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
    <CustomParams v-model="customParams" />
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
                <template slot="label">
                  <span>
                    {{ param.key }}
                    <span v-if="$utils.isArray(param.type)" :style="style.selected">
                      (<template v-for="(t, i) in param.type">
                        <a :key="i" :style="param.typeSelected === t ? style.selected : style.unselect" @click="() => typeChanged(param, t)">
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
    </a-row>
  </div>
</template>
<script>
import utils from '@/utils'
import CustomParams from './custom-params.vue'
import ComponentSelect from '@/components/ComponentSelect.vue'
export default {
  name: 'ComponentConfig',
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
        props: {}, // 实际的赋值
        component: '', // 组件名
        originProps: {} // 组件的默认属性
      },
      customParams: {},
      defaultPropsList: [],
      style: {
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
        if (data) {
          this.initialize(data)
        } else {
          this.reset()
        }
      },
      immediate: true
    },
    defaultPropsList: {
      handler (data) {
        data && this.update(this.value.component, { props: this.value.originProps })
      },
      deep: true
    }
  },
  methods: {
    initialize (data) {
      const props = this.fillProps(data)
      this.dataInfo.component = data.component
      this.buildDefaultPropsList(props)
    },
    reset () {
      this.defaultPropsList = []
      this.customProps = {}
    },
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
      param.value = adjustDefault({
        ...utils.clone(param),
        type
      })
    },
    // addProp () {
    //   this.customProps.push({ key: '', value: '' })
    // },
    // reduceProp (i) {
    //   if (this.customProps && this.customProps.length > 1) {
    //     this.customProps.splice(i, 1)
    //   }
    // },
    addDefParamItem (defParam) {
      defParam.push({ key: '', value: '' })
    },
    redDefParamItem (defParam, i) {
      if (defParam && defParam.length > 1) {
        defParam.splice(i, 1)
      }
    },
    update (val, option) {
      this.dataInfo.props = {
        ...getModifyProps(this.defaultPropsList),
        ...this.customProps
      }
      this.dataInfo.component = val
      // 暂存起来，主要为了在编辑状态的时候，可以用来数据回填
      this.dataInfo.originProps = utils.clone(option.props)
      this.$emit('change', this.dataInfo)
    },
    componentChange (val, option) {
      if (utils.isNone(val)) return false
      if (utils.isNone(option)) return false
      const props = option.props || {}
      this.buildDefaultPropsList(props)
      this.update(val, option)
    },
    buildDefaultPropsList (props) {
      this.defaultPropsList = []
      Object.keys(props).forEach((key) => {
        let def = adjustDefault(props[key])
        let type = props[key].hasOwnProperty('type') ? props[key].type : undefined
        let required = props[key].hasOwnProperty('required') ? props[key].required : false
        let typeSelected = utils.isArray(type) ? type[0] : type
        this.defaultPropsList.push({
          key,
          type,
          required,
          value: def,
          typeSelected,
          default: utils.clone(def)
        })
      })
    }
  }
}

// 获取变更的属性
function getModifyProps (src = []) {
  const res = Object.create(null)
  src.forEach((item) => {
    if (item.type === Function) {
      if (item.default.body !== item.value.body) {
        res[item.key] = function2string(item.value)
      }
    } else {
      if (item.default !== item.value) {
        if (item.type === Object) {
          res[item.key] = string2object(item.value)
        } else if (item.type === Function) {
          res[item.key] = function2string(item.value)
        } else if (item.type === Array) {
          res[item.key] = string2array(item.value)
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
    res = object2string(def)
  } else if (propItem.type === Array) {
    res = array2string(def)
  } else if (propItem.type === Function) { // Function类型，转成 String 方便输入
    res = function2object(def)
  } else if (utils.isNone(propItem.type)) { // 如果没有限定类型，那么只能根据def来强制一个类型了
    if (utils.isFunction(def)) {
      propItem.type = Function
      res = function2object(def)
    } else if (utils.isObject(def)) {
      propItem.type = Object
      res = object2string(def)
    } else if (utils.isArray(def)) {
      propItem.type = Array
      res = array2string(def)
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
  return cuteJSONSide(res)
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
  return cuteJSONSide(res)
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
function function2string (fnObj) {
  let res
  if (fnObj.body && fnObj.body.length > 0) {
    res = `${fnObj.head}\n${fnObj.body}\n${fnObj.tail}`
  }
  return res
}

// 从函数中获取函数实体
function function2object (def) {
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
  const func = utils.string2func(def)
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
