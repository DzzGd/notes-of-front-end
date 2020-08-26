const canvas = document.getElementById('dog-walking')
const ctx = canvas.getContext('2d')

ctx.scale(-1, 1)

ctx.beginPath()
ctx.moveTo(-10, 10)
ctx.lineTo(-100, 100)


ctx.stroke()

ctx.save()