<template>
  <Panel :code="code" title="时间选择">
    <template slot="example">
      <DatetimePicker v-model="dataSource.time" />
      <br>
      <br>
      <a-button type="primary" @click="submitEvent">提交</a-button>
    </template>
  </Panel>
</template>
<script>
import DatetimePicker from '@/components/DatetimePicker'
import code from './code.md'
import moment from 'moment'
export default {
  title: '时间选择',
  name: 'Example1',
  components: {
    DatetimePicker
  },
  data () {
    return {
      code,
      dataSource: {
        time: ''
      }
    }
  },
  methods: {
    async submitEvent () {
      let date = null
      if (this.dataSource.time) {
        date = moment(this.dataSource.time).format('YYYY-MM-DD HH:mm')
      }
      this.$modal.success({
        title: '操作结果',
        content: JSON.stringify({ date })
      })
    }
  }
}
</script>
