# 小程序

## 三部分:

1. 页面布局:WXML 类似 HTML 
2. 页面样式:WXSS几乎就是CSS
3. 页面脚本:JavaScript+WXS  JS, 以及WeixinScript

**基于MVVM架构**

微信中的调度者是 view<--MINA-->Model

## 开发前准备

1. 申请AppID
2. 下载开发工具(Weixin开发工具, 其他开发工具亦可)

## 应用结构

App -> 多个page -> 组件

### App

1. app.js  
  实例的代码以及一些全局相关的内容
2. app.json  
  全局的一些配置,比如window/tabar等
3. app.wxss  
  全局的一些样式配置  
  ↓  

### page

  注册到 全局app.json

1. page.js  
  需要一个Page({})配置
  创建page实例的代码,以及页面相关的内容
2. page.json  
  业务单独的配置, 比如页面对应的window配置
3. page.wxss  
4. page.wxml
  ↓  

### 组件

小BUG, 可能保存一次会报错 再保存一次 = =  

## 多个项目管理  

  对多个知识点利用git tag进行管理, 每一次独立的内容提交`git tag xx`,  然后`git push --tags`提交到github  
  在github中克隆下来 利用 `git checkout xx`切换不同tag版本

## 初体验

1. 数据绑定  
  {{}}  --> mustache 语法, 数据绑定, 属性绑定, js逻辑  
2. 列表展示
  wx:for 循环  item为数组的每一项
3. 数据监听
  普通的数据和页面的data没有监听, 当data中的数据改变页面也不会随之改变
  利用setData方法 动态改变

## 小程序MVVM结构

框架MINA

1. M : Model 数据 Data  逻辑层
2. V : View  界面 {{}}mustache语法 视图层
3. VM: ViewModel M和V通信的桥梁 Data Bindings <-- VM --> DOM Listener

## 编程范式

1. 命令式编程 原生DOM操作, 一步一步的获取元素, 查找DOM, 然后操作DOM, 甚至手动绑定监听事件,
2. 声明式编程 vue/react/angular, 只需要修改数据, 不用再手动的操作DOM, 将试图数据进行变化

## 配置小程序

  小程序的很多的`开发需求`被规定在了`配置文件`中  
**why?**  
  提高开发效率  
  保证小程序风格比较一致的  
  比如导航栏、顶部Tabbar等..  

### 常见的配置文件

1. project.config.json  
  一般不手动修改, 项目通用配置, 版本号, 是否es6转es5 等等
  版本控制, 匹配值一致性
2. sitemap配置
  微信搜索, 是否被微信爬虫获取信息
3. app.json  
  全局配置  

* pages
  页面路径列表
* window
  默认窗口表现，导航栏，状态栏等
* tabbar  
  底部导航栏

4. page.json

  页面配置, 同全局配置功能差不多相同的功能，只是在某一个页面上生效，与全局配置有相同设置时，页面配置优先级更高  
 
## 小程序的双线程模型

1. 渲染层 --> wxml wxss
  `wxml模板`, wxss 运行于渲染层, 渲染层使用webview线程渲染  
  wxml等价于一个DOM树,也可以用一个JS对象来模拟 虚拟DOM
2. 逻辑层 --> js  
  逻辑层使用JSCore运行脚本  

  这两个线程都会经由微信客户端(Native)进行中转交互  
  渲染层 宿主环境把wxml 可以先转换成JS对象, 再渲染出真正的DOM树,交由渲染层线程渲染
  一个线程渲染DOM 一个线程处理脚本, 逻辑层把渲染层需要的数据传给渲染线程, 形成虚拟DOM, 再渲染出真正DOM  
  当数据发生改变时, 逻辑层提供最新的变化数据,产生新的JS对象,对应大的节点发生变化,对比前后两个JS对象,diff算法, 然后把这个差异额应用到原来的DOM树上,从而达到更新UI的的目的,这就是'数据驱动'的原理

  不是运行是在浏览器没有 DOM 和 BOM

  小程序有一些额外的成员

  APP 用于定义应用程序实例
  Page 用于定义页面组件实例
  getCurrentPages 获取当前页面调用栈

  wx 对象 提供核心API
