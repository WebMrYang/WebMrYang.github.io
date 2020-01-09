## 一、bind、apply与call三者区别


在JS中，这三者都是用来改变函数的this对象的指向的，他们有什么样的区别呢。

在说区别之前还是先总结一下三者的相似之处：

1. 都是用来改变函数的this对象的指向的。

2. 第一个参数都是this要指向的对象。

3. 都可以利用后续参数传参。

那么他们的区别在哪里的，先看一个例子。

```
    var xw = {

        name: "小王",

        gender: "男",

        age: 24,

        say: function () {

            alert(this.name + " , " + this.gender + " ,今年" + this.age);

        }

    }

    var xh = {

        name: "小红",

        gender: "女",

        age: 18

    }

    xw.say();
```

那么如何用xw的 `say` 方法来显示xh的数据呢。

**对于call可以这样：**

```
xw.say.call(xh);
```


**对于apply可以这样：**

```
xw.say.apply(xh);
```


**而对于bind来说需要这样：**

```
xw.say.bind(xh)();
```



>总之：`bind` 与 `apply` 、 `call` 最大的区别就是： `bind` 不会立即调用，其他两个会立即调用， `apply` 与 `call` 的区别是 `apply` 第二个是参数组，但是在确定的参数下，还是最好用 `call` ， `call` 的效果会更高，但是在函数的延展性上使用 `apply` 更好






## 二、手写方法

### 2.1 手写一个call方法


考虑两点

* 1. 第一个参数为undefined或null的时候，那么会转变为window

* 2. 改变了this执行，让新的对象可以执行该函数。

```
    Function.prototype.myCall = function (context) {

        // 判断是否是undefined和null

        if (typeof context === 'undefined' || context === null) {

            context = window

        }

        context.fn = this

        let args = [...arguments].slice(1)

        let result = context.fn(...args)

        delete context.fn

        return result

    }
```




### 2.2 apply


```
    Function.prototype.myApply = function (context) {

        if (typeof context === 'undefined' || context === null) {

            context = window

        }

        context.fn = this

        let args = arguments[1]

        let result

        if (args) {

            result = context.fn(...args)

        } else {

            result = context.fn()

        }

        delete context.fn

        return result

    }

```

### 2.3 bind实现


这里需要注意下，因为 `bind` 转换后的函数可以作为构造函数使用，此时 `this` 应该指向构造出的实例，而 `bind` 函数绑定的第一个参数。

```
    Function.prototype.myBind = function (context) {

        if (typeof this !== 'function') {

            throw new TypeError('Error')

        }

        let _this = this

        let args = [...arguments].slice(1)

        return function F() {

            // 判断是否被当做构造函数使用

            if (this instanceof F) {

                return _this.apply(this, args.concat([...arguments]))

            }

            return _this.apply(context, args.concat([...arguments]))

        }

    }

```