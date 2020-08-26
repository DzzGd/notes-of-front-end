class dogAnimation {
  constructor(canvas) {
    canvas.width = window.innerWidth
    canvas.height = 200
    this.el = canvas
    this.picWidth = 180
    this.totalWidth = canvas.width // 总宽度
    this.totalHeight = canvas.height
    this.ctx = canvas.getContext('2d') // canvas上下文
    this.dogpics = [] // 图片数据
    this.RES_PATH = './imgs' // 图片路径
    this.IMG_COUNT = 8 // 图片数量
    this.Index = -1 // 图片 index
    this.animation = null
    this.mouseIn = false
    this.mousePositionX = null
    this.dogStopWalking = false
    this.dog = {
      stepDistance: 10,
      speed: 0.1,
      mouseX: 0
    }
    this.direct = 0 // -1 左, 1 右, 0 停止
    this.walk = null // 动画函数
    this.start() // 开始
  }

  async start() {
    this.lastTime = new Date()
    await this.loadResource()
    const keyFrameIndex = 0// 图片加一
    const img = this.dogpics[keyFrameIndex]
    this.drawImage(img, this.dog.mouseX) // 绘制第一帧
    this.recordMousePosition()
  }

  animationWalk() {
    let stop = false
    let direct = 0
    let minus = this.mousePositionX - this.dog.mouseX - 90
    if (minus >= 0) {
      direct = 1
    } else {
      direct = -1
    }
    if (Math.abs(minus) <= this.picWidth / 2) {
      stop = true
      this.Index = 0
    }
    const nowTime = new Date()
    let interval = nowTime - this.lastTime
    let diffDistance = interval * this.dog.speed;
    if (diffDistance < this.dog.stepDistance) {
      this.animation = window.requestAnimationFrame(this.animationWalk.bind(this))
      return
    } // 小于间隔不执行
    this.ctx.clearRect(0, 0, this.totalWidth, this.totalHeight);
    this.ctx.save()

    if (direct === -1) {
      this.ctx.scale(direct, 1)
    }
    if (!stop) {
      this.dog.mouseX += direct * this.dog.stepDistance
    } else {
      this.Index = -2
    }
    const keyFrameIndex = ++this.Index % this.IMG_COUNT // 图片加一
    const img = this.dogpics[keyFrameIndex + 1]
    let drawX = this.dog.mouseX * direct - (direct === -1 ? this.picWidth : 0);
    this.drawImage(img, drawX)
    this.ctx.restore()
    this.lastTime = nowTime
    this.animation = window.requestAnimationFrame(this.animationWalk.bind(this))
  }
  drawImage(img, pos) { // 绘制图片
    this.ctx.drawImage(img, 10, 0, img.naturalWidth, img.naturalHeight, pos, 20, 186, 162)
  }
  recordMousePosition() {
    this.el.addEventListener('mouseout', () => {
      this.mouseIn = false
    })
    this.el.addEventListener('mouseenter', (e) => {
      this.mousePositionX = e.offsetX
      this.mouseIn = true
      this.animationWalk()
    })
    this.el.addEventListener('mousemove', (e) => {
      this.mousePositionX = e.offsetX
    })
  }
  loadResource() {
    let walks = []
    for (let i = 0; i <= this.IMG_COUNT; i++) {
      let img = new Image()
      img.src = `${this.RES_PATH}/${i + 1}.png`
      walks.push(new Promise(resolve => {
        img.onload = () => resolve(img)
      }))
    }
    return Promise.all(walks).then(res => {
      this.dogpics = res
      return Promise.resolve(true)
    })
  }
}

const o = new dogAnimation(document.querySelector('#dog-walking'))

document.querySelector('#stop').onclick = () => {
  window.cancelAnimationFrame(o.animation)
}

document.querySelector('#start').onclick = () => {
  o.start()
}