## 实现基础的雏形(成功状态resolve):

```javascript
function oPromise(fn) {
  var value = null,
    callbacks = []  //callbacks为数组, 因为可能同时有很多个回调
  this.then = function (fulfilled) {
    callbacks.push(fulfilled)
    return this //
  }
  function resolve(newValue) {
    value = newValue
    callbacks.forEach(function (callback) {
      callback(value)
    })
  }
  fn(resolve)
}

new oPromise((resolve) => { //省略了rejected, 方便以后阅读, 因为与resolve原理一样
  setTimeout(() => { //处理异步
    resolve('dz')
  }, 0)
}).then(res => {
  console.log(res)
})
```

大致逻辑:
1. new oPromise实例, 执行`fn()`, 传入的是内部`resolve`函数, 因为传入的回调有`setTimeout`定时器是一个异步, 所以`resolve`会被延迟执行
2. 然后就是执行`then`方法, 把`then`包含的回调注册(添加)到`callbacks`数组中, 因为返回了实例->`this`, 因此如果有序还有其他`then`会一次被注册到`callbacks`中
3. 然后执行被延时的`setTimeout`, 并执行了`resolve`, 循环执行数组, 然后把`value`赋值给回调

问题:
+ Promise/A+规范要求回调需要通过异步方式执行, 虽然已经设置了`setTimeout`, 但是如果没有设置的话, oPromise内部的回调执行任然是同步, 这样会导致`then`方法还没有执行就执行了`resolve`, 此时callbacks里还是空的..


意思就是说, 实例化的时候传入了执行函数, 这个函数内部并不是所有时候都是异步的, 也有时候是同步代码例如:

```javascript
new oPromise(resolve => {
  let a = 1 + 1
  resolve(a)
}).then(res => console.log) // 2
```

这个时候所有代码都是同步的因此会先执行回调, 然后再执行 then, 这样的话 callbacks 数组先被执行, 然后最后添加回调, 这样的意义何在呢...

因此, 将 resolve 延迟执行(也满足了 Promise/A+ 规范):

```javascript
// resolve 函数
function resolve(newValue) {
  value = newValue
  setTimeout(() => {
    callbacks.forEach(function (callback) {
      callback(value)
    })
  }, 0)
}
```

## 加上状态

```
Promises/A+规范规定, pending可以转化为fulfilled或rejected并且只能转化一次, 也就是说如果pending转化到fulfilled状态, 那么就不能再转化到rejected. 并且fulfilled和rejected状态只能由pending转化而来, 两者之间不能互相转换
```

加上状态后:

```javascript
function oPromise(fn) {
  let value = null,
      state = 'pending'
      callbacks = []  //callbacks为数组, 因为可能同时有很多个回调

  this.then = function (fulfilled) {
    if (state === 'pending') {
      callbacks.push(fulfilled)
    } else {
      fulfilled(value)
    }
    return this //返回实例
  }

  function resolve(newValue) {
    if (state !== 'pending') return
    setTimeout(() => {
      value = newValue
      state = 'fulfilled'
      callbacks.forEach(function (callback) {
        callback(value)
      })
    }, 0)
  }

  fn(resolve)
}

new oPromise((resolve) => { //省略了rejected, 方便以后阅读, 因为与resolve原理一样, 后续再加入
  setTimeout(() => { //处理异步
    resolve('dz')
  }, 0)
}).then(res => {
    console.log(res)
    return 'dz'
   })
```

resolve执行时将状态变为`fulfilled`, 如果回调是异步, 就会先执行 then, 此时的 state 为`pending`, 就将 then 注册的回调添加到callbacks中, 如果回调不是异步, 就会因为state为 `fulfilled` 而立即执行

在 `resolve` 方法中第一条语句是判断状态是否为 `pending`, 这条语句的原因是: 一旦状态被 resolve 或者 reject 改变后 就不能再改变了, 在后续 写到 加入 `reject` 后 再详细说明

## 链式调用

每一次调用 `fulfilled` 回调 我们都把返回值保存下来, 以让下一个then中的回调(也就是下一个 fulfilled)获得返回值, 简单改造一下

