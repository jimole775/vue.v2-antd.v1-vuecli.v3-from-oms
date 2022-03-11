<template>
  <div>
    <a-form :form="form">
      <a-row>
        <a-col :span="24">
          <a-form-item label="审批" :label-col="{span: 2}" :wrapper-col="{span: 16}">
            <a-radio-group name="radioGroup" v-model="approvalResult">
              <a-radio
                v-for="(radio, index) in radios"
                :key="radio.value"
                :value="radio.value"
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
      <BuildFormItems
        :data-source="inputs"
        :config="{ anchorText: '新增审批内容', layout: 'v', operations: radios }"
        @update="formItemsConfirm"
      />
      <a-row>
        <a-col :span="12">
          <a-form-item :label="' '" :label-col="{span: 4}" :wrapper-col="{span: 18}">
            <ApiButton />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <ConfigRadio :modal="configRadioModal" @update="configRadioConfirm" />
  </div>
</template>
<script>
// import utils from '@/utils'
import { mapGetters } from 'vuex'
import BuildFormItems from '@/helper/builder/common/config-modules/build-form-items'
import ApiButton from '@/helper/builder/common/config-modules/api-button'
import ConfigRadio from '@/helper/builder/approval/modals/config-radio'
export default {
  components: {
    ApiButton,
    BuildFormItems,
    ConfigRadio
  },
  props: {
    dataSource: {
      type: Object
    }
  },
  data () {
    return {
      configRadioModal: {
        show: false,
        index: null,
        data: undefined
      },
      radios: [
        {
          checked: '1',
          value: 'pass',
          label: '通过',
          tips: ''
        },
        {
          checked: '2',
          value: 'reject',
          label: '驳回',
          tips: '驳回至流程发起节点，申请人可编辑后重新提交，或关闭流程'
        },
        {
          checked: '3',
          value: 'unpass',
          label: '不通过',
          tips: '不通过并结束流程'
        },
        {
          checked: '7',
          value: 'close',
          label: '关闭',
          tips: ''
        },
        {
          checked: '8',
          value: 'transfer',
          label: '转审',
          tips: ''
        },
        {
          checked: '10',
          value: 'abandon',
          label: '放弃',
          tips: ''
        },
        {
          checked: '1',
          value: 'delete',
          label: '删除',
          tips: ''
        }
      ],
      inputs: [
        {
          title: '审批人',
          key: 'handler',
          component: 'ASelect',
          operations: ['transfer'],
          layout: {
            span: 24,
            label: 2,
            wrapper: 16
          }
        },
        {
          title: '审批意见',
          key: 'approvalContent',
          component: 'ATextarea',
          operations: ['pass', 'reject', 'unpass', 'close', 'abandon', 'delete'],
          layout: {
            span: 24,
            label: 2,
            wrapper: 16
          }
        }
      ],
      approvalResult: 'pass',
      form: this.$form.createForm(this)
    }
  },
  computed: {
    ...mapGetters(['getStepNodes', 'getTabType']),
    stepNodes () {
      const res = []
      this.getStepNodes.forEach((node) => {
        if (node.value !== 'end') {
          res.push(node)
        }
      })
      return res
    }
  },
  watch: {
    dataSource: {
      handler (data) {
        if (data && data.length) {
          this.radios = data
        }
      },
      immediate: true
    }
  },
  created () {
    this.bindStepNodes()
    // this.radios 和 this.inputs 有默认值
    // 所以，开始就要update()一次，以更新上层数据
    this.update()
  },
  methods: {
    bindStepNodes () {
      this.radios.forEach((radio) => {
        radio.stepNodes = this.stepNodes.map(i => i.value)
      })
      this.inputs.forEach((input) => {
        input.stepNodes = this.stepNodes.map(i => i.value)
      })
    },
    showRadioConfig (data, index) {
      this.configRadioModal.show = true
      this.configRadioModal.index = index
      this.configRadioModal.data = data
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
      this.$emit('update', { radios: this.radios, inputs: this.inputs })
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.ant-row {
  line-height: 2.5;
}
</style>
