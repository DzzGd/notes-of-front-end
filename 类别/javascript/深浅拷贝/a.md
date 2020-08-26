## javascript深浅拷贝

![js](http://static.bigbigbigdz.xyz:8111/static/img/arti/1dr5vp03o418273/1575380553117240021.jpeg)

javascript中的深浅拷贝是老生常谈的问题. 对于引用类型的数据在拷贝时要做更多事情

### 引用类型

如果是数组, 可以利用数组的一些方法比如: slice, concat返回一个 `新数组` 的特性来实现拷贝

举个栗子:

```javascript
function copy(oldArr, newArr) {
  return oldArr.concat(newArr)
}
let oldarr = [1, 2, 3]
let newarr = [4, 5, 6]
let ret = copy(oldarr, newarr)
console.log(ret) // [1, 2, 3, 4, 5, 6]
oldarr[0] = 'old'
console.log(ret) // [1, 2, 3, 4, 5, 6]
```

用`slice`这样做:

```javascript
const arr = [1, 2, 3, 4, 5, 6]
const ret = arr.slice() // [1, 2, 3, 4, 5, 6]
arr[0] = 'dz'
console.log(ret) // [1, 2, 3, 4, 5, 6]
```

**如果数组嵌套了的话**

```javascript

const arr = [{ name: 'dz' }, ['old']]
const new_arr = arr.concat(arr)
arr[0].name = 'dz1'
arr[1][0] = 'new'

console.log(arr) // [{ name: 'dz1', ['old'] }]
console.log(new_arr) // [{ name: 'dz1', ['old'] }]
```

我们会发现, 无论是新数组还是旧数组都发生了变化, 也就是说 `concat` 方法, 克隆的并`不彻底`.

如果数组是基本类型, 就会拷贝一份, 互不影响, 而如果是对象或数组, 就会拷贝对象和数组的`引用`

我们把这种复制引用的拷贝方法称之为`浅拷贝`, 与之对应的就是深拷贝, 深拷贝就是指`完全的拷贝一个对象`, 即使嵌套了对象, 两者也相互分离, 修改一个对象的属性, 也`不会影响`另一个。

所以我们可以看出使用 `concat` 和 `slice` 是一种浅拷贝

## 浅拷贝

### 技巧型

除了concat 和 slice 简单技巧, 还有一个, 不仅适用于数组还适用于对象, 使用`JSON.parse` 和 `JSON.stringidy`

栗子:

```javascript
const arr = ['old', 1, true, ['old1', 'old2'], { old: 1 }]
const arr_new = JSON.parse(JSON.stringify(arr))
console.log(arr_new) // ['old', 1, true, ['old1', 'old2'], { old: 1 }]
arr[3][0] = 'new1'
console.log(arr_new) // ['old', 1, true, ['old1', 'old2'], { old: 1 }]
```

这是一个简单粗暴的方法, 但是有一个问题就是**不能拷贝函数**

栗子:

```javascript
const arr = [function foo() {console.log('dz')}]
console.log(JSON.parse(JSON.stringify(arr))) // [null]
// 这里的函数变为了null
```

以上三个方法 concat、slice、JSON.stringify 都算是技巧类, 可以根据实际项目情况选择使用, 接下来我们思考下如何实现一个对象或者数组的浅拷贝.


### 浅拷贝实现

```javascript
function shallowCopy(obj) {
  if (typeof obj !== 'object') console.error('the argument of first 
is not a obj')
  let newObj = obj instanceof Array ? [] : {} // 判断时数组还是对象
  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      newObj[key] = obj[key]
    }
  }
}
```

## 深拷贝

### 实现

```javascript
function deepCopy(obj) {
  if (typeof obj !== 'object') console.error('the argument of first is not a obj')
  let new_obj = obj instanceof Array ? [] : {}

  for (let key in obj) {
    if (obj.hasOwnProperty(key)) {
      const val = obj[key]
      new_obj[key] = typeof val === 'object' ? deepCopy(val) : val
    }
  }
  return new_obj
}

var a = { list: [1, 2, 3], info: { name:'dz'}}

var b = deepCopy(a)
```

深拷贝存在着一定的`性能消耗`, 应该根据实际情况使用 `深拷贝` 还是 `浅拷贝`