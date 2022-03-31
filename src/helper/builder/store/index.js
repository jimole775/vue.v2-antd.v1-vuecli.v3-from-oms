// import utils from '@/utils'
import applyViewToBuild from './view-to-build/apply'
import approvalViewToBuild from './view-to-build/approval'
import { columnsViewToBuild, searchorViewToBuild } from './view-to-build/list'
import tabsViewToBuild from './view-to-build/tabs'
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
      listConfig: {},
      applyConfig: {},
      approvalConfig: {},
      apimapConfig: {},
      routerConfig: {},
      tabsConfig: []
    },
    viewData: {
      name: '',
      isEmpty: true,
      tabs: [],
      router: {},
      list: {},
      apply: {},
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
      if (!state.buildData[key]) {
        state.buildData[key] = {}
      }
      switch (key) {
        case 'list':
          const { listConfig = {} } = value
          const columns = columnsViewToBuild(listConfig.columns)
          const searchor = searchorViewToBuild(listConfig.searchor)
          state.buildData['listConfig'][rank] = { columns, searchor }
          break
        case 'apply':
          const applyBuild = applyViewToBuild(value.collapsePanels)
          state.buildData['applyConfig'][rank] = applyBuild
          break
        case 'approval':
          const approvalBuild = approvalViewToBuild(value.stepNodes, value.collapsePanels)
          state.buildData['approvalConfig'][rank] = approvalBuild
          break
        case 'apimap':
          const already = state.buildData[key][rank] || {}
          state.buildData['apimapConfig'][rank] = {
            ...already,
            ...value
          }
          break
        case 'tabs':
          const tabs = value
          const tabsBuild = tabsViewToBuild(tabs)
          state.buildData['tabsConfig'] = tabsBuild
          break
        case 'router':
          state.buildData['routerConfig'] = value
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
    setCurrentRank ({ commit, state }, nodes) {
      commit('commitCurrentRank', nodes)
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
      commit('commitBuildData', { key: 'tabsConfig', value: [] })
      commit('commitBuildData', { key: 'listConfig', value: {} })
      commit('commitBuildData', { key: 'routerConfig', value: {} })
      commit('commitBuildData', { key: 'applyConfig', value: {} })
      commit('commitBuildData', { key: 'apimapConfig', value: {} })
      commit('commitBuildData', { key: 'approvalConfig', value: {} })
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
