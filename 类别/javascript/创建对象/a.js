function Person(name, age) {
  this.name = name
  this.age = age

  Person.prototype = {
    constructor: Person,
    sayname() {
      console.log(this.name)
    }
  }
}


const person = new Person('dz', 23)
const person1 = new Person('dz', 23)
try {
  person.sayname()
} catch (error) {
}
person1 .sayname()