
# Vue

Vue：声明式编程，原生：命令式编程
响应式：当实例中的数据发生改变的时候，页面会进行响应的变化
渐进式：渐进式意味着可以将Vue作为你应用的一部分嵌入其中，带来更丰富的交互体检
可以在一个项目中一点一点的嵌入Vue提供更丰富的交互体验
也可以利用vue全家桶满足各种各样的要求

## MVVM

`Model`  `ViewModel`  `View`

vm实例 是调度者  对model中国JS数据进行绑定并解析到view 的DOM中，然后响应式的改变DOM中数据
vm把view中的事件响应来回调model中定义的函数

var vm = new Vue(options)
options对象，里面有很多属性
el 管理的DOM 值为字符串 | HTMLElement

data 数据 值为Object | 组件的data必须是一个函数

methods 定义一些方法

## 生命周期

一个事物从生成到结束的这一个周期，期间发生了很多相关的事情

## 编码规范

缩进 规范  空格  

## mustache语法
插值语法
`{{ something }}`
不仅可以写变量 也可写简单表达式
## 其他指令
```html
<!-- v-once 只执行一次 -->
<h1 v-once>{{something}}</h1>
<!-- v-html 差值表达式为 html内容 -->
<h1 v-html="something"></h1>
<!-- v-text差值表达式为text内容 -->
<h1 v-text="something"></h1>
<!-- v-pre 将标签里面的内容最原始的显示 ，即时里面有mustache语法，并不会解析 -->
<h1 v-pre>{{something}}</h1>
<h1 v-cloak>{{something}}</h1>//{{something}}
```
`cloak`斗篷在vue解析之前，div中有一个属性v-cloak解析之后div没有一个属性v-cloak,避免闪现情况
## 绑定

**v-bind**绑定属性
绑定的属性**值**被当做变量来执行
语法糖 缩写 ` : ` , `:src

+ 绑定class属性

```html
<h1 :class="active"> </h1>
```

1. 对象语法,可以和普通class属性共存

```html
<h1 :class="{类名1:boolean,类名2:boolean}" class="active"> </h1>
<!-- 也可以通过函数返回一个对象 来进行class对象的绑定 -->
```

2. 数组语法

```html
<h1 :class="['active','line','title']"> </h1>
<h1 :class="[active,line,title]"> </h1>
<!-- 不加引号 就是变量来进行解析 -->
```

+ 样式绑定 :style  

1. 对象语法
v-bind:style = "{key(属性名):value(属性值)}"
值需要加单引号 不然会以变量进行解析
2. 数组语法
```html
<div v-bind:style = "[{key(属性名):value(属性值)},{key(属性名):value(属性值)},{key(属性名):value(属性值)}]"></div>
```

## 计算属性

当数据需要在页面中显示时，需要通过某种变化之后再显示到页面，或者需要将多个数据结合起来进行显示，利用计算属性完成各种复杂的逻辑运算等最终只返回一个结果 直接使用

计算属性一般是没有set方法，只读属性

```js
computed:{
  fullname：{
    get: function() {
    return something + something
    }
  }
}
```
可简写为 ↓↓↓
属性的形式起函数名
```js
computed:{
  fullname(){
    return something + something
  }
}
```
设置set变为非只读属性(不常用)
```js
computed:{
  fullname：{
    set: function(newValue) {
      this.name = newValue
    }
    get: function() {
    return something + something
    }
  }
}
```
**computed和methods的对比**
`methods`每使用一次方法 就会调用一次函数
而  
`computed`计算属性 只需要执行一次，进行缓存，只要数据没变化 直接返回第一次的结果
如果计算属性内部的数据变化了也会在页面上动态的变化

## let/var

JavaScript 的作者: Brendan Eich

## const

变成常量，不能随便修改的，不可再次赋值

即当我们修饰的标识符不会再次被赋值时，就可以使用const来保证数据的安全

建议 在ES6开发中，优先使用const 只有需要修改某一个标识符的时候才用

## 对象的增强写法

对象字面量可简写 属性 和 方法

## 事件监听

v-on 用来绑定事件
语法糖为 `@`

```html
<button @click="function">nihao</button>
```

事件调用的 方法没有参数

1. 如果方法没有参数 可直接写方法名，`这个时候vue会默认将浏览器生产的event事件对象作为参数传入方法中。`

2. 但是方法本身是需要一个参数的，这个时候传入的一个参数就是 人为传入的参数

3. 如果又想使用event对象 和传入自己的参数 (event, abc)这个时候 第一个参数默认是event对象，第二个参数就是自定义的参数

4. 如果想手动的使用event对象，可以在传入传输的时候添加`$`符号

  ```js
  <button @click="function(abc, $event)>ok</button>
  ```

5. 在事件绑定的方法参数中，如果参数没有 单引号 包裹 ，会被认为一个变量来执行，如果有 就是一个字符串

## 事件修饰符

stop 阻止事件冒泡  
prevent 阻止默认事件  
keyup 按键事件，自定义按键。键修饰符  
.native  **监听`组件``根元素`的原生事件**
once 事件只触发一次  

## 条件判断

### v-if = boolean

条件渲染
在页面中是否要  **渲染**  
条件为false时，包含v-if指令的元素，根本就不会存在dom中，相当于移除了该元素

v-else-if
v-else

### v-show = boolean

是否在页面上**显示**
条件为false时，包含v-for指令的元素，只是给元素添加了一个display：none行内样式，还存在dom中

### 适用时机

使用评率高的的时候就用v-show

## v-for 循环遍历

遍历数组

```html
<li v-for="(item, index) in items"></li>
```

遍历对象，遍历一个对象里面的 键、值，也可以遍历索引

```html
<li v-for="(value, key, index) in items"></li>
```

不绑定key过程，插值数组的情况：

![v-for](v-for渲染.png)

## 响应式

当某些数据改变 vm会对页面进行响应式渲染

### 哪些是响应式

给v-for绑定遍历的数组 `通过push、pop、shift、unshift、splice修改，会触发响应式`  

splice作用删除、插入、替换，会根据第二个参数来改变

第二个参数起了重要作用
splice(start,num,...arguments)

但是 如果 `通过索引修改数组的值` `不会触发`  
解决办法就是  

1. 利用splice来触发响应式  


2. 利用vue的set方法

Vue.set(arr, index, newvalue)
arr 需要修改的数组
index 修改项的索引值
newvalue 修改的新值

arr[1] = '123'
arr.splice(1, 1, '123') 功能上是等价的

### input 复用问题

vue虚拟dom会节省渲染成本，复用原生dom已有的东西
解决办法就是
加一个 key 将它作为一个标识，如果前后key值不一样，将会重新渲染

## 编程范式

面向对象编程 封装性 多态性，，第一公民：对象

函数式编程，第一公民：函数

高阶函数 reduce filter map

## 表单绑定v-model

实现表单数据 和 data 的 `双向绑定`

双向：v-bind：value  <-->  v-on:input
@input 监听表单输入事件

radio

```html
<input type="radio" value="nan" v-model="msg"> nan
<input type="radio" value="nv" v-model="msg"> nv
双向绑定的值 value 为 radio 中的 value值
data:{
  msg:nan
}
```

checkbox 单选框

```html
<input type="CheckBox"  v-model="msg"> 
双向绑定的值 value 为 true 或者 false
data:{
  msg:disabled
}
```

checkbox 多选框

```html
<input type="checkbox"  v-model="msg" value="打篮球1">
<input type="checkbox"  v-model="msg" value="打篮球2">
<input type="checkbox"  v-model="msg" value="打篮球3">
<input type="checkbox"  v-model="msg" value="打篮球4">
<!-- 双向绑定的值 value 为 chackbox中的值，而data中 必须为一个数组 -->
```

### 值绑定

很多时候value是服务器传过来不能写死，所以需要动态的变化

```html
<label v-for="item in hobbies" :for="item">
<input type="checkbox" :id="item" value="item" v-model="hobbies"> </input>
</label>
data:{
  hobbies:[]
}
```

## v-model修饰符

1. lazy 不用lazy 数据会实时更新频率太快，有时候只需最后结果的时候才绑定一个值，加了lazy修饰符 需要输入回车键 才进行绑定
2. number 需要输入框输入数字, 有时候需要输入的内容为number类型，虽然可设置input 的type 为 number 但是在数据绑定的时候 默认会吧数字绑定为string类型 添加number 修饰符之后就可以绑定为number类型
3. 去除字符换左右两边的空格

## 组件化

什么是组件化 
面对复杂问题  任何人处理复杂文字能力有限，不可能一次性搞定一大堆内容，但是可以将问题进行拆解，一个一个去解决小问题，再放在其整体中，大问题也会迎刃而解

组件化也是如此 将一个页面中所有的处理逻辑全部放在一起 处理起来非常复杂 不利于后续的管理一起扩展
将一个页面拆成一个个小的功能块，每个功能块完成属于自己的独立部分的功能，那么之后整个页面的管理和维护就变得容易了

将完成的页面分成多个组件 每个组件都能完成自身的功能

vue组件化思想 开发出一个个独立的可复用的小组件来构造我们的应用
任何的应用都会被抽象成一颗组件

### 组件使用三个步骤

1. 创建组件构造器 调用Vue.extend()方法 创建组件构造器
  创建组件构造器时，传入template代表我们自定义组件的模板，该模板就是使用到组件的地方，要显示的HTML代码

  ```js
  const tmp = Vue.extend({
    template: `<div><h2>this is component</h2></div>`
  })
  ```  

2. 注册组件 Vue.component()方法注册组件

全局注册

```js
Vue.component('my-con', tmp) 
```

局部注册
```js
const vm =new Vue({
  data:{},
  methods:{},
  components:{
    my-con: tmp
  }
})
```
3. 使用组件 在vue实例范围内使用组件

### 父、子组件
```js
//子组件
const tmp1 = VUe.extend({
  template: `<div><h2>this is component</h2></div>`
})

