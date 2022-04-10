<template>
  <div class="project-footer">
    <ApiButton :value="button" @update="update" />
  </div>
</template>
<script>
import ApiButton from '@builder/config-modules/api-button'
export default {
  components: {
    ApiButton
  },
  data () {
    return {
      button: {
        url: undefined,
        method: undefined,
        params: undefined,
        label: '发起'
      }
    }
  },
  methods: {
    update (data) {
      this.$emit('update', { apply: data })
    }
  }
}
</script>
<style lang="less" scoped>
.project-footer {
  text-align: center;
  margin: 2rem 0;
  /deep/ .api-button {
    button {
      width: 16rem;height:2.6rem;margin: 0 0.3rem;
    }
    .slave {
      width: 6rem;
    }
  }
}
</style>
