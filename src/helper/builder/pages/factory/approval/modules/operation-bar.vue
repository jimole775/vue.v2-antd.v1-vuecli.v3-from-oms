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
              <a-radio
                v-for="(radio,index) in radioItemsView"
                :key="radio.key"
                :value="radio.key"
                :class="approvalResult === radio.key ? 'checked' : 'discheck'"
              >
                <template>
                  <a @dblclick.stop="() => showRadioConfig(radio, index)">{{ radio.label }}</a>&nbsp;
                  <!-- <a @click.stop="() => showRadioConfig(radio, index)"><a-icon type="edit" /></a>&nbsp; -->
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
    component: 'ASelect',
    layout: {
      span: 24,
      label: 2,
      wrapper: 16
    }
  },
  approvalContent: {
    title: '审批意见',
    key: 'approvalContent',
    component: 'ATextarea',
    layout: {
      span: 24,
      label: 2,
      wrapper: 16
    }
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
        index: null,
        data: undefined
      },
      selectRadioModal: {
        show: false,
        data: undefined
      },
      radioItems: [
        {
          key: 'pass',
          value: '1',
          label: '通过',
          show: true,
          tips: '',
          formItems: [
            utils.clone(model.approvalContent)
          ]
        },
        {
          key: 'reject',
          value: '2',
          label: '驳回',
          show: true,
          tips: '驳回至流程发起节点，申请人可编辑后重新提交，或关闭流程',
          formItems: [
            utils.clone(model.approvalContent)
          ]
        },
        {
          key: 'unpass',
          value: '3',
          label: '不通过',
          show: true,
          tips: '不通过并结束流程',
          formItems: [
            utils.clone(model.approvalContent)
          ]
        },
        {
          key: 'transfer',
          value: '8',
          label: '转审',
          show: true,
          tips: '',
          formItems: [
            utils.clone(model.handler)
          ]
        },
        {
          key: 'close',
          value: '7',
          label: '关闭',
          show: false,
          tips: '',
          formItems: [
            utils.clone(model.approvalContent)
          ]
        },
        {
          key: 'abandon',
          value: '10',
          label: '放弃',
          show: false,
          tips: '',
          formItems: [
            utils.clone(model.approvalContent)
          ]
        },
        {
          key: 'delete',
          value: '1',
          label: '删除',
          show: false,
          tips: '',
          formItems: [
            utils.clone(model.approvalContent)
          ]
        }
      ],
      currentRadio: {},
      approvalResult: 'pass',
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
        this.currentRadio = this.radioItems.find(i => i.key === val)
      },
      immediate: true
    }
  },
  computed: {
    radioItemsView () {
      return this.radioItems.filter((item) => item.show)
    }
  },
  methods: {
    showRadioConfig (data, index) {
      this.configRadioModal.show = true
      this.configRadioModal.index = index
      this.configRadioModal.data = data
    },
    configRadioConfirm (data, index) {
      this.$set(this.radioItems, index, data)
      this.update()
    },
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
.checked {
  color: #2DC84D;
  a {
    color: #2DC84D;
  }
}
.discheck {
  color: #999999;
  a {
    color: #999999;
  }
}
</style>
