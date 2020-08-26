> 排序有很多种, 各自在时间性能占用空间上都有所不同. 通过平时积累和在网上的学习总结了以下10个排序方法, 都通过JavaScript的方式实现代码

## 冒泡排序

冒泡排序(Bubble Sort), 有如其名就是通过两两元素比较大小, 将目标元素(大或者小的元素)`冒泡`到某一端最终实现排序

### 算法步骤

这里以从小到大顺序排列

1. 从第一个元素开始, 比较相邻元素. 如果第一个比第二个大, 就交换他们
2. 第二个元素再和第三个元素比较, 如果第二个比第三个大, 就交换他们, 以此类推, 这步做完后, 最后的元素会是最大的数
3. 再从第一个元素开始做重复的工作
4. 重复上面的步骤, 直到没有任何一对数字需要比较(任何两个数之间都会被比较到)

冒泡排序还有一种优化算法, 就是立一个 flag, 当在一趟序列遍历中元素没有发生交换, 则证明该序列已经有序.但这种改进对于提升性能来说并没有什么太大作用.

比如有 3, 2, 1 序列:

+ 从 3 开始, 3 和 2 比较, 3 比 2 大, 交换 此时为: 2, 3, 1
+ 然后比较 3 和 1 最终为: 2, 1, 3
+ 第一轮比较完然后第二轮, 从第一个元素开始
+ 2 比 1 大: 1, 2, 3
+ 2比3小 不变换
+ 结束



### 代码实现

```javascript
function BubbleSort(arr) {
  let length = arr.length
  let i = 0
  for (i; i < length; i++) {
    let j = 0
    for (j; j < (length - i - 1); j++) {
      if (arr[j] > arr[j + 1]) { // 两两元素比较
        let temp = arr[j + 1] // 元素交换
        arr[j + 1] = arr[j]
        arr[j] = temp
      }
    }
  }
  return arr
}
```

## 选择排序

选择排序是一种简单直观的排序算法, 无论什么数据进去都是 O(n²) 的时间复杂度. 所以用到它的时候, 数据规模越小越好. 唯一的好处可能就是`不占用额外的内存空间`了吧. 

### 算法步骤

1. 首先在未排序序列中找到最小(大)元素, 存放到排序序列的起始位置
2. 再从剩余未排序元素中继续寻找最小(大)元素, 然后放到已排序序列的末尾. 
3. 重复第二步, 直到所有元素均排序完毕. 

### 代码实现

```javascript
function SelectionSort(arr) {
  let length = arr.length
  let minIndex = 0
  for (let i = 0; i < length; i++) {
    minIndex = i
    for (let j = i + 1; j < length; j++) { // 比较出为排序中最小的值的索引
      if (arr[j] < arr[minIndex]) {
        minIndex = j
      }
    }
    let temp = arr[minIndex]
    arr[minIndex] = arr[i]
    arr[i] = temp
  }
  return arr
}
```

## 插入排序

+ 插入排序的代码实现虽然没有冒泡排序和选择排序那么简单粗暴, 但它的原理应该是最容易理解的了, 因为只要打过扑克牌的人都应该能够秒懂.
+ 插入排序是一种最简单直观的排序算法, 它的工作原理是通过构建有序序列, 对于未排序数据, 在已排序序列中从后向前扫描, 找到相应位置并插入.
+ 插入排序和冒泡排序一样, 也有一种优化算法, 叫做拆半插入.

**插值排序在小规模数据或者序列基本有序十分高效**

### 算法步骤

1. 从第一个元素开始, 将此元素当做有序序列(即使只有一个元素), 之后的元素当做未排序序列
2. 取出未排序序列的第一个元素(也就是数组第二个元素)与第一个元素比较, 如果第一个元素大于第二个元素(升序排列), 第一个元素就往后挪一个位置, 把第二个元素插到第一个元素
3. 这个时候排序序列就有了两个元素, 重复上面的步骤, 取出未排序序列的元素一次与排序元素比较, 如果已排序元素大, 那么就依次挪一个位置,直到插入位置

