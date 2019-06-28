# 方法

正则的方法包括正则的方法、js使用正则的方法




## 1. 正则的方法 

### 1.1 test方法

该方法用来测试某个字符串是否与正则匹配，匹配就返回true，否则返回false。该方法接受一个字符串作为参数
  
    ```
        var reg=/boy(s)?\s+and\s+girl(s)?/gi;
        console.log(reg.test('boy    and   girl'));
    ```

### 1.2 exec方法

该方法属于一个比较复杂的方法，它接受一个字符串，返回的是一个数组，数组中第0个元素是匹配的子字符串，第二个元素是正则中的第一个子分组匹配的结果（如果有子分组，即正则中存在用圆括号括起来的分组），第三个是正则中第二个子分组匹配的结果（如果有第二个子分组）...以此类推，如果没有正则子分组，那么该数组长度仅仅为1，就是匹配到的那个子字符串。同时，返回的这个数组同时还是一个对象，它拥有两个属性，分别为index表示当前匹配到的子字符串所处的位置，input属性表示被匹配的原始字符串。最后，该方法中的正则对象如果不是全局匹配，即没有g修饰符，则每次调用只会从字符串开头处匹配第一个结果，且每次调用结果都是一样的。只有指定为全局匹配，才能够按照从左往右依次去匹配，每次调用匹配一个结果，正则对象的lastIndex属性前进到本次匹配的末尾位置，下回再调用的时候，会从lastIndex处开始匹配而不是从头匹配。

    ```
        var reg=/(\w)l(\w)/g;
        var str="hello world hello 123 hello programmer hello test";
        var arr=reg.exec(str);
        while(arr){
            console.dir(arr);
            console.log("lastIndex:"+reg.lastIndex);
            arr=reg.exec(str);
        }
    ```




## 2. js使用正则的方法
  
### 2.1 search方法
该方法是string对象的一个方法，用来查找第一次匹配的子字符串的位置，如果找到就返回一个number类型的index值，否则返回-1,它返回的只是第一次匹配的位置。

    ```
        var str="hello world";
        console.log(str.search(/o/g));
    ```


###  2.2 replace方法

该方法用来将字符串中的某些子串替换为需要的内容，接受两个参数，第一个参数可以为正则或者子字符串，表示匹配需要被替换的内容，第二个参数为被替换的新的子字符串。如果声明为全局匹配则会替换所有结果，否则只替换第一个匹配到的结果。

    ```
        var str="hello world,hello test";
        console.log(str.replace(/hello/g,'hi'));
    ```

### 7.3 split方法

该方法主要用来将一个字符串拆分成一个数组，它接受一个正则或者子字符（串）作为参数，返回一个数组，简单情况下，我们不需要使用正则，只有在字符串拆分规则不统一的情况下才需要使用正则，如下：

    ```
        var str="how|old*are    you";
        var arr=str.split(/\||\*|\s+/);
        console.log(arr);
    ```


###  7.4. match方法

该方法接受一个正则作为参数，用来匹配一个字符串，它的输出结果在不是全局匹配的情况下和exec方法的结果一致即一个数组并带有额外的属性，如果采用全局匹配，则不返回任何和其被匹配字符串相关的信息，只返回匹配的结果。

    ```
        var reg3=/(\w)s(\w)/g;
        var str4="ws1estqsa";
        console.dir(str4.match(reg3));
    ```
