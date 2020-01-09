# 类数组转化成数组



*   ES5 `[].slice.call()`
*   ES6 `Array.from`

* Array.from方法用于将两类对象转为真正的数组：类似数组的对象（array-like object）和可遍历（iterable）的对象（包括 ES6 新增的数据结构 Set 和 Map）

```
let arrayLike = {
    '0': 'a',
    '1': 'b',
    '2': 'c',
    length: 3
};

// ES5的写法
var arr1 = [].slice.call(arrayLike); // ['a', 'b', 'c']

// ES6的写法
let arr2 = Array.from(arrayLike); // ['a

```


* `Array.from`还可以接受第二个参数，作用类似于数组的`map`方法，用来对每个元素进行处理，将处理后的值放入返回的数组。


```
Array.from(arrayLike, x => x * x);
// 等同于
Array.from(arrayLike).map(x => x * x);

Array.from([1, 2, 3], (x) => x * x)

//下面的例子将数组中布尔值为false的成员转为0。

Array.from([1, , 2, , 3], (n) => n || 0)

//如果map函数里面用到了this关键字，还可以传入Array.from的第三个参数，用来绑定this。
Array.from([1, , 2, , 3],function(n) {return n || this.a},{a:2} )

```


* `Array.from()`的另一个应用是，将字符串转为数组，然后返回字符串的长度。因为它能正确处理各种 `Unicode` 字符，可以避免 `JavaScript` 将大于\uFFFF的 `Unicode` 字符，算作两个字符的 bug。