// 父组件
const tmp = Vue.extend({
  template: `<div><h2>this is component</h2></div>`,
  components:{
    cpt1:tmp1
  }
})

// 挂载到vm
const vm =new Vue({
  data:{},
  methods:{},
  components:{
    my-con: tmp
  }
})
```

子组件错误用法，当一个子组件com1中嵌套另一个子组件com2,这个时候把com2子组件在vm中直接使用，vm实例去解析时是会报错的，没有这个组件

构建注册组件语法糖

```js
// 全局
Vue.component('my-com',{
  template: `<div><h2>this is component</h2></div>`
})

// 局部
const vm =new Vue({
  data:{},
  methods:{},
  components:{
    my-con: {
      template: `<div><h2>this is component</h2></div>`
    }
  }
})
```

### 组件模板分离写法

用一个指定的id先定义个模板
然后注册组件时 template 指定该id

```js
<template id="tmp">hahahaha</template>

const tmp = Vue.component('my-com', {
  template: '#tmp'
})
```

### 组件自身的属性数据

每个组件都类似一个vue实例都有自己的 data和 methods生命周期等等

每个组件都有属于自己的数据，但是不能直接访问父组件的数据

`组件中的data`必须为一个 `方法` 并且要返回对象数据

**why is it a function ?**
组件的实例都是引用同一个data属性，如果定义的仅仅是一个对象，那每个实例的data属性都会存储同一个地址，修改器中一个 其他组件的实例都会被修改，如果为函数，那么返回一个新的对象地址，就不会相互影响

## 父子组件的通信

开发中，往往一些数据需要从上层传递到下层
比如服务器请求到了很多数据，其中一部分并非整个页面的大组件来展示的 需要下面的子组件进行展示，这个时候不会让子组件再一次发送一个网络请求，而是直接让父组件将数据传递给小组件

如果传值

1. 通过props向子组件传递数据
  在子组件标签使用时传入父组件变量

  ```html
  <com :msg="msg"></com>
  ```

  要求传入时需要使用v-bind:绑定不然为`普通字符串`  
  传入值在子组件中用`props`接受
  用数组接受

  ```js
  const child = new Vue({
    template: '<div>{{msg}}</div>',
    data:{
      return {

      }
    },
    methods:{},
    props:['msg']
  })
  ```

  其他写法用对象接受, 可以设置传入值的类型的验证, 是数组还是对象等等
  
  ```js
  props: {
    msg:String,
    movies:Array
  }
  ```

  还可以设置默认值, 同时还可以设置数据类型,required表示必须传入值，不然会报错  
  vue2.5.16以上 默认类型为数组或者对象时，**默认的数据类型必须是一个函数,并return返回数组**

  ```js
  props:{
    msg:{
      type: String,
      default: 'nothing',
      required: true
    }
  }
  ```

  **注意**
  当子组件中props中接受的变量名不支持驼峰写法: myChild, 最好写成my-child
2. 通过事件向父组件发送信息  $emit Events
  在子组件标签中添加一个事件监听, 如同 <input @change="change" type="type">监听事件一样:  
  先添加事件监听childclick, 然后当子组件触发事件并传入值，父组件触发fatherfn并接收args

  ```html
  <com @childclick="fatherfn"></com>
  ```

  ```js
  <!-- 子组件触发childclick事件，并传入参数 -->
  this.$emit('childclick', args)

  <!-- 父组件触发事件接收参数 -->
  fatherfn(args) {
    this.newData = args
  }
  ```

## 父子组件传值时的v-model双向绑定问题

  当父组件传值给子组件时， 用props接收:

  ```js
  props:{
    msg: fatermsg
  }
  ```

  同时在子组件中用v-model绑定父组件传进来的值  

  ```js
  <input type="text" v-model="fnumber1">
  ```

  此时会报错， 父组件主要是传数据给子组件，并不是想通过子组件去修改，还是通过父组件来改变，两边同时修改会乱套  
  如果还是想双向绑定，可以用 子组件的 `data` 或者 `computed property` 来进行修改更合适

### 直接的访问方式

1. 父访问子  
    + this.$children[index] 可以获取到第 index 个子组件  
    + 也可以通过给子`组件的标签` 添加 `ref='名称'`, 然后通过父组件中使用this.$refs.名称 获取一个**子组件的对象**，并可以使用子组件的任何属性
2. 子访问父
    + 通过`$parent`获取父组件的对象
3. 访问根组件
    + this.$root 获取到根组件也就是 `vue`实例

## 插槽

+ 组件中的插槽是为了封装的组件更加具有扩展性
+ 让使用者可以决定组件内部的一些内容到底展示什么

有些组件它具有相同结构，但是在某些时候某一部分不一样  
用法:  
+ 可以在子组件中预留坑位 <slot></slot>, 然后在子组件的标签中填相应的内容去填坑
+ 同时留坑时可以设置默认值，在组件中填坑时有其他元素就会替换默认值
+ 填坑内容有多少就会填多少

### 具名插槽
有时候一个插槽并不满足要求，定义多个插槽去留坑，此时只需要填坑某一个， 如果直接填坑，就会把所有的坑都填了。  
所以此时需要给留坑的插槽定义一个名称 name ，在填坑时指定插槽去填坑，用slot='插槽名'

## 编译的作用域
父组件模板的所有东西都会在父级作用内编译；子组件模板的所有东西都会在子级组用于内编译  
标签上使用的变量 会在属于当前哪个模板下的实例去寻找  
```js
<div id='app'>
  <com v-show='isShow'></com>
