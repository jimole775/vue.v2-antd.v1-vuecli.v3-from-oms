<template>
  <div class="baseinfo-wrapper">
    <a-form>
      <a-row>
        <template v-for="(colItem, index) in columns">
          <a-col :span="colItem.layout ? colItem.layout.span : (colItem.span || 8)" :key="index">
            <a-form-item
              :label-col="{span: colItem.layout ? colItem.layout.label : (colItem.labelCol || 8)}"
              :wrapper-col="{span: colItem.layout ? colItem.layout.wrapper : (colItem.wrapperCol || 16)}"
            >
              <template slot="label">
                <slot :name="`${colItem.key}_label`" v-bind="colItem">
                  <span>{{ colItem.label }}</span>
                </slot>
              </template>
              <slot :name="colItem.key" v-bind="colItem">
                <span>{{ dataSource[colItem.key] }}</span>
              </slot>
            </a-form-item>
          </a-col>
        </template>
      </a-row>
    </a-form>
  </div>
</template>
<script>
import api from '@/api'
import moment from 'moment'
import utils from '@/utils'
export default {
  name: 'PPBaseInfo',
  title: '项目信息',
  components: {
  },
  props: {
    columns: {
      type: Array, // [{ key: '', label: '', labelCol: '', wrapperCol: '' }]
      default: null
    },
    dataSource: {
      type: Object, // { [key]: '' }
      default: null
    }
  },
  data () {
    return {
    }
  },
  created () {
    this.getAllArea()
  },
  methods: {
    moment,
    formatMoney: utils.formatMoney,
    // 获取所有地域
    getAllArea () {
      api.getAllArea().then(res => {
        if (res.code === 200) {
          this.areaOption = res.data
        }
      })
    },
    updateDataSet (val) {
      console.log(val)
    }
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
