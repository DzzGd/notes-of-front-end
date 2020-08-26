
## jQuery中extend方法原生JS实现

![1.jpg](http://static.bigbigbigdz.xyz:8111/static/img/arti/1dr5vp03o418273/1575380553117240021.jpeg)

```
功能: Merge the contents of two or more objects together into the first object.
```

翻译过来就是, 合并两个或者更多个对象内容到第一个对象中

### 基本用法

```
jQuery.extend(target [, object1] [, objectN])
```

+ `target`: 表示要拓展的目标, 目标对象
+ `object1`及其后面的参数都为对象, 将这个参数对象内容都复制到目标对象中, 复制对象

### 浅拷贝:

栗子:

```javascript
let obj1 = {
  name: 'dz',
  age: 23,
  info: { height: 183, weight: '56kg' }
}

let obj2 = {
  name: 'dz1',
  info: { height: 200, weight: '76kg' }
}

let obj3 = {
  like: 'u'
}

let ret = $.extend(obj1, obj2, obj3)
console.log(ret) 
/*
  {
    name: "dz1", 
    age: 23, 
    info: { height: 200, weight: "76kg" }, 
    like: "u"
  }
*/
```

当两个对象有`相同字段`, 后面会覆盖前者, 而不会进行`深层次`覆盖

#### 实现

```javascript
function extend() {
  let name, options, src, copy
  let length = arguments.length
  let target = arguments[0] // 获取目标对象
  for (let i = 1; i < length; i++) { // 遍历复制对象
    options = arguments[i]
    if (options != null) {
      for (name in options) { // 遍历复制对象属性
        copy = options[name]
        if (copy !== undefined) { // 如果复制对象里面有undefined就不赋值
          target[name] = copy
        }
      }
    }
  }
  return target
}

console.log(extend(obj1, obj2, obj3))
```

### 深拷贝

```
jQuery.extend( [deep], target, object1 [, objectN ] )
```

就是说, 当第一个参数`deep`为布尔值`true`时, 整个拷贝为`深拷贝`, 反之为`浅拷贝`

这个时候的`target`目标对象为第二个参数

举个栗子:

```javascript
let obj1 = {
  name: 'dz',
  age: 23,
  info: { height: 183, weight: '56kg', iq: 100 }
}

let obj2 = {
  name: 'dz1',
  info: { height: 200, weight: '76kg', cq: 250 }
}

let obj3 = {
  like: 'u'
}

let ret = $.extend(true, obj1, obj2, obj3)
console.log(ret)
/*
{
  age: 23
  info: {
    cq: 250
    height: 200
    iq: 100
    weight: "76kg"
  }
  like: "u"
  name: "dz1"
}
*/
```

因为是深拷贝, 所以对象里面对象的每个属性都会被遍历到, 再不会直接覆盖

#### 实现

```javascript
function extend() {
  let deep = false // 默认浅拷贝
  let name, options, src, copy
  let length = arguments.length

  let target = arguments[0] || {}
  let i = 1
  if (typeof target == 'boolean') { // 如果第一个参数为true, 就为深拷贝
    deep = true
    target = arguments[1] || {}
    i++
  }

  if (typeof target !== 'object') { // 如果为object
    target = {}
  }

  for (; i < length; i++) {
    options = arguments[i]
    if (options) {
      for (name in options) {
        src = target[name]
        copy = options[name]
        if(deep && copy && typeof copy == 'object') {
          target[name] = extend(deep, src, copy)
        } else if (copy !== undefined){
          target[name] = copy
        }
      }
    }
  }
  return target
}
```

深拷贝时, 遇到属性值又是一个`对象`就需要利用递归进行覆盖了

### target是函数

函数也是可以拓展的:

```javascript
function foo() {}
foo.target = { name: 'dz', age: 23 }
console.log(foo.target)
```

因此需要做一些修改

```javascript
if (typeof target !== 'object' && !isFunction(target)) {
  target = {}
}
```
`isFunction`是[这篇](http://dzzlcxx.top:8888/#/TechShare/Articles/5de66454702a00622eb4f659)文章里面判断是否是`函数`类型的方法

### 类型不一致

上面的实现有一个bug:

```javascript
var obj1 = {
  a: 1,
  b: {
    c: 2
  }
}

var obj2 = {
  b: {
    c: [5],
  }
}

var d = extend(true, obj1, obj2)
console.log(d);
```

预期是:

```javascript
{
  a: 1,
  b: {
    c: [5]
  }
}
```

结果却是:

```javascript
{
  a: 1,
  b: {
    c: {
      0: 5
    }
  }
}
```

bug的执行顺序是:

+ 当`for in`执行到`name` 为 `b` 时, 第一遍执行 `src`为{ c: 2 }, `copy` 为 { c: [5] }, 因为 copy为对象 所以再一次递归
+ 这一次递归`for in`遍历时, `src` 为 `2` , `copy` 为 [5], 因为条件判断时, copy仍然为`object`, 所以需要再来一次递归
+ 第三次执时, target为`2`是个常量, 所以会被赋值为`{}`, 执行到`for in`遍历时, `src` 为`undefined`, 此时的`name`为`0`, 加上`copy` 为 `5` 不再是对象, 所以`target[name] = copy` 结果为`target[0]` = 5

第三遍进行最终的赋值, 因为 src 是一个基本类型, 我们默认使用一个`空对象`作为目标值, `目标属性`和`待复制属性`的`类型不一样`所以最终的结果就变成了对象的属性！

为了解决这个问题, 我们需要对目标属性值和待复制对象的属性值进行判断:
判断目标属性值跟要复制的对象的属性值类型`是否一致`:

+ 如果`待复制`对象属性值类型为`数组`, `目标属性值`类型`不为数组`的话, 目标属性值就设为 `[]`
+ 如果待复制对象属性值类型为对象, 目标属性值类型不为对象的话，目标属性值就设为 `{}`

结合[这篇](http://dzzlcxx.top:8888/#/TechShare/Articles/5de664f4702a00622eb4f65c)文章里面的`isPlainObject`函数来判断是否是个对象(非null等)

修改代码: 

```javascript
let clone, copyIsArray
...

if(deep && copy && (isPlainObject(copy)) || (copyIsArray = Array.isArray(copy))) {
  if (copyIsArray) {
    copyIsArray = false
    clone = src && Array.isArray(src) ? src : []
  } else {
    clone = src && isPlainObject(src) ? src : {}
  }

  target[name] = extend(deep, clone, copy)
} else if (copy !== undefined) {
  target[name] = copy
}
```

### 循环引用

还存在一个问题就是`循环引用`

```javascript
var a = {name: b}
var b = {name: a}
var c = extend(a, b)
```

结果`c`是一个无线展开的对象, 因为`对象`被`相互`引用了

![2.png](http://static.bigbigbigdz.xyz:8111/static/img/arti/1dr5vp03o418273/1575380553117814976.png)

修改:

```javascript
...

src = target[name]
copy = options[name]

if(target === copy) {
  continue
}
```

### 完整代码

```javascript
var class2type = {};
var toString = class2type.toString;
var hasOwn = class2type.hasOwnProperty;

function isPlainObject(obj) {
    var proto, Ctor;
    if (!obj || toString.call(obj) !== "[object Object]") {
        return false;
    }
    proto = Object.getPrototypeOf(obj);
    if (!proto) {
        return true;
    }
    Ctor = hasOwn.call(proto, "constructor") && proto.constructor;
    return typeof Ctor === "function" && hasOwn.toString.call(Ctor) === hasOwn.toString.call(Object);
}
function extend() {
  let deep = false // 默认浅拷贝
  let name, options, src, copy, clone, copyIsArray
  let length = arguments.length
  let target = arguments[0] || {} // 如果没有就默认为对象
  let i = 1
  if (typeof target == 'boolean') { // 如果第一个参数为true, 就为深拷贝
    deep = true
    target = arguments[1] || {}
    i++
  }

  if (typeof target !== 'object') { // 如果不为object
    target = {}
  }

  for (; i < length; i++) { // 遍历复制对象
    options = arguments[i] // 获取复制对象
    if (options) {
      for (name in options) { // 遍历属性
        src = target[name] // 获取目标属性
        copy = options[name] // 获取复制对象属性
        if (target === copy) continue // 解决无限扩展问题
        if (deep && copy && (isPlainObject(copy) || (copyIsArray = Array.isArray(copy)))) { // 判断copy 的类型是 obj 还是 array
          if (copyIsArray) { // 如果是数组
            copyIsArray = false
            clone = src && Array.isArray(src) ? src : [] // 目标对象属性不是数组就设置为数组, 本来就是数组保持不变, 为了保持src 与 copy 类型一致性
          } else { // 如果是对象
            clone = src && isPlainObject(src) ? src :{} // 目标对象属性不是对象就设置为对象, 本来就是对象保持不变, 为了保持src 与 copy 类型一致性
          }

          target[name] = extend(deep, clone, copy) // 递归
        } else if (copy !== undefined) {
          target[name] = copy
        }
      }
    }
  }
  return target
}
```

如果明白了上面的代码, 下面的代码执行的结果也应该知道怎么来的了

```javascript
console.log(extend(true, [4 ,5 , 6, 7], [1, 2, 3])) // [1, 2, 3, 7]

var obj1 = {
  value: {
    3: 1
  }
}

var obj2 = {
  value: [5, 6, 7]
}

//1.
console.log(extend(true, obj1, obj2)) // {value: [5, 6, 7]}
//---------------------------------------------------------
//2.
console.log(extend(true, obj2, obj1)) // {value: {3: 1}}
```

**注意**, 上面代码的`1.`和`2.`两个`console`不能同时执行, 因为执行了`1.`, obj1已经被改变了