## 注册小程序启动流程

1. 下载小程序包 -->启动 --> 加载app.json --> 注册App()并调用, 就是app.js中的函数 --> :

  + -->执行APP中的生命周期函数  
  + --> 加载自定义组件, 注册自定义组件
    + --> 加载解析page.json
    + --> 加载解析结合JS. page.js、page.wxml、page.wxss
    + --> 注册Page() 执行Page生命周期

### 注册APP生命周期

加载App.js 注册App({})方法  `一般`做了几件事：

* 判断小程序的进入场景
  生命周期 onShow(options)  options里面有 属性 scene 场景值
* 获取用户数据，将用户的信息保存到服务器  
  微信自带api :wx.getUserInfo(res)  res 包含了许多用户信息，但是这个借口将要废弃  
  利用 button组件添加`open-type`属性 这样在button的回调函数默认传入的对象参数中有一个detail属性

  ```html
  <button open-type="getUserInfo" bindgetuserinfo="func">获取用户信息</button>
  ```
  利用view

  ```html
  
  ```
  function会默认传入一个参数event -->detail属性  
  使用open-data组件 type="[链接](https://developers.weixin.qq.com/miniprogram/dev/component/open-data.html)" `只能展示用户信息，不能获取到js`
* 定义全局属性(数据)，可以在其他地方共享
  获取 : const app = getApp() 这个方法可以获取产生App产生的`单例对象`

## 注册页面
  加载page.json配置文件
  每个小程序的每个页面都有一个对应的js文件，其中调用Page方法注册页面  
  每个页面也有一个生命周期
  在注册时, 可以绑定初始化数据、生命周期回调、事件处理函数等  

### 注册page页面

`一般`做了几件事
先执行onShow 在执行onReady
* 网络请求
* 初始化一些数据 以便wxml引用展示
* 监听wxml中相关的一些事件 绑定时间函数
* 监听其他事件 scroll, resize, 下拉加载更多
  关闭代理

##  Page实例生命周期

两个线程

1. View Thread

2. AppService Thread

## 内置组件

1. Text组件  
现实文本，类似于span标签，是行内元素，`\n`可以换行  
属性 :selectable 是否可选,space,decode(对内容进行编码比如:`&nbsp;`)
并且可以换行, 如果 text标签内容换行 最后显示也会换行
2. button

默认是块级元素,当有[size=mini]是行内块级元素
按钮  type、size、open-type, plain镂空, disabled, loading

开放能力:

open-type:
+ concact 直接打开, 客服对话 需要在小程序后台配置
+ share 转发分享
+ getUserInfo

3. View
块级元素
hover-class 点击时样式  
hover-start-time  
hover-stay-time  
hover-stop-propagation="{{true}}" 组织祖先元素点击态 可省略属性值  
hover-stop-propagation=""是不可以的  
hover-stop-propagation="xxx"  xxx被当成字符串 解析为true  
4. image
`行内块级`元素  
可以双标签 也可以单标签  
有默认宽高(320X240)
懒加载， 无边框

属性: mode, lazy-load, bindload(加载完成时触发), 长按菜单栏 show-menu-by-longpress

5. input

无边框
placeholder-class 占位符类名

```js
<text>pages/input /input.wxml</text>3
<!-- 1. 基本使用 -->
<input/>

<!-- 2. value -->
<input value='123'/>

<!-- 3. type 决定键盘类型(英文字母+其他符号/数字/身份证) -->
<input type='text'/>
<input type='number'/>
<input type='idcard'/>
<input type='digital'/>

<!-- 4. password, 暗文 -->
<input password/>

<!-- 5. placeholder 占位符-->
<input placeholder='请输入what'/>

<!-- 6.confirm-type 第三方键盘可能无效 -->
<input type='text' confirm-type='done'/>

<!-- 7.input 事件 -->

<input  
bindinput='userInput'
bindfocus='userFocus'
bindblur='userBlur'
/>
```

