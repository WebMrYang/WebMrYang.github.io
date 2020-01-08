#  字符串方法

## 



## es6

### 1. String.raw()

ES6 还为原生的 String 对象，提供了一个raw()方法。该方法返回一个斜杠都被转义（`即斜杠前面再加一个斜杠`）的字符串，往往用于模板字符串的处理方法

```
String.raw`Hi\n${2+3}!`;
// 返回 "Hi\\n5!"

String.raw`Hi\u000A!`;
// 返回 "Hi\\u000A!"
```

`String.raw()`方法也可以作为正常的函数使用。这时，它的第一个参数，应该是一个具有raw属性的对象，且raw属性的值应该是一个数组。`

```
String.raw({ raw: 'test' }, 0, 1, 2);
// 't0e1s2t'

// 等同于
String.raw({ raw: ['t','e','s','t'] }, 0, 1, 2);
```

作为函数，`String.raw()`的代码实现基本如下。

```
String.raw1 = function (strings, ...values) {
    let raw = strings && strings.raw;
    let output = '';
    let index;
    if (raw == null || typeof raw !== 'object') {
        throw ('错误')
    }
    if (!raw instanceof Array) {
        return ''
    }
    for (index = 0; index < raw.length; index++) {
        output += raw[index] + '' + (values.length > index ? values[index] : '');
    }
    return output;
}
```


### 2. includes()

`includes()`：返回布尔值，表示是否找到了参数字符串
使用第二个参数n时，`includes`从第n个位置直到字符串结束

```
let s = 'Hello world!';
s.includes('o') // true
s.includes('Hello', 6) // false
```

### 3. startsWith()

`startsWith()`：返回布尔值，表示参数字符串是否在原字符串的头部
使用第二个参数n时，`startsWith`从第n个位置直到字符串结束

```
let s = 'Hello world!';
s.startsWith('Hello') // true
s.startsWith('world', 6) // true
```

### 4. endsWith()

`endsWith()`：返回布尔值，表示参数字符串是否在原字符串的尾部
使用第二个参数n时，`endsWith`针对前n个字符

```
let s = 'Hello world!';
s.endsWith('Hello') // false
s.endsWith('Hello', 5) // true
```

### 5. repeat()
`repeat`方法返回一个新字符串，表示将原字符串重复n次。
参数如果是正小数，会被取整,向下取正。
如果参数是 0 到-1 之间的小数或者是NaN等同于 0，当参数是小于-1或者Infinity时直接报错，当是字符串的时候转化为数字用的是Number()。


```
'x'.repeat(3) // "xxx"
'hello'.repeat(2) // "hellohello"
'na'.repeat(2.9) // "nana"
'na'.repeat('na') // ""

```


### 6. padStart()，padEnd()

ES2017 引入了字符串补全长度的功能。如果某个字符串不够指定长度，会在头部或尾部补全。padStart()用于头部补全，padEnd()用于尾部补全。
如果原字符串的长度，等于或大于最大长度，则字符串补全不生效，返回原字符串
如果用来补全的字符串与原字符串，两者的长度之和超过了最大长度，则会截去超出位数的补全字符串。
如果省略第二个参数，默认使用空格补全长度。



```
'x'.padStart(5, 'ab') // 'ababx'
'x'.padStart(4, 'ab') // 'abax'

'x'.padEnd(5, 'ab') // 'xabab'
'x'.padEnd(4, 'ab') // 'xaba'

'abc'.padStart(10, '0123456789')

'x'.padStart(4) // '   x'

```


### 7. padStart()，padEnd()
ES2019 对字符串实例新增了trimStart()和trimEnd()这两个方法。它们的行为与trim()一致，trimStart()消除字符串头部的空格，trimEnd()消除尾部的空格。它们返回的都是新字符串，不会修改原始字符串。

```
const s = '  abc  ';

s.trim() // "abc"
s.trimStart() // "abc  "
s.trimEnd() // "  abc"
```
上面代码中，trimStart()只消除头部的空格，保留尾部的空格。trimEnd()也是类似行为。

除了空格键，这两个方法对字符串头部（或尾部）的 tab 键、换行符等不可见的空白符号也有效。

浏览器还部署了额外的两个方法，trimLeft()是trimStart()的别名，trimRight()是trimEnd()的别名。


