<template>
  <Panel>
    <template slot="example">
      <Sentence :content="text" />
    </template>
    <template slot="desc-title">
      行末省略
    </template>
    <template slot="desc">
      默认配置，默认行长度20，行末省略
    </template>
    <template slot="code">
      <pre>
        <code>
          {{ code }}
        </code>
      </pre>
    </template>
  </Panel>
</template>
<script>
import Panel from '@/helper/examples/common/panel.vue'
export default {
  title: '行末省略',
  name: 'Example1',
  components: {
    Panel
  },
  data () {
    return {
      code: `
        <template>
          <Sentence :content="text" :len="20" />
        <\/template>
        <script>
        export default {
          components: {
            STable
          },
          data () {
            return {
              text: \`
                超过20个字省略超过20个字省略超过20个字省略超过20个字省略超过20个字省略超过20个字省略
                遇到换行符，正常换行，而不是空格
              \`
            }
          }
        }
        <\/script>
      `,
      text: `
        超过20个字省略超过20个字省略超过20个字省略超过20个字省略超过20个字省略超过20个字省略
        遇到换行符，正常换行，而不是空格
      `
    }
  }
}
</script>
