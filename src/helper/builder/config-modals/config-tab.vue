<template>
  <a-modal
    v-if="modal.show"
    v-model="modal.show"
    title="编辑"
    width="60%"
    @ok="editConfirm"
  >
    <a-form>
      <a-row>
        <a-col :span="24">
          <a-form-item label="页签名" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-input v-model="modal.data.tabName" />
          </a-form-item>
        </a-col>
        <a-col v-if="modal.data.type === '0'" :span="24">
          <a-form-item label="角色查看权限" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-radio-group v-model="modal.data.permission.roles">
              <a-radio value="0">全部</a-radio>
              <a-radio value="1">内部</a-radio>
              <a-radio value="2">外部</a-radio>
            </a-radio-group>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row :span="24">
        <a-col>
          <a-form-item :label="modal.data.type === '0' ? '列表接口' : '详情数据接口'" :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <a-row>
              <a-col :span="18">
                <a-input placeholder="/api/xxx/xxx" v-model="modal.data.api.url" />
              </a-col>
              <a-col :span="6">
                <a-select placeholder="请选择" v-model="modal.data.api.method">
                  <a-select-option value="GET">GET</a-select-option>
                  <a-select-option value="POST">POST</a-select-option>
                  <a-select-option value="PUT">PUT</a-select-option>
                  <a-select-option value="DELETE">DELETE</a-select-option>
                </a-select>
              </a-col>
            </a-row>
          </a-form-item>
        </a-col>
      </a-row>
      <a-row v-if="modal.data.type === '0'">
        <a-col :span="24">
          <a-form-item :label-col="{span: 6}" :wrapper-col="{span: 16}">
            <template slot="label">
              数据路径
              <a-tooltip title="接口返回的数据的路径，比如：data.records.list，就可以设置为'records.list'">
                <span><a-icon type="question-circle-o" /></span>
              </a-tooltip>
            </template>
            <a-input v-model="modal.data.api.dataDir" />
          </a-form-item>
        </a-col>
      </a-row>
      <CustomParams v-model="modal.data.api.customParams" />
    </a-form>
  </a-modal>
</template>
<script>
// import utils from '@/utils'
import mixins from '@builder/mixins'
import CustomParams from '@builder/config-modules/custom-params'
export default {
  mixins,
  components: {
    CustomParams
  },
  props: {
    modal: {
      type: Object,
      default: () => ({})
    }
  },
  data () {
    return {
    }
  },
  methods: {
    editConfirm () {
      const { api, type, rank } = this.modal.data
      if (api.url) {
        const key = type === '0' ? 'list' : 'detail'
        const label = type === '0' ? '列表' : '详情'
        const data = { [key]: { ...api, key, label } }
        this.handupApimap(rank, data)
      }
      this.$emit('update', this.modal.data)
      this.modal.show = false
    },
    handupApimap (rank, data) {
      // Vue.bus.$emit('__apimap__', rank, data)
      this.setViewData({ key: 'apimap', index: rank, value: data })
      this.setBuildData({ key: 'apimapConfig', index: rank, value: data })
    },
    handup (data) {
      this.setViewData({ key: 'tabs', value: data })
      this.setBuildData({ key: 'tabsConfig', value: data })
      // Vue.bus.$emit('__tabs__', data)
    }
  }
}
</script>
<style lang="less" scoped>
.tab-item {
  position: absolute;
  top: -0.5rem;
  height: 1rem;
}
.tab-edit {
  top: 0.5rem;
}
.tab-title {
  padding: 0 0.8rem 0 0;
}
.warn {
  color: red;
}
</style>
