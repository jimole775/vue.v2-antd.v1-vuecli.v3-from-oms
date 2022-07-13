<template>
  <span class="api-button">
    <a-button
      type="primary"
      :class="isValible ? '' : 'summary-disabled'"
      @click="edit"
    >
      {{ modal.data.label }}
    </a-button>
    <ConfigApi :modal="modal" @update="update">
      <slot name="custom" slot="custom">
        <a-col :span="24">
          <a-form-item label="后台配置权限" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-input placeholder="$services.com.xxx.xxx" v-model="modal.data.permission" />
          </a-form-item>
        </a-col>
      </slot>
    </ConfigApi>
  </span>
</template>
<script>
import utils from '@/utils'
import ConfigApi from '../config-modals/config-api.vue'
export default {
  components: {
    ConfigApi
  },
  props: {
    value: {
      type: Object,
      default: () => ({
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
  computed: {
    isValible () {
      return this.modal.data && this.modal.data.url && this.modal.data.url.length > 1
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
    update (apiInfo) {
      this.$emit('update', utils.clone({ ...this.modal.data, ...apiInfo }))
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
