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
})