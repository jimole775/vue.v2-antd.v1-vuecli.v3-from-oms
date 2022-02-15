/**
 * 专门用于页面间传值，使用后注意释放变量，参考InterviewApprove.vue
 */
export default {
  state: {
    tabType: 0,
    stepNodes: []
  },
  getters: {
    getStepNodes (state) {
      return state.stepNodes
    },
    getTabType (state) {
      return state.tabType
    }
  },
  mutations: {
    commitStepNodes (state, nodes) {
      state.stepNodes = nodes || {}
    },
    commitTabType (state, type) {
      state.tabType = type
    }
  },
  actions: {
    setStepNodes ({ commit, state }, nodes) {
      state.stepNodes = nodes || []
      commit('commitStepNodes', state.stepNodes)
    },
    setTabType ({ commit, state }, type) {
      state.tabType = type
      commit('commitTabType', state.tabType)
    }
  }
}
