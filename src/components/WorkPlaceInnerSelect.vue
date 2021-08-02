
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
  name: 'WorkPlaceInnerSelect',
  props: {
    dataSource: {
      type: Object,
      default: () => ({})
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
    dataSource: {
      handler (data) {
        if (data.prNo) {
          this.getOrgCode(data.prNo)
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
              // area: "一类区域"
              // cityCode: "10002"
              // deliveryType: "在岸"
              // deliveryTypeCode: "di_delivery_on"
              // hrAccount: null
              // hrName: null
              // orgCode: "oppo"
              // region: "深圳"
              // sscAccount: null
              // sscName: null
              // workPlaceCode: "di_office_chunsun"
              // workingPlace: "春笋"
              return {
                key: `${item.cityCode},${item.workPlaceCode},${item.deliveryTypeCode}`,
                label: `${item.region}，${item.workingPlace}，${item.deliveryType}`
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
