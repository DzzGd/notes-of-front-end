JS 中的 `this` 指向问题一直困扰着我. 终于剩下点时间把它简单的搞了个明白.

> JS 中目前我所知道的改变this指向的方法就是 `bind`, `call`, `apply`, 还有就是 箭头函数 特殊的 this 指向变化

## JS this 指向问题

我以前经常会犯一种错误就是误以为把函数当做`变量`传给另一个`变量`时, 里面的 this 会保持不变, 结果大错特错. 看个列子

```javascript
const person = {
  words: 'i\'m dz',
  say: function () {
    console.log(this.words)
  }
}

person.say() // i'm dz
```

上面有一个 `person` 对象, 然后调用 `say`方法, 就答应除了 对象中的 `words` 变量

现在将 `say` 方法 传给另一个变量

```javascript
let say1 = person.say
say1() // undefined
```

这个时候就会答应 `undefined`. 原因就是因为 say1 里面的 this 已经指向了 `window` 而 window对象 里面并没有 `words`变量:

```javascript
say1() // 相当于 window.say1()
```

**函数内部的this指向调用该函数的对象**, 我在网上学到的结论

用过 react 的朋友也知道, 在react 继承组件中, 为一个 元素绑定事件时是这样的:

```javascript
class example extends person {
  constructor(props) {
    this.state = {
      words: 'I\'m super man!'
    }
    console.log(props)
  }

  render () {
    return (
      <button onClick={handleClick}></button>
    )
  }

  handleClick () {
    console.log(this.state.words) // error
  }
}
```

同样的道理 这里仅仅是把 `this` 中的 函数当成变量 传给了 `onClick`, 然后通过js中的事件触发调用这个 函数, 因此调用这个函数的 `对象` 肯定不是 `class example`, 所以`this.state.words` 就会报错

## apply

> apply() 方法调用一个具有给定 `this值` 的函数, 以及作为一个数组(或类似数组对象)提供的参数

意思就是说, 这个方法第一个参数是一个 `对象`, 第二个参数为一个数组, 这个数组的所有元素就是将要传给 `被调用的那个函数`

`被调用的那个函数` 称作 `fn`

```javascript
fn.apply(obj, [...])
```

举个栗子:

```javascript
const person = {
  words: 'i\'m dz',
  say: function () {
    console.log(this.words)
  }
}
const person1 = {
  words: 'i\'m dz too',
  say: function () {
    console.log(this.words)
  }
}

const fn = person.say
fn.apply(person1) // 这个时候就是打印 i'm dz too 而不是 i'm dz
```

原因是 apply 将 调用 fn 的对象变为了 'person1`, 所以 this 的指向了 person1

再加入参数(**是一个数组**)

```javascript
const person1 = {
  words: 'i\'m dz too',
  say: function (params) {
    console.log(params[0]) // 1
    console.log(params[1]) // 2
    console.log(params[2]) // 3
  }
}

const fn = person.say
fn.apply(person1, 1, 2, 3) // 这个时候就是打印 i'm dz too 而不是 i'm dz
```

注意的是传入的是一个**数组**

### apply 代码实现

```javascript
Function.prototype.myApply = function () {
  let context = arguments[0] || window // 如果没有 传入第一个参数 就是window 对象
  let args = arguments[1] // 获取 传入的数组参数
  context.fn = this // 在对象 context中加入这个方法, 那么fn这个函数就可以使用 context 对象中的变量了(this.)
  const ret = context.fn(...args) // 执行fn 并传入参数
  delete context.fn
  return ret // 返回 fn 执行结果
}

const person = {
  words: 'i\'m dz',
  say: function (params1, params2) {
    console.log(params1) // 1
    console.log(params2) // 2
    console.log(this.words) // i'm dz too
  }
}
const person1 = {
  words: 'i\'m dz too'
}

const fn = person.say
fn() // --> undefined
fn.myApply(person1, [1, 2]) // 这个时候就是打印 i'm dz too 而不是 i'm dz
```

## call

> `call` 方法使用一个指定的 `this` 值和 `单独给出的一个` 或 `多个参数` 来调用一个函数

和 `apply` 一模一样的功能, 只是在 `第二个参数` 上不一样, `apply` 是接受一个数组, 而 `call` 是传入单个或多个


```javascript
const person = {
  words: 'i\'m dz',
  say: function (params1, params2, params3) {
    console.log(params1) // 1
    console.log(params2) // 2
    console.log(params3) // 3
  }
}

const person1 = {
  words: 'i\'m dz too'
}

const fn = person.say
fn.call(person1, 1, 2, 3) // 这个时候就是打印 i'm dz too 而不是 i'm dz
```

### 代码实现