6. scroll-view

实现局部滚动  以及滚动事件监听

7. rich-text 富文本标签

+ 接受标签字符串
+ 接受对象数组

8. iconfont 图标

```html
<icon type="success" size="60"/> 
```

size 默认为 `23`
9. radio 单选框

结合`radio-group`, 具有`bindchange`事件

```html
<radio-group>
  <radio>男</radio>
  <radio>女</radio>
</radio-group>
```
10. checkbox 复选框

```html
<checkbox-group bind:change="handleChange">
  <checkbox value="China">China</checkbox>
  <checkbox value="Japan">Japan</checkbox>
  <checkbox value="Korean">Korean</checkbox>
</checkbox-group>
```

`handleChange` 事件传入的 `e` 对象中的 detail 和 value 为一个数组
11. progress 进度条

```html
<progress percent="{{percent}}" show-info></progress>
```

show-info 显示具体数值
stroke-width 线宽
color 颜色
active 显示动画
### 通用属性

id、class、bind*/catch*、data-*

## 样式3中写法

1. 行内样式(内联样式)  
style="key1:value1, key2:value2"
2. 页内样式  
绑定class或者id 在wxss中利用选择器  
3. 全局样式
绑定class或者id 在app.wxss中利用选择器  
页内样式只会对自己的组件有作用  
优先级: 行内样式>页内样式>全局样式  

### wxss扩展

只能使用`相对路径`可以抽离公共的样式，或者便于管理的目的 将要部分样式写在另一个wxss文件中 而不是该组件的默认wxss中，但是需要在默认的wxss中进行导入:
`@import './xx.wxss'`

官方样式库

### 选择器

.class #id element element，element ::after ::before

权重

## 尺寸单位

rpx responsive pixel

在 iphone6 上屏幕为375px 共有750个物理像素，则750rpx=375px=750物理像素， 1rpx=0.5px=物理像素

建议 开发微信小程序时设计师可以用iphone6作为视觉稿标准

## mustache语法

可以是表达式
<view>{{firstname + lastname}}</view>
<view>{{name ? firstname : lastname}}</view>  
小程序中不能通过操作dom改变样式，但是可以动态修改mustache属性值，改变

## 逻辑判断wx:if wx:elif wx:el

## wx:if & hidden

区别:
wx:if将组件隐藏起来时该组件不存在  
hidden将组件隐藏起来时，该组件依然是存在(display:none)
选择:  
如果显示和隐藏切换的频率非常高, 选择使用hidden  
如果显示隐藏切换的频繁非常低，选择wx:if

```html
</view wx:if="true">1</view>
</view wx:elif="true">1</view>
</view wx:else="true">1</view>
```

## 列表渲染-wx:for

必须使用{{}}
系统规定了每一项为item 和 索引index  
可以遍历数组:

```html
<view wx:for="{{[a, b, c]}}">{{item}}{{index}}</view>
```

可以遍历字符串:

```html
<view wx:for="namedz">{{item}}{{index}}</view>
```

遍历数字:

```html
<view wx:for="{{10}}">{{item}}</view>
```

#### block标签

某些情况下，需要使用wx:if或者wx:for 可能需要`包裹一组组件标签`

```html
<block>
  <button>123</button>
  <view>
    <h2>123123</h2>
  </view>
</block>
```

如果使用view view是一个组件还需要渲染，浪费性能，block是一个标签不会被渲染，只接收`控制属性`(wx:if wx:for)， 如果是class等不生效  

block标签的两个好处  

1. 将要进行遍历或者判断的内容进行包裹
2. 将遍历和普安段放在block标签中美不影响普通属性的阅读，提高代码可读性

### 为item/index起别名

某些情况下，可能想用其它名称  
或者出现多层遍历好名字会重复  

