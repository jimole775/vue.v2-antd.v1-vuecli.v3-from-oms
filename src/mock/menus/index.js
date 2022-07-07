const helperNode = {
  flag: null,
  icon: 'fa-book',
  id: 0,
  order: 1,
  parentId: -1,
  title: '帮助',
  children: []
}

const modules = require.context('./modules', true, /(\.json)$/)

modules.keys().forEach((item) => {
  const jsonObject = modules(item).default || modules(item)
  helperNode.children.push(jsonObject)
})

export default [helperNode]
