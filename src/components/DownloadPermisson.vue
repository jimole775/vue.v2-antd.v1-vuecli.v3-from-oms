<template>
  <div style="display: inline">
    <a-tooltip>
      <template slot="title">
        导出
      </template>
      <a-button class="cir-button" @click="sniffExports" />
    </a-tooltip>
    <Phonevalidate ref="PhonevalidateRef" />
  </div>
</template>
<script>
import { getToken } from '@/utils/auth'
// import api from '@/api'
import axios from 'axios'
import Vue from 'vue'
import Phonevalidate from '@/components/Phonevalidate'
export default {
  name: 'DownloadPermisson',
  components: {
    Phonevalidate
  },
  props: {
    value: {
      type: String,
      default: ''
    },
    api: {
      type: String,
      default: ''
    },
    params: {
      type: Object,
      default: null
    }
  },
  data () {
    return {
      xToken: getToken()
    }
  },
  computed: {
    userRole () {
      return this.$store.state.global.userRole
    }
  },
  methods: {
    async sniffExports () {
      this.$refs.PhonevalidateRef.validate(axios, {
        method: 'post',
        url: this.api,
        data: this.params,
        responseType: 'blob',
        headers: { 'x-token': getToken() }
      }).then((res) => {
        if (!res) return
        try {
          // 转成文件流，主要为了兼容下载接口
          const blob = new Blob([res.data], { type: 'application/octet-stream' })
          // 无需校验，直接下载文件
          const link = document.createElement('a')
          const fileName = decodeURI(res.headers['content-disposition'].split(';')[1].split('=')[1])
          link.style.display = 'none'
          link.href = URL.createObjectURL(blob)
          link.setAttribute('download', fileName)
          document.body.appendChild(link)
          link.click()
          document.body.removeChild(link)
        } catch (error) {
          this.$modal.error({
            title: '下载失败',
            content: error.toString()
          })
        }
      })
    }
  }
}
</script>
