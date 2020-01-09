# web攻击

### 1. 定义

随着Web2.0、社交网络、微博等等一系列新型的互联网产品的诞生，基于Web环境的互联网应用越来越广泛，企业信息化的过程中各种应用都架设在Web平台上，Web业务的迅速发展也引起黑客们的强烈关注，接踵而至的就是Web安全威胁的凸显，黑客利用网站操作系统的漏洞和Web服务程序的SQL[注入漏洞](https://baike.baidu.com/item/%E6%B3%A8%E5%85%A5%E6%BC%8F%E6%B4%9E)等得到[Web服务器](https://baike.baidu.com/item/Web%E6%9C%8D%E5%8A%A1%E5%99%A8/8390210)的控制权限，轻则篡改网页内容，重则窃取重要内部数据，更为严重的则是在网页中植入[恶意代码](https://baike.baidu.com/item/%E6%81%B6%E6%84%8F%E4%BB%A3%E7%A0%81)，使得网站访问者受到侵害。这也使得越来越多的用户关注应用层的安全问题，对Web应用安全的关注度也逐渐升温。


### 2. 攻击手段以及防范

* XSS攻击
* CSRF
* 点击劫持
* SQL注入
* OS注入
* DDoS攻击


###  2.1  XSS攻击(跨站脚本攻击)

XSS（Cross Site Scripting）跨站脚本攻击，为了不与层叠样式表（CSS）混淆，故将跨站脚本攻击缩写为XSS。原理即在网页中嵌入恶意脚本(js或者html标签)，当用户打开网页时，恶意脚本便开始在用户浏览器上执行，以盗取客户端cookie、用户名、密码，发送恶意请求，甚至下载木马程式，危害可想而知。<br/>

XSS通常可以分为两大类（主要来源于前后端未对数据进行处理）：
* 反射型XSS(url直接注入)，主要做法是将脚本代码加入URL地址的请求参数里，请求参数进入程序后在页面直接输出，用户点击类似的恶意链接就可能受到攻击（出现把URl中参数渲染到页面中）。
```
// 普通
http://localhost:3000/?from=china
// alert尝试
http://localhost:3000/?from=<script>alert(3)</script>
// 短域名伪造 https://dwz.cn/
```
* 存储型XSS（存储在后端数据库里），主要出现在让用户输入数据，供其他浏览此页的用户进行查看的地方，包括留言、评论、博客日志和各类表单等。攻击者在相关页面输入恶意的脚本数据后,应用程序从数据库中查询数据，在页面中显示出来，用户浏览此类页面时就可能受到攻击。这个流程简单可以描述为：恶意用户的Html输入Web程序->进入数据库->Web程序->用户浏览器（提交数据前后端都未做处理，直接存储到数据库中）。

危害：
1. 获取页面数据
2. 获取Cookies
3. 劫持前端逻辑
4. 发送请求
5. 欺骗用户

防范：
1. 前端对于url中数据使用时进行处理
2. 如果是后端直接进行页面渲染(主要是用来设置header来控制)
```
// 一般浏览器现在都防止xss攻击，但是现在谷歌已经放开
ctx.set('X-XSS-Protection', 0) // 禁止XSS过滤
// http://localhost:3000/?from=<script>alert(3)</script> 可以拦截 但伪装一下就不不行行了了（使用域名网站转换）
// 只允许加载本站资源
Content-Security-Policy: default-src 'self'
// 只允许加载 HTTPS 协议图⽚片
Content-Security-Policy: img-src https://*
// 不不允许加载任何来源框架
Content-Security-Policy: child-src 'none'
```
3. 转移字符-黑名单
  >用户的输入永远不不可信任的，最普遍的做法就是转义输入输出的内容，对于引号、尖括号、斜杠进行行转义(但是对于富文本来说是不合适的所有更推荐使用白名单)
```
function escape(str) {
    str = str.replace(/&/g, '&amp;')
    str = str.replace(/</g, '&lt;')
    str = str.replace(/>/g, '&gt;')
    str = str.replace(/"/g, '&quto;')
    str = str.replace(/'/g, '&#39;')
    str = str.replace(/`/g, '&#96;')
    str = str.replace(/\//g, '&#x2F;')
    return str
}
```
4. 转移字符-白名单
  > 其实和黑名单一样逻辑差不多都是对字符的转义,只是白名单是有选择性的
```
// node中
const xss = require('xss')
let html = xss('<h1 id="title">XSS Demo</h1><script>alert("xss");</script>')
// -> <h1>XSS Demo</h1>&lt;script&gt;alert("xss");&lt;/script&gt;
console.log(html)
```
5. 设置cookie httpOnly
>这是预防XSS攻击窃取用户cookie最有效的防御手段。Web应 用程序在设置cookie时，将其属性设为HttpOnly，就可以避免该网页的cookie被客户端恶意JavaScript窃取，保护用户cookie信息。
```
//node中
response.addHeader("Set-Cookie", "uid=112; Path=/; HttpOnly")
```

### 2.2 CSRF

CSRF(Cross Site Request Forgery)，即跨站请求伪造，是一种常见的Web攻击，它利利用用户已登录的身份，在用户毫不不知情的情况下，以用户的名义完成非法操作。
* 用户登录受信站点A，生成本地cookie；
* 用户没有退出站点A，访问了恶意站点B。
* 站点A没做CSRF防御
```
<script>
      document.write(`
      <form name="form" action="http://localhost:3000/updateText" method="post" target="csrf">
        添加评论: <input type="text" name="text" value="CSRF评论。。" />
      </form>
      `)
      var iframe = document.createElement('iframe')
      iframe.name = 'csrf'
      iframe.style.display = 'none'
      document.body.appendChild(iframe)
      setTimeout(function() {
        document.querySelector('form').submit();
      },1000)
    </script>
