## 什么是Promise?

> Promise是ES6提供的一种异步解决方案, 它允许将写法复杂的传统回调函数和监听事件的异步操作, 用同步代码的形式将结果传达出来. 从本意讲, promise表示承诺, 就是承诺一定时间处理异步(也可同步)之后会给你一个结果, 并且这个结果会根据情况有着不同的状态.


## 传统回调的弊端

例子:
```javascript
function fn1(value, callback) {
  setTimeout(() => {
    let a = 1
    for(let i = 1; i <= value; i++) {
      a *= i
      callback(a)
    }
  }, )
}

fn1(10000000, function(result) => {
  console.log(result)
})
```

上面代码是先进行阶乘运算, 计算完后执行`callback`回调. 假如为了得到`10000000`的的阶乘, 因为运算量大, 不让他阻塞js, 使其在异步中执行, 因此需要同回调来得到结果.

但是此时又需要将这个结果在`fn2`函数中做一些减法处理:

```javascript
function fn2(value, callback) {
  setTimeout(() => {
    const b = value - 1 - 2 - 3 - 4 - 1000
    callback(b)
  }, 100)
}

fn1(10000000, function(result1) => {
  fn2(result1, function(result2) => {
    console.log(result)
  })
})
```

然后需要在`fn3`函数中做一些乘法处理, 在`fn4`函数中做一些加法处理...`fn5 fn6 fn7...fn100`........

```javascript
function fn3(value, callback) {
  // value = x*x*123...
  callback(value)
}

function fn4(value, callback) {
  // value = x+x+123...
  callback(value)
}

fn1(10000000, function(result1) => {
  fn2(result1, function(result2) => {
    fn3(result2, function(result3) => {
      fn4(result3, function(result4) => {
        ...
        fn100(result99, function(result100) => {
          console.log(result)
        })
      })
    })
  })
})
```

通过一百次回调得到最终结果...就成了**回调地狱**, 真实情况虽然没有这么多层级, 但是每一个`处理函数`的内容也不可能这么简单, 到时候肯定很臃肿不美观, 说不定其中的某个回调的结果在哪里都找不到(result1, result2, result3...)...

## Promise的出现

Promise表示承诺, 它也会像回调函数一样, 承诺一个结果, 但是这个结果会根据promise的状态通过不同的方式(`成功或者失败`)传递出来.

回调的弊端:

+ 层层嵌套, 代码书写逻辑与传统顺序有差异, 不利于阅读与维护
+ 其中异步操作顺序变更时, 可能需要大量重新变动

Promise能解决两个问题:

+ 回调地狱, 它能通过函数链式调用方式来执行异步然后处理结果, 使得代码逻辑书写起来像同步

+ 支持并发, 比如说获取多个并发请求的结果

## Promise的状态

