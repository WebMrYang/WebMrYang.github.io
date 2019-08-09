## 1. Cookies，Web Storage(LocalStorage,SessionStorage)

* Cookies：浏览器均支持，容量为4KB;Web Storage：HTML5，容量为5M

* Web Storage拥有setItem,getItem等方法，cookie需要前端开发者自己封装setCookie，getCookie

* Cookie的作用是与服务器进行交互，作为HTTP规范的一部分而存在 ，在每次请求一个新的页面的时候都会被发送过去；而Web Storage仅仅是为了在本地“存储”数据而生

* sessionStorage用于本地存储一个会话（session）中的数据，这些数据只有在同一个会话中的页面才能访问并且当会话结束后数据也随之销毁，是会话级别的存储；localStorage用于持久化的本地存储，除非主动删除数据，否则数据是永远不会过期的。

* 每个特定的域名下最多生成的cookie个数（IE6：20;IE6以后50；chrome和Safari没有做硬性限制）有限制；IE和Opera 会清理近期最少使用的cookie，Firefox会随机清理cookie

* 由于在HTTP请求中的Cookie是明文传递的，所以安全性成问题，除非用HTTPS。 可以使用HttpOnly提升Cookie安全性。httponly 不支持读写，浏览器不允许脚本操作document.cookie去更改cookie，一般情况下都应该设置这个为true，这样可以避免被XSS攻击拿到cookie





## 2. 使用哪些工具来测试代码的性能

* [JSPerf](https://blog.csdn.net/dpj514/article/details/78767936), Dromaeo



## 3. 一次js请求一般情况下有哪些地方会有缓存处理？

* DNS缓存：短时间内多次访问某个网站，在限定时间内，不用多次访问DNS服务器。

* CDN缓存：内容分发网络（人们可以在就近的代售点取火车票了，不用非得到火车站去排队）

* 浏览器缓存：浏览器在用户磁盘上，对最新请求过的文档进行了存储。

* 服务器缓存：将需要频繁访问的Web页面和对象保存在离用户更近的系统中，当再次访问这些对象的时候加快了速度。




## 4. AMD和CMD 规范的区别？

[查看](https://www.cnblogs.com/lulin1/p/6405459.html)

* AMD 提前执行依赖 - 尽早执行，requireJS 是它的实现。

* CMD 按需执行依赖 - 懒执行，seaJS 是它的实现




## 5.  JavaScript 的同源策略

同源策略指的是：协议，域名，端口相同，同源策略是一种安全协议。

指一段脚本只能读取来自同一来源的窗口和文档的属性。




## 6. WEB应用从服务器主动推送Data到客户端有那些方式？

* html5 websoket

* WebSocket 通过 Flash

* XHR长时间连接

* CORS

* 不可见的Iframe