```javascript
Function.prototype.myCall = function () {
  if (typeof this !== 'function') {
    throw new Error('is not a function')
  }
  const context = arguments[0] || window
  const args = [...arguments].slice(1) // 这里就需要利用 ... 扩展运算符, 把 多个参数合拢成一个数组
  context.fn = this
  const ret = context.fn(...args) // 然后再打开数组
  delete context.fn
  return ret
}

const person = {
  words: 'i\'m dz',
  say: function (params1, params2, params3) {
    console.log(params1) // 1
    console.log(params2) // 2
    console.log(params3) // 3
  }
}
const person1 = {
  words: 'i\'m dz too'
}
const fn = person.say
fn.myCall(person1, 1, 2, 3)
```

## bind

> `bind` 方法创建一个`新的函数`, 在 bind() 被调用时, 这个新函数的 `this` 被指定为 bind() 的第一个参数, 而其余参数将作为新函数的参数, 供调用时使用

意思就是说 有一个被调用的函数 `fn` 执行 `fn.bind(context, params1, params2...)` 后返回一个新的函数, 该函数内部的 this 的指向固定的 `context`, 然后 bind 第二个参数开始 就和 call 一样传入一个或者多个参数

**context:** 调用绑定函数时作为 this 参数传递给目标函数的值.  如果使用 `new运算符` 构造绑定函数, 则忽略该值. 当使用 bind 在 setTimeout 中创建一个函数(作为回调提供)时, 作为 context 传递的任何原始值都将转换为 `object`. 如果 bind 函数的参数列表为空, 执行作用域的 this 将被视为新函数的 context.

先来看看用法:

```javascript
const person = {
  words: 'i\'m dz',
  say: function (params1, params2, params3) {
    console.log(params1) // 1
    console.log(params2) // 2
    console.log(params3) // 3
  }
}
const person1 = {
  words: 'i\'m dz too'
}
const fn = person.say.bind(person1, 1, 2, 3) // 这里返回一个新的绑定函数给fn
fn()
```

### 偏函数

[偏函数](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Function/bind): `bind()` 的另一个最简单的用法是使一个函数拥有预设的初始参数. 只要将这些参数(如果有的话)作为 bind() 的参数写在 this 后面. 当绑定函数被调用时, 这些参数会被插入到目标函数的`参数列表的开始位置`, `传递给绑定函数的参数`会跟在它们后面. 

举个栗子来说明: 

```javascript
const person = {
  words: 'i\'m dz',
  say: function (params1, params2, params3) {
    console.log(params1) // 1
    console.log(params2) // 2
    console.log(params3) // 3
  }
}
const person1 = {
  words: 'i\'m dz too'
}
const fn = person.say.bind(person1, 1, 2, 3) // 这里返回一个新的绑定函数给fn
fn()
```

上面代码没有改变什么, 还是原来的样子打印 `1, 2, 3`, 这个时候传入的参数就是 函数 预设的初始参数, 再来看看绑定函数的参数:

```javascript
const person = {
  words: 'i\'m dz',
  say: function (params1, params2, params3, params4, params5, params6) {
    console.log(params1) // 1
    console.log(params2) // 2
    console.log(params3) // 3
    console.log(params4) // 4
    console.log(params5) // 5
    console.log(params6) // 6
    console.log(this.words) // i'm dz too
  }
}

const person1 = {
  words: 'i\'m dz too'
}
const fn = person.say.bind(person1, 1, 2, 3) // 这里返回一个新的绑定函数给fn
fn(4, 5, 6)
```

最后语句传入的参数就是 `绑定函数的参数`, 紧跟在 `预设初始参数` 后面

### 代码实现

```javascript
Function.prototype.myBind = function (that) {
  const args = [...arguments].slice(1) // 预设参数
  const _this = this
  return function (...params) { // 返回一个新的绑定函数
    const ret = _this.myCall(that, ...args, ...params) // 利用call 改变 this 指向
    return ret
  }
}

const person = {
  words: 'i\'m dz',
  say: function (params1, params2, params3, params4, params5, params6) {
    console.log(params1) // 1
    console.log(params2) // 2
    console.log(params3) // 3
    console.log(params4) // 4
    console.log(params5) // 5
    console.log(params6) // 6
    console.log(this.words) // i'm dz too
  }
}

const person1 = {
  words: 'i\'m dz too'
}
const fn = person.say.myBind(person1, 1, 2, 3) // 这里返回一个新的绑定函数给fn
fn(4, 5, 6)
```

之前所说的 react 事件绑定问题也可以用 `bind` 来解决

```javascript
class example extends person {
  constructor(props) {
    this.state = {
      words: 'I\'m super man!'
    }
    this.Click = this.handleClick.bind(this) // 绑定 this 返回 绑定函数
    console.log(props)
  }

  render () {
    return (
      <button onClick={this.Click}></button>
    )
  }

  handleClick () {
    console.log(this.state.words) // I'm super man!
  }
}
```

## 嘿嘿嘿

原生的 `apply`, `call`, `bind`的实现某些具体功能, 文章所写并不能达到, 只是为了更好的理解这3个函数的使用原理