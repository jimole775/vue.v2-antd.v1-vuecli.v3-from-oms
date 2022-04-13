<template>
  <a-locale-provider :locale="locale">
    <router-view />
  </a-locale-provider>
</template>
<script>
import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
import watermark from 'watermark-dom'
import { getOMSJump, removeOMSJump } from '@/utils/auth'
import jumper from '@/utils/jumper'
import utils from '@/utils'
export default {
  data () {
    return {
      locale: zhCN
    }
  },
  computed: {
    user () {
      return this.$store.state.global.user
    },
    userRole () {
      return this.$store.state.global.userRole
    }
  },
  watch: {
    user (val) {
      if (val) {
        this.createWatermark(val)
      }
    }
  },
  created () {
    // 处理外部链接跳转
    this.extractJump()
  },
  methods: {
    extractJump () {
      const jumpdata = getOMSJump()
      if (jumpdata && jumpdata.length > 2) {
        removeOMSJump()
        const params = utils.isJSONString(jumpdata) ? JSON.parse(jumpdata) : jumpdata
        jumper.go(params)
      }
    },
    createWatermark ({ employeeNumber }) {
      this.$nextTick(() => {
        watermark.init({
          watermark_txt: `${employeeNumber || '未登录'} ${utils.date2YMDHM(new Date())}`,
          watermark_x: -80, // 水印起始位置x轴坐标
          watermark_y: -50, // 水印起始位置Y轴坐标
          watermark_color: '#A0A4AC', // 水印字体颜色
          watermark_fontsize: '15px', // 水印字体大小
          watermark_alpha: 0.12, // 水印透明度，要求设置在大于等于0.005
          watermark_angle: 30, // 水印倾斜度数
          watermark_width: 25 * 15, // 水印宽度
          watermark_height: 130, // 水印长度
          watermark_x_space: 30, // 水印x轴间隔
          watermark_y_space: 50, // 水印y轴间隔
          watermark_parent_node: 'body'
        })
      })
    }
  }
}
</script>
<style lang="less">
#app {
  font-family: "Microsoft YaHei", Helvetica, Arial, sans-serif;
  font-size: 12px;
  color: #333333;
  background-color: #f2f4f8;
  height: 100%;
}
body {
  overflow: hidden;
}
</style>
<style>
.over_lot{
  overflow: hidden;
  white-space: nowrap;
  text-overflow: ellipsis;
  display: block;
}

table tbody tr td {
  white-space: nowrap;
}
</style>
