import moment from 'moment'
import { Modal } from 'ant-design-vue'
import axios from 'axios'
import { getToken } from './auth'
import store from '@/store'
import base64 from './base64'
export default {
  dateFormat: 'YYYY-MM-DD',
  monthFormat: 'YYYY-MM',
  timeFormat: 'YYYY-MM-DD HH:mm',
  yearFormat: 'YYYY',
  strToDate (str) {
    return str ? moment(str).format(this.dateFormat) : ''
  },
  strToTime (str) {
    return str ? moment(str).format(this.timeFormat) : ''
  },
  strTime (str) {
    return str ? moment(str).format('HH:mm') : ''
  },
  strToMonth (str) {
    return str ? moment(str).format(this.monthFormat) : ''
  },
  strToYear (str) {
    return str ? moment(str).format(this.yearFormat) : ''
  },
  toTS (dateObj) {
    return moment(dateObj).format('x')
  },
  toDateStr (dateObj) {
    return moment(dateObj).format('YYYY-MM-DD HH:mm:ss')
  },
  /**
   * @param {string} input value
   * @returns {number} output value
   */
  byteLength (str) {
    // returns the byte length of an utf8 string
    let s = str.length
    for (var i = str.length - 1; i >= 0; i--) {
      const code = str.charCodeAt(i)
      if (code > 0x7f && code <= 0x7ff) s++
      else if (code > 0x7ff && code <= 0xffff) s += 2
      if (code >= 0xDC00 && code <= 0xDFFF) i--
    }
    return s
  },
  findPathDFS (source, goal) {
    if (!this.isArray(source)) {
      return []
    }
    // 因为会改变原数据，因此做深拷贝处理
    var dataSource = JSON.parse(JSON.stringify(source))
    var res = []
    return (function dfs (data) {
      res.push(data)
      // 深度搜索一条数据，存取在数组 res 中
      if (data.children) return dfs(data.children[0])
      // 匹配成功
      if (res[res.length - 1].path === goal) {
        return res
      }
      // 匹配失败则删掉当前比对的节点
      res.pop()
      // 没有匹配到任何值则 return，如果源数据有值则再次深度搜索
      if (!res.length) return dataSource.length > 0 ? dfs(dataSource.shift()) : res
      // 取得最后一个节点，待做再次匹配
      var lastNode = res[res.length - 1]
      // 删除已经匹配失败的节点（即为上面 res.pop() 的内容）
      lastNode.children.shift()
      // 没有 children 时
      if (!lastNode.children.length) {
        // 删除空 children，且此时需要深度搜索的为 res 的最后一个值
        delete lastNode.children
        return dfs(res.pop())
      }
      return dfs(lastNode.children[0])
    })(dataSource.shift())
  },
  /**
   * 根据后台返回的数据，生成分页配置信息
   * @param {} res
   */
  getPaginationConfig (res) {
    if (this.isNone(res)) {
      return {
        defaultCurrent: 1,
        defaultPageSize: 20,
        showTotal: total => `共 ${total} 条`,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100']
      }
    }
    return {
      current: 'pageNum' in res ? res.pageNum + 1 : 'number' in res ? res.number + 1 : 1,
      pageSize: res.pageSize || res.size,
      total: res.totalElements || res.total,
      showTotal: total => `共 ${total} 条`
    }
  },
  getPaginationConfig2 (res) {
    if (this.isNone(res)) {
      return {
        defaultCurrent: 1,
        defaultPageSize: 10,
        showTotal: total => `共 ${total} 条`,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100']
      }
    }
    return {
      current: 'pageNum' in res ? res.pageNum : 'number' in res ? res.number : 1,
      pageSize: res.pageSize || res.size,
      total: res.totalElements || res.total,
      showTotal: total => `共 ${total} 条`
    }
  },
  getPaginationConfig3 (res) {
    if (this.isNone(res)) {
      return {
        defaultCurrent: 1,
        defaultPageSize: 10,
        showTotal: total => `共 ${total} 条`
      }
    }
    if (!res.content.length) {
      return {
        current: 1,
        pageSize: 10,
        showSizeChanger: false,
        total: 0,
        showTotal: total => `共 ${total} 条`
      }
    }
    return {
      current: res.pageNum + 1 || res.number + 1 || 1,
      pageSize: res.pageSize || res.size,
      showSizeChanger: true,
      total: res.totalElements || res.total,
      showTotal: total => `共 ${total} 条`
    }
  },
  resetPagination (queryObj) {
    queryObj.current = 1
    queryObj.pageSize = 10
    queryObj.showSizeChanger = true
    queryObj.pageSizeOptions = ['10', '20', '50', '100']
    return queryObj
  },
  filterInvalidDate (obj) {
    for (let k in obj) {
      if (obj[k] === 'Invalid date') {
        obj[k] = ''
      }
    }
    return obj
  },
  /** 拼装 UserSelect 的输入项
   * @params ids => 'xxx,xxx'
   * @params names => 'xxx,xxx'
   * @return [{label: '', key: ''},{label: '', key: ''}]
   */
  parseUser (ids, names) {
    const userList = []
    if (ids && names) {
      const namesList = names.split(',')
      ids.split(',').forEach((item, index) => {
        userList.push({
          label: `${item} ${namesList[index]}`,
          key: JSON.stringify({ key: item, label: namesList[index] })
        })
      })
    }
    return userList
  },
  /** 拆分 UserSelect 的输入项
   * @params list => [{label: '', key: ''},{label: '', key: ''}]
   * @return ['num1, num2', 'name1, name2']
   */
  splitUser (list) {
    if (this.isNone(list)) {
      return ['', '']
    }
    const listTemp = list.map(item => {
      return JSON.parse(item.key)
    })

    return [listTemp.map(item => {
      return item.key
    }).join(','), listTemp.map(item => {
      return item.label
    }).join(',')]
  },
  // 切割解析URL地址，主要用于Uploader组件的
  splitUrl (url) {
    if (this.isNone(url)) {
      return {
        domain: '', // 域名
        fileName: '', // 文件名
        path: '' // 文件地址path
      }
    }
    const urlObjList = url.split('/')
    let obj = {
      domain: urlObjList[0] + '//' + urlObjList[2],
      fileName: urlObjList[urlObjList.length - 1],
      path: '/' + urlObjList.slice(3).join('/')
    }
    return obj
  },
  // 证件号码，预留前后4位，其他隐藏
  formatCertificateNo (val) {
    const res = []
    val && val.split('').forEach((word, index) => {
      if (index < 4 || index >= val.length - 4) {
        res.push(word)
      } else {
        res.push('*')
      }
    })
    return res.join('')
  },
  /**
   * 数字转金钱
   * @param {Number|String} number 输入数字
   * @param {Number} decimals 保留的小数位，默认 2
   * @param {Number} decPoint 小数点符号
   * @param {Number} thousandsSep 千分位符号
   * @return {String}
   * @template = formatMoney(1234) => '123,4.00'
   * @template = formatMoney(1234, 3) => '123,4.000'
   */
  formatMoney (number, decimals, decPoint, thousandsSep) {
    number = (number + '').replace(/[^0-9+-Ee.]/g, '')
    var n = !isFinite(+number) ? 0 : +number
    var prec = !isFinite(+decimals) ? 0 : Math.abs(decimals)
    var sep = (typeof thousandsSep === 'undefined') ? ',' : thousandsSep
    var dec = (typeof decPoint === 'undefined') ? '.' : decPoint
    var s = ''
    var toFixedFix = function (n, prec) {
      var k = Math.pow(10, prec)
      return '' + Math.round(n * k) / k
    }
    s = (prec ? toFixedFix(n, prec) : '' + Math.round(n)).split('.')
    var re = /(-?\d+)(\d{3})/
    while (re.test(s[0])) {
      s[0] = s[0].replace(re, '$1' + sep + '$2')
    }
    if ((s[1] || '').length < prec) {
      s[1] = s[1] || ''
      s[1] += new Array(prec - s[1].length + 1).join('0')
    }
    return s.join(dec)
  },
  /**
   * 金钱转数字
   * @param {Number|String} input
   * @return {String}
   * @template = parseMoney('') => ''
   * @template = parseMoney(12334) => '12334'
   * @template = parseMoney('123,234') => '123234'
   */
  parseMoney (input) {
    if (!input) return input
    return Number.parseFloat((input + '').replace(/,/g, ''))
  },
  /** 把对象转换成的urlquery字段
   * @param {Object} obj
   * @return {String}
   * @template = toQueryString({a: 1}) => '?a=1'
   * @template = toQueryString({a: ''}) => ''
   * @template = toQueryString({}) => ''
   */
  toQueryString (obj) {
    if (!this.isObject(obj)) return new Error('utils.toQueryString参数必须是Object类型')
    const res = []
    Object.keys(obj).forEach(key => {
      const val = obj[key]
      if (this.isValuable(val)) {
        res.push(`${key}=${encodeURIComponent(val)}`)
      }
    })
    return res.length ? `?${res.join('&')}` : ``
  },

  /** 把urlquery转换成的Object对象
   * @param {String} url
   * @return {Object}
   * @template = fromQueryString('') => { }
   * @template = fromQueryString('?') => { }
   * @template = fromQueryString('&') => { }
   * @template = fromQueryString('/xxx/xxx') => { }
   * @template = fromQueryString('xxx=xxx') => { xxx: xxx }
   * @template = fromQueryString('&xxx=xxx') => { xxx: xxx }
   * @template = fromQueryString('?xxxx=xxx&xxx=xxx') => { xxxx: xxx, xxx: xxx }
   * @template = fromQueryString('/xxx/xxx?xxxx=xxx&xxx=xxx') => { xxxx: xxx, xxx: xxx }
   */
  fromQueryString (url) {
    if (!url) return {}
    if (!/[&\?]/g.test(url)) return {}
    const paramPartString = url.split('?')[1]
    if (!paramPartString) return {}
    const params = paramPartString.split('&')
    const res = {}
    params.forEach((item) => {
      if (/\=/.test(item)) {
        const tmp = item.split('=')
        res[tmp[0]] = tmp[1]
      }
    })
    return res
  },
  verifyUploadType (fileName, supportSeries) {
    if (!fileName) {
      Modal.warning({
        title: '上传失败',
        content: '请上传正确的文件！'
      })
      return false
    }

    if (!/\./.test(fileName)) {
      Modal.warning({
        title: '上传失败',
        content: '检测不到文件类型，请重新选择！'
      })
      return false
    }

    const type = fileName.split('.').pop()
    if (!type) {
      Modal.warning({
        title: '上传失败',
        content: '检测不到文件类型，请重新选择！'
      })
      return false
    }

    if (supportSeries && !supportSeries.includes('.' + type)) {
      Modal.warning({
        title: '上传失败',
        content: `文件类型不正确，请重新选择！当前支持的类型：${supportSeries.replace(/,/g, ' ')}。`
      })
      return false
    }

    return true
  },
  /** 直接访问CDN服务器，以link的方式来下载文件
   * @param {String} url url为文件的全路径
   * @param {Object} param 额外参数
   * @param {String} customFileName 自定义文件名
   * @return {Undefined}
   * @template = downloadFileByLink('xxx/xxx.xx') => Undefined
   * @template = downloadFileByLink('xxx/xxx.xx', {xx: x}) => Undefined
   * @template = downloadFileByLink('xxx/xxx.xx?xxx=xxx', {xx: x}) => Undefined
   * @template = downloadFileByLink('xxx/xxx.xx?xxx=xxx', {xx: x}, '文件名') => Undefined
   */
  downloadFileByLink (url, param = {}, customFileName) {
    if (!url) return new Error('url不能为空！')
    let domain = window.location.origin
    if (store.getters.getCurrentDomain) {
      domain = store.getters.getCurrentDomain()
    }
    const link = document.createElement('a')
    const fileName = customFileName || (url.indexOf('/') !== -1 ? url.split('/')[url.split('/').length - 1] : 'unknowFile')
    const fileUrl = `${domain}${this.encodeFileName(url.split('?')[0])}`
    const fileParam = `${this.toQueryString({ ...this.fromQueryString(url), ...param, auth_token: `oms:${getToken()}` })}`
    link.style.display = 'none'
    link.href = fileUrl + fileParam
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  },
  /** 直接访问CDN服务器，通过二进制流的方式下载文件
   * @param {String} url url为文件的全路径
   * @param {String} customFileName 自定义文件名
   * @return {Undefined}
   * @template = downloadFileByStream('/xxx/xxx.xx') => Undefined
   * @template = downloadFileByStream('/xxx/xxx.xx?xxx=xxx', 'xxx.xx') => Undefined
   */
  downloadFileByStream (url, customFileName) {
    if (!url) return new Error('url不能为空！')
    let domain = window.location.origin
    if (store.getters.getCurrentDomain) {
      domain = store.getters.getCurrentDomain()
    }
    axios({
      method: 'get',
      url: `${domain}${this.encodeFileName(url.split('?')[0])}`,
      params: {
        ...this.fromQueryString(url),
        auth_token: `oms:${getToken()}`
      },
      responseType: 'blob'
    }).then(res => {
      if (res.code) {
        return
      }
      const link = document.createElement('a')
      const blob = new Blob([res.data], { type: 'application/octet-stream' })
      const fileName = decodeURI(url).split('/').pop() || 'unknowFile'
      link.style.display = 'none'
      link.href = URL.createObjectURL(blob)
      link.setAttribute('download', customFileName || fileName)
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
    })
      .catch(() => {
        console.log('失败')
      })
  },
  /** 通过后端接口的方式，来下载文件
   * @param {String} url url一般带有api路段
   * @param {Object} params
   * @return {Promise[*]}
   * @template = exportGetFile('/api/xxx/xxx') => Promise
   * @template = exportGetFile('/api/xxx/xxx', {xx: x}) => Promise
   * @template = exportGetFile('/api/xxx/xxx.xx?xxx=xxx', {xx: x}) => Promise
   */
  exportGetFile (url, obj) {
    return new Promise(async (resolve, reject) => {
      const res = await axios({
        method: 'get',
        url: url,
        params: obj,
        responseType: 'blob',
        headers: {
          'x-token': getToken()
        }
      }).catch((error) => {
        console.log(error)
        return reject(error)
      })
      // 如果是后台数据，需要直接返回res
      if (this.isBackendResponse(res)) return resolve(res)
      // 如果是axios数据，需要判断内部结构
      if (this.isAxiosResponse(res)) {
        let backendData = res.data
        if (this.isBlob(backendData)) {
          backendData = await this.readBlobAsText(backendData)
        }
        if (this.isJSONString(backendData)) {
          backendData = JSON.parse(backendData)
        }
        if (this.isBackendResponse(backendData)) {
          return resolve(backendData)
        } else {
          this.blobToURI(res)
          return resolve(true)
        }
      }
    })
  },
  /** 通过后端接口的方式，来下载文件
   * @param {String} url url一般带有api路段
   * @param {Object} params
   * @return {Promise[*]}
   * @template = exportPostFile('/api/xxx/xxx') => Promise
   * @template = exportPostFile('/api/xxx/xxx', {xx: x}) => Promise
   * @template = exportPostFile('/api/xxx/xxx.xx?xxx=xxx', {xx: x}) => Promise
   */
  exportPostFile (url, params) {
    return new Promise(async (resolve, reject) => {
      const res = await axios({
        method: 'post',
        url: url,
        data: params,
        responseType: 'blob',
        headers: {
          'x-token': getToken()
        }
      }).catch((error) => {
        console.log(error)
        return reject(error)
      })
      // 如果是后台数据，需要直接返回res
      if (this.isBackendResponse(res)) return resolve(res)
      // 如果是axios数据，需要判断内部结构
      if (this.isAxiosResponse(res)) {
        let backendData = res.data
        if (this.isBlob(backendData)) {
          backendData = await this.readBlobAsText(backendData)
        }
        if (this.isJSONString(backendData)) {
          backendData = JSON.parse(backendData)
        }
        if (this.isBackendResponse(backendData)) {
          return resolve(backendData)
        } else {
          this.blobToURI(res)
          return resolve(true)
        }
      }
    })
  },
  blobToURI (res) {
    const link = document.createElement('a')
    const blob = new Blob([res.data], { type: 'application/octet-stream' })
    const disposition = res.headers['content-disposition'] || ''
    const fileField = disposition.split(';')[1] || ''
    const fileName = decodeURI(fileField.split('=')[1] || 'unname')
    link.style.display = 'none'
    link.href = URL.createObjectURL(blob)
    link.setAttribute('download', fileName)
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
  },
  // 判断返回的会话类型是否是后台的数据类型
  isBackendResponse (res) {
    return this.isObject(res) &&
      res.hasOwnProperty('code') &&
      res.hasOwnProperty('data') &&
      res.hasOwnProperty('message')
  },
  // 判断返回的会话类型是否是axios的数据类型
  // await axios({}) 类型的请求会返回这个数据类型
  isAxiosResponse (res) {
    return this.isObject(res) &&
      res.hasOwnProperty('data') &&
      res.hasOwnProperty('status') &&
      res.hasOwnProperty('headers')
  },
  /**
   * 省略多余字符
   * @param {String|Number} words
   * @param {Number} len
   * @return {String} '省略字符x...'
   */
  ellipsisSentence (words = '', len = 7) {
    let sum = 0
    let res = ''
    // 获取当前文档中，一个默认中文字的宽度
    const defaultWidth = this.countStringSize('中').width
    words.split('').forEach((word) => {
      const awidth = this.countStringSize(word).width
      if (len * defaultWidth - sum >= awidth || len * defaultWidth - sum >= defaultWidth / 3) {
        res += word
      }
      sum += awidth
    })
    return res === words ? words : res + '...'
  },
  /**
   * 强制把语句换行
   * @param {String|Number} sentence
   * @param {Number} len
   * @return {Array} ['line1', 'line2'...]
   */
  breakSentence (sentence = '', len = 7) {
    const res = []
    const defaultWidth = this.countStringSize('中').width
    const lineWidthLimit = defaultWidth * len
    let loopLineWidth = 0
    let loopLineIndex = 0
    res[loopLineIndex] = ''
    for (let i = 0; i < sentence.length; i++) {
      const word = sentence[i]
      const wordWidth = this.countStringSize(word).width
      loopLineWidth += wordWidth
      if (loopLineWidth >= lineWidthLimit) {
        loopLineWidth = 0
        loopLineIndex += 1
        res[loopLineIndex] = ''
      } else {
        res[loopLineIndex] += word
      }
    }
    return res
  },
  /**
   * 获取字符的尺寸, 支持多个字符
   * @param {String|Number} words
   * @return {Object} {width: x, height: y}
  */
  countStringSize (words) {
    if (!this.isString(words) && !this.isNumber(words)) return { width: 0, height: 0 }
    let sizeBox = document.getElementById('__CountStringSizeBox__')
    if (!sizeBox) {
      sizeBox = document.createElement('button')
      sizeBox.style.padding = 0
      sizeBox.style.margin = 0
      sizeBox.style.border = 0
      sizeBox.style.position = 'absolute'
      sizeBox.style.left = -200
      sizeBox.style.top = -200
      sizeBox.id = '__CountStringSizeBox__'
      document.body.appendChild(sizeBox)
    }
    sizeBox.innerText = words
    return { width: sizeBox.offsetWidth, height: sizeBox.offsetHeight }
  },
  isJSONString (src) {
    if (Object.prototype.toString.call(src) === '[object String]') {
      const firstChar = src[0]
      const lastChar = src[src.length - 1]
      if ((firstChar === '[' && lastChar === ']') || (firstChar === '{' && lastChar === '}')) {
        return true
      }
    }
    return false
  },
  isString (src) {
    return Object.prototype.toString.call(src) === '[object String]'
  },
  isFunction (src) {
    return Object.prototype.toString.call(src) === '[object Function]'
  },
  isNumber (src) {
    return Object.prototype.toString.call(src) === '[object Number]'
  },
  isObject (src) {
    return Object.prototype.toString.call(src) === '[object Object]'
  },
  isBlob (src) {
    return Object.prototype.toString.call(src) === '[object Blob]'
  },
  isEmptyObject (src) {
    return Object.prototype.toString.call(src) === '[object Object]' && Object.keys(src).length === 0
  },
  isArray (src) {
    return Object.prototype.toString.call(src) === '[object Array]'
  },
  isEmptyArray (src) {
    return Object.prototype.toString.call(src) === '[object Array]' && src.length === 0
  },
  isNull (src) {
    return Object.prototype.toString.call(src) === '[object Null]'
  },
  isUndefined (src) {
    return Object.prototype.toString.call(src) === '[object Undefined]'
  },
  isNone (src) {
    return this.isUndefined(src) || this.isNull(src) || src === ''
  },
  isValuable (src) {
    return !this.isUndefined(src) && !this.isNull(src) && src !== ''
  },
  clone (srcobject, attrName, value) {
    let newobject = null
    if (this.isArray(srcobject)) {
      newobject = []
      objPropsTteration.apply(this, [srcobject, newobject])
      // 数组类型，第二个参数必须是数字
      if (this.isNumber(attrName)) {
        const index = attrName
        newobject[index] = value
      }
    }
    if (this.isObject(srcobject)) {
      newobject = {}
      objPropsTteration.apply(this, [srcobject, newobject])
      // 对象类型，第二个参数必须是有效的字符串
      if (this.isValuable(attrName) && this.isString(attrName)) {
        newobject[attrName] = value
      }
    }

    function objPropsTteration () {
      const isTop = arguments.length === 2
      const [src, res, pkey] = arguments
      if (this.isObject(src)) {
        if (!isTop) res[pkey] = {}
        return Object.keys(src).forEach((ckey) => {
          return objPropsTteration.apply(this, [src[ckey], isTop ? res : res[pkey], ckey])
        })
      }
      if (this.isArray(src)) {
        if (!isTop) res[pkey] = []
        return src.forEach((item, index) => {
          return objPropsTteration.apply(this, [item, isTop ? res : res[pkey], index])
        })
      }
      res[pkey] = src
    }

    return newobject || srcobject
  },
  /** 拼装 DepartmentSelectPlus 的输入项
   * @params keys => 'xxx,xxx'
   * @params names => 'xxx,xxx'
   * @return [{label: '', key: ''},{label: '', key: ''}]
   */
  spillOptionItems (keys, names) {
    const optionItems = []
    if (keys && names) {
      const namesList = names.split(',')
      keys.split(',').forEach((item, index) => {
        optionItems.push({
          label: `${namesList[index]}`,
          key: JSON.stringify({ key: item, label: namesList[index] })
        })
      })
    }
    return optionItems
  },
  /** 拆分 DepartmentSelectPlus 的输入项
   * @params list => [{label: '', key: ''},{label: '', key: ''}]
   * @return ['num1, num2', 'name1, name2']
   */
  splitOptionItems (list) {
    if (this.isNone(list)) {
      return ['', '']
    }
    const listTemp = list.map(item => {
      return JSON.parse(item.key)
    })

    return [listTemp.map(item => {
      return item.key
    }).join(','), listTemp.map(item => {
      return item.label
    }).join(',')]
  },
  bindDefaultValueForComponent (dataSource, formItems) {
    formItems.forEach((item) => {
      const componentName = item.component ? (item.component.name ? item.component.name : item.component) : ''
      switch (componentName) {
        case 'UserSelect':
          if (item.paramKeys && dataSource[item.paramKeys[0]] && dataSource[item.paramKeys[1]]) {
            item.value = this.parseUser(dataSource[item.paramKeys[0]], dataSource[item.paramKeys[1]])
          } else {
            item.value = dataSource[item.key] || []
          }
          break
        case 'DepartmentSelectPlus':
          if (item.paramKeys && dataSource[item.paramKeys[0]] && dataSource[item.paramKeys[1]]) {
            item.value = this.spillOptionItems(dataSource[item.paramKeys[0]], dataSource[item.paramKeys[1]])
          } else {
            item.value = dataSource[item.key] || []
          }
          break
        case 'ADatePicker':
        case 'ATimePicker':
          if (dataSource[item.key]) {
            item.value = moment(dataSource[item.key])
          }
          break
        case 'RangePicker':
          if (item.paramKeys && dataSource[item.paramKeys[0]] && dataSource[item.paramKeys[1]]) {
            item.value = [moment(dataSource[item.paramKeys[0]]), moment(dataSource[item.paramKeys[1]])]
          } else {
            item.value = [dataSource[item.key] || null, dataSource[item.key] || null]
          }
          break
        case 'ARadioGroup':
          if (dataSource[item.key] !== null && dataSource[item.key] !== undefined && dataSource[item.key] !== '') {
            item.value = `${dataSource[item.key]}` // vue的原因，ARadioGroup绑定的key值都是字符串
          }
          break
        default:
          if (dataSource[item.key]) {
            item.value = dataSource[item.key]
          }
          break
      }
    })
    return formItems
  },
  formatFormValues (formValues, operationItems) {
    const res = JSON.parse(JSON.stringify(formValues))
    operationItems.forEach((item) => {
      const valueItem = this.clone(res[item.key])
      const componentName = item.component ? (item.component.name ? item.component.name : item.component) : ''
      switch (componentName) {
        case 'UserSelect':
          if (item.paramKeys) {
            res[item.paramKeys[0]] = this.splitUser(valueItem)[0]
            res[item.paramKeys[1]] = this.splitUser(valueItem)[1]
          } else {
            // 如果只有一个key，那么只获取code
            res[item.key] = this.splitUser(valueItem)[0]
          }
          break
        case 'DepartmentSelectPlus':
          if (item.paramKeys) {
            res[item.paramKeys[0]] = this.splitOptionItems(valueItem)[0]
            res[item.paramKeys[1]] = this.splitOptionItems(valueItem)[1]
          } else {
            // 如果只有一个key，那么只获取code
            res[item.key] = this.splitOptionItems(valueItem)[0]
          }
          break
        case 'SupplierSelect':
          let supplier = store.state.global.supplierList.filter(supplier => supplier.supplierCode === valueItem)
          supplier = supplier && supplier.length ? supplier[0] : {}
          if (item.paramKeys) {
            res[item.paramKeys[0]] = supplier.supplierCode
            res[item.paramKeys[1]] = supplier.abbreviation
          } else {
            // 如果只有一个key，那么只获取code
            res[item.key] = supplier.supplierCode
          }
          break
        case 'Uploader':
          // Uploader 只支持单选
          if (valueItem && valueItem.length) {
            if (item.paramKeys) {
              res[item.paramKeys[0]] = valueItem[0].filePath || valueItem[0]
              res[item.paramKeys[1]] = valueItem[0].fileName || valueItem[0]
            } else {
              // 如果只有一个key，那么只获取filePath
              res[item.key] = valueItem[0].filePath
            }
          }
          break
        case 'UploaderMultiple':
          // Uploader 只支持多选
          if (valueItem && valueItem.length) {
            if (item.paramKeys) {
              res[item.paramKeys[0]] = valueItem.map(file => file.path || file)
              res[item.paramKeys[1]] = valueItem.map(file => file.fileName || file)
            } else {
              res[item.key] = valueItem.map(file => file.path || file)
            }
          }
          break
      }
      // 单独处理moment类型
      if (valueItem instanceof moment) {
        res[item.key] = moment(valueItem).format('YYYY-MM-DD')
      }
      // 裁剪掉多余的key，不过要确保 item.key 不在 item.paramKeys 中
      // if (item.paramKeys && item.key !== item.paramKeys[0] && item.key !== item.paramKeys[1]) {
      //   delete res[item.key]
      // }
    })
    return res
  },
  permissionQueryByRole (src) {
    const pMap = {
      SUPPLIER: '1'
    }
    const res = []
    let role = pMap[store.state.global.userRole.type]
    role = role || '0'
    src.forEach((item) => {
      if (item.permission) {
        if (item.permission.includes(role)) {
          res.push(item)
        }
      } else {
        res.push(item)
      }
    })
    return res
  },
  encodeFileName (src) {
    let prepath = ''
    let fileName = src
    // 需要单独截出文件名，做一次encode，避免 # 和 ？这样的文件名导致url失效
    if (src && src.indexOf('/') > -1) {
      const ps = src.split('/')
      fileName = ps.pop()
      prepath = ps.join('/')
    }
    return `${prepath}/${window.encodeURIComponent(fileName)}`
  },
  bindVMScopeParent (scope) {
    let correctRef = scope.$vnode && scope.$vnode.data && scope.$vnode.data.ref
    if (!correctRef) {
      return new Error('请给当前组件设置"ref"属性，并确保其唯一，以便定位元素位置！')
    }
    let proxyVM = {
      $$target: scope
    }
    loopSeeking(scope)
    function loopSeeking (vm) {
      if (vm.$refs && vm.$refs[correctRef]) {
        vm.$$target = scope
        proxyVM = vm
      } else {
        if (vm.$parent) {
          return loopSeeking(vm.$parent)
        }
      }
    }
    return proxyVM
  },
  getFormErrorMessage (error = {}) {
    const field = Object.keys(error)[0] || ''
    const erObj = error[field].errors ? error[field].errors[0] : {}
    return erObj.message || '请先完成必填项！'
  },
  /**
   * 从证件号码获取年龄
   * @param {Number|String} no
   * @returns {Number}
   */
  countAgeFromIDNumber (no) {
    const birth = this.getBirthFromIDNumber(no)
    if (!birth) return ''
    return new Date().getFullYear() - new Date(birth).getFullYear()
  },
  /**
   * 从证件号码获取生日
   * @param {Number|String} no
   * @returns {String}
   */
  getBirthFromIDNumber (no) {
    if (!no) return ''
    // 15位 1代，18位 2代
    const t1 = /^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}$/
    const t2 = /^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$/
    if (!t1.test(no) && !t2.test(no)) return ''
    const year = (no + '').substring(6, 10)
    const month = (no + '').substring(10, 12)
    const date = (no + '').substring(12, 14)
    return `${year}-${month}-${date}`
  },
  /**
   * 新窗口打开一个页面
   * @param {Object|Map} targetDetail
   * @return {Undefined}
   * @template newWindow()
   * @template newWindow({
   *  id: '',【可选】
   *  businessId: 1004,【必填】
   *  businessCategory: 'RECRUITION'【必填】
   * })
   */
  newWindow (targetDetail) {
    if (targetDetail && targetDetail.businessCategory) {
      // 另开一个页面展示
      const params = base64.encode(JSON.stringify(targetDetail))
      window.open(`?omsjump=${params}`)
    } else {
      window.open()
    }
  },
  readBlobAsText (blob) {
    return new Promise((resolve, reject) => {
      if (this.isBlob(blob)) {
        const r = new FileReader()
        let res = ''
        r.onload = function (event) {
          const { currentTarget: { result } } = event
          res += result || ''
        }
        r.onloadend = function (e) {
          resolve(res)
        }
        r.readAsText(blob)
      } else {
        resolve(blob)
      }
    })
  },
  /**
   * 异步查询html元素，10秒钟内查找不到会抛出错误
   * @param {String} mark 主要是querySelector的参数
   * @param {Number} loopTime 查询次数，1次500ms，默认20次
   * @returns {Promise[Element]}
   * @template await getElementAsync('body') => Element
   * @template await getElementAsync('.class') => Element
   * @template await getElementAsync('#id') => Element
   */
  getElementAsync (mark, loopTime = 20) {
    return new Promise((resolve, reject) => {
      loop(mark, loopTime)
      function loop (_m, _t) {
        const el = document.querySelector(_m)
        if (el) {
          resolve(el)
        } else {
          setTimeout(() => {
            _t = _t - 1
            if (_t > 0) {
              return loop(_m, _t)
            } else {
              return reject(new Error('utils.getElementAsync找不到指定的元素：' + _m))
            }
          }, 500)
        }
      }
    })
  }
}
