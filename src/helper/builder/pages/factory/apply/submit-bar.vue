<template>
  <div class="ppproject-footer">
    <ConfigButton v-model="button" />
  </div>
</template>
<script>
import ConfigButton from '@/helper/builder/pages/factory/common/config-button'
export default {
  components: {
    ConfigButton
  },
  props: {
  },
  data () {
    return {
      button: {
        url: undefined,
        method: undefined,
        params: undefined,
        title: '发起'
      }
    }
  },
  methods: {
    update (data) {
    }
  }
}
</script>
<style lang="less" scoped>
.ppproject-footer {
  text-align: center;
  margin: 2rem 0;
  /deep/ .config-button {
    button {
      width: 16rem;height:2.6rem;margin: 0 0.3rem;
    }
    .slave {
      width: 6rem;
    }
  }
}
</style>
