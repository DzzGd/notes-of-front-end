1. [CSS在JS中相关内容](#css)

2. [函数的实现原理(code)](#function)

+ [reduce原理](#reduce)
+ [slice](#slice)
  + [slice转换类数组](#classarray)
+ [call](#call)

3. [ES6新语法](#es6)

+ [let&const](#letconst)
+ [数组新增扩展](#arrayextend)
+ [symbol](#symbol)
+ [iterator](#iterator)
+ [Set](#set)
+ [Map](#map)
+ [Proxy](#proxy)
+ [Reflect](#reflect)
+ [Promise](#promise)
+ [Generator](#generator)
+ [Sync](#sync)

4. [对象](#object)
+ [defineproperty](#defineproperty)
+ [RegExp](#regexp)
+ [Constructor](#constructor)
+ [Prototype](#prototype)
+ [Observer](#observer)
5. [JS时间线](#timeline)

<h2 id="css">CSS相关内容</h2>

### 1.脚本化CSS

#### 行内样式表

元素节点.style 获取的是行内样式表

+ **只能** 获取元素 **行内样式style属性** 中的CSS样式

+ 一般使用行内样式表来设置某些css属性
+ 含有连词符的css属性 需要使用`小驼峰`写法
+ float是js里面的保留字 一般使用cssFloat

window.getComputedStyle(dom, null) `IE8` 以上, 获取的是计算样式表(computed面板 属性名和属性值组成的对象)

+ 获取的是已经呈现在页面的最终元素属性值
+ 只能获取样式，不能设置样式 (`只读的`)
+ 一般计算样式表用来获取css属性
+ null可以换成after或者before 这样能够获取伪元素的计算样式表  

IE8 以下 采用dom.currentStyle 获取 `计算样式`

以上获取的值是字符串带单位 例如: '100px'

兼容获取style属性

```js
function (dom, attr) {
  if(dom.currentStyle) {
    return dom.currentStyle[attr]
  } else {
    return dom.getComputedStyle(dom, null)[attr]
  }
}
```

#### 元素的位置

获取元素的位置 `只读` 不能  `设置`

* dom.offsetParent      获取dom的定位父级
* dom.offsetLeft  获取dom到定位父级的水平距离
* dom.offsetTop  获取dom到定位父级的竖直距离
* dom.clientLeft  获取dom左边框的宽度
* dom.clientTop   获取dom上边框的宽度
* dom.scrollLeft   获取dom里面的内容的水平滚动距离 `可以设置值`
* dom.scrollTop   获取dom里面的内容的竖直滚动距离 `可以设置值`

#### 元素的显示

获取元素的显示尺寸      只能读取不能设置

+ dom.clientWidth  width+左右的padding
+ dom.clientHeight  height+上下的padding
+ dom.offsetWidth  width+左右的padding+左右的border
+ dom.offsetHeight  height+上下的padding+上下的border

以上返回值都是 number 不带单位
当dom的内容 超过dom的尺寸时
* dom.scrollWidth       获取dom的内容宽度
* dom.scrollHeight      获取dom的内容高度

封装获取 当前元素相对于文档的位置
```js
  function getElementPosition(dom) {
    if (dom.offsetParent === document.body) {
      return {
        x:dom.offsetLeft,
        y:dom.offsetTop
      } 
    } else {
      return {
        x: dom.offsetLeft + getElementPosition(dom.offsetParent).x,
        y: dom.offsetTop + getElementPosition(dom.offsetParent).y
      }
    }
  }
```
<hr>
<h2 id="function">函数的实现原理[code]</h2>


<h3 id="reduce">-- Array.prototype.reduce --</h3>

`reduce` 的方法最终返回一个基于回调函数参数的值

举例:
```js
var arr = [1, 2, 3, 4]
var result = arr.reduce(function(pre, next, a) {
  console.log(arguments)
})
```
`pre `表示执行一次回调函数的返回值，第一次执行时`pre`为`arr`的第一项值

上述的返回结果是一个`arguments`的类数组:
```js
// 只取了部分重要的信息
Arguments(4) [1, 2, 1, Array(4)]
Arguments(4) [undefined, 3, 2, Array(4)]
Arguments(4) [undefined, 4, 3, Array(4)]
// undefined表示 没有返回值
// Array(4)表示 声明的arr
```
#### 累加:
```js
var arr = [1, 2, 3, 4]
var result = arr.reduce(function(pre, next, a) {
  console.log(pre, next)
  return pre + next
})

// 结果为:
1 2 //
3 3 //第一个3 表示 上一个回调的执行的(1 + 2)返回值
6 4 //第一个6 表示 上一个回调的执行的(3 + 3)返回值
```
+ 执行第一次回调函数，pre为arr[0]
+ 从arr索引 `1` 开始，next就为arr[1] = 2
+ 返回 pre + next
+ 执行第二次回调，pre为上一次回调的返回值 即 pre + next= 1 + 2 = 3
+ 索引转为 `2` ，next就为arr[2] = 3
+ 返回 pre + next = 6
+ 执行第三次回调，pre为上一次回调的返回值 即 6 
+ 索引转为 `3` ，next就为arr[3] = 4
+ 返回 pre + next = 10
+ 如果arr有更多数据就会一直回调到 index === arr.length
+ ...
  
#### 实现原理：
```js
Array.prototype.reduce = function(callback,initialValue) {
  if (this.length === 0) return console.error('the arr is empty')

  var pre = initialValue ? initialValue : this[0]
  var index = initialValue ? 0 : 1
  for(let i = index; i < this.length; i++) {
    pre = callback(pre, this[i], i, a)
  }

  return pre
}
var arr = [1, 2, 3, 4]
var result = arr.reduce(function (pre, next) {
  return pre + next
})
```
reduce 实质有两个参数  
一个是 `callback` 回调,一个是 初始值 `initialValue` ，如果指定了初始值，那么第一次回调执行时 `pre` 为 `arr[0]`，第一次执行的索引也从 `0` 开始

<hr>

<h3 id="slice">-- Array.prototype.slice --</h3>

`slice` 方法表示数组或者字符串截取某部分内容

str. 或者 arr.slice(a, b) 表示 截取字符串或者数组 从索引 a 开始，b 结束但`不包括b`之间的所有内容成员 即 `[a,b)`  

也可以为`负值` arr.slice(-a, -b) 第a项到b项之间的内容 ↓

 h  e  l  l  o  对应的索引 ↓

-5 -4 -3 -2 -1
```js
var arr = [`h`,`e`,`l`,`l`,`o`]
var str = 'hello'

console.log(arr.slice(1,3)) // -->['e','l']
console.log(str.slice(1,3)) // -->el
console.log(str.slice(-4,-2)) // -->el
```

#### 实现原理:
```js
Array.prototype.slice1 = function (a, b) {
  var start = a ? (a > 0 ? a : this.length - Math.abs(a)) : 0
  var end = b ? (b > 0 ? b : this.length - Math.abs(b)) : this.length
  var result = null
  if (Object.prototype.toString.call(this) === '[object Array]' || Object.prototype.toString.call(this) === '[object Object]') {
    result = []
    for (var i = start; i < end; i++) {
      result.push(this[i])
    }
  } else if (Object.prototype.toString.call(this) === '[object String]') {
    result = ''
    for (var i = a; i < end; i++) {
      result += this[i]
    }
  } else {
    console.error('the obj is not a str or arr')
  }
  return result
}
```

原则上字符串的slice和数组的array不是同一个。

上述写的方法 我自己根据自己能力的掌握情况，熟悉代码而写的，**不一定正确**。实际情况 array的slice应该没有if 去判断this的数据类型

<hr>

<h3 id="classarray">-- slice转换类数组 --</h3>

类数组 就是对象，在形式上与数组类似

```js
var classarray = {
  0:'hello',
  1:'world',
  2:'my love',
  length: 3
}
```
以上的对象一般用法和数组一样 
+ 可以根据索引获取值: classarray[0] --> 'hello'
+ 获取成员数量 classarray.length -->3
+ 但是对象始终是对象，`classarray.push()` 就会 **报错**

可以通过Array原型方法中的slice转化成真正的数组
```js
var arr = Array.prototype.slice.call(classarray)
console.log(arr) -->  ['hello','world','my love']
```
通过call改变 `this` 的指向

#### 实现原理:

```js
Array.prototype.slice1 = function (a, b) {
  var start = a ? a : 0
  var end = b ? b : this.length
  var len = this.length
  if (start < 0) {
    start += len;
    if (start < 0) start = 0;
  } else {
    if (start > len) start = len;
  }

  if (end < 0) {
    end += len;
    if (end < 0) end = 0;
  } else {
    if (end > len) end = len;
  }
  //上述判断 参数的 有无、正负、是否超过最大、最小索引值
  result = []
  if (end < start) return result
  for (var i = start; i < end; i++) {
    result.push(this[i])
  }
  return result
}
```
----------

<h3 id="call">Call</h3>  

#### 概念  
call()方法使用一个指定的`this`值和单独给出的一个或多个参数来调用一个函数, 被调用的函数因此`内部`的`this`指向了该调用者.[MDN Docs](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/call)  

#### 用法  
```js
fun.call(thisArg, arg1, arg2, ...)
```
`thisArg` : 在函数运行时指定的`this`值.  
*if(thisArg === undefined | null) this = window, if(thisArg === number | boolean | string) this = new Array() | new Boolean() | new String()*  
`arg1, arg2` : 指定的参数列表  

使用call方法调用匿名函数

```js
let animals = [
  { species: 'Lion', name: 'King' },
  { species: 'Whale', name: 'Fail' }
]
for(let i = 0; i < animals.length; i++) {
  (function(i) {
    this.print = function() {
      console.log('#' + i + ' ' + this.species + ':' + this.name)
    }
    this.print()
  }).call(animals[i], i)
}

// -->#0 Lion:King
// -->#1 Whale:Fail
```

定义了一个数组里面存放了两个对象.  
利用for循环 将每一次执行的匿名函数绑定(call)了数组里的对象, 此时匿名函数内部的this指向了数组里的对象, 因此打印出的内容就是对象里的内容  

使用call方法调用函数并且指定上下文的`this`

```js
function great() {
  var reply = [this.animal, 'typically sleep between', this.spleepDuration].join(' ')
  console.log(reply)
}

var obj = {
  animal: 'cats', sleepDuration: '12 and 16 hours'
}

great.call(obj)
// --> cats typically sleep between 12 and 16 hours
```
函数`great`调用了`call`方法, 因此会立即执行, 并将内部的this指向了`obj`对象, this.animal --> cats, this.sleepDuration --> 12 and 16 hours

#### 实现原理  
```js
Function.prototype.myCall = function (context) {
  if (typeof this !== 'function') {
    throw Error('not a function')
  }
  let content = context || window     //获取绑定的对象
  let args = [...arguments].slice(1)  //获取myCall传入的参数, 这里就不需要arguments[0]这个绑定对象了,因为已经有了context
  content.fn = this                   //将被调用者(这里是function a)添加到绑定的对象中，作用是让content直接调用a 让内部this指向content
  let result = content.fn(...args)    //利用...扩展语法将参数传入被调用者 a(...args)
  delete content.fn                   //删除这个属性
  return result                       //返回原function 该返回的值 原函数没有返回值就是undefined
}
function a(str) {
  console.log(this.name, str)
}
var obj = {
  name: 'dz'
}
a.myCall(obj, 'is good')  // --> dz is good
```

原本的call函数如果绑定的对象是 1, '1', true...这类基本数据类型转换为包装类型 new Number(), new String(), new Boolean(), 原理是一样的

----------

<h3 id="bind">Bind</h3>  

#### 概念 bind方法创建一个新的函数, 在bind()被调用时, 这个新的函数的this被bind的的第一个参数指定, 其余的参数将作为新函数的参数共调用时使用

```js
var module = {
  x: 42,
  getX: function() {
    return this.x;
  }
}

var unboundGetX = module.getX;
console.log(unboundGetX()); // The function gets invoked at the global scope
// expected output: undefined 因为把getX这个方法赋值给了unboundGetX, 调动时 是window调用的

var boundGetX = unboundGetX.bind(module);
console.log(boundGetX());
// expected output: 42
```

#### 实现原理

```js
Function.prototype.myBind = function(that) {
  var _this = this
  let params = [...arguments.slice(1)]
  return function () {
    _this.apply(that, params)
  }
}
```

### 语法  

*function.bind(thisArg[,arg1[,arg2[,...]]])*

**thisArg** 表示调用绑定函数作为this参数传递给目标函数的值.
**arg11, arg2** 表示预先添加到绑定函数的参数列表中的参数
**返回值** 返回一个与函数的拷贝, 并拥有指定的this值和初始参数

----------

<h2 id="es6">ES6</h2>
<h3 id="letconst">-- let&const--</h3>
 
#### var 

+ 有变量提升，如果在变量被赋值前使用，会返回 `undefined`
+ 能够重复声明，并且声明之后自动挂载到全局 `window` 属性中
+ var 关键词 不能够让{}生成块级作用域

#### let

+ 有变量提升，再被赋值之前成为 ***暂时性死区*** ，简称TDZ(Template Dead Zone)
+ 暂时性死区本质是 变量已经声明在作用域中,但是不能够使用
+ let 关键词能让 { } 生成 `块级` 作用域
例:

```js

let a = 1
function b(){
  console.log(this.a)
}
b() //-->  undefined
```

因为全局let a 不会挂载到全局window对象中，所以this指向a并没有a属性
```js
for(let a = 1; a <= 3; a++){
  setTimeout(() => {
    console.log(a)  //--> 1, 2, 3
  },1)
}
```
let 不仅会让{ }成为块级作用域,每一次循环都会让a存在块级作用域中所以,让{}有属于自己的a，异步执行setimeout时会 打印出相应的值  
**就相当于**  
```js
{
  let a = 0
  setTimeout(() => {
    console.log(a)  //--> 1, 2, 3
  },1)
}
{
  let a = 1
  setTimeout(() => {
    console.log(a)  //--> 1, 2, 3
  },1)
}
{
  let a = 2
  setTimeout(() => {
    console.log(a)  //--> 1, 2, 3
  },1)
}
...
...
...
```

#### const

  + 表示常量，在声明时 必须要赋值
  + 如果该常量是原始值，则该值不能被修改
  + 如果该常量是引用值，则该常量的地址不能被新修改，但能添加属性值  

#### 练习题
`..`  
`..`  
`..`  
???

在ES6开发中 优先使用const 只需要改变某一个标识符的时候采用let

----------

<h3 id="deconstruction">-- 解构 --</h3>

#### 概念

解构赋值：拆解数据解构 来给变量赋值
按照一定的模式，拆解数组，对象字符串的结构给变量赋值，这个这种方法称为结构赋值

例如:

```js
var arr = [1, 2, 3]
let [a, b, c] = arr
console.log(a, b, c) // --> 1 2 3

// 也可以直接写数组字面量， 进行匹配赋值
let [a, b, c] = [1, 2, 3]
```

不完全解构:如果左边匹配到右边模式的所有，则这个结构是完全解构  
不完全解构:如果左右边只匹配到右边模式的一部分，则这个结构是不完全解构  
不成功解构:如果左侧模式中的个别变量没有匹配到右边的模式，则成为不成功解构

```js
let [a, [b, c], d] = [1, [5, 2], 8]
console.log(a, b, c, d) // --> 1 5 2 8
```
```js
let [a, b, d] = [1, [5], 2]
console.log(a, b, c, d) // --> 1 [5] 2 
```
```js
let [a, [b], c] = [1, [3, 5]]
console.log(a, b, c, d) // --> 1 3 undefined
```
```js
let [a, , c] = [1, 4]
console.log(a, c) // --> 1 undefined
```

#### 给变量赋值初始值
1. 
```js
let [a, b = 5] = [1]
console.log(a, b) // --> 1 5
```
如果是不成功匹配时，左边没有匹配到任何数据，可以人为的设置默认值

2. 
```js
function fn() {return 5}
let [a, b = fn()] = [1]
console.log(a, b)  // --> 1 ,5
```
在设置默认变量的默认值时 总是惰性求值


#### 利用扩展写法
```js
let [a, ...b] = [1, 3, 2, 4]
console.log(a, b)  // -->1 [3, 2, 4]
```
`...` 表示匹配多个，会将剩余的数据全部接受 并以数组形式接受，`必须放在最后面`


----------

<h3 id="arrayextend">-- 数组扩展 --</h3>

#### 打散数据，接受数据
借助 `...` 可将数据打散并用变量接受剩余所有数据  
```js
var [a, ...b] = [1,2,3,4,5,7]
console.log(a,b)  //-->  1 [2,3,4,5,7]
```
#### 比较大小
可以简便使用`Math.max` 和 `Max.min`  
```js
var arr = [1,2,45,-99,100]
var max = Math.max(...arr)
var min = Math.min(...arr)
console.log(min, max) //-->-99 100
```
#### 类数组直接转化为数组  
es5中转化为数组:  
```js
var arr = Array.prototype.slice.call('类数组')
```
原理参见 [slice转换类数组](#classarray)

es6中转化为数组  
```js  
var arrobj = document.getElementsByTagName('li') //随意获取多个li标签 是一个类数组
arrobj.push(数据)  // --> error
var arr = [...arrobj] 
arr.push(数据)     // success
console.log(arr)  //-->  [li,li,li]
```

#### 复制数据  
es5 复制数组  
+ arr.concat()
+ arr.slice()
+ arr.slice(0)

es6 复制数组
```js
var arr = [1,2,3]
var arr1 = [...arr]
console.log(arr1) // -->[1,2,3]
```
#### 合并数组
```js
var arr = ['hello','world'], arr1 = ['my','friend']
var mergeArr = [...arr, ...arr1]
console.log(mergeArr) // -->['hello','world','my','friend']
```
#### 新增方法
##### Array.from(类数组) 

将类数组转换为 数组 返回纯数组

##### Array.of(实参1，实参2) 

将实参1和实参2进行整合，返回组成新数组 --> [实参1，实参2]

##### copyWithin(x,y,z) 作用:
+ 赋值 从索引y开始到z`不包括z`之间的数据
+ 把复制的数据从索引x开始 `覆盖`
+ 返回覆盖后的数组，覆盖前后 长度不变
```js
var arr = [1,2,3,4,5]
var ret = arr.copyWithin(1, 2, 4)
console.log(ret) //--> [1, 3, 4, 4, 5]
```
##### arr.fill()
用指定数据填满arr
```js
var arr = [1,2,3]
console.log(arr.fill('baby')) //-->['baby','baby','baby']
```
##### arr.find(回调函数)
返回满足条件的成员, 只要回调返回true arr.find()就返回该成员值
```js
var arr = [1,2,3,4,5]
var ret = arr.find((value, index) => value >= 3) 
console.log(ret) //-->4
```
##### arr.findIndex(回调函数) 
与arr.find()同理 只是返回索引

##### arr.forEach(回调函数) 
只有遍历的作用
```js
var arr = ['a','b','c']
var ret = arr.forEach(function(value,index){
  console.log(value,index) //-->
  /*  
       a 1
       b 2
       c 3
       */
})
```
##### arr.filter(回调函数)
返回一个基于原数组过滤过后的新数组  
回调函数返回值就会添加到新数组中
```js
var arr = ['a','b','c']
var ret = arr.filter(function(value,index){
  return value === 'a'
})
//ret -->['a']
```

##### arr.map(回调函数)
返回一个新数组 该数值中的每一个成员 是每一个回调函数的返回值组成
```js
var arr = ['a','b','c']
var ret = arr.map(function(value,index){
  return value + 'haha'
})
//ret -->["ahaha", "bhaha", "chaha"]
```

##### arr.every(回调函数)
`所有`回调函数的返回值是true 则every的返回值才是true，反之为false
```js
var arr = [1,2,3]
var ret = arr.every(function(value,index){
  return value > 0
})
//ret -->true
```

##### arr.some(回调函数)
所有回调函数中只要有`某一个`回调返回true, 结果就会使true,如果全是false 才会 false
```js
var arr = [1,2,3]
var ret = arr.some(function(value,index){
  return value > 3
})
//ret -->false
```
##### arr.silce(回调函数)
详细见 [slice](#slice)

<hr>

<h3 id="symbol">-- Symbol --</h3>
#### ES6 新增数据类型 symbol

继es5基本数据类型number、string、null、undefined、boolean、Object之后一种新的数据类型 `symbol`

##### 声明

```js
var s1 = Symbol()
console.log(typeof s1) // --> 'symbol'
```

是一个`独一无二`的数据类型

```js
var s1 = Symbol()
var s2 = Symbol()
s1 == s2  //-->false
s1 === s2 // -->false
Object.is(s1,s2) // --> false
```

为了人能认识，可以人为添加 `标识`，让控制台输出的时候能区分到底是哪个值

```js
var s1 = Symbol('s1')
var s2 = Symbol('s2')
```

不是因为人为添加了不同标识 而导致两个Symbol数据不同，而是本身的特征导致两者不一样

无论给Symbol()设置什么标识参数都会 调用该对象的 `toString()` `转换成字符串`

```js
let s1 = Symbol(function(){var b = 1}) // s1 -- > 'Symbol(function(){bar b = 1})'

```

##### Symbol作为对象的属性名

```js
let a = {};
let s4 = Symbol();
// 第一种写法
a[s4] = 'mySymbol';
// 第二种写法
a = {
    [s4]: 'mySymbol'
}
// 第三种写法
Object.defineProperty(a, s4, {value: 'mySymbol'});
// ------------------------------------------
a.s4;  //  undefined 此赋值方式会 让 s4 成为 一个字符串 属性名
a.s4 = 'mySymbol';     //↓
a[s4]  //  undefined   //↓
a['s4']  // 'mySymbol'
```

1. 使用对象的Symbol值作为属性名时，获取相应的属性值`不能用点运算符`

2. 如果用点运算符来给对象的属性赋Symbol类型的值，实际上属性名会变成一个字符串，而不是一个Symbol值

3. 在对象内部，使用Symbol值定义属性时，Symbol值必须放在方括号之中，否则只是一个字符串

```js
let s1 = Symbol('name')
let obj = {
  [s1]:'dz',
  age:23
}
for(vay key in obj) {
  console.log(key)
  //这里不会打印symbol属性名
}
```

##### Symbol值作为属性名的遍历

`for in` 或者 `for of` 不能遍历到symbol数据，也无法通过Object.keys()、Object.getOwnPropertyNames()来获取

可以使用 `Object.getOwnPropertySymbols()` 将对象中的symbol数据转到数组，成为数组的数据，再用for of 遍历,而原对象的其他非symbol数据不会转入

```js
let s1 = Symbol('name')
let s2 = Symbol('name1')
let obj = {
  [s1]:'dz',
  [s2]:'dz1',
  age:23
}

let arr = Object.getOwnPropertySymbols(obj)
// arr此时为[Symbol(dz),Symbol(dz1),23]
for(var key of arr) {
  console.log(key)
}

// 然后利用数组遍历得到symbol数据
var arr1 = Reflect.ownKeys(a)
此时的arr的结果为 []
```

##### Symbol数据转换和运算

+ symbol数据是不能进行运算的,不仅不能和Symbol值进行运算，也不能和其他类型的值进行运算，否则会报错
+ 能转换成字符串
+ 不能用Number转换成数字
+ 能进行布尔运算Boolean(symbol) --> true

##### Symbol.for && Symbol.keyfor

**Symbol.for()** 函数要接受一个字符串作为参数，先搜索有没有以该参数作为名称的Symbol值，如果有，就直接返回这个Symbol值，否则就新建并返回一个以该字符串为名称的Symbol值。

```js
var s1 = Symbol.for('s1')
var s2 = Symbol.for('s1')
s1 === s2 // -->true
```

**Symbol.keyFor()** 函数是用来查找一个Symbol值的登记信息的，Symbol()写法没有登记机制，所以返回undefined。而Symbol.for()函数会将生成的Symbol值登记在全局环境中，所以Symbol.keyFor()函数可以查找到用Symbol.for()函数生成的Symbol值。

```js
let s3 = Symbol.for('s333')
let s4 = Symbol.for('s444444')
console.log(Symbol.keyFor(s3)) --> //'s333'
console.log(Symbol.keyFor(s4)) --> //'s444444'
```

<hr>

<h3 id="iterator">-- Iterator --</h3>

#### 概念

<b>迭代器是一种接口、是一种机制</b>

为各种不同的数据结构提供`统一`的访问机制。任何数据结构只要部署 `Iterator` 接口，可以完成遍历的操作（即一次处理该数据结构点的所有成员）

##### 作用  

1. 为各种数据结构提供一个统一的、渐变的访问接口
2. 使得数据结构的成员能够按某种次序排列
3. 主要供`for of 消费`

##### 过程

1. 创建一个指针对象，指向当前数据结构的起始位置
2. 第一次调用指针对象的`next`方法,可以将指针指向数据结构的第一个成员
3. 第二次调用指针对象的`next`方法,指针就只想数据结构的第二个成员
4. 不断调用指针对象的`next`方法,知道它指向数据结构的结束位置

##### 普通函数实现Iterator

```js
Array.prototype.myIterator = function () {
  var i = 0
  return {
    next:function(){
      var value = this[i]
      var done = this[i++]?false:true
      return {
        value,
        done
      }
    }.bind(this)//调用next的是
  }
}
```
 
<hr>

<h3 id="set">-- Set--</h3>

#### 概念

**ES6提供的新的数据结构，它类似于数组，成员的值都是唯一的，没有重复值**

```js
var s1 = new Set()
console.log(s1)
```

#### 包含的方法
1. add(数据)  向set结构填充数据
2. delete(数据) 向set结构中删除数据
3. has(数据) 判断set结构中有没有指定数据
4. clear() 清空set结构中的所有数据
```js
var s1 = new Set()
s1.add(1)
s1.add("1")
s1.add(function(){let a = 0})
console.log(s1)
// -->Set(4) {1, "1", ƒ, ƒ}
s1.delete(1)
// -->Set(2) {"1", ƒ}
s1.clear()
// --->Set(0) {}
```

#### 函数可以接受一个数组为参数，用来初始化
+ 此参数可以是数组和字符串
+ 对象不可以
+ 类数组
+ child
```js
const set = new Set([1,2,3])
var set = new Set([1,2,3,4])
var set1 = new Set('dzgood')
// set -->Set(4) {1, 2, 3, 4}
// set1-->Set(4) {"d", "z", "g", "o"}
```

#### 遍历操作
**forEach**  
对于Set的遍历，遍历的结果 value值和index值相等，`index不是从索引0开始的`
```js
var set2 = new Set([1,2,3,{'name':'dz'}])
set2.forEach((value,index) =>{
  console.log(value,index)
})
// ↓↓↓↓↓↓
// 1 1
// 2 2
// 3 3
// {name: "dz"} {name: "dz"}
```
#### 数组和字符串去重
利用Set的不能重复的特性 为字符串和数组去重
```js
const items = new Set([1, 2, 3, 4, 5]);
const array = Array.from(items);
```

### weekSet

#### 概念
WeakSet 结构与 Set 类似，也是不重复的值的集合。但是，它与 Set 有两个区别：

1. WeakSet 的成员只能是对象，而不能是其他类型的值。

2. WeakSet 中的对象都是弱引用，即垃圾回收机制不考虑 WeakSet 对该对象的引用，也就是说，如果其他对象都不再引用该对象，那么垃圾回收机制会自动回收该对象所占用的内存，不考虑该对象还存在于 WeakSet 之中。
#### 用法

**用法跟set差不多**

```js
const a = [[1, 2], [3, 4]];
const ws = new WeakSet(a);
// WeakSet {[1, 2], [3, 4]}

//下面的写法不行
const b = [3, 4];
const ws = new WeakSet(b);
// Uncaught TypeError: Invalid value used in weak set(…)
```

WeakSet 结构有以下三个方法。

* **WeakSet.prototype.add(value)**：向 WeakSet 实例添加一个新成员。
* **WeakSet.prototype.delete(value)**：清除 WeakSet 实例的指定成员。
* **WeakSet.prototype.has(value)**：返回一个布尔值，表示某个值是否在 WeakSet 实例之中。

**WeakSet 没有`size`属性，没有办法遍历它的成员。**

<hr>

<h3 id="map">-- Map --</h3>

JavaScript 的对象（Object），本质上是键值对的集合（Hash 结构），但是传统上只能用字符串当作键。这给它的使用带来了很大的限制。

#### 概念

**ES6 提供了 Map 数据结构。它类似于对象，也是键值对的集合，但是“键”的范围不限于字符串，各种类型的值（包括对象）都可以当作键。**

```js
const m = new Map()
const o ={ name:'dz' }

m.set(o, 'content')
m.get(o) // --> 'content'
```
作为构造函数，Map也可以接受一个数组作为参数，该数组的成员是一个个表示键值对的数据

```js
const map = new Map([
  ['name', '张三'],
  ['title', 'Author']
]);

map.size // 2
map.has('name') // true
map.get('name') // "张三"
map.has('title') // true
map.get('title') // "Author"
```
#### 实例的属性和方法

1. size属性  返回成员总数
2. set(key,value)       设置键值对，返回Map结构
3. get(key)          读取key对应的值，找不到就是undefined
4. has(key)         返回布尔值，表示key是否在Map中
5. delete(key)    删除某个键，返回true，失败返回false
6. clear()             清空所有成员，没有返回值

#### 遍历方法

Map 结构原生提供三个遍历器生成函数和一个遍历方法。

* `keys()`：返回键名的遍历器。
* `values()`：返回键值的遍历器。
* `entries()`：返回所有成员的遍历器。
* `forEach()`：遍历 Map 的所有成员。

<hr>

<h3 id="proxy">-- Proxy --</h3>

#### 概念

**proxy用于修改某些操作的默认行为，等同于在语言层面做出修改，属于一种'元编程'，即对编程语言进行编程**

```js
//new Proxy(被代理的对象，拦截器)
//拦截器定义了各种拦截行为
var obj = {
  name:'dz'
}

var p = new Proxy(obj,{
  // 通过代理对象访问被代理对象的属性会触发get()
  get(target,key){
    // target 被代理的对象
    // key 访问的属性
    return '拦截对象'
  }
  // 通过代理对象设置被代理对象的属性会触发set()
  set(target, key, value){
    // target 被代理的对象
    // key 设置的属性
    // value 设置的值
  }
})
```

<hr>

<h3 id="reflect">-- Reflect --</h3>

#### 概述

**`Reflect`对象与`Proxy`对象一样，也是 ES6 为了操作对象而提供的新 API。**

#### 设计目的

1. 将`Object`对象的一些明显属于语言内部的方法（比如`Object.defineProperty`），放到`Reflect`对象上。现阶段，某些方法同时在`Object`和`Reflect`对象上部署，未来的新方法将只部署在`Reflect`对象上。

2. 修改某些`Object`方法的返回结果，让其变得更合理。

   比如，`Object.defineProperty(obj, name, desc)`在无法定义属性时，会抛出一个错误，而`Reflect.defineProperty(obj, name, desc)`则会返回`false`。

3. 让`Object`操作都变成函数行为。某些`Object`操作是命令式，比如`name in obj`和`delete obj[name]`，而`Reflect.has(obj, name)`和`Reflect.deleteProperty(obj, name)`让它们变成了函数行为。

4. `Reflect`对象的方法与`Proxy`对象的方法一一对应，只要是`Proxy`对象的方法，就能在`Reflect`对象上找到对应的方法。这就让`Proxy`对象可以方便地调用对应的`Reflect`方法，完成默认行为，作为修改行为的基础。也就是说，不管`Proxy`怎么修改默认行为，你总可以在`Reflect`上获取默认行为。

<hr>

<h3 id="promise">-- Promise --</h3>

Promise是异步编程的一种解决方案，比传统的解决方案-->回调函数和事件 更合理更强大

#### promise概念

**Promise** 简单说就是一个容器，里面保存着某个未来才会结束的事件（通常是一个异步操作）的结果
形成一种`链式编程`

#### 状态

promise就是一哥机器 有三种状态:

1. pending 待机
2. resolved 工作，成果状态
3. rejected 失败状态

resolved状态的promise机器就会触发then的第一个回调  
resolved状态的数据 会作为参数传递到第一个回调函数中  
rejected状态的promise机器就会触发then的第二个回调

```js
let p = new Promise((res, rej) => {
  // res('success')
  rej('err')
}).then(data => {
  console.log(data)
  // return undefined
}, err => {
  console.log(err)
  // return undefined
})
```

then返回一个新的promise机器,这个机器的状态由回调函数返回的状态决定，回调默认return undefined, 此时then返回的promise机器默认只有成功 返回一个失败状态的promise，才会让then返回的promise机器的状态为失败  
失败的状态触发的回调可以由catch来执行，成功的状态由then执行

```js
let p = new Promise((res, rej) => {
  // res('success')
  rej('err')
}).then(data => {
  console.log(data)
  // return undefined
}).catch(err => {
  , err => {
  console.log(err)
  // return undefined
})
```

#### 解决回调地狱

```js
new Promise((res, rej) => {
  setTimeout(() => {
    console.log('kaishi')
    res('first machine')
  }, 1000);
}).then( data => {
  setTimeout(() => {
    console.log('zhixing')
  }, 500);
}).then( () => {
  console.log('jieshu')
},200)
```

结果为 先 kaishi -> jieshu --> zhixing 而不是 kaishi -> zhixing -->  jieshu  
因为在第一个then回调 会同步的返回undefined返回成功状态的机器，会立即执行第二个then

```js
new Promise((res, rej) => {
  setTimeout(() => {
    console.log('kaishi')
    res('first machine')
  }, 1000);
}).then( data => {
  return new Promise((res, rej) => {
  setTimeout(() => {
    console.log('zhixing')
    res('second machine')
  }, 500);
  })

}).then( () => {
  console.log('jieshu')
},200)
```

让then回调中返回promise机器，并且在及其中延时执行后res返回成功状态，触发下一个then

#### promise工作原理

##### promise.all([])

需求本身依赖多个请求, 只有多个请求都请求回来了才执行下一步操作

```js
let p1 = new Promise((res, rej) => {
  setTimeout(() => {
    res('p1')

  }, 1000);
})
let p2 = new Promise((res, rej) => {
  setTimeout(() => {
    res('p2')

  }, 200);
})
let p3 = new Promise((res, rej) => {
  setTimeout(() => {
    res('p3')

  }, 500);
})

let p = Promise.all([p1,p2,p3])
```

如果所有promise机器状态都是resolved 则all函数返回的结果就是resolved  
有一个奇迹状态是rejected 则all函数的返回结果就是rejected  

```js
Promise.all([
  new Promise((res, rej) => {
    setTimeout(() => {
      res('resovle1')
    }, 1000);
  }),
  new Promise((res, rej) => {
    setTimeout(() => {
      res('resovle2')
    }, 1000);
  })
]).then(res => {
  console.log(res)
}).catch(err => {
  console.log(err)
})
```

都成功会执行console.log(res) 是一个数组 分别储存了 成功的返回结果, 其中一个失败了就会执行catch
  

##### promise.race([])

```js
let p1 = new Promise((res, rej) => {
  setTimeout(() => {
    res('p1')

  }, 10000);
})
let p2 = new Promise((res, rej) => {
  setTimeout(() => {
    res('p2')

  }, 20000);
})
let p3 = new Promise((res, rej) => {
  setTimeout(() => {
    res('p3')

  }, 50000);
})

let p = Promise.race([p1,p2,p3])
```

上面代码中，只要`p1`、`p2`、`p3`之中有一个实例率先改变状态，`p`的状态就跟着改变。那个率先改变的 Promise 实例的返回值，就传递给`p`的回调函数。

##### Promise.resolve(xx)

初始定义一个成功状态的promise机器  

```js
let p = Promise.resolve('123')
```

用处

```js
new promise((res, rej) => {
  // do something async
  res.('sth')
}).then(res => {
  // do another something

  return new promise((res, rej) => {
  // do something another async
    res('sth')
  })
}).then(res => {
  console.log(res)
})
```

其中的

```js
return new promise((res, rej) => {
// do something another async
  res('sth')
})
```

可以直接写为:

```js
return promise.resolve(res)
```

##### Promise.reject()

初始定义一个失败状态的promise机器

```js
let p = Promise.reject('123').catch( err => {console.log(err)})
```

可以通过 `throw 'err'` 来捕获错误信息, 触发.catch或者失败reject

<hr>

<h3 id="generator">-- Generator --</h3>

Generator是ES6提供的一种异步编程解决方案，语法行为与传统的函数完全不同  
执行 Generator 函数会返回一个遍历器对象，也就是说，Generator 函数还是一个遍历器对象生成函数。返回的遍历器对象，可以依次遍历 Generator 函数内部的每一个状态。

```js
function* a() {
  yield 1
  yield setTimeout(() => {
    console.log(1)
  }, 1000);
  yield 3
  console.log(123)
}
let fn = a()
```

a()函数不会立即执行，会遇到 `yield` 停止,进行断点  
a()函数返回结果是一个iterator接口，需要调用next()方法让函数执行一次，直到遇到下一个`yield`表达式  
next()返回的value值为yield后面表达式的值，done为执行状态

#### 注意

`yield`表达式只能用在 Generator 函数里面，用在其他地方都会报错。

另外，`yield`表达式如果用在另一个表达式之中，必须放在圆括号里面。

```js
console.log('Hello' + yield 123); // SyntaxError
console.log('Hello' + (yield 123)); // OK
```

#### 与 Iterator 接口的关系

由于 Generator 函数就是遍历器生成函数，因此可以把 Generator 赋值给对象的`Symbol.iterator`属性，从而使得该对象具有 Iterator 接口

同时可以利用`for..of`循环遍历generator函数返回的`Iterator`对象，此时并不需要调用next()了

```js
function* fibonacci() {
  let [pre, cur] = [1, 1]
  while (true) {
    [pre, cur] = [cur, pre + cur]
    yield cur
  }
}

for(key of fibonacci()) {
  console.log(key)
  if(key > 300) break
}

```
#### next 方法参数
`yield` 表达式本身没有返回值，或者说是返回 `undefined` 。`next` 方法可以带一个参数，该参数会作为 上次一 `yield` 表达式的返回值
```js
function* fn() {
  for(let i = 1; true; i++) {
    let reset = yield i
    if(reset) { i = -1}
  }
}

let a = fn()
a.next() // --> {value = 1, done: false}
a.next() // --> {value = 2, done: false}
a.next(true) // --> {value = 0, done: false}
```
#### 结合Promise

```js
function* promise() {
  yield new Promise((res, rej) => {
    setTimeout(() => {
      console.log(1)
      res('first machine')
    }, 1000);
  })
  yield new Promise((res, rej) => {
    console.log(2)
    setTimeout(() => {
      res('first machine')
    }, 200);
  })
  yield new Promise((res, rej) => {
    console.log(3)
    setTimeout(() => {
      res('first machine')
    }, 500);
  })
}
let p = promise()
p.next().value.then(() => {
  return p.next().value
}).then(() => {
  return p.next().value
})
```
----------

<h3 id="sync">-- Sync --</h3>
ES2017 标准引入了 async函数，使异步操作变得更加方便

async 函数是Generator函数的语法糖

#### 语法糖
是指没有给计算机语言添加新功能，而只是对人来来说更 甜蜜 的语法。语法糖往往给程序员提供了更适用的编码方式，有益于更好的编码风格，更衣读。不过并没有给语言添加什么新东西  
反之  
语法盐，反人类设计

#### 使用
`async` 函数就是将Generator函数的星号 `*` 替换成 `async` ，将`yield`替换成`await`,仅此而已
```js
async function fn() {
  await new Promise((res, rej) => {
    setTimeout(() => {
      console.log(1)
    }, 1000)
  })
  console.log(2)
}
let p = fn() // --> Promise {<resolved>: undefined}
```

async 函数的返回结果是promise  
状态默认是成功的  
值是函数的返回值  

await 关键词后面一般是promise机器
等到该机器状态为resolve才会执行后面的代码
```js
async function fn() {
  console.log(2)
  await new Promise((res, rej) => {
    console.log(3)
    setTimeout(() => {
      console.log(4)
    }, 0);
  })
  console.log(5)
}
fn()
console.log(1)
```
结果为 2 3 1 4 5

如果await 接收到了一个失败状态的机器 就不会执行 之后的console.log(5),如果仍需要执行错误后代码
可以添加try()...catch()
```js
async function fn() {
  console.log(2)
  try {
    await new Promise((res, rej) => {
      console.log(3)
      setTimeout(() => {
        console.log(4)
      }, 0);
    })
  } catch (error) {
    console.log(5)
  }
}
fn()
console.log(1)
```

#### try catch

JS报错分类

1. 语法错误
  + 非法的标识 `Unexpected token`
2. 引用错误
  + 顺着作用域链没找该变量 `Uncaught ReferenceError: is not defined`
3. 类型错误
  + 顺着作用域找到该变量，但是使用错误`Uncaught TypeError: is not a function`
4

#### 区别

1. 内置执行器。

Generator 函数的执行必须靠执行器，而`async`函数自带执行器。也就是说，`async`函数的执行，与普通函数一模一样，只要一行。

2. 更好的语义。

`async`和`await`，比起星号和`yield`，语义更清楚了。`async`表示函数里有异步操作，`await`表示紧跟在后面的表达式需要等待结果。

3. 正常情况下，`await`命令后面是一个 Promise 对象。如果不是，会被转成一个立即`resolve`的 Promise 对象。

4. 返回值是 Promise。

----------


<h2 id="object">对象</h2>

### 概念

万物皆对象，它是js中属性和方法的一种集合，可以利用这些集合进行一些属性表达和对某一信息进行相应的操作。

包装的对象使用后会立即销毁，下一次包装会是另一个包装的对象

----------

<h3 id="defineproperty">-- defineProperty --</h3>

#### 概念

Object.defineProperty()方法会直接在一个对象上定义一个新属性, 或者修改一个对象的现有的属性, 并返回这个对象

```js
Object.defineProperty(obj, prop, descriptor)
```
obj: 要在其上定义的属性的对象
prop: 要定义或者要修改的属性的名称
descriptor:将被定义或修改的属性描述符

#### 属性描述符

数据描述符  
数据描述符是一个具有值的属性，该值可能是可写的，也可能不是可写的  
存取描述符  
由getter-setter函数对描述的属性  
存取描述符是由getter-setter函数对描述的属性。描述符必须是这两种形式之一；不能同时是两者。

数据描述符和存取描述符均具有以下可选键值(默认值是在使用Object.defineProperty()定义属性的情况下)：

configurable  
当且仅当该属性的 configurable 为 true 时，该属性描述符才能够被改变，同时该属性也能从对应的对象上被删除。默认为 false。  
enumberable  
当且仅当该属性的enumerable为true时，该属性才能够出现在对象的枚举属性中。默认为 false。
数据描述符同时具有以下可选键值：

value  
该属性对应的值。可以是任何有效的 JavaScript 值（数值，对象，函数等）。默认为 undefined。
writable
当且仅当该属性的writable为true时，value才能被赋值运算符改变。默认为 false。
存取描述符同时具有以下可选键值：

get  
一个给属性提供 getter 的方法，如果没有 getter 则为 undefined。当访问该属性时，该方法会被执行，方法执行时没有参数传入，但是会传入this对象（由于继承关系，这里的this并不一定是定义该属性的对象）。
默认为 undefined。
set  
一个给属性提供 setter 的方法，如果没有 setter 则为 undefined。当属性值修改时，触发执行该方法。该方法将接受唯一参数，即该属性新的参数值。
默认为 undefined。
<h3 id="regexp">-- RegExp --</h3>

#### 概念

正则表达式用于匹配字符串中的字符组合的模式.在js中正则表达式也是对象

----------

<h3 id="constructor">-- Constructor --</h3>

#### 构造函数

##### 创建对象的方式

1. 对象字面的方式

```js
var obj = {}
obj.name = 'dz'
obj.age = 23
```
代码冗余量大

1. 工厂模式创建对象

```js
function person(name,age) {
  var obj = {}
  obj.name = name 
  ibj.age = age
  return obj
}
var p1 = person('dz',23)
```

每次都要生成对象字面量和返回对象，并且没有解决对象的识别问题，不知道这个对象的类型

3. 构造函数
```js
function Person(name,age) {
  this.name = name
  this.age = age
}
var p1 = Person('dz',23)
```

构造函数简化了工厂模式的操作过程，并且通过实例化对象，可以知道该对象的标识，能识别是被哪一个构造函数创造的，使用`instanceof` 来判断是否属于某个构造函数的实例
```js
p1 instanceof Person //true
p1 instanceof Object //true
```

缺点是构造内部的函数被复制了多份开辟了多个空间，而多个公有函数造成了内存浪费。
**new 关键词的作用**
1. 在函数内部生成一个空对象
2. 将函数内部的this指向这个空对象
3. 隐式的return返回这个对象

----------

<h3 id="prototype">-- Prototype --</h3>

#### 原型的概念

每个函数都会有一个`prototype对象属性`，而原型对象属性里面有一个`constructor`属性，指向了这个函数

而prototype的所有属性和方法，都会被构造函数的实例`继承`，意味着可以把那些不变的公用的属性和方法直接定义在prototype对象属性上

每一个构造函数的实例 都会有一个`__proto__`属性，该属性指向了构造函数的原型对象

#### 实例方法的使用

```js
function Person(name,age){
    /*
    *   {
    *       __proto__:Person.prototype,
    *       name:'海文',
    *       age:28
    *   }
    * */
    this.name = name;       //特性
    this.age = age;         //特性
}
/*Person.prototype 是原型（原始模型）是一个对象*/
Person.prototype.sayName = function(){      //共性
    console.log(this.name);
}
var person1 = new Person('海文',28);
var person2 = new Person('heaven',30);

console.log(person1.sayName === person2.sayName)// -->true
```
为什么对象有原型上的方法：
对象查找方法的规则是1.先在自身上面找有没有指定的属性
2.如果没有在自身找到指定属性，那就从__proto__属性中查找有没有该指定属性

#### 原型练习

1.

```js
function Person(){
    /*
    *   {
    *       __proto__:Person.prototype,
    *   }
    * */
}

/*
*   Person.prototype:{
*       name:'oldsix'
*   }
* */
Person.prototype.name = 'heaven';
var person1 = new Person();
Person.prototype.name = 'oldsix';
console.log(person1.name); // --> oldsix
```

2.

```js

function Person(){
    /*
    *   {
    *       __proto__:Person.prototype  (1)
    *   }
    * */
}

/*
*   Person.prototype={  (1)
*       name:'heaven'
*   }
*
*    Person.prototype={  (2)
*       name:'oldsix'
*   }
* */
Person.prototype.name = 'heaven';
var person1 = new Person();
Person.prototype = {
    name:'oldsix'
}
console.log(person1.name); // -->heaven
```

3.

```js
function Person(){
/*
*   {
*       __proto__:Person.prototype(2)
*   }
* */

}
/*
*   Person.prototype={ (1)
*       name:'heaven'
*   }
*
*   Person.prototype={ (2)
*       name:'oldsix'
*   }
*
* */
Person.prototype.name = 'heaven';
Person.prototype = {
    name:'oldsix'
}
var person1 = new Person();
console.log(person1.name); // --> oldsix
```

4. 

```js
function Person(){
    /*  __proto__这个属性记录person1的原始模型
    *   this:{
    *       __proto__:Person.prototype(1)
    *   }
    *
    *   return this
    * */
}
/*
*  Person.prototype = {   (1)给原始模型设置name属性
*       name:'heaven'  -->  '小明'
*  }
*
*  Person.prototype = {   (2)
*       name:'oldsix'
*  }
* */
Person.prototype.name = 'heaven';
var person1 = new Person();
Person.prototype = {
    name:'oldsix'
}
person1.__proto__.name = '小明';
console.log(Person.prototype.name); // --> oldsix
```

5.

```js
function Person() {
        /*  __proto__这个属性记录person1的原始模型
        *   this:{
        *       __proto__:Person.prototype(1)
        *   }
        *
        *   return this
        * */
}
    /*
    *  Person.prototype = {   (1)
    *      name:'oldsix'  --> 'heaven'  -->'小明'
    *  }
    *
    * */
Person.prototype = {
    name:'oldsix'
}
var person1 = new Person();
Person.prototype.name = 'heaven';
person1.__proto__.name = '小明';
console.log(Person.prototype.name); // --> 小明

//----------------------------------------------
function Person(){

}
Person.prototype = {
    name:'oldsix'
}
var person1 = new Person()
person1.__proto__ = {
    name:'我把你的指向搞乱了'
}
console.log(person1.name) // -->'我把你的指向搞乱了'
```

6.

```js
function Person() {

}
Person.prototype.name = 'heaven';
var person1 = new Person();
person1.__proto__.name = 'xiaoming';
console.log(Person.prototype.name); // --> 小明
```

7.

```js
function Person(){
}
Person.prototype.name = 'heaven';
var person1 = new Person();
Person.prototype = {
      name:'oldsix'
}
person1.__proto__ = {
    name:'xiaoming'
}
console.log(person1.name); // --> xiaoming
```

#### 原型链

只要是对象就会有__proto__属性 指向对象的原型

对象的原型初始存在constructor这个属性，这个属性
记录了原始模型的构造函数

对象的原型也是对象，所以会存在__proto__这个属性，它指向了JS内置的构造函数的原型 Object.prototype

```js
console.log(person1.__proto__.__proto__ === Object.protptype) // --> true
```

```js
function GrandPa() {
  
}
GrandPa.prototype.sex = 'male'
const grand = new GrandPa()
function Father() {
  this.age = 23
}
Father.prototype = grand
function Son() {
  this.name = 'dz'
}
Son.prototype = Father
const son = new Son()
console.log(son.name) // --> dz
console.log(son.age)  // --> 23
console.log(son.male) // --> male
Father.prototype
```

实例对象方法或者属性的使用，会在自身的构造函数中查找，如果没有顺着`__proto__`在原型对象中查找，如果原型中没有该属性或者方法，`再一次在原型的原型`中寻找，再没有就会去下一个原型对象中寻找，这样规律查找下去，直到`原型链`的顶端`Object.prototype`，，或者找到该属性或者方法

#### 属性的检测

**hasOwnproperty()**

判断某个属性是否是实例对象自身的属性，而不是原型上的属性

```js
function Person() {
  this.name = 'dz'
}
const son = new Person()
console.log(son.hasOwnProperty(''name)) // --> true
```
**instanceof**

person1 instanceof Person

判断实例对象person1的原型链上是否有构造函数Person的原型

#### 继承

1. 原型继承

```js
function Father() {
  var colors = ['red','blue','black']
}

function Son() {

}

Son.prototype = new Father()

var instance = new Son()
instance.colors.push('pink')

var instance1 = new Son()
console.log(instanc1.colors) //-->['red','blue','black','pink'] 继承了同一个color数组对象
```

在原型链上，对象可以沿着原型链查找自身没有的属性和方法，因此就继承了另外对象的属性和方法

弊端:子类型实例时不能给超类型的构造函数进行参数传递, 和原型包含引用值, 子类继承同一个引用值

2. 借用构造函数

```js
function Father(lastName, province) {
  this.lastName = lastName
  this.province = province
}
const father = new Father('deng', 'cq')
function Son(lastName, province) {
  // this.lastName = lastName
  // this.province = province
  Father.call(this, lastName, province)
}
const son = new Son('dz', 'bj')
```

在一个构造函数启用另一个构造函数，并借用另一个构造函数的属性和方法
特点:

+ 之继承父类构造函数额属性,没有继承父类原型的属性
+ 解决了原型链继承的传参, 继承单一, 共享原型上的属性的问题
+ 可以有多个继承

弊端:

+ 每执行一次构造函数都会多执行一次借用的构造函数(每个实例都有父类构造函数的副本)
+ 只能继承父类构造函数的属性
+ 无法实现构造函数的复用

3. 共享原型

```js
function Father() {
  this.like = 'apple'
}
Father.prototype = {
  name:'father'
  age:23
}

function Son(){
  this.hobby = 'basketball'
  this.name = 'son'
}
Son.prototype = Father.prototype
const son = new Son()
console.log(son.name) //son
```

共享原型的方法，可以选择性的要继承哪一个构造函数的原型对象上的方法，避免了 原型继承的多个属性方法继承

弊端:
```js
function Father() {
  this.like = 'apple'
}
Father.prototype = {
  name:'father',
  age:23,
  fav:['sth1','sth2','sth3']
}

function Son(){
  this.hobby = 'basketball'
  this.name = 'son'
}
Son.prototype = Father.prototype
const son = new Son()
console.log(son.age) // --> 23
Son.prototype.age = 100
console.log(son.age) // --> 100
```

可以看出为Son添加原型属性时 却是给Father构造函数的原型中的属性修改了，这擅自修改了Father原型属性。违背了继承 可以访问 但是不能更改

4. 圣杯继承

```js
function Father() {
}
Father.prototype = {
  name :'dz',
  age :23
}
function Buffer() {
}

function Son() {
  this.name = 'dz2'
}

Buffer.prototype = Father.prototype
Son.prototype = new Buffer()
Son.prototype.constructor = Son
const son = new Son()
console.log(son.age) // --> 23
Son.prototype.age = 100
console.log(son.age) // --> 100
console.log(Father.prototype.age) // --> 23
```

解决了修改对象原型上的数据，而不会修改原型的原型上的数据

5. 组合继承

```js
function Father(name) {
  var arr = [1,2,3,4]
}
Father.prototype.sayName = function() {console.log(this.name)}
function Son(name, age) {
  Father.call(this, name)
  this.age = age
}
Son.prototype = Father.prototype
Son.constructor = Son
Son.prototype.sayAge = function() {console.log(this.age)}
var instance = new Son('dz', 23)
instance.colors.push(5)

var instance1 = new Son('dz1', 24)
console.log(instance1.colors) --> [1, 2, 3, 4, 5]
```

避免了原型链和借用构造函数的缺陷, 融合了它们的有点

#### 原型链上的toString()

```js

Object.prototype.toString.call(what)
```

返回的的结果是`what`的数据类型

```js
Object.prototype.toString.call([]) // --> '[object Array]'
Object.prototype.toString.call({}) // --> '[object Object]'
Object.prototype.toString.call(2) // --> '[object Number]'
Object.prototype.toString.call(function(){}) // --> '[object Function]'
Object.prototype.toString.call(/\d/) // --> '[object Reg]'

```

typeof 无法检测 引用值的类型，只能检测原始值的类型

----------

<h3 id="class">-- Class --</h3>

js以前创建对象通过实例化构造函数产生一个对象，没有类的概念

**class**  
通过class关键词定义一个类，这个类的数据类型是function

```js
class Person{
  constructor(name,age){
    //构造函数，通过new启动了类 就会自动执行constructor这个函数
    this.age = age
    this.name = name
  }
  sayName(){
    console.log(this.name)
  }
  static hello(){

  }
}
const person = new Person()
console.log(typeof Person)
```

#### 注意

1. 这样创建方法实质和ES5中的构造函数一样  
2. 在构造函数中添加方法就是在Constructor里面添加属性和方法  
3. 在constructor函数代码块外面 可定义类的原型  
4. 在calss里面只能写函数 而且函数会自动挂到prototype上
5. 必须使用new启用class，不然会报错
6. `static` 表示静态，加了static的函数`不会`挂载到prototype上,而是挂载到class类上

#### class继承

ES5中继承 有原型继承、借用构造函数继承等等

ES6中继承利用`extends`关键词

```js
class Person{ //父类
  constructor(name,age){
    this.age = age
    this.name = name
  }
  sayName(){ // 子类
    console.log(this.name)
  }
}
class Student extends Person{
  // constructor(name, age){} // 会报错
  constructor(name, age){
    super(name, age)
  }
}
const student = new Student('dz',12)
```

student 继承了 Person 类, 继承了父类的原型属性。并自动创建了constructor执行，如果`手动显示的创建`constructor(){} 会报错,因此需要加上`super()`

super在子类的constructor中指的是父类的constructor，并且要添加 相对应的形参

```js
class Person{ //父类
  constructor(name,age){
    this.age = age
    this.name = name
  }
  sayName(){ // 子类
    console.log('父类的方法')
  }
}
class Student extends Person{
  // constructor(name, age){} // 会报错
  constructor(name, age){
    super(name, age)
  }
  // sayName(){
  //   console.log('子类的方法')
  // }
  sayName(){
    super.syaName()
  }
}
const student = new Student('dz',12)
student.sayName() // --> 子类的方法
```

上诉父类子类都有同样的方法，但是会优先执行自身的方法，也可以那 通过`super.sayName` 来调用父类中的方法

除了constructor中的super是一个函数外，其他时候的super表示父类的原型

----------

<h3 id="observer">-- Observer --</h3>

#### observer概念

观察者模式:定义了对象间一种 `一对多`的依赖关系, 当目标对象`Subject`的状态发生改变时, 所有依赖它的对象`Observer`都会得到通知  
这种模式的实质就是我们可以对某对象的状态进行观察, 并且在状态改变的时候得到通知(以进一步作出相应的行为)  

Subject -被观察者, 发布者  
Observer-观察者, 订阅者  

被观察者: 主要功能是维护订阅自己的人以及分发消息

```js
const Pulish = function(name) {
  this.name = name
  this.subscribers = []
}

Dev.prototype.deliver = function (news) {
  const pulish = this

  this.subscribers.forEach(item => {
    item(news, pulish)
  })
  return this
}
```

订阅者:主要功能是订阅或取消订阅

```js
Function.prototype.subscribe = function (publish) {
  const sub = this
  const alreadyExists = publish.subscribers.some(item => {
    return item === sub
  })
  if (!alreadyExists) publish.subscribers.push(sub)
  return this
}

// 取消订阅
Function.prototype.unsubscribe = function (publish) {
  const sub = this
  publish.subscribers = publish.subscribers.filter(item => {
    return item !== sub
  })

  return this
}
```

订阅和通知

```js
// 发布者
const pub1 = new Publish('no1')
const pub2 = new Publish('no2')
const pub3 = new Publish('no3')

// 订阅者
const sub1 = function (news, pub) {
  console.log('sub1', 'news' + news, 'pub' + pub.name)
}
const sub2 = function (news, pub) {
  console.log('sub2', 'news' + news, 'pub' + pub.name)
}

// 订阅 
sub1.subscribe(pub1).subscribe(pub2)
sub2.subscribe(pub2)

// 通知
pub1.deliver(document.getElementById('text1').value, pub1);
pub2.deliver(document.getElementById('text2').value, pub2);
```

另一种：

```js
class Subject {
  constructor(name) {
    this.name = name
    this.subs = []
  }

  addSubs(observer) {
    this.subs.push(observer)
  }
  remSubs(observer) {
    this.subs.filter = this.subs.filter(item => {
      return item !== observer
    })
  }
  notify() {
    for(let item of this.subs) {
      item.update()
    }
  }
}

class Observer {
  constructor(name) {
    this.name = name
  }
  update() {
    console.log('更新了,我是订阅者:' + this.name)
  }
}

const sub = new Subject('发布者1号')

const obs1 = new Observer('dz1')
const obs2 = new Observer('dz2')

sub.addSubs(obs1)
sub.addSubs(obs2)

sub.notify()
```

优缺点：

+ 优点明显：降低耦合，两者都专注于自身功能

+ 缺点也很明显：所有观察者都能收到通知，无法过滤筛选

----------

<h3 id="Publisher&Subscriber">-- 发布订阅模式 --</h2>

#### pubSub概念

基于一个事件(主题)通道, 希望接受通知的对象Subscriber通过自定义事件订阅主题, 被激事件的对象Publisher通过发布主题事件的方式通知各个订阅该主题的Subscriber对象  

发布订阅模式与观察者模式的不同，“第三者” （事件中心）出现。目标对象并不直接通知观察者，而是通过事件中心来派发通知  

```js
// 事件通道, 控制中心
let pubSub = {
  list: {},
  subscribe(key, fn) {
    if (!this.list[key]) this.list[key] = []
    this.list[key].push(fn)
  },
  unsubscribe(key, fn) {
    let fnList = this.list[key]
    if (!fnList) return false
    if (!fn) {
      fnList.forEach((item, index) => {
        item === fn && fnList.splice(index, 1)
      })
    }
  },
  publish(key, ...args) {
    for (let fn of this.list[key]) {
      fn.call(this, ...args)
    }
  }
}

// 订阅
pubSub.subscribe('onwork', time => {
  console.log(`上班了：${time}`);
})
pubSub.subscribe('offwork', time => {
  console.log(`下班了：${time}`);
})
pubSub.subscribe('launch', time => {
  console.log(`吃饭了：${time}`);
})

pubSub.subscribe('onwork', work => {
  console.log(`上班了：${work}`);
})

// 发布
pubSub.publish('offwork', '18:00:00');
pubSub.publish('launch', '12:00:00');

// 取消订阅
pubSub.unsubscribe('onwork');

```

优缺点：

+ 优点：解耦更好，细粒度更容易掌控；

+ 缺点：不易阅读，额外对象创建，消耗时间和内存（很多设计模式的通病）

两种模式(观察者模式和发布订阅者模式)的关联和区别

1. 发布订阅模式更灵活，是进阶版的观察者模式，指定对应分发。

观察者模式维护单一事件对应多个依赖该事件的对象关系；

2. 发布订阅维护多个事件（主题）及依赖各事件（主题）的对象之间的关系；

3 .观察者模式是目标对象直接触发通知（全部通知），观察对象被迫接收通知。发布订阅模式多了个中间层（事件中心），由其去管理通知广播（只通知订阅对应事件的对象）；

4. 观察者模式对象间依赖关系较强，发布订阅模式中对象之间实现真正的解耦。

----------

<h2 id="timeline">-- JS时间线 --</h2>

### 页面执行的顺序

1. DOM树的生成 `深度优先` 生成规则

document -> html -> head, body -> head 中的标签 -> body中的标签 -> ...把每个标签内部的元素生成在换其他DOM节点

2. 遇到特殊节点时

img 标签 先解析img节点，然后就挂载到DOM中，不会等图片下载完才继续生成下一节点，`异步`的下载

style、iframe、link 也是先挂载到DOM树中，不会等待资源下载完成，`异步`的下载

script标签，`同步`下载资源，下载对应资源，会`阻塞`DOM的解析,因此把script标签放在最后，也就是body标签中，这个时候dom树已经解析完成。

####  为什么script会阻碍DOM树的解析

因为script内部有增删节点的DOM操作，会导致DOM树的紊乱

####  异步加载script

对DOM解析无害的js代码 可以设置异步执行

谷歌中

async前缀<script src="" async></script>

IE中低版本中

defer前缀<script src="" async></script>

#### 兼容谷歌和IE

```js
let oScript = document.createElement('script)
oScript.src = './x.js'
document.body.appenChild(oScript)
```

作用就是在body标签最后引入了<script src="./x.js"></script>

下载x.js文件 是异步进行的，所以x.js里面即时有方法，也不能在后续立马调用

#### 在谷歌中

页面或者图片或者script完成时触发onload事件，即onload中可以使用x.js中方法或者变量

```js
oScript.onload = function() {}
```
#### 在IE低版本监听script加载完成时触发

页面或者图片或者script完成时触发onreadystatechange事件,并将状态`readyState`变为`complete`，即可以使用x.js中方法或者变量
```js
oScript.onreadystatechange = function() {
  if(this.readyState === 'complete') {
    ...
  }
}
```

#### 封装函数让指定的js文件异步加载
```js
function loadScript(url, callback) {
 let oScript = document.createElement('script')
 oScript.src = url
 document.body.appenChild(oScript)

 if(oScript.onload == null) {
   callback()
 } else {
   oScript.onreadystatechange = function() {
     if(this.readyState === 'complete') {
       callbak()
     }
   }
 }
}

//让x.js中的auto方法异步执行
loadScript('./x.js', function() {
  auto()
})
```

#### 时间线
1. 创建document对象，解析html元素和他们的文本内容后添加Element对象和Text节点搭配文档中。这个阶段document.readyState = ’loading‘
2. 如果遇到link外部css文件，浏览器会创建新的线程，同时继续解析文档
3. 如果遇到外部js文件并且没有async、defer 浏览器会加载js文件，阻塞主线程登到js文件加载完成并执行该文件，然后继续解析文档
4. 如果遇到外部并设置有defer、async浏览器会创建新的线程加载js文件，同时继续解析文档。对async属性的js文件，会在js文件加载完成后立即执行 
5. 如果遇到img 或者iframe 浏览器解析dom结构时，会异步加载src同时解析DOM树
6. 当DOM文件解析完成document.readyState = 'interactive'
7. 文档解析完成后，所有设置有defer的脚本会按照顺序执行
8. document对象触发DOMcontentLoaded事件，这也标志着程序执行从同步执行阶段转化为事件驱动阶段
9. 当所有async的脚本加载完成并执行后、img等加载完成后，document.readyState = 'complete' window对象触发load事件

```js
window.onload = function () {
  console.log('页面资源加载完成')
}
document.addEventListner('DOMContentLoaded', function() {
  console.log('dom树解析完成')
})
```
onload永远都会比DomContentLoaded `后` 触发