## 一、 圣杯

代码

**css:**

```
#hd{
    height:50px;
    background: #666;
    text-align: center;
}

#bd{
    /*左右栏通过添加负的margin放到正确的位置了，此段代码是为了摆正中间栏的位置*/
    padding:0 200px 0 180px;
    height:100px;
}

#middle{
    float:left;
    width:100%;/*左栏上去到第一行*/
    height:100px;
    background:blue;
}

#left{
    width:180px;
    height:100px;
    background:#0c9;
    float:left;
    margin-left:-100%;
    /*中间栏的位置摆正之后，左栏的位置也相应右移，通过相对定位的left恢复到正确位置*/
    position:relative;
    left:-180px;
}

#right{
    width:200px;
    height:100px;
    background:#0c9;
    float:left;
    margin-left:-200px;
    /*中间栏的位置摆正之后，右栏的位置也相应左移，通过相对定位的right恢复到正确位置*/
    position:relative;
    right:-200px;
}

#footer{
    height:50px;
    background: #666;
    text-align: center;
}
```



**html:**

```

<div id="hd">header</div>

<div id="bd">

    <div id="middle">middle</div>

    <div id="left">left</div>

    <div id="right">right</div>

</div>

<div id="footer">footer</div>
```



## 二、双飞翼

```
#hd{
    height:50px;
    background: #666;
    text-align: center;
}

#middle{
    float:left;
    width:100%;/*左栏上去到第一行*/   
    height:100px;
    background:blue;
}

#left{
    width:180px;
    height:100px;
    background:#0c9;
    float:left;
    margin-left:-100%;

}

#right{
    width:200px;
    height:100px;
    background:#0c9;
    float:left;
    margin-left:-200px;
}

/*给内部div添加margin，把内容放到中间栏，其实整个背景还是100%*/

#inside{
    margin:0 200px 0 180px;
    height:100px;

}

#footer{ 
  clear:both; /*记得清楚浮动*/ 
  height:50px;   
  background: #666;   
  text-align: center;
}
```

**html:**

```
<div id="middle">

    <div id="inside">middle</div>

</div>

<div id="left">left</div>

<div id="right">right</div>

```


## 三、区别：

了解margin和padding和position三者区别,并且对于页面具备的影响margin的100%（父元素的width）以父级为参考,如果没有父级则为body体元,position不能使得元素换行，只能在同行显示，而margin和padding确可以使得元素换行

* 1. 主要是圣杯的需要把三个标签都包含，而双飞翼确不需要
* 2. 圣杯需要定位，而双飞翼不需要
* 3. 圣杯（主要是margin出现问题）在页面大小切换下会出现样式问题，而双飞翼确不会，只是会使得页面中间的contern越来越小（大）





## 四、flex布局居中

只要是使用

```
* {
    margin: 0px;
    border: 0px;
    padding: 0px;
}

body {
    width: 100vw;
    height: 100vh;
    display: flex;
    justify-content: center;
    align-items: center;
}

.box {
    height: 200px;
    width: 200px;
    background: yellow;
}
```




## 五、定位居中

```
.box {
    height: 200px;
    width: 200px;
    position: absolute;
    left: 50%;
    top: 50%;
    background: yellow;
    transform: translate(-50%, -50%);
}
```