//指向iframe是为了做到无刷新提交
// 这样当A网站登录后，B网站模拟A网站发出请求
```

危害：
1. 完成业务请求
2. 盗取用户资金（转账，消费）
3. 冒充用户发帖背锅
4. 损害网站声誉

防范：
1. 通过Referer识别- Https不不发送referer(不常用)
Http头中有一个字段Referer，它记录了Http请求来源地址。但是注意不要把Rerferer用在身份验证或者其他非常重要的检查上，因为Rerferer非常容易在客户端被改变。（火狐的一个插件RefControl修改Referer引用）
2. 验证码（加大犯罪成本）
3. token 
CSRF攻击之所以成功，主要是攻击中伪造了用户请求，而用户请求的验证信息都在cookie中，攻击者就可以利用cookie伪造请求通过安全验证。因此抵御CSRF攻击的关键就是，在请求中放入攻击者不能伪造的信息，并且信息不在cookie中<br/>
鉴于此，开发人员可以在http请求中以参数的形式加一个token，此token在服务端生成，也在服务端校验，服务端的每次会话都可以用同一个token。如果验证token不一致，则认为至CSRF攻击，拒绝请求。
4. cookie值进行hash：
  请求的时候再带上一个参数，把cookie进行hash处理，后端通过判断cookie和这个参数来判断是否是CSRF攻击

### 2.3 点击劫持
点击劫持是一种视觉欺骗的攻击手段。攻击者将需要攻击的网站通过 iframe 嵌套的方式嵌入自己的网页中，并将 iframe 设置为透明，在页面中透出一个按钮诱导用户点击。<br/>

危害：
1. 会冒充用户点赞等功能（不需要输入的一些操作）

防范：
1. X-FRAME-OPTIONS
X-FRAME-OPTIONS 是一个 HTTP 响应头，在现代浏览器有一个很好的支持。这个 HTTP 响应头 就是为了了防御用 iframe 嵌套的点击劫持攻击。<br/>
该响应头有三个值可选，分别是
* DENY，表示页面不允许通过 iframe 的方式展示
* SAMEORIGIN，表示页面可以在相同域名下通过 iframe 的方式展示
* ALLOW-FROM，表示页面可以在指定来源的 iframe 中展示
2. 前端做处理
```
if (self == top) {
  var style = document.getElementById('click-jack')
  document.body.removeChild(style)
} else {
  top.location = self.location
}
//以上代码的作用就是当通过 iframe 的方式加载页面时，攻击者的网页直接不显示所有内容了了
```

### 2.4 SQL注入
攻击者成功的向服务器提交恶意的SQL查询代码，程序在接收后错误的将攻击者的输入作为查询语句的一部分执行，导致原始的查询逻辑被改变，额外的执行了攻击者精心构造的恶意代码。
```
// node环境中
// 填入特殊密码
1'or'1'='1
// 拼接后的SQL
SELECT *
FROM test.user
WHERE username = 'laowang'
AND password = '1'or'1'='1'
```

防范：
1. 所有的查询语句建议使用数据库提供的参数化查询接口**，参数化的语句使用参数而不是将用户输入变量量嵌入到 SQL 语句中，即不要直接拼 SQL 语句。例如 Node.js 中的 mysqljs 库的 query方法中的 ? 占位参数。
```
/ 错误写法
const sql = `
SELECT *
FROM test.user
WHERE username = '${ctx.request.body.username}'
AND password = '${ctx.request.body.password}'
`
console.log('sql', sql)
res = await query(sql)
// 正确的写法
const sql = `
SELECT *
FROM test.user
WHERE username = ?
AND password = ?
`
console.log('sql', sql, )
res = await query(sql,[ctx.request.body.username, ctx.request.body.password])
```
2. 后端代码检查输入的数据是否符合预期，严格限制变量的类型，例如使用正则表达式进行一些匹配处理。
3. 对进入数据库的特殊字符（'，"，\，<，>，&，*，; 等）进行转义处理，或编码转换。基本上所有的后端语言都有对字符串进行转义处理的方法，比如 lodash 的 lodash._escapehtmlchar 库。


### 2.5 OS命令注入
OS命令注入和SQL注入差不多，只不过SQL注入是针对数据库的，而OS命令注入是针对操作系统的。OS命令注入攻击指通过Web应用，执行非法的操作系统命令达到攻击的目的。只要在能调用Shell函数的地方就有存在被攻击的风险。倘若调用Shell时存在疏漏，就可以执行插入的非法命令。

```
// 以 Node.js 为例，假如在接口中需要从 github 下载用户指定的 repo
const exec = require('mz/child_process').exec;
let params = {/* 用户输入的参数 */};
exec(`git clone ${params.repo} /some/path`);

