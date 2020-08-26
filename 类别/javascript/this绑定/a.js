// Function.prototype.myApply = function () {
//   let context = arguments[0] || window // 如果没有 传入第一个参数 就是window 对象
//   let args =  arguments[1]// 获取 传入的数组参数
//   context.fn = this // 在对象 context中加入这个方法, 那么fn这个函数就可以使用 context 对象中的变量了(this.)
//   console.log(args)
//   const ret = context.fn(args) // 执行fn 并传入参数
//   delete context.fn
//   return ret // 返回 fn 执行结果
// }

// var person = {
//   words: 'i\'m dz',
//   say: function (args) {
//     // console.log(args[0]) // 1
//     // console.log(args[1]) // 2
//     console.log(args)
//     console.log(this.words)
//   }
// }
// var person1 = {
//   words: 'i\'m dz too'
// }

// var fn = person.say
// fn() // undefined
// fn.myApply(person1, [1, 2]) // 这个时候就是打印 i'm dz too 而不是 i'm dz
// const person = {
//   words: 'i\'m dz',
//   say: function (params1, params2, params3) {
//     console.log(params1) // 1
//     console.log(params2) // 2
//     console.log(params3) // 3
//   }
// }
// const person1 = {
//   words: 'i\'m dz too',
//   say: function (params1, params2, params3) {
//     console.log(params1) // 1
//     console.log(params2) // 2
//     console.log(params3) // 3
//   }
// }

// const fn = person.say
// fn.call(person1, 1, 2, 3) // 这个时候就是打印 i'm dz too 而不是 i'm dz

Function.prototype.myCall = function () {
  if (typeof this !== 'function') {
    throw new Error('is not a function')
  }
  const context = arguments[0] || window
  const args = [...arguments].slice(1)
  context.fn = this
  const ret = context.fn(...args)
  delete context.fn
  return ret
}

// const person = {
//   words: 'i\'m dz',
//   say: function (params1, params2, params3) {
//     console.log(params1) // 1
//     console.log(params2) // 2
//     console.log(params3) // 3
//   }
// }
// const person1 = {
//   words: 'i\'m dz too'
// }

// const fn = person.say

// fn.myCall(person1, 1, 2, 3)

// const person = {
//   words: 'i\'m dz',
//   say: function (params1, params2, params3) {
//     console.log(params1) // 1
//     console.log(params2) // 2
//     console.log(params3) // 3
//     console.log(this.words)
//   }
// }
// const person1 = {
//   words: 'i\'m dz too'
// }
// const fn = person.say.bind(person1, 1, 2, 3)
// fn()


// const person = {
//   words: 'i\'m dz',
//   say: function (params1, params2, params3, params4, params5, params6) {
//     console.log(params1) // 1
//     console.log(params2) // 2
//     console.log(params3) // 3
//     console.log(params4) // 4
//     console.log(params5) // 5
//     console.log(params6) // 6
//     console.log(this.words) // i'm dz too
//   }
// }

// const person1 = {
//   words: 'i\'m dz too'
// }
// const fn = person.say.bind(person1, 1, 2, 3) // 这里返回一个新的绑定函数给fn
// fn(4, 5, 6)

Function.prototype.myBind = function (that) {
  const args = [...arguments].slice(1) // 预设参数
  const _this = this
  return function (...params) {
    const ret = _this.myCall(that, ...args, ...params)
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