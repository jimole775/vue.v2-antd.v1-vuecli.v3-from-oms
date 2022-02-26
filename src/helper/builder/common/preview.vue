<template>
  <a-modal
    v-if="modal.show"
    v-model="modal.show"
    width="90%"
    :mask-closable="false"
    :footer="null"
  >
    <SApprovallor
      :tabs="tabs"
      :apimap="apimap"
      :list-config="listConfig"
      :apply-config="applyConfig"
      :approval-config="approvalConfig"
    />
  </a-modal>
</template>
<script>
import SApprovallor from '@/components/SApprovallor'
export default {
  name: 'Preview',
  components: {
    SApprovallor
  },
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
          this.tabs = modal.data.tabs
          this.apimap = modal.data.apimap
          this.listConfig = modal.data.listConfig
          this.applyConfig = modal.data.applyConfig
          this.approvalConfig = modal.data.approvalConfig
        }
      },
      deep: true,
      immediate: true
    }
  },
  data () {
    return {
      tabs: [],
      apimap: {},
      listConfig: {},
      applyConfig: {},
      approvalConfig: {}
    }
  }
}
</script>
