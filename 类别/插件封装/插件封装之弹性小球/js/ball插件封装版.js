
;(function (window) {
  class DRAG {
    constructor(ele) {
      this.ele = ele
        ;['strX', 'strY', 'strL', 'strT', 'curL', 'curT'].forEach(item => {
          this[item] = null
        })
      this.init()
    }
    init() {
      this.subDown = new Subscribe()
      this.subMove = new Subscribe()
      this.subUp = new Subscribe()
      this.DOWN = this.down.bind(this)
      this.ele.addEventListener('mousedown', this.DOWN)
    }
    down(ev) {
      let ele = this.ele
      this.strX = ev.clientX
      this.strY = ev.clientY
      this.strL = ele.offsetLeft
      this.strT = ele.offsetTop
      this.MOVE = this.move.bind(this)
      this.UP = this.up.bind(this)
      document.addEventListener('mousemove', this.MOVE)
      document.addEventListener('mouseup', this.UP)
      this.subDown.fire(ele)
    }
    move(ev) {
      let ele = this.ele
      this.curL = this.strL + ev.clientX - this.strX
      this.curT = this.strT + ev.clientY - this.strY
      ele.style.top = this.curT + 'px'
      ele.style.left = this.curL + 'px'
      this.subMove.fire(ele)
    }
    up() {
      document.removeEventListener('mousemove', this.MOVE)
      document.removeEventListener('mouseup', this.UP)
      this.subUp.fire(this.ele)
    }
    flexMOve(speedL = 0.9, speedT = 0.5) {
      extendDtag_flexMove(this, speedL, speedT)
    }
  }

  // 事件池
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

  //扩展
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

    _this.subDown.add(mousedown)
    _this.subMove.add(mousemove)
    _this.subUp.add(mouseup)
  }
  window.DRAG = DRAG
})(window);