可以指定item和index的名称  

```html

<block wx:for="{{moview}}"
       wx:for-item="movie"
       wx:for-index="i">
  <view>{{i}}{{movie}}</view>
</block>
```

### key  

可以通过加一个key提供性能

## 模板template

对相关代码进行一个复用

wxml的导入:

1. 在当前页面进行模板的定义和使用, 通过data进行传值

```html
<template name="contentItem">
  <button size="mini">{{btntext}}</button>
  <h2>{{content}}</h2>
</template>

<template is="contentItem" data="{{btntext:'按钮', content:'hahaha'}}"></template>

```

2. 通过import方式引入模板 再进行使用

绝对路径和相对路径都可以

```html
<import src="/wxml/template.wxml"/>
<template is="contentItem" data="{{btntext:'按钮', content:'hahaha'}}"></template>
```

不能进行递归似的导入，模板文件(A)导入另一个模板(B)，在使用时只能使用当前引入的那个模板(A)

import:

1. 主要导入template
2. 不能进行递归导入template

include:

1. 将公共的wxml中的组件抽取到一个文件中
2. 也不能导入template/wxs, 可以进行递归导入

## wxs模块

小程序的脚本语言，结合WXML,可以构建页面的结构
wxs与JavaScript是不同的语言,并不和JavaScript一致  

why?  
wxml是不能直接调用page/component中的定义的函数的
但是某些情况希望使用函数来处理wxml的数据 类似于vue的过滤器 filter

wxs特点  
wxs的运行环境和其它JavaScript代码是隔离的 不能调用其他的js文件中的函数,也不能调用小程序提供的api

由于运行环境的差异,在ios设备上小程序的wxs会比JavaScript代码块2~20倍,在andriod设备上二者运行效率无差异

wxs用法  
```html
<!-- 1. 直接在wxs标签中定义 -->
<!-- 不用es6语法-->
<wxs module="info">
  var messgae = 'hello world'
  var sum = function(a, b) {
    return a + b
  }
  module.exports = {
    message: messgae,
    sum: sum
  }
</wxs>

<!-- 2. 定义在单独的wxs文件，再使用<wxs>标签进行导入 -->
<!-- 不能使用绝对路径，只能使用相对路径, 不能使用es6语法 -->
<wxs src="../../wxs/info.wxs" module="info"></wxs>

也可以使用单标签, 末尾的 '/ 不能忘记

<wxs src="../../wxs/info.wxs" module="info"/>


<view>
  {{info.message}}
</view>
```

## 事件处理  

小程序允许 事件绑定使用 `:`  bind:tap === bindtap  
某些组件有自己的特性的事件类型， 可以在使用使用组件时具体查看文档  
touchstart、touchmove、touchend、tap(触摸和马上离开)、longpress(触发这个事件，tap事件不会触发)...

```js
<view class="box"
      bind:touchstart="handletouchStart"
      bind:touchmove="handletouchMove"
      bind:tap="handleTap"
      bind:touchend="handletouchEnd"
      bind:longpress="handleLongpress">
</view>
```

### 事件对象

触发事件时系统会默认把事件对象作为参数传入  
type 事件类型  
timestamp 时间戳 从页面打开到触发时  
detail 鼠标位置信息, 组件标签信息等等  

target 触发事件的组件 里面包含了该组件的所有信息    `产生事件的组件`
与currentTarget 在事件冒泡中有所不同
currentTarget  某些时候和target内容相同     `触发事件的组件`
touches  
用来记录当前有个手指在小程序中触摸的以及对应的触摸点的信息  
在touchend事件中 touches 与changedTouches会不同  
还有就是多手指变化中也会有不同
changedTouches 记录变化  

### 事件传递的参数

wechat中并不能利用`bind:tap="handle(a,b)"`这种形式进行传值, 而是利用组件标签属性data-*来进行值传递, 其中 `*` 表示自定的变量名, 储存在了事件`对象event`中的 `currentTarget.dataSet`中

