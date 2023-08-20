import Vue from 'vue'
Vue.directive('flexible-search-items', {
  inserted: function (dom) {
    const searchNodes = dom.querySelectorAll('.ant-form-item')
    if (searchNodes.length <= 4) return false
    const SwitchButton = createFlexSwitchButton(searchNodes)
    const instance = new SwitchButton().$mount()
    const firstButton = dom.querySelector('.ant-btn')
    const operatorBar = firstButton ? firstButton.parentNode : undefined
    operatorBar && operatorBar.appendChild(instance.$el)
    !operatorBar && new Error('directives/flexible-search-items: 找不到搜索按钮！')
  },
  unbind: function (operator) {}
})

function createFlexSwitchButton (searchNodes) {
  return Vue.extend({
    data () {
      return { iswitch: true }
    },
    methods: {
      doSwitch () {
        this.iswitch = !this.iswitch
        searchNodes.forEach((node, index) => {
          const searchItemColNode = node.parentNode
          if (this.iswitch) {
            searchItemColNode.style.display = 'block'
          }
          if (!this.iswitch && index >= 4) {
            searchItemColNode.style.display = 'none'
          }
        })
      }
    },
    render (h) {
      return <a
        id="flexibleSearchItemsSwitch"
        style="color: #999; font-size: 0.8rem; margin-left: 0.5rem;"
        onClick={ this.doSwitch }
      >
        { this.$t(this.iswitch ? '收起' : '展开') }
        <a-icon style={{ transform: this.iswitch ? 'rotate(270deg)' : 'rotate(90deg)' }} tyle="double-right" />
      </a>
    }
  })
}