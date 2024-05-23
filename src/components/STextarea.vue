<template>
  <span style="position: relative">
    <a-textarea
      v-model="input"
      ref="__s_textarea__"
      style="min-height: unset"
      :maxlength="limit"
      :disabled="disabled"
      :placeholder="placeholder"
      :autosize="{ minRows, maxRows }"
      :auto-size="{ minRows, maxRows }"
      @focus="$emit('focus')"
    />
    <span v-if="limit" class="suffix warning">
      {{ `${(input || '').length}/${limit}` }}
    </span>
  </span>
</template>
<script>
import utils from '@/utils'
export default {
  name: 'STextarea',
  props: {
    value: {
      type: String,
      default: undefined
    },
    limit: {
      type: Number,
      default: undefined
    },
    placeholder: {
      type: String,
      default: '请输入'
    },
    disabled: {
      type: Boolean,
      default: false
    },
    minRows: {
      type: Number,
      default: 1
    },
    maxRows: {
      type: Number,
      default: 4
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data() {
    return {
      input: ''
    }
  },
  watch: {
    value: {
      handler(val) {
        val = utils.isNone(val) ? '' : val
        this.input = val
      },
      immediate: true
    },
    input: {
      handler(val) {
        this.$emit('change', val)
      }
    }
  },
  methods: {
    $insertText(text) {
      const ref = this.$refs['__s_textarea__']
      ref.focus()
      if (this.input.length + text.length > this.$props.limit) return
      const injectIndex = ref.$el.selectionStart
      const orginContent = ref.$el.value || ''
      const beforeContent = orginContent.substring(0, injectIndex)
      const afterContent = orginContent.substring(injectIndex)
      this.input = ref.$el.value = beforeContent + text + afterContent
      ref.$el.setSelectionRange(
        injectIndex + text.length,
        injectIndex + text.length
      )
    }
  }
}
</script>
<style lang="less" scoped>
.suffix {
  position: absolute;
  right: 0.8rem;
  top: 0;
}
</style>
