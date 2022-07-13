<template>
  <a-collapse
    :bordered="false"
    :active-key="['101']"
  >
    <a-collapse-panel
      header="审批操作"
      key="101"
      class="m-block"
    >
      <a-form :form="form">
        <a-row>
          <a-col :span="24">
            <a-form-item label="审批" :label-col="{span: 2}" :wrapper-col="{span: 16}">
              <a-radio-group name="radioGroup" v-model="approvalResult">
                <a-radio
                  v-for="(radio, index) in radios"
                  :key="radio.key"
                  :value="radio.key"
                >
                  <template>
                    <a @click.stop="() => showRadioConfig(radio, index)">{{ radio.label }}</a>&nbsp;
                    <a-tooltip v-if="radio.tips" :title="radio.tips">
                      <a-icon type="question-circle-o" />
                    </a-tooltip>
                  </template>
                </a-radio>
              </a-radio-group>
            </a-form-item>
          </a-col>
        </a-row>
        <ConfigFormItems
          layout="v"
          anchor-text="新增审批内容"
          :value="inputs"
          :radios="radios"
          :nodes="inputNodes"
          @update="formItemsConfirm"
        />
        <a-row>
          <a-col :span="12">
            <a-form-item :label="' '" :label-col="{span: 4}" :wrapper-col="{span: 12}">
              <ApiButton
                key="approval"
                :value="approvalSubmitApi"
                @update="approvalApiUpdate"
              />
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
      <ConfigRadio :modal="radioModal" :nodes="radioNodes" @update="configRadioConfirm" />
    </a-collapse-panel>
  </a-collapse>
</template>
<script>
import utils from '@/utils'
import ConfigFormItems from '@builder/config-modules/config-form-items'
import ApiButton from '@builder/config-modules/api-button'
import ConfigRadio from '@builder/config-modals/config-radio'
export default {
  components: {
    ApiButton,
    ConfigFormItems,
    ConfigRadio
  },
  props: {
    value: {
      type: Object
    },
    nodes: {
      type: Array
    }
  },
  data () {
    return {
      radioModal: {
        show: false,
        index: null,
        data: undefined
      },
      radios: [
        {
          value: '1',
          key: 'pass',
          label: '通过',
          tips: ''
        },
        {
          value: '2',
          key: 'reject',
          label: '驳回',
          tips: '驳回至流程发起节点，申请人可编辑后重新提交，或关闭流程'
        },
        {
          value: '3',
          key: 'unpass',
          label: '不通过',
          tips: '不通过并结束流程'
        },
        {
          value: '7',
          key: 'close',
          label: '关闭',
          tips: ''
        },
        {
          value: '8',
          key: 'transfer',
          label: '转审',
          tips: ''
        },
        {
          value: '10',
          key: 'abandon',
          label: '放弃',
          tips: ''
        },
        {
          value: '11',
          key: 'delete',
          label: '删除',
          tips: ''
        }
      ],
      inputs: [
        {
          label: '审批人',
          key: 'handler',
          component: 'UserSelect',
          showOnRadios: ['transfer'],
          layout: {
            span: 24,
            label: 2,
            wrapper: 16
          }
        },
        {
          label: '审批意见',
          key: 'approvalContent',
          component: 'ATextarea',
          showOnRadios: ['pass', 'reject', 'unpass', 'close', 'abandon', 'delete'],
          layout: {
            span: 24,
            label: 2,
            wrapper: 16
          }
        }
      ],
      approvalSubmitApi: {
        label: '审批'
      },
      approvalResult: 'pass',
      form: this.$form.createForm(this)
    }
  },
  computed: {
    inputNodes () {
      const res = []
      const nodes = utils.clone(this.nodes || [])
      nodes.forEach((node, index) => {
        // if (node.value === 'start') {
        //   node.checked = true
        // }
        // 最后一个节点 不可编辑
        if (index === nodes.length - 1) {
          node.disabled = true
        }
        res.push(node)
      })
      return res
    },
    radioNodes () {
      const res = []
      const radioValue = (this.radioModal.data && this.radioModal.data.checked) || ''
      const nodes = utils.clone(this.nodes || [])
      nodes.forEach((node, index) => {
        if (node.value === 'start') {
          // 除了 【删除】，【关闭】，【放弃】，其他的选项的“开始节点”都禁掉
          if (radioValue && !['7', '10', '11'].includes(radioValue)) {
            node.disabled = true
          }
        }
        // 最后一个节点 不可编辑
        if (index === nodes.length - 1) {
          node.disabled = true
        }
        res.push(node)
      })
      return res
    }
  },
  watch: {
    value: {
      handler ({ operator, approvalSubmitApi }) {
        if (operator.radios && operator.radios.length) {
          this.radios = operator.radios
        }
        if (operator.inputs && operator.inputs.length) {
          this.inputs = operator.inputs
        }
        if (!utils.isEmptyObject(approvalSubmitApi)) {
          this.approvalSubmitApi = approvalSubmitApi
        }
      },
      immediate: true
    }
  },
  created () {
    // this.radios 和 this.inputs 有默认值
    // 所以，开始就要update()一次，以更新上层数据
    this.update()
  },
  methods: {
    approvalApiUpdate (apiInfo) {
      this.approvalSubmitApi = utils.clone(apiInfo)
      this.update()
    },
    showRadioConfig (data, index) {
      this.radioModal.show = true
      this.radioModal.index = index
      this.radioModal.data = data
    },
    configRadioConfirm (data, index) {
      this.$set(this.radios, index, data)
      this.update()
    },
    formItemsConfirm (data) {
      this.inputs = data
      this.update()
    },
    update () {
      this.$emit('update', {
        operator: { radios: this.radios, inputs: this.inputs },
        approvalSubmitApi: this.approvalSubmitApi
      })
    }
  }
}
</script>
