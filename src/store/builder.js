/**
 * 专门用于页面间传值，使用后注意释放变量，参考InterviewApprove.vue
 */
export default {
  state: {
    tabType: 0,
    buildData: {},
    stepNodes: []
  },
  getters: {
    getStepNodes (state) {
      return state.stepNodes
    },
    getTabType (state) {
      return state.tabType
    },
    getBuildData (state) {
      return state.buildData
    }
  },
  mutations: {
    commitStepNodes (state, nodes) {
      state.stepNodes = nodes || []
    },
    commitTabType (state, type) {
      state.tabType = type
    },
    commitBuildData (state, data) {
      state.buildData = data
    }
  },
  actions: {
    setStepNodes ({ commit, state }, nodes) {
      commit('commitStepNodes', nodes)
    },
    setTabType ({ commit, state }, type) {
      commit('commitTabType', type)
    },
    setBuildData ({ commit, state }, data) {
      commit('commitBuildData', data)
    }
  }
}