</div>
```
如果 此时 父组件app 和 子组件都有一个data属性 为 isShow， 这个时候会在当前模板 也就是 app 下查找 isShow 变量  

### 作用域插槽  
目的是获取子组件中的数据  
当父组件使用子组件中的插槽时，想要使用子组件的数据进行另一种方式进行展示，此时可以让子组件给slot传值，在父组件的内容下进行使用
```html
<div id='app'>
  <com>
    <template slot-scope='slot'> <!-- 用slot-scope接受slot变量 -->
      <!-- <span v-for='item in slot.data'>{{item}}-</span> -->
      <span>{{slot.data.join(`-  ·  -`)}}</span>
    </template>
  </com>
</div>
<!-- vue2.5.x一下必须有一个template模板 -->
<template id="cpt">
  <div>
    <slot :data='list'> <!-- 在slot中传值 -->
      <ul>
        <li v-for='item in list'>{{item}}</li>
      </ul> 
    </slot>
  </div>
</template>
```

在<slot></slot>中传值可以是多个，此时slot-scope中接受的 slot变量对象中存储着传入的数据

```js
var vm = new Vue({
  el: '#app',
  data: {},
  methods: {},
  components: {
    com: {
      template: '#cpt',
      data() {
        return {
          list: ['a', 'b', 'c', 'd']
        }
      }
    }
  }
})

```

## 组件化开发

## 模块化开发

模块化是解决一个复杂问题时 从顶端到下层把系统划分为若干个模块的过程，有多重属性，分别反映其内部的特性。
用来分割，组织和打包软件，每个模块完成一定的子功能呢，所有的模块安某种方法组装在一起，成为一个整体，完成整个系统要求的功能

ajax 前后端分离

多人开发复杂 多人全局变量重名问题

解决

1. 匿名闭包 --> 代码复用性低
2. 模块化

+ 闭包返回对象 解决复用性低
+ 规范的模块化方案

规范模块化规范
AMD,CMD,CommonJS, ES6的Modules

CommonJS:

+ 核心:导入 导出
+ 导出: module.exports = {flag: flag,sum: sum} 需要有专门的解析,前端浏览器不识别
+ 导入: let {flag, sum} = require('./xxx.js') ↑↑↑

ES6 Modules:

1. 核心 导入 导出
2. 使用：在浏览器中 script标签加入 type=module 让浏览器识别
3. 作用域仅是当前文件，别个文件不能直接访问，需要导出
4. 导出：

+ 导出对象 export {a,b}
+ 导出变量 export let a = a
+ 导出类或者函数 export class A，export function fn() {}

5. export default

+ 有的时候不想使用导入的名字，希望使用别人的变量但是自己命名
+ export default 只能有一个
+ 并且 导入的时候需要 直接使用自定义名 不能用{}
+ import Sth from './xxx.js' √
+ import {Sth} from './xxx.js' ×

6. 导出

  + import {a,b} from './xxx.js'
  + 此时{}里面的变量名 必须和 导出的变量名称相同
  + 也可以使用 * 通配符 一次导入多个 再在需要时使用
  + import * as info form './xx.js'
  + info.name info.age ....

## webpack

浏览器只能用ES6模块化功能

**gulp** 
核心是Task
配置一些利task，定义task要处理的事务 ES6 ts转化 图片压缩
让gulp依次来执行这个task，让整个流程自动化
前端自动化任务管理工具


没有模块化概念
处理简单的模块化依赖关系，没有严格配置，不能处理复杂的模块化
而webpack可以使用 各种 模块化


现代的JavaScript应用的`静态模块`打包工具，它处理不同规范的模块化和模块之间的相互依赖关系，并将其整合打包。是一种模块化的解决方案，不仅是js，css、图片、json文件等等在webpack中都一个被当做模块来使用，还能把不同文件转换成浏览器识别的
文件，最终集合成一个简单的包

打包 将webpack中各种资源模块进行打包合成一个或多个包，打包过程中对各种资源进行处理 将scss转成css 将ES6语法转成ES5语法，将TypeScript转成JavaScript等操作

主要是处理模块化，其他的压缩打包只是一个附加功能。


**webpack**
webpack执行环境 node
node为了正常执行很多代码，必须要有很多各种依赖的包

npm工具提供了各种各样的包

### 安装

npm 安装 webpack

```shell
npm  install webpack@3.6.0

```

### 局部和全局都需要安装webpack

webapack 文件目录

- --dist(distribution) 最终打包成的文件
- --src(source)
  - --main.js(index.js) 入口文件
- --index.html 最终也会打包到 dist 文件夹

打包命令 webpack --mode=production ./src/main.js --output-filename bundle.js --output-path ./dist

### 设置快捷打包配置

1. 先 npm init 生成node相关依赖包
2. 在目录建立webpack.config.js
  + 配置webpak
  ```js
  // 配置 webpack 文件 直接打包方式
  const path = require('path')
  console.log(path.resolve(__dirname, 'dist'))
  module.exports = {
    // 模式
    mode: 'development',
    //入口
    entry: './src/main.js',
    //出口
    output: {
      // 动态获取路径 必须是绝对路径
      path: path.join(__dirname, 'dist'),
      filename: 'bundle.js'
    }
  }
  ```

3. 直接输出命令 webpack 进行打包到 dist中

4. npm run build 映射 webpack 
  ```js
    "scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "build": "webpack"
  }
  ```

优先从本地查找webpack，直接webpack是从全局查找  
5. 安装本地webpack npm i webpack --save-dev

--save-dev: 开发时才用的包
--save: 打包后还要依赖的包

### loader

是webpack中一个非常核心的概念  
有时候也需要加载css 图片 也包括一些高级的将ES6转成ES5 ts 转成js .jsx .vue转成js文件等等  
对于webpack 本身能力来说 是不支持的  
给webpack扩展对应的loader就可以了  

引入 css 
require('./xx.css')
需要安装 css loader扩展,但只负责将css文件进行加载，不负责解析  
安装 style-loader 负责将样式添加到DOm中  
配置 匹配规则

```js
module: {
  rules: [
    {
      test: /\.css$/,  // 此处不能是字符串！！！！！'/\.css$/'
      use: ['style-loader','css-loader']
    }
  ]
}
```

use 是从右向左进行的 先css-loader 再加载style-loader

引入 less  
安装 less-loader  
配置匹配规则  
use:[style-loader <<-- css-loader <<--  less-loader]  

引入图片集资源  
安装url-loader扩展  
配置匹配规则  

```js
{
  test: /\.(jpg|jpeg|png|gif)$/,
  use: ['url-style'],
  options: {
    limit: 10000
  }
}

小于limit值 会被编译成base64字符串格式的图片
大于limit 不会编译成base64 会直接打包到dist文件夹 并用hash值命名

