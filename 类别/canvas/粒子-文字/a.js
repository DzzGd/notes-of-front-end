class Canvas {
  constructor(canvas, input, button) {
    this.canvas = canvas
    canvas.width = window.innerWidth
    canvas.height = window.innerHeight / 2
    this.input = input
    this.btn = button
    this.ctx = canvas.getContext('2d')
    this.FONT_TEXT = null
    this.circleArr = []
    this.showArr = []
    this.addEvent()
    this.initCiclesInit()
  }

  addEvent() {
    this.input.addEventListener('change', (e) => {
      const { target } = e
      this.FONT_TEXT = target.value
    })
    this.btn.addEventListener('click', () => {
      // this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height)
      this.loadCanvas()
    })
  }
  initCiclesInit() { // 初始化缓动粒子, 以及启动定时器
    const { ctx } = this
    const { random } = Math
    for (let i = 0; i < 100; i++) {
      const option = { // 随机出现位置和半径
        radius: ~~(random() * 3) + 2,
        x: ~~(random() * window.innerWidth),
        y: ~~(random() * (window.innerHeight / 2)),
        color: 'rgba(255, 255, 255, 0.5)'
      }
      var bubble = new Bubble(option)
      this.circleArr.push(bubble)
    }

    function randomMove() {
      this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight / 2)
      this.circleArr.forEach(v => {
        v.draw(ctx, true) // 绘制粒子
      })
      this.showArr.forEach(v => {
        v.draw(ctx)
      })
      setTimeout(randomMove.bind(this), 50)
    }
    setTimeout(randomMove.bind(this), 50)
  }
  loadCanvas() { // 加载
    const fontSize = 100
    const width = this.calWordWidth(fontSize)
    const newCanvas = document.createElement('canvas')
    newCanvas.id = 'new_canvas'
    newCanvas.width = width
    newCanvas.height = fontSize
    const newCtx = newCanvas.getContext('2d')
    newCtx.font = fontSize + 'px Microsoft YaHei'
    newCtx.fillStyle = 'orange'
    newCtx.fillText(this.FONT_TEXT, 0, fontSize / 5 * 4)
    this.getImage(newCanvas, newCtx)
  }
  getImage(_canvas, _ctx) { // 获取文字转成的 canvas
    const image = new Image()
    image.src = _canvas.toDataURL('image/jpeg')
    const _this = this
    image.onload = function () {
      _ctx.clearRect(0, 0, _canvas.width, _canvas.height)
      _ctx.drawImage(image, 0, 0, this.width, this.height)
      const imageData = _ctx.getImageData(0, 0, this.width, this.height)
      const diff = 4
      let { ctx: newCtx, circleArr, showArr } = _this
      let tempArr = []
      for (var j = 0; j < this.height; j += diff) {
        for (var i = 0; i < this.width; i += diff) {
          var colorNum = 0
          for (var k = 0; k < diff * diff; k++) {
            var row = k % diff
            var col = ~~(k / diff)
            let r = imageData.data[((j + col) * this.width + i + row) * 4 + 0]
            let g = imageData.data[((j + col) * this.width + i + row) * 4 + 1]
            let b = imageData.data[((j + col) * this.width + i + row) * 4 + 2]
            if (r < 10 && g < 10 && b < 10) colorNum++
          }
          if (colorNum < diff * diff / 3 * 2) {
            const option = {
              x: i,
              y: j,
              radius: ~~(Math.random() * 3) + 2,
              isWord: true,
              color: 'rgba(255, 255, 255, 0.5)'
            }
            const showArrItem = showArr.pop()
            if (showArrItem) {
              showArrItem.x = option.x
              showArrItem.y = option.y
              tempArr.push(showArrItem)
            } else {
              let oldParticle = circleArr.pop()
              
              if (!oldParticle) { // 新粒子
                oldParticle = new Bubble(option)
                oldParticle.lastX = ~~(Math.random() * window.innerWidth)
                oldParticle.lastY = ~~(Math.random() * (window.innerHeight / 2))
              } else { // 旧粒子, 需要改变target
                oldParticle.lastX = oldParticle.x
                oldParticle.lastY = oldParticle.y
                oldParticle.x = option.x
                oldParticle.y = option.y
              }
              tempArr.push(oldParticle)
            }
          }
        }
      }
      
      if (showArr.length) {
        showArr.forEach(v => {
          v.radius = ~~(Math.random() * 3) + 2
          v.x = ~~(Math.random() * window.innerWidth)
          v.y = ~~(Math.random() * (window.innerHeight / 2))
          _this.circleArr.push(v)
        })
      }
      _this.showArr = tempArr
      // document.body.appendChild(_canvas) //离屏canvas展现到界面中看到渲染效果
    }
  }
  calWordWidth(fontSize) { // 获取并返回需要设置的图片宽度
    const { FONT_TEXT } = this
    const arr = FONT_TEXT.split('')
    const reg = /\w/
    let width = 0
    arr.forEach(item => {
      if (reg.test(item)) {
        width += fontSize
      } else {
        width += fontSize + 10
      }
    })
    return width
  }
}


