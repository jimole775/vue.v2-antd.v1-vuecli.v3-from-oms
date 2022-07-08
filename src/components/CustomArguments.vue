<template>
  <a-row>
    <a-col :span="24" class="array-ctrl">
      <div v-for="(item, index) in arrayParams" :key="index" class="array-item">
        <a-badge class="custom-badge">
          <a-icon
            slot="count"
            theme="filled"
            class="badge-icon"
            type="close-circle"
            @click="() => reduceProp(index)"
          />
          <a-input
            allow-clear
            v-model="item.value"
            :disabled="disabled"
            @blur="change"
          />
        </a-badge>
      </div>
      <div>
        <a-button :disabled="disabled" @click="() => addProp()">+</a-button>
      </div>
    </a-col>
  </a-row>
</template>
<script>
export default {
  name: 'CustomArguments',
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    value: {
      type: Array,
      default: () => ['params']
    }
  },
  data () {
    return {
      arrayParams: [{ value: 'params' }]
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  watch: {
    value: {
      handler (data) {
        if (data.length) {
          this.arrayParams = data.map(i => ({ value: i }))
        }
      },
      immediate: true
    }
  },
  methods: {
    addProp () {
      if (this.arrayParams.length < 6) {
        this.arrayParams.push('')
      } else {
        this.$message.warning('参数未免太多了！')
      }
    },
    reduceProp (i) {
      if (this.arrayParams && this.arrayParams.length > 1) {
        this.arrayParams.splice(i, 1)
        this.change()
      }
    },
    change () {
      this.$emit('change', this.arrayParams.map(i => i.value), this.arrayParams)
    }
  }
}

</script>
<style lang="less" scoped>
.array-ctrl {
  display: flex;
  .array-item {
    width: 100%;
  }
}
.custom-badge {
  width: 100%;
  .badge-icon {
    z-index: 1;
    color: #f5222d;
    right: 0.3rem;
    opacity: 0;
    cursor: pointer;
    transition: opacity 0.3s;
  }
}
.custom-badge:hover {
  .badge-icon {
    opacity: 1;
  }
}
</style>
