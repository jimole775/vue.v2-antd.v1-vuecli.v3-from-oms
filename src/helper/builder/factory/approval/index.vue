<template>
  <div>
    <StepBar :data-source="stepNodes" @update="nodesUpdate" />
    <BuildCollapsePanels :key="current" :data-source="collapsePanels" @update="panelsUpdate" />
    <a-collapse
      :bordered="false"
      :active-key="['101', '102']"
    >
      <a-collapse-panel
        header="审批操作"
        key="101"
        class="m-block"
      >
        <OperationBar :key="current" :data-source="operation" @update="operationUpdate" />
      </a-collapse-panel>
      <LogBar :key="'102'" :data-source="log" @update="logUpdate" />
    </a-collapse>
  </div>
</template>
<script>
import utils from '@/utils'
import { mapGetters } from 'vuex'
import mixins from '@builder/mixins'
import LogBar from './modules/log-bar'
import StepBar from './modules/step-bar'
import OperationBar from './modules/operation-bar'
import BuildCollapsePanels from '@builder/config-modules/build-collapse-panels.vue'
export default {
  mixins: [mixins],
  components: {
    LogBar,
    StepBar,
    OperationBar,
    BuildCollapsePanels
  },
  data () {
    return {
      log: {},
      operation: {},
      collapsePanels: [],
      current: 0,
      stepNodes: [
        {
          fixed: true,
          edit: true,
          value: 'start',
          label: '流程开始'
        },
        {
          fixed: true,
          edit: false,
          value: '__addition__',
          label: '新增节点'
        },
        {
          fixed: true,
          edit: true,
          value: 'end',
          label: '流程结束'
        }
      ]
    }
  },
  computed: {
    ...mapGetters(['getStepNodes', 'getTabType']),
    currentNode () {
      return this.stepNodes[this.current] || {}
    }
  },
  watch: {
    viewData: {
      handler (data) {
        if (data.approval) {
          const currentModule = data.approval[this.currentRank]
          this.log = currentModule.log
          this.operation = currentModule.operation
          this.collapsePanels = currentModule.collapsePanels
          this.stepNodes = currentModule.stepNodes
        }
      },
      immediate: true
    }
  },
  methods: {
    operationUpdate (data) {
      this.operation = data
      this.handup()
    },
    logUpdate (data) {
      this.log = data
      this.handupApimap(this.log)
    },
    panelsUpdate (data) {
      this.collapsePanels = data
      // 从基础信息配置的信息，获取detail的接口
      const baseItem = this.collapsePanels[0]
      this.handupApimap({
        detail: {
          url: baseItem.url,
          method: baseItem.method,
          params: {}
        }
      })
      this.handup()
    },
    nodesUpdate (current, stepNodes) {
      this.current = current
      this.stepNodes = stepNodes
    },
    handupApimap (data) {
      this.setViewData({ key: 'apimap', value: data })
      this.setBuildData({ key: 'apimap', value: data })
    },
    handup () {
      const cacheData = {
        log: utils.clone(this.log),
        stepNodes: utils.clone(this.stepNodes),
        operation: utils.clone(this.operation),
        collapsePanels: utils.clone(this.collapsePanels)
      }
      this.setViewData({ key: 'approval', value: cacheData })
      this.setBuildData({ key: 'approval', value: cacheData })
    }
  }
}

</script>
<style lang="less" scoped>
.ppproject-footer {
  text-align: center;
  margin: 2rem 0;
  button {
    width: 16rem;height:2.6rem;
  }
}
/deep/.ant-row {
  line-height: 2.5;
}
</style>
