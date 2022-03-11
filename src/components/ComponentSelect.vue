<template>
  <div v-if="list && list.length">
    <a-select
      allow-clear
      mode="default"
      :value="value"
      :placeholder="placeholder"
      @change="handleChange"
    >
      <a-select-option v-for="(item, index) in list" :key="item ? item.title : index" :value="item.key">
        {{ item.title }}
      </a-select-option>
    </a-select>
  </div>
</template>

<script>
const antComponents = require('ant-design-vue')
const context = require.context('./', true, /(\.vue)$/)
export default {
  name: 'ComponentSelect',
  props: {
    placeholder: {
      type: String,
      default: '请选择'
    },
    value: {
      type: String,
      default: null
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data () {
    return {
      list: []
    }
  },
  mounted () {
    this.list = []
    context.keys().forEach((item) => {
      const fileName = item.split('./').pop()
      const comp = require('./' + fileName)
      const component = comp.default || comp
      if (component.forBuilder) {
        this.list.push({
          title: component.title ? component.title : fileName.replace('.vue', ''),
          key: fileName.replace('.vue', ''),
          props: component.props
        })
      }
    })
    const usedComps = {
      'Button': '按钮（ant）',
      'DatePicker': '日期选择（ant）',
      'Avatar': '头像框（ant）',
      'Badge': '徽标（ant）',
      'List': '列表（ant）',
      'Tabs': '页签（ant）',
      'Input': '输入框（ant）',
      'Radio': '单选框（ant）',
      'Tree': '树（ant）',
      'TimePicker': '时分秒选择（ant）',
      'InputNumber': '数字输入框（ant）',
      'Checkbox': '多选框（ant）'
    }
    Object.keys(usedComps).forEach(comName => {
      const title = usedComps[comName]
      const component = antComponents[comName]
      this.list.push({ title, key: component.name, props: component.props })
    })
  },
  methods: {
    handleChange (val) {
      const checkedItem = this.list.find((i) => i.key === val)
      this.$emit('change', val, checkedItem)
    }
  }
}
</script>
