# this 指向问题

JS中 `this` 的指向不同于其他语言，JS中的 `this` 不是指向定义他的位置，而是在哪调用它它就指向哪里。

JS中，普通的函数调用方式有三种：直接调用、方法调用和 `new` 调用。除此之外，还有一些特殊的调用方式，比如通过 `bind()` 将函数绑定到对象之后再进行调用、通过 `call()`、`apply() `进行调用等。而 `es6` 引入了箭头函数之后，箭头函数调用时，其 `this` 指向又有所不同。下面就来分析这些情况下的 `this` 指向。




## 一、 直接调用

首先来看直接调用，就是通过 函数名(...) 这种方式调用。这时候，函数内部的 `this` 指向全局对象，在浏览器中全局对象是 `window，在` `NodeJs` 中全局对象是 `global。`

```
    // 简单兼容浏览器和 NodeJs 的全局对象
    const _global = typeof window === "undefined" ? global : window;
    function test() {
        console.log(this === _global);    // true
    }
    test();    // 直接调用
```

>**注意**！！！直接调用并不是指在全局作用域下进行调用，在任何作用域下，直接通过 函数名(...) 来对函数进行调用的方式，都称为直接调用



### 1.1 bind() 对直接调用的影响

这种情况在 `react` 和 `ES6` 中经常会遇到，绑定事件其实类似于之前的 `var that = this`;

`Function.prototype.bind()` 的作用是将当前函数与指定的对象绑定，并返回一个新函数，这个新函数无论以什么样的方式调用，其 `this` 始终指向绑定的对象

```
    const obj = {};
    function test() {
        console.log(this === obj);
    }
    const testObj = test.bind(obj);
    test();     // false
    testObj();  // true
```

那么 可能有人会问 `bind` 做了什么，别着急  往下看


```
    const obj = {};
    function test() {
        console.log(this === obj);
    }
    // 自定义的函数，模拟 bind() 对 this 的影响
    function myBind(func, target) {
        return function () {
            return func.apply(target, arguments);
        };
    }
    const testObj = myBind(test, obj);
    test();     // false
    testObj();  // true
```

从上面的示例可以看到，首先，通过闭包，保持了 `target` ，即绑定的对象；然后在调用函数的时候，对原函数使用了 `apply` 方法来指定函数的 `this` 。当然原生的` bind()` 实现可能会不同，而且更高效。但这个示例说明了 `bind()` 的可行性。





### 1.2 call 和 apply 对 this 的影响

上面用到了 `Function.prototype.apply()`，与之类似的还有 `Function.prototype.call()`。它们的第一个参数都是指定函数运行时其中的 `this` 指向。

不过使用 `apply` 和 `call` 的时候仍然需要注意，如果目录函数本身是一个绑定了 `this` 对象的函数，那 `apply` 和 `call`  不会像预期那样执行，比如

```
const obj = {};
function test() {
    console.log(this === obj);
}
// 绑定到一个新对象，而不是 obj
const testObj = test.bind({});
test.apply(obj);    // true
// 期望 this 是 obj，即输出 true
// 但是因为 testObj 绑定了不是 obj 的对象，所以会输出 false
testObj.apply(obj); // false
```





## 二、方法调用

方法调用是指通过对象来调用其方法函数，它是对象方法、函数(...) 这样的调用形式。这种情况下，函数中的 `this` 指向调用该方法的对象。但是，同样需要注意 `bind()` 的影响。

```

// 第一种方式，定义对象的时候定义其方法
const obj = {
    test() {
        console.log(this === obj);
    }
};


// 第二种方式，对象定义好之后为其附加一个方法(函数表达式)
obj.test2 = function() {
    console.log(this === obj);
};



// 第三种方式和第二种方式原理相同
// 是对象定义好之后为其附加一个方法(函数定义)
function t() {
    console.log(this === obj);
}
obj.test3 = t;



// 这也是为对象附加一个方法函数
// 但是这个函数绑定了一个不是 obj 的其它对象
obj.test4 = (function() {
    console.log(this === obj);
}).bind({});

obj.test();     // true
obj.test2();    // true
obj.test3();    // true
// 受 bind() 影响，test4 中的 this 指向不是 obj
obj.test4();    // false
```
这里需要注意的是，后三种方式都是预定定义函数，再将其附加给 `obj` 对象作为其方法。再次强调，函数内部的 `this` 指向与定义无关，受调用方式的影响。


### 2.1 方法中 this 指向全局对象的情况

