> `JavaScript` 的设计是一个简单的 `基于对象` 的范式. **一个对象就是一系列属性的集合**, 一个属性包含一个名和一个值. 一个属性的值可以是函数, 这种情况下属性也被称为方法

> 万物皆对象, 对象表示拥有一些列属性和方法的集合
这些集合内容描述某一类或单一事物的特征, 以及功能或者作用(自己的理解..)

## ES5 创建对象

### 直接对象字面量

```js
const obj = {
  name: 'dz',
  age: 23
}
```

这种方式死板, 灵活度不高, 每次都需要手动创建, 冗余度也很大, 适用于临时对象变量或者局部属性少的对象

### 使用内置构造函数

```js
const obj = new Object()
obj.name = name
obj.age = age
```

只能创建一次对象, 复用性较差, 容易创建多个相同内容的对象, 造成代码冗余


### 工厂模式

```js
function Person(name, age) {
  const obj = {}
  obj.name = name
  obj.age = age
  return obj
}

const person = Person('dz', 23)
const person1 = Person('dz1', 24)
console.log(person instanceof Person) // -> false
console.log(person1.__proto__ == person.__proto_) // -> false
```

对象无法识别(不能识别是被哪一个工厂函数创造的), 相同工厂产出的实例的原型 `不是同一个`

```js
function Person(name, age) {
  this.name = name
  this.age  = age
  this.sayname = () => {
    console.log(this.name)
  }
}

const p1 = new Person('dz', 23)
const p2 = new Person('dz1', 24)
console.log(p1 instanceof Person, p2 instanceof Person)// --> true true
```

构造函数简化了工厂模式的操作过程, 并且通过实例化对象, 可以知道该对象的标识, 能识别是被哪一个 `构造函数` 创造的, 使用`instanceof` 来判断是否属于某个构造函数的实例

但是, 构造函数内部存在方法, `方法就是对象`, 就意味着每次创建对象(实例)的时候就会重新创建方法, 重复的创建方法开辟了新的内存来储存

(js高程)使用构造函数主要问题就是每个方法都要在每个实例上重新创建一遍, 每个方法作用和使用方法一样, 根本不用重复创建Function实例. 况且有this对象在, 不用在执行代码前就把函数绑定到特定的对象上面.

(js高程)可以将函数定义到 `构造函数外部` 解决问题. 这样虽然解决了重复做同一件事的问题, 但是这让一个在全局作用域的方法只能被特定的对象调用就有点让全局作用域名不其实.

### 原型模式

```js
function Person(name, age) {
  Person.prototype.name = name
  Person.prototype.age  = age
  Person.prototype.likes  = ['apple', 'banana', 'watermelon']
  Person.prototype.sayname = () => {
    console.log(this.name)
  }
}
const p1 = new Person('dz', 23)
const p2 = new Person('dz1', 24)

p1.likes.pop() // -> 删除 watermelon
console.log(p1.name == p2.name) // -> true,  p2的属性覆盖了p1的属性
console.log(p1.likes) // -> ['apple', 'banana']
console.log(p2.likes) // -> ['apple', 'banana']
```

创建对象之后将构造函数 `原型` 上添加属性和方法, 这样的好处就是每一个实例都共享以同一个方法, 避免了重复创建相同的方法, 但是有一个大问题就是, 大家都是共享的, 因此每一个实例都可能更改这个原型里面的属性, 后面创建的对象包含的属性会覆盖上次一创建的对象的属性

(js高程)不必在构造函数中定义对象实例的信息, 而是可以将这些信息直接添加到原型对象中, 可以是一般实例都需要属于自己的全部属性, 甚少有人但单独使用原型模式

### 组合模式(构造函数模式+原型模式)

```js
function Person(name, age) {
  this.name = name
  this.age  = age
}

Person.protoytype.sayname = () => {
  console.log(this.name)
}

const p1 = new Person('dz', 23)
const p2 = new Person('dz1', 24)
console.log(p1.name, p2.name)// dz dz1
```

这种方式结合两者的有点, 每个实例拥有自己的属性和方法, 以及共享相同的方法, 用的较多一种模式

### 动态原型模式

```js
function Person(name, age) {
  this.name = name
  this.age  = age
  if(typeof this.sayname != 'function') {
    Person.protoytype.sayname = () => {
      console.log(this.name)
    }
  }
}
const p1 = new Person('dz', 23)
console.log(p1.sayname) // -> dz
```

这里只在`sayname` 方法不存在的情况下才添加到原型中, 只会在`初次调用` 构造函数时才会执行.

这样的代码, 使得每个对象的name、age、sex都是`各自的`(不共有), 然后函数写在原型上, 就又是共享的.

**注意:** 使用动态原型模式时, `不能` 使用 
`对象字面量重写原型`. 如果在已经创建了实例的情况下重写原型, 那么就会切断现有实例与新原型之间的联系.

举个栗子:

```javascript
function WPerson(name, age, sex) {
  this.name = name;
  this.age = age;
  this.sex = sex;
  if (typeof this.sayName != "function") {
    WPerson.prototype = {   //这里进行了原型的重写
      constructor: WPerson,
      sayName: function () {
        console.log(this.name);
      }
    }
  }
}
var per1 = new WPerson("q", 18, "man");
var per2 = new WPerson("q", 18, "man");
per1.sayName();  //报错, 说没有sayName这个方法
per2.sayName();  //输出q
console.log(per1.name);  //输出q
```

先来搞清楚 `new` 一个实例时发生的过程:

1. 通过`new`实例化一个对象, 构造函数内部创建一个新的空对象
2. 将构造函数的作用域赋给新对象, this指向了新对象, 也就是继承了函数的原型, 拥有了`__proto__`属性
3. 执行代码, 通过this将属性和方法添加到这个对象
4. 隐式返回`return`这个对象

报错原因是: 当执行上面过程 `2` 时对象拥有了`__proto__`属性的时候, 原型还没有被`重写`, 如下面代码 `①` 处, 指向的原型还没有`sayname`方法, 而`per2`这时候创建对象的原型已经是被覆盖的了, 因此有 `sayname` 方法

```js
function WPerson(name, age, sex) {
  this.name = name;
  this.age = age;
  this.sex = sex;
  console.log(this.__proto__) // ① --> {constructor: ƒ}
  if (typeof this.sayName != "function") {
    WPerson.prototype = {   //这里进行了原型的重写
      constructor: WPerson,
      sayName: function () {
        console.log(this.name);
      }
    }
  }
  console.log(WPerson.prototype) // 2. {constructor: ƒ, sayName: ƒ}
}
var per1 = new WPerson("q", 18, "man");
var per2 = new WPerson("q", 18, "man");
per1.sayName();  //报错, 说没有sayName这个方法
per2.sayName();  //输出q
```

### 寄生构造函数

这种模式的基本思想是创建一个函数, 该函数的作用仅仅是封装创建对象的代码, 然后再返回新创建的对象；但从表面上看, 这个函数又很像是典型的构造函数. 

```js
function SpecialArray(){
  var array = new Array();
  array.push.apply(array,arguments);
  array.toPipedString = function(){
      return this.join("|");
  };
  return array;
}
var colors = new SpecialArray("red","green","pink");
alert(colors.toPipedString());// red|green|pink
alert(colors instanceof SpecialArray); // false 
```

我们知道, 当我们自定义一个构造函数后, 使用 `new` 的方式来创建一个对象时, 默认会返回一个 `新对象` 实例, 构造函数中是没有return语句的. 而这里所谓的寄生构造函数, 基本思想是创建一个函数, 这个函数的作用仅仅是为了某一个`特定的功能`而添加一些代码, 最后再将这个对象返回.

除了使用了new操作符并把包装的函数叫做构造函数外, 这个模式跟工厂模式没有任何区别.

另外, 这个 `SpecialArray()` 返回的对象, 与 `SpecialArray()构造函数` 或者与 `构造函数的原型对象` 之间没有任何关系, 就像你在SpecialArray()外面创建的其他对象一样, 所以如果用 `instanceof` 操作符来检测的话, 结果只能是 `false` 咯. 所以这是它的问题

### 稳妥构造函数模式

先说稳妥二字, 别人定义了一个稳妥对象, 即没有公共属性, 而且其方法也 `不引用this对象`, 这种模式适应于一些安全环境中(禁止使用this和new), 或防止数据被其他应用程序改动, 像下面这样：

```js
function Person(name,age,gender){
  var obj = new Object();
  obj.sayName = function(){
      alert(name);
  };
  return obj;
}
var person = Person("Stan",0000,"male"); // 这里没有使用new操作符
person.sayName(); // Stan
alert(person instanceof Person); // false
```

这里 `person` 中保存了一个稳妥对象, 除了调用`sayName()`方法外, 没有别的方式可以访问其数据成员. 
即使有其他代码会给这个对象添加方法或属性, 但也不可能有别的办法访问传入到构造函数中的原始数据 . 同样与寄生函数模式类似, 使用稳妥构造函数模式创建的对象与构造函数之间也没有任何关系.

## ES6 创建对象

### class

```js
class Person {
  constructor(name, age) { // constructor构造函数
    this.name = name
    this.age  = age
  }

  sayname() { //原型上的
    console.log(this.name)
  }
  static sayAge() {
    console.log(this.age)
  }
}

const per = new Person('dz', 23)
per.sayname() // -> dz
Person.sayAge() // 23
```

`constructor`是构造方法,类似构造函数, 定义这个方法里面的内容都是实例自身的属性和方法, 不会被其他实例共享, 而写在外面的`sayname`表示原型上的方法, 是会被`共享`的.

 `static` 表示静态，加了static的函数`不会`挂载到`prototype` 上,而是挂载到 `class类` 上, 类似于:

 ```javascript
 Promise.resolve(...)
 Math.max(...)
 ```