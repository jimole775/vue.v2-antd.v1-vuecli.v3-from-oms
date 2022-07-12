<template>
  <a-row>
    <a-col :span="24">
      <a-form-item label="接口入参" :label-col="{span: 6}" :wrapper-col="{span: 16}">
        <CustomArguments :disabled="selected.isAlready" v-model="selected.arguments" @change="update" />
      </a-form-item>
    </a-col>
    <a-col :span="24">
      <a-form-item required label="接口定义" :label-col="{span: 6}" :wrapper-col="{span: 16}">
        <a-input-group compact>
          <a-select style="width: 15%" v-model="selected.mode" @change="modeChange">
            <a-select-option value="mock">/mock</a-select-option>
            <a-select-option value="api">/api</a-select-option>
          </a-select>
          <a-auto-complete
            v-model="selected.path"
            allow-clear
            style="width: 65%"
            placeholder="/xxx/xxx"
            :data-source="pathList"
            @search="pathSearch"
            @change="pathChange"
          />
          <a-select allow-clear style="width: 20%" :disabled="selected.isAlready" v-model="selected.method">
            <a-select-option value="get">get</a-select-option>
            <a-select-option value="put">put</a-select-option>
            <a-select-option value="post">post</a-select-option>
            <a-select-option value="delete">delete</a-select-option>
            <a-select-option value="exportGetFile">exportGetFile</a-select-option>
            <a-select-option value="exportPostFile">exportPostFile</a-select-option>
          </a-select>
        </a-input-group>
      </a-form-item>
    </a-col>
    <a-col :span="24">
      <a-form-item label="接口出参" :label-col="{span: 6}" :wrapper-col="{span: 16}">
        <a-input v-if="$utils.isString(selected.params)" :disabled="selected.isAlready" v-model="selected.params" @change="update" />
        <CustomParams v-else :disabled="selected.isAlready" v-model="selected.params" @change="update" />
      </a-form-item>
    </a-col>
    <a-col :span="24">
      <a-form-item :label-col="{span: 6}" :wrapper-col="{span: 16}">
        <template slot="label">
          数据结构
          <a-tooltip>
            <template slot="title">
              <div>填入数据结构，帮助程序正确读取数据。</div>
              <div>比如，服务端返回数据的结构为：<i><b>{ data: { content: [] } }</b></i>。</div>
              <div>如果我们需要的是 <i><b>content</b></i> 中的数据，</div>
              <div>那么，我们就可以填入值：<i><b>data.content</b></i>。</div>
            </template>
            <span><a-icon type="question-circle-o" /></span>
          </a-tooltip>
        </template>
        <a-input v-model="selected.dataDir" @change="update" />
      </a-form-item>
    </a-col>
  </a-row>
</template>

