 ## 原型

> 我们创建的每个函数都有一个 prototype(原型)属性, 这个属性是一个指针, 指向一个原型对象, 而这个原型对象中拥有的属性和方法可以被 `所有实例` 共享

举个栗子:

```js
function Person() {
}
Person.prototype.name = 'dz'
Person.prototype.age  = 23
Person.prototype.sayName = function() {
  console.log(this.name)
}
const person1 = new Person()
const person2 = new Person()
console.log(person1.name) // -> dz
person1.sayName() // -> dz
console.log(person1.sayName == person2.sayName) // -> true
```

上面 `Person` 函数有一个 `prototype` 属性指向一个对象, 该对象上的所有的属性和方法都可以被实例所使用. 因此可以在原型上定义属性方法

在默认情况下, 所有原型对象都会自动获得一个 `constructor(构造函数)` 属性, 这个属性包含一个指向 `prototype` 属性所在函数的指针.

(JS高程)当调用构造函数创建一个新实例后, 该实例的内部将包含一个指针(内部属性), 指向构造函数的原型对象. ECMA-262第5版中管这个指针叫 `[[Prototype]]`. 虽然在脚本中没有标准的方式访问[[Prototype]], 但Firefox、Safari和Chrome在每个对象上都支持一个属性 `__proto__`.  

而在其他实现中, 这个属性对脚本则是完全不可见的. 不过, 要明确的真正重要的一点就是, 这个连接存在于 `实例` 与 `构造函数的原型对象` 之间, 而不是存在于 `实例` 与 `构造函数` 之间. 以前面使用 `Person` 构造函数和 `Person.prototype` 创建实例的代码为例, 下图展示了各个对象之间的关系. 

