<template>
  <a-row>
    <a-col v-if="nodes.length" :span="24">
      <a-form-item :label-col="{span: 6}" :wrapper-col="{span: 16}">
        <span slot="label">
          可显示角色
          <a-tooltip title="主要分为“处理人”和“查看人”">
            <a-icon type="question-circle-o" />
          </a-tooltip>
        </span>
        <a-checkbox-group v-model="showOnEnv">
          <a-checkbox :value="'handler'">处理人</a-checkbox>
          <a-checkbox :value="'viewer'">查看人</a-checkbox>
        </a-checkbox-group>
      </a-form-item>
    </a-col>
    <a-col v-if="nodes.length" :span="24">
      <a-form-item :label-col="{span: 6}" :wrapper-col="{span: 16}">
        <span slot="label">
          可显示用户
          <a-tooltip title="当前用户可分为“内部”和“外部”两种用户类型">
            <a-icon type="question-circle-o" />
          </a-tooltip>
        </span>
        <a-checkbox-group v-model="showOnRoles">
          <a-checkbox :value="0">内部</a-checkbox>
          <a-checkbox :value="1">外部</a-checkbox>
        </a-checkbox-group>
      </a-form-item>
    </a-col>
    <a-col v-if="nodes.length" :span="24">
      <a-form-item :label-col="{span: 6}" :wrapper-col="{span: 16}">
        <span slot="label">
          可编辑用户
          <a-tooltip title="当前用户可分为“内部”和“外部”两种用户类型">
            <a-icon type="question-circle-o" />
          </a-tooltip>
        </span>
        <a-checkbox-group v-model="editOnRoles">
          <a-checkbox :value="0">内部</a-checkbox>
          <a-checkbox :value="1">外部</a-checkbox>
        </a-checkbox-group>
      </a-form-item>
    </a-col>
    <a-col v-if="nodes.length" :span="24">
      <a-form-item :label-col="{span: 6}" :wrapper-col="{span: 16}">
        <span slot="label">
          可显示节点
          <a-tooltip title="勾选即显示；全不勾选，则默认不显示。">
            <a-icon type="question-circle-o" />
          </a-tooltip>
        </span>
        <a-checkbox-group
          v-model="showOnNodes"
        >
          <a-checkbox
            v-for="node in nodes"
            :key="node.value"
            :value="node.value"
            :disabled="node.disabled"
          >
            {{ node.label }}
          </a-checkbox>
        </a-checkbox-group>
      </a-form-item>
    </a-col>
    <a-col v-if="nodes.length" :span="24">
      <a-form-item :label-col="{span: 6}" :wrapper-col="{span: 16}">
        <span slot="label">
          可编辑节点
          <a-tooltip>
            <template slot="title">
              <p>勾选之后，只在当前节点作为编辑组件显示，并且在提交的时候，当前组件的“值”会被收集；</p>
              <p>如果只是显示，那么勾选【显示节点】项就可以了</p>
            </template>
            <a-icon type="question-circle-o" />
          </a-tooltip>
        </span>
        <a-checkbox-group
          v-model="editOnNodes"
        >
          <a-checkbox
            v-for="node in editNodes"
            :key="node.value"
            :value="node.value"
            :disabled="node.disabled"
          >
            {{ node.label }}
          </a-checkbox>
        </a-checkbox-group>
      </a-form-item>
    </a-col>
    <a-col v-if="radios && radios.length" :span="24">
      <a-form-item :label-col="{span: 6}" :wrapper-col="{span: 16}">
        <span slot="label">
          可显示操作项
          <a-tooltip title="勾选之后，把操作项和当前字段的显示逻辑绑定">
            <a-icon type="question-circle-o" />
          </a-tooltip>
        </span>
        <a-checkbox-group
          v-model="showOnRadios"
        >
          <a-checkbox
            v-for="radio in radios"
            :key="radio.key"
            :value="radio.key"
            :disabled="radio.disabled"
          >
            {{ radio.label }}
          </a-checkbox>
        </a-checkbox-group>
      </a-form-item>
    </a-col>
  </a-row>
</template>
<script>
import utils from '@/utils'
export default {
  props: {
    nodes: {
      type: Array,
      default: () => []
    },
    radios: {
      type: Array,
      default: () => []
    },
    value: {
      type: Object,
      default: () => ({
        showOnEnv: [],
        showOnRoles: [],
        editOnRoles: [],
        showOnRadios: [],
        showOnNodes: [],
        editOnNodes: []
      })
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data () {
    const { value } = this.$props
    const initialValue = utils.clone(value)
    return initialValue
  },
  computed: {
    editNodes () {
      // 默认最后一个节点禁止编辑
      const nodes = utils.clone(this.nodes || [])
      return nodes.map((n, i) => {
        if (i === nodes.length - 1) {
          n.disabled = true
        }
        return n
      })
    },
    modifyMap () {
      const {
        showOnEnv,
        showOnRoles,
        showOnRadios,
        editOnRoles,
        showOnNodes,
        editOnNodes
      } = this
      return {
        showOnEnv,
        showOnRoles,
        showOnRadios,
        editOnRoles,
        showOnNodes,
        editOnNodes
      }
    }
  },
  watch: {
    modifyMap: {
      handler (data) {
        this.$emit('change', data)
      }
    }
  },
  methods: {
    // deployParams (params) {
    //   this.customParams = []
    //   Object.keys(params).forEach((key) => {
    //     const value = params[key]
    //     this.customParams.push({ key, value })
    //   })
    // },
    // addProp () {
    //   this.customParams.push({ key: '', value: '' })
    // },
    // reduceProp (i) {
    //   if (this.customParams && this.customParams.length > 1) {
    //     this.customParams.splice(i, 1)
    //     this.change()
    //   }
    // },
    change () {
      const paramsMap = array2object(this.customParams)
      this.$emit('change', utils.clone(paramsMap))
    }
  }
}

function array2object (src = []) {
  const res = Object.create(null)
  src.forEach((item) => {
    if (utils.isValuable(item.key)) {
      res[item.key] = item.value
    }
  })
  return res
}
</script>
<style lang="less" scoped>
.object-ctrl {
  display: flex;
  padding: 4px;
  button {
    margin-left: 4px;
  }
}
</style>
