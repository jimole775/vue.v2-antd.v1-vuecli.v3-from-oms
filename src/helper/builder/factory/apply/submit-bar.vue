<template>
  <div class="project-footer">
    <ApiButton :value="button" @update="apiUpdate" />
  </div>
</template>
<script>
import { mapGetters } from 'vuex'
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
  computed: {
    ...mapGetters(['getCurrentApimap'])
  },
  watch: {
    getCurrentApimap: {
      handler (apimap) {
        if (apimap) {
          this.button = apimap['apply']
        }
      },
      immediate: true
    }
  },
  methods: {
    apiUpdate (api) {
      this.handupApi({ apply: api })
    },
    handupApi (data) {
      this.setViewData({ key: 'apimap', value: data })
      this.setBuildData({ key: 'apimap', value: data })
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
