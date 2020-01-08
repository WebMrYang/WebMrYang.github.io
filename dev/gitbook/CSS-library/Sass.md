# sass

## 1.  sass介绍

Sass 是一个CSS预处理程序，强化 CSS 的辅助工具，它在 CSS 语法的基础上增加了变量 (variables)、嵌套 (nested rules)、混合 (mixins)、导入 (inline imports) 等高级功能，这些拓展令 CSS 更加强大与优雅。


Sass 有两种语法格式。

1. 首先是 SCSS (Sassy CSS) —— 这种格式仅在 CSS3 语法的基础上进行拓展，所有 CSS3 语法在 SCSS 中都是通用的，同时加入 Sass 的特色功能。此外，SCSS 也支持大多数 CSS hacks 写法以及浏览器前缀写法 (vendor-specific syntax)，以及早期的 IE 滤镜写法。这种格式以 .scss 作为拓展名。
```
$font-stack: Helvetica, sans-serif
body {
  font: 100% $font-stack
}
```
2. 另一种也是最早的 Sass 语法格式，被称为缩进格式 (Indented Sass) 通常简称 "Sass"，是一种简化格式。它使用 “缩进” 代替 “花括号” 表示属性属于某个选择器，用 “换行” 代替 “分号” 分隔属性，很多人认为这样做比 SCSS 更容易阅读，书写也更快速。缩进格式也可以使用 Sass 的全部功能，这种格式以 .sass 作为拓展名。
```
$font-stack: Helvetica, sans-serif
body
  font: 100% $font-stack
```


## 2. sass 优点
1. 全局变量
2. **方便嵌套**，SCSS 使我们能够在样式表中拥有相同的 HTML 视觉层次结构，这样我们就可以以一种更容易理解的方式来设计样式
3. 它能够将可重用的样式打包在一起，并允许根据需要将样式导入到另一个样式块中，从而减少代码中的冗余


