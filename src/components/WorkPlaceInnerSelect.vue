
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
    getRegionList () {
      if (this.orgCode) {
        api.postregionfindRegionList({ orgCode: this.orgCode }).then((res) => {
          if (res.code === 200) {
            this.regionList = res.data.map((item) => {
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
