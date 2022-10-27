# 虚拟 DOM 与 diff 算法

**虚拟 DOM：**

-   用 JavaScript 对象描述 DOM 的层次结构。DOM 中的一切属性都在虚拟 DOM 中有对应的属性。

## snabbdom 库安装



Snabbdom 由一个非常简单，高性能和可扩展的内核组成，仅约 200 SLOC。 它提供了具有丰富功能的模块化体系结构，可通过自定义模块进行扩展。 为了使核心保持简单，所有非必要功能都委托给模块



```shell
npm install -D snabbdom
```

## snabbdom 测试环境搭建

### 安装依赖

```shell
npm install -D webpack webpack-cli webpack-dev-server html-webpack-plugin
```



### 配置 webpack.config.js 文件

```js
const { resolve } = require("path");
const HTMLWebpackPlugin = require("html-webpack-plugin");

module.exports = {
    entry: "./src/js/index.js",
    output: {
        path: resolve(__dirname, "dist"),
        filename: "js/index.js",
    },
    plugins: [
        new HTMLWebpackPlugin({
            template: "./src/index.html",
        }),
    ],
    devServer: {
        contentBase: resolve(__dirname, "dist"),
        port: 8001,
        open: true,
    },
};
```

### 运行测试案例

```js
import { init } from "snabbdom/init";
import { classModule } from "snabbdom/modules/class";
import { propsModule } from "snabbdom/modules/props";
import { styleModule } from "snabbdom/modules/style";
import { eventListenersModule } from "snabbdom/modules/eventlisteners";
import { h } from "snabbdom/h"; // helper function for creating vnodes

const patch = init([
    // Init patch function with chosen modules
    classModule, // makes it easy to toggle classes
    propsModule, // for setting properties on DOM elements
    styleModule, // handles styling on elements with support for animations
    eventListenersModule, // attaches event listeners
]);

const container = document.getElementById("container");

const vnode = h("div#container.two.classes", { on: { click: () => {} } }, [
    h("span", { style: { fontWeight: "bold" } }, "This is bold"),
    " and this is just normal text",
    h("a", { props: { href: "/foo" } }, "I'll take you places!"),
]);
// Patch into empty DOM element – this modifies the DOM as a side effect
patch(container, vnode);

const newVnode = h("div#container.two.classes", { on: { click: () => {} } }, [
    h(
        "span",
        { style: { fontWeight: "normal", fontStyle: "italic" } },
        "This is now italic type"
    ),
    " and this is still just normal text",
    h("a", { props: { href: "/bar" } }, "I'll take you places!"),
]);
// Second `patch` invocation
patch(vnode, newVnode); // Snabbdom efficiently updates the old view to the new state
```

## 虚拟 DOM 与 h 函数学习

 **h 函数**

h 函数用来生成虚拟节点（vnode）。

**参数：**

-   sel：标签名称
-   props：标签属性
-   children：子节点

**返回值：**

-   children：表示子元素。
-   data：元素属性。
-   elm：表示是否上树。
-   key：元素唯一标识。
-   sel：表示选择器。
-   text：元素中的文字。



### 案例

```js
// 创建patch函数
const patch = init([
    classModule,
    propsModule,
    styleModule,
    eventListenersModule,
]);

// 创建虚拟节点
let myVnode = h("ul", [
    h("li", {}, "苹果"),
    h("li", { class: { active: true } }, "香蕉"),
]);

// 虚拟DOM上树
const container = document.getElementById("container");
patch(container, myVnode);
```



### 手写低配版 h 函数

**vnode 函数：**

```js
// vnode就是把传入的5个参数组合成对象返回

export default function vnode(sel, data, children, text, elm) {
    return {
        sel,
        data,
        children,
        text,
        elm,
    };
}
```

**h 函数：**

