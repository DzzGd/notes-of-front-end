## 移动端300ms延迟

![1.png](http://static.bigbigbigdz.xyz:8111/static/img/arti/1drir8075843025/1575811907473493914.png)

通过简单封装`tap`事件来解决300ms延迟问题, 同时加强移动端事件的学习

### 原因:

+ 2007 年初. 苹果公司在发布首款 `iPhone` 前夕, 遇到一个问题:当时的网站都是为大屏幕设备所设计的. 于是苹果的工程师们做了一些约定, 应对 `iPhone` 这种小屏幕浏览桌面端站点的问题. 

+ 双击缩放(`double tap to zoom`), 这也是会有上述 300 毫秒延迟的主要原因. 双击缩放, 即用手指在屏幕上快速点击两次, iOS 自带的 Safari 浏览器会将网页缩放至原始比例
+ 假定这么一个场景. 用户在 iOS Safari 里边点击了一个链接. 由于用户可以进行双击缩放或者单击跳转的操作, 当用户一次点击屏幕之后, 浏览器并不能立刻判断用户是确实要打开这个链接, 还是想要进行双击操作. 因此, iOS Safari 就等待 300 毫秒, 以判断用户是否再次点击了屏幕
+ 鉴于iPhone的成功, 其他移动浏览器都复制了 iPhone Safari 浏览器的多数约定, 包括双击缩放, 几乎现在所有的移动端浏览器都有这个功能

### 问题

点击延迟有时候感觉'卡顿'不舒适

### 解决方案

#### 1.添加viewport meta标签

使用`meta`标签中的`viewport`来解决

```html
<meta name="viewport" content="initial-scale=1,minimum-scale=1,maximum-scale=1,user-scalable=no>
```

表明这个页面是不可缩放的, 那双击缩放的功能就没有意义了, 此时浏览器可以禁用默认的双击缩放行为并且去掉300ms的点击延迟

```html
<meta name="viewport" content="width=device-width">
```

这个方案相比方上面解决方案的好处在于, 它没有完全禁用缩放, 而只是禁用了浏览器默认的双击缩放行为, 但用户仍然可以通过`双指缩放`操作来缩放页面。

#### 2.使用优秀封装库 FastClick

地址:[FastClick](https://github.com/ftlabs/fastclick)

上面提到, 在移动端, 手指点击一个元素, 会经过: touchstart --> touchmove -> touchend -->click

`FastClick`的原理是:在检测到touchend事件的时候, 会通过DOM自定义事件立即出发模拟一个click事件, 并把浏览器在300ms之后真正的click事件阻止掉, 同样可以解决`点击穿透`

#### 3.简单封装tap事件

点击操作的特点:

1. 单击只有一根手指
2. 欧安段手指开始出没和手指松开的事件差异不能大于某个`值`
3. 保证没有滑动操作, 如果有抖动必须要保证抖动在某个指定范围内

```javascript
const tap = {
  bind: function(dom, callback) {
    let startTime, startX, startY
    const ele = dom
    
    ele.addEventListener('touchstart', function(e) {
      if (e.targetTouches.length > 1) return

      startTime = Date.now()
         startX = e.targetTouches[0].clientX
         startY = e.targetTouches[0].clientY
    })

    // touchend 手指松开触发, 当前已经没有手指对象, 无法通过targeTouched获取, 通过changedTouches 获取
    ele.addEventListener('touchend', function (e) {
      if (e.targetTouches.length > 1) return
      const time =  Date.now() - startTime
      if (time > 150) return
      const endX = e.changedTouches[0].clientX,
            endY = e.changedTouches[0].clientY
      // 抖动不超过 6 px
      if (Math.abs(startX - endX) < 6 && Math.abs(startY - endY) < 6) {
        callback && callback()
      }
    })
  }
}
```

但是, 还有个问题就是`点击穿透`

### 点击穿透

假如页面上有两个元素A和B. B元素在A元素之上. 我们在B元素的`touchstart`事件上注册了一个回调函数, 该回调函数的`作用`是隐藏B元素. 我们发现, 当我们点击B元素, B元素被隐藏了, 随后, A元素触发了click事件. 

这是因为在移动端浏览器, 事件执行的顺序是`touchstart > touchend > click`. 而click事件有300ms的延迟, 当touchstart事件把B元素隐藏之后, 隔了300ms, 浏览器触发了click事件, 但是此时B元素不见了, 所以该事件被派发到了A元素身上. 如果A元素是一个`链接`, 那此时页面就会意外地跳转


所以我们封装的`tap`是无法解决这个问题的, 还有就是不能解决 `又有滚动又有点击事件`的元素, 一旦点击就会触发, 然后再滚动

最好的方法还是使用`FastClick`库


### FastClick原理浅析

1. 业务正常使用`click`绑定事件
2. 在`document.body`绑定`touchstart`和`touchend`
3. touchstart
  + 用于记录当前点击的元素targetElement
4. touchend
  + 阻止默认事件(`屏蔽`之后的click事件)
  + 合成click事件, 并添加可`跟踪`属性forwardedTouchEvent
  + 在targetElement上触发`click`事件
  + targetElement上绑定的事件`立即执行`, 完成FastClick