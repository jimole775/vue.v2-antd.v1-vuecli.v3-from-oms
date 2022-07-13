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
    </a-form>
  </a-modal>
</template>
<script>
import builder from '@builder/mixins/builder'
export default {
  mixins: [builder],
  props: {
    modal: {
      type: Object,
      default: () => ({})
    }
  },
  methods: {
    editConfirm () {
      this.$emit('update', this.modal.data)
      this.modal.show = false
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
