# Event Loop


## 一、前言

Event Loop即事件循环，是指浏览器或Node的一种解决javaScript单线程运行时不会阻塞的一种机制，也就是我们经常使用异步的原理。

为啥要弄懂`Event Loop`?

* 了解JavaScript的运行机制。
* 现在在前端领域各种技术层出不穷，掌握底层原理，可以让自己以不变，应万变





## 二、栈、队列


### 2.1 栈（Stack）

栈在计算机科学中是限定仅在表尾进行插入或删除操作的线性表。 栈是一种数据结构，它按照**后进先出**的原则存储数据，先进入的数据被压入栈底，最后的数据在栈顶，需要读数据的时候从栈顶开始弹出数据。
栈是只能在某一端插入和删除的特殊线性表。


### 2.2 队列（Queue）

在队列中插入一个队列元素称为入队，从队列中删除一个队列元素称为出队。因为队列只允许在一端插入，在另一端删除，所以只有最早进入队列的元素才能最先从队列中删除，故队列又称为**先进先出**（`FIFO—first in first out`）



## 三、分类

在`JavaScript`中，任务被分为两种，一种宏任务（`MacroTask`）也叫`Task`，一种叫微任务（`MicroTask`）。

### 3.1 MacroTask（宏任务）

* `script`全部代码、`setTimeout`、`setInterval`、`setImmediate`（浏览器暂时不支持，只有IE10支持，具体可见MDN）、`I/O`、`UI Rendering`。

### 3.2 MicroTask（微任务）

* `Process.nextTick`（Node独有）、`Promise`、`Object.observe`(废弃)





## 三、浏览器中Event Loop

`Javascript` 有一个 `main thread` 主线程和 `call-stack` 调用栈(执行栈)，所有的任务都会被放到调用栈等待主线程执行。


### 3.1 JS调用栈

JS调用栈采用的是**后进先出**的规则，当函数执行的时候，会被添加到栈的顶部，当执行栈执行完成后，就会从栈顶移出，直到栈内被清空。


### 3.2 同步任务和异步任务

`Javascript`单线程任务被分为同步任务和异步任务，同步任务会在调用栈中按照顺序等待主线程依次执行，异步任务会在异步任务有了结果后，将注册的回调函数放入任务队列中等待主线程空闲的时候（调用栈被清空），被读取到栈内等待主线程的执行。


**事件循环的进程模型**

* 选择当前要执行的任务队列，选择任务队列中最先进入的任务，如果任务队列为空即null，则执行跳转到微任务（`MicroTask`）的执行步骤。
* 将事件循环中的任务设置为已选择任务。
* 执行任务。
* 将事件循环中当前运行任务设置为null。
* 将已经运行完成的任务从任务队列中删除。
* `microtasks`步骤：进入`microtask`检查点。
* 更新界面渲染。
* 返回第一步。

**执行进入microtask检查点时，用户代理会执行以下步骤：**

* 设置`microtask`检查点标志为true。
* 当事件循环`microtask`执行不为空时：选择一个最先进入的microtask队列的`microtask`，将事件循环的`microtask`设置为已选择的`microtask`，运行`microtask`，将已经执行完成的`microtask`为null，移出`microtask`中的`microtask`。
* 设置进入`microtask`检查点的标志为false。


执行栈在执行完同步任务后，查看执行栈是否为空，如果执行栈为空，就会去检查微任务(`microTask`)队列是否为空，如果为空的话，就执行`Task`（宏任务），否则就一次性执行完所有微任务。
每次单个宏任务执行完毕后，检查微任务(`microTask`)队列是否为空，如果不为空的话，会按照先入先出的规则全部执行完微任务(`microTask`)后，设置微任务(`microTask`)队列为null，然后再执行宏任务，如此循环。


## 四、example

```
console.log('script start');

setTimeout(function() {
  console.log('setTimeout');
}, 0);

Promise.resolve().then(function() {
  console.log('promise1');
}).then(function() {
  console.log('promise2');
});
console.log('script end');

```

### 4.1 第一次执行：
```
Tasks：run script、 setTimeout callback

Microtasks：Promise then	

JS stack: script	
Log: script start、script end。
```
执行同步代码，将宏任务（`Tasks`）和微任务(`Microtasks`)划分到各自队列中。


### 4.2 第二次执行：

```
Tasks：run script、 setTimeout callback

Microtasks：Promise2 then	

JS stack: Promise2 callback	
Log: script start、script end、promise1、promise2
```

执行宏任务后，检测到微任务(`Microtasks`)队列中不为空，执行`Promise1`，执行完成`Promise`1后，调用`Promise2.then`，放入微任务(`Microtasks`)队列中，再执行`Promise2.then`。


### 4.3 第三次执行：

```
Tasks：setTimeout callback

Microtasks：	

JS stack: setTimeout callback
Log: script start、script end、promise1、promise2、setTimeout

```
当微任务(`Microtasks`)队列中为空时，执行宏任务（`Tasks`），执行`setTimeout callback`，打印日志。


### 4.4 第四次执行：

```
Tasks：setTimeout callback

Microtasks：	

JS stack: 
Log: script start、script end、promise1、promise2、setTimeout
```
清空`Tasks`队列和`JS stack`。

以上执行帧动画可以查看[Tasks, microtasks, queues and schedules](https://jakearchibald.com/2015/tasks-microtasks-queues-and-schedules/)




## 五、example2

```
console.log('script start')

async function async1() {
  await async2()
  console.log('async1 end')
}
async function async2() {
  console.log('async2 end') 
}
async1()

setTimeout(function() {
  console.log('setTimeout')
}, 0)

new Promise(resolve => {
  console.log('Promise')
  resolve()
})
  .then(function() {
    console.log('promise1')
  })
  .then(function() {
    console.log('promise2')
  })

console.log('script end')
```

这里需要先理解`async/await`。

`async/await` 在底层转换成了 `promise` 和 `then` 回调函数。
也就是说，这是 `promise` 的语法糖。
每次我们使用 `await`, 解释器都创建一个 `promise` 对象，然后把剩下的 `async` 函数中的操作放到 then 回调函数中。
`async/await` 的实现，离不开 Promise。从字面意思来理解，async 是“异步”的简写，而 `await` 是 `async wait` 的简写可以认为是等待异步方法执行完成。

**关于73以下版本和73版本的区别**
* 在老版本版本以下，先执行`promise1`和`promise2`，再执行async1。
* 在73版本，先执行`async1`再执行`promise1`和`promise2`。

**73版本**
* 首先，打印`script start`，调用`async1()`时，返回一个`Promise`，所以打印出来`async2 end`。
* 每个 `await`，会新产生一个`promise`,但这个过程本身是异步的，所以该await后面不会立即调用。
* 继续执行同步代码，打印`Promise`和`script end`，将`then`函数放入微任务队列中等待执行。
* 同步执行完成之后，检查微任务队列是否为null，然后按照先入先出规则，依次执行。
* 再回到`await`的位置执行返回的 `Promise` 的 `resolve` 函数，这又会把 `resolve` 丢到微任务队列中，打印`async1 end`
* 然后先执行打印`promise1`,此时then的回调函数返回undefinde，此时又有then的链式调用，又放入微任务队列中，再次打印`promise2`。
* 当微任务队列为空时，执行宏任务,打印`setTimeout`。


[复制文件](https://juejin.im/post/5c3d8956e51d4511dc72c200)


