
class moveJS {
  constructor(el, cb) {
    this.el = el
    this.interval = 16 // 时间间隔 16ms
    this.propObjs = {}
    this.cb = null
  }


  getCss(style) { // 获取计算属性值, // 兼容 IE
    return window.getComputedStyle ? window.getComputedStyle(this.el)[style] : this.el.currentStyle[style]
  }
  start(propertyName, target, duration, easing, cb) {
    this.cb = cb
    this.setPropObjs(propertyName, target, duration, easing)
    // const callbak = () => {
    //   this.step(propertyName)
    //   requestAnimationFrame(callbak)
    // }
    // requestAnimationFrame(callbak)
    this.propObjs[propertyName].timeId = setInterval(() => {
      this.step(propertyName)
    }, this.interval);
  }
  setPropObjs(propertyName, target, duration, easing) {
    this.propObjs[propertyName] = {
      start: parseFloat(this.getCss(propertyName)),
      target,
      startTime: + new Date(),
      duration,
      easing: this.strategies[easing].bind(this)
    }
  }
  step(propertyName) {
    const {
      start,
      target,
      startTime,
      duration,
      easing,
      timeId
    } = this.propObjs[propertyName]
    const t = + new Date()
    const disTime = t - startTime
    let pos = null
    pos = easing(disTime, start, target, duration)
    if (disTime >= duration) {
      clearInterval(timeId)
      this.cb && this.cb(this)
    }

    this.update(propertyName, pos)
  }
  update(propertyName, pos) {
    this.el.style[propertyName] = `${pos}px`
  }
  stop(propertyName) { // 停止, 暂停
    clearInterval(this.propObjs[propertyName].timeId)
  }
  getRad(angle) {
    return Math.PI / 180 * angle
  }
}

moveJS.prototype.strategies = {
  easeInOut: function (t, b, c, d) {
    const x = (1 / dis) * alreadyMove
    const ret = 1 / 2 * Math.sin(
      Math.PI * (x - 0.5)
    ) + 0.5
    // if ((t /= d / 2) < 1) return c / 2 * t * t * t * t * t + b;
    // return c / 2 * ((t -= 2) * t * t * t * t + 2) + b;
    return ret * c
  },
  linear: function (t, b, c, d) {
    console.log(b)
    return b + t * (c / d)
  },
  easeIn: function (t, b, c, d) {
    return c * (t /= d) * t + b;
  },
  easeOut: function (t, b, c, d) {
    return -c * (t /= d) * (t - 2) + b;
  },
}

const animation = new moveJS(document.getElementsByClassName('ball')[0])
animation.start('left', -51, 2000, 'linear', _this => {
  // _this.start('left', 0, 2000, 'easeOut')
})


const stop = document.getElementById('stop')
// const start = document.getElementById('start')

stop.onclick = () => {
  animation.stop('left')
}

// start.onclick = () => {
//   animation.start()
// }
