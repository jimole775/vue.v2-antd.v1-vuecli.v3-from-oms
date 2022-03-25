import storage from './storage'
export default {
  state: {
    tabType: 0,
    buildData: {},
    stepNodes: [],
    existModules: [],
    currentModule: '',
    viewData: {
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
      if (!state.viewData.length) {
        return storage.getItem(`${state.currentModule}_viewData`)
      } else {
        return state.viewData
      }
    },
    getExistModules (state) {
      if (!state.existModules.length) {
        return storage.getItem(`${state.currentModule}_existModules`)
      } else {
        return state.existModules
      }
    },
    getCurrentModule (state) {
      return state.currentModule
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
      storage.setItem(`${state.currentModule}_viewData`, state.viewData)
    },
    commitExistModules (state, data) {
      state.existModules.push(data)
      storage.setItem(`${state.currentModule}_existModules`, state.existModules)
    },
    commitCurrentModule (state, name) {
      state.currentModule = name
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
    setCurrentModule ({ commit, state }, name) {
      commit('commitCurrentModule', name)
      if (!state.existModules.includes(name)) {
        commit('commitExistModules', name)
      }
    }
  }
}
