
<template>
  <a-select
    v-model="value"
    label-in-value
    :allow-clear="true"
    :placeholder="placeholder"
    @change="handleChange"
  >
    <a-select-option v-for="item in regionList" :key="item.key" :title="item.label">
      {{ item.label }}
    </a-select-option>
  </a-select>
</template>

<script>
import api from '@/api'
export default {
  title: '工作地选择（内联）',
  name: 'WorkPlaceInnerSelect',
  forBuilder: true,
  props: {
    prNo: {
      type: String,
      default: ''
    },
    disabled: {
      type: Boolean,
      default: false
    },
    placeholder: {
      type: String,
      default: '请选择'
    },
    initialValue: {
      type: String,
      default: ''
    },
    mode: {
      type: String,
      default: 'default'
    },
    value: {
      type: Object,
      default: () => ({})
    },
    format: {
      type: String,
      default: 'xyz'
    }
  },
  model: {
    prop: 'value',
    event: 'change'
  },
  data () {
    return {
      orgCode: '',
      regionList: []
    }
  },
  watch: {
    prNo: {
      handler (val) {
        if (val) {
          this.getOrgCode(val)
        }
      },
      immediate: true
    }
  },
  methods: {
    async getOrgCode (prNo) {
      const res = await api.recuitmentResumeListByPR({ prNo })
      if (res.code === 200) {
        this.orgCode = res.data.tenantCode
        this.getRegionList()
      }
    },
    // 获取所有地域
    getRegionList () {
      if (this.orgCode) {
        api.postregionfindRegionList({ orgCode: this.orgCode }).then((res) => {
          if (res.code === 200) {
            this.regionList = res.data.map((item) => {
              const zhCity = this.format.includes('x') ? item.region : ''
              const zhPlace = this.format.includes('y') ? '，' + item.workingPlace : ''
              const zhDelivery = this.format.includes('z') ? '，' + item.deliveryType : ''
              const enCity = this.format.includes('x') ? item.cityCode : ''
              const enPlace = this.format.includes('y') ? ',' + item.workPlaceCode : ''
              const enDelivery = this.format.includes('z') ? ',' + item.deliveryTypeCode : ''
              return {
                key: `${enCity}${enPlace}${enDelivery}`,
                label: `${zhCity}${zhPlace}${zhDelivery}`
              }
            })
          }
        })
      }
    },
    handleChange (value) {
      this.$emit('change', value)
    }
  }
}
</script>
