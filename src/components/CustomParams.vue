<template>
  <a-row>
    <a-col v-for="(item, index) in customParams" :key="index">
      <a-form-item
        :label-col="{span: 8}"
        :wrapper-col="{span: 16}"
      >
        <template slot="label">
          <a-input
            allow-clear
            v-model="item.key"
            :disabled="disabled"
            @blur="change"
          />
        </template>
        <div class="object-ctrl">
          <a-input
            allow-clear
            v-model="item.value"
            :disabled="disabled"
            @blur="change"
          />
          <a-button :disabled="disabled" @click="() => addProp()">+</a-button>
          <a-button :disabled="disabled" @click="() => reduceProp(index)">-</a-button>
        </div>
      </a-form-item>
    </a-col>
  </a-row>
</template>
<script>
import utils from '@/utils'
export default {
  name: 'CustomParams',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      customParams: [{ key: '', value: '' }]
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  watch: {
    value: {
      handler (data) {
        if (data) {
          this.deployParams(data)
        }
        if (!this.customParams.length) {
          this.customParams = [{ key: '', value: '' }]
        }
      },
      immediate: true
    }
  },
  methods: {
    deployParams (params = {}) {
      this.customParams = []
      Object.keys(params).forEach((key) => {
        const value = params[key]
        this.customParams.push({ key, value })
      })
    },
    addProp () {
      this.customParams.push({ key: '', value: '' })
    },
    reduceProp (i) {
      if (this.customParams && this.customParams.length > 1) {
        this.customParams.splice(i, 1)
        this.change()
      }
    },
    change () {
      const paramsMap = array2object(this.customParams)
      this.$emit('change', utils.clone(paramsMap))
    }
  }
}

function array2object (src = []) {
  const res = Object.create(null)
  src.forEach((item) => {
    if (utils.isValuable(item.key)) {
      res[item.key] = item.value
    }
  })
  return res
}
</script>
<style lang="less" scoped>
.object-ctrl {
  display: flex;
  padding: 4px;
  button {
    margin-left: 4px;
  }
}
</style>