//如果传入的参数是会怎样
https://github.com/xx/xx.git && rm -rf /* &&
```

### 2.6 DDOS
DDOS 里面的 DOS 是 denial of service（停止服务）的缩写，表示这种攻击的目的，就是使得服务中断。最前面的那个 D 是 distributed （分布式），表示攻击不是来自一个地方，而是来自四面八方，因此更难防。你关了前门，他从后门进来；你关了后门，他从窗口跳起来。DDOS 不是一种攻击，而是一大类攻击的总称.<br/>

攻击：
1. SYN flood(三次握手中的一次不回应)
攻击者伪造大量无效IP，不断与目标主机建立TCP链接，导致服务器维护了一个非常大的链接等待列表，占用大量系统资源，直至新链接无法建立。<br/>
这种攻击是利用了TCP三次握手的异常处理机制，即第三次握手，服务端在没有收到客户端ACK报文时，服务端会进行多次SYN+ACK重试，然后维护一个等待列表，而系统会为即将建立的TCP连接分配一部分资源。资源耗尽，系统也就无法再建立TCP连接。
2. HTTP Flood
此攻击类似于同时在多个不同计算机上反复按Web浏览器器中的刷新 - 大量HTTP请求泛滥服务器，导致拒绝服务。

防范
1. 备份网站
防范 DDOS 的第一步，就是你要有一个备份网站，或者最低限度有一个临时主页。生产服务器万一下线了，可以立刻切换到备份网站，不至于毫无办法。
2. HTTP 请求的拦截（靠谱的运营商）
专用硬件(价格高)>本机防火墙>web 服务器
3. 带宽扩容+CDN
 扩大容量，减少风险