```javascript
function oPromise(fn) {
  let value = null,
      state = 'pending'
      callbacks = [] //callbacks为数组, 因为可能同时有很多个回调

  this.then = function (fulfilled) {
    if (state === 'pending') {
      callbacks.push(fulfilled)
    } else {
      fulfilled(value)
    }
    return this //返回实例
  }

  function resolve(newValue) {
    if (state !== 'pending') return
    setTimeout(() => {
      value = newValue // 这里放在setTimeout才比较正确 不然不能链式调用
      state = 'fulfilled'
      callbacks.forEach(function (callback) {
        value = callback(value) // 保存上一个value: 关键
      })
    }, 0)
  }
  fn(resolve)
}

new oPromise((resolve) => { //省略了rejected, 方便以后阅读, 因为与resolve原理一样
  setTimeout(() => { //处理异步
    resolve('dz')
  }, 0)
}).then(res => {
    console.log(res)
    return 'dz'
  }).then(res => {
    console.log(res)
  })
```


虽然上面看似没有问题, 但其实有很大的缺陷:

如果then的`执行回调`中的代码为异步, 此时不能保证异步执行后 返回的值能被下一个then执行回调所接收. 不对, 是肯定不能

因此, 解决异步并回调的根本方式就是回到最初的问题 --> **Promise**

如果then回调函数中的代码有异步代码, 就将异步代码放置在 `Promise`中, 然后将返回值传给下一个 `then`中的回调, 这样便形成 `层层链式`, 多安逸...

> 链式Promise是指在当前promise达到fulfilled状态后, 即开始进行下一个promise(后邻promise)

因此就需要在then方法里return一个`Promise`

```javascript
function oPromise(fn) {
  let value = null,
      state = 'pending',
      callbacks = []  //callbacks为数组, 因为可能同时有很多个回调

  this.then = function (fulfilled) {
    return new oPromise((resolve) => {
      handle({
        fulfilled: fulfilled || null,
        resolve // 将下一个promise的resolve和then的回调一起添加到callbacks中, 为了在本次执行resolve时, 将本次的返回值传递到下一个promise
      })
    })
  }

  function handle(callback) {
    if (state === 'pending') {
      callback.push(callback)
      return
    }

    if (!callback.fulfilled) { // then 没有回调函数
      callback.resolve(value) // 就直接将value值传给-> 下 -> 下 个promise(如果有的话)
      return
    }
    const ret = callback.fulfilled(value) // 接受上一个promise返回值
    callback.resolve(ret) // 传入下一个promise... 有点晕, 要仔细想想..
  }
  function resolve(newValue) { //如果then函数的回调为一个新的promise, 需要做一些特殊处理
    if (state !== 'pending') return
    if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
      const then = newValue.then // 获取 promise的then
      if (typeof then === 'function') {
        then.call(newValue, resolve) // 添加then方法的回调, 把本次then回调的执行结果传给下一个promise, 并执行
        return
      }
    }

    const fn = () => {
      value = newValue
      state = 'fulfilled'
      handleCb()
    }
    setTimeout(fn, 0)
  }

  function handleCb() {
    while (callbacks.length) {
      const cb = callbacks.shift()
      handle(cb)
    }
  }
  fn(resolve)
}
```

整个过程的关键在于`handle`函数的执行, 它分担了联系相邻两个promise的作用:

1. 根据state来处理是`添加`回调还是`执行`, 如果没有回调就跳过本次promise执行再下一个then(promise)
2. 如果是`pending`就是添加回调, 把下一个then产生promise中的`resolve`一起添加
3. 如果是`fulfilled`就是执行, 就会调用下一个promise的resolve, 并传入本次回调产生的结果值

## 失败处理 reject

```
在异步操作失败时, 标记其状态为rejected, 并执行注册的失败回调
```