### 事件冒泡和捕获

wechat中有 冒泡和捕获机制
bind 表示事件一层层传递  
catch 阻止事件的进一步传递, 意思就是阻止冒泡或者捕获  

```html
<view class="con1" capture-bind:tap="handleCapture1" bind:tap="handle1">
  <view  class="con2" capture-bind:tap="handle2Capture" bind:tap="handle2">
  </view>
</view>
```
如果点击就会先触发捕获事件 触发 handleCapture1 然后 handle2Capture 然后继续冒泡 handle2 最后 handle1  

如果把con1的捕获改为: capture-catch:tap="handleCapture1" 那么点击之后只会触发一次事件捕获即 handle1Capture, 就会停止事件的传递, 不会继续触发下面con2的事件以及冒泡都都不回触发  
同样把con2的bind:tap改为catch:tap 那么当时间捕获结束后 然后开始事件冒泡, 触发了handle2之后就停止传递了  

## 组件化开发

新建components  再在 需要在哪个页面显示的那个page.json中  添加自定义组件配置

```js
"usingComponents": {
  "my-con": "/components/my-con/my-con"
  //组件名称  和  组件 路径 相对路径或者绝对路径亦可
}
```

系统会在自定义组件的json文件中 添加一个component:true 不能删  

注意：

1. 自定义组件的名称由小写字母、下划线、中划线组成，不能使用驼峰  
2. `自定义组件内部也可以引用其他的自定义组件`
3. 自定义组件名称尽量不要使用 `wx-` 前缀
4. 可以在`全局app.json中进行注册`添加配置, 这样全部都可以直接使用组件

  ```js
  "usingComponents":{
    "my-con": "/components/my-con/my-con"
  }
  ```

### 组件样式细节

1. 内部对外部的影响,组价内的样式不会对页面样式生效， 这里只值`class`选择器  
  组件内是不能使用tagname id attribute 选择器, 官方推荐
2. 外部对内部的影响, 使用class只对外部wxml有效, 如果使用了id\属性选择不会产生影响, 但是, `如果是标签选择器会对组件内部产生影响`
3. 如果希望组件的样式和页面相互影响 需要在` 组件的js文件中`添加一个options属性:

  ```js
  Component({
    options: {
      styleIsolation: "isolated",     //默认值  不会相互影响
      styleIsolation: "apply-shared", //页面中的样式会影响组件的样式
      styleIsolation: "shared",       //组件中的样式会影响页面中的样式
    }
  })

  ```

### 组件和页面通信
很多情况 组件展示的内容数据、样式、标签 并不是在组件内写死的，而且可以由使用者来决定

页面需要按照需求给组件传入 要显示的数据或者样式

1. 传入数据

  * 首先在组件的js文件中添加一个properties属性, 存放的是一个对象, 对象里面的值就是页面传入子组件的数据变量名, 变量储存着对数据的一些存储规则:

  ```js
  properties: {
    // 1. 第一种方式 直接规定一个数据类型
    // title: String
    // 2. 第二种方式 使用对象行使设置多个属性
    // type 表示类型,
    // value 表示默认值,
    // observe 是一个监听方法, 监听该变量的值是否改变, 只要以改变就会触发
    title: {
      type: String,
      value: '我是默认的值',
      observer: function(newValue, oldValue) {
        console.log(newValue, oldValue)
      }
    }
  }
  ```

  * 在子组件的wxml中 像使用data里面的数据一样利用差值语法{{title}}进行数据的显示

  * 外部页面中引用子组件标签时设置一个变量名属性并赋值 <my-con title="我是父组件传来的值"></my-con>

2. 传入样式

* 同样在组件的js中添加一个externalClasses属性, 该属性是一个数组, 每一项存储了类名变量, 注意书写规范 `不适用驼峰`

```js
  externalClasses:['titleclass'] //是变量名不是属性名
```

* 父组件在子组件标签中传入已经写好的样式类名<my-con titleclass="box"></my-con>

