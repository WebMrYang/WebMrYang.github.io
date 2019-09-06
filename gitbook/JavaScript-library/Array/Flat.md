#  数组扁平化


## 1.原生flat方法

```
function flat(arr) {
  return arr.flat(Infinity);
}
```



## 2.循环

```
function flat(arr) {
  const stack = [...arr];
  const res = [];
  while (stack.length) {
    const first = stack.shift();
    if (Array.isArray(first)) {
      stack.unshift(...first);
    } else {
      res.push(first);
    }
  }
  return res;
}
```

## 3.正则处理

```
let ary = [1, [2, [3, [4, 5]]], 6];
function flat(arr){
    let str = JSON.stringify(arr);
    return str.replace(/\[|\]/g, '').split(',');
}

```



## 4.reduce实现

```
function flat(arr) {
  if (!Array.isArray(arr)) return arr;
  return arr.reduce((prev, val) => {
    return prev.concat(flat(val));
  }, []);
}
```

