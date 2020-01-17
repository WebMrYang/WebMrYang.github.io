# webpack 初始

## 1. 简介

webpack（模块打包工具）：webpack是一个打包模块化的Javascript的工具，它会 从入口模块出发，识别出源码中的模块化导入语句，递归的找出入口文件的所有依赖，将入口和其他所有的依赖打包到一个单独的文件.


## 2. 安装


### 2.1 全局安装
会造成多个项目只能使用同一个webpack版本
```
//在webpack 4.0版本需要安装两个
npm install webpack webpack-cli -g
//检查版本
webpack -v
// 卸载
npm uninstall webpack webpack-cli -g

```

### 2.2 局部安装
支持多个项目使用不同webpack版本
```
npm install webpack webpack-cli -D
 //局部安装 webpack 命令找不到

如何使用 
方法一： ./node_modules/.bin/webpack
node_modules/.bin 下 的文件都是可执行文件，都是原文件的软连接（符号链接）
.bin 下面的文件都是npm 生成的
#!/usr/bin/env node
#!：一般放在第一行，告诉使用者使用什么程序执行下面代码（软链接和符号链接叫法都和这个有关系）
/usr/bin/env ：node 的位置
node：使用node执行
方法二：npx webpack
npx 会自动查找当前依赖包中的可执行文件，如果找不到，就会去 PATH 里找。如果依然找不到，就会帮你安装。
方法三： 配置package.json中的script
"scripts": {
    "test": "echo \"Error: no test specified\" && exit 1",
    "dev": "webapck"
  },
执行 npm run dev
npm run 会创建一个shell脚本，这个脚本把当前项目的node_modules/.bin的绝对路径放在了系统的环境变量中


env：查看环境变量
rm -rf 与 rimraf 一样都是删除文件
scripts 中 有两种脚本钩子pre（前置钩子）,post（后置钩子），在dev前加上pre成predev，当执行dev的时候，回先执行predev，postdev为执行完dev后执行的命令

```

>package.json 中的bin 作用
>当文件被引入进去的时候,npm将软链接这个文件到prefix/bin里面,以便于全局引入,或在./node_modules/.bin/目录里； bin中的key值是引入时候的名称



## 3. 配置
>  webpack 4.x 默认只支持 js和json格式

默认配置 webpack.config.js
```
const path=require('path');
module.exports={
    //构建入口
    entry:'./src/index.js',
    output:{
        // path 为绝对路径 ，输出的目录
        path:path.resolve(__dirname,'./dist'),
        filename:"[name].js",//输出的名称
    },
    mode:"development"
}
```

### 3.1 入口 entry
指定webpack打包入口文件:Webpack 执行构建的第一步将从 Entry 开始，可抽象成输入
```
适合一个单页面（spa），输入为字符串或者数组
entry: string|Array<string> 
entry: './path/to/my/entry/file.js' | ['./path/to/my/entry/file.js']


适合一个多页面应用（mpa），输入为对象
entry: {[entryChunkName: string]: string|Array<string>}
上面的entry相当于
entry:{
  main: './path/to/my/entry/file.js' ,
}
对象的key值为output输出适合的 name（默认为main）,
```

### 3.2 出口 output
打包转换后的文件输出到磁盘位置
```
    output:{
        // path 为绝对路径 ，输出的目录
        path:path.resolve(__dirname,'./dist'),
        filename:"[name]-[hash:6].js",
      //输出的名称 name为多页面的key或者默认的main,
      //hash为此次构建的hash值，用于与缓存，后面的：6可以设置也可以不设置，设置数值为截取个数（长度）
    },
```

### 3.3 mode
Mode用来指定当前的构建环境（‘none' | 'production' | 'development'）

| 选项 |  描述 | 优点 |
| :---: | :--- | :--- |
| development |  会将 process.env.NODE_ENV 的值设为 development。启用 NamedChunksPlugin 和 NamedModulesPlugin。| 开启有利于热更新处理，识别模块变化 |
|  production  |  会将 process.env.NODE_ENV 的值设为 production。启用 FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, OccurrenceOrderPlugin, SideEffectsFlagPlugin 和 UglifyJsPlugin | 开启压缩，处理副作用 |
| none |  退出任何默认优化选项 | 更灵活 |


