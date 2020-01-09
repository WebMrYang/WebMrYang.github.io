# Promise 


## 一、 介绍
`Promise` 是异步编程的一种解决方案，比传统的解决方案——回调函数和事件——更合理和更强大。它由社区最早提出和实现，`ES6` 将其写进了语言标准，统一了用法，原生提供了 `Promise` 对象。

三种状态：（**一旦状态改变，就不会再变**）
1.  pending（进行中）
2.  fulfilled（已成功）
3.  rejected（已失败）


## 二、 使用






## 三、实现


### 3.1 简单实现

* 书写一个promise函数，包含三种状态、返回的value，只能从 pending=>fulfilled,或者 pending=>rejected;
* then 方法实现，当状态不为 pending时才可以执行then返回函数

```
const pending = 'pending';
const fulfilled = 'fulfilled';
const rejected = 'rejected';

function Promise2(fn) {
    if (fn && typeof fn !== 'function') { throw new Error('Promise resolver is not a function') }
    //当前promise对象的状态
    this.$state = pending;
    //当前promise对象的数据（成功或失败）
    this.$value = undefined;
    const resolve = (value) => {
        console.log('aaa', this)
        if (this.$state !== pending) {
            return;
        }
        this.$state = fulfilled;
        this.$value = value;
    };
    const rejected = (value) => {
        if (this.$state !== pending) {
            return;
        }
        this.$state = rejected;
        this.$value = value;
    };
    try {
        fn(resolve, rejected)
    } catch (error) {
        if (this.$state !== pending) {
            return;
        }
        this.$state = rejected;
    }
}

Promise2.prototype.then = function (fn1, fn2) {
    if (typeof fn1 !== 'function' && this.$state === fulfilled ||
        typeof fn2 !== 'function' && this.$state === rejected) {
        return this;
    }
    const value = this.$value;
    if (this.$state === fulfilled) {
        setTimeout(fn1, 0, value)
    }
    if (this.$state === rejected) {
        setTimeout(fn2, 0, value)
    }
}
this.Promise2 = Promise2;
```


### 3.2 具体实现

*   如何是同步任务则直接执行then的方法
*   当是异步任务的时候，先把then中的方法放到callbackQueue中，等待任务执行完成后调取
*   当是异步任务完成后，通过当前的状态和data值来确定callbackQueue中执行的类型和传递的值

