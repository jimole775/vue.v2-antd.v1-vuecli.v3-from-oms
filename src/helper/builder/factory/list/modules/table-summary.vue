<template>
  <div>
    <div class="btn-wrap clearfix summary">
      <ApiButton
        :key="99"
        :value="dataApi"
        @update="dataApiConfirm"
      />
      <ApiButton
        key="apply"
        style="padding-right: 1rem"
        :value="applySubmitApi"
        @update="applySubmitApiUpdate"
      />
      <template v-for="key in Object.keys(batchButtonsMap)">
        <ApiButton
          :key="key"
          :value="batchButtonsMap[key]"
          @update="batchButtonConfirm"
        />
      </template>
    </div>
  </div>
</template>
<script>
import utils from '@/utils'
import ApiButton from '@builder/config-modules/api-button'
export default {
  components: {
    ApiButton
  },
  props: {
    value: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    const baseProps = this.$store.state.builder.apiBaseProps
    return {
      applySubmitApi: {
        ...baseProps,
        key: 'applyApi',
        label: '创建|申请'
      },
      dataApi: {
        ...baseProps,
        key: 'dataApi',
        label: '列表'
      },
      batchButtonsMap: {
        pass: {
          ...baseProps,
          key: 'pass',
          label: '通过'
        },
        transfer: {
          ...baseProps,
          key: 'transfer',
          label: '转审'
        },
        revoke: {
          ...baseProps,
          key: 'revoke',
          label: '撤回'
        },
        reject: {
          ...baseProps,
          key: 'reject',
          label: '驳回'
        },
        abandon: {
          ...baseProps,
          key: 'abandon',
          label: '废弃'
        },
        close: {
          ...baseProps,
          key: 'close',
          label: '关闭'
        },
        delete: {
          ...baseProps,
          key: 'delete',
          label: '删除'
        },
        export: {
          ...baseProps,
          key: 'export',
          label: '导出'
        }
      }
    }
  },
  computed: {
    nodes () {
      return this.$store.getters.getNodes
    }
  },
  watch: {
    value: {
      handler ({ batch, dataApi, applySubmitApi }) {
        if (!utils.isEmptyObject(batch)) {
          Object.keys(batch).forEach((key) => {
            this.$set(this.batchButtonsMap, key, batch[key])
          })
        }
        if (!utils.isEmptyObject(dataApi)) {
          this.dataApi = dataApi
        }
        if (!utils.isEmptyObject(applySubmitApi)) {
          this.applySubmitApi = applySubmitApi
        }
      },
      immediate: true
    },
    nodes: {
      handler (nodes) {
        if (nodes[0]) {
          this.applySubmitApi.label = nodes[0].label || '创建|申请'
          this.$emit('updateApplySubmitApi', this.applySubmitApi)
        }
      },
      immediate: true,
      deep: true
    }
  },
  methods: {
    applySubmitApiUpdate (apiInfo) {
      this.applySubmitApi = utils.clone(apiInfo)
      this.$emit('updateApplySubmitApi', this.applySubmitApi)
    },
    batchButtonConfirm (buttonInfo) {
      this.batchButtonsMap[buttonInfo.key] = utils.clone(buttonInfo)
      this.$emit('updateBatchButton', this.batchButtonsMap)
    },
    dataApiConfirm (buttonInfo) {
      this.dataApi = utils.clone(buttonInfo)
      this.$emit('updateListDataApi', this.dataApi)
    }
  }
}
</script>
<style lang="less" scoped>
.summary-disabled {
    color: rgba(0, 0, 0, 0.25);
    background-color: #f5f5f5;
    border-color: #d9d9d9;
    text-shadow: none;
    -webkit-box-shadow: none;
    box-shadow: none;
}
</style>
