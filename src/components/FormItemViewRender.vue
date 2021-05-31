<script>
// import api from '@/api'
import moment from 'moment'
import utils from '@/utils'
export default {
  name: 'FormItemViewRender',
  props: {
    columns: {
      type: Array, // [{ key: '', label: '', labelCol: '', wrapperCol: '' }]
      default: () => ([])
    },
    dataSource: {
      type: Object, // { [key]: '' }
      default: () => ({})
    },
    beforeRender: {
      type: Function,
      default: p => p
    },
    vmprops: {
      type: Object,
      default: () => ({})
    }
  },
  watch: {
    columns: {
      handler (cols) {
        if (cols) {
          const dataSource = this.dataSource || {}
          this.$nextTick(() => {
            this.$props.beforeRender(dataSource, cols, utils.bindVMScopeParent(this))
          })
        }
      },
      immediate: true
    }
  },
  methods: {
    moment,
    formatMoney: utils.formatMoney,
    labelRender (h, colItem) {
      let labelC = null
      if (colItem.label) {
        labelC = h('span', { slot: 'label' }, colItem.label)
      }
      if (colItem.labelCustomRender) {
        labelC = colItem.labelCustomRender(h, colItem, utils.bindVMScopeParent(this))
      }
      return labelC
    },
    wrapperRender (h, colItem) {
      if (colItem.wrapperCustomRender) {
        return colItem.wrapperCustomRender(h, colItem, utils.bindVMScopeParent(this))
      } else {
        return this.dataSource[colItem.key]
      }
    },
    updateDataSet (val) {
      console.log(val)
    }
  },
  render (h) {
    return (
      <div class={['baseinfo-wrapper']}>
        <AForm>
          <ARow>
            {
              this.columns.map((colItem, index) => {
                return (
                  <ACol span={ colItem.layout ? colItem.layout.span : (colItem.span || 8) }>
                    <AFormItem
                      labelCol={{ span: colItem.layout ? colItem.layout.label : (colItem.labelCol || 8) }}
                      wrapperCol={{ span: colItem.layout ? colItem.layout.wrapper : (colItem.wrapperCol || 16) }}
                    >
                      {[
                        this.labelRender(h, colItem),
                        this.wrapperRender(h, colItem)
                      ]}
                    </AFormItem>
                  </ACol>
                )
              })
            }
          </ARow>
        </AForm>
      </div>
    )
  }
}
</script>
<style lang="less" scoped>
// a-row默认的高度为“line-height:39px”
// 使用slot之后，高度会变成“line-height:40px”，导致强制换行
// 所以需要在这里赋值，进行覆盖
div.baseinfo-wrapper {
  /deep/ .ant-form-item-control {
    line-height: 2.8;
  }
}
</style>
