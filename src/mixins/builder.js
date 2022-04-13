import { mapActions } from 'vuex'
export default {
  computed: {
    viewData () {
      return this.$store.getters.getViewData
    },
    buildData () {
      return this.$store.getters.getBuildData
    },
    editType () {
      return this.$store.getters.getEditType
    },
    currentRank () {
      return this.$store.getters.getCurrentRank
    },
    projectName () {
      return this.$store.getters.getProjectName
    }
  },
  methods: {
    ...mapActions(['setViewData', 'setBuildData', 'setEditType', 'setProjectName', 'resetViewData', 'resetBuildData'])
  }
}
