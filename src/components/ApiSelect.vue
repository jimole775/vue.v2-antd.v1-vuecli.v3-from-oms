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
const context = require.context('../api/modules/', true, /(\.js)$/)
export default {
  name: 'ApiSelect',
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
      const apiModule = context(item).default || context(item)
      Object.keys(apiModule).forEach(key => {
        const apiString = apiModule[key].toString()
        console.log(apiString)
      })
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