### 3.4 module
[loader](https://www.webpackjs.com/loaders/css-loader/)，模块解析，模块转换器器，用于把模块原内容按需转换成新内容，webpack默认只知道如何处理js和JSON模块，?那么其他模块如何处理呢，这就用到了不同的loader,但是一个loader只处理一件事
>loader在一个test中 执行有顺序，从右像左，从下到上
```
module:{
        rules:[
            {
                test:/.css$/,//处理css
                use:[
                    {
                        loader:'style-loader' //把css加入到html中
                        options:{
                            injectType: "singletonStyleTag"  //将所有的style标签合并成一个
                        }
                    },
                    },
                    'css-loader' //处理css
                ],
                // use:['style-loader','css-loader']
            },
            {
                test:/.(png|jpe?g|gif)$/,//处理图片
                use:{
                    // loader:'file-loader', //file-loader 只是移动文件，还有一个
                    loader:'url-loader',//url-loader 内部使用file-loader。可以处理所有的file-loader干的事，但是遇到jpg格式的模块，会把该图片转化成base64格式的字符串。
                    // 打包到js里，适合小体积的图片，大图片不合适
                    // 额外配置，比如名称。hash等
                    options:{
                        name:'[name]_[hash:6].[ext]',//输出name  //name为本身文件的name,ext代表后缀
                        outputPath:'images/' //输出到的目录
                    }
                },
            },
            {
                test:/.(woff2?|ttf|svg|eot)$/,//处理字体
                use:{
                    loader:'file-loader', //file-loader 只是移动文件，还有一个
                    options:{
                        name:'[name]_[hash:6].[ext]',//输出name  //name为本身文件的name,ext代表后缀
                        outputPath:'font/' //输出到的目录
                    }
                },
            }
        ]
    }
```
css自动添加前缀
```
// npm i postcss-loader autoprefixer -D
         {
                test: /.css$/,//处理css
                use: [
                    {
                        loader: 'style-loader', //把css加入到html中
                        options: {
                            injectType: "singletonStyleTag" //将所有的style标签合并成一个
                        }
                    },
                    'css-loader', //处理css
                    {
                        loader: "postcss-loader",
                        options: {
                            // Necessary for external CSS imports to work
                            // https://github.com/facebookincubator/create-react-app/issues/2677
                            ident: 'postcss',
                            plugins:  [
                                autoprefixer({
                                    browsers: [
                                        '>1%',
                                        'last 4 versions',
                                        'Firefox ESR',
                                        'not ie < 9', // React doesn't support IE8 anyway
                                    ],
                                }),
                            ],
                        }
                    }
                ]
                // use:['style-loader','css-loader']
            },
```

### 3.5 plugin
>作用于webpack打包整个周期，webpack的打包过程是（有生命周期概念）钩子
>扩展插件，在 Webpack 构建过程中的特定时机注入扩展逻辑来改变构建结果或想要做的事

#### 3.5.1 HtmlWebpackPlugin
htmlwebpackplugin会在打包结束后，自动生成一个html文件，并把打包生成的js模板加入到该html中
```
npm install --save-dev html-webpack-plugin
new HtmlWebpackPlugin({
            title:'hello world',
            template:'./index.html'
 }),
```

配置：

| 名称 |  作用 | eg |
| :---: | :--- | :--- |
|  title | 生成html页面中的header| 需要设置html中title为（固定格式） ```<title><%= htmlWebpackPlugin.options.title %></title>``` |
| filename | 输出的html文件名 默认是index.html,也可以直接配置带有子目录的 | '/public/index.html' |
| template | 模板html文件路径 | ./index.html  绝对路径相对路径都支持|
| inject | true或body或false或head | 默认true，前两者添加js到body底部，后两张添加js到head|
| favicon | ico的路径，会自动输出到生成的目录中 | './favicon.ico' |


#### 3.5.2 clean-webpack-plugin
在打包的时候清除生成的无效文件
```
npm install --save-dev clean-webpack-plugin

const {CleanWebpackPlugin}=require('clean-webpack-plugin');

new CleanWebpackPlugin(),
```

#### 3.5.2 clean-webpack-plugin
抽离css并且把css添加到html上
```
npm install --save-dev mini-css-extract-plugin

const MiniCssExtractPlugin = require("mini-css-extract-plugin");
需要再css-loader前加一个loder
{
  test: /\.css$/,
  use: [MiniCssExtractPlugin.loader, "css-loader"]
}
new MiniCssExtractPlugin({
  filename: "[name][chunkhash:8].css"
})
```

### 3.6 devtool
源代码与打包后的代码的映射关系，通过sourceMap定位到源代码<br/>
devtool的介绍：https://webpack.js.org/configuration/devtool#devtool<br/>
eval:速度最快,使用eval包裹模块代码,<br/>
source-map： 产生 .map 文件<br/>
cheap:较快，显示行数，不包含列信息<br/>
Module：第三方模块，包含loader的sourcemap（比如jsx to js ，babel的sourcemap）<br/>
inline： 将 .map 作为DataURI嵌入，不单独生成 .map 文件<br/>
```
开发环境推荐开启
devtool:"cheap-module-eval-source-map"
```








### 3.7 WebpackDevServer
启动服务，提升开发效率
* 安装
```
npm install webpack-dev-server -D
```
* 配置修改下package.json
```
"scripts": {
  "server": "webpack-dev-server"
},
```
* 在webpack.config.js配置
```
devServer: {
  contentBase: "./dist",//生成目录
  open: true, // 是否打开浏览器
  port: 8081, //端口
   proxy:{
            '/api':{ //以api开头的，不支持正则
                target:"http://localhost:3004",// 目标机器
                pathRewrite: {"^/api" : ""}//重写url 匹配可以使用正则
            }
     }
},
在启动的时候其实不生成文件，把文件都储存在物流内存中，提升开发效率
```


### 3.8 hot-module-replacement

HMR:热模块替换，不支持抽离出的css变化
```
npm i hot-module-replacement -D

devServer: {
  contentBase: "./dist",
  open: true,
  hot:true,//启用 webpack 的模块热替换特性
  hotOnly:true,//即便便HMR不生效，浏览器器也不自动刷新，就开启hotOnly
},
plugins: [
  new webpack.HotModuleReplacementPlugin()
]
如果非框架书写的
if (module.hot) { // 当模块b发生变化的时候，进行删除元素并重新执行
module.hot.accept("./b", function() {
  document.body.removeChild(document.getElementById("number"));
  number();
  });
}
// 框架书写的看框架使用的插件
[框架布局刷新](https://www.webpackjs.com/guides/hot-module-replacement/)

[文档](https://www.webpackjs.com/api/hot-module-replacement/)

```

## 4.babel
[中文网站](https://www.babeljs.cn/)<br/>
babel是JavaScript编译器器，能将ES6代码转换成ES5代码，让我们开发过程中放心使用JS新特性而不用担心兼容性问题。并且还可以通过插件机制根据需求灵活的扩展。<br/>
Babel在执行行编译的过程中，会从项目根目录下的 .babelrc JSON文件中读取配置。没有该文件会从loader的options地方读取配置。
```
npm i babel-loader @babel/core @babel/preset-env -D
1.babel-loader是webpack 与 babel的通信桥梁，不会做把es6转成es5的工作，这部分工作需要用到@babel/preset-env来做
2.@babel/preset-env里包含了了es6，7，8转es5的转换规则
env是babel7之后推行的预设插件

{
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
        loader: "babel-loader",
        options: {
            presets: ["@babel/preset-env"]
        }
    }
}
```
通过上面的几步 还不够，默认的Babel只支持let等一些基础的特性转换，Promise等一些还没有转换过来，这时候需要借助@babel/polyfill，把es的新特性都装进来，来弥补低版本浏览器器中缺失的特性

```
@babel/polyfill 以全局变量的方式注入进来的。windows.Promise它会造成全局对象的污染
npm install --save @babel/polyfill

按需加载，减少冗余
{
    test: /\.js$/,
    exclude: /node_modules/,
    use: {
        loader: "babel-loader",
        options: {
            presets: [
                [
                    "@babel/preset-env",
                    {
                        targets: {
                            edge: "17",
                            firefox: "60",
                            chrome: "67",
                            safari: "11.1"
                        },
                        corejs: 2,//新版本需要指定核心库版本
                        useBuiltIns: "usage"//按需注入
                    }
                ]
            ]
        }
    }
}
useBuiltIns 选项是 babel 7 的新功能，这个选项告诉 babel 如何配置 @babel/polyfill 。 它有三个参数可以使用： ①entry: 需要在 webpack 的入口文件里 import "@babel/polyfill" 一次。 babel 会根据你的使用情况导入垫片，没有使用的功能不会被导入相应的垫片。 ②usage: 不需要 import ，全自动检测，但是要安装 @babel/polyfill 。（试验阶段） ③false: 如果你 import
"@babel/polyfill" ，它不不会排除掉没有使用的垫片，程序体积会庞大。(不不推荐)
请注意： usage 的行行为类似 babel-transform-runtime，不会造成全局污染，因此不会对类似Array.prototype.includes() 进行 polyfill。
```