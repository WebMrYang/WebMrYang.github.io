# 将一组值，转换为数组


1. ES5 `Array()`
2. ES6 `Array.of()`


`Array.of` 主要目的，是弥补数组构造函数 `Array()` 的不足。因为参数个数的不同，会导致 `Array()` 的行为有差异


```
Array() // []
Array(undefined) // [undefined]
Array(3) // [, , ,]
Array(3, 11, 8) // [3, 11, 8]

Array.of() // []
Array.of(undefined) // [undefined]
Array.of(3) // [3]
Array.of(3, 11, 8) // [3,11,8]

```

`Array` 方法没有参数、一个参数、三个参数时，返回结果都不一样。只有当参数个数不少于 2 个时，`Array()` 才会返回由参数组成的新数组。参数个数只有一个时，实际上是指定数组的长度。`

`Array.of` 方法可以用下面的代码模拟实现。

```
function ArrayOf(){
  return [].slice.call(arguments);
}
```


