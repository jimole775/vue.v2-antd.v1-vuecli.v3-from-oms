<template>
  <a-select
    v-model="pureval"
    :mode="mode"
    :allow-clear="true"
    :disabled="disabled"
    @change="handleChange"
  >
    <a-select-option v-for="item in menus" :key="item.path">
      {{ item.name }}
    </a-select-option>
  </a-select>
</template>
<script>
import { mapState } from 'vuex'
export default {
  name: 'RouterModuleSelect',
  props: {
    value: {
      type: String | Array,
      default: null
    },
    disabled: {
      type: Boolean,
      default: false
    },
    mode: {
      type: String,
      default: 'default'
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data () {
    return {
      pureval: undefined
    }
  },
  computed: {
    ...mapState({
      menus: state => state.builder.menus
    })
  },
  watch: {
    value: {
      handler (val) {
        if (val) {
          this.pureval = val
        }
      },
      immediate: true
    }
  },
  methods: {
    handleChange (value) {
      let chooseItem = this.menus.find(i => i.path === value)
      this.$emit('change', value, chooseItem)
    }
  }
}
</script>
