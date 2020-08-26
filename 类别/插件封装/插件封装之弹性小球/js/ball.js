class Drag {
  constructor(ele) {
    this.ele = ele
      // 分别表示鼠标位置到窗口左侧和顶部的距离, 小球到元素到窗口左侧和顶部的距离, 鼠标移动距离
      ;['strX', 'strY', 'strL', 'strT', 'curL', 'curT'].forEach(item => {
        this[item] = null
      })
    this.initSpeedL = null
    this.initSpeedT= null
    this.DOWN = null
    this.init()
  }
  init() {
    this.DOWN = this.down.bind(this)
    this.ele.addEventListener('mousedown', this.DOWN)
  }
  down(ev) {
    clearInterval(this.timerH)
    clearInterval(this.timerV)
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
      this.initSpeedL = 0
      return
    }
    if (!this.lastT) {
      this.lastT = ele.offsetLeft
      this.initSpeedT = 0
    }
    this.initSpeedL = ele.offsetLeft - this.lastL // 和this.lastL顺序不能颠倒
    this.initSpeedT = ele.offsetTop - this.lastT  // 顺序不能颠倒
    this.lastL = ele.offsetLeft
    this.lastT = ele.offsetTop
  }
  up() {
    document.removeEventListener('mousemove', this.MOVE)
    document.removeEventListener('mouseup', this.UP)
    this.lastL = null
    this.horizon.call(this)
    this.verticle.call(this)
  }

  horizon() {
    let ele = this.ele
    let minL = 0,
      maxL = document.documentElement.clientWidth - ele.clientWidth,
      speed = this.initSpeedL
    this.timerH = setInterval(() => {
      let curL = ele.offsetLeft + speed
      speed *= 0.99
      if (curL >= maxL) {
        ele.style.left = maxL + 'px'
        speed *= -1
        return
      } else if (curL <= minL) {
        ele.style.left = minL + 'px'
        speed *= -1
        return
      }
      ele.style.left = curL + 'px'
      Math.abs(speed) <= 0.1 ? clearInterval(this.timerH) : null
    }, 16.666667)
  }
  verticle() {
    let ele = this.ele
    let minT = 0,
      maxT = document.documentElement.clientHeight - ele.clientHeight,
      speed = 0.5 //竖直加速度为0
    let v = this.initSpeedT
    let last = null
    this.timerV = setInterval(() => {
      console.log(1)
      v += speed
      let curT = ele.offsetTop + v
      if (last + '' + v === '10') {
        clearInterval(this.timerV)
      }
      last = v
      if (curT >= maxT) {
        ele.style.top = maxT + 'px'
        v -= 0.5
        v *= -1
        return
      } else if (curT <= minT) {
        ele.style.top = minT + 'px'
        v -=0.5
        v *= -1
        return
      }
      ele.style.top = curT + 'px'
    }, 16.66667);
  }
}

class Subscribe {
  constructor() {
    this.pond = []
  }

  add(fn) {
    let pond = this.pond,
      isExist = false
    pond.forEach(item => item === fn ? isExist = true : null)
    !isExist ? pond.push(fn) : null
  }

  remove(fn) {
    let pond = this.pond
    pond.forEach((item, index) => {
      if (item === fn) {
        pond[index] = null
      }
    })
  }

  fire(...arg) {
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