```javascript
function oPromise(fn) {
  let value = null,
    state = 'pending',
    callbacks = []  //callbacks为数组, 因为可能同时有很多个回调
  this.then = function (fulfilled, rejected) {
    return new oPromise((resolve, reject) => {
      handle({
        fulfilled: fulfilled || null,
        rejected: rejected || null,
        resolve,
        reject // 和resolve一样, 将一下个promise的错误执行(reject)加入callbacks中
      })
    })
  }
  function handle(callback) {
    if (state === 'pending') {
      callbacks.push(callback)
      return
    }
    let cb = state === 'fulfilled' ? callback.fulfilled : callback.rejected
    let r = state === 'fulfilled' ? callback.resolve : callback.reject
    let ret = null
    if (cb === null) {
      cb(value)
      return
    }
    ret = cb(value)
    r(ret)
  }

  // 省略 resolve, 减少篇幅. function resolve(newValue) {...}

  function reject(reason) {
    if (state !== 'pending') return
    const fn = () => {
      if (state !== 'pending') return
      if (reason && (typeof reason === 'object' || typeof reason === 'function')) {
        const then = reason.then // 获取 promise的then
        if (typeof then === 'function') {
          then.call(reason, resolve) // 添加then方法的回调, 把本次then回调的执行结果传给下一个promise, 并执行
          return
        }
      }
      state = 'rejected'
      value = reason
      handleCb()
    }
    setTimeout(fn, 0)
  }
  function handleCb() { // 将公共部分处理提取出来
    while (callbacks.length) {
      const cb = callbacks.shift()
      handle(cb)
    }
  }

  fn(resolve, reject)
}
```

加入了失败状态的处理之后, 大致原理还是一样, 只是在执行callbacks里面的回调和执行下一个promise的处理(resolve或者reject)需要做一些判断

这里说一下 `resolve` 和 `reject` 方法中第一个判断语句的作用, 举个栗子, 假如没有判断:

```javascript
const promise = new oPromise((resolve, reject) => {
  setTimeout(() => {
    resolve(1)
  }, 100)
  setTimeout(() => {
    reject(2)
  }, 100)
})
```

上面代码执行后 `200ms` 后 promise 的状态为 `rejected` 而不是 `fulfilled`, 原则上 一旦改变就不能再改变了

## 异常处理 catch

如果在执行过程中发生代码错误, 那么就用`try catch`来捕获错误, 并把错误转成`失败状态`, 就是把promise的状态设为`rejected`状态, 执行后续错误的回调

改造`handle`方法

```javascript
function handle(callback) {
    if (this.state === 'pending') {
      callbacks.push(callback)
      return
    }
    const { fulfilled, rejected, resolve, reject } = callback
    const cb = this.state === 'fulfilled' ? fulfilled : rejected
    const next = this.state === 'fulfilled' ? resolve : reject
    if (!cb) { // 没有 回调 就直接进入下一个promise
      next(value)
      return
    }

    try {
      const ret = cb(value)
      // ①
      resolve(ret) // 这里始终是 resolve, 即时 state 是 rejected
    } catch (error) {
      callback.reject(error)
    }allback.reject(e) //错误 直接执行失败状态回调
  }
}
```