但是虽然自动把生成的图片打包到的dist文件 但是开发中引用的是img目录的图片，被打包到dist文件中后，此时图片被引用的地址是index.html同级的当前目录，需要在webpack.config.js中做一个配置 publicPath: 'dist/' 这样引用的地址会是dist中的图片.
配置之后任何的url都会自动添加dist/

output: {
  // 动态获取路径
  path: path.join(__dirname, 'dist'),
  filename: 'bundle.js',
  publicPath:'dist/'
}
```

## 转换ES6
有些浏览器或许还`不支持es6`，没有很好运行代码。
要转换就需要使用babel  
安装对应的loader就行了  
```shell
npm install-save-dev babel-loader@7 babel-core babel-preset-se2015

# 另一种安装内容
npm install babel-loader babel-core babel-preset-env
```
**配置webpak**  [官方配置](https://www.webpackjs.com/loaders/babel-loader/)
```js
{
  test: /\.js$/,
  // exclude排除
  // includeb包含
  exclude: /(node_modules|bower_components)/,
  use: {
    loader: 'babel-loader',
    options: {
      presets: ['es2015']
    }
  }
}
```

## 在webpack中配置vue
```shell
npm i vue --save
```
### 引用
```js
import Vue from 'vue'
const app = new Vue({
  el:'',
  data:{},
  methods:{}
})
```
运行时会发现不能运行 会报错 `runtime only`引入的vue包 不完整，需要手动设置引入路径

在webpack中配置引入路径，resolve与entry`同级`
```js
  resolve: {
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  }
```

### webpack中的vue开发
一般index.html里面什么都不用做，只需一个<div id='app'></div>  
在开发中，在vue实例中加入template模板:
```js
new Vue({
  el:'#app',
  template:'<div><h2>123</h2></div>',
  data:{},
  methods:{}
})
```
此时template的内容会覆盖`el:#app`的内容  
但是实际开发中template内容较多，全都写在vue实例中不太好 抽离出来，挂载到components中
```js
const app = require('./js/app.js')
new Vue({
  el: '#app',
  template: '<app/>',
  components: {
    app
  }
})
```

这样的写法完全可以 把 `const app`这一坨对象封装到一个js模块中,然后`export default app`暴露出来 再在main.js中接受
```js
const app = {
  template: '<div><h2>{{msg}}</h2></div>',
  data() {
    return {
      msg: 'message'
    }
  },
  methods: {

  }
}
export default app
```
再进一步 vue 实现了更简便的方法 用一个`vue`后缀的模板来实现上诉复杂的功能  
然而webpack并不能识别 `.vue` 所以需要相对应的`loader` 即: `vue-loader` `vue-template-compiler`来进行的打包  

省略扩展名的webpack配置 添加extensions项
```js
resolve: {
  extensions: ['.js', '.html', '.vue', '.css'],
  alias: {
    'vue$': 'vue/dist/vue.esm.js'
  }
}
```

## webpack 插件
1. 添加版权声明的插件
plugins:[
  new webpack.BannerPlugin('dzzgd © 版权所有')
]
2. Htmlwebpackplugin
真实项目发布时，发布的是dist文件夹中的内容，但是dist中没有index.html文件，那么打包的js文件也就没有意义了

此时这个插件会自动的在我们dist生成对应的index.html文件，但是此时配置了publicpath为dist 所有这个时候引入dist/bundle.js反而错了 ，需要把 publicpath这一项去掉

### 生成自定义模板
根据自定义配置生成自定义的模板
```js
plugins: [
  new VueLoaderPlugin(),
  new webpack.BannerPlugin('dzzgd © 最终版权所有'),
  new HtmlWebpackPlugin({
    template: 'index.html',
    title: 'xx'
    ...
  })
]
```
可以设置网页标题,插入位置,原始模板等等

### 压缩js代码
使用丑化插件`uglifyjs-webpack-plugin@1.1.1`
```js
npm i uglifyjs-webpack-plugin --save-dev
```
在开发中不建议使用丑化，第一会让代码都丑化了，变量都被改变并且注释都没有了，不便于代码在浏览器调试，第二回加大开发时打开时的速度，只需要项目完成时最后一次打包时进行丑化


### 搭建本地服务器
webpack-dev-server@2.9.3,开启一个服务器将打包的文件暂时放在内存中加快打包速度  
webpack配置devserver， 与`entry同级`
```js
devServer:{
  // port: 520,
  inline:true,
  contentBase:'./dist',
  open: true
}
```
inline: 实时刷新页面  
contentBase: 为哪一个文件夹提供本地服务  
open:自动打开网页
启动服务
```shell
webpack-der-server
```
但是此时会报错 因为直接执行`webpack-der-server`会在全局里面去找这个文件或者指令，肯定找不到，所以需要在`package.json`里面配置一个 `script` `优先`从当`前面目录`中查找
```js
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "build": "webpack",
  "dev": "webpack-dev-server"
}
``` 
### webpack配置分离
发布时和开发时的不同,将webpack分为3部分 `base.config.js` `dev.config.js` `prod.config.js`

**base.config.js**:
```js
//生产配置
// 配置 webpack 文件 直接打包方式
const path = require('path')
const VueLoaderPlugin = require('vue-loader/lib/plugin')
const webpack = require('webpack')
const HtmlWebpackPlugin = require('html-webpack-plugin')
module.exports = {
  // 模式
  // mode: 'development',
  //入口
  entry: './src/main.js',
  //出口
  output: {
    // 动态获取路径
    path: path.join(__dirname, '../dist'),
    filename: 'bundle.js',
    // publicPath: 'dist/'
  },
  module: {
    rules: [
      {
        test: /\.css$/,
        use: ['style-loader', 'css-loader']
      },
      {
        test: /\.(jpg|jpeg|png|gif)$/,
        use: {
          loader: 'url-loader',
          options: {
            limit: 10000,
            name: 'img/[name].[hash:8].[ext]'
          }
        }
      },
      {
        test: /\.js$/,
        // exclude排除
        // includeb包含
        exclude: /(node_modules|bower_components)/,
        use: {
          loader: 'babel-loader',
          options: {
            presets: ['es2015']
          }
        }
      },
      {
        test: /\.vue$/,
        use: ['vue-loader']
      }
    ]
  },
  resolve: {
    extensions: ['.js', '.html', '.vue', '.css'],
    alias: {
      'vue$': 'vue/dist/vue.esm.js'
    }
  },
  plugins: [
    new VueLoaderPlugin(),
    new webpack.BannerPlugin('dzzgd © 最终版权所有'),
    new HtmlWebpackPlugin({
      template: 'index.html'
    }),
  ]
}
```
**dev.config.js**
```js
// 开发配置
const baseConfig = require('./base.config.js')
const webpackMerge = require('webpack-merge')
module.exports = webpackMerge(baseConfig, {
  devServer: {
    // port: 520,
    inline: true,
    contentBase: './dist'
  }
})

```
 **prod.config.js**
```js
//生产配置
const UglifyjsWebpackPlugin = require('uglifyjs-webpack-plugin')
const baseConfig = require('./base.config.js')
const webpackMerge = require('webpack-merge')
module.exports = webpackMerge(baseConfig, {
  plugins: [
    new UglifyjsWebpackPlugin()
  ]
})
```
webpack-merge的作用就是将自身配置文件和base基本配置合并起来  
在package.json中的配置也需要做相应的改变:  
```js
"scripts": {
  "test": "echo \"Error: no test specified\" && exit 1",
  "build": "webpack --config ./build/prod.config.js",
  "dev": "webpack-dev-server --config ./build/dev.config.js"
}
```

