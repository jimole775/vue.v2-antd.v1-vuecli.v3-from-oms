<template>
  <div>
    <a-form :form="form">
      <a-row>
        <a-col :span="24">
          <a-form-item :label-col="{span: 2}" :wrapper-col="{span: 16}">
            <template slot="label">
              <span>
                审批
                <a @click="showSelectRadios"><a-icon type="edit" /></a>
              </span>
            </template>
            <a-radio-group name="radioGroup" v-model="approvalResult">
              <a-radio v-for="(radio,index) in radioItems" :key="index" :value="radio.value">
                <template>
                  <span>{{ radio.label }}</span>&nbsp;
                  <a-tooltip v-if="radio.tips" :title="radio.tips">
                    <a-icon type="question-circle-o" />
                  </a-tooltip>
                </template>
              </a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
      <BuildFormItems :data-source="currentRadio.formItems" :config="{ anchorText: '新增审批项', layout: 'v' }" @update="formItemsConfirm" />
      <a-row>
        <a-col :span="12">
          <a-form-item :label="' '" :label-col="{span: 4}" :wrapper-col="{span: 18}">
            <ConfigButton />
          </a-form-item>
        </a-col>
      </a-row>
    </a-form>
    <ConfigRadio :modal="configRadioModal" @update="configRadioConfirm" />
    <SelectRadios :modal="selectRadioModal" @update="selectRadioConfirm" />
  </div>
</template>
<script>
import utils from '@/utils'
import BuildFormItems from '@/helper/builder/pages/factory/common/build-form-items'
import ConfigButton from '@/helper/builder/pages/factory/common/config-button'
import ConfigRadio from '@/helper/builder/pages/factory/approval/modals/config-radio'
import SelectRadios from '@/helper/builder/pages/factory/approval/modals/select-radios'
const model = {
  handler: {
    title: '审批人',
    key: 'handler',
    component: 'ASelect'
  },
  approvalContent: {
    title: '审批意见',
    key: 'approvalContent',
    component: 'ATextarea'
  }
}
export default {
  components: {
    ConfigButton,
    SelectRadios,
    BuildFormItems,
    ConfigRadio
  },
  props: {
    dataSource: {
      type: Array
    }
  },
  data () {
    return {
      configRadioModal: {
        show: false,
        data: undefined
      },
      selectRadioModal: {
        show: false,
        data: undefined
      },
      radioItems: [
        {
          value: '1',
          label: '通过',
          tips: '',
          formItems: [
            utils.clone(model.approvalContent)
          ]
        },
        {
          value: '2',
          label: '驳回',
          tips: '驳回至流程发起节点，申请人可编辑后重新提交，或关闭流程',
          formItems: [
            utils.clone(model.approvalContent)
          ]
        },
        {
          value: '3',
          label: '不通过',
          tips: '不通过并结束流程',
          formItems: [
            utils.clone(model.approvalContent)
          ]
        },
        {
          value: '8',
          label: '转审',
          tips: '',
          formItems: [
            utils.clone(model.handler)
          ]
        }
      ],
      currentRadio: {},
      approvalResult: '1',
      form: this.$form.createForm(this)
    }
  },
  watch: {
    dataSource: {
      handler (data) {
        if (data && data.length) {
          this.radioItems = data
        }
      },
      immediate: true
    },
    approvalResult: {
      handler (val) {
        this.currentRadio = this.radioItems.find(i => i.value === val)
      },
      immediate: true
    }
  },
  methods: {
    showSelectRadios () {
      this.selectRadioModal.show = true
      this.selectRadioModal.data = utils.clone(this.radioItems)
    },
    formItemsConfirm (data) {
      this.currentRadio.formItems = data
      this.update()
    },
    selectRadioConfirm (data) {
      this.radioItems = data
      this.update()
    },
    configRadioConfirm () {},
    update () {
      this.$emit('update', this.radioItems)
    }
  }
}
</script>
<style lang="less" scoped>
/deep/.ant-row {
  line-height: 2.5;
}
</style>
