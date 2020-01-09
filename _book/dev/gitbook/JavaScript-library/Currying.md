## 一、通用版

```
    function curry(fn) {

        var args = Array.prototype.slice.call(arguments, 1);

        return function () {

            var newArgs = args.concat(Array.prototype.slice.call(arguments));

            return fn.apply(this, newArgs);

        }

    }
```
执行：
```
    function multiFn(a, b, c) {

        return a * b * c;

    }
    var multi = curry(multiFn);

    multi(2, 3, 4);
```




## 二、改进版

就题目而言，是需要执行三次函数调用，那么针对柯里化后的函数，如果传入的参数没有 3 个的话，就继续执行 curry 函数接收参数，如果参数达到 3 个，就执行柯里化了的函数。

```
    function curry(fn, args) {

        var length = fn.length;

        var args = args || [];

        return function () {

            newArgs = args.concat(Array.prototype.slice.call(arguments));

            if (newArgs.length < length) {

                return curry.call(this, fn, newArgs);

            } else {

                return fn.apply(this, newArgs);

            }

        }

    }

    function multiFn(a, b, c) {

        return a * b * c;

    }

    var multi = curry(multiFn);

    multi(2)(3)(4);

    multi(2, 3, 4);

    multi(2)(3, 4);

    multi(2, 3)(4);



```







## 三、优化版



```
    function multi() {

        var args = Array.prototype.slice.call(arguments);

        var fn = function () {

            var newArgs = args.concat(Array.prototype.slice.call(arguments));

            return multi.apply(this, newArgs);

        }

        fn.toString = function () {

            return args.reduce(function (a, b) {

                return a * b;

            })

        }

        return fn;

    }
```

最后这个其实是利用了toString()函数的返回值为String类型。返回当前对象的字符串形式。