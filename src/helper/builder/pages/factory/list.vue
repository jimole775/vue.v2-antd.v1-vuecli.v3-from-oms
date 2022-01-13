<template>
  <div>
    <div class="panel-content">
      <a-form class="form-wrap">
        <a-row>
          <a-col v-for="(item, index) in searchorItems" :key="index" :span="6">
            <a-form-item v-bind="formItemLayout">
              <template slot="label">
                <a-input v-model="item.key" />
              </template>
              <a-select v-model="item.component" />
            </a-form-item>
          </a-col>
          <a-col :span="6">
            <a-form-item label="查询字段" v-bind="formItemLayout">
              <a-button @click="addSearchorItem">+</a-button>
            </a-form-item>
          </a-col>
        </a-row>
      </a-form>
    </div>
    <div class="panel-content">
      <div class="btn-wrap clearfix summary">
        <a-button ghost type="primary">创建</a-button>
        <a-button ghost type="primary">申请</a-button>
        <a-button ghost type="primary">撤回</a-button>
        <a-button ghost type="primary">关闭</a-button>
        <a-button ghost type="primary">转审</a-button>
      </div>
    </div>
    <div class="panel-content">
      <a-table
        :columns="columns"
        :data-source="dataList"
      >
        <template slot="addonTitle">
          <a-button type="primary">+</a-button>
        </template>
        <template slot="addon" slot-scope="text">
          {{ text }}
        </template>
      </a-table>
    </div>
    <AddSearchorItem :modal="modal" @update="searchorItemConfirm" />
  </div>
</template>
<script>
import utils from '@/utils'
import AddSearchorItem from '@/helper/builder/pages/factory/modals/add-searchor-item.vue'
export default {
  components: {
    AddSearchorItem
  },
  data () {
    return {
      formItemLayout: {
        labelCol: { span: 6 },
        wrapperCol: { span: 18 }
      },
      columns: [
        {
          dataIndex: 'addon',
          slots: { title: 'addonTitle' }
        }
      ],
      dataList: [{
        addon: '样例数据'
      }],
      searchorItems: [],
      modal: {
        show: false
      }
    }
  },
  methods: {
    addSearchorItem () {
      this.modal.show = true
    },
    searchorItemConfirm (compName, componentInfo) {
      this.searchorItems.push(utils.clone(componentInfo))
    }
  }
}
</script>
