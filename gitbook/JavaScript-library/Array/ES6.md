## ES6


### 1. copyWithin()

数组实例的 `copyWithin()` 方法，在当前数组内部，将指定位置的成员复制到其他位置（会覆盖原有成员），然后返回当前数组。也就是说，使用这个方法，*会修改当前数组*。

```
Array.prototype.copyWithin(target, start = 0, end = this.length)
```

它接受三个参数。

* target（必需）：从该位置开始替换数据。如果为负值，表示倒数。
* start（可选）：从该位置开始读取数据，默认为 0。如果为负值，表示从末尾开始计算。
* end（可选）：到该位置前停止读取数据，默认等于数组长度。如果为负值，表示从末尾开始计算。

这三个参数都应该是数值，如果不是，会自动转为数值。


```
// 将3号位复制到0号位
[1, 2, 3, 4, 5].copyWithin(0, 3, 4)
// [4, 2, 3, 4, 5]

// -2相当于3号位，-1相当于4号位
[1, 2, 3, 4, 5].copyWithin(0, -2, -1)
// [4, 2, 3, 4, 5]
```





### 2. find() 和 findIndex()

数组实例的 `find` 方法，用于找出*第一个*符合条件的数组成员。它的参数是一个回调函数，所有数组成员依次执行该回调函数，直到找出第一个返回值为true的成员，然后返回该成员。如果没有符合条件的成员，则返回 `undefined` 。

```
1, 4, -5, 10].find((n) => n < 0)
// -5
```

数组实例的 `findIndex` 方法的用法与 `find` 方法非常类似，返回第一个符合条件的数组成员的位置，如果所有成员都不符合条件，则返回`-1`。

```
[1, 5, 10, 15].findIndex(function(value, index, arr) {
  return value > 9;
}) 
```
* 这两个方法都可以发现NaN，弥补了数组的indexOf方法的不足。
* 这两个方法都可以接受第二个参数，用来绑定回调函数的this对象。


```
[NaN].indexOf(NaN)
// -1
[NaN].findIndex(y => Object.is(NaN, y))
// 0
// indexOf方法无法识别数组的NaN成员，但是findIndex方法可以借助Object.is方法做到。

function f(v){
  return v > this.age;
}
let person = {name: 'John', age: 20};
[10, 12, 26, 15].find(f, person); 
```






### 3. fill

`fill` 方法使用给定值，填充一个数组。

```
['a', 'b', 'c'].fill(7)
// [7, 7, 7]

new Array(3).fill(7)
// [7, 7, 7]
```

* `fill` 方法还可以接受第二个和第三个参数，用于指定填充的起始位置和结束位置。

```
['a', 'b', 'c'].fill(7, 1, 2)
// ['a', 7, 'c']

```


* 注意，如果填充的类型为对象，那么被赋值的是同一个内存地址的对象，而**不是深拷贝对象**。







### 4. entries()，keys() 和 values()

`keys()` 是对键名的遍历、`values()` 是对键值的遍历，`entries()` 是对键值对的遍历。

```
for (let index of ['a', 'b'].keys()) {
  console.log(index);
}
// 0
// 1

for (let elem of ['a', 'b'].values()) {
  console.log(elem);
}
// 'a'
// 'b'

for (let [index, elem] of ['a', 'b'].entries()) {
  console.log(index, elem);
}
// 0 "a"
// 1 "b"
```



### 5. includes()

`Array.prototype.includes` 方法返回一个布尔值，表示某个数组是否包含给定的值，与字符串的 `includes` 方法类似。`ES2016`  引入了该方法

```
[1, 2, 3].includes(2)     // true
[1, 2, 3].includes(4)     // false
[1, 2, NaN].includes(NaN) // true
```

* 该方法的第二个参数表示搜索的起始位置，默认为0。如果第二个参数为负数，则表示倒数的位置，如果这时它大于数组长度（比如第二个参数为-4，但数组长度为3），则会重置为从0开始。

```
[1, 2, 3].includes(3, 3);  // false
[1, 2, 3].includes(3, -1); // true
```






### 6. flatMap()

`flatMap()` 方法对原数组的每个成员执行一个函数（相当于执行 `Array.prototype.map()` ），然后对返回值组成的数组执行 `flat()` 方法。该方法返回一个**新数组，不改变原数组,只能展开一层数组**。

* flatMap()方法还可以有第二个参数，用来绑定遍历函数里面的this。


```
// 相当于 [[2, 4], [3, 6], [4, 8]].flat()
[2, 3, 4].flatMap((x) => [x, x * 2])
// [2, 4, 3, 6, 4, 8]
```



### 7. ES6中for…of与for…in的区别




1. for…of循环可以代替数组实例的forEach方法，不同于forEach方法，它可以与break、continue和return配合使用。 
2. for…in循环主要是为遍历对象而设计的，不适用于遍历数组。 
3. JavaScript 原有的for…in循环，只能获得对象的键名，不能直接获取键值。ES6 提供for…of循环，允许遍历获得键值。 
4. for…of循环调用遍历器接口，数组的遍历器接口只返回具有数字索引的属性。这一点跟for…in循环也不一样。 
5. 对于普通的对象，for…of结构不能直接使用，会报错，必须部署了 Iterator 接口后才能使用。但是，这样情况下，for…in循环依然可以用来遍历键名。对于字符串来说，for…of循环还有一个特点，就是会正确识别 32 位 UTF-16 字符。for…of循环可用于字符串、DOM NodeList 对象、arguments对象。 
6. 并不是所有类似数组的对象都具有 Iterator 接口，一个简便的解决方法，就是使用Array.from方法将其转为数组。 
7. 对于普通的对象，for…in循环可以遍历键名，for…of循环会报错。 
8. 一种解决方法是，使用Object.keys方法将对象的键名生成一个数组，然后遍历这个数组。 
9. 另一个方法是使用 Generator 函数将对象重新包装一下。