注意这里说的是方法中而不是方法调用中。方法中的 `this` 指向全局对象，如果不是因为 `bind()`，那就一定是因为不是用的方法调用方式，比如

```
const obj = {
    test() {
        console.log(this === obj);
    }
};
const t = obj.test;
t();    // false
```

t 就是 obj 的 test 方法，但是 t() 调用时，其中的 this 指向了全局。

之所以要特别提出这种情况，主要是因为常常将一个对象方法作为回调传递给某个函数之后，却发现运行结果与预期不符——因为忽略了调用方式对 this 的影响。







## 三、new 调用

在 es6 之前，每一个函数都可以当作是构造函数，通过 new 调用来产生新的对象(函数内无特定返回值的情况下)。而 es6 改变了这种状态，虽然 class 定义的类用 typeof 运算符得到的仍然是 "function"，但它不能像普通函数一样直接调用；同时，class 中定义的方法函数，也不能当作构造函数用 new 来调用。

而在 es5 中，用 new 调用一个构造函数，会创建一个新对象，而其中的 this 就指向这个新对象。这没有什么悬念，因为 new 本身就是设计来创建新对象的。

```
var data = "Hi";    // 全局变量
function AClass(data) {
    this.data = data;
}
var a = new AClass("Hello World");
console.log(a.data);    // Hello World
console.log(data);      // Hi
var b = new AClass("Hello World");
console.log(a === b);   // false
```




## 四、箭头函数中的 this

先来看看 MDN 上对箭头函数的说明


```
An arrow function expression has a shorter syntax than a function expression and does not bind its own this, arguments,super, or new.target. Arrow functions are always anonymous. These function expressions are best suited for non-method functions, and they cannot be used as constructors.
```
这里已经清楚了说明了，箭头函数没有自己的 this 绑定。箭头函数中使用的 this，其实是直接包含它的那个函数或函数表达式中的 this。比如

```
const obj = {
    test() {
        const arrow = () => {
            // 这里的 this 是 test() 中的 this，
            // 由 test() 的调用方式决定
            console.log(this === obj);
        };
        arrow();
    },
    getArrow() {
        return () => {
            // 这里的 this 是 getArrow() 中的 this，
            // 由 getArrow() 的调用方式决定
            console.log(this === obj);
        };
    }
};
obj.test();     // true
const arrow = obj.getArrow();
arrow();        // true
```

示例中的两个 this 都是由箭头函数的直接外层函数(方法)决定的，而方法函数中的 this 是由其调用方式决定的。上例的调用方式都是方法调用，所以 this 都指向方法调用的对象，即 obj。


diameter是普通函数，里面的this指向直接调用它的对象obj。perimeter是箭头函数，this应该指向上下文函数this的指向，这里上下文没有函数对象，就默认为window，而window里面没有radius这个属性，就返回为NaN。


```
const obj = {
  radius: 10,  
  diameter() {    
      return this.radius * 2
  },  
  perimeter: () => 2 * Math.PI * this.radius
}
console.log(obj.diameter())    // 20
console.log(obj.perimeter())    // NaN

```



## 五、example

```
    var x = 20;
    var b={
        x:10,
    }
    var a = {
        x: 15,
        fn: function () {
            var x = 30;
            return function () {
                return this.x
            }
        },
        test: function () {
            setTimeout(function () {
                console.log(this.x)
            }, 500);
        },
        test2: function () {
            setTimeout(() => {
                console.log(this.x)
            }, 500);
        },
    }
    console.log(a.fn());
    console.log((a.fn())());
    console.log(a.fn()());
    console.log(a.fn()() == (a.fn())());
    console.log(a.fn().call(this));
    console.log(a.test());
    console.log(a.test2());
```
**答案**

1. console.log(a.fn());
<br/>对象调用方法，返回了一个方法。
>function() {return this.x}

2. console.log((a.fn())());
<br/>a.fn()返回的是一个函数，()()这是自执行表达式。this -> window
>20

3.  console.log(a.fn()());
<br/>a.fn()相当于在全局定义了一个函数，然后再自己调用执行。this -> window
>20

4. console.log(a.fn()() == (a.fn())());
>true

5. console.log(a.fn().call(this));
<br/>这段代码在全局环境中执行，this -> window
>20

6. console.log(a.fn().call(a));
<br/>this -> a
>15

7. console.log(a.test());
<br/>this -> window
>20

8. console.log(a.test2());
<br/>this -> a
>15