## 3.环境搭建
sass 的安装方式有很多种，可以查看这个地址，这里我们使用[查看](https://www.sass.hk/install/)<br/>
如果是自己本地尝试，建议使用npm 
```
//全局下载 sass
npm install -g sass

// 编译单个文件 
sass input.scss output.css

//单文件监听命令
sass --watch input.scss:output.css

//如果你有很多的sass文件的目录，你也可以告诉sass监听整个目录：app和stylesheets分别为scss和生成css文件夹
sass --watch app:stylesheets

```
## 4.使用
  SCSS中的**@import**用于将部分内容获取到其他SCSS文件中，如果需要导入 SCSS 或者 Sass 文件，但又不希望将其编译为 CSS，只需要在文件名前添加下划线，这样会告诉 Sass 不要编译这些文件，但导入语句中却不需要添加下划线。(可以将 @import 嵌套进 CSS 样式或者 @media 中)

### 4.1 变量($)

SCSS中的变量以美元符号**$**开头。<br/>编译前
```
$color:red;
.color{
    $text_color: #ddd;
    color:$text_color;
    background-color: $color;
    .name{
        color:$text_color;
    }
}
```
编译后
```
.color {
  color: #ddd;
  background-color: red;
}
.color .name {
  color: #ddd;
}
```
### 4.2 嵌套
#### 4.2.1 Sass 允许将一套 CSS 样式嵌套进另一套样式中，内层的样式将它外层的选择器作为父选择器
<br/>编译前
```
#main {
    width: 97%;
    p, div {
      font-size: 2em;
      a { font-weight: bold; }
    }
    pre { font-size: 3em; }
}
```
编译后
```
#main {
  width: 97%;
}
#main p, #main div {
  font-size: 2em;
}
#main p a, #main div a {
  font-weight: bold;
}
#main pre {
  font-size: 3em;
}
```
#### 4.2.2  父选择器 & 
在嵌套 CSS 规则时，有时也需要直接使用嵌套外层的父选择器，例如，当给某个元素设定 hover 样式时，或者当 body 元素有某个 classname 时，可以用 **&** 代表嵌套规则外层的父选择器。<br/>
编译前
```
a {
    font-weight: bold;
    text-decoration: none;
    &:hover { text-decoration: underline; }
    body.firefox & { font-weight: normal; }
}
```
编译后
```
a {
  font-weight: bold;
  text-decoration: none;
}
a:hover {
  text-decoration: underline;
}
body.firefox a {
  font-weight: normal;
}

```
**&**  必须作为选择器的第一个字符，其后可以跟随后缀生成复合的选择器<br/>
编译前
```
#main {
    color: black;
    &-sidebar { border: 1px solid; }
}
```
编译后
```
#main {
  color: black;
}
#main-sidebar {
  border: 1px solid;
}
```

### 4.3  插值语句 #{}
通过 #{} 插值语句可以在选择器或属性名中使用变量：<br/>
编译前
```
$name: foo;
$attr: border;
p.#{$name} {
  #{$attr}-color: blue;
}
```
编译后
```
p.foo {
  border-color: blue;
}
```

### 4.4 变量定义 !default
可以在变量的结尾添加 !default 给一个未通过 !default 声明赋值的变量赋值，此时，如果变量已经被赋值，不会再被重新赋值，但是如果变量还没有被赋值，则会被赋予新的值。<br/>
编译前
```
$content: "First content";
$content: "Second content?" !default;
$new_content: null;
$new_content: "First time reference" !default;

.main {
  content: $content;
  new-content: $new_content;
}
```
编译后
```
.main {
  content: "First content";
  new-content: "First time reference";
}
```

### 4.5 Mixins(使用 @include 引入)
SCSS 的另一个了不起的特性是它能够将可重用的样式打包在一起，并允许根据需要将样式导入到另一个样式块中，从而减少代码中的冗余。但是相同的代码被引入了多次<br/>
编译前
```
@mixin button{
    font-size: 1em;  
    padding: 0.5em 1.0em;
}
@mixin back($back:red){
    text-align: center;
    background-color: $back;
}
.button-green{
      @include button;
      @include back(green);
}
.button-red{
    @include button;
    @include back;
}
```
编译后
```
.button-green {
  font-size: 1em;
  padding: 0.5em 1em;
  text-align: center;
  background-color: green;
}

.button-red {
  font-size: 1em;
  padding: 0.5em 1em;
  text-align: center;
  background-color: red;
}
```
### 4.6 @extend
使用相同样式，基础类会被引入，并且编译后合并在一起<br/>
编译前
```
.icon {
    transition: background-color ease .2s;
    margin: 0 .5em;
}
  
.error-icon {
    @extend  .icon;
}
  
.info-icon {
    @extend .icon;
}
```
编译后
```
.icon, .info-icon, .error-icon {
  transition: background-color ease 0.2s;
  margin: 0 0.5em;
}
```

### 4.6 占位符（%）
%变量不会进行编译，只是会引用<br/>
编译前
```
%icon {
    transition: background-color ease .2s;
    margin: 0 .5em;
}
.error-icon {
    @extend %icon;
}
.info-icon {
    @extend %icon;
}
#context a%extreme {
    color: blue;
    font-weight: bold;
    font-size: 2em;
}
.notice {
    @extend %extreme;
}

```
编译后
```
.info-icon, .error-icon {
  transition: background-color ease 0.2s;
  margin: 0 0.5em;
}
#context a.notice {
  color: blue;
  font-weight: bold;
  font-size: 2em;
}
```

### 4.7 控制流条件样式

#### 4.7.1 if()
if() 是 Sass 的一个内建函数，与之相似的 @if 则是一个内建指令。if() 用来做条件判断并返回特定值<br/>
编译前
```
@mixin test($condition) { 
    $color: if($condition, blue, red); 
    color:$color 
}  
.firstClass { 
    @include test(true); 
}   
.secondClass { 
    @include test(false); 
}
```
编译后
```
.firstClass {
  color: blue;
}
.secondClass {
  color: red;
}
```
**@if**达式返回值不是 false 或者 null 时，条件成立，输出 {} 内的代码<br/>
编译前
```
$type: monster;
p {
  @if $type == ocean {
    color: blue;
  } @else if $type == matador {
    color: red;
  } @else if $type == monster {
    color: green;
  } @else {
    color: black;
  }
}
```
编译后
```
p {
  color: green;
}
```
#### 4.7.2  @for
@for 指令常用于循环输出。@for 有两种使用方式：from start through end 和 from start to end，两者的区别在于，前者遍历的范围是 [start, end], 而后者的遍历范围是 [start, end-1]<br/>

编译前
```
@for $i from 1 through 4 { 
    .col-#{$i} { 
      width: 100/4 * $i + '%';
    } 
}
@for $i from 1 to 4 { 
    .span-#{$i} { 
      width: 100/4 * $i + '%';
    } 
}
```
编译后
```
col-1 {
  width: "25%";
}
.col-2 {
  width: "50%";
}
.col-3 {
  width: "75%";
}
.col-4 {
  width: "100%";
}
.span-1 {
  width: "25%";
}
.span-2 {
  width: "50%";
}
.span-3 {
  width: "75%";
}
```

#### 4.7.3 @each
@each 指令的格式是 $var in <list>, $var 可以是任何变量名，比如 $length 或者 $name，而 <list> 是一连串的值，也就是值列表。<br/>


编译前
```
@each $animal in puma, sea-slug, egret, salamander {
    .#{$animal}-icon {
      background-image: url('/images/#{$animal}.png');
    }
}
```
编译后
```
.puma-icon {
  background-image: url("/images/puma.png");
}
.sea-slug-icon {
  background-image: url("/images/sea-slug.png");
}
.egret-icon {
  background-image: url("/images/egret.png");
}
.salamander-icon {
  background-image: url("/images/salamander.png");
}
```

###  4.8 函数指令
Sass 支持自定义函数，并能在任何属性值或 Sass script 中使用：<br/>
编译前
```
$grid-width: 40px;
$gutter-width: 10px;
@function grid-width($n) {
  @return $n * $grid-width + ($n - 1) * $gutter-width;
}
#sidebar { width: grid-width(5); }
```
编译后
```
#sidebar {
  width: 240px;
}
```


## 5. 区别
1. 4.4@mixin，4.5@extend，4.5占位符%中可以看出三者编译后结果的不同，具体查看[sass中的占位符%，@extend，@mixin（@include）的编译区别和使用场景](https://www.cnblogs.com/yaoyao-sun/p/10813125.html)



















