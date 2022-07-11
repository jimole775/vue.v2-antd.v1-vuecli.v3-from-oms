module.exports = {
  isArray (likeArray) {
    return Object.prototype.toString.call(likeArray) === '[object Array]'
  },

  isEmptyArray (likeArray) {
    return Object.prototype.toString.call(likeArray) === '[object Array]' && likeArray.length === 0
  },

  isObject(likeObject) {
    return Object.prototype.toString.call(likeObject) === '[object Object]'
  },

  isFunction(likeFunction) {
    return Object.prototype.toString.call(likeFunction) === '[object Function]'
  },

  isNumber(likeNumber) {
    return Object.prototype.toString.call(likeNumber) === '[object Number]'
  },

  isEmptyObject(likeObject) {
    return Object.prototype.toString.call(likeObject) === '[object Object]' && Object.keys(likeObject).length === 0
  },

  isString(likeString) {
    return Object.prototype.toString.call(likeString) === '[object String]'
  },

  isNone(src) {
    return src === undefined || src === null || src === ''
  },

  isValuable (src) {
    return src !== undefined && src !== null && src !== ''
  },

  isImgUrl(src) {
    return /(\.png|jpe?g|gif|icon|svg)\??.*/i.test(src)
  },

  isHTMLUrl(src) {
    return /\.(s?html?)(\?.+)?$/.test(src)
  },

  isCSSUrl(src) {
    return /\.(sass|css|less)(\?.+)?$/.test(src)
  },

  isJSUrl(src) {
    return /\.(js)(\?.+)?$/.test(src)
  }
}