```
const pending = 'pending';
const fulfilled = 'fulfilled';
const rejected = 'rejected';

function Promise(resolver) {
    if (resolver && typeof resolver !== 'function') {
        throw new Error('Promise resolver is not a function')
    }
    //当前promise对象的状态
    this.state = pending;
    //当前promise对象的数据（成功或失败）
    this.data = undefined;
    //当前promise对象注册的回调队列
    this.callbackQueue = [];
    //执行resove()或reject()方法
    if (resolver) executeResolver.call(this, resolver);
}
// 用于执行 new Promise(function(resolve, reject){}) 中的resove或reject方法
function executeResolver(resolver) {
    //[标准 2.3.3.3.3] 如果resove()方法多次调用，只响应第一次，后面的忽略
    var called = false, _this = this;
    function onError(value) {
        if (called) { return; }
        called = true;
        //[标准 2.3.3.3.2] 如果是错误 使用reject方法
        executeCallback.call(_this, rejected, value);
    }
    function onSuccess(value) {
        if (called) { return; }
        called = true;
        //[标准 2.3.3.3.1] 如果是成功 使用resolve方法
        executeCallback.call(_this, fulfilled, value);
    }

    // 使用try...catch执行
    //[标准 2.3.3.3.4] 如果调用resolve()或reject()时发生错误，则将状态改成rejected，并将错误reject出去
    try {
        resolver(onSuccess, onError);
    } catch (e) {
        onError(e);
    }
}
// 用于执行成功或失败的回调 new Promise((resolve, reject) => { resolve(1)或 reject(1) })
function executeCallback(type, x) {
    var isResolve = type === fulfilled, thenable;
    // [标准 2.3.3] 如果x(成功或者失败返回的value)是一个对象或一个函数
    if (isResolve && (typeof x === 'object' || typeof x === 'function')) {
        //[标准 2.3.3.2]
        try {
            thenable = getThen(x);
        } catch (e) {
            return executeCallback.call(this, rejected, e);
        }
    }
    if (isResolve && thenable) {
        executeResolver.call(this, thenable);
    } else {
        //[标准 2.3.4]
        this.state = isResolve ? fulfilled : rejected;
        this.data = x;
        this.callbackQueue && this.callbackQueue.length && this.callbackQueue.forEach(v => v[type](x));
    }
    return this;
}
//用于判断是否是thenable对象，如果是，则返回一个执行thenable中then方法的函数
function getThen(obj) {
    var then = obj && obj.then;
    if (obj && typeof obj === 'object' && typeof then === 'function') {
        return function appyThen() {
            then.apply(obj, arguments);
        };
    }
}
Promise.prototype.then = function (onResolved, onRejected) {
    //[标准 2.2.1 - 2.2.2] 状态已经发生改变并且参数不是函数时，则忽略
    if (typeof onResolved !== 'function' && this.state === fulfilled ||
        typeof onRejected !== 'function' && this.state === rejected) {
        return this;
    }
    // 实例化一个新的Promise对象
    var promise = new this.constructor();
    // 一般情况下，状态发生改变时，走这里
    if (this.state !== pending) {
        var callback = this.state === fulfilled ? onResolved : onRejected;
        // 将上一步 resolve(value)或rejecte(value) 的 value 传递给then中注册的 callback
        // [标准 2.2.4] 异步调用callback
        executeCallbackAsync.call(promise, callback, this.data);
        // callback[this.state] && callback[this.state](this.data)
    } else {
        // var promise = new Promise(resolve=>resolve(1)); promise.then(...); promise.then(...); ...
        // 一个实例执行多次then, 这种情况会走这里 [标准 2.2.6]
        // this.callbackQueue.forEach(v => v[type](x));
        this.callbackQueue.push(new CallbackItem(promise, onResolved, onRejected))
    }

    // 返回新的实例 [标准 2.2.7]
    return promise;
}
// 用于异步执行 .then(onResolved, onRejected) 中注册的回调
function executeCallbackAsync(callback, value) {
    var _this = this;
    setTimeout(function () {
        var res;
        try {
            res = callback(value);
        } catch (e) {
            return executeCallback.call(_this, rejected, e);
        }
        //判断不能返回当前promise，也就是不能写retrun this;this代表当前new this.constructor()生成的prmise;
        if (res !== _this) {
            return executeCallback.call(_this, fulfilled, res);
        } else {
            return executeCallback.call(_this, rejected, new TypeError('Cannot resolve promise with itself'));
        }
    }, 1)
}
//这里最好不要用 setTimeout ，使用 setTimeout 可以异步执行回调，但其实并不是真正的异步线程，
//而是利用了浏览器的 Event Loop 机制去触发执行回调，而浏览器的事件轮循时间间隔是 4ms ，
//所以连接的调用 setTimeout 会有 4ms 的时间间隔，而在Nodejs 中的 Event Loop 时间间隔是 1ms，
//所以会产生一定的延迟，如果promise链比较长，延迟就会越明显，这里可以引入NPM上的 immediate 模块来异步无延迟的执行回调。

// 用于注册then中的回调 .then(resolvedFn, rejectedFn)
function CallbackItem(promise, onResolved, onRejected) {
    this.promise = promise;
    // 为了保证在promise链中，resolve或reject的结果可以一直向后传递，可以默认给then添加resolvedFn和rejectedFn
    this.onResolved = typeof onResolved === 'function' ? onResolved : function (v) { return v };
    this.onRejected = typeof onRejected === 'function' ? onRejected : function (v) { throw v };
}
CallbackItem.prototype.fulfilled = function (value) {
    //调用时异步调用 [标准 2.2.4]
    executeCallbackAsync.call(this.promise, this.onResolved, value);
}
CallbackItem.prototype.rejected = function (value) {
    //调用时异步调用 [标准 2.2.4]
    executeCallbackAsync.call(this.promise, this.onRejected, value);
}

Promise.prototype['catch'] = function (onRejected) {
    return this.then(null, onRejected);
}
```


## 4 具体实现

*  [了解promise](http://coderlt.coding.me/2016/12/04/promise-in-depth-an-introduction-2/)
* [实现](https://github.com/git-lt/MPromise/blob/master/promise.js)