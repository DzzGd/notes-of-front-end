function extend() {
  let deep = false
  let length = arguments.length
  let target = arguments[0] || {}
  let copy_item, copy_value, copyIsArray, clone, src
  let i = 1
  if (typeof target === 'boolean') {
    deep = target
    target = arguments[1] || {}
    i++
  }

  if (typeof target !== 'object') {
    target = {}
  }
  for (; i < length; i++) {
    copy_item = arguments[i]
    if (copy_item != null) {
      for (let key in copy_item) {
        copy_value = copy_item[key]
        src = target[key]
        if (copy_value === target) continue
        if (deep && copy_value && (copyIsArray = Array.isArray(copy_value))) {
          if (copyIsArray) {
            copyIsArray = false
            clone = src && Array.isArray(src) ? src : []
          } else {
            clone = src && Array.isArray(src) ? src : {}
          }
          target[key] = extend(deep, clone, copy_value)
        } else if (copy_value !== undefined) {
          target[key] = copy_value
        }
      }
    }
  }

  return target
}

const a = {
  name: 'dz',
  age: 23,
  do: {
    morning: 'game',
    noon: 'play'
  }
}

const b = {
  name: 'dz1',
  age: undefined,
  height: 183,
  do: [1, 2]
}

// const ret = extend(true, a, b)
// console.log(ret)

// console.log($.extend(true, a, b))

var c = { name: d }
var d = { name: c }
console.log(extend(true, c, d))
addEventListenerconsole.log(log)


asdasd.console.log('dzz')