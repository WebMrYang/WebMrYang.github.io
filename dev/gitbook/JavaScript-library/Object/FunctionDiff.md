## 函数声明和函数表达式区别


```
//函数声明
function a(){
    console.log(1);
}

//函数表达式
var a=function (){
    console.log(1)
}
```

1. 函数声明可以使函数的调用在函数之前使用， 函数表达式必须在编译器读取完函数表达式后才能调用函数(是在运行时进行赋值)
2. 由于函数声明变量会提升，在函数表达式运行后，调用方法是函数表达式

```

var sayHello;
console.log(typeof(sayHey)); //=>function    
console.log(typeof(sayHo)); //=>undefined
 
    function sayHey() {
        console.log("sayHey");
    }
    sayHello = function sayHo() {
        console.log("sayHello");
    }
 
    function sayHey() {
        console.log("sayHey2");
    }
    sayHello = function sayHo() {
        console.log("sayHello2");
    }
 
sayHey(); // => sayHey2    
sayHello(); // => sayHello2
```
分析：sayHey是用函数声明创建的，在JS解析时JS编译器将函数定义进行了函数提升，也就是说，在解析JS代码的时候，JS编译器（条件判断不形成新的作用域，两个sayHey函数定义都被提升到条件判断之外）检测到作用域内有两个同名的sayHey定义，第一个定义先被提升，第二个定义接着被提升（第二个定义在第一个定义之下），
第二个定义覆盖了第一个sayHey定义，所以sayHey（）输出sayHey2；而sayHello是用函数表达式创建的，其表达式的内容是在JS运行时（不是解析时）才能确定（这里条件判断就起到作用了），
所以sayHello表达式执行了第一个函数定义并赋值，则sayHello（）输出sayHello2。