* 子组件的标签在class中就可添加这个类名变量<view class="title titleclass">我是组件的内容{{title}}</view>
, 次标签就具备了父组件写的样式

### 自定义事件与传递数据

在子组件定义一个事件, 可以在外部页面中进行调用, 需要组件内部发出事件
**组件里的方法不能写在与data同级的位置下，必须写在methods中**  
在组件的js的methods对象中添加一个事件, 利用this.triggerEvenr方法发出事件

```js

methods: {
  handleIncrement() {
    this.triggerEvent('increment', {name:'dz', age: 23}, {})
    //'increment'表示被在外部页面监听发出的事件名称, 一旦子组件的自定义方法触发, 同时就会被监听到, 此时就会可以触发一些在外部页面中定义的事件
    // {name:'dz', age: 23}表示向外发出事件的同时, 发出一些来自子组件内部的一些数据
    // 最后的{}标识一些options配置
  }
}
```

在外部页面引用子组件标签时, 监听发出的事件

```html
<my-event bind:increment="handleIncrement"></my-event>
```
一旦`increment`触发, 就会调用父组件的`handleIncrement`事件, 并且将子组件的发出的数据存储在`handleIncrement`事件的默认event对象参数的detail中, 即可使用

### 获取组件对象
可以在父组件中获取子组件的对象, 利用该对象可以调用该对象上的所有方法和使用所有data数据  
父组件js中:

```js
xxx(){
  const com = this.selectComponent(子组件标签的class或者id)
}
```

开发中直接利用组件对象去修改data数据不太好  
可以提供一个统一的方法接口去修改比较合理

### 插槽
单个插槽  
在组件(my-slot)中:

```html
<slot></slot>
```

其他组件中使用:

```html
<my-slot>
  <button>这是btn</button>
</my-slot>
```

多个插槽
需要给slot指定name名,使用的时候在组件标签中使用slot='name名'
组件(my-slot)中:
```html
<view>
  <slot name="slot1"></slot>
  <slot name="slot1"></slot>
  <slot name="slot1"></slot>
</view>
```

其他组件中使用前必须在需要使用的页面js文件中添加配置:

```js
options: {
  multipleSlots: true // 在组件定义时的选项中启用多slot支持
}
```

```html
<view>
  <component-tag-name>
    <!-- 这部分内容将被放置在组件 <slot name="slot1"> 的位置上 -->
    <view slot="slot1">这里是插入到组件slot name="slot1"中的内容</view>
    <!-- 这部分内容将被放置在组件 <slot name="slot2"> 的位置上 -->
    <view slot="slot2">这里是插入到组件slot name="slot2"中的内容</view>
  </component-tag-name>
</view>
```

## 组件的构造器

```js
Component({

  behaviors: [],

  // 属性定义（详情参见下文）
  properties: {
    myProperty: { // 属性名
      type: String,
      value: ''
    },
    myProperty2: String // 简化的定义方式
  },
  
  data: {}, // 私有数据，可用于模板渲染

  lifetimes: {
    // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
    attached: function () { },//被添加到页面
    moved   : function () { },
    detached: function () { },
    ready   : function () { }
  },

  // 生命周期函数，可以为函数，或一个在methods段中定义的方法名
  attached: function () { }, // 此处attached的声明会被lifetimes字段中的声明覆盖
  ready: function() { },

  pageLifetimes: {
    // 组件所在页面的生命周期函数
    show: function () { },
    hide: function () { },
    resize: function () { },
  },

  methods: {
    onMyButtonTap: function(){
      this.setData({
        // 更新属性和数据的方法与更新页面数据的方法类似
      })
    },
    // 内部方法建议以下划线开头
    _myPrivateMethod: function(){
      // 这里将 data.A[0].B 设为 'myPrivateData'
      this.setData({
        'A[0].B': 'myPrivateData'
      })
    },
    _propertyChange: function(newVal, oldVal) {
    }
  },

  options: {
    multipleSlots: true // 在组件定义时的选项中启用多slot支持,
    externalClasses:[]
  }

  // 监听数据的改变
  observers: {
    counter: function(newValue) {
      没有oldValue
    }
  }
})
```

