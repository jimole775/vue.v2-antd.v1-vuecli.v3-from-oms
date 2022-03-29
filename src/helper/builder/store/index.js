import utils from '@/utils'
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
      router: {},
      list: {
        listData: [],
        summaryObject: {},
        listConfig: {
          columns: [],
          searchor: []
        }
      },
      apply: {
        collapsePanels: []
      },
      apimap: {},
      approval: {
        log: {},
        operation: {},
        collapsePanels: [],
        stepNodes: []
      }
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
    commitBuildData (state, { key, index, value }) {
      // 有 index 时，数据结构不一样
      if (utils.isValuable(index)) {
        if (!state.buildData[key]) {
          state.buildData[key] = {}
        }
        // apimapConfig 额外逻辑
        if (key === 'apimapConfig') {
          const already = state.buildData[key][index] || {}
          state.buildData['apimapConfig'][index] = {
            ...already,
            ...value
          }
        } else {
          state.buildData[key][index] = value
        }
      } else {
        // 没有 index 时，属于公共数据
        state.buildData[key] = value
      }
    },
    commitViewData (state, { key, value }) {
      state.viewData.isEmpty = false
      state.viewData[key] = value
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
    setViewData ({ commit, state }, data) {
      commit('commitViewData', data)
    },
    resetBuildData ({ commit, state }) {
      commit('commitBuildData', { key: 'tabsConfig', value: [] })
      commit('commitBuildData', { key: 'listConfig', value: {} })
      commit('commitBuildData', { key: 'routerConfig', value: {} })
      commit('commitBuildData', { key: 'applyConfig', value: {} })
      commit('commitBuildData', { key: 'apimapConfig', value: {} })
      commit('commitBuildData', { key: 'approvalConfig', value: {} })
    },
    resetViewData ({ commit, state }) {
      commit('commitViewData', { key: 'name', value: '' })
      commit('commitViewData', { key: 'isEmpty', value: true })
      commit('commitViewData', { key: 'tabs', value: [] })
      commit('commitViewData', { key: 'list', value: {} })
      commit('commitViewData', { key: 'router', value: {} })
      commit('commitViewData', { key: 'apimap', value: {} })
      commit('commitViewData', { key: 'apply', value: {} })
      commit('commitViewData', { key: 'approval', value: {} })
    },
    setCurrentJob ({ commit, state }, name) {
      if (state.currentJob !== name) {
        commit('commitCurrentJob', name)
      }
    }
  }
}
