## npm插件用途

### 1. rimraf   

`rimraf` 包的作用：以包的形式包装 `rm -rf` 命令，用来删除文件和文件夹的，不管文件夹是否为空，都可删除.


```
//使用1
const rimraf = require('rimraf');
rimraf('./test.txt', function (err) { // 删除当前目录下的 test.txt
  console.log(err);
});

//使用2
// package.json:
...
"scripts": {
    ...
    "clear":  rimraf dist && node build/build.js"
  },
...
```


### 2. fast-deep-equal

深度便利是否相等

```
var equal = require('fast-deep-equal');
console.log(equal({foo: 'bar'}, {foo: 'bar'})); // true
```


### 3. size-sensor

`DOM` 元素尺寸监听器，当元素尺寸变化的时候，将会触发回调函数！

```
import { bind, clear } from 'size-sensor';
 
// bind the event on element, will get the `unbind` function
const ele=document.querySelector('.container');
const unbind1 = bind(ele, element => {
  // do what you want to to.
});
unbind1();
clear(ele);

```

