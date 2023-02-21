export const text = `
# Vue

## 综述

### 虚拟DOM

key是虚拟DOM对象的标识，当数据发生变化时，根据新数据生成新的虚拟DOM，随后进行虚拟DOM的差异比较
- 旧虚拟DOM中找到了与新虚拟DOM相同的key：
  - 若虚拟DOM中内容没变，使用之前的真实DOM；若虚拟DOM中内容变了, 生成新的真实DOM，替换页面中之前的真实DOM（仅替换变更部分）
  - vue会尽量高效复用：对于input元素，可能导致复用时value值不改变，可以设置key属性以不复用
- 旧虚拟DOM中未找到与新虚拟DOM相同的key：创建新的真实DOM，随后渲染到到页面

### 响应式原理

数据绑定通过 Object.defineProperty 实现，调用/修改 vm.属性时，getter/setter 从 vm.\_data.属性中获取/修改

Vue会监测data中所有层次的数据：**不允许动态为data添加属性**

- 对象内数据：通过setter监视，这些数据需要在创建实例时传入或者通过$set方法添加
- 数组内数据：Vue对数组的push、pop、shift、unshift、splice、sort、reverse方法进行包裹来监测
- vue无法捕获：通过 \`对象.属性=xx\` 添加属性、\`delete 对象.属性\` 删除属性、\`数组[xx] = aa\` 修改数组、\`数组.length = newLength\` 修改数组长度

## 模板语法

### 插值

插值采用双大括号语法，内部可以包含一个js表达式，当数据改变时，插值处的内容也会更新

    \`\`\`vue
<span>Message: {{ ok ? 'YES' : 'NO' }}</span>
\`\`\`

模板表达式都被放在沙盒中，只能访问全局变量的一个白名单，如 \`Math\` 和 \`Date\`

### 指令

> v2.6+新增：
>
> 动态参数：v-bind/v-on/v-slot等指令后\`:参数\` 替换为 \`:[js表达式]\` ，以动态获得参数
>
> - 表达式必须返回一个字符串，除非为\`null\`，此时会移除绑定
>- 表达式中不能使用空格和引号等，可以使用计算属性替代复杂表达式

    \`v-text="表达式"\` 替换标签内容

    \`v-html="表达式"\` 替换标签内容，支持 HTML 结构解析，存在风险

    \`v-cloak\` 这个指令保持在元素上直到关联实例结束编译

- 隐藏未准备好的元素：css 中：\`[v-cloak]{display：none}\`

    \`v-once\` 所在节点在初次动态渲染后，就视为静态内容了

    \`v-pre\` 跳过所在节点的编译，可用于加快编译

    \`v-slot\` 见[插槽](###插槽)



\`v-bind:属性名="JS表达式"\` 或简写为 \`:属性名="JS表达式"\`

- 绑定表达式的值作为属性值，单向数据绑定

- 绑定值为undefined或null时，会忽视该属性

- 为 class 属性绑定时，若传入：
  - \`['class1','class2']\` 数组式，应用数组内的类名
- \`{class1: true, class2: false}\` 对象式，应用值为 true 的类名
- \`['class1', {class2: true}]\` 复合使用

- 为 style 属性绑定时，需传入：\`{小驼峰的CSS属性名: '属性值'}\`
- \`[{}, {}, ...]\` 可传入对象数组
- 属性名也可使用短横线分割的属性名（记得加引号）
  - vue会自动为属性添加浏览器引擎前缀
  - 属性值也可为一个包含多个值的数组，会应用数组中最后一个被浏览器支持的值

- 对象语法：\`v-bind="对象"\` 将对象所有属性绑定，支持\`v-bind.sync="对象"\`

- 修饰符：加在属性名后

- \`.sync\` 触发子组件的\`update:变量名\`事件时，更新v-bind绑定的变量（此时不能使用表达式）

    \`\`\`vue
    // 本质为
    v-bind:aa="xx"
    v-on:update:aa="xx = $event"
    \`\`\`




        \`v-model:属性名="变量"\` 或简写为 \`v-model="变量"\`（绑定value）

- 用于表单元素和组件，实现双向数据绑定，本质是语法糖

- 使用输入法时：v-model不会在拼字时触发，可用自定义的input事件和value绑定

- 本质：根据不同输入元素使用不同的属性并抛出不同事件
- text 和 textarea 元素使用 \`value\` 和 \`input\` 事件
- checkbox 和 radio 使用 \`checked\` 和 \`change\` 事件
- select 将 \`value\` 和 \`change\` 事件

- 对于不同的表单元素，表现有所不同：
  - \`text\`、\`textarea\` ：变量与\`value\`值绑定
- \`radio\`：变量值为被选中元素的 \`value\` 值
- \`checkbox\`：
    - 变量绑定到单个复选框：变量绑定到布尔值（是否勾选）
      - 为元素指定\`true-value\`、\`false-value\`属性：替换布尔值
- 变量绑定到多个复选框：变量绑定数组，由 \`勾选元素的value值\` 组成
- \`select\`：
    - 单选：绑定至所选option的value值，若无value属性，则绑定option内部文本
- 多选：绑定至数组，数组元素同单选

- 修饰符：加在v-model的后面来实现指定功能，可串联，从左到右执行

- \`.lazy\` 失去焦点再进行数据同步
- \`.number\` 输入字符串转为有效的数字
- \`.trim\` 首尾空格过滤

- 组件上使用\`v-model="xxx"\`，本质为：（可用model选项定制）

  \`\`\`vue
  v-bind:value="xxx"
  v-on:input="xxx = $event"
  \`\`\`




      \`v-on:事件名="方法名 或 JS表达式"\` 或简写为 \`@事件名="..."\`

- 绑定事件
- 只传递方法名：方法的第一个参数为原生dom事件对象\`event\`
- 表达式中使用特殊变量\`$event\`表示原生dom事件对象或\`$emit\`传递的第一个参数
- 事件修饰符：以\`.\`开头，加在事件名右侧，等号左侧，可串联，从左到右执行
- \`.prevent\` 阻止事件默认行为
- \`.stop\` 阻止事件继续传播
- \`.once\` 事件只会触发一次（可用于组件事件）
  - \`.capture\` 使用事件的捕获模式
- \`.self\` 只有触发元素是绑定元素时才执行
- \`.passive\` 事件的默认行为在回调执行前执行
- 应用于scroll事件：提高移动端性能
- \`.native\` 用于组件，绑定的事件作为原生事件，绑定至组件根组件上
- 鼠标按钮修饰符：\`.left\`、\`.right\`、\`.middle\`
- 按键修饰符：\`@keyup/keydown.按键别名="表达式"\`
- \`$event.key\`等于指定键时调用处理函数（非键盘事件也可绑定按键修饰符）
  - 按键别名：enter、delete（删除和退格键）、esc、space、tab、up、down、left、right、caps-loack...
- 系统修饰符：\`.ctrl\`、\`.alt\`、\`.shift\`、\`.meta\`
- 系统修饰符绑定keyup时，按下后再按下其他键，释放其他键后才能触发
- 系统修饰符可以在后方追加按键修饰符，表示同时按下两键时触发
- \`exact\` 修饰符：控制系统修饰符组合触发的事件
- \`@click.ctrl="..."\` 即使 Alt 或 Shift 被一同按下时也会触发
- \`@click.ctrl.exact="..."\` 有且只有 Ctrl 被按下的时候才触发
- \`@click.exact="..."\` 没有任何系统修饰符被按下的时候才触发
- 按键码（已废弃）：使用按键码作为修饰符绑定事件
- 自定义键名：\`Vue.config.KeyCodes.自定义键名 = 键码\`
- 对象语法：\`v-on="对象"\` 对象键名为事件名，键值为方法或方法数组，通常与\`$listeners\`配合使用



    \`v-show="表达式"\`

- 条件渲染，若表达式的值为 false，则隐藏元素（display：none）



\`v-if="表达式"\`、\`v-else-if="表达式"\`、\`v-else\`

- 条件渲染，表达式为真值时，渲染元素
- 操作逻辑同 js，if、elseif、else 所绑定的元素必须在一块，之间不能有其他元素
- 相比\`v-show\`：
  - template 元素只能使用 v-if ，不能使用 v-show
- v-if在切换的过程中会真正销毁和重建元素，相比v-show有更高的切换开销
- v-if是惰性的：初次渲染时条件为false时不会做任何事，相比v-show初始渲染开销更低
- v-for具有比v-if更高的优先级，两者不应该一起使用（改用计算属性对v-for进行筛选）



\`v-for="(形参1, 形参2) in 可遍历值"\` 列表渲染（可用\`of\`替代\`in\`）

- 形参分别接收 value 和 key 值 \`(形参1, 形参2)\`，可简写为\`形参1\`
- 形参支持解构
- 在v-for块内（该元素及其子元素），可以使用形参
- 可遍历值：数组、对象、字符串、整数 n
- 对象：可接收\`形参3\`，表示位置索引。会基于Object.keys遍历
- 整数n：value 值从 1 开始，递增 1 直至遍历 n 次
- 尽量为v-for所在元素指定key属性，**尽量使用每条数据的唯一标识作为 key**
- 在组件上使用v-for时，必须指定key属性

## Vue 实例

创建：\`const vm = new Vue({选项})\` 详见[选项](##选项)

### 实例属性

大部分实例属性为只读属性（下文未指明属性均为只读）

- \`$options\` 对象，实例初始化时的选项
- 在传入了自定义选项时会有用处：\`this.$options.xxx\`
- \`$data\`、\`$props\` 对象，**可读写**，data/props对象
- \`$isServer\` 布尔，实例是否运行于服务器
- \`$attrs\` 对象，存放传入组件未被 props 声明接收的属性（class 和 style 除外）
  - 当组件没有声明任何 prop 时，这里会包含所有父作用域的绑定，可以往下传递至子组件
- \`$listeners\` 对象，包含了父作用域中的（不含 \`.native\` 修饰器） \`v-on\` 事件监听器
- 键名为事件名，键值为函数或函数数组
- 可以配合 \`v-on="$listeners"\` 将所有监听绑定至子元素
- \`$refs\` 对象，保存注册过ref的DOM元素或组件实例
- \`$slots\`：\`{插槽名: VNode或VNode数组}\`，存放插槽内容
- \`$slots.default\` 保存没有被包含在具名插槽中的节点，或 \`v-slot:default\` 的内容
- 插槽不是响应式的
- \`$scopedSlots\` 对象，作用域插槽，用插槽名作为属性访问
- 作用域插槽是一个函数：\`props => Array<VNode>\`
- v2.6+新增：
    - 作用域插槽函数保证返回一个 VNode 数组 或 \`undefined\`
- 所有的 \`$slots\` 现在都会作为函数暴露在 \`$scopedSlots\` 中。推荐始终通过 \`$scopedSlots\` 访问
- \`$el\` DOMElement，实例根元素
- \`$parent\` vue实例，父实例
- \`$root\` vue实例，当前组件树的根vue实例
- \`$children\` vue实例数组，子组件实例
- 数组不保证顺序，也不是响应式的

### 实例方法

- \`$watch('属性', {选项})\` 添加监视属性
- 第二个参数可写为函数式
- \`$set(目标对象,'属性名'/索引, 值)\` 向目标对象身上添加响应式属性，可用于数组元素的修改，返回所设置的值
- set和delete方法的目标对象不能是 vue实例 或 vue实例的根数据对象（\`_data\`）
- \`$delete(目标对象,'属性'/索引, 值)\` 从目标身上移除属性（响应式），同上
- \`$emit('事件名', [...args])\` 触发当前实例上的指定事件
- \`$on('事件名',回调函数)\` 监听当前实例上的自定义事件
- 监听生命周期：事件名改用\`hook:生命周期名\`
- \`$once('事件名',回调函数)\` 监听当前实例上的自定义事件，只触发一次
- \`$off(['事件', 回调函数])\` 解绑自定义事件
- 第一个参数也可以传 事件字符串数组
- 不传第二个参数：移除事件的所有监听
- 不传参数：移除所有事件的所有监听
- \`$mount(['选择器' 或 DOM 节点])\` 手动挂载 vue 实例
- 若不传参，模板将被渲染为未插入文档树的DOM元素
- \`$forceUpdate()\` 重新渲染实例
- 仅影响实例本身和插入插槽的子组件，而不是所有子组件
- \`$nextTick([回调函数])\` 在下一次 DOM 更新后执行回调
- 若不传参，返回一个Promise
- \`$destroy()\` 执行实例的销毁流程

### Vue 静态属性

    \`Vue.version: str\` Vue安装版本号

    \`Vue.config\` 是一个对象，包含Vue的全局配置，在实例化前可修改其属性：

- \`silent: bool = false\`
- 取消Vue所有日志与警告
- \`optionMergeStrategies: { 选项名: 函数}\`
- 自定义选项合并策略，见[混入](###其他选项)
- \`devtools: bool = true\`
- 是否允许vue-devtools检查代码，生产版本默认false
- \`errorHandler: (err,vm,info)=>{} = und\`
- 组件渲染和观察期间未捕获错误的处理函数
- \`warnHandler: (msg,vm,trace)=>{} = und\`
- Vue运行警告的处理函数，仅开发环境生效
- \`ignoredElements: arr<str|reg> = []\`
- 要忽略的Vue外的自定义元素（webComponents）
- \`keyCodes: {[key:str]:num|arr<num>} = {}\`
- 给v-on的按键别名，别名必须是短横线分割形式
- \`performance: bool = false\`
- 设为true可在浏览器开发工具的性能面板中追踪组件性能，仅适用开发模式和支持的浏览器。
- \`productionTip: bool = true\`
- 是否在vue启动时生成生产提示

### Vue 静态方法

- \`mixin({选项})\` 全局混入

- \`use(插件对象[, 多个参数])\` 应用插件

- \`set(目标对象, '属性'/索引, 值)\` 同实例方法 $set

- \`delete(目标对象,'属性'/索引)\` 同实例方法 $delete

- \`nextTick([回调函数, context])\` 同实例方法 $nextTick

- \`filter('过滤器名', (value)=>{})\` 创建全局过滤器，需在创建 vm 实例前绑定

- \`directive('指令名', 函数或配置对象)\` 创建全局自定义指令，在创建 vm 实例前绑定

- \`component('组件名', {选项}/Vue.extend的返回值)\` 全局注册组件

- 若不传第二个参数，返回已注册的组件构造器

- \`extend(组件选项)\` 返回一个Vue构造器

- 实例化并挂载：同Vue实例化，可采用el选项或$mount方法

- \`compile(模板字符串)\` 将模板字符串编译为render函数，仅在完整版vue中可用

- \`observable(对象)\` （v2.6+）使一个对象可响应，返回该对象



### 实例生命周期

1. 初始化生命周期、事件
2. \`beforeCreate\` 钩子
3. 初始化数据监测、数据代理
4. \`created\` 钩子
5. Vue解析模板，内存中生成虚拟DOM ：
   1. 检测el选项，若没有传入则暂停，在$mount方法调用后继续
2. 检测template选项，若有：渲染模板；若无：将el所在标签的外部HTML作为模板
6. \`beforeMount\` 钩子：此时对DOM的操作最终都不奏效
7. 将内存中的虚拟DOM转成真实DOM插入页面
8. \`mounted\` 钩子
9. 进入更新循环
10. \`beforeUpdate\` 钩子
11. 根据新数据，生成新的虚拟DOM，进行比较后完成页面更新
12. \`updated\` 钩子
13. 回到更新循环开头（第9步），直到调用实例的$destroy方法
14. \`beforeDestroy\` 钩子
15. 销毁实例，清理它与其他实例之间的连接，解绑全部指令和自定义事件监听器
16. \`destroyed\` 钩子（销毁后自定义事件会失效，原生DOM事件依然有效）

## 选项

> methods选项内函数、生命周期钩子函数等函数的this指向vue实例或组件实例

### DOM 选项

- \`el: '选择器' 或 DOM节点\` 仅在 new 创建实例时生效，指定元素作为实例的挂载目标，模板将替代挂载目标元素

- \`template: 'HTML代码'\` 指定模板，模板只能有一个根节点

- \`render: createElement => createElement(...)\` 渲染函数，字符串模板的替代方案

- 指定该选项会使\`el\`和\`template\`选项失效，且需要为实例调用\`$mount()\`方法手动挂载

- createElement函数：
  
    - 返回值：虚拟节点（VNode），用于描述页面上需要渲染什么样的节点，以及其子节点的描述信息
- 参数一：必选项，可以是一个HTML 标签名字符串、组件选项对象，或者 resolve 了上述任何一种的一个 async 函数
- 参数二：可选，数据对象，可选属性：
      - \`class\`、\`style\`：格式与v-bind相同
- \`attrs\`：对象，普通的HTML特性
- \`props\`：对象，组件prop
- \`domProps\`：对象，DOM属性，有innerHTML、value等
- \`on\`：\`{事件名: 函数/函数数组}\`，事件监听器
- 修饰符：为事件名添加前缀作为修饰符
- \`&\`：\`.passive\`
- \`!\`：\`.capture\`
- \`~\`：\`.once\`
- \`~!\`：\`.capture.once\` 或\`.once.capture\`
- 其他修饰符可用js[实现](https://v2.cn.vuejs.org/v2/guide/render-function.html#%E4%BA%8B%E4%BB%B6-amp-%E6%8C%89%E9%94%AE%E4%BF%AE%E9%A5%B0%E7%AC%A6)
- \`nativeOn\`：格式同上，仅用于组件，监听原生事件
- \`derectives\`：binding对象数组，自定义指令
- \`scopedSlots\`：\`{ 插槽名: props => VNode或VNode数组 }\`，向子组件传递作用域插槽
- \`slot\`：字符串，组件作为具名插槽的插槽名
- \`key\`、\`ref\`：字符串
- \`refInFor\`：布尔，若有多个元素具有相同ref名，需指定该属性为true，对应\`$refs.xx\`会变为数组
- 参数三：可选，子级虚拟节点数组，可以使用字符串作为一个虚拟节点，表示文本。
  
  - 可以使用JSX代替createElement函数的调用：
  
    \`\`\`jsx
    render: function (h) {
        return (
          <AnchoredHeading level={1}>
            <span>Hello</span> world!
          </AnchoredHeading>
        )
    }
    \`\`\`

    - \`functional: true\` 指定组件为[函数式组件](###函数式组件)

- 对于单文件组件，可这样声明：\`<template functional>\`

- \`renderError: (createElement, err)=>createElement(...)\`

- 适用于开发环境，render函数遇到错误时，提供另一种渲染输出

### 基本选项

- \`name: str\` 仅组件可用
- \`components: {'组件名': {选项}/Vue.extend的返回值}\` 注册组件
- 数组式：\`components: [ {选项}/Vue.extend的返回值 ]\`
- \`props: ['属性名']\` 组件接收外部数据
- 数据只读，不允许修改
- 对象式：\`props:{ 属性名: String }\` 或 \`props:{ 属性名: 选项 }\`
- 类型可以写作数组形式：\`props:{ 属性名: [Number, String] }\`
- 选项：
      - \`type: String\` 类型
- \`default: any\` 默认值
- 对象或数组默认值必须从一个工厂函数获取
- 除了布尔类型，所有未指定default选项的prop默认值为undefined
- \`required: true\` 是否为必须项
- \`validator: (value) => Boolean\` 自定义验证函数
- \`data(){返回数据对象}\` 存储数据
- 数据对象中的属性都会通过数据代理被绑定到 vm 上（数据对象存于 vm.\_data）
  - 以 \`_\` 或 \`$\` 开头的属性不会被 Vue 实例代理
- 对象式：\`data: {属性: 值}\` 推荐使用函数式（多次创建该组件时，数据对象不同）
- \`methods: {方法名(){}}\` 为实例添加方法

- 每当触发重新渲染时，调用的方法总会再次执行
- \`computed: {属性: {配置项}}\` 计算属性，计算属性也是实例的属性

- 配置项：\`get(){}\`、\`set(value){}\`
- getter 会在初次读取属性与所依赖数据变化时被调用，并且有缓存机制
- 简写：\`属性名(){}\` 若没有 setter，可以采用这种简写，函数体视为 getter
- 计算属性会基于响应式依赖进行缓存
- \`watch: {属性: 对象/函数/字符串/数组}\` 监视属性，指定属性被修改时的动作，监视属性中允许异步操作
- 对象式：\`{配置项}\`
- \`immediate: false\` 设置是否在初始化时调用 handler
- \`deep: false\` 深度监视，开启后，若属性为多级数据，属性内部发生改变后也调用
- \`handler(newValue, oldValue){}\` 当属性被修改时调用函数
- 函数式：\`fn(newVal, oldVal){}\` 当只需要 handler 时，可采用函数式
- 字符串：表示方法名
- 数组式：内部可以包含对象/函数/字符串，依次调用
- \`钩子名(){}\` 定义钩子函数

- 生命周期钩子：\`beforeCreate\`、\`created\`、\`beforeMount\`、\`mounted\`、\`beforeUpdate\`、\`updated\`、\`beforeDestroy\`、\`destroyed\`
- keep-alive钩子：\`activated\`组件激活时触发 、\`deactivated\` 组件失活时触发
- \`errorCaptured(err, vm, info: str)\`钩子：
    - 捕获一个来自后代组件的错误时被调用，返回false阻止错误继续向上传播。 
    - 错误传播规则：沿继承链向上传播并唤起\`errorCaptured\`，直至全局错误处理\`config.errorHandler\`。若\`errorCaptured\`抛出错误，则该错误和原捕获的错误都会发送给全局错误处理

### 其他选项

- \`mixin: [{选项}]\` 将选项混入，选项将进行合并：
  - 数据对象进行递归合并，并在发生冲突时以组件数据优先
- 值为对象的选项（methods等），合并为一个对象，冲突时取组件对象的键值对
- 钩子函数合并为数组，都生效，混入钩子先执行
- 自定义选项将简单覆盖已有值，自定义合并：\`Vue.config.optionMergeStrategies.选项名 = function (toVal, fromVal, vue实例) {返回合并后的值}\`
- \`filters: {过滤器名(value){}}\` 过滤器，可用于 双花括号插值 和 v-bind 表达式
- 使用：\`{{ ... | 过滤器名}}\` 必须被添加至表达式的尾部
- 将\`|\`前的值作为 value 参数传给过滤器，过滤器返回值作为整个表达式的值
- 过滤器传参：\`{{ ... | 过滤器名(多个参数)}}\` 参数依次追加至过滤器函数的参数列表
- 实现串联：\`{{ ... | 过滤器1 | 过滤器2}}\`
- \`directives: {配置} 或 函数式\` 自定义指令
- 指令名用全小写，通过 v-指令名调用，内部函数 this 为 window
- 对象式：\`指令名: {多个钩子函数}\`
- 钩子函数名：
      - \`bind\` 指令第一次绑定到元素时调用
- \`unbind\` 指令与元素解绑时调用
- \`inserted\` 被绑元素插入父节点时调用（不一定已插入文档）
      - \`update\` 所在组件 VNode 更新时调用（可能发生在子VNode更新前）
      - \`componentUpdated\` 指令所在组件的 VNode 及其子 VNode 全部更新后调用
- 钩子函数的参数：element，binding，vnode，oldVnode
- \`element\` 指令所绑定的 DOM 元素
- \`binding\` 一个对象，属性有：
        - \`name\`：指令名，不包括 \`v-\` 前缀
- \`value\`：指令的绑定值，例：\`v-xx="1 + 1"\` 中，绑定值为 \`2\`
- \`oldValue\`：指令绑定的前一个值，仅在 \`update\` 和 \`componentUpdated\` 中可用。无论值是否改变都可用
- \`expression\`：字符串形式的指令表达式。例： \`v-xx="1 + 1"\` 中，表达式为 \`"1 + 1"\`
- \`arg\`：传给指令的参数，可选。例： \`v-xx:foo\` 中，参数为 \`"foo"\`
- \`modifiers\`：一个包含修饰符的对象。例如：\`v-xx.foo.bar\` 中，修饰符对象为 \`{ foo: true, bar: true }\`
- 函数式：\`指令名(element,binding){}\` 在 \`bind\` 或 \`update\` 时调用
- \`provide: 对象或函数\` 依赖注入，为所有后代组件提供数据/方法
- 对象式：键名作为依赖名，键值作为依赖值
- 函数式：函数需要返回一个对象
- 注意：依赖注入会使得重构更加困难，且提供的 property 是**非响应式**的
- \`inject: 依赖名字符串数组 | 对象\` 接收依赖
- 数组式：本地的绑定名即依赖名
- 对象式：键名为本地的绑定名，键值为依赖名字符串或Symbol
- 键值也可以是一个对象，其 from 属性为依赖名字符串或Symbol，其 default 属性为默认值
- \`inheritAttrs: false\` 禁用组件根元素继承未被接收的prop属性
- 不影响style和class属性
- \`model: { prop?: string, event?: string }\` 为组件使用v-model时定制prop和event
- \`propsData:{键值对}\` 仅用于new创建的实例，在创建时传递props，主要用于测试。
- \`parent: Vue实例\` 指定父组件（不推荐）
- \`extends: 组件选项对象/构造函数\` 扩展组件，和mixins类似
- \`delimiters: ["{{","}}"]\` 修改插值的分隔符，仅在完整版本中的浏览器内编译可用
- \`comments: true\` 保留模板中的HTML注释，仅在完整版本中的浏览器内编译可用

## 组件

### 组件基础

> - 组件是实现应用中局部功能代码和资源的集合，组件中函数的this指向组件实例
> - 对组件应用class特性时，会应用到组件的根元素上，不会覆盖元素上已有的class
> - 重要的内置关系：\`VueComponent.prototype.__proto__ === Vue.prototype\`
> - \`VueComponent(选项)\`：是Vue.extend的返回值，是一个构造函数；若写了组件标签，Vue会执行new VueComponent（options）；每次调用Vue.extend，返回的都是全新的构造函数

选项：相比Vue的选项大部分相同

- 组件没有el选项，有name选项，data必须是函数式
- \`name: 'abc'\` 组件命名，推荐采用短横线分隔命名

注册组件：

- 局部注册：\`components\` 选项
- 全局注册组件：\`Vue.component(...)\` 必须在Vue实例化前
- [自动化全局注册基础组件](https://v2.cn.vuejs.org/v2/guide/components-registration.html#%E5%9F%BA%E7%A1%80%E7%BB%84%E4%BB%B6%E7%9A%84%E8%87%AA%E5%8A%A8%E5%8C%96%E5%85%A8%E5%B1%80%E6%B3%A8%E5%86%8C)

HTML中使用：\`<组件名></组件名>\`（DOM模板中） 或  \`<组件名/>\`

- 组件名：使用短横线分隔命名（注册的组件名若为大驼峰，也要在DOM中使用时改为短横线） 或  大驼峰（仅在脚手架环境中）
- 注意：ul、ol、table、select元素内部只能有li、tr、option，可以为li等元素指定\`is\`属性来渲染为组件，is属性用法详见[动态组件](###动态组件&异步组件)
- 但若通过以下来源使用模板的话，该限制不存在：
    - 字符串（例如：\`template: '...'\`）
    - 单文件组件 （\`.vue\`）
    - \`<script type="text/x-template">\`
    - 模板定义的替代：
  - 内联模板：为组件标签设置\`inline-template\`属性，这个组件将会使用其标签体里面的内容作为模板（定义在 Vue 所属的 DOM 元素内）
  - \`<script type="text/x-template"></script>\` 模板写于该元素内，将该script作为template选项（定义在 Vue 所属的 DOM 元素外）

单文件组件：一个文件中包含一个组件

- 文件名：\`xxx.vue\` 文件名规则与组件名一致，一般用大驼峰
- 文件中有三个标签：\`<template></template><script></script><style></style>\`
- 三个标签分别放置组件模板（html）、组件交互代码（js）、组件样式（css）
- script中需要暴露组件，若仅暴露选项对象，最好写name属性

### 数据传递

组件接收外部数据：props

- 传递数据：在组件标签内设置属性与值，可用v-bind传递非字符串类型的数据
- 使用原生HTML时：组件props在HTML中必须以短横线分隔命名（其他时候也推荐这么写）
  - 任何未被prop接收的属性都会添加到组件根元素上（传入的class和style会与根元素上的对应属性合并）
    - 禁用属性继承：接收数据的组件添加 \`inheritAttrs: false\` 选项
- 对于布尔型的prop：写上prop但不传值时，等同传入true；不写prop时，等同传入false
- 接收数据：该组件内部通过\`props\`选项接收
- HTML中短横线分隔命名的props，在props选项接收时会自动转换为小驼峰

子组件向父组件发送数据：

- 方法一：父组件通过props传递一个函数，子组件调用该函数。通过函数参数的形式传递数据

    \`\`\`javascript
  // 父组件中
  receive(data){
  	this.data = data;
  }
  \`\`\`

- 方法二：父组件为子组件绑定自定义事件，子组件调用\`$emit()\`，通过函数参数的形式传递数据。

- 方法三：通过作用域插槽

### 事件

**组件自定义事件**

注意：

- 给组件绑定事件的本质是绑定到其实例上
- 给组件绑定DOM原生事件时，默认视为自定义事件，除非添加 .native 修饰符

触发事件：\`this.$emit('事件名'[,多个参数])\` 参数会作为回调函数的入参

绑定自定义事件：

- 方法一：组件标签中添加  \`@事件名="回调函数"\`
- 方法二：\`组件实例.$on/$once('事件名', 回调函数)\` 更灵活，可以设置异步

解绑自定义事件：\`组件实例.$off('事件名' 或 ['事件名',…])\` 不传参表示全解绑



**全局事件总线**

用于任意组件间通信

创建：Vue实例化时添加选项：\`beforeCreate(){Vue.prototype.$bus=this}\`

- 在任意组件内均可对\`this.$bus\`进行事件绑定、解绑与触发

消息订阅与发布：利用pubsub-js库（适用任何框架），用于任意组件间通信

- 引入库：\`import PubSub from 'pubsub-js'\`
- 订阅消息：\`let token = PubSub.subscribe('消息名', fn(msgName[, 多个参数]){})\`
- 取消订阅：\`PubSub.unsubscribe(token)\`
- 发布消息：\`PubSub.publish('消息名'[, 多个参数])\`

### 插槽

用于向组件传递HTML结构

注意：

- 父级模板/子模板里的所有内容都是在父级作用域/子作用域中编译的
- 插槽样式可以写在组件标签体所在父组件的style中，也可以写在组件内的style中

默认插槽：

- 若组件标签内有结构，会将这些结构解析到该组件template中的所有\`<slot></slot>\`处
- \`<slot>默认内容</slot>\`：当使用者没有传递结构时，显示默认内容

具名插槽：

- 组件标签体内，指定元素添加\`slot="xx"\` ；组件模板内：\`<slot name="插槽名"></slot>\`
- 标签体内所有相同插槽名的具名插槽，都将解析至所有\`name="插槽名"\`的slot标签处
- 默认插槽即为name值为default的插槽，没有被包裹在带有 \`v-slot\` 的元素中的内容 都会被视为 默认插槽的内容（v-slot值为default）
- 新语法：\`<template slot="xx">\` 可以写为\`<template v-slot:xx>\`，
  - v-slot语法仅对template元素与组件有效
  - slot语法已被废弃，推荐使用v-slot语法


作用域插槽：

1. 组件模板内的slot元素绑定属性 \`:属性1="值"\`（插槽prop）
2. 组件标签体内放置\`<template slot-scope="slotProps"></template>\`
- 此时 \`属性1\` 被传为 \`slotProps\` 的属性，该\`template\`标签内可以使用\`slotProps\`属性
- 插槽支持解构赋值与设置默认值：\`slot-scope="{属性1='a'}"\`
- \`scope="xx"\` 同 \`slot-scope="xx"\`  前者为旧api

- 新语法（2.6+）：\`v-slot:default="xx"\` 相当于\`slot="default" slot-scope="xx"\`
- 若提供的内容只有默认插槽，可以将slot属性写于组件上
- 同时对于默认插槽，可以缩写为\`v-slot="xx"\`
- \`v-slot\`可以使用动态指令参数：\`v-slot:[表达式]\`
- 缩写：\`v-slot:xx\`缩写为\`#xx\`

### 动态组件&异步组件

**动态组件**

> 注意：ul、ol、table、select元素内部只能有li、tr、option，若需要在其元素内部防止组件，可以为li等元素指定\`is\`属性来渲染为组件

    \`<component></component>\` 根据is属性渲染为不同组件

- is属性：可传入 HTML标签名字符串/已注册组件名字符串/组件选项对象

    \`<keep-alive></keep-alive>\` 包裹动态组件时，会缓存不活动的组件实例

- 要求组件具有name选项

- 可选属性如下：
  - \`include - '组件名' | 正则 | ['组件名']\` 只有名称匹配的组件会被缓存
- \`exclude - 同上\` 任何名称匹配的组件都不会被缓存
- \`max - 数字\` 缓存组件实例的上限



**异步组件**

以工厂函数定义组件：

\`\`\`javascript
Vue.component('async-example', function (resolve, reject) {
    // 异步操作，可以是API请求组件数据
	resolve(组件选项对象)
})
\`\`\`

- 工厂函数也可以返回一个Promise对象，可以把webpack2和ES6的语法加在一起使用动态导入：

  \`\`\`javascript
  Vue.component('async-webpack-example',
    // 这个动态导入会返回一个 \`Promise\` 对象。
    () => import('./my-async-component')
  )
  \`\`\`

组件的component选项也可以提供一个返回Promise的函数

- 工厂函数也可以返回一个对象：

  \`\`\`javascript
  {
    component: import('./MyComponent.vue'), // 需要加载的组件(应该是Promise对象)
    loading: LoadingComponent, // 正在加载时使用的组件
    error: ErrorComponent, // 加载失败时使用的组件
    delay: 200, // 展示加载时组件的延时时间。默认值是 200 (毫秒)
    timeout: 3000 // 超时时间，默认值是Infinity
  }
  \`\`\`



推荐与webpack的code-splitting配合使用：

\`\`\`javascript
Vue.component('async-webpack-example', function (resolve) {
  // 这个特殊的 \`require\` 语法将会告诉 webpack
  // 自动将你的构建代码切割成多个包，这些包会通过 Ajax 请求加载
  require(['./my-async-component'], resolve)
})
\`\`\`



组件间产生循环引用时，为了防止报错：异步加载组件B

- 方法一：

  \`\`\`js
  beforeCreate () {
    this.$options.components.组件B = require('url').default
  }
  \`\`\`

  - 方法二：webpack异步import

    \`\`\`js
  components: {
    组件B: () => import('url')
  }
  \`\`\`

### 函数式组件

特点：

- 可用选项只有\`functional\`、\`props\`、\`render\`
- 没有状态（无响应式数据），没有实例（this上下文），只能接收一些props
- 渲染开销小

render函数提供第二个参数context作为上下文，其属性有：

- \`props\`：提供所有 prop 的对象
- \`children\`：VNode 子节点的数组
- \`slots\`：一个函数，返回了包含所有插槽的对象
- \`scopedSlots\`：(2.6+) 一个暴露传入的作用域插槽的对象。也以函数形式暴露普通插槽
- \`data\`：传递给组件的整个数据对象，作为 \`createElement\` 的第二个参数传入组件
- \`parent\`：对父组件的引用
- \`listeners\`：\`data.on\` 的别名
- \`injections\`：如果使用了\`inject\`选项，则该对象包含了应当被注入的 property

使用render函数时，推荐用法：

\`\`\`js
Vue.component('my-functional-button', {
  functional: true,
  render: function (createElement, context) {
    // 完全透传任何 attribute、事件监听器、子节点等。
    return createElement('button', context.data, context.children)
  }
})
\`\`\`

若使用模板：可以访问到context上下文的内容

    \`\`\`html
<template functional>
  <button
    class="btn btn-primary"
    v-bind="data.attrs"
    v-on="listeners"
  >
    <slot/>
  </button>
</template>
\`\`\`



## 过渡&动画

### 单元素过渡

使用：

1. 将元素包裹在\`<transition></transition>\`标签中
2. 为元素或组件添加进入/离开过渡：
   - 条件渲染\`v-if\`、条件展示\`v-show\`、动态组件、组件根节点
3. 设置过渡的css类



过渡的css类名：

> \`v-\`前缀的类用于无name属性的transition标签，对于有name属性的标签，使用\`name属性值-\`作为前缀
>
> 对于css动画：用法同css过渡，但\`v-enter\` 类名在 \`animationend\` 事件触发时才删除。通常将animation属性写于\`-active\`类中

- \`v-enter\`：定义进入过渡的开始状态。过渡开始前生效，开始后移除
- \`v-enter-to\`：定义进入过渡的结束状态。过渡开始后生效，结束后移除
- \`v-enter-active\`：定义进入过渡生效时的状态。过渡开始前生效，结束后移除。这个类可以被用来定义transition属性。
- \`v-leave\`：定义离开过渡的开始状态
- \`v-leave-to\`：定义离开过渡的结束状态
- \`v-leave-active\`：定义离开过渡生效时的状态



transition组件：

> \`<transition></transition>\`
>
> transition只能作用于第一个子元素
>
> transition组件内有多个同标签元素时，必须为元素设置key属性区分

组件可选属性：

- \`name="xx"\`
- \`:duration="1000"\`或\`:duration={enter:500, leave:800}\`
- \`enter-class="animate-enter"\` 自定义过渡类名
- 所有属性：\`enter-class\`、\`enter-active-class\`、\`enter-to-class\`、\`leave-class\`、\`leave-active-class\`、\`leave-to-class\`
- \`:css="false"\` 适用于仅使用js过渡的元素，避免CSS的影响
- \`appear\` 节点在初始渲染时产生过渡
- 自定义过渡类名：\`appear-class\`、\`appear-to-class\`、\`appear-active-class\`
- 可监听事件：\`before-appear\`、\`appear\`、\`after-appear\`、\`appear-cancelled\`
- \`mode="out-in或in-out"\` 过渡模式，\`in-out\`表示先进行进入过渡，再进行离开过渡



事件：\`v-on:before-enter="beforeEnter"\`

- 可监听事件：\`before-enter\`、\`enter\`、\`after-enter\`、\`enter-cancelled\`、\`before-leave\`、\`leave\`、\`after-leave\`、\`leave-cancelled\`

- 回调函数的参数为\`el\`，表示进行过渡的元素

- 对于\`enter\`和\`leave\`事件，有第二个回调函数参数\`done\`，调用后结束过渡。若只是用js过渡，必须调用done方法

- Velocity.js动画示例：

  \`\`\`vue
  <transition
    v-on:before-enter="beforeEnter"
    v-on:enter="enter"
    v-on:leave="leave"
    v-bind:css="false"
  >
    <p v-if="show">Demo</p>
  </transition>
    
  data: {
    show: false
  },
  methods: {
    beforeEnter: function (el) {
      el.style.opacity = 0
      el.style.transformOrigin = 'left'
    },
    enter: function (el, done) {
      Velocity(el, { opacity: 1, fontSize: '1.4em' }, { duration: 300 })
      Velocity(el, { fontSize: '1em' }, { complete: done })
    },
    leave: function (el, done) {
      Velocity(el, { translateX: '15px', rotateZ: '50deg' }, { duration: 600 })
      Velocity(el, { rotateZ: '100deg' }, { loop: 2 })
      Velocity(el, {
        rotateZ: '45deg',
        translateY: '30px',
        translateX: '30px',
        opacity: 0
      }, { complete: done })
    }
  }
  \`\`\`



### 多元素过渡

transition-group组件：

> \`<transition-group></transition-group>\`
>
> 用于多元素过渡，相比transition标签，还可以改变定位

特点：

- 内部元素必须指定唯一的key属性
- 不同于transition标签，它会以一个真实元素呈现，默认为\`<span>\`
- CSS 过渡 class 会被应用在列表内的元素上，而不是容器元素上

CSS类：同transition标签

- 新增了\`v-move\` 类，在元素改变定位（例如列表顺序变更）时应用

组件属性：同transition属性

- 新增了\`tag="div"\`属性，指定标签要渲染为哪个元素
- 新增了 \`move-class\` 自定义move的类名

## Vue CLI

Vue CLI（command line interface），即Vue脚手架。安装：\`npm install -g @vue/cli\`

注意：

- \`<%= BASE_URL %>\`    表示public目录

- 仅\`public/index.html\`或其它通过\`html-webpack-plugin\`作模板的HTML文件有效
- \`import Vue from "vue";\` 引入精简版的vue

- 无法解析template选项，需用render选项。可以解析组件的template标签
- \`import Vue from "vue/dist/vue";\` 引入完整版vue
- \`<style scoped>\` 让样式在组件局部生效，防止冲突

- 设置scoped之后，可以影响该组件内子组件的根元素的样式，但子组件内部元素的样式不受影响

- 使用\`>>>\`实现样式穿透（影响子组件），例：\`div >>> .el-icon\`

- Sass 之类的预处理器无法解析 \`>>>\`，使用\`/deep/\`（less）或\`::v-deep\`（sass） 代替

- 注意：less中使用样式穿透时，应将样式穿透符写在子选择器前

    \`\`\`less
      /* 正确用法 */
      .a {
          /deep/.b {...}
      }
      
      /* 错误用法，不能正常生效 */
      .a/deep/ {
          .b {...}
      }
      \`\`\`

- 原理：组件的style标签添加scoped后

- 该组件模板中所有的节点和子组件根元素节点上，会被添加 \`data-v-xxxx\` 的唯一标识属性

- style标签内的选择器（无样式穿透）的最后会追加一个属性选择器

    \`\`\`less
      .a {
      	.b {
      		color: #fff;
      	}
      }
      
      /* less编译为css */
      .a .b {...}
      
      /* 追加属性选择器 */
      .a .b[data-v-xxxx] {...}
      \`\`\`

- 每个css选择器中，只有第一个样式穿透符会生效，会将属性选择器追加至样式穿透符前的选择器的末尾。
  
      \`\`\`css
      .a/deep/.b {...}
      
      /* 样式穿透符本身将被解析为空格 */
      /* 将编译为 */
      .a[data-v-xxxx] .b{...}
      \`\`\`

      -  \`<style lang="less"> \`  指定样式所用的预处理器（需要安装loader），默认为css

重要命令：

- \`vue create 项目名\` 当前目录下创建项目
- \`npm run dev\` 运行开发服务
- \`npm run build\` 编译为html、css、js文件
- 编译后默认需要在服务器上运行，若出现白屏问题：
    - 更改vue.config.js中的publicPath为相对路径“./”
- \`vue inspect > output.js\` 导出webpack配置

vue.config.js文件：可选的配置文件，放于项目根目录，详见Vue文档

- 通过commonjs的形式导出配置对象\`module.exports={选项}\`，与webpack的配置文件整合，常用选项如下：
  - \`pages\` 配置入口
- \`lintOnSave: false\` 关闭语法检查

## 插件

用于为Vue添加全局功能，插件本质是包含install方法的一个对象

- install方法：\`install(Vue, options){}\` 函数内使用Vue静态方法添加全局功能等

应用插件：\`Vue.use(插件对象[, 多个参数])\`

- 需要在Vue实例化之前调用
- 参数会传递给install方法的options对象

### Vuex

> npm i vuex
>
> 实现集中式状态（数据）管理。适用于：多个组件依赖于同一状态；来自不同组件的行为需要变更同一状态。

工作原理：

1. Vue组件 → Actions：通过\`dispatch('动作名', 值)\`
- Vue组件可以跳过Actions，通过调用\`commit('动作名', 值)\`直接到达Mutations
- Actions：用于响应组件中的动作，是一个对象，一般用于与后端API通信。可以包含任意异步操作
2. Actions → Mutations：通过\`commit('动作名', 值)\`
- Mutations：用于操作数据，是一个对象，可以与开发者调试工具通信。用于直接更新state中的数据
3. Mutations → State：在mutations中直接操作state对象
- State：用于存储数据，一个对象
4. State → Vue组件：Render



**示例：**

src\store\index.js

    \`\`\`javascript
import Vue from 'vue'
import Vuex from 'vuex';
Vue.use(Vuex);
const actions = {};  
const mutations = {};  
const state = {};  
const getters = {};
export default new Vuex.Store({actions, mutations, state [, getters] })
\`\`\`
src\main.js
    \`\`\`javascript
import store from './store/index.js';
// Vue实例化时添加选项store: store
// 通过Vue实例.$store访问store实例
\`\`\`



Store实例：\`new Vuex.Store({actions, mutations, state [, getters] })\`

- actions，mutations，state，getters均为对象，store实例具有state，getters属性
- actions：\`{方法}\`
- \`动作名(context, value){}\`  store.dispatch()后会调用函数，获取的context是精简版store的实例
- 函数内需调用context.commit('mutations中对应的动作名'，value)
- 该函数内可以通过调用dispatch触发其他动作
- mutations：\`{方法}\`
- \`动作名(state, value){}\` mutations中的动作名一般用全大写，函数内对属性进行操作
- state：\`{初始键值对}\`
- getters：\`{方法}\` 可选配置
- \`属性名(){return xx}\` getter，通过\`getters.属性名\` 访问



组件中的快捷使用：

- \`import{mapState, mapGetters, mapMutations, mapActions} from 'Vuex';\`
- \`computed: {...mapState({属性名: 'state中的属性名'})}\` 属性会被添加到计算属性中
- 若mapState声明属性名同state中的属性名同名，可用数组形式：\`mapState(['属性名'])\`
- mapGetters用法同上
- \`methods: {...mapMutations({方法名: 'Mutations中的动作名'})}\` 方法会被添加到methods中
- 当方法名同动作名时，可用数组形式：\`mapMutations(['方法名'])\`
- mapActions用法同上



模块化：

- 创建store模块对象：\`{namespaced: true, actions: {}, mutations: {}...}\`
- 创建store实例：\`new Vuex.Store({modules: {模块名1: 模块对象1, ...}})\`
- 使用时：
  - state中需要通过\`模块名.属性\` 进行访问
- getters中的属性名、mutations和actions中的事件名变为：\`模块名/事件名\`
- 例：\`commit('模块名1/事件名', value)\`
- \`mapState('模块名1', ['模块1内的属性'...])\` 需要开启模块的namespaced属性
- \`mapMutations('模块名1', {方法名: '模块1内的事件名'})\` 同上



### Vue-Router

> npm i vue-router
>
> 用于实现SPA应用

示例： 

src\router\index.js

    \`\`\`javascript
import Vue from 'vue';
import VueRouter from 'vue-router';
Vue.use(VueRouter)
export default new VueRouter({选项})
\`\`\`

src\main.js

    \`\`\`javascript
import router from './router'
// Vue实例化时添加选项router：router
\`\`\`



router实例：\`new VueRouter({选项})\`

- \`routes: [{选项}]\`，仅path属性为必选项
- \`name: 'xx'\` 可选，命名路由
- \`path: '/xx'\` 路由路径
- \`component: 组件\` 对应路由组件
- 路由懒加载：\`component: ()=>import('url')\`
- \`redirect: '/xxxx'\` 可选，重定向
- \`children: [{子路由选项}]\` 可选，配置子路由
- 子路由匹配成功后，子路由对应组件会渲染至其父路由组件的\`<router-view>\`内部
- 子路由path属性：
      - 子路由路径不以\`/\`开头时：\`/.../子路由路径\` 算作匹配成功
- 子路由路径以\`/\`开头时：\`/子路由路径\` 算作匹配成功（视为根路径）
  - \`props:多种写法\` 传递路由参数给路由组件的props
- 对象写法：\`props: {属性: 值}\`
- 布尔写法：\`props: true\` 若为真，传递所有params参数
- 函数写法：\`props($route){return{属性: 值}}\`
- \`meta: 对象\` 存储路由元信息
- \`beforeEnter(){}\` 独享路由守卫
- \`mode: 'history'\` 指定路由模式
- \`hash\`模式：浏览器环境默认值，通过url中的#实现路由跳转，且不会将数据传到后端
- \`history\`模式：利用HTML5中的pushState()和replaceState()方法。它们虽然改变了当前的URL，但不会立即向后端发送请求。该模式直接刷新页面时，仍会向后端传递请求，需要在后端进行配置以确保正常使用
- \`abstract\`模式：node环境默认值，支持所有js运行环境，如node.js服务器端
- \`base: str = '/'\`：应用基路径
- \`linkActiveClass :str='router-link-active'\`：router-link的active-class属性的默认值
- \`linkExactActiveClass :str='router-link-exact-active'\`：router-link的exact-active-class属性的默认值
- \`scrollBehavior(to, from, savedPosition){}\`：切换路由时滚动页面（hash模式下不可用）
  - savedPosition仅当popstate 导航 (通过浏览器的 前进/后退 按钮触发) 时可用，表示保存的滚动位置信息
- 方法需返回滚动位置的对象：
    - \`{ x: number, y: number }\`
    - \`{ selector: '锚点', offset?: { x: number, y: number }}\` 锚点不带#
- 若方法返回空对象或假值，则不滚动
- \`parseQuery / stringifyQuery(函数)\`：覆盖默认查询字符串的解析/反解析函数
- \`fallback:bool=true\`：浏览器不支持 \`history.pushState\` 时是否回退到 \`hash\` 模式



相关组件：

- \`<router-link></router-link>\` 可视为a标签，跳转到指定路径，相关属性如下：
  -  \`to="/xx"\` 指定组件对应的路径
- 对象写法：\`:to="{选项}"\`
- \`path: '/xx'\`
- \`name: 'xx'\` 指定跳转的命名路由，此时可以不写path选项
- \`query: {...}\` 以query方式传递参数
- \`params: {...}\` 以params方式传递参数，必须指定name选项
- \`active-class="xx"\` 当对应路由处于激活状态时，为组件添加class
- \`:replace="true"\` 开启历史记录的replace模式，可简写为\`replace\`
- 历史记录的replace模式：本次路径跳转将替换历史记录栈的最顶层
- \`<router-view></router-view>\` 激活的路由组件将渲染至该组件内部



实例化后，Vue实例新增属性：

- \`$router\`：全局的路由实例，是VueRouter构造方法的实例，其方法有：
  - \`push({同to的对象写法})\` 以push的方式访问指定路径
- \`replace({同to的对象写法})\` 以replace的方式访问指定路径
- \`back()/ forward()\` 回退到上一个历史记录 / 前进到下一个历史记录
- \`go(整数n)\` 路由前进/后退（-n表示后退n步）
- \`$route\`：当前路由信息对象。表示当前激活的路由的状态信息，其属性有：
  - \`name\` 路由名称
- \`path\` 当前路由的路径
- \`fullPath\` 完成解析后的URL，包含query和hash
- \`params\` 对象，params参数
- \`query\` 对象，query参数
- \`hash\` 当前路由的hash值（不带#）
  - \`matched\` 数组，包含当前匹配的路径中所有片段所对应的配置参数对象（routes配置对象）
  - \`meta\` 路由元信息



路由传参：

- query方式：
  - 浏览器中路由格式：\`.../一级/二级?参数1=值1&参数2=值2\`
- 获取：\`$route.query.参数1\`
- params方式：
  - 浏览器中路由格式： \`.../一级/二级/值1/值2\`
- VueRouter中routes选项的path属性：\`"二级/:属性1/:属性2"\`
- 获取：\`$route.params.属性1\`
- props：见VueRouter中routes配置的props选项



路由守卫：通常用于权限判断，下文router为VueRouter构造的实例对象

- 全局前置路由守卫：\`router.beforeEach( fn(to,from,next){} )\` 路由跳转前和初始化时被调用
- \`to\` 与 \`from\` 为目标路由/原路由的路由信息对象
- 调用\`next()\`进行跳转
- 全局后置路由守卫：\`router.afterEach( fn(to,from){} )\` 路由跳转后和初始化时被调用
- 导航路由守卫：在routes选项中添加\`beforeEnter: fn(to,from,next){}\` 没有后置守卫
- 组件内路由守卫：组件实例化时传入选项
- \`beforeRouteEnter(to,from,next){}\` 进入前，不能获取this
- \`beforeRouteUpdate(to,from,next){}\` 路由变更但组件被复用时
- \`beforeRouteLeave(to,from,next){}\` 离开前
- 路由守卫执行顺序为：\`beforeEach\` → \`beforeEnter\` → \`beforeRouterEnter\`

### Vue Test Utils

用于单元测试
`;
