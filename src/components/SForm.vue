<!--
 * @ Author: Your name
 * @ Create Time: 2024-04-18 01:31:40
 * @ Modified by: Your name
 * @ Modified time: 2024-04-27 20:18:52
 * @ Description:
 -->

<script>
import utils from '@/utils'
import { Flow } from '@/utils/flow'
let formDataStore = {}
let formStageStore = {}
const layout8 = {
    span: 8,
    label: 9,
    wrapper: 15
}
const layout6 = {
    span: 6,
    label: 10,
    wrapper: 14
}
const createMap = () => Object.create(null)
export default {
    name: 'SForm',
    props: {
        dataSource: {
            type: Object,
            default: () => ({})
        },
        formItems: {
            type: Array,
            default: () => []
        },
        bridge: {
            type: Object,
            default: () => ({})
        },
        queryEmptyFields: {
            type: Object,
            default: () => ([])
        },
        mode: {
            type: String,
            default: 'edit'
        },
        validator: {
            type: Function,
            default: undefined
        },
        layout: {
            type: Object,
            default: () => undefined
        },
        keepAlive: {
            type: Boolean,
            default: false
        }
    },
    data () {
        return {
            scope: this,
            flow: new Flow(500),
            formStage: createMap(),
            onceMap: createMap(),
            form: this.configForm(),
            formItemNodeMap: {}
        }
    },
    watch: {
        dataSource: {
            handler (data) {
                data && Object.keys(data).forEach(key => {
                    const formItem = this.$props.formItems.find(i => i.key === key || i.keys.includes(key))
                    if (!formItem) return false
                    this.$updateFormItem(formItem)
                })
            },
            immediate: true
        }
    },
    created () {
        this.initialize()
        this.keepAlive && this.rollbackFromStore()
    },
    methods: {
        getLiveFormItems () {
            return utils.clone(this.$props.formItems)
            .map(item => this.formatItem(item))
            .filter(item => this.isCanShow(item))
        },
        $reset () {
            this.initialize()
            this.clearOnceMap()
            this.clearStore(this.getFields())
        },
        $resetAll () {
            this.initialize()
            this.clearOnceMap()
            this.clearStore()
        },
        clearOnceMap () {
            this.onceMap = createMap()
        },
        getValueFormStore (keyOrItem) {
            let formValue, sourceValue, stage = 0
            if (utils.isString(keyOrItem)) {
                formValue = formDataStore[keyOrItem]
                sourceValue = this.$props.dataSource[keyOrItem]
                stage = formStageStore[keyOrItem]
            } else {
                if (keyOrItem.key) {
                    formValue = formDataStore[keyOrItem.key]
                    sourceValue = this.$props.dataSource[keyOrItem.key]
                    stage = formStageStore[keyOrItem.key]
                }
                if (keyOrItem.keys) {
                    formValue = keyOrItem.keys.map(k => formDataStore[k])
                    sourceValue = keyOrItem.keys.map(k => this.$props.dataSource[k])
                    // todo stage 绑定到keys上?
                    stage = formStageStore[keyOrItem.keys[0]]
                }
            }
            return stage === 1 ? formValue : utils.isValuable(formValue) ? formValue : sourceValue
        },
        isInScopeForm (keyOrItem) {
            const fields = this.getFields()
            let keys = []
            if (utils.isString(keyOrItem)) {
                keys.push(keyOrItem)
            }
            if (utils.isObject(keyOrItem)) {
                keys = [keyOrItem.key, ...(keyOrItem?.keys || [])]
            }
            return !!fields.find(f => keys.includes(f))
        },
        rollbackFromStore () {
            this.$nextTick(() => {
                const fields = this.getFields()
                fields.forEach(key => {
                    if (utils.isValuable(formDataStore[key])) {
                        this.$updateValue(key, formDataStore[key])
                    }
                })
            })
        },
        clearStore (fields) {
            if (fields) {
                Object.keys(formDataStore).forEach(key => {
                    if (fields.includes(key)) {
                        delete formDataStore[key]
                    }
                })
                Object.keys(formStageStore).forEach(key => {
                    if (fields.includes(key)) {
                        delete formStageStore[key]
                    }
                })
            } else {
                formDataStore = createMap()
                formStageStore = createMap()
            }
        },
        cacheFormData (keyOrItem, value) {
            if (utils.isString(keyOrItem)) {
                formDataStore[keyOrItem] = value
            }
            if (utils.isObject(keyOrItem)) {
                Object.entries(keyOrItem).forEach(([key, val]) => {
                    formDataStore[key] = val
                })
            }
            if (utils.isArray(keyOrItem)) {
                keyOrItem.forEach(key => {
                    formDataStore[key] = value
                })
            }
        },
        configForm () {
            return this.$form.createForm(this, {
                // 手动变更 和 form.setFieldsValue 都会触发 onValueChange
                onValuesChange: (props, changedItem, formValues) => {
                    this.updateFormStage(Object.keys(changedItem), 1)
                    this.cacheFormData(changedItem)
                    this.$nextTick(() => {
                        this.$emit('update', changedItem, this.form.getFieldsValue())
                    })
                },

            })
        },
        initialize () {
            this.updateFormStage(0)
        },
        getFields () {
            const formItems = this.$props.formItems
            const fields = []
            formItems.forEach(item => {
                if (item.key) {
                    fields.push(item.key)
                }
                if (item.keys) {
                    fields.push(...item.keys)
                }
            })
            return fields
        },
        getReadonlyValue (formItem) {
            const data = this.$props.dataSource || {}
            let val = ''
            if (formItem.key) {
                val = data[formItem.key]
            }
            if (formItem.keys) {
                const splitSign = formItem.separator || '、'
                val = formItem.keys.map(k => data[k]).filter(Boolean).join(splitSign)
            }
            if (formItem.vkey) {
                val = data[formItem.vkey]
            }
            if (utils.isNone(val)) {
                val = formItem.value || formItem.default
            }
            return val
        },
        updateFormStage (field, sign) {
            // 1. 如果 field 是一个数字，那么就变更所有字段的状态
            if (utils.isNumber(field)) {
                sign = field
                const fields = this.getFields()
                fields.forEach(key => this.setFieldStage(key, sign))
            }
            // 2. 如果 field 是一个字符串，那么就变更单个字段的状态
            if (utils.isString(field)) {
                this.setFieldStage(field, sign)
            }
            // 3. 如果 field 是一个数组，那么数组中每个字段的状态都会变更
            if (utils.isArray(field)) {
                field.forEach(key => this.setFieldStage(key, sign))
            }
            // 4. 如果 field 是一个对象，那么就变更对象中每个字段的状态
            if (utils.isObject(field)) {
                Object.entries(field).forEach(([key, sign]) => {
                    this.setFieldStage(key, sign)
                })
            }
        },
        setFieldStage (key, sign) {
            this.formStage[key] = sign
            formStageStore[key] = sign
        },
        getFieldStage (key) {
            if (this.isInScopeForm(key)) {
                return this.formStage[key]
            } else {
                return formStageStore[key]
            }
        },
        inFieldStage (key, signs) {
            if (!utils.isArray(signs)) {
                signs = [signs]
            }
            if (this.isInScopeForm(key)) {
                return signs.includes(this.formStage[key])
            } else {
                return signs.includes(formStageStore[key])
            }
        },
        $validate () {
            const fieldsValue = this.form.getFieldsValue()
            const hasNotEmpty = this.getEmptyTips(fieldsValue).length === 0
            const hasNotError = utils.isEmptyObject(this.form.getFieldsError())
            if (this.$props.validator) {
                return this.$props.validator(fieldsValue, this.scope) && hasNotEmpty && hasNotError
            } else {
                return hasNotEmpty && hasNotError
            }
        },
        $validateFields () {
            return this.form.validateFields()
        },
        $getTips () {
            this.$validateFields()
            const fieldsValue = this.form.getFieldsValue()
            return this.getEmptyTips(fieldsValue)
        },
        getEmptyTips (fieldsValue) {
            const tips = []
            // 操作模块的必填字段验证
            const liveFormItems = this.getLiveFormItems()
            for (let i = 0; i < liveFormItems.length; i++) {
                const formItem = liveFormItems[i]
                // 只有在 required 和 show 和 edit 都为 true 的时候，才会验证必填字段
                if (formItem.required && formItem.show && formItem.edit) {
                    if (formItem.keys) {
                        if (isEmptyFromKeys(formItem.keys) && isEmptyFromParams(formItem.params)) {
                            tips.push(this.$t('请确认 {0}', formItem.label))
                            break
                        }
                    } else {
                        if (isEmptyFromKey(formItem.key) && isEmptyFromParams(formItem.params)) {
                            tips.push(this.$t('请确认 {0}', formItem.label))
                            break
                        }
                    }
                }
            }
            return tips
            function isEmptyFromKey (key) {
                return hasEmpty(fieldsValue[key])
            }
            function isEmptyFromKeys (keys) {
                return keys.some(key => hasEmpty(fieldsValue[key]))
            }
            function isEmptyFromParams (params) {
                return hasEmpty(params)
            }
            function hasEmpty (value) {
                if (utils.isArray(value) && value.length > 0) {
                    return value.filter(i => utils.isValuable(i)).length !== value.length
                } else {
                    return utils.isEmpty(value)
                }
            }
        },
        $bindRules (i, initval, validator) {
            const defaultRules = [i.key, {
                initialValue: utils.isValuable(initval) ? initval : this.$getValue(i),
                rules: [{
                    required: i.required,
                    message: this.$t('请确认 {0}', i.label)
                }]
            }]
            const _valid = validator || i.validator
            if (utils.isObject(_valid)) defaultRules[1].rules.push(_valid)
            if (utils.isArray(_valid)) defaultRules[1].rules = defaultRules[1].rules.concat(_valid)
            if (utils.isFunction(_valid)) defaultRules[1].rules.push({ validator: (rule, value, callback) => _valid(rule, value, callback, this.scope) })
            return defaultRules
        },
        $getValue (keyOrItem) {
            if (!this.isInScopeForm(keyOrItem)) {
                return this.getValueFormStore(keyOrItem)
            }
            let formItem = this.$getFormItem(keyOrItem)
            if (utils.isString(keyOrItem)) {
                formItem = utils.clone(formItem)
                formItem.key = keyOrItem
            }
            return this.evalValue(formItem)
        },
        evalValue (formItem) {
            // 编辑状态，使用 当前表单的值，进行赋值
            if (this.inFieldStage(formItem.key, 1)) {
                const formData = this.form.getFieldsValue()
                return formData[formItem.key]
            }
            // 初始状态，使用 默认值 进行赋值
            if (this.inFieldStage(formItem.key, [0, undefined])) {
                const defVal = utils.isFunction(formItem.default) ? formItem.default(formItem, this.scope) : formItem.default
                // todo default 的配置逻辑，应该是把结果挂载到 dataSource 上面
                return utils.isValuable(defVal) ? defVal : this.$props.dataSource?.[formItem.key]
            }
        },
        $setValue (keyOrItem, value) {
            this.$updateValue(keyOrItem, value)
        },
        // todo 更新 formItem 的属性
        $updateFormItem (keyOrItem, prop, val) {
            const formItem = this.$getFormItem(keyOrItem)
            const symbol = this.evalFormItemSymbol(formItem)
            this.$set(this.formItemNodeMap, symbol, null)
            if (utils.isString(prop)) {
                this.$set(formItem, prop, val)
            }
            if (utils.isObject(prop)) {
                Object.entries(prop).forEach(([k, v]) => {
                    this.$set(formItem, k, v)
                })
            }
        },
        // 指定更新某一个字段
        $updateValue (keyOrItem, value) {
            const formItem = this.$getFormItem(keyOrItem)
            const curValue = this.$getValue(formItem)
            const setValue = (k, v) => {
                this.form.setFieldsValue({ [k]: v })
            }
            if (utils.toString(curValue) !== utils.toString(value)) {
                formItem.oldValue = curValue
                formItem.value = value
                if (formItem.keys) {
                    formItem.keys.forEach((key, index) => {
                        setValue(key, value[index])
                    })
                }
                if (formItem.key) {
                    setValue(formItem.key, value)
                }
            }
        },
        $getValues () {
            const fieldsVal = this.form.getFieldsValue()
            const liveFormItems = this.getLiveFormItems()
            return this.getFormItemsValue(fieldsVal, liveFormItems)
        },
        $getFormItem (keyOrItem) {
            const formItem = utils.isObject(keyOrItem)
                ? keyOrItem
                : this.$props.formItems.find(i => {
                    const keys = [i.key, ...(i.keys || [])]
                    return keys.includes(keyOrItem)
                })
            return formItem
        },
        // 执行一次函数
        $execOnce (fn, ...params) {
            if (utils.isNone(fn)) return 
            if (!this.onceMap[fn]) {
                this.onceMap[fn] = true
                return fn.apply(fn, params)
            }
        },
        // 禁用执行，让 $execOnce 失效
        $disableOnce (fn) {
            if (utils.isNone(fn)) return
            this.onceMap[fn] = true
        },
        // 重新允许执行，让 $execOnce 生效
        $enableOnce (fn) {
            if (utils.isNone(fn)) return
            this.onceMap[fn] = false
        },
        evalFormItemSymbol (formItem) {
            return formItem.key || formItem.keys?.join('.')
        },
        labelRender (h, formItem) {
            const symbol = this.evalFormItemSymbol(formItem)
            let labelNode = null
            if (this.formItemNodeMap[symbol]?.label) return this.formItemNodeMap[symbol].label
            if (!this.formItemNodeMap[symbol]) this.formItemNodeMap[symbol] = createMap()
            if (formItem.hasOwnProperty('label')) {
                const children = [this.$t(formItem.label)]
                if (formItem.description) {
                    children.push(<ATooltip style="margin-left: 0.5rem;" title={formItem.description}>
                        <a-icon type="question-circle-o" />
                    </ATooltip>)
                }
                labelNode = h('span', { class: 'label' }, children)
            }
            if (formItem.hasOwnProperty('labelRender')) {
                labelNode = <span slot="label">{formItem.labelRender(h, formItem, this.scope)}</span>
            }
            if (labelNode) {
                this.formItemNodeMap[symbol]?.label = labelNode
            }
            return labelNode
        },
        wrapperRender (h, formItem) {
            let wrapperNode
            const symbol = this.evalFormItemSymbol(formItem)
            if (this.formItemNodeMap[symbol]?.wrapper) return this.formItemNodeMap[symbol].wrapper
            if (!this.formItemNodeMap[symbol]) this.formItemNodeMap[symbol] = createMap()
            if (formItem.wrapperRender) {
                if (utils.isFunction(formItem.wrapperRender)) {
                    return formItem.wrapperRender(this.$createElement, formItem, this.scope)
                } else if (utils.isObject(formItem.wrapperRender)) {
                    const { handler, viewer } = formItem.wrapperRender
                    if (viewer && formItem.mode === 'readonly') {
                        wrapperNode = viewer(this.$createElement, formItem, this.scope)
                    }
                    if (handler && formItem.mode === 'edit') {
                        wrapperNode = handler(this.$createElement, formItem, this.scope)
                    }
                } else {
                    return new Error('wrapperRender must be a function or object')
                }
            } else if (formItem.component && formItem.mode === 'edit') {
                const vDecorator = [formItem.key, {
                    initialValue: this.$getValue(formItem),
                    rules: [{ required: formItem.required, message: this.$t('请确认') }]
                }]
                const _valid = formItem.validator
                if (utils.isObject(_valid)) vDecorator[1].rules.push(_valid)
                if (utils.isArray(_valid)) vDecorator[1].rules = vDecorator[1].rules.concat(_valid)
                if (utils.isFunction(_valid)) vDecorator[1].rules.push({ validator: (r, v, c) => _valid(r, v, c, this.scope), trigger: 'change' })
                const props = utils.isFunction(formItem.props) ? formItem.props(formItem, this.scope) : formItem.props
                const attrs = utils.isFunction(formItem.attrs) ? formItem.attrs(formItem, this.scope) : formItem.attrs
                const domProps = utils.isFunction(formItem.domProps) ? formItem.domProps(formItem, this.scope) : formItem.domProps
                const events = this.evalEvents(formItem, this.scope)
                wrapperNode = h(formItem.component, {
                    props,
                    attrs,
                    domProps,
                    on: events,
                    directives: [{ name: 'decorator', value: vDecorator }]
                })
            } else {
                wrapperNode = h(
                    'span',
                    {
                        props,
                        attrs,
                        domProps
                    },
                    this.getReadonlyValue(formItem)
                )
            }
            if (wrapperNode) {
                this.formItemNodeMap[symbol]?.wrapper = wrapperNode
            }
            return wrapperNode
        },
        evalEvents (formItem, scope) {
            const eventmap = createMap()
            if (!formItem.on) return eventmap
            Object.keys(formItem.on).forEach(key => {
                eventmap[key] = (...args) => {
                    const fn = formItem.on[key]
                    if (utils.isFunction(fn)) {
                        fn(...args, formItem, scope)
                    }
                }
            })
            return eventmap
        },
        evalColonSign (formItem, labelNode) {
            if (formItem.hasOwnProperty('label')) {
                if (formItem?.label?.length) return ''
            } else if (labelNode) return ':'
        },
        formatItem (item) {
            if (item.show === undefined) this.$set(item, 'show', true)
            if (item.required === undefined) this.$set(item, 'required', false)
            if (item.layout === undefined) this.$set(item, 'layout', this.$props.layout)
            if (item.mode === undefined) this.$set(item, 'mode', this.$props.mode)
            if (item.params === undefined) this.$set(item, 'params', {})
            if (item.$getValue === undefined) this.$set(item, '$getValue', () => this.$getValue(item))
            if (item.$setValue === undefined) this.$set(item, '$setValue', (val) => this.$setValue(item, val))
            if (item.$updateValue === undefined) this.$set(item, '$updateValue', (val) => this.$updateValue(item, val))
            if (item.$bindRules === undefined) this.$set(item, '$bindRules', (init, valid) => this.$bindRules(item, init, valid))
            if (item.$updateFormItem === undefined) this.$set(item, '$updateFormItem', (prop, val) => this.$updateFormItem(item, prop, val))
            return item
        },
        isCanShow (formItem) {
            let show = formItem.show
            const values = formItem.mode === 'readonly' ? this.$props.dataSource : this.evalValuesFormStage()
            if (formItem.hideOnForm) {
                let iHide = false
                Object.entries(formItem.hideOnForm)
                    .forEach(([k, v]) => {
                        if (utils.isNone(v)) return
                        if (!utils.isArray(v)) v = [v]
                        if (v.includes(values[k])) iHide = true
                        // todo 需要判断 values[k] 的类型，比如数组，对象，字符串
                    })
                show = !iHide 
            }
            if (formItem.showOnForm) {
                let iShow = false
                Object.entries(formItem.showOnForm)
                    .forEach(([k, v]) => {
                        if (utils.isNone(v)) return
                        if (!utils.isArray(v)) v = [v]
                        if (v.includes(values[k])) iShow = true
                        // todo 需要判断 values[k] 的类型，比如数组，对象，字符串
                    })
                show = iShow
            }
            if (formItem.showOn && utils.isFunction(formItem.showOn)) {
                show = !!formItem.showOn(formItem, this.scope)
            }
            if (formItem.mode === 'readonly' && this.$props.queryEmptyFields.includes(formItem.key)) {
                show = !!utils.isValuable(values[formItem.key])
            }
            return show
        },
        evalValuesFormStage () {
            const fields = this.getFields()
            let res = createMap()
            fields.forEach(field => res[field] = this.$getValue(field))
            return res
        },
        getFormItemsValue (values, formItems) {
            let res = utils.clone(values)
            formItems.forEach(item => {
                if (item.key) {
                    res[item.key] = item.$getValue()
                }
                if (item.params) {
                    res = utils.merge(res, item.params)
                }
                if (item.paramTransform) {
                    item.paramTransform(res, item, this.scope)
                }
            })
            return res
        },
        viewItemRender (h, formItem) {
            const labelNode = this.labelRender(h, formItem)
            const colon = this.evalColonSign(formItem, labelNode)
            const wrapperNode = this.wrapperRender(h, formItem)
            return <span style="display: flex">
                {<span class="form-label-readonly">{ labelNode }</span>}
                {colon && <span class="form-label-colon">{ colon }</span>}
                {wrapperNode && <span class="form-wrapper-readonly">{ wrapperNode }</span>}
            </span>
        },
        editItemRender (h, formItem) {
            return <a-form-item
                required={formItem.required}
                label-col={{ span: formItem.usedLayout.label }}
                wrapper-col={{ span: formItem.usedLayout.wrapper }}
            >
                {[
                    this.labelRender(h, formItem),
                    this.wrapperRender(h, formItem)
                ]}
            </a-form-item>
        },
        colsRender (h) {
            const liveFormItems = this.getLiveFormItems()
            const hasOneEditItem = liveFormItems.some(item => item.mode === 'edit')
            return liveFormItems.map(formItem => {
                const customLayout = utils.isFunction(formItem.layout) ? formItem.layout(formItem, this.scope) : formItem.layout
                formItem.usedLayout = customLayout || (hasOneEditItem ? layout8 : (formItem.mode === 'readonly' ? layout6 : layout8))
                // todo xxl 的宽度可以根据 span 来适应性填充，不需要外部接口写死
                return <a-col
                    class={ formItem.mode === 'readonly' && 'form-item-readonly' }
                    span={formItem.usedLayout.span}
                    xxl={formItem.usedLayout.xxl}
                >
                    { formItem.mode === 'edit' ? this.editItemRender(h, formItem) : this.viewItemRender(h, formItem) }
                </a-col>
            })
        },
        updated () {
            const entries = Object.entries(this.form.clearedFieldMetaCache)
            const liveFormItems = this.getLiveFormItems()
            const liveKeyMap = {}
            liveFormItems.forEach(item => {
                if (item.key) liveKeyMap[item.key] = true
                if (item.keys) item.keys.forEach(k => liveKeyMap[k] = true)
            })
            entries.forEach(([key, val]) => {
                if (liveKeyMap[key]) this.form.fieldsStore.fieldsMeta[key] = val.meta
            })
        },
        beforeDestroy () {
            this.$reset()
        },
        render (h) {
            return <a-item form={this.form}>
                <a-row type={'flex'}>{ this.colsRender(h) }</a-row>   
            </a-item>
        }
    }
}
</script>
<style lang="less" scoped>
.form-label-readonly {
    margin-left: 1rem;
    color: #999;
    white-space: nowrap;
}
span.form-wrapper-readonly {
    min-height: 21px;
    .line-standard {
        min-height: 21px;
    }
}
.form-label-colon {
    margin-left: 0.25rem;
    margin-right: 0.5rem;
}
.form-row-readonly {
    margin: 0.5rem 0;
}
</style>
