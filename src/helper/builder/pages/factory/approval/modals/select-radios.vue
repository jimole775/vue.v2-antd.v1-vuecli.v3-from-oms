<template>
  <a-modal
    title="配置"
    v-model="modal.show"
    @ok="confirm"
  >
    <a-checkbox-group style="width: 100%;" v-model="checkedKeys" @change="checkboxChanged">
      <a-row :span="24">
        <a-col v-for="(item,index) in checkedItems" :span="6" :key="index">
          <a-checkbox :value="item.value">
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
      checkedItems: [
        {
          value: '1',
          label: '通过'
        },
        {
          value: '2',
          label: '驳回'
        },
        {
          value: '3',
          label: '不通过'
        },
        {
          value: '8',
          label: '转审'
        },
        {
          value: '9',
          label: '撤销'
        },
        {
          value: '10',
          label: '撤回'
        }
      ]
    }
  },
  watch: {
    modal: {
      handler ({ data, show }) {
        if (show) {
          if (data && utils.isArray(data)) {
            this.checkedKeys = data.map((item) => item.value)
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
      const selectItems = this.checkedItems.filter((i) => this.checkedKeys.includes(i.value))
      if (this.modal.data) {
        selectItems.forEach((si) => {
          this.modal.data.forEach((da) => {
            if (si.value === da.value) {
              si = utils.clone(da)
            }
          })
        })
      }
      this.$emit('update', selectItems)
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