```js
import vnode from "./vnode.js";

/**
 * 这个函数只实现3个参数功能，缺一不可
 * 调用形态必须为下面三种之一：
 *  形态① h('div', {}, '文字')
 *  形态② h('div', {}, [])
 *  形态③ h('div', {}, h())
 */

export default function h(sel, data, c) {
    // 检测参数个数
    if (arguments.length !== 3) throw new Error("h函数必须传入三个参数");

    // 检测参数c的类型

    if (typeof c === "string" || typeof c === "number") {
        // 说明是形态①
        return vnode(sel, data, undefined, c, undefined);
    } else if (Array.isArray(c)) {
        // 说明是形态②
        // 收集children
        let children = [];
        for (let i = 0; i < c.length; i++) {
            // 检测c[i]
            if (!(typeof c[i] === "object" && c[i].hasOwnProperty("sel")))
                throw new Error("传入的数组参数中有项不是h函数");
            children.push(c[i]);
        }
        return vnode(sel, data, children, undefined, undefined);
    } else if (typeof c === "object" && c.hasOwnProperty("sel")) {
        // 说明是形态③
        // 传入的c是唯一的children
        return vnode(sel, data, [c], undefined, undefined);
    } else {
        throw new Error("传入的第三个参数类型不对");
    }
}
```

**测试：**

```js
// 引入自己的h函数
import h from "./mySnabbdom/h.js";

import { init } from "snabbdom/init";
import { classModule } from "snabbdom/modules/class";
import { propsModule } from "snabbdom/modules/props";
import { styleModule } from "snabbdom/modules/style";
import { eventListenersModule } from "snabbdom/modules/eventlisteners";

// 创建patch函数
const patch = init([
    classModule,
    propsModule,
    styleModule,
    eventListenersModule,
]);

let myVnode1 = h("div", {}, [
    h("p", {}, "你好"),
    h("p", {}, "你好"),
    h("p", {}, h("span", {}, "hello")),
]);

// 虚拟DOM上树
const container = document.getElementById("container");
patch(container, myVnode1);
```



## diff 算法



-   diff 算法可以进行精细化比对，实现最小量更新。
-   diff 算法只发生在虚拟 DOM 上。
-   新虚拟 DOM 和老虚拟 DOM 进行 diff（精细化比较），算出应该如何最小量更新，最后反映到真正的 DOM

-   diff 只进行同层比较，不会进行跨层比较。即使是同一片虚拟节点，但是跨层了，diff 不进行比较，而是直接删除旧的，然后插入新的。
-   diff 只有是同一个虚拟节点（选择器相同，kye 相同视为同一个节点），才会进行精细化比较，否则直接删除旧的，然后插入新的。
-   diff 同一节点内会实现精细化比较，当然，key 很重要，key 是这个节点的唯一标识，告诉 diff 算法，在更新前后它们是同一个节点。

**diff 算法流程图(简易版本)**



### diff 算法工作流程



-   1、patch 函数调用，接收两个值，旧虚拟 DOM（oldVnode）与新虚拟 DOM（vnode）。
-   2、判断 oldVnode 是否是虚拟节点。
    -   不是虚拟节点：通过 vnode 函数将 oldVnode 转换成虚拟节点。
-   3、oldVnode 是虚拟节点，则判断 oldVnode 与 vnode 是否是同一个节点。
    -   不是同一个节点：插入新节点，删旧节点。
-   4、是同一个节点，则判断 oldVnode 与 vnode 是不是内存种的同一个对象。
    -   是同一个对象：什么都不做。
-   5、不是同一个对象，则判断 vnode 有没有 text。
    -   有 text：判断 oldVnode 的 text 与 vnode 的 text 是否相同。
        -   text 相同：什么都不做。
        -   text 不相同：则把 oldVnode.elm 中的 innerText 改为 newVnode 的 text。
-   6、vnode 没有 text，则判读 children。
    -   vnode 中有 children：清空 oldVnode 中的 text，并且把 vnode 的 children 添加到 DOM 中。
    -   oldVnode 中有 children：清空 oldVnode 中的 children。
    -   oldVnode 中有 text：清空 oldVnode 中的 text。
-   7、oldVnode 与 vnode 中都有 children，则进行精细化比较。精细化比较提供四种命中方式：
    1. 新前与旧前（命中后，新前与旧前指针++）
    2. 新后与旧后（命中后，新增指针++，旧后指针--）
    3. 新后与旧前（命中后，新前指向的节点，移动到旧后之后新后指针--，旧前指针++）
    4. 新前与旧后（命中后，新前指向的节点，移动到旧前之前新前指针++，旧后指针--）
