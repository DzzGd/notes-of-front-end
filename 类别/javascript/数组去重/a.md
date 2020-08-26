![js](http://static.bigbigbigdz.xyz:8111/static/img/arti/1dr5vp03o418273/1575380553117240021.jpeg)

数组去重方法老生常谈, 方法也是非常之多, 但各自存在一些性能或者效率上的问题

### 双层循环

利用双层循环依次`挨个`比较

举个栗子:

```javascript
const arr = [1, 2, 3, 4, '1', 2, 3]
function unique(arr) {
  const tempArr = []
  for (var i = 0, len = arr.length; i < len; i++) {
    for (var j = 0, tempLeh = tempArr.length; j < tempLeh; j +
      if (arr[i] === tempArr[j]) {
        break
      }
    }
    if (j === tempArr.length) { // 如果都遍历完了没有相同的就会 j 为数组长度
      tempArr.push(arr[i])
    }
  }
  return tempArr
}
console.log(unique(arr))
```

在这个方法中, 我们使用循环嵌套, 最外层循环 `array`, 里面循环 `res`, 如果 `array[i]` 的值跟 `res[j]` 的值相等, 就跳出循环, 如果都`不等于`, 说明元素是`唯一`的, 这时候 `j` 的值就会等于 `res` 的长度, 根据这个特点进行判断, 将值添加进 `res`

看起来很简单吧, 之所以要讲一讲这个方法, 是因为——————兼容性好!

### indexOf

我们可以用 indexOf 简化内层的循环

举个栗子:

```javascript
const arr = [1, 2, 3, 4, '1', 2, 3]
function unique(arr) {
  const tempArr = []
  for (var i = 0, len = arr.length; i < len; i++) {
    let ret = arr[i]
    if (tempArr.indexOf(ret) === -1) { // 如果为-1表示没有重复
      tempArr.push(ret)
    }
  }
  return tempArr
}
console.log(unique(arr))
```
### 排序后去重

试想我们先将要去重的数组使用 `sort` 方法排序后, 相同的值就会被排在一起, 然后我们就可以只判断`当前元素`与`上一个元素`是否相同, 相同就说明重复, 不相同就添加进 `res`

举个栗子:

```javascript
const arr = [1, 2, 5, 6, 2, 8, 3, 10, 5, 6, 2, 5]
function unique(arr) {
  const res = []
  const tempArr = arr.concat().sort(function (a, b) {
    return a - b
  })
  let seen = null
  for (var i = 0, len = arr.length; i < len; i++) {
    if (!i || seen !== tempArr[i]) {
      res.push(tempArr[i])
    }
    seen = tempArr[i]
  }
  return res
}
console.log(unique(arr))
```

### unique API

知道了这两种方法后, 我们可以去尝试写一个名为 unique 的`工具函数`, 我们根据一个参数 `isSorted` 判断传入的数组是否是已排序的, 如果为 true, 我们就判断`相邻元素`是否相同, 如果为 false, 我们就使用 indexOf 进行判断

```javascript
var array1 = [1, 2, '1', 2, 1];
var array2 = [1, 1, '1', 2, 2];
function unique(arr, isSorted) {
  let res = [],
      seen = []
  for (let i = 0, len = arr.length; i < len; i++) {
    let value = arr[i]
    if (isSorted) {
      if (!i || seen !== value) {
        res.push(value)
      }
      seen = value
    } else {
      if (res.indexOf(value) === -1) {
        res.push(value)
      }
    }
  }
  return res
}
console.log(unique(array1))
console.log(unique(array2, true))
```

### 优化

尽管 `unqique` 已经可以试下去重功能, 但是为了让这个 API 更加强大, 我们来考虑一个需求: 

新需求: 字母的大小写视为一致, 比如`a`和`A`, `保留一个`就可以了！

虽然我们可以先处理数组中的所有数据, 比如将所有的字母转成小写, 然后再传入unique函数, 但是有没有方法可以省掉处理数组的这一遍循环, 直接就在去重的循环中做呢? 让我们去完成

栗子:

```javascript
var array3 = [1, 1, 'a', 'A', 2, 2];
function unique(arr, isSorted, iteratee) {
  let res = [],
    seen = []
  for (let i = 0, len = arr.length; i < len; i++) {
    let value = arr[i]
    let computed = iteratee ? iteratee(value, i, arr) : value
    if (isSorted) {
      if (!i || seen !== computed) {
        res.push(value)
      }
      seen = computed
    } else if (iteratee) {
      if (seen.indexOf(computed) === -1) {
        seen.push(computed)
        res.push(value)
      }
    } else if (res.indexOf(value) === -1) {
      res.push(value)
    }
  }
  return res
}
console.log(unique(array3, false, function (item) {
  return typeof item === 'string' ? item.toUpperCase() : item
}))
```

在这一版也是最后一版的实现中, 函数传递三个参数: 

array: 表示要去重的数组, 必填

isSorted: 表示函数传入的数组`是否已排过序`, 如果为 true, 将会采用更快的方法进行去重

iteratee: 传入一个`函数`, 可以对每个元素进行`重新的计算`, 然后根据处理的结果进行去重

### filter

`ES5`提供了 `filter` 方法, 可以简化外层循环

#### 修改indexOf

栗子:

```javascript
var array = [1, 1, 'a', 'A', 2, 2];
function unique(arr) {
  return arr.filter((v, index, arr) => {
    return arr.indexOf(v) === index
  })
}
console.log(unique(array))
```

#### 修改排序去重
```javascript
var array = [1, 1, 'a', 'A', 2, 2];
function unique(arr) {
  return arr.filter((v, index, arr) => {
    return !index || v !== arr[index - 1]
  })
}
console.log(unique(array))
```

### 利用Object键值对

这种方法是利用一个空的 Object 对象, 我们把数组的值存成 `Object` 的 key 值, 比如 `Object[value1] = true` , 在判断另一个值的时候, 如果 ` Object[value2]` 存在的话, 就说明该值是重复的

栗子:

```javascript
var array = [1, 2, 1, 1, '1'];
function unique(array) {
    var obj = {};
    return array.filter(function(item, index, array){
        return obj.hasOwnProperty(typeof item + item) ? false : (obj[typeof item + item] = true)
    })
}
console.log(unique(array)); // [1, 2, "1"]
```

我们可以发现, 是有问题的, 因为 `1` 和 `'1'` 是不同的, 但是这种方法会判断为`同一个值`, 这是因为对象的键值只能是字符串, 所以我们可以使用 `typeof item + item` 拼成字符串作为 `key` 值来避免这个问题

然而, 即便如此, 我们依然无法正确区分出两个对象, 比如 `{value: 1}` 和 `{value: 2}`, 因为 `typeof item + item` 的结果都会是 `object[object Object]`, 不过我们可以使用 `JSON.stringify` 将对象序列化

```javascript
var array = [{value: 1}, {value: 1}, {value: 2}];
function unique(arr) {
  let obj = {}
  return arr.filter((v, index, arr) => {
    let value = typeof v + JSON.stringify(v)
    return obj[value] ? false : (obj[value] = true)
  })
}
console.log(unique(array))
```

### ES6

随着 `ES6` 的到来, 去重的方法又有了进展, 比如我们可以使用 `Set` 和 `Map` 数据结构, 以 Set 为例, ES6 提供了新的数据结构 Set. 它类似于数组, 但是成员的值都是唯一的, 没有重复的值

```javascript
var array = [1, 2, 1, 1, '1']
function unique(array) {
  return Array.from(new Set(array))
}
console.log(unique(array))
```

再进一步简化

```javascript
var array = [1, 2, 1, 1, '1']
function unique(array) {
  return [...new Set(array)]
}
console.log(unique(array))
```