# 实现new的过程


## new的用法
```js
function Foo(name, age) {
  this.name = name
  this.age  = age
}

const foo = new Foo('dz', 23)
```

## 模拟new的过程

```js
function Foo(name, age) {
  this.name = name
  this.age  = age
}

function _new() {
  const obj = {}
  const constructor = Array.shift.call(arguments) //获取构造函数
  obj.__proto__ = constructor.prototype
  const result = constructor.apply(arguments)
  return Object.prototype.toString.call(result) === '[object Object]' ? result : obj
}

const foo = _new(Foo, 'dz', 23)
```