需要注意的就是, 上面 代码 注释 `①` 处 始终是 `resolve` 的原因是 和 写的这篇[Promise 上](https://juejin.im/post/5e8b1562e51d4546b50d3c50) 所说的 这一级 执行错误回调, 但是返回值仍然是下一级的 `resolved` 回调 接收并执行

异常处理可以直接使用 catch 来接受 

```javascript
this.catch = rejected => {
  this.then(null, rejected) // 在 链式调用末尾再添加一个只有 rejected 的 then
}
```

这样就实现了catch 功能, 如果前面then中都没有 `rejected` 回调(因为值都为 `null`) , 会直接将值传给最后catch(也就是最后的then)

## 静态方法 oPromise.resolve


`Promise.resolve` 的入参可能有以下几种情况:

+ 无参数 [直接返回一个resolved状态的 Promise 对象]
+ 普通数据对象 [直接返回一个resolved状态的 Promise 对象]
+ promise对象 [返回一个新的Promise对象并且这个对象的 resolve 方法 交给传入的promise对象来执行]

```javascript
// function oPromise(fn).then(...)
oPromise.resolve = function (value) {
  if (state !== 'pending') return
  if (value && (typeof value === 'object' && typeof value.then === 'function')) {
    const { then } = value
    return new oPromise(resolve => {
      then(resolve) // ②
    })
  } else if (value) {
    return new oPromise(resolve => resolve(value))
  } else {
    return new oPromise(resolve => resolve())
  }
}

oPromise.resolve(1).then(res => console.log(res)) // 1
```

上面代码中 `②` 处的意思就是, 当传入的参数(value) 是这样的:

```javascript

let value = new Promise(resolve => {
  resolve(1)
}).then(res => {
  return res + 1
})
Promise.resolve(value)
       .then(res => console.log(res)) // 2
```

虽然 `value` 已经是一个 promise 实例了, 貌似直接返回(如上面代码中的`①`), 然后再被后续的 then 注册是没有问题的. 但是 value 是一个`失败状态`的 promise 实例呢:

```javascript
let value = new Promise((resolve, reject) => {
  reject(1)
}).then(res => {
  return res + 1
}, err => {
  console.log(err)
  return err + 1
})
Promise.resolve(value).then(res => {
  console.log(res)
}, err => {
  console.log(err) // what?? 我是2???
})
```

如果像 `①` 处那样直接返回, 后续的 then 实例中的回调是会被执行 `rejected` 回调的, 这样就是说, 我 oPromise.resolve 居然返回的是一个失败状态的 promise ???  Oh, No

## 静态方法 oPromise.reject

`Promise.reject` 与 `Promise.resolve` 类似, 区别在于 Promise.reject 始终返回一个状态的rejected的Promise实例, 而 Promise.resolve 的参数如果是一个 Promise 实例的话, 返回的是参数对应的 Promise 实例, 所以状态不一定

```javascript
oPromise.reject = function (value) {
  return new Promise(function(resolve, reject) {
    reject(value)
  })
}
```
## 静态方法 oPromise.all

入参是一个 Promise 的实例数组, 然后注册一个 then 方法, 然后是数组中的 Promise 实例的状态都转为 fulfilled 之后则执行 then 方法. 这里主要就是一个计数逻辑, 每当一个 Promise 的状态变为 fulfilled 之后就保存该实例返回的数据, 然后将计数减一, 当`计数器`变为 `0` 时, 代表数组中所有 Promise 实例都执行完毕. 

```javascript
oPromise.all = function (arr) {
  let args = Array.prototype.slice.call(arr)
  return new Promise(function (resolve, reject) {
    if (args.length === 0) return resolve([])
    let remaining = args.length
    function res(i, val) {
      try {
        if (val && (typeof val === 'object' || typeof val === 'function')) {
          let then = val.then
          if (typeof then === 'function') {
            then.call(val, function (val) { // 这里如果传入参数是 promise的话需要将结果传入 args, 而不是 promise实例
              res(i, val) 
            }, reject)
            return
          }
        }
        args[i] = val
        if (--remaining === 0) {
          resolve(args)
        }
      } catch (ex) {
        reject(ex)
      }
    }
    for (let i = 0; i < args.length; i++) {
      res(i, args[i])
    }
  })
}
```

## 静态方法 oPromise.race

有了 `oPromise.all` 的理解, `oPromise.race` 理解起来就更容易了. 它的入参也是一个 Promise 实例数组, 然后其 then 注册的回调方法是数组中的某一个 Promise 的状态变为 fulfilled 的时候就执行. 因为 Promise 的状态**只能改变一次**, 那么我们只需要把 Promise.race 中产生的 Promise 对象的 resolve 方法, 注入到数组中的每一个 Promise 实例中的回调函数中即可.

```javascript
oPromise.race = function (args) {
  return new oPromise((resolve, reject) => {
    for (let i = 0, len = args.length; i < len; i++) {
      args[i].then(resolve, reject)
    }
  })
}
```

## finally

不管Promise最后的状态如何 都要执行一些最后的操作. 我们把这些操作放到 finally 中 也就是说 finally 注册的函数是与 Promise 的状态无关的 **不依赖 Promise 的执行结果**


```javascript
function oPromise(fn) {
  // ...
this.finally = function(done) {
  this.then(() => {
    done()
  }, () => {
    done()
  })
}
  // ...
}
```

之所以没有吧 done 直接传给 then 是因为 原版 `Promise` 的 `finally` 执行回调中并没有传入任何参数

偷偷地做了修改...

## 较完整代码

```javascript
function oPromise(fn) {
  this.state = 'pending'
  this.value = null
  let callbacks = []
  this.then = function (fulfilled, rejected) {
    return new oPromise((resolve, reject) => {
      handle({
        fulfilled: fulfilled,
        rejected: rejected,
        resolve,
        reject
      })
    })
  }
  this.catch = function (rejected) {
    this.then(null, rejected)
  }
  this.finally = function (done) {
    this.then(() => {
      done()
    })
  }
  const handle = (callback) => {
    if (this.state === 'pending') {
      callbacks.push(callback)
      return
    }
    const { fulfilled, rejected, resolve, reject } = callback
    const cb = this.state === 'fulfilled' ? fulfilled : rejected
    const next = this.state === 'fulfilled' ? resolve : reject
    if (!cb) {
      next(value)
      return
    }
    try {
      const ret = cb(value)
      resolve(ret)
    } catch (error) {
      callback.reject(error)
    }
  }
  const resolve = newValue => {
    if (state !== 'pending') return
    const fn = () => {
      if (this.state !== 'pending') return
      if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
        const then = newValue.then
        if (typeof then === 'function') {
          then.call(newValue, resolve)
          return
        }
      }
      this.state = 'fulfilled'
      value = newValue
      handleCb()
    }
    setTimeout(fn, 0)
  }
  const reject = newValue => {
    if (state !== 'pending') return
    const fn = () => {
      if (this.state !== 'pending') return
      if (newValue && (typeof newValue === 'object' || typeof newValue === 'function')) {
        const { then } = newValue
        if (typeof then === 'function') {
          then.call(newValue, reject)
          return
        }
      }
      value = newValue
      this.state = 'rejected'
      handleCb()
    }
    setTimeout(fn, 0)
  }
  const handleCb = _ => {
    while (callbacks.length) {
      const cb = callbacks.shift()
      handle(cb)
    }
  }
  fn(resolve, reject)
}
oPromise.resolve = function (value) {
  if (value && value instanceof oPromise) {
    return value
  } else if (value && (typeof value === 'object' && typeof value.then === 'function')) {
    const { then } = value
    return new oPromise(resolve => {
      then(resolve)
    })
  } else if (value) {
    return new oPromise(resolve => resolve(value))
  } else {
    return new oPromise(resolve => resolve())
  }
}
oPromise.race = function (args) {
  return new oPromise((resolve, reject) => {
    for (let i = 0, len = args.length; i < len; i++) {
      args[i].then(resolve, reject)
    }
  })
}
oPromise.all = function (arr) {
  let args = Array.prototype.slice.call(arr)
  return new Promise(function (resolve, reject) {
    if (args.length === 0) return resolve([])
    let remaining = args.length
    function res(i, val) {
      try {
        if (val && (typeof val === 'object' || typeof val === 'function')) {
          let then = val.then
          if (typeof then === 'function') {
            then.call(val, function (val) {
              res(i, val)
            }, reject)
            return
          }
        }
        args[i] = val
        if (--remaining === 0) {
          resolve(args)
        }
      } catch (ex) {
        reject(ex)
      }
    }
    for (let i = 0; i < args.length; i++) {
      res(i, args[i])
    }
  })
}
```

因为函数(function)中 `this` 指向问题, 我把所有的函数都换成了 `箭头函数`, 因为可以直接使用 `this` 嘿嘿嘿....

##  嘿嘿

原文出自 [这里](https://mp.weixin.qq.com/s/bRXWcp7l0M298efV7NtsNA), 大部分都是 **copy** 的, 嘿嘿. 但是加入了自己的理解, 嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿嘿...