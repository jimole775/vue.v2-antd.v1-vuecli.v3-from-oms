import { mapActions } from 'vuex'
export default {
  computed: {
    editType () {
      return this.$store.getters.getEditType
    },
    viewData () {
      return this.$store.getters.getViewData
    },
    buildData () {
      return this.$store.getters.getBuildData
    }
  },
  methods: {
    ...mapActions(['setViewData', 'setBuildData', 'setEditType', 'resetViewData', 'resetBuildData'])
  }
}
