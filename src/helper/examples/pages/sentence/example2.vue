<template>
  <Panel>
    <template slot="example">
      <Sentence :content="text" :len="20" line-end="break" />
    </template>
    <template slot="desc-title">
      行末换行
    </template>
    <template slot="desc">
      自定义配置
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
  title: '行末换行',
  name: 'Example2',
  components: {
    Panel
  },
  data () {
    return {
      code: `
        <template>
          <Sentence :content="text" :len="20" line-end="break" />
        <\/template>
        <script>
        export default {
          components: {
            STable
          },
          data () {
            return {
              text: \`
                超过20个字换行超过20个字换行超过20个字换行超过20个字换行超过20个字换行
                遇到换行符，正常换行，而不是空格
              \`
            }
          }
        }
        <\/script>
      `,
      text: `
        超过20个字换行超过20个字换行超过20个字换行超过20个字换行超过20个字换行
        遇到换行符，正常换行，而不是空格
      `
    }
  }
}
</script>