-   8、如果四种命中方式都没命中，则进行循环查找，如果没有找到，则新曾的节点，插入到当前旧前指针之前；如果找到，则判断新旧节点 sel，相同则新曾的节点，插入到当前旧前指针之前，不相同则进行 patchVnode，把旧节点标记为 undefined，新插入到当前旧前指针之前。循环完以后新前指针++。



### diff 算法简易版代码



**crateElement：**

```js
/**
 * 创建节点
 */

export default function createElement(vnode) {
    // 创建一个DOM节点
    let domNode = document.createElement(vnode.sel);

    // 判断是有子节点还是文本
    if (
        vnode.text != "" &&
        (vnode.children == undefined || vnode.children.length == 0)
    ) {
        // 是文本
        domNode.innerText = vnode.text;
    } else if (Array.isArray(vnode.children) && vnode.children.length > 0) {
        // 是节点
        for (let i = 0; i < vnode.children.length; i++) {
            // 当前的children
            let ch = vnode.children[i];
            // 创建出它的DOM
            let chDOM = createElement(ch);
            // 上树
            domNode.appendChild(chDOM);
        }
    }
    // 补充elm属性
    vnode.elm = domNode;
    // 返回elm，elm是一个纯DOM对象
    return vnode.elm;
}
```

**patch：**

```js
import vnode from "./vnode.js";
import createElement from "./createElement.js";
import patchVnode from "./patchVnode.js";

export default function patch(oldVnode, newVnode) {
    // 判断传入的一个参数，是DOM节点还是虚拟节点
    if (oldVnode.sel == "" || oldVnode.sel == undefined) {
        // oldVnode是DOM节点
        oldVnode = vnode(
            oldVnode.tagName.toLowerCase(),
            {},
            [],
            undefined,
            oldVnode
        );
    }

    // 判断oldVnode和newVnode是不是同一个节点
    if (oldVnode.key == newVnode.key && oldVnode.sel == newVnode.sel) {
        patchVnode(oldVnode, newVnode);
    } else {
        let newVnodeElm = createElement(newVnode);

        // 插入到老节点之前
        if (oldVnode.elm.parentNode && newVnodeElm) {
            oldVnode.elm.parentNode.insertBefore(newVnodeElm, oldVnode.elm);
        }

        // 删除老节点
        oldVnode.elm.parentNode.removeChild(oldVnode.elm);
    }
}
```

**patchVnode：**

```js
import createElement from "./createElement.js";
import updateChildren from "./updateChildren.js";

export default function patchVnode(oldVnode, newVnode) {
    // 判读新旧vnode是不是同一个
    if (oldVnode == newVnode) return;
    // 判断vnode有没有text属性
    if (
        newVnode.text != undefined &&
        (newVnode.children == undefined || newVnode.children.length == 0)
    ) {
        // 新vnode有text属性
        if (newVnode.text != oldVnode.text) {
            oldVnode.elm.innerText = newVnode.text;
        }
    } else {
        // 新vnode没有text属性

        // 判断老的有没有children
        if (oldVnode.children != undefined && oldVnode.children.length > 0) {
            // 新老节点都有children
            updateChildren(oldVnode.elm, oldVnode.children, newVnode.children);
        } else {
            // 老的没有children，新的有children
            oldVnode.elm.innerHTML = "";
            for (let i = 0; i < newVnode.children.length; i++) {
                let dom = createElement(newVnode.children[i]);
                oldVnode.elm.appendChild(dom);
            }
        }
    }
}
```

**updateChildren：**

