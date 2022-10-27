# JavaScript 异步处理方式

## Promise

Promise 是一个对象，它代表了一个异步操作的最终完成或者失败。

一个 Promise 必然处于以下几种状态之一：

-   待定（pending）: 初始状态，既没有被兑现，也没有被拒绝。
-   完成（fulfilled）: 意味着操作成功完成。
-   拒绝（rejected）: 意味着操作失败。



**基本使用：**

```js
let p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("p1");
    }, 1000);
});
console.log(p1);
```



### Promise.all

> 当传入的 Promise 对象全部执行成功后返回成功，当传入的 Promise 对象有一个执行失败后立即返回失败。

**语法：**

```js
Promise.all(iterable);
```

**参数说明：**

-   iterable：一个可迭代的对象，例如 Array，其中每个成员都是 Promise。

**示例：**

```js
let p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("p1");
    }, 1000);
});

let p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject("p2");
    }, 1500);
});

let p3 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("p3");
    }, 2000);
});

let res = Promise.all([p1, p2, p3]);
console.log(res);
```



### Promise.allSettled

> 等所有传入的 Promise 都执行完后返回一个数组，数组中每个元素对应传入的 Promise 的结果。

**语法：**

```js
Promise.allSettled(iterable);
```

**参数说明：**

-   iterable：一个可迭代的对象，例如 Array，其中每个成员都是 Promise。

**示例：**

```js
let p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("p1");
    }, 1000);
});

let p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject("p2");
    }, 1500);
});

let p3 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("p3");
    }, 2000);
});

let res = Promise.allSettled([p1, p2, p3]);
console.log(res);
```



### Promise.any

> 返回第一个成功的 Promise，如果所有传入的 Promise 都没成功，则返回失败的 Promise。

**语法：**

```js
Promise.any(iterable);
```

**参数说明：**

-   iterable：一个可迭代的对象，例如 Array，其中每个成员都是 Promise。

**示例：**

```js
let p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("p1");
    }, 1000);
});

let p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject("p2");
    }, 1500);
});

let p3 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("p3");
    }, 2000);
});

let res = Promise.any([p1, p2, p3]);
console.log(res);
```



### Promise.race

> 返回第一个执行完成的 Promise（不管成功或者失败）。

**语法：**

```js
Promise.race(iterable);
```

**参数说明：**

-   iterable：一个可迭代的对象，例如 Array，其中每个成员都是 Promise。

**示例：**

```js
let p1 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("p1");
    }, 1000);
});

let p2 = new Promise((resolve, reject) => {
    setTimeout(() => {
        reject("p2");
    }, 1500);
});

let p3 = new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("p3");
    }, 500);
});

let res = Promise.race([p1, p2, p3]);
console.log(res);
```



### Promise.reject

> 返回一个失败的 Promise。

**语法：**

```js
Promise.reject(reason);
```

**参数说明：**

-   reason：失败的原因。

**示例：**

```js
let res = Promise.reject("123");
console.log(res);
```



### Promise.resolve

> 返回一个成功的 Promise。

**语法：**

```js
Promise.resolve(reason);
```

**参数说明：**

-   reason：成功后的数据。

**示例：**

```js
let res = Promise.resolve({ name: "Best Shi" });
console.log(res);
```

<img :src="$withBase('/images/bestshi.com_2021-04-30_18-09-57.jpg')">

### 实例方法 .then

> Promise 状态改变后触发。返回一个 Promise。
>
> 一般用于处理成功 Promise。

**语法：**

```js
p.then(onFulfilled[, onRejected]);
```

**参数说明：**

-   onFulfilled：Promise 状态变为成功后的回调函数。
-   onRejected：Promise 状态变为失败后的回调函数。（可选）

**示例：**

```js
new Promise((resolve, reject) => {
    setTimeout(() => {
        resolve("成功");
    }, 1000);
}).then((res) => {
    console.log(res); // 成功
});
```

### 实例方法 .catch