### 代码实现

```javascript
function InsertSort(arr) {
  let length = arr.length
  let val = null
  for (let i = 1; i < length; i++) {
    currentIndex = i - 1 // 排序序列的最后一个元素, 目的是依次从后往前比较
    val = arr[i] // 未排序的第一个元素值
    while (arr[currentIndex] > val && currentIndex > 0) { // 已排序序列有大于比较元素的依次往后挪
      arr[currentIndex + 1] = arr[currentIndex]
      currentIndex--
    }
    arr[currentIndex + 1] = val // 不能往后挪了就将元素插在这里. 这里索引是currentIndex + N 的原因是 while最后一次循环结束后会执行 currentIndex -= N
  }
  return arr
}
```

## 希尔排序

希尔排序, 也称递减增量排序算法, 是插入排序的一种更高效的改进版本. 基本有序或规模较小序列不常见, 希尔排序能使得对大规模并且无需的数据也非常有效率. 希尔排序是非稳定排序算法. 

### 算法步骤

1. 首先它把较大的数据集合分割成若干个小组(逻辑上分组)
2. 然后对每一个小组分别进行插入排序
3. 此时, 插入排序所作用的数据量比较小(每一个小组), 插入的效率比较高

类似于 有[4, 3, 6, 1, 2, 7, 5, 8]这样一个数组:

+ 取一个增量值k, 这里取 k = 4, 根据这个增量的距离将数组分为4个小组(不分割原数组)


