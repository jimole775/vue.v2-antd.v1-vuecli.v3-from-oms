<template>
  <span class="api-button">
    <a-button
      type="primary"
      :class="modal.data.url ? '' : 'summary-disabled'"
      @click="edit"
    >
      {{ modal.data.label }}
    </a-button>
    <ApiConfig :modal="modal" @update="update" />
  </span>
</template>
<script>
import ApiConfig from '@/helper/builder/pages/factory/common/api-config.vue'
export default {
  components: {
    ApiConfig
  },
  props: {
    value: {
      type: Object,
      default: () => ({
        url: undefined,
        method: undefined,
        params: undefined,
        permission: undefined,
        label: '提交'
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
      this.$emit('update', this.modal.data)
    }
  }
}
</script>
<style lang="less" scoped>
.api-button {
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