> 用于处理失败的 Promise。能捕获到 throw 抛出的异常。

**语法：**

```js
p.catch(onRejected);
```

**参数说明：**

-   onRejected：Promise 状态变为失败后的回调函数。

**示例：**

```js
new Promise((resolve, reject) => {
    setTimeout(() => {
        reject("失败");
    }, 1000);
}).catch((err) => {
    console.log(err); // 失败
});

new Promise((resolve, reject) => {
    throw "error";
}).catch((res) => {
    console.log(res); // error
});
```

### 实例方法 .finally

> 在 promise 结束时，无论结果是 fulfilled 或者是 rejected，都会执行指定的回调函数。
>
> 返回一个设置了 finally 回调函数的 Promise 对象。

**语法：**

```js
p.finally(onFinally);
```

**参数说明：**

-   onFinally: Promise 结束后调用的 Function。

**示例：**

```js
new Promise((resolve, reject) => {
    setTimeout(() => {
        reject("失败");
    }, 1000);
}).finally((err) => {
    console.log(err); // 失败
});
```

## async await

> async function 关键字用来在表达式中定义异步函数。
> await 操作符用于等待一个 Promise 对象。它只能在异步函数 async function 中使用。

**示例：**

```js
let get = () => {
    return new Promise((resolve, reject) => {
        setTimeout(() => {
            resolve("成功");
        }, 2000);
    });
};

async function fn() {
    let res = await get();
    console.log(res);
    console.log(123);
}

fn();
```

## generator

> function\* 这种声明方式(function 关键字后跟一个星号）会定义一个生成器函数 (generator function)，它返回一个 Generator 对象。
>
> 生成器函数在执行时能暂停，后面又能从暂停处继续执行。

**语法：**

```js
function* name([param[, param[, ... param]]]) { statements }
```

-   name：函数名。
-   param：函数参数。
-   statements：函数体。

```js
function* gen() {
    yield "一";
    yield "二";
}

let gen_obj = gen();
console.log(gen_obj.next()); // {value: "一", done: false}
console.log(gen_obj.next()); // {value: "二", done: false}
console.log(gen_obj.next()); // {value: undefined, done: true}
```

**yield 语法：**

```js
[rv] = yield[expression];
```

-   expression：从生成器返回的值。
-   rv：从 next()传入的值。

### Generator.prototype.next()

> 返回一个由 yield 表达式生成的值。包含属性 done 和 value 的对象。该方法也可以通过接受一个参数用以向生成器传值。

```js
function* gen() {
    let val = yield "hello";
    console.log(val); // 你好
    yield "world";
}

let g = gen();
console.log(g.next()); // {value: "hello", done: false}
console.log(g.next("你好")); // {value: "world", done: false}
console.log(g.next()); // {value: undefined, done: true}
```



### Generator.prototype.return()

> 返回给定的值并结束生成器。

```js
function* gen() {
    yield "hello";
    yield "world";
    yield "123";
}

let g = gen();
console.log(g.next()); // {value: "hello", done: false}
console.log(g.return("aaa")); // {value: "aaa", done: true}
console.log(g.next()); // {value: undefined, done: true}
```

### Generator.prototype.throw()

> 向生成器抛出一个错误。

```js
function* gen() {
    try {
        yield 20;
    } catch (error) {
        console.log(error); // 错误
    }
}

let g = gen();
console.log(g.next()); // {value: 20, done: false}
console.log(g.throw(new Error("错误"))); // {value: undefined, done: true}
```

<img :src="$withBase('/images/bestshi.com_2021-04-30_20-41-27.jpg')">

## 金典面试题

**写出下面代码答应顺序：**

```js
setTimeout(() => {
    console.log("setTimeout");
}, 0);
async function async1() {
    console.log("async1 start");
    await async2();
    console.log("async1 end");
}

async function async2() {
    console.log("async2");
}
console.log("script start");
async1();
console.log("script end");
```

```js
script start
async1 start
async2
script end
async1 end
setTimeout
```