function Bubble(option) {
  this.width = window.innerWidth
  this.height = window.innerHeight / 2
  this.radius = option.radius || 6
  this.color = option.color || '#fff'
  this.isWord = option.isWord || false
  this.targetX = option.targetX || ~~(Math.random() * window.innerWidth)
  this.targetY = option.targetY || ~~(Math.random() * window.innerHeight / 2)
  this.x = option.x || 0
  this.y = option.y || 0
}
Bubble.prototype.draw = function (ctx, randomMove) {
  const { random, sqrt, pow } = Math
  const dis = ~~sqrt( /*两点间距离*/
    pow(
      this.x - this.targetX, 2
    )
    +
    pow(
      this.y - this.targetY, 2
    )
  )
  const ease = 0.2
  if (randomMove) {

    if (dis > 0) {
      if (this.x < this.targetX) {
        this.x += ease * dis
      } else {
        this.x -= ease * dis
      }
      if (this.y < this.targetY) {
        this.y += ease * dis
      } else {
        this.y -= ease * dis
      }
      ctx.beginPath()
      ctx.arc(this.x, this.y, this.radius, 0, 2 * Math.PI, false)
      ctx.fillStyle = this.color
      ctx.fill()
    } else {
      this.targetX += ~~(Math.random() * (Math.random() > 0.5 ? 5 : -5) * 2)
      this.targetY += ~~(Math.random() * (Math.random() > 0.5 ? 5 : -5) * 2)
    }

  } else {
    const x = this.x * 3 + 50
    const y = this.y * 3 + 50
    const dis = ~~sqrt( /*两点间距离*/
      pow(
        this.lastX - x, 2
      )
      +
      pow(
        this.lastY - y, 2
      )
    )

    if (dis > 0) {
      if (this.lastX > x) {
        this.lastX -= ease * dis
      } else {
        this.lastX += ease * dis
      }
      if (this.lastY > y) {
        this.lastY -= ease * dis
      } else {
        this.lastY += ease * dis
      }

    } else {
      this.lastX = x
      this.lastY = y
    }

    ctx.beginPath()
    ctx.arc(this.lastX, this.lastY, this.radius, 0, 2 * Math.PI, false)
    ctx.fillStyle = this.color
    ctx.fill()
  }

}
const o = new Canvas(document.getElementById('canvas'), document.getElementById('input'), document.getElementById('btn'))

let count = 10
let interval = setInterval(() => {
  if (count === 0) {
    clearInterval(interval)
    o.FONT_TEXT = 'dz Go!'
    o.loadCanvas()
    return
  }
  o.FONT_TEXT = count.toString()
  o.loadCanvas()
  count--
}, 1000);