![promise状态图解](https://user-gold-cdn.xitu.io/2020/4/5/17146159c35178db?w=512&h=280&f=png&s=5974)


Promise是一个构造函数, 通过`new Promise`的方式得到一个实例对象, 创建时接受一个`执行函数`(下面简称 **fn** )作为参数, 这个执行函数也同时也有两个形参`resolve`, `reject`

```javascript
const promise = new Promise((resolve, reject) => {
  // ...do something asynchronous
  // resolve sth or reject sth
})
```

promise本身有三种状态:

+ pending -> 等待
+ fulfilled -> 执行态
+ rejected -> 拒绝态

Promise是一个构造函数, 他需要通过 `new` 实例化来使用, 实例化的同时 Promise内部的状态为初始的 **pending**

`fn` 表示传入一个回调函数, 它会被Promise内部传入两个参数 `resolve`, `reject`

**当fn内部的代码执行resolve 或者 reject时, 它的内部的状态都会变化**

与 resolve reject 对应的状态为

```
resolve -> fulfilled
reject  -> rejected
```

**一旦promise被resolve或者reject, 不能再迁移到其他任何状态**

基本过程:

1. 初始化Promise状态(pending)
2. 执行 then(..) 注册回调处理数组(then 方法可被同一个 promise 调用多次)
3. 立即执行 Promise 中传入的 fn 函数, 将Promise 内部 resolve、reject 函数作为参数传递给 fn , 按事件机制时机处理
4. Promise中要保证, then方法传入的参数 fulfilled 和 rejected, 必须在then方法被调用的那一轮事件循环之后的新执行栈中执行

上述可以先不用管, 先来看看用法

## Promise对象的方法

### 1. then方法注册`当resolve(成功)/reject(失败)时`的回调函数

```javascript
promise.then(fulfilled, rejected)
// fulfilled 是promise执行当resolve 成功时的回调
// rejected  是promise执行当reject 失败时的回调
```

### 2. resolve(成功)fulfilled会被调用

当 fn 内部执行 resolve 方法时(此时的Promise内部状态为 `resolved`), 可以传入一个参数 `value`, 便会执行 then 中的 fulfilled 回调, 并把 `value` 作为参数值传入, 

```javascript
const promise = new Promise((resolve, reject) => {
  let value = 1 + 1
  resolve(value)
}).then(function(res) {
  console.log(res) // --> 2 , 这里的 res 就是resolve传入的 value
})
```

### 3. reject(失败)rejected会被调用

同理 reject 也一样 不同之处在于, 需要在then中多传入一个执行回调:

```javascript
const promise = new Promise((resolve, reject) => {
  let value = 1 + 1
  reject(value)
})
.then(function(res) {
  console.log(res) // fulfilled 不会被调用
}, function(err) {
  console.log(err) // 2
})
```

上面代码中, `fn` 代码 执行了 `reject`, 此时的Promise内部状态为 `rejected`. 因此就会只执行then中的第二个执行回调(rejected), 同样 `reject` 接受一个 value 参数 传给 下一个then 中的 `rejected` 执行后续错误的回调

### 4. promise.catch捕获错误

**链式调用写法中可以捕获前面的 then 中 resolved 回调发生的异常**

```javascript
promise.catch(rejected)
// 相当于
promise.then(null, rejected)
// 注意: rejected 不能捕获当前 同一层级fulfilled 中的异常

promise.then(fulfilled, rejected) 
// 可以写成：
promise.then(fulfilled)
       .catch(rejected)   
```

当 fullfill中发生错误时:

```javascript
const promise = new Promise((res, rej) => {
  res(1)
})
.then(res => {
  let a = 1
  return res + a.b.c
})
.then(res => {
  return res + 1
}, err => {
  // 会捕获上一级的错误
  console.log(err) // Cannot read property 'c' of undefined
})

```

```javascript

const promise = new Promise((res, rej) => {
  res(1)
}).then(res => {
  let a = 1
  return res + a.b.c
}).then(res => {
  return res + 1
}).then(res=> {
  console.log(res)
}).catch(err => {
  // 上面任何一级发生错误 最终都会转入catch
  console.log(err) // TypeError: Cannot read property 'c' of undefined
})
 
```

上述故意让代码发生错误(`a.b.c`), 就会转到catch函数, 中间无论有多少个 then 都不会执行, 除非 then 中传入了失败的回调:

```javascript
const promise = new Promise((res, rej) => {
  res(1)
})
  .then(res => {
    let a = 1
    return res + a.b.c
  })
  .then(res => {
    return res + 1
  }, err => { // 这里会被先捕获
    console.log(err) // TypeError: Cannot read property 'c' of undefined
  })
  .then(res=> {
    console.log(res)
  }).catch(err => {
  // 已经被上面的 rejected 回调捕获 就不会执行 catch 了
  console.log(err) 
  })
```

### 5. promise链式写法

```
promise.then方法每次调用 都返回一个新的promise对象 所以可以链式写法
```

```javascript
function taskA() {
    console.log("Task A")
}
function taskB() {
    console.log("Task B")
}
function rejected(error) {
    console.log("Catch Error: A or B", error)
}
var promise = Promise.resolve()
promise
  .then(taskA)
  .then(taskB)
  .catch(rejected) // 捕获前面then方法中的异常
```

需要注意的是  当then执行 `rejected` 回调后 传入的 参数会被 下一级 的 `resolved` 执行回调接受 而不是 `rejected`:

```javascript
const promise = new Promise((res, rej) => {
  res(1)
})
  .then(res => {
    let a = 1
    return res + a.b.c
  })
  .then(res => {
    return res + 1
  }, err => {
    console.log(err) // 这里捕获到错误后, 返回的值 仍然是会被 下一级 then 中的 resolved 执行回调 接收
    return 'dz'
  })
  .then(res=> {
    console.log(res) // dz
  }, err => {
    console.log(err)
  })
```

## Promise的静态方法

### 1. Promise.resolve返回一个fullfill状态的promise对象

```javascript
Promise.resolve('dz').then(res => { console.log(res) })// --> dz
// 相当于
new Promise((resolve) => {resolve('dz')}).then(res => { console.log(res) }) // --> dz
```

### 2. Promise.reject 同理返回一个rejected状态的promise对象

### 3. Promise.all接受一个数组, 数组每个元素里面为promise对象, 返回一个由每一个promise对象执行后 reject 状态组成的数组
```
只有每个promise对象状态`都为resolve`才会调用, 通常用来处理多个并行异步操作

```

```javascript
const p1 = Promise.resolve('dz1')
const p2 = Promise.resolve('dz2')
const p3 = Promise.resolve('dz3')
Promise.all([p1, p2 , p3]).then(res => {
  console.log(res) // --> ['dz1', 'dz2', 'dz3'], 结果与数组中的promise返回的结果顺序一致
})
``` 

### 4. Promise.race 同样接受一个数组, 元素为promise对象

```
Promise.race只要其中某个元素先进入 fulfilled 或者 rejected 状态就会进行后面的处理(执行then)
```

```javascript
function timer(delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      resolve(delay)
    }, delay)
  })
}
Promise.race([
  timer(10),
  timer(20),
  timer(30),
]).then(res => { console.log(res) }) // -> 10
```

### 5. finally 无论 Promise 状态如何 都会执行

无论Promise返回的结果是什么都会执行 `finally` 并且 **不会改变 Promise 的状态**

```javascript
Promise.resolve(1).finally(()=>{})
Promise.reject(1) .finally(()=>{})
```