![](https://user-gold-cdn.xitu.io/2020/3/24/1710d314e457caaf?w=197&h=172&f=png&s=3141)

+ 然后对每一个小组进行插值排序:

> [&nbsp;2, &nbsp;3, &nbsp;5, &nbsp;1, &nbsp;4, 7, 6, 8]

+ 再一次取增量,这一次需要比 k = 4更小, 即 k = 2, 再一次分组


![](https://user-gold-cdn.xitu.io/2020/3/24/1710d3187cf31a11?w=195&h=99&f=png&s=2433)

+ 然后对每一个小组进行插值排序:

> [2, 1, 4, 3, 5, 7, 6, 8]

+ 再取 k = 1这个时候 已经基本有序了, 直接使用插值排序进行排序得到最终结果

> [1, 2, 3, 4, 5, 6, 7, 8]

### 代码实现

```javascript
function ShellSort(arr) {
  const length = arr.length
  let N = length / 2
  let val = null
  for (N; N >= 1; N = Math.floor(N / 2)) {
    for (let i = N; i < length; i++) {
      let currentIndex = i - N
      val = arr[i]
      while(arr[currentIndex] > val && currentIndex >= 0) {
        arr[currentIndex + N] = arr[currentIndex]
        currentIndex -= N
      }

      arr[currentIndex + N] = val // 这里 索引是currentIndex + N 的原因是 while最后一次循环结束后会执行 currentIndex -= N
    }
  }
  return arr
}
```

## 归并排序

归并排序是利用`归并`的思想实现的排序方法, 该算法采用经典的分治策略
算法复杂度 `O(nlogn)`

作为一种典型的分而治思想的算法应用, 归并排序的是实现有两种方法:

+ 自上而下的递归
+ 自下而上的迭代

和选择排序一样, 归并排序的性能不受输入数据的影响, 但表现比选择排序好的多, 因为始终都是 O(nlogn) 的时间复杂度. 代价是需要额外的内存空间.
### 算法步骤

1. 申请空间, 使其大小为两个已经排序序列之和, 该空间用来存放合并后的序列
2. 设定两个指针, 最初位置分别为两个已经排序序列的起始位置
3. 比较两个指针所指向的元素, 选择相对小的元素放入到合并空间, 并移动指针到下一位置
4. 重复步骤 3 直到某一指针达到序列尾
5. 将另一序列剩下的所有元素直接复制到合并序列尾

![](https://user-gold-cdn.xitu.io/2020/4/2/171369d4cb3619df?w=639&h=398&f=gif&s=401036)

### 代码实现

```javascript
// 自上而下
function MergeSort(arr) {
  let length = arr.length
  if (length < 2) {
    return arr
  }
  let middle = Math.floor(length / 2)
  let left = arr.slice(0, middle)
  let right = arr.slice(middle)
  return merge(MergeSort(left), MergeSort(right))
}

function merge(left, right) { // 合并
  let result = []
  while (left.length && right.length) {
    if (left[0] <= right[0]) {
      result.push(left.shift())
    } else {
      result.push(right.shift())
    }
  }
  while (left.length) {
    result.push(left.shift())
  }
  while (right.length) {
    result.push(right.shift())
  }

  return result
}
```

## 快速排序

快速排序是从冒泡排序岩棉而来的算法, 但是比冒泡排序要搞笑得多, 所以叫快速排序

### 算法步骤

1. 从数列中挑出一个元素, 称为 `基准` (pivot)
2. 重新排序数列, 所有元素比基准值小的摆放在基准前面, 所有元素比基准值大的摆在基准的后面(相同的数可以到任一边). 在这个分区退出之后, 该基准就处于数列的中间位置. 这个称为分区(partition)操作
3. 递归地(recursive)把小于基准值元素的子数列和大于基准值元素的子数列排序

### 代码实现

```javascript
// 索引的方式
function QuickSort(arr, left, right) {
  let len = arr.length,
    partitionIndex
  left = typeof left != 'number' ? 0 : left,
    right = typeof right != 'number' ? len - 1 : right;
  if (left < right) {
    partitionIndex = partition(left, right, arr)
    QuickSort(arr, left, partitionIndex - 1)
    QuickSort(arr, partitionIndex + 1, right)
  }
  return arr
}
function partition(left, right, arr) {
    pivot = arr[left]
  while (left < right) {
    while (left < right && arr[right] > pivot) right--
    if (arr[right] <= pivot) {
      var temp = arr[right]
      arr[right] = arr[left]
      arr[left] = temp
    }
    while (left < right && arr[left] <= pivot) left++
    if (arr[left] >= pivot) {
      var temp = arr[left]
      arr[left] = arr[right]
      arr[right] = temp
    }

  }
  return left
}
```

```javascript
// 数组的方式
function QuickSort1(arr) {
  let len = arr.length
  if (len < 2) return arr
  let middle = Math.floor(len / 2)
  let pivot = arr.splice(middle, 1)
  let left = []
  let right = []
  for (let i = 0; i < len - 1; i++) {
    if (arr[i] >= pivot) {
      right.push(arr[i])
    } else {
      left.push(arr[i])
    }
  }
  return QuickSort1(left).concat(pivot, QuickSort1(right))
}
```


## 计数排序

计数排序的核心在于将输入的数据值转化为键存储在额外开辟的数组空间中. 作为一种线性时间复杂度的排序, 计数排序要求输入的数据必须是有确定范围的**整数**.

这就是计数排序的基本过程, 它适用于一定范围的整数排序。在取值范围不是很大的情况下, 它的性能在某些情况甚至快过那些O(nlogn)的排序, 例如快速排序, 归并排序.

### 算法步骤

1. 创建一个空数组, 虽然是空数组, 默认之后添加元素时的值为1
2. 遍历所有的`整数`元素, 使空数组下标为 该`整数` 位置的元素值加一
3. 最后遍历空数组, 从0开始打印数据, 每一个元素打印次数都为 元素的`值`

### 代码实现

```javascript
function CountSort(arr) {
  let tempArr = []
  for (let i = 0, len = arr.length; i < len; i++) { // 计数
    let val = tempArr[arr[i]]
    tempArr[arr[i]] = val ? val + 1 : 1
  }
  let tempArr1 = []
  for (let i = 0, len = tempArr.length; i < len; i++) { // 打印
    if (!tempArr[i]) continue
    for (let j = 0; j < tempArr[i]; j++) {
      tempArr1.push(i)
    }
  }
  return tempArr1
}
```