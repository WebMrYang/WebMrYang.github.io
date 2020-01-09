# koa

## 一、介绍

Koa 是一个新的 web 框架，由 Express 幕后的原班人马打造， 致力于成为 web 应用和 API 开发领域中的一个更小、更富有表现力、更健壮的基石。 通过利用 async 函数，Koa 帮你丢弃回调函数，并有力地增强错误处理。 Koa 并没有捆绑任何中间件， 而是提供了一套优雅的方法，帮助您快速而愉快地编写服务端应用程序。

## 二、特点

koa 只是提供一个简单的架子，几乎所有的功能都由第三方中间件完成

1. 轻量，无捆绑
2. 中间件架构
3. 优雅的API设计（把原生的res.end,res.writeHead 等命令进行处理，更加清晰）
4. 增强的错误处理 （async的语法出现错误可以传递到顶层）

## 三、实现

### 3.1 使用

```
const koa=require('koa);
const app=new koa();
app.use(ctx=>{
    ctx.body='Hello Koa!'
})
app.listen('30001)

```

### 3.2 koa实现逻辑

1. koa 实现整体还是使用的http 发送请求,进行服务的启停
    在 koa源码的 application文件中，我们可以看到执行listen 方法的时候，其实是在创建一个http服务

```
// 启动服务
listen(...args) {
    debug('listen');
    const server = http.createServer(this.callback());
    return server.listen(...args);
  }
```

2. 对 服务请求返回的res，req 进行处理，通过 get，set 进行代理，代理到 context上
    在创建http 服务时候执行 this.callback(); 在这个方法中外卖可以看到 返回一个 handleRequest 方法，在这里将对req,res进行 处理，
    新建一个上下文对象context，在context 中 使用 delegates 插件，把当前 请求在context中的attr 代理到this.request或者this.responese;
    在 request.js 和 responese.js 文件中，通过 set 和get 方法 把 当前的属性代理到 this.req[attr]或者 this.res[attr];
    这样就可以实现属性的代理

```
    callback() {
    const fn = compose(this.middleware);
    if (!this.listenerCount('error')) this.on('error', this.onerror);

    const handleRequest = (req, res) => {
        // 返回一个 context 对象，对req，res 中的属性进行代理
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    };

    return handleRequest;
  }
  // 处理返回一个context 对象
  createContext(req, res) {
    const context = Object.create(this.context);// Object.create 可以继承set，get方法；结构性赋值和JSON.stringify和不能，
    const request = context.request = Object.create(this.request);
    const response = context.response = Object.create(this.response);
    context.app = request.app = response.app = this;
    context.req = request.req = response.req = req;
    context.res = request.res = response.res = res;
    request.ctx = response.ctx = context;
    request.response = response;
    response.request = request;
    context.originalUrl = request.originalUrl = req.url;
    context.state = {};
    return context;
  }
  // 在context 中
  delegate(proto, 'response') // 使用delegates 吧 response中的属性代理到context 上
  .method('attachment')// 代理的是方法
  .access('status') //可读可写
  .getter('writable'); //可读
  // 在request 中
  {
      get header() {
        return this.req.headers;
    },
  }
```

3. 使用compose 实现 中间件架构
    compose 实现是对使用use 传递进来的function 进行处理，如果不是function 会报错
    主要实现代码

```
function compose (middleware) {
  return function (context, next) {
    // last called middleware #
    let index = -1
    // 刚进来先执行第一个函数
    return dispatch(0)
    function dispatch (i) {
      if (i <= index) return Promise.reject(new Error('next() called multiple times'))
      index = i
      let fn = middleware[i]
      // 这里加一个默认最后执行的next方法
      if (i === middleware.length) fn = next
      if (!fn) return Promise.resolve()
      try {
        return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
      } catch (err) {
        return Promise.reject(err)
      }
    }
  }
}
```


## 四、插件

### 4.1 koa-router 路由

```
const Koa = require('koa');
// 直接调用的方式
const router = require('koa-router')();
// 或 单独创建router的实例
const Router = require('koa-router');
const router = new Router();

router.get('/', async ctx => {
    ctx.body = 'Hello Router';
})

// 启动路由
app.use(router.routes()).use(router.allowedMethods())
// 以上为官方推荐方式，allowedMethods用在routes之后，作用是根据ctx.status设置response header.

app.listen(3000, err => {
    if (err) throw err;
    console.log('runing...');
});
```

### 4.2 koa-bodyparser post 提交数据中间件

```
const bodyParser = require('koa-bodyparser');
app.use(bodyParser());
```

### 4.3 koa-static 静态目录

```
app.use(require('koa-static')(path.join(__dirname, 'static')));
```


### 4.4 koa-session  session管理中间件

```
const Koa = require('koa');
const session = require('koa-session');

const app = new Koa();

app.keys = ['some secret hurr'];
 
const CONFIG = {
  key: 'koa:sess',      // 返给浏览器 cookie 的key 默认是 'kao:sess'
  maxAge: 86400000,     // cookie的过期时间 maxAge in ms (default is 1 days)
  autoCommit: true,     // (boolean) 自动给客户端下发cookie 并设置session
  overwrite: true,      // 是否可以覆盖之前同名的cookie    (默认default true)
  httpOnly: true,       // cookie是否只有服务器端可以访问 httpOnly or not (default true)
  signed: true,         // 签名默认true
  rolling: false,       // 在每次响应时强制设置session标识符cookie，到期时被重置设置过期倒计时。（默认为false）
  renew: false,         // 当session快过期时更新session，这样就可以始终保持用户登录 默认是false
};
```

### 4.5 koa2-cors 跨域处理

```
const cors = require('koa2-cors')
app.use(cors())
```


### 4.6 nodemailer 发邮件

```
const nodemailer = require("nodemailer")

async function main() {
  let transporter = nodemailer.createTransport({
    host: "smtp.qq.com",
    port: 465,
    secure: true, // true for 465, false for other ports
    auth: {
      user: 'test@qq.com', 
      pass: 'akphfubplzqdbdfh'
    }
  })

  let info = await transporter.sendMail({
    from: 'test@qq.com', // sender address
    to: "bar@qq.com", // 接收地址 多个邮箱使用 ','分割
    subject: "Hello 老胖", // 邮件主题
    text: "胖子蹲啊胖子蹲胖子蹲完瘦子蹲", // plain text body
    // html: "<b>嗯好</b>" // html body
  })

  console.log("Message sent: %s", info.messageId)
  console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info))
}
```

1. 创建transporter配置信息
在node_modules>nodemailer>lib>well_known>services.json中查看对应的配置信息。配置发件邮箱相应的host、port及secure。

2. 获取发件箱密码（类似于授权，获取key），以qq邮箱为例
qq邮箱>设置>账户>POP3/IMAP/SMTP/Exchange/CardDAV/CalDAV服务，点击开启获取pass
配置user和pass

3. user即发件地址
pass就是刚才授权获取的密码
sendMail配置信息

4. from 发件地址
to 收件地址 如果多个收件地址，用 ,分割即可
subject 邮件主题
text 文件内容
html html内容


### 4.7 错误处理

```
app.use(async (ctx, next)=> {
    await next();
    if(ctx.status === 404){
        ctx.body="404页面"
    }
});
```