# javascript中各种位置坐标总结

js里面的鼠标坐标, 元素坐标以及长宽等等非常之多, 并且在命名上又特别相似, 导致使用起来容易混淆

因此在这里学习总结了一些变量名称的含义

## 长宽和位置距离

1. clientWidth和clientHeight

这两个表示一个元素的真实宽高就是说, 无论有没有`box-sizing`属性, 其值为渲染出来最终的宽高值

```js
// box-sizing:border-box
clientWidth = 元素.width

// box-sizing:content-box
clientWidth = 元素.width + 左右padding
```

2. offsetWidth和offsetHeight

这两个表示元素真实的宽高加上边框

```js
// box-sizing:border-box
clientWidth = 元素.width + 左右border

// box-sizing:content-box
clientWidth = 元素.width + 左右padding + 左右border
```

3. scrollWidth和scrollHeight

获取指定标签内容层的真实宽高(可视区域宽高+被隐藏区域宽高)

![1.png](http://static.bigbigbigdz.xyz:8111/static/img/arti/1dqk7n3cc511482/1574785086519956855.png)

如上图, 父元素的`scrollWidth`为 其 `左内边距`加上子元素的`offsetWidth`, 高度同理

4. clientLeft和clientTop

分别表示`上边框`和`左边框`的实际宽度

5. offsetLeft和offsetTop

offsetLeft: 当前元素`左边框外边缘`到`最近的已定位父级(offsetParent)`左边框`内边缘`的距离. 如果父级都没有定位，则是到`body左边`的距离

offsetTop: 当前元素`上边框外边缘`到`最近的已定位父级(offsetParent)`上边框`内边缘`的距离. 如果父级都没有定位，则是到`body顶部`的距离

6. scrollLeft和scrollTop

表示元素容器内`水平`或者`垂直`滚动的距离, 前提是`overflow: scroll`属性要有

## 鼠标

1. clientX和clientY

表示获取鼠标指针位置相对于`当前窗口`的`x`,`y`坐标，其中客户区域不包括窗口自身的控件和滚动条

也就是说, 当前窗口有滚动的时候, 是没有影响的任然是当前鼠标位置到窗口边框的距离

2. offsetX和offsetY

表示获取鼠标到`触发元素`的`左边框`或者`上边框`的距离, **不包括边框的厚度**

注意: 如果有边框, 触发点在边框上时有两种情况

+ 在左边框或者上边框时它们的值为负, 大小是到元素的内边的距离

+ 在右边框或者底部边框时它们的值为正, 大小是元素的宽高加上到元素内边的距离

3. pageX和pageY

表示鼠标到`文档`左边框和上边框的距离, 即时有滚动也没有影响

4. screenX和screenY

这两个表示鼠标与`电脑屏幕`的左边框和顶部边框的距离

附上网上的一张图

![2.jpg](http://static.bigbigbigdz.xyz:8111/static/img/arti/1dqk7n3cc511482/1574785086519641692.jpeg)