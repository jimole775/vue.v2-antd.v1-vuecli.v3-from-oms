<template>
  <span>
    <a-upload
      name="file"
      accept=".xls, .xlsx"
      :before-upload="beforeUpload"
      :file-list="fileList"
      class="import-button"
    >
      <a-tooltip>
        <template slot="title">导入</template>
        <a-button
          class="cir-button button-import"
        />
      </a-tooltip>
    </a-upload>
    <a-tooltip v-if="templateApi">
      <template slot="title">导入模板下载</template>
      <a-button
        @click="downLoadTemplate"
        class="cir-button button-import-template-down"
      />
    </a-tooltip>
  </span>
</template>

<script>
import utils from '@/utils'
import api from '@/api'
export default {
  title: '导入',
  name: 'ImportExcel',
  props: {
    api: {
      type: String
    },
    templateApi: {
      type: String
    }
  },
  data () {
    return {
      fileList: []
    }
  },
  computed: {
    supportSeries () {
      const dicts = this.$store.getters.getDictByGroupCode('upload_file_suffix_while_list')
      const supports = dicts.map((item) => {
        return '.' + item.itemCode
      })
      return this.accept ? this.accept : supports.join(',')
    }
  },
  methods: {
    getApiFunction (apiNameOrFunction) {
      if (utils.isFunction(apiNameOrFunction)) {
        return apiNameOrFunction
      }
      if (utils.isString(apiNameOrFunction)) {
        return api[apiNameOrFunction] || function () {}
      }
      if (utils.isUndefined(apiNameOrFunction)) {
        return function () {}
      }
    },
    // 导入
    async beforeUpload (file) {
      const pass = utils.verifyUploadType(file.name, this.supportSeries)
      if (!pass) return false
      if (!this.api) return false
      const params = new FormData()
      params.append('file', file)
      const res = await this.getApiFunction(this.api)(params)
      if (res.code === 200) {
        this.$message.success('导入成功')
        // this.fetchData()
        this.$emit('update', res.data)
      } else {
        this.$modal.warning({
          title: '提示',
          okText: '确定',
          content: res.message
        })
      }
      return false
    },
    downLoadTemplate () {
      this.templateApi && this.getApiFunction(this.templateApi)()
    }
  }
}
</script>
<style lang="less" scoped>
.import-button {
  display: inline-block;
  padding: 0 1rem 0 0;
  vertical-align: top;
}
</style>
