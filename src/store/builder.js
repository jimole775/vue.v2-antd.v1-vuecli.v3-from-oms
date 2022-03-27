export default {
  state: {
    tabType: 0,
    buildData: {},
    stepNodes: [],
    projects: [],
    currentJob: '',
    viewData: {
      name: '',
      isEmpty: true,
      tabs: [],
      list: {},
      router: {},
      apply: {},
      apimap: {},
      approval: {}
    }
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
    },
    getViewData (state) {
      return state.viewData
    },
    getProjects (state) {
      return state.projects
    },
    getCurrentJob (state) {
      return state.currentJob
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
    },
    commitViewData (state, key, data) {
      state.viewData.isEmpty = false
      state.viewData[key] = data
    },
    commitProjects (state, data) {
      state.projects.push(data)
    },
    commitCurrentJob (state, name) {
      state.currentJob = name
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
    },
    setViewData ({ commit, state }, key, data) {
      commit('commitViewData', key, data)
    },
    setCurrentJob ({ commit, state }, name) {
      commit('commitCurrentJob', name)
      if (!state.projects.includes(name)) {
        commit('commitProjects', name)
      }
    }
  }
}
