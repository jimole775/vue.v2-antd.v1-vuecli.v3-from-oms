import { mapActions } from 'vuex'
export default {
  computed: {
    viewData () {
      return this.$store.getters.getViewData
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
    ...mapActions(['setViewData', 'setEditType', 'setProjectName', 'resetProjectName', 'loadViewData', 'resetViewData'])
  }
}
