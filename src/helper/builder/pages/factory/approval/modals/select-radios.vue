<template>
  <a-modal
    title="配置"
    v-model="modal.show"
    @ok="confirm"
  >
    <a-checkbox-group style="width: 100%;" v-model="checkedKeys" @change="checkboxChanged">
      <a-row :span="24">
        <a-col v-for="(item,index) in checkboxItems" :span="6" :key="index">
          <a-checkbox :value="item.key">
            {{ item.label }}
          </a-checkbox>
        </a-col>
      </a-row>
    </a-checkbox-group>
  </a-modal>
</template>
<script>
import utils from '@/utils'
export default {
  props: {
    modal: {
      type: Object
    }
  },
  data () {
    return {
      checkedKeys: [],
      checkboxItems: [
        // {
        //   key: '1',
        //   value: '1',
        //   label: '通过'
        // },
        // {
        //   key: '2',
        //   value: '2',
        //   label: '驳回'
        // },
        // {
        //   key: '3',
        //   value: '3',
        //   label: '不通过'
        // },
        // {
        //   key: '8',
        //   value: '8',
        //   label: '转审'
        // },
        // {
        //   key: '9',
        //   value: '9',
        //   label: '撤销'
        // },
        // {
        //   key: '10',
        //   value: '10',
        //   label: '撤回'
        // }
      ]
    }
  },
  watch: {
    modal: {
      handler ({ data, show }) {
        if (show) {
          if (data && utils.isArray(data)) {
            this.checkedKeys = data.filter((item) => item.show).map((item) => item.key)
            this.checkboxItems = utils.clone(data)
          }
        } else {
          this.checkedKeys = []
        }
      },
      deep: true,
      immediate: true
    }
  },
  methods: {
    checkboxChanged (a, b) {
      console.log(a, b)
    },
    confirm () {
      this.modal.show = false
      this.checkboxItems.forEach((item) => {
        item.show = this.checkedKeys.includes(item.key)
      })
      this.$emit('update', utils.clone(this.checkboxItems))
    }
  }
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