```js
import patchVnode from "./patchVnode.js";
import createElement from "./createElement.js";

// 判断是否是同一个虚拟节点
function sameVnode(a, b) {
    return a.sel == b.sel && a.key == b.key;
}

export default function updateChildren(parentElm, oldCh, newCh) {
    // 旧前
    let oldStartIdx = 0;
    // 新前
    let newStartIdx = 0;
    // 旧后
    let oldEndIdx = oldCh.length - 1;
    // 新后
    let newEndIdx = newCh.length - 1;
    // 旧前节点
    let oldStartVnode = oldCh[0];
    // 新前节点
    let newStartVnode = newCh[0];
    // 旧后节点
    let oldEndVnode = oldCh[oldEndIdx];
    // 新后节点
    let newEndVnode = newCh[newEndIdx];

    let keyMap = null;

    while (oldStartIdx <= oldEndIdx && newStartIdx <= newStartIdx) {
        if (oldStartVnode == null || oldCh[oldStartIdx] == undefined) {
            oldStartVnode = oldCh[++oldStartIdx];
        } else if (oldEndVnode == null || oldCh[oldEndIdx] == undefined) {
            oldEndVnode = oldCh[--oldEndIdx];
        } else if (newStartVnode == null || newCh[newStartIdx] == undefined) {
            newStartVnode = newCh[++newStartIdx];
        } else if (newEndVnode == null || newCh[newEndIdx] == undefined) {
            newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldStartVnode, newStartVnode)) {
            // 新前与旧前是同一个节点
            patchVnode(oldStartVnode, newStartVnode);
            // 移动指针
            oldStartVnode = oldCh[++oldStartIdx];
            newStartVnode = newCh[++newStartIdx];
        } else if (sameVnode(oldEndVnode, newEndVnode)) {
            // 新后与旧后是同一个节点
            patchVnode(oldEndVnode, newEndVnode);
            // 移动指针
            oldEndVnode = oldCh[--oldEndIdx];
            newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldStartVnode, newEndVnode)) {
            // 新后与旧前是同一个节点
            patchVnode(oldStartVnode, newEndVnode);
            // 移动到旧后之后
            parentElm.insertBefore(
                oldStartVnode.elm,
                oldEndVnode.elm.nextSibling
            );
            // 移动指针
            oldStartVnode = oldCh[++oldStartIdx];
            newEndVnode = newCh[--newEndIdx];
        } else if (sameVnode(oldEndVnode, newStartVnode)) {
            // 新前与旧后是同一个节点
            patchVnode(oldEndVnode, newStartVnode);
            // 移动到旧前之前
            parentElm.insertBefore(oldEndVnode.elm, oldStartVnode.elm);
            // 移动指针
            newStartVnode = newCh[++newStartIdx];
            oldEndVnode = oldCh[--oldEndIdx];
        } else {
            // 四种都没命中

            if (!keyMap) {
                keyMap = {};
                for (let i = oldStartIdx; i <= oldEndIdx; i++) {
                    const key = oldCh[i].key;
                    if (key != undefined) {
                        keyMap[key] = i;
                    }
                }
            }
            const idxInOld = keyMap[newStartVnode.key];

            if (idxInOld == undefined) {
                parentElm.insertBefore(
                    createElement(newStartVnode),
                    oldStartVnode.elm
                );
            } else {
                // 不是全新的项,需要移动
                const elmToMove = oldCh[idxInOld];
                patchVnode(elmToMove, newStartVnode);
                // 把这项设置为undefined
                oldCh[idxInOld] = undefined;
                parentElm.insertBefore(elmToMove.elm, oldStartVnode.elm);
            }
            newStartVnode = newCh[++newStartIdx];
        }
    }

    // 看有没有剩余
    if (newStartIdx <= newEndIdx) {
        for (let i = newStartIdx; i <= newEndIdx; i++) {
            parentElm.insertBefore(createElement(newCh[i]), oldCh[oldStartIdx]);
        }
    } else if (oldStartIdx <= oldEndIdx) {
        for (let i = oldStartIdx; i <= oldEndIdx; i++) {
            if (oldCh[i]) {
                parentElm.removeChild(oldCh[i].elm);
            }
        }
    }
}
```

**vnode：**

```js
// vnode就是把传入的5个参数组合成对象返回

export default function vnode(sel, data, children, text, elm) {
    const key = data.key;
    return {
        sel,
        data,
        children,
        text,
        elm,
        key,
    };
}
```