![](https://user-gold-cdn.xitu.io/2020/4/27/171b7769e7c3182f?w=640&h=275&f=jpeg&s=18625)

`Person.prototype` 指向了原型对象(Person Prototype), 而 `Person.prototype.constructor` 又指回了 `Person`, `person1` 和 `person2` 都包含一个内部属性`[[Prototype]]`, 也就是所说的 `__proto__`, 该属性仅仅指向了 `Person.prototype` .

换句话说, 它们([[Prototype]])与构造函数没有直接的关系. 可以调用 person1.sayName()这是通过查找对象属性的过程来实现的.

### 关于原型的一些方法

+ obj1.`isPrototypeOf`(obj2) 判断实例与原型之间的关系, 用于指示对象obj1是否存在与另一个对象obj2的 `原型链` 中
+ Person.`getPrototypeOf`() 返回实例的 `原型对象`
+ person.`hasOwnProperty`('name') 判断一个属性是属于实例还是原型上的, 属于实例返回true, 反之返回false
+ person `instanceof` Person 判断实例对象person的原型链上是否有构造函数Person的原型

### 原型链

```js
//Person
function Person(){}
console.log(Person);  //Person()
console.log(Person.prototype.constructor);    //Person()
console.log(Person.prototype.__proto__);      //Object.prototype
console.log(Person.prototype.__proto__.__proto__);    //NULL
console.log(Person.prototype.__proto__.constructor);  //Object()
console.log(Person.prototype.__proto__ === Object.prototype); //true
```

查找属性, 如果本身(实例)没有, 则会去`__proto__`中查找, 也就是构造函数的原型(对象)中查找, 如果构造函数中也没有该属性, 因为构造函数也是对象实例, 也有`__proto__`, 那么会去构造函数的原型中查找, 一直到大`Object`对象的原型, `Object`的原型对象**没有__proto__**, 是对象原型链的最顶端, 如果没有目标属性则返回`undefined`, 这样不断查找的原型对象连接起来就是**原型链**

### 构造函数扩展

我们的构造函数本质都是从`Function` 通过 `new`出来的, 都是Function的`实例`, 举个栗子

```javascript
const sayName = new Function("var str = 'my name dz, hello!' + name; return str")
const result = sayName()
console.log(result) // my name dz, hello!
```
因此构造函数们都有一个`__proto__`属性指向 `Function的原型`, 也有一个`constructor`指向 `Function`

他们的__proto__都指向Function.prototype, 甚至包括根构造器 `Object` 及`Function`本身

具体关系如下:

```js
Number.__proto__ === Function.prototype // --> true
Number.constructor === Function // --> true

String.__proto__ === Function.prototype // --> true
String.constructor === Function // --> true

Object.__proto__ === Function.prototype // --> true
Object.constructor === Function // --> true

Function.__proto__ === Function.prototype // --> true
Function.constructor === Function // --> true
```
![](https://user-gold-cdn.xitu.io/2020/4/27/171b776de8effbfb?w=800&h=450&f=jpeg&s=34862)

特别注意最后一个 `Function.construtor === Function` 为 true, 也就是说Function(这里作为实例)的原型上面的 constructor(构造器) 为自身(Function), 我也是一脸懵 ...

**除Object.prototype外, 所有的构造器的prototype的__proto__属性都指向Object.prototype**

```js
Function.prototype.__proto__ === Object.prototype; // true
Number.prototype.__proto__ === Object.prototype; // true
String.prototype.__proto__ === Object.prototype; // true
Array.prototype.__proto__ === Object.prototype; // true
Boolean.prototype.__proto__ === Object.prototype; // true
Object.prototype.__proto__ == null // true
```

![](https://user-gold-cdn.xitu.io/2020/4/27/171b77702e464fc7?w=800&h=444&f=jpeg&s=30636)

Object.prototype的__proto__属性是指向 `null` 的

![](https://user-gold-cdn.xitu.io/2020/4/27/171b7772654d1960?w=800&h=425&f=jpeg&s=27106)

Function.prototype也是唯一一个`typeof XXX.prototype`为`function`的prototype
推导Function.prototype.__proto__是什么呢`?`

答案: `Object.prototype`

我的理解是 `prototype` 不管怎么样还是是一个 `对象`, 因此对象的__proto__属性指向了构造器的原型也就是 'Object.prototype`

一些构造器的原型对象 在 typeof 下返回值
```js
console.log(typeof Function.prototype) // function
console.log(typeof Object.prototype)   // object
console.log(typeof Number.prototype)   // object
console.log(typeof Boolean.prototype)  // object
console.log(typeof String.prototype)   // object
console.log(typeof Array.prototype)    // object
console.log(typeof RegExp.prototype)   // object
console.log(typeof Error.prototype)    // object
console.log(typeof Date.prototype)     // object
console.log(typeof Object.prototype)   // object
```

`null`是一个独立数据类型, 而不是一个空引用, 只是期望此处引用一个对像

**typeof null == 'object'**

参考文章[https://segmentfault.com/a/1190000019490184](https://segmentfault.com/a/1190000019490184), 嘿嘿...(一脸坏笑嘎嘎)

## 继承

ECMA中描述了原型链的概念, 并将原型链作为实现继承的主要方法(js高程)

### 原型继承

> 每个对象都有一个`__proto__`属性, 它指向了原型对象. 如果一个构造函数的原型等于另一个构造函数的实例, 那么这个构造函数的原型就会包含指向另一个构造函数原型对象的指针.

举个栗子:

```js
function People(colors) { // 父类
    colors = colors ? colors : []
    this.favorateColors = colors
}

People.prototype.printColor = function() {
    console.log(this.favorateColors)
}

function Teen() { // 子类
}

Teen.prototype = new People()
Teen.prototype.constructor = Teen // 手动修改Son.prototype中的constructor 也就是 构造器
const boy = new Teen()
const girl = new Teen()
boy.favorateColors.push('black')
girl.favorateColors.push('pink')
console.log(boy.favorateColors) //-->['black','pink'] 继承了同一个favorateColors数组对象
```

boy 非常惊讶的发现, 为啥自己会喜欢上了 **粉色...**

**第一个问题:** 虽然原型链继承很强大, 但是存在一个问题, 最主要的问题是包含`引用类型值`的原型

因为包含引用类型值的原型属性会被所有的实例共享, 而在通过原型来实现继承的时候, 原型实际变成了另外一个`函数的实例`(这里边就有可能存在引用类型)

因此想偷懒继承父类的写好的属性(favorateColors)并且想添加自己的专有的颜色, 发现是不可以的

如上面代码所展示的, 不同实例都共享一个原型, 因此其中一个改变了原型对象里的`引用类型`, 会导致其他实例跟着受影响

**第二个问题:** 在创建子类型的时候, 不能向超类型的构造函数中传递参数, 实际上,应该说是没有办法在不影响所有的对象实例的情况下, 给超类型的构造函数传递参数(js高程)

意思就是说 创建 `boy` 的时候 我可以直接添加参数进去设置自己喜欢的颜色, 而不是手动去 `push`:

```javascript
const boy = new Teen(['black'])
boy.printColor() // 'black'
```

像上面这样直接赋值就行了, 并且我 `Teen` 类直接继承, 也不用内部自己写一个代码实现. 但是条件不允许...

### 借用构造函数

```
在子类型的构造函数的内部调用超类型构造函数
函数只不过是在特定华宁中执行代码的对象
```

```javascript
function Person(name, colors) {
  this.name = name
  this.favoriteColors = colors
}

function Teen(name, colors) {
  Person.call(this, name, colors)
}

const boy = new Teen('dz', ['black', 'blue'])
const girl = new Teen('dzz', ['pink', 'red'])

girl.favoriteColors.push('yellow')
console.log(boy.favoriteColors) // black, blue
```

不同实例的引用属性(`favoriteColors`)没有收到影响: 因为在每个子类型构造函数内部调用了父类型, 这个时候是以函数对象调用, 因此会每一次调用都会创建一个新的空间来储存(favoriteColors), 每个 `Teen` 的实例都有自己的favoriteColors副本

借用构造函数模式还有一个优势就是可`传递参数`

**借用构造函数的问题:** (js高程)所有的方法都在构造函数中定义了. 因此函数复用就无从谈起. 而且, 在超类型的 `原型中` 定义的方法, 对子类型而言也是 `不可见` 的, 结果所有的类型只能使用构造函数模式. 考虑到这些问题, 借用构造函数的技术也是很少单独使用

### 组合继承

> 也叫伪经典继承, 指得是将 `原型链` 和 `借用构造函数` 的技术组合到一块, 从而发挥二者之长的一种继承模式

```javascript
function Person(name, colors) {
  this.name = name
  this.favoriteColors = colors
}
Person.prototype.printColors = function () {
  console.log(this.favoriteColors)
}
function Teen(name, colors) {
  Person.call(this, name, colors) //1. 调用一次
}

Teen.prototype = new Person() //2. 调用一次
Teen.prototype.constructor = Teen

const boy = new Teen('dz', ['black', 'blue'])
const girl = new Teen('dzz', ['pink', 'red'])

girl.favoriteColors.push('yellow')
console.log(boy.printColors()) // black, blue
console.log(boy.printColors()) // pink, red, yellow
```

使用原型链实现对原型属性和方法的继承, 而通过借用构造函数来实现实例的属性的继承, 这样即通过在原型上定义方法实现了函数的复用, 又能够保证每个实例都有它自己的属性, 并能在实例化时传递参数

而这种方式的**第一个问题:** 就是父类型的构造函数被调用了两次, 一次是在上述代码`1`出, 执行函数, 第二次是在`2`处, 实例化对象, 这样导致了多一次的加载, 性能消耗

**第二个问题:** 在 `2` 处 实例化时会导致子类型的 `实例` 和 `原型上` 都有一份父类型自身的属性的`副本`, 完全没有必要

### 原型式继承

借助原型可以基于已有的对象创建新对象, 同时还不必因此创建自定义类型

```js
function Obj(obj) {
  function F() {}
  F.prototype = obj
  return new F()
}
```

意思就是将传入的参数(`obj`), 作为其它构造函数的原型对象

```javascript
const person = {
  name: 'dz',
  friends: ['lisa', 'tom']
}

const p1 = Obj(person)
const p2 = Obj(person)
p1.friends.push['alice']
console.log(p2.friends) // -> ['lisa', 'tom']
```

所有的实例将`person`对象作为原型, 因此`person.friends`不仅属于person也被会p1, p2共享, 实际上有创建了person对象两个副本

ECMAScript5通过新增 `Object.create()` 方法规范化了原型式继承. 这个方法接受两个参数: 一个用作新对象原型的对象和(可选)一个为新对象定义额外属性的对象, 只传入一个参数的情况下`Object.create()`和上面的`Obj()`行为相同

```javascript
const person = {
  name: 'dz',
  friends: ['lisa', 'tom']
}
const p1 = Object.create(person)
const p2 = Object.create(person)
p1.friends.push['alice']
console.log(p2.friends) // -> ['lisa', 'tom']
```

(JS高程)在没有必要兴师动众地创建构造函数, 而只想让一个独享与另一个对象保持类似的情况下, 原型式继承完全可以胜任. 不过别忘了, 包含引用类型值的属性始终都会共享相应的值, 就像使用原型模式一样

### 寄生式继承

> 寄生式(parasitic)继承是与原型继承紧密联系相关的一种思路. 寄生式继承与寄生构造函数和工厂模式类似, 即创建一个仅用于 `封装继承` 过程的函数, 该函数在内部以某种暗示来增强对象, 最后再像真低是它做了所有工作一样返回对象

```js
function Obj(obj) {
  function F() {}
  F.prototype = obj
  return new F()
}

function createAnother(original) {
  var clone = Obj(original)
  clone.sayHi = function() {
    alert('hi')
  }
  return clone
}
```

`createAnother()`函数接受一个参数, 也就是将要作为新对象`基础`(构造函数的原型)的对象. 然后把这个对象(original)传递给Obj函数, 将返回的结果赋值给clone. 再为clone对昂添加新方法`sayHi`, 最后返回对象

```js
var person = {
  name: 'dz',
  friends: ['lisa', 'tom']
}

const p1 = createAnother(person)
p1.sayHi() // --> hi
```

p1不仅具有了person的所有方法和属性, 还有自己的方法(`sayHi`)

在主要考虑对象而不是自定义类型和构造函数的情况下, 寄生式继承也是一种有用的模式


### 寄生组合式继承

> (js高程)所谓寄生组合式继承吗即通过借用构造函数来继承属性, 通过原型链的混成形式集成方法

前面的`伪经典继承模式`, 因为存在一些问题, 两次调用超类型构造函数, 子类型包含超类型对象的全部实力属性, 还要重写一次

背后的思路是:

```
不必为了制定子类型的原型而调用超类型的构造函数, 需要的无非就是超类型的原型一个副本而已.
本质上就是使用寄生式继承来继承超类型的的原型, 然后再将结果指定给子类型的原型
```

```js
function inheritPrototype(Son, Father) {
  var prototype = oObject(Father.prototype)
  prototype.constructor = Son
  Son.prototype = prototype
}
```

这个实例中`inheritPrototype`函数实现了寄生组合继承的最简单形式

这个函数接受两个参数: 子类型构造函数和超类型构造函数

在函数内部, 创建超类型原型的一个副本, 然后为副本添加`constructor`属性, 从而弥补了重写原型而失去的默认constructor属性, 最后将创建的对象(副本)赋值给子类型的原型, 这样就可以调用inheritPrototype函数, 去替换前面例子`组合继承`子类型原型赋值的语句了

完整代码:

```js
function People(name) {
  this.name = name
  this.friends = ['lisa', 'tom']
}
People.prototype.sayName = function () {
  console.log(this.name)
}

function Teen(name, age) {
  People.call(this, name)
  this.age = age
}
function Obj(obj) {
  function F() { }
  F.prototype = obj
  return new F()
}

function inheritPrototype(subType, superType) {
  const prototype = Obj(superType.prototype)
  // 此时prototype里就会多__proto__属性指向superType的原型
  prototype.constructor = subType
  subType.prototype = prototype
}

inheritPrototype(Teen, People)
const boy = new Teen()
const girl = new Teen()

boy.friends.push['alice']
console.log(girl.friends) //['lisa', 'tom']
```

此时 `girl` 会拥有自己的属性, 不受 `boy` 影响, 还能传参, 并且只会执行一次 `People构造函数` , perfect!!!

有一个问题就是为什么不直接`Son.prototype = Fateher.prototype`呢?

原因是, 如果这样的话, 子类型和父类型公用一个原型对象, 当我们给Son添加原型方法时候是增加到父类型原型的, 因此其他实例的原型都会受影响

### class继承

> ES6提供了更接近传统语言的写法, 引入了 `Class(类)` 这个概念, 作为对象的模板。通过 `class` 关键字, 可以定义类, class之间通过 `extends` 关键字实现 `继承`, 这笔ES5的通过修改原型链实现继承, 要清晰和方便得多

定义一个父类

```js
class People {
  constructor(name) {
    this.name = name
  }
  sayName () {
    return this.name
  }
}

```

在构造器`constructor`中定义了自己属性, 以及在外面定(也就是原型对象上)义了一个`sayName`方法

给子类`Tom`实现继承:

```js

class Teen extends People {
  constructor(name, age) {
    super(name)
    this.age = age
  }
  sayAge() {
    const name = super.sayName()
    console.log(`my name is ${name}, and my age is ${this.age}`)
  }
}

const boy = new Teen('dzz', 23)
boy.sayAge() //my name is dzz, and my age is 23
```

上面代码中, `constructor`方法和`sayMyself`方法之中, 都出现了`super`关键字, 它在这里表示父类的构造函数(类似于寄生组合继承找中 `Call(this, params)`的作用), 用来新建父类的this对象, 也就是引用父类的属性和方法

子类必须在 `constructor` 方法中调用super方法, 否则新建实例时会报错 这是因为子类没有自己的this对象, 而是继承父类的this对象, 然后对其进行加工, 如果不调用super方法, 子类就得不到this对象

```js
class Teen extends People {
 constructor() {}
}
let girl = new Teen() // ReferenceError
```

在 `sayAge` 中 使用了 `super` , 此时表示 `父类对象`, 可以调用父类中的原型或者实例上的方法和属性



上面代码中,  ColorPoint继承了父类Point,  但是它的构造函数没有调用super方法,  导致新建实例时报错

#### 类的prototype和__proto__属性

大多数浏览器的`ES5`实现之中,  每一个对象都有__proto__属性,  指向对应的构造函数的 prototype 属性

Class 作为构造函数的`语法糖`,  同时有prototype 属性和__proto__属性,  因此同时存在两条继承链

**子类的__proto__属性, 表示构造函数的继承, 总是指向父类**
**子类prototype属性的__proto__属性, 表示方法的继承, 总是指向父类的prototype属性**

```js
class A {}
class B extends A {}
B.__proto__ === A // true
B.prototype.__proto__ === A.prototype // true
```

上面代码中, 子类B的__proto__属性指向父类A, 子类B的prototype属性的__proto__属性指向父类A的prototype属性

这样的结果是因为, 类的继承是按照下面的模式实现的

```js
class A {}
class B {}
// B 的实例继承 A 的实例
Object.setPrototypeOf(B.prototype, A.prototype)
// B 继承 A 的静态属性
Object.setPrototypeOf(B, A)
```
`Object.setPrototypeOf`方法的实现

```js
Object.setPrototypeOf = function(obj, proto) {
 obj.__proto__ = proto
 return obj
}
```

因此, 就得到了上面的结果

```js
Object.setPrototypeOf(B.prototype, A.prototype)
// 等同于
B.prototype.__proto__ = A.prototype
Object.setPrototypeOf(B, A)
// 等同于
B.__proto__ = A
```

这两条继承链, 可以这样理解:
+ 作为一个对象, 子类(B)的原型(__proto__属性)是父类(A)
+ 作为一个构造函数, 子类(B)的原型(prototype属性)是父类的实例

参考文章[https://www.jb51.net/article/127101.htm](https://www.jb51.net/article/127101.htm)