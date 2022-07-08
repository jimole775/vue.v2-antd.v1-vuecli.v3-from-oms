<template>
  <a-modal
    v-if="modal.show"
    v-model="modal.show"
    width="80%"
    :style="{top: '4rem' }"
    :closable="false"
    :footer="null"
  >
    <div id="preview-mount" :style="{ width: '100%', height: this.height }">
      <iframe
        allow="fullscreen"
        id="custom-mount"
        frameborder="0"
        style="width: 100%; height: 100%;"
      >
      </iframe>
    </div>
  </a-modal>
</template>
<script>
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
