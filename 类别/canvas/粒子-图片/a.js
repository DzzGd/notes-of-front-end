class particle {
  constructor({ wrap, imgUrls, radius }) {
    this.wrap = wrap
    this.ctx = wrap.getContext('2d')
    this.imgUrls = imgUrls
    this.radius = radius
    this.imgObjs = []
    this.index = 0
    this.dots = []
    // this.init()
  }
  init() {
    let imgReq = [] // 图片加载的 promise
    if (this.imgUrls) {
      this.imgUrls.forEach(url => {
        const promise = new Promise(resolve => {
          const img = new Image()
          img.onload = () => {
            this.imgObjs.push(img) // 将对象存储起来
            resolve()
          }
          img.src = url
        })
        imgReq.push(promise)
      })
    }
    Promise.all(imgReq).then(_ => {
      this.start()
    })
  }
  start() {
    this.dots = []
    this.drawPic()
    this.toParticle()
    this.combineAnimate()
    this.index = ++this.index === this.imgObjs.length ? 0 : this.index
  }
  drawPic() {
    this.clearRect(0, 0, this.wrap.width, this.wrap.height)
    let imgObj = this.imgObjs[this.index]
    if (imgObj.width > imgObj.height) {
      const scale = imgObj.height / imgObj.width
      imgObj.width = this.wrap.width * .5
      imgObj.height = imgObj.width * scale
    } else {
      const scale = imgObj.width / imgObj.height
      imgObj.height = this.wrap.height * .7
      imgObj.width = imgObj.height * scale
    }
    this.ctx.drawImage(imgObj, this.wrap.width / 2 - imgObj.width / 2, this.wrap.height / 2 - imgObj.height / 2, imgObj.width, imgObj.height)
  }
  toParticle() {
    let imgData = this.ctx.getImageData(0, 0, this.wrap.width, this.wrap.height)
    let data = imgData.data
    for (let x = 0, width = imgData.width; x < width; x += 2 * this.radius) {
      for (let y = 0, height = imgData.height; y < height; y += this.radius * 2) {
        let i = (y * width + x) * 4 // i 为 r , g, b, a 中的 r
        if (data[i + 3] !== 0 && data[i] !== 255 && data[i + 1] !== 255 && data[i + 2] !== 255) {
          let dot = {
            x: this.wrap.width / 2 - imgData.width / 2 + x,
            y: this.wrap.height / 2 - imgData.height / 2 + y,
            z: this.radius,
            r: data[i],
            g: data[i + 1],
            b: data[i + 2],
            a: 1,
            ix: Math.floor(Math.random() * (this.wrap.width + 100 - (-100) + 1) - 100),
            iy: Math.floor(Math.random() * (this.wrap.height + 100 - (-100) + 1) - 100),
            iz: Math.floor(Math.random() * (this.radius * 3 + 1)),
            ir: 255,
            ig: 255,
            ib: 255,
            ia: 0,
            tx: Math.floor(Math.random() * (this.wrap.width + 100 - (-100) + 1) - 100),
            ty: Math.floor(Math.random() * (this.wrap.height + 100 - (-100) + 1) - 100),
            tz: Math.floor(Math.random() * (this.radius * 3 + 1)),
            tr: 255,
            tg: 255,
            tb: 255,
            ta: 0
          }
          this.dots.push(dot)
        }
      }
    }
  }
  combineAnimate() { // 合并
    const { abs } = Math
    let combined = false
    this.clearRect()
    this.dots.map(dot => {
      if (abs(dot.ix - dot.x) < 0.1 && abs(dot.iy - dot.y) && abs(dot.ia - dot.a) < 0.1) {
        // dot.ix += dot.x
        // dot.iy += dot.y
        // dot.iz += dot.z
        // dot.ir += dot.r
        // dot.ig += dot.g
        // dot.ib += dot.b
        // dot.ia += dot.a // 这里注释部分 有额外的 效果
        dot.ix = dot.x
        dot.iy = dot.y
        dot.iz = dot.z
        dot.ir = dot.r
        dot.ig = dot.g
        dot.ib = dot.b
        dot.ia = dot.a
        combined = true
      } else {
        dot.ix += (dot.x - dot.ix) * 0.07
        dot.iy += (dot.y - dot.iy) * 0.07
        dot.ir += (dot.r - dot.ir) * 0.3
        dot.iz += (dot.z - dot.iz) * 0.1
        dot.ig += (dot.g - dot.ig) * 0.3
        dot.ib += (dot.b - dot.ib) * 0.3
        dot.ia += (dot.a - dot.ia) * 0.1
        combined = false
      }
      this.drawDots(dot) // 绘制每一个单个点
    })
      requestAnimationFrame(this.combineAnimate.bind(this))

    // if (!combined) {
    //   requestAnimationFrame(this.combineAnimate.bind(this))
    // } else {
    //   setTimeout(() => {
    //     this.separateAnimate()
    //   }, 500);
    // }
  }
  separateAnimate() {
    const { abs } = Math
    let separate = false
    this.clearRect()
    this.dots.map(dot => {
      if (abs(dot.ix - dot.tx) < 0.1 && abs(dot.iy - dot.ty) && abs(dot.ia - dot.ta) < 0.1) {
        dot.ix = dot.tx
        dot.iy = dot.ty
        dot.iz = dot.tz
        dot.ir = dot.tr
        dot.ig = dot.tg
        dot.ib = dot.tb
        dot.ia = dot.ta
        separate = true
      } else {
        dot.ix += (dot.tx - dot.ix) * 0.07
        dot.iy += (dot.ty - dot.iy) * 0.07
        dot.iz += (dot.tz - dot.iz) * 0.07
        dot.ir += (dot.tr - dot.ir) * 0.02
        dot.ig += (dot.tg - dot.ig) * 0.02
        dot.ib += (dot.tb - dot.ib) * 0.02
        dot.ia += (dot.ta - dot.ia) * 0.01
        separate = false
      }
      this.drawDots(dot) // 绘制每一个单个点
    })
    if (!separate) {
      requestAnimationFrame(this.separateAnimate.bind(this))
    } else {
      setTimeout(() => {
        this.start()
      }, 500);
    }
  }
  clearRect() { // 清除画布
    this.ctx.clearRect(0, 0, this.wrap.width, this.wrap.height)
  }
  drawDots(dot) {
    this.ctx.beginPath()
    this.ctx.fillStyle = `rgba(${dot.ir},${dot.ig},${dot.ib},${dot.ia})`
    this.ctx.arc(dot.ix, dot.iy, dot.iz, 0, Math.PI * 2)
    this.ctx.fill()
    this.ctx.closePath()
  }
}

const canvas = document.getElementById('canvas')
const imgUrls = ['./imgs/1.jpg', './imgs/2.jpg']
const radius = 4
const par = new particle({ wrap: canvas, imgUrls, radius })
par.init()
