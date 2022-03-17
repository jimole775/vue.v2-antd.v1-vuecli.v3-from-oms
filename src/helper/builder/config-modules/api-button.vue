<template>
  <span class="api-button">
    <a-button
      type="primary"
      :class="modal.data.url ? '' : 'summary-disabled'"
      @click="edit"
    >
      {{ modal.data.label }}
    </a-button>
    <ConfigApi :modal="modal" @update="update">
      <slot name="custom" slot="custom">
        <a-col :span="24">
          <a-form-item label="后台配置权限" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-input placeholder="$services.com.xxx.xxx" v-decorator="['permission']" />
          </a-form-item>
        </a-col>
      </slot>
    </ConfigApi>
  </span>
</template>
<script>
import ConfigApi from '../config-modals/config-api.vue'
export default {
  components: {
    ConfigApi
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
