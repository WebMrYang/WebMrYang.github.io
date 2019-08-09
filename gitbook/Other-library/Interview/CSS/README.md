## 1. 请简述盒模型

IE6盒子模型与W3C盒子模型。

* 文档中的每个元素被描绘为矩形盒子。盒子有四个边界：外边距边界margin, 边框边界border, 内边距边界padding与内容边界content。

* CSS3中有个box-sizing属性可以控制盒子的计算方式，

* content-box：padding和border不被包含在定义的width和height之内。对象的实际宽度等于设置的width值和border、padding之和。（W3C盒子模型） 

* border-box：padding和border被包含在定义的width和height之内。对象的实际宽度就等于设置的width值。（IE6盒子模型）




## 2. 边距重叠解决方案(BFC)

首先要明确BFC是什么意思，其全英文拼写为 Block Formatting Context 直译为“块级格式化上下文”

`1. BFC的原理`

* 内部的box会在垂直方向，一个接一个的放置
* 每个元素的margin box的左边，与包含块border box的左边相接触（对于从做往右的格式化，否则相反）
* box垂直方向的距离由margin决定，属于同一个BFC的两个相邻box的margin会发生重叠
* BFC的区域不会与浮动区域的box重叠
* BFC是一个页面上的独立的容器，外面的元素不会影响BFC里的元素，反过来，里面的也不会影响外面的
* 计算BFC高度的时候，浮动元素也会参与计算

`2.  怎么取创建BFC`

* float属性不为none（脱离文档流）
* position为absolute或fixed
* display为inline-block,table-cell,table-caption,flex,inine-flex
* overflow不为visible
* 根元素

`3.  应用场景`

* 自适应两栏布局
* 清除内部浮动 
* 防止垂直margin重叠



```
    <style>
        *{
            margin:0;
            padding:0;
        }
        .top{
            background: #0ff;
            height:100px;
            margin-bottom:30px;
        }
        .bottom{
            height:100px;
            margin-top:50px;
            background: #ddd;
        }
    </style>
        <!-- 未创建bfc -->
    <section class="top">
        <h1>上</h1>
        margin-bottom:30px;
    </section>
    <section class="bottom">
        <h1>下</h1>
        margin-top:50px;
    </section>
    
    <!-- 给下面这个块添加一个父元素，在父元素上创建bfc  -->
    <section class="top">
        <h1>上</h1>
        margin-bottom:30px;
    </section>
    <div style="overflow:hidden">
        <section class="bottom">
            <h1>下</h1>
            margin-top:50px;
        </section>
    </div>
```