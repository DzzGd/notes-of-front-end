class Particle {
  constructor(canvas, dotsNum, maxRadius) {
    this.el = canvas
    this.width = null
    this.height = null
    this.ctx = canvas.getContext('2d')
    this.dotsNum = dotsNum || 100
    this.maxRadius = maxRadius
    this.mouseDot = null
    this.dots = []
    this.init()
  }

  init() { // 初始化位置
    this.el.width = this.width = window.innerWidth
    this.el.height = this.height = window.innerHeight
    const { floor, random } = Math
    for (let i = 0; i < this.dotsNum; i++) {
      const dot = {
        x: floor(random() * (this.width + 1)),
        y: floor(random() * (this.height + 1)),
        r: 1,
        moveX: random() - 0.5,
        moveY: random() - 0.5,
        dist: 80 * 80 // 6400
      }
      this.dots.push(dot)
      this.drawDots(dot)
    }
    this.mouseDot = {
      x: null,
      y: null,
      r: 1,
      dist: 100 * 100 // 10000  // [100 - 90] |  90 * 90 = 8100
    }
    this.dots.push(this.mouseDot)
    this.addEventMouse()
    this.start()
  }
  start() {
    requestAnimationFrame(this.animateMove.bind(this))
  }
  animateMove() {
    this.clearRect()
    let dot_i = null, dist = null, x_dist = null, y_dist = null, w = null
    this.dots.forEach((dot, index) => {
      if (dot.x && dot.y) { // 鼠标没有初始化时
        if (dot !== this.mouseDot) {
          dot.x += dot.moveX
          dot.y += dot.moveY
        }
        this.drawDots(dot) // 绘制点
        if (dot.x <= 0 || dot.x >= this.width) { // 碰壁反弹
          dot.moveX = - dot.moveX
        }
        if (dot.y <= 0 || dot.y >= this.height) { // 碰壁反弹
          dot.moveY = - dot.moveY
        }

        // 连线
        for (let i = index + 1, length = this.dots.length; i < length; i++) {
          dot_i = this.dots[i]
          x_dist = dot.x - dot_i.x
          y_dist = dot.y - dot_i.y
          dist = x_dist * x_dist + y_dist * y_dist


          if (dist < dot_i.dist) {
            dot_i === this.mouseDot && dist > 8100 && (dot.x -= 0.02 * x_dist, dot.y -= 0.02 * y_dist)
            w = Math.abs(dot_i.dist - dist) / dot_i.dist
            w = w > 0.4 ? 0.4 : w
            this.drawLine(dot.x, dot.y, dot_i.x, dot_i.y, w)
          }
        }
      }
    })

    requestAnimationFrame(this.animateMove.bind(this))
  }
  clearRect() {
    this.ctx.clearRect(0, 0, this.width, this.height)
  }
  drawLine(x, y, dx, dy, width) {
    this.ctx.beginPath()
    // const color = this.ctx.createLinearGradient(dx, dy, x, y)
    // color.addColorStop(0, '#eee')
    // color.addColorStop(1, '#e60023')
    // this.ctx.strokeStyle = color
    this.ctx.strokeStyle = '#aaa'
    this.ctx.lineWidth = width
    this.ctx.moveTo(x, y)
    this.ctx.lineTo(dx, dy)
    this.ctx.closePath()
    this.ctx.stroke()
  }
  drawDots(dot) {
    const { ctx } = this
    ctx.beginPath()
    ctx.fillStyle = '#aaa'
    ctx.arc(dot.x, dot.y, dot.r, 0, Math.PI * 2)
    ctx.fill()
    ctx.closePath()
  }
  addEventMouse() {
    document.addEventListener('mousemove', e => {
      this.mouseDot.x = e.clientX
      this.mouseDot.y = e.clientY
    })
  }
}

const canvas = new Particle(document.getElementById('canvas'), 100, 1)