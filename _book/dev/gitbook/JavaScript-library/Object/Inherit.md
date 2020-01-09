# js的继承


## 一、比较

面向对象的继承方式有很多种，原型链继承、借用构造函数继承、组合继承、原型式继承、寄生式继承、寄生式组合继承、深拷贝继承等等。


![](https://upload-images.jianshu.io/upload_images/8667801-c9aae36c9254c861.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)






## 二、方法



### 2.1 原型式继承

```
function createObjWithObj(obj){ // * 传入一个原型对象
    function Temp(){}
    Temp.prototype = obj
    let o = new Temp()
    return o
}
// * 把Person的原型对象当做temp的原型对象
let temp = createObjWithObj(Person.prototype)
// * 也可以使用Object.create实现
// * 把Person的原型对象当做temp2的原型对象
let temp2 = Object.create(Person.prototype)
```


本质上` createObjWithObj()` 对传入其中的对象执行了一次浅复制，将构造函数 F 的原型直接指向传入的对象。


**缺点**

1. 原型中引用类型值会被修改
2. 无法传递参数






### 2.2 寄生式继承

// 寄生式继承

// 我们在原型式的基础上，希望给这个对象新增一些属性方法

// 那么我们在原型式的基础上扩展


```
function createNewObjWithObj(obj) {
    let o = createObjWithObj(obj)
    o.name = "邵威儒"
    o.age = 28
    return o
}
```

函数的主要作用是为构造函数新增属性和方法，以增强函数。

**缺点（同原型式继承）：**

1. 原型中引用类型值会被修改
2. 无法传递参数





### 3.3 借助构造函数继承

通过这样的方式，会有一个问题，原型对象类似一个共享库，所有实例共享原型对象同一个属性方法，如果原型对象上有引用类型，那么会被所有实例共享，也就是某个实例更改了，则会影响其他实例，我们可以看一下

```
function Person(name,pets){ // * 父构造函数接收name，pets参数
    this.name = name // * 赋值到this上
    this.pets = pets // * 赋值到this上
}
Person.prototype.eat = function(){
    console.log('吃饭')
}
function Student(num,name,pets){ // * 在子构造函数中也接收参数
    Person.call(this,name,pets) // * 在这里把name和pets传参数
    this.num = num // * 赋值到this上
}
let student = new Student("030578000","邵威儒",["旺财","小黄"])
```








### 2.4 原型链继承

利用原型链的特性，当在自身找不到时，会沿着原型链往上找。


```
function Person(){
    this.name = '邵威儒'
    this.pets = ['旺财','小黄']
}
Person.prototype.eat = function(){
    console.log('吃饭')
}
function Student(){
    this.num = "030578000"
}
// * new一个Person的实例，同时拥有其实例属性方法和原型属性方法
let p = new Person()
// * 把Student的原型对象指向实例p
Student.prototype = p
// * 把Student的原型对象的constructor指向Student，解决类型判断问题
Student.prototype.constructor = Student
let student = new Student()
console.log(student.num) // '030578000'
console.log(student.name) // * '邵威儒'
console.log(student.pets) // * '[ '旺财', '小黄' ]'
student.eat() // '吃饭'
```


此时关系图为

![](https://upload-images.jianshu.io/upload_images/8667801-b4fccd03ea45270a.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)





### 2.5 组合继承

利用构造继承和原型链组合

```
function Person(name,pets){ // * 父构造函数接收name，pets参数
    this.name = name // * 赋值到this上
    this.pets = pets // * 赋值到this上
}
Person.prototype.eat = function(){
    console.log('吃饭')
}
function Student(num,name,pets){ // * 在子构造函数中也接收参数
    Person.call(this,name,pets) // * 在这里把name和pets传参数
    this.num = num // * 赋值到this上
}
let p = new Person()
Student.prototype = p
Student.prototype.constructor = Student
let student = new Student("030578000","邵威儒",["旺财","小黄"])
let student2 = new Student("030578001","iamswr",["小红"])
console.log(student.num) // '030578000'
console.log(student.name) // '邵威儒'
console.log(student.pets) // '[ '旺财', '小黄' ]'
student.eat() // '吃饭'
student.pets.push('小红')
console.log(student.pets) // * [ '旺财', '小黄', '小红' ]
console.log(student2.pets) // * [ '小红' ]
```

![](https://upload-images.jianshu.io/upload_images/8667801-cd32123f1d1c1384.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

这样我们就可以在子构造函数中给父构造函数传参了，而且我们也发现上图中，2个红圈的地方，代码是重复了，那么接下来我们怎么解决呢？

能否在子构造函数设置原型对象的时候，只要父构造函数的原型对象属性方法呢？

当然是可以的，接下来我们讲寄生式组合继承，也是目前程序猿认为解决继承问题最好的方案






### 2.6 寄生式组合继承

```
function Person(name,pets){
    this.name = name
    this.pets = pets
}
Person.prototype.eat = function(){
    console.log('吃饭')
}
function Student(num,name,pets){
    Person.call(this,name,pets)
    this.num = num
}
// * 寄生式继承
function Temp(){} // * 声明一个空的构造函数，用于桥梁作用
Temp.prototype = Person.prototype // * 把Temp构造函数的原型对象指向Person的原型对象
let temp = new Temp() // * 用构造函数Temp实例化一个实例temp
Student.prototype = temp // * 把子构造函数的原型对象指向temp
temp.constructor = Student // * 把temp的constructor指向Student或者改成Student.prototype.constructor =Student
let student1 = new Student('030578001','邵威儒',['旺财','小黄'])
console.log(student1) // Student { name: '邵威儒', pets: [ '旺财', '小黄' ],num: '030578001' }
let student2 = new Student('030578002','iamswr',['小红'])
console.log(student2) // Student { name: 'iamswr', pets: [ '小红' ],num: '030578002' }
```

至此为止，我们就完成了寄生式组合继承了，主要逻辑就是用一个空的构造函数，来当做桥梁，并且把其原型对象指向父构造函数的原型对象，并且实例化一个temp，temp会沿着这个原型链，去找到父构造函数的原型对象

![](https://upload-images.jianshu.io/upload_images/8667801-653e4f7030928337.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)


### 2.7 Class继承

Class 可以通过 extends 关键字实现继承，这比 ES5 的通过修改原型链实现继承，要清晰和方便很多。

```
class staff { 
  constructor(){
    this.company = "ABC";	
    this.test = [1,2,3];
  }
  companyName(){
    return this.company; 
  }
}
class employee extends staff {
  constructor(name,profession){
    super();
    this.employeeName = name;
    this.profession = profession;
  }
}

// 将父类原型指向子类
let instanceOne = new employee("Andy", "A");
let instanceTwo = new employee("Rose", "B");
instanceOne.test.push(4);
// 测试 
console.log(instanceTwo.test);    // [1,2,3]
console.log(instanceOne.companyName()); // ABC
// 通过 Object.getPrototypeOf() 方法可以用来从子类上获取父类
console.log(Object.getPrototypeOf(employee) === staff)
// 通过 hasOwnProperty() 方法来确定自身属性与其原型属性
console.log(instanceOne.hasOwnProperty('test'))          // true
// 通过 isPrototypeOf() 方法来确定原型和实例的关系
console.log(staff.prototype.isPrototypeOf(instanceOne));    // true

```
super 关键字，它在这里表示父类的构造函数，用来新建父类的 this 对象。

1. 子类必须在 `constructor` 方法中调用 `super` 方法，否则新建实例时会报错。这是因为子类没有自己的 `this` 对象，而是继承父类的 `this` 对象，然后对其进行加工。
2. 只有调用 `super` 之后，才可以使用 `this` 关键字，否则会报错。这是因为子类实例的构建，是基于对父类实例加工，只有 super 方法才能返回父类实例。

`super` 虽然代表了父类 `A` 的构造函数，但是返回的是子类 `B` 的实例，即` super` 内部的 `this ` 指的是 `B`，因此 `super()` 在这里相当于 `A.prototype.constructor.call(this)`

*ES5 和 ES6 实现继承的区别*
1. `ES5` 的继承，实质是先创造子类的实例对象 `this` ，然后再将父类的方法添加到 `this` 上面（`Parent.apply(this)`）。
2. `ES6` 的继承机制完全不同，实质是先创造父类的实例对象 `this` （所以必须先调用 `super()` 方法），然后再用子类的构造函数修改 this。





### 2.8 深拷贝继承

// 方法一：利用JSON.stringify和JSON.parse

// 这种方式进行深拷贝，只针对json数据这样的键值对有效

// 对于函数等等反而无效，不好用，接着继续看方法二、三。

// 方法二：

```
function deepCopy(fromObj,toObj) { // 深拷贝函数

  // 容错
  if(fromObj === null) return null // 当fromObj为null
  if(fromObj instanceof RegExp) return new RegExp(fromObj) // 当fromObj为正则
  if(fromObj instanceof Date) return new Date(fromObj) // 当fromObj为Date
  toObj = toObj || {}
  for(let key in fromObj){ // 遍历
    if(typeof fromObj[key] !== 'object'){ // 是否为对象
      toObj[key] = fromObj[key] // 如果为原始数据类型，则直接赋值
    }else{
      toObj[key] = new fromObj[key].constructor // 如果为object，则new这个object指向的构造函数
      deepCopy(fromObj[key],toObj[key]) // 递归
    }
  }
  return toObj
}
let dog = {
  name:"小白",
  sex:"公",
  firends:[
    {
      name:"小黄",
      sex:"母"
    }
  ]
}
let dogcopy = deepCopy(dog)
// 此时我们把dog的属性进行修改
dog.firends[0].sex = '公'
console.log(dog) // { name: '小白', sex: '公', firends: [ { name: '小黄', sex: '公' }] }
// 当我们打印dogcopy，会发现dogcopy不会受dog的影响
console.log(dogcopy) // { name: '小白',sex: '公',firends: [ { name: '小黄', sex: '母' } ] }
```
