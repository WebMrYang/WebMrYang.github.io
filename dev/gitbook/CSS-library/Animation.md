
#CSS3动画属性的区别（Transitions, Transforms和Animation）


## 1. 介绍 

CSS3动画相关的几个属性是：transition, transform, animation；我分别理解为过渡，变换，动画。虽意义相近，但具体角色不一。

`transition`指过渡啦，就是从a点都b点，就像过江坐渡轮，是有时间的，是连续的，一般针对常规CSS属性；`transform`指变换，就那几个固定的属性：旋转啦，缩放啦，偏移啦什么的，当独立于远房亲戚transition独自使用时，效果就是很干涩机械的旋转移动。要是配合transition属性，旋转啊什么的，就会很平滑。`animation`最先安家于Safari浏览器，自成一家，与transition和transform有老死不相往来之感，但是要说单挑的话，animation要比transition厉害些。



## 2.详情 

### 2.1 transition


其作用是：平滑的改变CSS的值。无论是点击事件，焦点事件，还是鼠标hover，只要值改变了，就是平滑的，就是动画。于是乎，只要一个整站通用的class，就可以很轻松的渐进增强地实现动画效果，超有实用价值的说。

transiton属性是下面几个属性的缩写：

* transition-property

指定过渡的属性值，比如transition-property:opacity就是只指定opacity属性参与这个过渡。

* transition-duration

指定这个过渡的持续时间

* transition-delay

延迟过渡时间

* transition-timing-function

指定过渡动画缓动类型，有ease | linear | ease-in | ease-out | ease-in-out | cubic-bezier(),其中，linear线性过度，ease-in由慢到快，ease-out由快到慢，ease-in-out由慢到快在到慢

例如下面这个很简单的例子：

```
    <style>
    button {
        background: palegreen;
        border: none;
        outline: none;
        width: 100px;
        height: 30px;
        cursor: pointer;
        position: relative;
        z-index: 1;
    }

    button::before {
        content: '';
        position: absolute;
        z-index: -1;
        top: 0;
        bottom: 0;
        left: 0;
        right: 0;
        height: 0;
        background: red;
        transform-origin: center bottom;
        transition: transform 0.4s ease-in-out;
    }

    button:hover::before {
        height: 100%;
        transform-origin: center top;
    }
    </style>

    <body>
        <button>
            查看
        </button>
    </body>
```



### 2.2 transform

`transform`指变换，使用过photoshop的人应该知道里面的Ctrl+T自由变换。transform就是指的这个东西，拉伸，压缩，旋转，偏移。见下面示例代码：

```
.trans_skew { transform: skew(35deg); }

.trans_scale { transform:scale(1, 0.5); }

.trans_rotate { transform:rotate(45deg); }

.trans_translate { transform:translate(10px, 20px); }

```


`transform`属性要是加上`transition`的过渡特性，那可就是如虎添翼，可以产生不少美妙的火花，例如下面这个例子，关键代码如下：

```
.trans_effect {

    transition:all 2s ease-in-out;

}

.trans_effect:hover {

    transform:rotate(720deg) scale(2,2);       

}
```
三：animations

```
@-webkit-keyframes resize {

    0% {

        padding: 0;

    }

    50% {

        padding: 0 20px;

        background-color:rgba(190, 206, 235, 0.2);       

    }

    100% {

        padding: 0 100px;

        background-color:rgba(190, 206, 235, 0.9);

    }

}

.anim_box:hover {

    animation-name: resize;

    animation-duration: 1.5s;

    animation-iteration-count: 4;

    animation-direction: alternate;

    animation-timing-function: ease-in-out;

}
```

