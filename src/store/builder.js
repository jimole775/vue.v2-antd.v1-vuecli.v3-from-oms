import applyViewToBuild from '@builder/utils/view-to-build/apply'
import approvalViewToBuild from '@builder/utils/view-to-build/approval'
import { columnsViewToBuild, searchorViewToBuild } from '@builder/utils/view-to-build/list'
import tabsViewToBuild from '@builder/utils/view-to-build/tabs'
export default {
  state: {
    tabType: '0',
    editType: 'new', // new | modify
    currentRank: 0,
    projectName: '',
    stepNodes: {},
    projects: [],
    buildData: {
      name: '',
      list: {},
      tabs: [],
      router: {},
      apimap: {},
      apply: {},
      approval: {}
    },
    viewData: {
      name: '',
      isEmpty: true,
      list: {},
      tabs: [],
      apply: {},
      router: {},
      apimap: {},
      approval: {}
    }
  },
  getters: {
    getCurrentRank (state) {
      return state.currentRank
    },
    getStepNodes (state) {
      return state.stepNodes[state.currentRank]
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
    getProjectName (state) {
      return state.projectName
    },
    getEditType (state) {
      return state.editType
    },
    getCurrentApimap (state) {
      return state.viewData.apimap[state.currentRank] || {}
    }
  },
  mutations: {
    commitStepNodes (state, nodes = []) {
      state.stepNodes[state.currentRank] = nodes
    },
    commitTabType (state, type) {
      state.tabType = type
    },
    commitEditType (state, type) {
      state.editType = type
    },
    commitBuildData (state, { key, rank = state.currentRank, value }) {
      switch (key) {
        case 'list':
          if (!state.buildData[key]) {
            state.buildData[key] = {}
          }
          const { list = {} } = value
          const columns = columnsViewToBuild(list.columns)
          const searchor = searchorViewToBuild(list.searchor)
          state.buildData[key][rank] = { columns, searchor }
          break
        case 'apply':
          if (!state.buildData[key]) {
            state.buildData[key] = {}
          }
          const applyBuild = applyViewToBuild(value.collapsePanels)
          state.buildData[key][rank] = applyBuild
          break
        case 'approval':
          if (!state.buildData[key]) {
            state.buildData[key] = {}
          }
          const approvalBuild = approvalViewToBuild(value)
          state.buildData[key][rank] = approvalBuild
          break
        case 'apimap':
          const already = state.buildData[key][rank] || {}
          state.buildData[key][rank] = {
            ...already,
            ...value
          }
          break
        case 'tabs':
          const tabs = value
          const tabsBuild = tabsViewToBuild(tabs)
          state.buildData[key] = tabsBuild
          break
        case 'name':
        case 'router':
          state.buildData[key] = value
          break
      }
    },
    commitViewData (state, { key, rank = state.currentRank, value }) {
      state.viewData.isEmpty = false
      if (!state.viewData[key]) {
        state.viewData[key] = {}
      }
      switch (key) {
        case 'list':
        case 'apply':
        case 'approval':
          state.viewData[key][rank] = value
          break
        case 'apimap':
          const already = state.viewData[key][rank] || {}
          state.viewData['apimap'][rank] = {
            ...already,
            ...value
          }
          break
        case 'tabs':
        case 'router':
          state.viewData[key] = value
          break
        default:
          state.viewData[key] = value
          break
      }
    },
    commitProjects (state, data) {
      state.projects.push(data)
    },
    commitProjectName (state, name) {
      state.projectName = name
    },
    commitCurrentRank (state, rank) {
      state.currentRank = rank
    }
  },
  actions: {
    setCurrentRank ({ commit, state }, rank) {
      commit('commitCurrentRank', rank)
    },
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
      commit('commitBuildData', { key: 'tabs', value: [] })
      commit('commitBuildData', { key: 'list', value: {} })
      commit('commitBuildData', { key: 'router', value: {} })
      commit('commitBuildData', { key: 'apply', value: {} })
      commit('commitBuildData', { key: 'apimap', value: {} })
      commit('commitBuildData', { key: 'approval', value: {} })
    },
    resetViewData ({ commit, state }) {
      commit('commitViewData', { key: 'tabs', value: [] })
      commit('commitViewData', { key: 'list', value: {} })
      commit('commitViewData', { key: 'router', value: {} })
      commit('commitViewData', { key: 'apimap', value: {} })
      commit('commitViewData', { key: 'apply', value: {} })
      commit('commitViewData', { key: 'approval', value: {} })
    },
    setEditType ({ commit, state }, type) {
      commit('commitEditType', type)
    },
    setProjectName ({ commit, state }, name) {
      if (state.projectName !== name) {
        commit('commitProjectName', name)
      }
    }
  }
}
