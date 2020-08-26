const GlobalArr = () => {
  return [1, 3, 5, 2, 7, 9, 2, 5, -5, 10, 99, 28, 17, 43, 28]
}
// /**
//  * 选择排序
//  * @param {Array} arr 
//  */
// function SelectSort(arr) {
//   const length = arr.length

//   for (let i = 0; i < length; i++) {
//     let minIndex = i
//     for (let j = i + 1; j < length; j++) {
//       if (arr[minIndex] > arr[j]) {
//         minIndex = j
//       }
//       let tempArr = arr[minIndex]
//       arr[minIndex] = arr[i]
//       arr[i] = tempArr
//     }
//   }
//   return arr
// }

// const ret = SelectSort(GlobalArr())
// console.log(ret.toString());

// /**
//  * 插入排序
//  * @param {Array} arr 
//  */
// function InsertSort(arr) {
//   let length = arr.length
//   let val = null
//   for (let i = 1; i < length; i++) {
//     let currentIndex = i - 1 // 排序序列的最后一个元素, 目的是依次从后往前比较
//     val = arr[i] // 未排序的第一个元素值
//     while (arr[currentIndex] > val && currentIndex >= 0) { // 已排序序列有大于比较元素的依次往后挪
//       arr[currentIndex + 1] = arr[currentIndex]
//       currentIndex--
//     }
//     arr[currentIndex + 1] = val // 不能往后挪了就将元素插在这里 // 这里 索引是currentIndex + N 的原因是 while最后一次循环结束后会执行 currentIndex -= N
//   }
//   return arr
// }

// const ret1 = InsertSort(GlobalArr())
// console.log(ret.toString());


// /**
//  * 希尔排序
//  * @param {Array} arr
//  */
// function ShellSort(arr) {
//   const length = arr.length
//   let N = length / 2
//   let val = null
//   for (N; N >= 1; N = Math.floor(N / 2)) {
//     for (let i = N; i < length; i++) {
//       let currentIndex = i - N
//       val = arr[i]
//       while (arr[currentIndex] > val && currentIndex >= 0) {
//         arr[currentIndex + N] = arr[currentIndex]
//         currentIndex -= N
//       }
//       arr[currentIndex + N] = val
//     }
//   }
//   return arr
// }

// const ret2 = ShellSort(GlobalArr())
// console.log(ret2.toString());

// function MergeSort(arr) {
//   let length = arr.length
//   if (length < 2) {
//     return arr
//   }
//   let middle = Math.floor(length / 2)
//   let left = arr.slice(0, middle)
//   let right = arr.slice(middle)
//   return merge(MergeSort(left), MergeSort(right))
// }

// function merge(left, right) { // 合并
//   let result = []
//   while (left.length && right.length) {
//     if (left[0] <= right[0]) {
//       result.push(left.shift())
//     } else {
//       result.push(right.shift())
//     }
//   }
//   while (left.length) {
//     result.push(left.shift())
//   }
//   while (right.length) {
//     result.push(right.shift())
//   }

//   return result
// }

// const ret3 = MergeSort(GlobalArr())
// console.log(ret3.toString());


// /**
//  * 
//  * @param {Array} arr 
//  */
// function QuickSort(arr, left, right) {
//   let len = arr.length,
//     partitionIndex
//   left = typeof left != 'number' ? 0 : left,
//     right = typeof right != 'number' ? len - 1 : right;
//   if (left < right) {
//     partitionIndex = partition(left, right, arr)
//     QuickSort(arr, left, partitionIndex - 1)
//     QuickSort(arr, partitionIndex + 1, right)
//   }
//   return arr
// }
// function partition(left, right, arr) {
//   pivot = arr[left]
//   while (left < right) {
//     while (left < right && arr[right] > pivot) right--
//     if (arr[right] <= pivot) {
//       var temp = arr[right]
//       arr[right] = arr[left]
//       arr[left] = temp
//     }
//     while (left < right && arr[left] <= pivot) left++
//     if (arr[left] >= pivot) {
//       var temp = arr[left]
//       arr[left] = arr[right]
//       arr[right] = temp
//     }

//   }
//   return left
// }

// const ret4 = QuickSort(GlobalArr())
// console.log(ret4.toString())

// function QuickSort1(arr) {
//   let len = arr.length
//   if (len < 2) return arr
//   let middle = Math.floor(len / 2)
//   let pivot = arr.splice(middle, 1)
//   let left = []
//   let right = []
//   for (let i = 0; i < len - 1; i++) {
//     if (arr[i] >= pivot) {
//       right.push(arr[i])
//     } else {
//       left.push(arr[i])
//     }
//   }
//   return QuickSort1(left).concat(pivot, QuickSort1(right))
// }

// const ret5 = QuickSort1(GlobalArr())
// console.log(ret5.toString())


function CountSort(arr) {
  let tempArr = []
  for (let i = 0, len = arr.length; i < len; i++) {
    let val = tempArr[arr[i]]
    tempArr[arr[i]] = val ? val + 1 : 1
  }
  console.log(tempArr)

  let tempArr1 = []
  for (let i = 0, len = tempArr.length; i < len; i++) {
    if (!tempArr[i]) continue
    for (let j = 0; j < tempArr[i]; j++) {
      tempArr1.push(i)
    }
  }
  console.log(tempArr1)
}

CountSort([1, 2, 5, 3, 5, 7, 8, 4, 5, 7, 8, 4, 5, 5, 2, 5, 7, 8, 4, 5])