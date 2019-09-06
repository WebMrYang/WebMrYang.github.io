







### 1. [扁平化处理](./Flat.md)

### 2. [类数组转化成数组](./ConVersion.md)

### 3. [将一组值，转换为数组](./StringToArr.md)


### 4. [ES6](./ES6.md)

1. copyWithin()
2. find() 和 findIndex()
3. fill
4. entries()，keys() 和 values()
5. includes()
6. flatMap()



### 空位

数组的空位指，数组的某一个位置没有任何值。比如，`Array` 构造函数返回的数组都是空位,空位不是 `undefined` 。

```
Array(3) // [, , ,]

```
* `forEach()`, `filter()`, `reduce()`, `every()` 和`some()`都会跳过空位。
* `map()`会跳过空位，但会保留这个值
* `join()`和`toString()`会将空位视为`undefined`，而`undefined`和`null`会被处理成空字符串。
* `Array.from` 方法会将数组的空位，转为 `undefined` ，也就是说，这个方法不会忽略空位。
* 扩展运算符（...）也会将空位转为 `undefined` 。
* `entries()`、`keys()`、`values()`、`find()`和`findIndex()`会将空位处理成`undefined`。
* `for...of` 循环也会遍历空位。
* `fill()` 会将空位视为正常的数组位置。
* `copyWithin()`会连空位一起拷贝。