## 微信API

1. 网络请求

```js
ws.request({
  url:'',
  method: '',
  data:{},
  success:function(res) {

  }
})

```

一般项目会对网络请求进行封装, 降低和原生微信请求api的耦合度

2. 弹窗 Toast

```js
wx.showToast({
  title: '警告',
  duration: 2000,
  icon:'loading',
  success(){
    console.log('success')
  },
  complete() {
    console.log('complete')
    // 成功或者失败都会调用
  },
  // mask:true
})
```

3. 弹窗 Modal

```js
    wx.showModal({
      title: '我是标题',
      content: '大家好才是真的好',
      success(res) {
        console.log(res)
        // 点击了取消或者确定后, 结果有cancel 和confirm 两个属性
      },
      cancelText:'小朋友',
      confirmText: '大朋友'
    })
```

4. 弹窗Loading

可以手动取消显示

```js
    wx.showLoading({
      title: '加载ing',
      mask: true
    })

    setTimeout(() => {
      wx.hideLoading()
    }, 1000)
```

5. ActionSheet

显示底部菜单

```js
handleShowAction() {
  wx.showActionSheet({
    itemList: ['相册', '拍照'],
    itemColor: 'red',
    success(res) {
      console.log(res)
    }
  })
},
```

6. 分享

在page({})中定义

```js
onShareAppMessage(options) {
  return {
    title: 'hello world',
    path: '/pages/index/index',
    imageUrl: 'https://ss0.baidu.com/73t1bjeh1BF3odCf/it/u=1986619676,128723557&fm=85&s=14B25E324AEF40094EF47C5B0300C0F1'
  }
}
```

或者通过点击按钮

```html
<button open-type="share"></button>
```


7. 设置标题

wx.setNavigationBarTitle

在onLunch中请求数据并设置标题是不严谨的, 因为只有在onReady之后才能进行设置, 因此,需要在 onReady钩子中判断完成完成

```javascript
  onLoad: function (options) {
    fetch(`/categories/${options.cat}`).then(res => {
      this.setData({
        category: res.data
      })
    })
  },
  onReady:function () {
    if (this.data.category.name) {
      wx.setNavigationBarTitle({
        title: res.data.name,
      })
    }
  }
```
## navigator 跳转

### 1. 使用自带组件

```html
<!-- 绝对路径相对路径都行 -->
<navigator url="../xxx/xxx"
           open-type="" 
           delta="2">跳转</navigator>
```

open-type的属性:

1. navigator `保留`当前页面 默认值直接跳转, 有返回按钮
2. redirect  重定向, `关闭`当前页面, 跳转到某个页面, `不能跳转到tabbar页面`, 没有返回按钮
3. switchTab 跳转到Tabbar中的页面 需要在tabbar中定义的页面, 并关闭其他非tabbar页面
4. reLaunch  关闭所有页面, 跳转到某个页面
5. navigateBack 返回到从哪个页面跳转的页面
target属性:
+ 跳到当前小程序还是其他小程序

delta 配合navigateBack 返回几个层级

### 2. 跳转数据传递

* 利用url中带参数传送数据

```html
<navigator url="../xxx/xxx?name=dz&age=23"
           open-type="redirect" >跳转</navigator>
```

### 3. 使用代码进行跳转

```js
wx.navigatorTo({
  url: 'pages/xx/xx?name=dz'
})

wx.redirectTo({
  url: 'xx/xx/xx'
})
```

* 代码返回

```js
wx.navigateBack({
  delta: 1 //层级
})
```

<!-- 微信wxss中背景图不能使用本地资源, 只能引入外部 -->
<!-- hidden对组件不起作用 -->
<!-- 不要在滚动的回调函数中频繁的调用this.setData -->