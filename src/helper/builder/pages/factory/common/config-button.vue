<template>
  <span class="config-button">
    <a-button
      type="primary"
      :class="modal.data.url ? '' : 'summary-disabled'"
      @click="edit"
    >
      {{ modal.data.title }}
    </a-button>
    <ConfigApi :modal="modal" @update="update" />
  </span>
</template>
<script>
import ConfigApi from '@/helper/builder/pages/factory/common/config-api.vue'
export default {
  components: {
    ConfigApi
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  props: {
    value: {
      type: Object,
      default: () => ({
        url: undefined,
        method: undefined,
        params: undefined,
        title: '提交'
      })
    }
  },
  data () {
    return {
      modal: {
        show: false,
        data: {}
      }
    }
  },
  watch: {
    value: {
      handler (data) {
        if (data) {
          this.modal.data = data
        }
      },
      immediate: true
    }
  },
  methods: {
    edit () {
      this.modal.show = true
    },
    update (data) {
      this.modal.data.url = data.url
      this.modal.data.method = data.method
      this.modal.data.params = data.params
      this.$emit('change', this.modal.data)
    }
  }
}
</script>
<style lang="less" scoped>
.config-button {
  .summary-disabled {
    color: rgba(0, 0, 0, 0.25);
    background-color: #f5f5f5;
    border-color: #d9d9d9;
    text-shadow: none;
    -webkit-box-shadow: none;
    box-shadow: none;
  }
}
</style>
