
# 利用js进行弹性小球的插件封装

封装一个插件, 将小球的DOM对象作为参数书传入, 使得小球在鼠标按下和放开后能够运动.

在水平方向做匀减速直线运动, 初速度为鼠标移开瞬间的速度, 在竖直方向的运动类似于自由落体运动. 并且, 小球的始终在不离开浏览器的边界运动, 碰到边界会有如图的反弹效果.

![1.gif](http://static.bigbigbigdz.xyz:8111/static/img/arti/1dqjb5194403963/1574754771767524166.gif)

## 技巧

**如何获取初始速度?**
鼠标的`move`事件,是有一个小时间触发间隔的, 比如`20ms`, 因此可以借助, 这个最短间隔来进行初始速度的判定.
因为只要你在这个间隔内移动距离越大就说明初始速度就越快, 因此直接把这个巨鹿当做初始速度即可

**如何定义加速度**
这里在水平方向上采用了非匀变速, 就是每次让速度乘以一个小于1的小数, 依次减小例如:`v = v * 0.9`
竖直方向上, 因为小球始终要往下运动的不会停在空中, 因此这里为了好理解就采用了 匀变速, 每次速度变化量相同,例如:`v = v - 1`

## 实现

1. 基本结构

```html
<style>
  html, body {
    padding: 0;
    margin: 0;
    height: 100%;
    overflow: hidden;
  }

  .box {
    width: 100px;
    height: 100px;
    background-color: pink;
    cursor: move;
    border-radius: 50%;
  }
</style>
<script src="./js/ball.js"></script>

<body>
  <div class="box"></div>
</body>
```

2. 实现基本功能--鼠标拖拽

```js
class Drag {
  constructor(ele) {
    this.ele = ele
    // 分别表示鼠标位置到窗口左侧和顶部的距离, 小球到元素到窗口左侧和顶部的距离, 小球移动距离
    ;['strX', 'strY', 'strL', 'strT', 'curL', 'curT'].forEach(item => {
      this[item] = null
    })
    this.initSpeed = null // 初始速度
    this.DOWN = null
    this.init()
  }
  init() {
    //绑定鼠标按下事件
    this.DOWN = this.down.bind(this) // 绑定this, 不然默认事件内部this指向window
    this.ele.addEventListener('mousedown', this.DOWN)
  }
  down(ev) {
    // 记录初始位置坐标值以及鼠标位置
    let ele = this.ele
    this.strX = ev.clientX
    this.strY = ev.clientY
    this.strL = ele.offsetLeft
    this.strT = ele.offsetTop
    this.MOVE = this.move.bind(this)
    this.UP   = this.up.bind(this)
    document.addEventListener('mousemove', this.MOVE)
    document.addEventListener('mouseup', this.UP)
  }
  move(ev) {
    // 设置小球的位置: 现在的位置 = 之前的位置 + 鼠标移动的距离
    let ele = this.ele
    this.curL = this.strL + ev.clientX - this.strX
    this.curT = this.strT + ev.clientY - this.strY
    ele.style.top = this.curT + 'px'
    ele.style.left = this.curL + 'px'
  }
  up(ev) {
    // 一旦抬起 释放事件
    let ele = this.ele
    document.removeEventListener('mousemove', this.MOVE)
    document.removeEventListener('mouseup', this.UP)
  }
}
```

整个过程大致是:

+ 鼠标按下, 记录此时的鼠标坐标位置`clientX -> strX`, `clientY -> strY`和元素的距离窗口左边和顶部的位置`offsetLeft -> strL`, `offsetTop -> strT`
+ 按下之后给`document`绑定鼠标`move`事件, 记录鼠标位置信息和元素位置信息, 得到`curL`和`curT` 元素的位置信息
+ 然后绑定的鼠标抬起事件是解除`mousemove`, `mouseup`


3. 实现自动滚动功能--弹性碰撞

```js
class DRAG {
  constructor(ele) {
    this.ele = ele
      // 分别表示鼠标位置到窗口左侧和顶部的距离, 小球到元素到窗口左侧和顶部的距离, 小球实时位置
      ;['strX', 'strY', 'strL', 'strT', 'curL', 'curT'].forEach(item => {
        this[item] = null
      })
    this.initSpeed = null
    this.DOWN = null
    this.init()
  }
  init() {
    this.DOWN = this.down.bind(this)
    this.ele.addEventListener('mousedown', this.DOWN)
  }
  down(ev) {
    clearInterval(this.timerH) // 点击解除水平定时器
    clearInterval(this.timerV) // 点击解除垂直定时器
    let ele = this.ele
    this.strX = ev.clientX
    this.strY = ev.clientY
    this.strL = ele.offsetLeft
    this.strT = ele.offsetTop
    this.MOVE = this.move.bind(this)
    this.UP = this.up.bind(this)
    document.addEventListener('mousemove', this.MOVE)
    document.addEventListener('mouseup', this.UP)
  }
  move(ev) {
    let ele = this.ele
    this.curL = this.strL + ev.clientX - this.strX
    this.curT = this.strT + ev.clientY - this.strY
    ele.style.top = this.curT + 'px'
    ele.style.left = this.curL + 'px'
    if (!this.lastL) {
      this.lastL = ele.offsetLeft
      this.initSpeed = 0
      return
    }
    this.initSpeed = ele.offsetLeft - this.lastL // 顺序不能颠倒, 记录拖拽速度, 也就是单位时间内的长度
    this.lastL = ele.offsetLeft
  }
  up() {
    document.removeEventListener('mousemove', this.MOVE)
    document.removeEventListener('mouseup', this.UP)
    this.lastL = null

    // 然后小球自己运动 ↓
    this.horizon.call(this) // 水平方向
    this.verticle.call(this) // 垂直方向
  }

  horizon() {
    let ele = this.ele
    let minL = 0,
      maxL = document.documentElement.clientWidth - ele.clientWidth,// 因为元素有宽度所以要减去
      speed = this.initSpeed
    this.timerH = setInterval(() => {
      let curL = ele.offsetLeft + speed
      speed *= 0.99 // 速度 非匀变减速
      if (curL >= maxL) { // 碰壁反方向
        ele.style.left = maxL + 'px'
        speed *= -1
        return
      } else if (curL <= minL) { // 碰壁反方向
        ele.style.left = minL + 'px'
        speed *= -1
        return
      }
      ele.style.left = curL + 'px'
      Math.abs(speed) <= 0.1 ? clearInterval(this.timerH) : null // 停止条件
    }, 16.666667)
  }
  verticle() {
  let ele = this.ele
  let minT = 0,
    maxT = document.documentElement.clientHeight - ele.clientHeight,
    speed = 0.5 // 加速度为0.5
  let v = 0
  let last = null // 上一次的速度
  this.timerV = setInterval(() => {
    v += speed
    let curT = ele.offsetTop + v
    if (last + '' + v === '10') {
      clearInterval(this.timerV)
    }
    last = v
    if (curT >= maxT) {
      ele.style.top = maxT + 'px'
      v -= 0.5 // 衰减速度
      v *= -1
      return
    } else if (curT <= minT) {
      ele.style.top = minT + 'px'
      v +=0.5 // 衰减速度
      v *= -1
      return
    }
    ele.style.top = curT + 'px'
  }, 16.66667);
}
}
```

整个过程是:

+ 鼠标抬起后, 根据初速度`initSpeed`来进行水平和垂直方向上的减速运动
+ 水平方向就是简单的速度递减, 然后到达一个最小值后停止
+ 垂直方向上的速度, 加速度是一直向下的, 只是速度在方向上的改变, 因此速度在正负间来回转换, 停止条件就是, 向下的时候速度肯定是越来越大的, 但是来回弹跳之后就会衰减, 等到向下掉落时, 到底部时速度为很小 这个时候就没有再向上的初始速度了, 就会在两个个来回弹跳, 根据这个规律作为停止条件

## 利用发布订阅的来扩展插件, 提高封装扩展思维

定义一个Subscribe类, 它的作用是收纳订阅者, 每当鼠标按下抬起或者移动时, 就会通知它的订阅者, 并进行传参, 让订阅者根据这个发布的信息进行工作, 就达到了扩展的目的

```js
// 发布订阅
class Subscribe {
  constructor() {
    this.pond = []
  }

  add(fn) { // 添加订阅者
    let pond = this.pond,
      isExist = false
    pond.forEach(item => item === fn ? isExist = true : null)
    !isExist ? pond.push(fn) : null
  }

  remove(fn) { // 删除订阅者
    let pond = this.pond
    pond.forEach((item, index) => {
      if (item === fn) {
        pond[index] = null
      }
    })
  }

  fire(...arg) { // 发布广播
    let pond = this.pond
    for (let i = 0; i < pond.length; i++) {
      let item = pond[i]
      if (item === null) {
        pond.splice(i, 1)
        i--
        continue
      }
      item(...arg)
    }
  }
}
```

这个时候`DRAG`类就只需要基本的小球移动功能, 其他的功能就通过发布订阅来进行扩展

`DRAG`类在初始化时添加了三个事件池:

```js
class DRAG {
  constructor(ele) {
    //...
    this.init()
  }
  init() {
    //...
    this.subDown = new Subscribe()
    this.subMove = new Subscribe()
    this.subUp = new Subscribe()
    //...
  }
}
```

然后为DRAG定义一个扩展方法:

```js
flexMOve(speedL = 0.9, speedT = 0.5) { // 弹性小球功能
  extendDtag_flexMove(this, speedL, speedT)
  // speedT这里有bug, 因为 在竖直反向上采用匀减速, 竖直方向上的计时器的停止条件有很多情况, 不能找到一个最简便的方法, 所以采用了一个固定值, 但是演示效果已经达到 
}
```

扩展方法为小球添加了功能:

```js
function extendDtag_flexMove(_this, speedL, speedT) {
  let mousedown = function (el) {
    clearInterval(_this.timerH)
    clearInterval(_this.timerV)
  }

  let mousemove = function (el) {
    if (!_this.lastL) {
      _this.lastL = el.offsetLeft
      _this.initSpeedL = 0
      return
    }
    if (!_this.lastT) {
      _this.lastT = el.offsetLeft
      _this.initSpeedT = 0
    }
    _this.initSpeedL = el.offsetLeft - _this.lastL
    _this.initSpeedT = el.offsetTop - _this.lastT
    _this.lastL = el.offsetLeft
    _this.lastT = el.offsetTop
  }

  let mouseup = function (el) {
    _this.lastL = null
    _this.lastT = null
    horizon(el)
    verticle(el)
  }

  function horizon(el) {
    let minL = 0,
      maxL = document.documentElement.clientWidth - el.clientWidth,
      speed = _this.initSpeedL
      _this.timerH = setInterval(() => {
      let curL = el.offsetLeft + speed
      speed *= speedL
      if (curL >= maxL) {
        el.style.left = maxL + 'px'
        speed *= -1
        return
      } else if (curL <= minL) {
        el.style.left = minL + 'px'
        speed *= -1
        return
      }
      el.style.left = curL + 'px'
      Math.abs(speed) <= 0.1 ? clearInterval(_this.timerH) : null
    }, 16.666667)
  }

  function verticle(el) {
    let minT = 0,
      maxT = document.documentElement.clientHeight - el.clientHeight,
      speed = 0.5
    let v = _this.initSpeedT
    let last = null
    _this.timerV = setInterval(() => {
      v += speed
      console.log(last + '' + v )
      let curT = el.offsetTop + v
      if (last + '' + v === '11' || last + '' + v === '20') {
        clearInterval(_this.timerV)
      }
      last = v
      if (curT >= maxT) {
        el.style.top = maxT + 'px'
        v -= 3 * speed
        v *= -1
        return
      } else if (curT <= minT) {
        el.style.top = minT + 'px'
        v += 8 * speed// -0.5 + 4.0
        v *= -1
        return
      }
      el.style.top = curT + 'px'
    }, 16.66667);
  }

  _this.subDown.add(mousedown) // 订阅
  _this.subMove.add(mousemove) // 订阅
  _this.subUp.add(mouseup)     // 订阅
}
```

最后在DARG响应的鼠标事件里进行信息`发布`

```js
  down(ev) {
    //...
    this.subDown.fire(ele)
  }
  move(ev) {
    //...
    this.subMove.fire(ele)
  }
  up() {
    //...
    let ele = this.ele
    this.subUp.fire(ele)
  }
```

这样就完成了扩展, 之后想进行添加新的功能就只需要新建一个方法进行扩展, 而不需要修改`DRAG`类里面的基本结构

然后在页面调用我们的类, 以及扩展:

```html
<script>
const ball = new DRAG(document.getElementById('box'))
ball.flexMOve(0.99)
</script>
```

然后简单的封装一下, 把所有代码放到一个立即执行函数中, 利用闭包完成变量的导出:

```js
;(function (w) {
  class DRAG{
    //...
  }
  //...
  window.DRAG = DRAG
})(window);
```

## 结语

引用一位[博主](https://juejin.im/post/5cf4c8ce6fb9a07efc4973a6)的话

不是简单讲讲效果的实现, 贴贴代码就过去了, 而是体验了封装插件的整个过程. 有了发布-订阅的场景, 理解这个`设计思想`就更加容易了.

其实在这个过程中, 功能并没有添加多少, 但是这波操作确实值得, 因为它让整个代码更加的灵活. 回过头看, 比如DOM2的事件池机制, vue的生命周期钩子等等, 你就会明白它们为什么要这么设计, 原理上和这次封装没有区别, 这样一想, 很多东西就更加清楚了. 

在我看来, 无论你是做哪个端的开发工作, 其实大部分业务场景, 大部分流行的框架技术都很可能会在若干年后随风而逝, 但真正留下来的, 伴随你一生的东西是`编程思想`. 在我的理解中, 编程的意义远不止造轮子, 写插件, 来显得自己金玉其外, 而是留心思考, 提炼出一些思考问题的方式, 从而在某个确定的时间点让你拥有极其敏锐的判断, 来指导和优化你下一步的决策, 而不是纵身于飞速迭代的技术浪潮, 日渐焦虑. 我觉得这是一个程序员应该追求的东西. 
