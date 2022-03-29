import { mapActions } from 'vuex'
export default {
  computed: {
    viewData () {
      return this.$store.getters.getViewData
    },
    buildData () {
      return this.$store.getters.getBuildData
    }
  },
  methods: {
    ...mapActions(['setViewData', 'setBuildData', 'resetViewData', 'resetBuildData'])
  }
}