## vue-cli(俗称脚手架) -- Command-Line Interface  
使用vue.js开发大型应用时，需要考虑目录结构、项目结构和部署、热加载、代码单元等事情  
如果每一个项目都要手动完成这些工作，则效率非常低，使用脚手架工具来帮助完成这些事情
### 安装 
```shell
npm i -g @vue/cli 
#脚手架3
```  
这个时候用依照cli2的方式初始化项目行不通  
可以拉取  vue-cli2的模板

### 创建项目
vue-cli 2.0初始化项目
```shell
vue init webpack xx 
# xx:项目名称(不使用中文)
```
然后进行一些基本配置: 
```shell
project name   
project description  
...
...
...
Use EsLint to lint your code
# 是否规范化代码
Set up unit tests 
# 单元测试
Setup e2e tests with Nightwatch
# e2e: end to end 端到端测试 自动化测试
```
### 项目目录
各自作用

### 关闭eslint

config --> index.js --> dev --> useEslint: false 

### 配置别名  
zai webpack.base.conf.js 中的resolve选项中:
```js
function resolve(dir) {
  return path.join(__dirname, '..', dir)
}

resolve: {
  // 省略后缀名
  extensions: ['.js', '.vue', '.json'],
  alias: {
    '@': resolve('src'),
    '@components': resolve('src/components'),
    '@assets': resolve('src/assets'),
    '@views': resolve('src/views')
  }
  // 不一定要使用'@',只是为了区别普通路径还是别名路径
}
```

## runtimeCompiler && runtimeOnly
主要在main.js中的差异

**runtimeCompiler**

```js
new Vue({
  del: '#app',
  template: '<App/>',
  components: {App}
})
```

template --parse--> ast --compiler--> render(fx) --render--> virtualDOM --update--> DOM
**runtimeOnly**

```js
new Vue({
  el: '#app',
  render: createElement => {
    return createElement(App)
  }
})
```

render(fx) --> visualDOM --> DOM
runtimeOnly代码量更少(6kb)，效率更高, 安装的vue-template-compiler已经将文件中的<template></template>编译成一个渲染函数，所以在生产环节时，将已经编译好的渲染函数打包到最终的js文件中

## vuecli3

初始化项目:  

```shell
vue create 项目名称
.
.
.
PWA upport
.
.
.
save this as a preset for future projects 是否把配置保存为下次创建使用
```

+ 项目目录  
  少了 build 和 config 并把static移除 改为public
+ package.json  
  其中的script 改变 利用了 一个专门的包`vue/cli-service`把所有的配置都内置，所以看不见 所以执行终端命令时 但是本质是一样的
+ main.js  
  Vue.config.productionTip = false 构建信息
  $mount('#app') 与 el:'#app' 功能一样

### vue ui

可视化的方式配置项目

