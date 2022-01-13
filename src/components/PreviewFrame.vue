<template>
  <a-modal
    v-if="modal.show"
    v-model="modal.show"
    width="80%"
    style="top: 4rem"
    :closable="false"
    :footer="null"
  >
    <iframe
      v-if="modal.type === 'doc'"
      class="iframe"
      :src="modal.data"
      :style="{ height: this.height }"
    />
    <img
      v-else-if="modal.type === 'img'"
      class="iframe"
      :src="modal.data"
      :style="{ height: this.height }"
    />
    <div v-else>不支持的文件类型！</div>
  </a-modal>
</template>
<script>
import api from '@/api'
export default {
  title: '文件预览弹窗',
  name: 'PreviewFrame',
  props: {
    modal: {
      type: Object,
      default: () => ({})
    }
  },
  watch: {
    modal: {
      async handler (modal) {
        if (modal.data && modal.show) {
        }
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    const body = window.document.body
    return {
      height: (body.clientHeight * 0.8) + 'px'
    }
  }
}
</script>
<style lang="less" scoped>
.iframe {
  border: 1px;
  width: 100%;
}
</style>
