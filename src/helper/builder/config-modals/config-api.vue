<template>
  <a-modal
    v-model="modal.show"
    width="60%"
    :title="title ? `配置【${title}】` : '配置'"
    @ok="confirm"
  >
    <ApiDeclaration v-model="apiConfig" />
    <a-row>
      <slot name="custom" />
    </a-row>
  </a-modal>
</template>
<script>
import utils from '@/utils'
import ApiDeclaration from '@/components/ApiDeclaration.vue'
export default {
  components: {
    ApiDeclaration
  },
  props: {
    modal: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
      apiConfig: {}
    }
  },
  computed: {
    title () {
      return this.modal.data ? this.modal.data.title : ''
    }
  },
  watch: {
    modal: {
      handler ({ data, show }) {
        if (show) {
          this.apiConfig = utils.clone(data)
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    confirm () {
      this.modal.show = false
      this.$emit('update', utils.clone({ ...this.modal.data, ...this.apiConfig }))
    }
  }
}

</script>
