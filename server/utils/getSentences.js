module.exports = function getSentences (content = '') {
  if (utils.isNone(content)) return ''
  return content.split(/\r?\n|\r/)
}