<script>
import utils from '@/utils'
import { getFunctionArguments, file2object } from '@builder/utils'
import CustomParams from './CustomParams.vue'
import CustomArguments from './CustomArguments.vue'
const apiContext = require.context('../api/modules/', true, /(\.js)$/)
const mockContext = require.context('../api/mocks/', true, /(\.js)$/)
const pathmap = {}
const listmap = {
  api: [],
  mock: []
}
export default {
  title: '接口声明',
  name: 'ApiDeclaration',
  components: {
    CustomArguments,
    CustomParams
  },
  props: {
    value: {
      type: Object,
      default: () => ({
        url: '',
        method: ''
      })
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data () {
    return {
      selected: {
        mode: 'mock',
        url: '',
        name: '',
        path: '',
        method: '',
        dataDir: '',
        params: {},
        arguments: [],
        isAlready: false
      },
      pathList: []
    }
  },
  watch: {
    value: {
      handler (data) {
        if (data) {
          if (data.url) {
            const ourl = splitURL(data.url)
            if (ourl) {
              this.selected.path = ourl.path
              this.selected.mode = ourl.mode
            }
            this.selected.name = data.name
            this.selected.method = data.method
            this.selected.params = data.params
            this.selected.dataDir = data.dataDir
            this.selected.isAlready = data.isAlready
            this.selected.arguments = data.arguments
          }
        }
      },
      immediate: true
    }
  },
  created () {
    this.pickApiInfo(apiContext, listmap.api)
    this.pickApiInfo(mockContext, listmap.mock)
    this.pathList = this.getLimitList(100)
  },
  methods: {
    getLimitList (limit) {
      const list = listmap[this.selected.mode] || []
      const res = []
      limit = limit < list.length ? limit : list.length
      while (limit--) {
        res.push(list[limit].path)
      }
      return res
    },
    pickApiInfo (fileContext, list) {
      fileContext.keys().forEach((item) => {
        const apiModule = fileContext(item).default || fileContext(item)
        const funcs = Object.keys(apiModule)
        funcs.forEach(name => {
          const apiString = apiModule[name].toString()
          const model = { method: '', name: '', path: '', params: {}, arguments: [] }
          model.method = getMethod(apiString)
          if (model.method) {
            model.name = name
            model.path = getPath(apiString, model.method)
            model.params = getParams(apiString, model.method)
            model.arguments = getFunctionArguments(apiString)
            if (!pathmap[model.path]) {
              pathmap[model.path] = true
              list.push(model)
            }
          }
        })
      })
    },
    pathSearch (val) {
      if (val) {
        this.pathList.length = 0
        const list = listmap[this.selected.mode] || []
        for (let i = 0; i < list.length; i++) {
          if (this.pathList.length > 99) break
          const path = list[i].path
          if (path.indexOf(val) === 0) {
            this.pathList.push(path)
          }
        }
      }
    },
    pathChange (val = '') {
      // 如果用户没输入 '/' 开头，默认给加上
      if (!/^\//.test(val)) val = '/' + val

      // 如果用户输入 '////' 多个重复开头，默认过滤掉多余的，留一个
      if (/^\/{2,}/.test(val)) val = val.replace(/^\/+/g, '/')
      this.selected.path = val
      const list = listmap[this.selected.mode]
      const checkedItem = list.find((i) => i.path === val)
      // 如果是选择的，就自动填充 name 和 method
      if (checkedItem) {
        this.selected.name = checkedItem.name
        this.selected.isAlready = true
        this.selected.method = checkedItem.method
        this.selected.params = checkedItem.params
        this.selected.arguments = checkedItem.arguments
      } else {
        // 如果是 填写 的，就手动拼装 函数名
        const { method, path } = this.selected
        this.selected.name = buildFunctionName(method, path)
        this.selected.isAlready = false
      }
      this.update()
    },
    modeChange (mode) {
      this.selected.mode = mode
      if (mode) {
        this.pathList = this.getLimitList(100)
      } else {
        this.pathList = []
      }
      this.resetProps()
    },
    resetProps () {
      this.selected.name = ''
      this.selected.path = ''
      this.selected.method = ''
      this.selected.dataDir = ''
      this.selected.params = {}
      this.selected.isAlready = false
      this.selected.arguments = []
    },
    update () {
      if (this.selected.path.length > 0) {
        this.selected.url = patchURL(this.selected.mode, this.selected.path)
      } else {
        this.resetProps()
      }
      this.$emit('change', utils.clone(this.selected))
    }
  }
}

function getParams (src = '', method = '') {
  let res = {}
  if (method.toLocaleLowerCase() === 'get') {
    res = getParamsList(src)
  } else {
    res = postParamsName(src) || postParamsList(src)
  }
  return res
}

function getMethod (src) {
  const matched = src.match(/\.(get|post|put|delete|exportGetFile|exportPostFile)\(/i)
  return matched ? matched[1] : matched
}

function getPath (src = '', method = '') {
  let res = ''
  if (/\("\/?".concat\(/.test(src)) {
    // 这种的代码是这样的：`${api}/xxx/xxx/xxx/${a}/${b}`
    res = getPathDyncVar(src)
    if (/^(\$\{)/.test(res)) {
      res = res.replace(/\$\{\w*?\}/, '')
    }
  } else {
    // 这种的代码是这样的：`api/xxx/xxx/xxx/${a}/${b}`
    const prevPaths = src.match(/["'](\/.+?)["']/ig) || ['']
    const staticPath = prevPaths[0].replace(/['"]/g, '') // 去掉多余的引号
      .replace(/\/(mock|api)/g, '') // 去掉 path 的第一段
    res = staticPath + getPathDyncVar(src)
  }

  // 如果是 get 类型，就把 queryString 去掉
  if (method.toLocaleLowerCase() === 'get') {
    res = res.replace(/\?\.+?/, '')
  }

  return res
}

function postParamsName (src) {
  const regex = /['")],\s([\w\._]*?)\);/ig
  const matched = src.match(regex) || ['']
  return matched[0].replace(regex, '$1')
}

function postParamsList (src) {
  const regex = /,\s\{\s*([\w_'"]*?:\s['"]?(([\u4e00-\u9fa5]*?\.\w+)|[\w\._-]*?)['"]?,?\s*)+\s*\}\);/ig
  const matched = src.match(regex) || ['']
  const content = matched[0].replace(/,\s/, '').replace(/\);/, '')
  return content ? file2object(content) : null
}

function getParamsList (src) {
  const regex = /params:\s\{\s*([\w_'"]*?:\s['"]?(([\u4e00-\u9fa5]*?\.\w+)|[\w\._-]*?)['"]?,?\s*)+\s*\}/ig
  const matched = src.match(regex) || ['']
  const dirtyJSONString = matched[0].replace(/params:/, '')
  return dirtyJSONString ? file2object(dirtyJSONString) : null
}

/**
 * 根据当前的编译规则： ${} => concat()
 * 那么，此函数的作用就是：concat() => ${}
 * @src {String} '/a/b/c/'.concat(id, '/').concat(age)
 * @return {String} '${id}/${age}'
 */
function getPathDyncVar (src) {
  const regex = /\.(concat\([\w\.-_]*?(, (("\/.*?\")|("&[\w\.-_]*?=")))?\))+/ig
  const matched = src.match(regex)
  let res = ''
  if (matched && matched.length) {
    matched.forEach((item) => {
      const content = item.replace(/\.concat\((.*?)\)/, '$1')
      content.split(',').forEach((citem) => {
        if (/['"]/.test(citem)) {
          res += citem.replace(/['"]/g, '').trim()
        } else {
          res += '${' + citem.trim() + '}'
        }
      })
    })
  }
  return res
}

// 用path和method拼装成函数名，需要去掉 / 和 - _
function buildFunctionName (method = '', path = '') {
  if (!method || !path) return ''
  return `${method.toLocaleLowerCase()}${path.replace(/[\/\-_]/g, '')}`
}

function patchURL (mode, path) {
  if (!mode || !path) return ''
  return '/' + mode + path
}

function splitURL (url) {
  if (!url) return ''
  // url中没有 /, 不处理
  if (!/\//.test(url)) return ''
  url = url.replace(/^\//, '') // 去掉头部的 /
  const arr = url.split('/')
  const mode = arr.shift()
  const path = arr.join('/')
  return {
    mode: mode,
    path: '/' + path // 填上头部的 /
  }
}

</script>