### 创建自己的配置  
创建一个固定文件名的文件 vue.config.js 将配置写在里面 并利用 module.exports = {}暴露出去，在运行时 脚手架会自动进行合并配置, [详情](https://segmentfault.com/a/1190000016101954?utm_source=tag-newest)  

```js
pages: {
  index: { 
    // entry for the pages
    entry: 'src/pages/index/index.js',
    // the source template
    template: 'src/pages/index/index.html',
    // output as dist/index.html
    filename: 'index.html',
    // when using title option,
    // template title tag needs to be <title><%= htmlWebpackPlugin.options.title %></title>
    title: '首页',
    // chunks to include on this pages, by default includes
    // extracted common chunks and vendor chunks.
    chunks: ['chunk-vendors', 'chunk-common', 'index']
  }
}
...
```

## 箭头函数 和 this指向  

问题: 箭头函数中的this是如何查找的？
答案: 向外层作用域中, 一层层查找this, 知道有this的定义。
箭头函数的this引用的就是最近作用域中的this  

```js
const obj = {
  fn() {
    setTimeout(function() {
      console.log(this)  // --> window
    })

    setTimeout(() => {
      console.log(this)  // --> obj
    })
  }
}
obj.fn()
```

## vue-router

### 路由

什么是路由? 就是通过互联的网络把信息从源地址传输到目的地址的互动--维基百科  
路由中有个非常重要的概念叫路由表 
路由表本质就是一个映射表，决定数据包的指向  

**前端渲染&后端渲染**  
后端路由阶段 后端渲染 后端渲染完 在发给前端

前后端分离阶段  
随着ajax的出现，有了前后端分离的开发模式  
后端只提供API来返回数据，全都通过Ajax获取数据，并通过JavaScript将数据渲染到页面中  
这样最大的有点就是前后端责任的清晰，后端专注于数据输出，前端专注于交互和可视化上
移动端出现后，后端不需要进行任何处理，依然使用之前的一套API即可  

单页面富应用阶段
SPA最主要的特点就是前后端分离基础上加了一层前端路由  
也就是前端来维护一套路由规则  
前端路由核心是什么，改变URL，但是页面不进行整体刷新

### 前端路由

href：hyper reference  

1. hash  
  window.location.href  
2. history
  类似于栈的储存结构，先进后出  
  history.pushState({}, '', 'home') 设置路径  
  history.replaceState({}, '', 'home') 替换路径  
  history.back() = history.go(-1) 后退  
  history.forward() = history.go(1) 前进  

### Vue-Router

安装  

```shell
npm i vue-router --save
```

使用  在模块化工程使用它 通过vue.use()来使用

```js
// 配置路由相关的信息
import vueRouter from 'vue-router'
import vue from 'vue'
// 1. 通过vue.use(插件)安装这个插件(vue-router)
vue.use(vueRouter)

// 2.创建一个路由对象  
const routes = [
  
]
const router = new vueRouter({
  // 配置路由和组件之间的应用关系
  routes
})

// 3. 将router实例传入到Vue实例
export default router
```

```js
import Vue from 'vue'
import App from './App'
// 引入路由
import router from './router'
// 如果是目录会自动寻找index.js文件
Vue.config.productionTip = false

/* eslint-disable no-new */
new Vue({
  el: '#app',
  // 挂载路由
  router,
  render: h => h(App)
})
```

路由的默认路径

```js
path: '/',        //加不加 `/` 效果一样
redirect: '/Home' //重定向到主页
```

路由默认是hash模式 带有 `#` 不太美观...  
在创建vue-router实例的时候添加一个`mode: 'history'`配置就可以把`#`去除

```js

const router = new vueRouter({
  // 配置路由和组件之间的应用关系
  routes,
  mode: 'history'
})
```

### router-link  其他属性

to  链接跳入到某个路由
tag  将标签渲染为某个指定标签
replace 使用replaceState方式切换路由  
router-link-active 当切换到某个路由 router-link 标签会增加一个类名router-link-active, 该类名可以修改 在router-link中修改或者在路由实例中修改

```js
const router = new vueRouter({
  // 配置路由和组件之间的应用关系
  routes,
  mode: 'history',
  linkActiveClass: 'active'
})
```

### 通过代码跳转路由

$router是全局router实例的属性
this.$router.push('/xxx')
this.$router.replace('/xxx')

多次点击通过代码跳转会报 `警告`, 利用catch捕获

```js
import VueRouter from 'vue-router'
Vue.use(VueRouter)
const originalPush = VueRouter.prototype.push
VueRouter.prototype.push = function push(location) {
  return originalPush.call(this, location).catch(err => err)
}
```

### 动态路由

有时候需要user/10037583等动态设置路由跳转指定内容的页面  

路由映射的时候配置路由添加占位符:

$this.route.param处于哪一个组件状态toute就是哪个组件的属性  

### 路由的懒加载

js打包构成 (dist文件下)
app：当前应用程序开发的所有代码(业务代码)
mainfest 为了打包的代码做底层支撑
vendor 提供商/第三方包 vue/VUE-ROUTER-AXIOS/BS

bundle.js 文件过大造成页面短暂空白
把不同的路由对应的组件分割成不同的代码块，然后当路由而被访问的时候才加载对应的组件，就更搞笑

懒加载  
将路由的组件打包成一个个的js代码块
只有在这个路由被访问到的时候，才加载对应的组件

方式一 结合vue的一部组件和webpack的代码分析

方式二 AMD写法

范十三 在ES6中，可以更加简单的写法来组织Vue异步组件和webpack的代码分割

const Home = () => import('../components/Home.vue)

### 嵌套路由

比如在home页面中，我们希望通过/home/newws和/home/message访问一些内容
一个路径映射一个组件，放着歌两个路径也会分别渲染这两个组件

步骤

1. 创建对应的子组件,并且在路径映射中配置对应的映射关系

  ```js
  {
    path: '/Home',
    component: Home,
    children: [
      {
        path: 'News',
        component: HomeNews
      }
    ]
  }
  ```

  **子组件路径不加 `/`**
2. 在组件内部使用router-view标签

嵌套默认路由也是用 redirect 重定向

### 参数传递

```html
<router-link :to='{path: "/Profile", query:{name:"dz",age:23}}'>档案</router-link>
```

利用this.$route.query 获取对象

### $router&$route

任何组件或者页面中的$router 都是一样的 都是vue-router 的实例对象

$route 当前活动页面才有的对象属性，每个页面不一样

所有的组件都继承了Vue的原型

### vue-router 导航守卫

[官方文档](https://router.vuejs.org/zh/guide/advanced/navigation-guards.html#%E7%BB%84%E4%BB%B6%E5%86%85%E7%9A%84%E5%AE%88%E5%8D%AB)
跳转的时候需要监听跳转触发一些事件  

meta:描述数据的数据  
每一个route对象里面都有一个meta原数据对象, 数据可以通过在路由映射时添加

```js
{
  path: '/Profile',
  component: Profile,
  meta:{
    title:'Profile'
  },
}

```

1. 全局守卫

    ```js
    // 前置钩子(hook)
    router.beforeEach((to, from, next) => {
      // 从from跳转到to
      document.title = to.matched[0].meta.title
      console.log(to)
      next()
    })
    ```

    ```js
    // 后置钩子
    router.afterEach((to, from) => {
      // 后置钩子没有next函数
    })
    ```

2. 路由独享守卫

    非常灵活, 用户登录判断跳转等等

    ```js
    {
      path: 'News',
      component: HomeNews,
      beforeEnter: (to, from, next) => {
        // document.title = to.matched.meta.title
        console.log(to)
        next()
      }
    }
    ```

3. 组件内守卫

```js
const Foo = {
  template: `...`,
  beforeRouteEnter (to, from, next) {
    // 在渲染该组件的对应路由被 confirm 前调用
    // 不！能！获取组件实例 `this`
    // 因为当守卫执行前，组件实例还没被创建
  },
  beforeRouteUpdate (to, from, next) {
    // 在当前路由改变，但是该组件被复用时调用
    // 举例来说，对于一个带有动态参数的路径 /foo/:id，在 /foo/1 和 /foo/2 之间跳转的时候，
    // 由于会渲染同样的 Foo 组件，因此组件实例会被复用。而这个钩子就会在这个情况下被调用。
    // 可以访问组件实例 `this`
  },
  beforeRouteLeave (to, from, next) {
    // 导航离开该组件的对应路由时调用
    // 可以访问组件实例 `this`
  }
}
```

beforeRouteEnter 守卫 不能 访问 this，因为守卫在导航确认前被调用,因此即将登场的新组件还没被创建  
用处: keep-alive 中保持页面内某一个子组件的显示状态, 其中需要取消缺省值, 组件跳转(beforeRouteLeave)前保存当前的path路径

## keep-alive

keep-alive是Vue内置的一个组件,可以被包含的组件保留状态,或避免被重新渲染  
有了keep-alive 可以使用activate(活跃) 的 deactivated(不活跃) 两个事件监听
两个属性:

include(包含)  
**exclude里不能有空格**

```html
<keep-alive exclude="profile,user">  
  <router-view></router-view>
</keep-alive>
```

exclude(不包含)  

## 封装tabbar组件  

尽量动态的进行显示,不能把内容写死, 利用插槽  
利用插槽时 尽量用个div包裹以防被使用时被替换后 slot上的属性被覆盖或者抹去  

## Vuex

是一个专为vue.js应用程序开发的状态管理模式  
它采用`集中式储存`管理应用的所有组件的状态, 并以响应的规则保证以一种可预测的方式发生变化  
Vuex也集成到Vue的官方调试工具`devtools extension`, 提供了诸如零配置的time-travel调试、状态快照导入导出等高级调试功能  

### 状态管理

当多个组件同时共享一个状态,又不能将状态管理放置到单一的某一个组件内部,而是需要将状态集中式储存,统一进行应用中的所有组件的状态  

简单的看成把需要多个组件共享的变量全部储存在一个对象里面  
可以在Vue的原型中添加共享的数据, 但是`不是` `响应式`的  

vue提供的插件vuex是`响应式`的

### 使用vuex

1. 安装插件  
import Vuex from 'vuex'

2. 创建对象

    ```js
    const store = new VueX.Store({
      state: {
        counter: 1000
      },
      mutations:{
        increment(state) {
          state.counter++
        },
        decrement(state) {
          state.counter--
        }
      },
      actions: {},
      getters: {},
      modules: {}
    })
    ```

3. 导出store独享

    ```js
    export default store
    ```

4. 挂载到Vue实例中

    ```js
    import store from 'store'
    new Vue({
      el: '#app',
      store,
      render: h => h(App)
    })
    ```

这样任何一个组件都能使用$store使用 store 状态管理里面的属性或者方法  
按照规定好的规定,进行访问和修改等操作  
actions 用来执行异步操作  
mutations 用来执行同步操作, 如果直接修改state 这样就不会知道来自哪里的修改, 需要经过mutations进行修改能被devtools跟踪  
通过$store访问管理的数据  

```js
this.$store.state.counter
```

在组件中通过`commit`调用store里面的方法, 第一个参数为调用的方法名  

```js
this.$store.commit('increment')
```

### 核心概念

1. State单一状态树(single source of truth)
将多个状态信息 统一规划到一个store中管理, 不推荐建立多个store
2. Getters基本使用  
  类似于计算属性的作用, 当某一个数据需要经过一些列变化时可以通计算属性获取

  ```js
  getters: {
    more20stu(state) {
      // 返回年龄大于24的数组, 这里的第一个参数为状态管理源
      return state.students.filter(s => s.age >= 24 )
    },
    more20stuLength(state, getters) {
      // getters中获取年龄大于24数组里面元素的个数, 第二个参数为getters
      return getters.more20stu.length
    },
    moreAgestu(state, getters) {
      // 返回一个方法来进行传参
      return function(age) {
        return state.students.filter( s=> s.age > age)
      }
    }
  }
    ```

  `getters` 中的方法不接受组件调用时直接传入参数, 利用返回一个函数来解决参数传递问题,如上面的`moreAgestu`  
3. Mutations状态更新  

  Vuex的store状态的更新`唯一方式`  
  包括两部分:
  + 字符串的事件类型(type)
  + 一个回调函数(handlder), 该回调函数的第一个参数就是state

  mutations的参数传递(提交风格)

  ```js
  mutations: {
    fn(state, params) {
      console.log(params)
    }
  }
  ```

  组件中:  

  ```js
  this.$store.commit('fn', 实参)
  ```

  实参可以为任意变量类型, 参数多个时采用对象的形式  
  参数被称为是mutations的载荷(Payload)  

  上面通过commit进行提交的是一种普通的方式  
  Vue还提供了了另外一个种风格, 它是一个包含type属性的对象  

  ```js
  addStu() {
    // 1. 普通的提交封装
    let stu = {name: 'dz4', age: 26}
    this.$store.commit('addStudents', stu)

    // 2. 特殊的提交封装,type表示调用的方法名,其他的都为传递的参数
    this.$store.commit({
      type: 'addStudents',
      stu: stu,
      name: 'dz7',
      age: 23
    })
  }
  ```

  注意采用特殊的提交封装的时候mutations里面的接受的参数为一个对象, 即传入的实参转为了一个对象的形式  
  这样的话mutations接受的参数不再是某一特定的类型, 所以把形参的变量名改为`payload`  

  ```js
  mutations: {
    fn(state, payload) {
      console.log(payload)
    }
  }
  ```

  Mutation响应规则
  Vuex的store总state是响应式的, 当state中的数据发生改变时, Vue组件会自动更新  
  这就需要遵守一些Vuex对应的规则:  
    + 提前在store中初始化好所需要的属性, 这些属性都会被加入到响应式系统中, 而响应式系统会监听属性的变化, 当属性发生变化是,会通知所有界面中用到该属性的地方,让界面发生刷新
    + 当给state中的对象添加新的属性时,默认不会触发响应式, 使用下面的方式会触发
    + 方式一  
    对象:Vue.set(state.obj, key, value) 添加到响应式系统中  
    数组:Vue.set(state.obj, index, value) 添加到响应式系统中  
    删除 `Vue.delete` 和 `Vue.set` 同理
    + 方式二
    用新对象给旧对象重新复制
    state.info = {...state.info, 'height': playload.height}

  Mutation 类型常量-概念  
  在mutations中定义了很多的方法, 当我们项目增大时,Vuex管理的状态越来越多,需要更新的状态情况也越来越多,那么意味着Mutation中的方法越来越多  
  方法过多,使用需要使用大量时间去记住这些方法,甚至多个文件间来回切换,查看方法名,甚至不复制的时候,还可能有写错的情况,多个commit时候会很麻烦也可能输入方法名时打错字母, 这个时候就可以定义类型的常量  
  新建一个mutations-types.js定义常量类型的文件,内容例如:  

  ```js
  export const INCREMENT = 'increment'
  ```

  在mutations中使用时:  

  ```js
  import {INCREMENT} from 'mutations-types.js'
  const store = new Vuex({
    mutations: {
      [INCREMENT](state, payload) {
        // do something
      }
    }
  })

  ```

  组件中使用时  

  ```js
  import {INCREMENT} from 'mutations-types.js'

  this.$store.commit(INREMENT, params)
  ```

  Mutation同步函数  

  通常情况下,Vuex要求mutation中的方法必须是同步的方法:
    + 主要原因是使用devtools时,可以帮我们捕捉mutation的快照
    + 但是如果是异步操作, devtools将不能很好的追踪这个操作什么时候被完成
4. Action的基本定义
  某些情况希望在Vuex中进行一些异步操作, 比如网络请求  
  Action类似于Mutation. 但是用来代替Mutation中的异步操作

  ```js
  Actions: {
    update(context, payload) {
      // context 上下文 代表store

      // 这里不能直接修改state
      // context.state.counter = 10 这样写是错误的因为这样绕过了mutation直接修改state

      // 改变的state的唯一方式是通过mutation
      setTimeout(() => {
        context.commit('foo', payload)
      }, 1000);
    }
  }
  ```

  异步完成后还需要进行一些完成后的提示  
  Actions中

  ```js
  Actions: {
    update(context, payload) {
      return new Promise(res => {
        setTimeout(() => {
          context.commit('updateCounter')
          res('完成了')
        }, 1000);
      })
    }
  }
  ```

  组件调用:

  ```js
  methods:{
    updateCounter() {
      // 1. 调用actions中的方法
      // this.$store.dispatch('aupdateCounter')

      // 2. 调用actions中的方法,并接受一个完成后提示信息
      this.$store
          .dispatch('aupdateCounter')
          .then(res => {
            console.log(res)
          })
    }
  }
  ```

  .
5. vuex-modules  

+ vue使用单一状态树, 就意味着有很多的状态都要交给Vuex来管理  
+ 当应用变得非常复杂时, store对象就会变得很臃肿  
+ 为了解决这个问题,Vuex允许我们将store分割成模块(Module), 每个模块拥有自己的 state, mutations, actions, getters等

在store实例中  

```js
// 创建模块A
const moduleA = {
  state: {
    name: 'dzmodule'
  },
  getters: {
    fullname(state) {
      return state.name + '111'
    },
    fullname2(state, getters) {
      return getters.fullname + '222'
    },
    fullname3(state, getters, rootState) {
      // rootState表示实例中的state数据对象
      return getters.fullname2 + rootState.counter
    }
  },
  mutations: {
    // 模块中mutations方法名尽量和实例中的mutations方法不要重复
    // 默认是优先查找实例中的方法
    moduleUpdate(state, name) {
      state.name = name
    }
  },
  actions: {
    // 异步的module中的actions方法
    aUpdate(context) {
      setTimeout(() => {
        context.commit('moduleUpdate', 'dz')
      }, 1000);
    }
  }
}

// 2.创建对象
const store = new vuex.Store({
  state: {
    counter: 1000,
    students: [
      { name: 'dz0', age: 23 },
      { name: 'dz1', age: 24 },
      { name: 'dz2', age: 25 },
    ]
  },
  modules: {
    a: moduleA
  }
})
```

组件中使用  

```js
// 获取modules中的state数据
$store.state.a.name

// 使用modules中的mutations中的方法
$store.commit('moduleUpdate', 'dz')

// 使用modules中的getters方法
$store.getters.fullname

// 使用modules中的getters方法并在方法中调用modules中另一个getters方法
$store.getters.fullname2

// 使用modules中的getters方法并使用实例中的state数据
$store.getters.fullname3
```

**注意** actions中的方法 context 参数 只作用于当前module  
如果想使用 实例中的state, getters, 在context中包含了rootGetters, rootState对象,即context.rootGetters context.rootState  

也可以使用对象的解构语法将参数解构出来直接使用:

```js
actions: {
  fn({state, commit, rootState}) {
    // do something
  }
}
```

### 项目结构

当我们使用Vuex帮助我们管理过多内容时, 好的项目结构可以帮助我们的代码更加清晰  
即将实例中的 mutations, actions, getters, modules等等抽离到单独一个文件中, 以使得store中的结构清晰, 状态管理更加方便

## 网络模块

1. 基于XMLHttpRequest的传统Ajax
  配置和调用方式等非常的混乱, 自己封装最后不一定完善, 容易出现bug
2. JQuery-Ajax
  在Vue整个开发中都是不需要使用jquery,为了方便进行一个网络请求, 特意引用jquery 不合理, jquery1w+代码, vue的代码才1w+行,完全没有必要为了使用一个网络请求就引用这个重量级的框架
3. 官方Vue-resource
  体积相对于jQuery小很多, vue2.0后 vue作者去掉了vue-resource
4. axios
  有非常多的优点, 用起来非常方便

### JSONP

jsonp的核心在于通过 `<script>` 标签的src来帮我们请求数据  
原因是我们的项目部署在domain1.com服务器上时,是补鞥直接访问domain2.com服务器上的资料的  
这个时候我们利用`<script>`标签的src帮助我们去服务器请求到数据, 将数据当做一个JavaScript的函数来执行, 并且执行的过程中传入我们想要的json
所以,封装jsonp的核心就在于监听window上的jsonp进行回调时的名称

封装  

```js

```

### Axios

功能特点:

1. 在浏览器中发送XMLHttpRequest请求
2. 在node.js中发送http请求
3. 支持PromiseAPI
4. 拦截请求和相应
5. 转换请求和响应数据
6. 等等

支持多种请求方式

安装  

```shell
npm install axios --save
```

使用方法  
axios请求之后返回的是一个promise对象

```js
import axios from 'axios'
// 默认为get请求  
axios({
  url: 'xxxxx',
  methods: 'GET'
}).then(res => {
  console.log(res)
})
```

GET方法  

```js
axios.get(url, {
  params:{type: 'sell', page: 1}
}).then(res => {
  console.log(res)
}).catch(err => {
  console.log(err)
})
```

POST方法  

```js
axios.post(url,
{
  name:'dz'
},
{
  headers:'xxx'
}).then(res => {
  console.log(res)
}).catch(err => {
  console.log(err)
})

```

发送并发请求  

```js
axios.all([axios({
  url: 'http://123.207.32.32:8000/api/v1/home/multidata'
}), axios({
  url: 'http://123.207.32.32:8000/api/v1/home/data',
  params: {
    type: 'sell',
    page: 5
  }
})])
  .then(axios.spread((ret1, ret2) => {
    console.log(ret1)
    console.log(ret2)
  }))
```

axios.spread表示把请求的多个结果组成的数组类似解构原理分别用变量存储起来  

全局配置  
在开发中,很多参数都是固定的  
我们可以进行一些抽取, 也可以利用axios的全局配置  

```js
axios.defaults.baseURL = 'http://123.207.32.32:8000/api/v1'
axios.defaults.timeout = 5000 //ms
axios.defaults.post['Content-Type'] = 'application/x-www-form-urlencoded'
```

常见配置:

```js
请求地址
url: '/user',

请求类型
method: 'get',

请根路径
baseURL: 'http://www.mt.com/api',

请求前的数据处理
transformRequest:[function(data){}],

请求后的数据处理
transformResponse: [function(data){}],

自定义的请求头
headers:{'x-Requested-With':'XMLHttpRequest'},

URL查询对象
params:{ id: 12 },

查询对象序列化函数
paramsSerializer: function(params){ }

request body
data: { key: 'aa'},

超时设置s
timeout: 1000,

跨域是否带Token
withCredentials: false,

自定义请求处理
adapter: function(resolve, reject, config){},

身份验证信息
auth: { uname: '', pwd: '12'},

响应的数据格式 json / blob /document /arraybuffer / text / stream
responseType: 'json',
```

axios实例
只用一个全局配置局限性太大, 整个项目不一定都使用同一个全局配置, 例如某些组件请求的地址不一样, 并且需要定制一些特殊请求方式等等 不太合理  
当我们从axios模块中导入对象时, 使用的实例是默认的实例.
当给该实例设置一些默认配置时, 这些配置就被固定下来了.
但是后续开发中, 某些配置可能会不太一样.
比如某些请求需要使用特定的baseURL或者timeout或者content-Type等.
这个时候, 我们就可以创建新的实例, 并且传入属于该实例的配置信息.

```js
const instance1 = axios.create({
  baseURL: 'http://123.207.32.32:8000/api/v1',
  timeout: 5000
})

instance1({
  url    : '/home/multidata'
}).then(res => {
  console.log(res)
})

instance1({
  url:'/home/data',
  params : {
    page : 1
    type : 'sell',
  }
}).then(res => {
  console.log(res)
})

const instance2 = axios.create({
  baseURL: 'http://222.111.333.22:8888',
  timeout: 1000
})
```

封装axios  

1. 回调方法一与发起请求

  ```js
  import axios from 'axios'

  // 导出
  export function request(config, success, fail) {
    // 创建axios实例
    const instance = axios.create({
      baseURL: 'http://123.207.32.32:8000/api/v1',
      timeout: 5000
    })
    // 发起请求
    instance(config).then(success).catch(fail)
  }
  ```

  配置请求信息

  ```js
  import {request} from './network/request'
  request({
    url: '/home/multidata'
  }, res => {
    console.log(res)
  }, err => {
    console.log(err)
  })
  ```

  .  
2. 回调方法二与发起请求

  ```js
  import axios from 'axios'
  export function request(config) {
    // 创建axios实例
    const instance = axios.create({
      baseURL: 'http://123.207.32.32:8000/api/v1',
      timeout: 5000
    })

    instance(config.baseConfig).then(config.success).catch(config.fail)
  }
  ```

  ```js
  import {request} from './network/request'
  request({
    baseConfig: {
      url: '/home/multidata'
    },
    success(res) {
      console.log(res)
    },
    fail(err) {
      console.log(err)
    }
  })
  ```

   ○  
3. 回调方法三与发起请求
  直接返回promise  

  ```js
  import axios from 'axios'
  export function request(config) {
    // 创建axios实例
    const instance = axios.create({
      baseURL: 'http://123.207.32.32:8000/api/v1',
      timeout: 5000
    })

    return instance(config)
  }
  ```

  ```js
  import {request} from './network/request'
  request({
    url: '/home/multidata'
  }).then(res => {
    console.log(res)
  }).catch(err => {
    console.log(err)
  })
  ```

axios拦截器  
用于在发送每次请求或者得到相应后, 进行对应的处理  

```js
import axios from 'axios'
export function request(config) {
  // 创建axios实例
  const instance = axios.create({
    baseURL: 'http://123.207.32.32:8000/api/v1',
    timeout: 5000
  })
  // 请求拦截 why?
  // 1. 比如config中的一些信息不符合服务器的要求
  // 2. 比如每次发送网络请求时， 都希望在界面中显示一个请求的图标
  // 3. 某些网络请求（比如登录token）必须携带一些特殊信息

  instance.interceptors.request.use(config => {
    console.log(config)
    return config
  }, bbb => {
    console.log(bbb)
  })
  // 响应拦截
  // 对接受的数据还需要进行一步处理 比如只需要返回的data数据其他的不太重要就可以直接返回 res.data

    instance.interceptors.response.use(res => {
    return res.data
  }, err => {
  // 响应的失败拦截中，可以根据status判断报错的错误码，跳转到不同的错误提示页面
    console.log(err)
  })


  return instance(config)
}
```

请求时, 拦截成功的回调函数的参数就是config,拦截之后一定要把config return出去,不然会接下来的请求就会没有请求数据  

