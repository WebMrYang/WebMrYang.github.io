# 跨域


## 一、介绍


什么是跨域？
跨域是指一个域下的文档或脚本试图去请求另一个域下的资源


什么是同源策略？
同源策略/SOP（Same origin policy）是一种约定，由Netscape公司1995年引入浏览器，它是浏览器最核心也最基本的安全功能，如果缺少了同源策略，浏览器很容易受到XSS、CSFR等攻击。所谓同源是指"协议+域名+端口"三者相同，即便两个不同的域名指向同一个ip地址，也非同源。


url 哪些地方不同算作跨域？协议、域名、端口，三个有两个不同就是不同的源，就是跨域





## 二、 限制

同源策略限制以下几种行为：

* Cookie、LocalStorage 和 IndexDB 无法读取
* DOM 和 Js对象无法获得
* AJAX 请求不能发送






## 三、解决办法

跨域解决方案

*  通过jsonp跨域
*  iframe跨域
*  跨域资源共享（CORS）
*  nginx代理跨域
*  nodejs中间件代理跨域

### 3.1 通过jsonp跨域

通常为了减轻web服务器的负载，我们把js、css，img等静态资源分离到另一台独立域名的服务器上，在html页面中再通过相应的标签从不同域名下加载静态资源，而被浏览器允许，基于此原理，我们可以通过动态创建script，再请求一个带参网址实现跨域通信。

```
    var script = document.createElement('script');
    script.type = 'text/javascript';
    // 传参并指定回调执行函数为onBack
    script.src = 'http://www.domain2.com:8080/login?user=admin&callback=onBack';
    document.head.appendChild(script);
    // 回调执行函数
    function onBack(res) {
        alert(JSON.stringify(res));
    }
```

### 3.2 跨域资源共享（CORS）

* **普通跨域请求：**

只服务端设置Access-Control-Allow-Origin即可，前端无须设置，若要带cookie请求：前后端都需要设置。

需注意的是：由于同源策略的限制，所读取的cookie为跨域请求接口所在域的cookie，而非当前页。如果想实现当前页cookie的写入，可参考下文：三、nginx反向代理中设置proxy_cookie_domain 和 四、NodeJs中间件代理中cookieDomainRewrite参数的设置。

目前，所有浏览器都支持该功能(IE8+：IE8/9需要使用XDomainRequest对象来支持CORS）)，CORS也已经成为主流的跨域解决方案。


* **jQuery ajax**

```
    $.ajax({
        xhrFields: {
            withCredentials: true,// 前端设置是否带cookie
        },
        crossDomain: true,// 会让请求头中包含跨域的额外信息，但不会含cookie...
    });
```

### 3.3  nginx代理跨域


* **nginx配置解决iconfont跨域**

浏览器跨域访问js、css、img等常规静态资源被同源策略许可，但iconfont字体文件(eot|otf|ttf|woff|svg)例外，此时可在nginx的静态资源服务器中加入以下配置。

```
location/{add_header Access-Control-Allow-Origin*;}
```

* **nginx反向代理接口跨域**

跨域原理： 同源策略是浏览器的安全策略，不是HTTP协议的一部分。服务器端调用HTTP接口只是使用HTTP协议，不会执行JS脚本，不需要同源策略，也就不存在跨越问题。

实现思路：通过nginx配置一个代理服务器（域名与domain1相同，端口不同）做跳板机，反向代理访问domain2接口，并且可以顺便修改cookie中domain信息，方便当前域cookie写入，实现跨域登录。

nginx具体配置：

```
server {
    listen      81;
    server_name  www.domain1.com;
    location / {
        proxy_pass  http://www.domain2.com:8080;  #反向代理
        proxy_cookie_domain www.domain2.com www.domain1.com; #修改cookie里域名
        index  index.html index.htm;
        # 当用webpack-dev-server等中间件代理接口访问nignx时，此时无浏览器参与，故没有同源限制，下面的跨域配置可不启用
        add_header Access-Control-Allow-Origin http://www.domain1.com;  #当前端只跨域不带cookie时，可为*
        add_header Access-Control-Allow-Credentials true;
    }
}
```



### 3.4  Nodejs中间件代理跨域


node中间件实现跨域代理，原理大致与nginx相同，都是通过启一个代理服务器，实现数据的转发，也可以通过设置cookieDomainRewrite参数修改响应头中cookie中域名，实现当前域的cookie写入，方便接口登录认证。

非vue框架的跨域（2次跨域） 利用node + express + http-proxy-middleware搭建一个proxy服务器。

```
//前端代码示例：


var xhr = new XMLHttpRequest();
// 前端开关：浏览器是否读写cookie
xhr.withCredentials = true;
// 访问http-proxy-middleware代理服务器
xhr.open('get', 'http://www.domain1.com:3000/login?user=admin', true);
xhr.send();



// 中间件服务器：

var express = require('express');
var proxy = require('http-proxy-middleware');
var app = express();
app.use('/', proxy({
    // 代理跨域目标接口
    target: 'http://www.domain2.com:8080',
    changeOrigin: true,
    // 修改响应头信息，实现跨域并允许带cookie
    onProxyRes: function(proxyRes, req, res) {
        res.header('Access-Control-Allow-Origin', 'http://www.domain1.com');
        res.header('Access-Control-Allow-Credentials', 'true');
    },
    // 修改响应信息中的cookie域名
    cookieDomainRewrite: 'www.domain1.com'  // 可以为false，表示不修改
}));
app.listen(3000);
console.log('Proxy server is listen at port 3000...');
```


