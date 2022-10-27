# Composition API(常用部分)

## Composition API(常用部分)

### 1、setup

-   新的 option, 所有的组合 API 函数都在此使用, 只在初始化时执行一次
-   函数如果返回对象, 对象中的属性或方法, 模板中可以直接使用

### 2、ref

-   作用: 定义一个数据的响应式
-   语法: const xxx = ref(initValue):
    -   创建一个包含响应式数据的引用(reference)对象
    -   js 中操作数据: xxx.value
    -   模板中操作数据: 不需要.value
-   一般用来定义一个基本类型的响应式数据

**vue3 实现点击按钮更新数据：**

```vue
<template>
    <h2>setup与ref使用</h2>
    <h3>{{ count }}</h3>
    <button @click="update">更新数据</button>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
    name: "App",
    setup() {
        let count = ref(1);

        function update() {
            count.value++;
        }

        return {
            count,
            update,
        };
    },
});
</script>
```

**vue2 实现点击按钮更新数据：**

```vue
<template>
    <h2>setup与ref使用</h2>
    <h3>{{ count }}</h3>
    <button @click="update">更新数据</button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "App",
    data() {
        return {
            count: 1,
        };
    },
    methods: {
        update() {
            this.count++;
        },
    },
});
</script>
```

### 3、reactive

-   作用: 定义多个数据的响应式
-   const proxy = reactive(obj): 接收一个普通对象然后返回该普通对象的响应式代理器对象
-   响应式转换是“深层的”：会影响对象内部所有嵌套的属性
-   内部基于 ES6 的 Proxy 实现，通过代理对象操作源对象内部数据都是响应式的

**示例代码**

```vue
<template>
    <h2>reactive基本使用</h2>
    <h3>姓名: {{ user.name }}</h3>
    <h3>年龄: {{ user.age }}</h3>
    <h3>老婆: {{ user.wife.name }}</h3>
    <h3>车: {{ user.car.join("、") }}</h3>
    <button @click="update">更新数据</button>
</template>

<script lang="ts">
import { defineComponent, reactive } from "vue";

export default defineComponent({
    name: "App",
    setup() {
        let obj = {
            name: "小明",
            age: 20,
            car: ["奔驰", "奥迪"],
            wife: {
                name: "小红",
                age: 18,
            },
        };
        let user = reactive(obj);
        const update = () => {
            user.age = 25;
            user.wife.age = 23;
            user.car.push("玛莎拉蒂", "保时捷");
        };
        return {
            user,
            update,
        };
    },
});
</script>
```



### 4、Vue2 与 Vue3 的响应式比较

#### vue2 的响应式

-   核心:

    -   对象: 通过 defineProperty 对对象的已有属性值的读取和修改进行劫持(监视/拦截)
    -   数组: 通过重写数组更新数组一系列更新元素的方法来实现元素修改的劫持



-   问题
    -   对象直接新添加的属性或删除已有属性, 界面不会自动更新
    -   直接通过下标替换元素或更新 length, 界面不会自动更新 arr[1] = {}

#### Vue3 的响应式

-   核心:
    -   通过 Proxy(代理): 拦截对 data 任意属性的任意(13 种)操作, 包括属性值的读写, 属性的添加, 属性的删除等...
    -   通过 Reflect(反射): 动态对被代理对象的相应属性进行特定的操作
    -   文档:
        -   https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Proxy
        -   https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Reflect

 **示例代码**

```js
// 目标对象
let user = {
    name: "小憨憨",
    age: 19,
    wife: {
        name: "你猜",
        age: 20,
    },
};

// 把目标对象变成代理对象
let proxyUser = new Proxy(user, {
    // 获取目标对象上的属性
    get(target, prop) {
        console.log("get方法调用了");
        return Reflect.get(target, prop);
    },
    // 修改或添加目标对象上的属性
    set(target, prop, val) {
        console.log("set方法调用了");
        return Reflect.set(target, prop, val);
    },
    // 删除某个目标对象的属性
    defineProperty(target, prop) {
        console.log("delete方法被调用了");
        return Reflect.defineProperty(target, prop);
    },
});

// 通过代理对象获取目标对象中的某个属性值
console.log(proxyUser.name);

proxyUser.name = "陆憨憨";
console.log(user);

proxyUser.gender = "男";
console.log(user);

delete proxyUser.age;
console.log(user);
```



### 5、setup 细节

#### setup 执行的时机

-   在 beforeCreate 之前执行(一次), 此时组件对象还没有创建
-   this 是 undefined, 不能通过 this 来访问 data/computed/methods/props
-   其实所有的 composition API 相关回调函数中也都不可以

**示例代码**

```vue
// App.vue
<template>
    <h1>setup执行时机</h1>
    <h3>App父元素</h3>
    <h4>msg: {{ msg }}</h4>
    <hr />
    <Child :msg="msg"></Child>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Child from "./components/Child.vue";

export default defineComponent({
    name: "App",
    components: { Child },
    beforeCreate() {
        console.log("父组件中的beforeCreate");
    },
    setup() {
        console.log("父组件中的setup", `this是${this}`);

        let msg = ref("Hello World");

        return {
            msg,
        };
    },
});
</script>

// Child.vue
<template>
    <h3>Child子元素</h3>
    <h4>msg: {{ msg }}</h4>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "Child",
    props: ["msg"],
    beforeCreate() {
        console.log("子组件中的beforeCreate");
    },
    setup() {
        console.log("子组件中的setup", `this是${this}`);
    },
});
</script>
```

#### setup 的返回值

-   一般都返回一个对象: 为模板提供数据, 也就是模板中可以直接使用此对象中的所有属性/方法
-   返回对象中的属性会与 data 函数返回对象的属性合并成为组件对象的属性
-   返回对象中的方法会与 methods 中的方法合并成功组件对象的方法
-   如果有重名 setup 优先

**示例代码**

```vue
<template>
    <h1>setup执行时机</h1>
    <h3>App父元素</h3>
    <h4>msg: {{ msg }}</h4>
    <hr />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";

export default defineComponent({
    name: "App",
    setup() {
        let msg = ref("setup中的msg");

        return {
            msg,
        };
    },
    data() {
        return {
            msg: "data中的msg",
        };
    },
});
</script>
```



#### setup 的参数

-   setup(props, context) / setup(props, {attrs, slots, emit})
-   props: 包含 props 配置声明且传入了的所有属性的对象
-   attrs: 包含没有在 props 配置中声明的属性的对象, 相当于 this.\$attrs
-   slots: 包含所有传入的插槽内容的对象, 相当于 this.\$slots
-   emit: 用来分发自定义事件的函数, 相当于 this.\$emit

 **示例代码**

```vue
// App.vue
<template>
    <h1>setup参数</h1>
    <h3>App父元素</h3>
    <h4>msg: {{ msg }}</h4>
    <hr />
    <Child :msg="msg" abc="abc" @xxx="xxx"></Child>
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Child from "./components/Child.vue";

export default defineComponent({
    name: "App",
    components: { Child },
    setup() {
        let msg = ref("setup中的msg");
        function xxx(txt: string) {
            msg.value += "++";
        }

        return {
            msg,
            xxx,
        };
    },
});
</script>

// Child.vue
<template>
    <h3>Child子元素</h3>
    <h4>msg: {{ msg }}</h4>
    <button @click="emitXxx">触发事件</button>
</template>

<script lang="ts">
import { defineComponent } from "vue";

export default defineComponent({
    name: "Child",
    props: ["msg"],
    setup(props, { attrs, slots, emit }) {
        console.log(props, attrs, slots, emit);

        function emitXxx() {
            emit("xxx", "++");
        }
        return {
            emitXxx,
        };
    },
});
</script>
```



#### **注意:**

-   一般不要混合使用: methods 中可以访问 setup 提供的属性和方法, 但在 setup 方法中不能访问 data 和 methods
-   setup 不能是一个 async 函数: 因为返回值不再是 return 的对象, 而是 promise, 模板看不到 return 对象中的属性数据

### 6、reactive 与 ref 细节

-   是 Vue3 的 composition API 中 2 个最重要的响应式 API
-   ref 用来处理基本类型数据, reactive 用来处理对象(递归深度响应式)
-   ref 内部: 通过给 value 属性添加 getter/setter 来实现对数据的劫持
-   如果用 ref 对象/数组, 内部会自动将对象/数组转换为 reactive 的代理对象
-   reactive 内部: 通过使用 Proxy 来实现对对象内部所有数据的劫持, 并通过 Reflect 操作对象内部数据
-   ref 的数据操作: 在 js 中要.value, 在模板中不需要(内部解析模板时会自动添加.value)

**示例代码**

```vue
<template>
    <h1>reactive与ref细节</h1>
    <h3>ref基本数据类型：{{ m1 }}</h3>
    <h3>ref引用数据类型：{{ m2.name }}</h3>
    <h3>reactive引用数据类型：{{ m4.name }}</h3>
    <button @click="update">更新数据</button>
</template>

<script lang="ts">
import { defineComponent, reactive, ref } from "vue";

export default defineComponent({
    name: "App",
    setup() {
        let m1 = ref("Hello World");
        let m2 = ref({
            name: "小明",
            wife: {
                name: "小红",
            },
        });
        let m4 = reactive({
            name: "小白",
            wife: {
                name: "小米",
            },
        });
        function update() {
            console.log(m1);
            console.log(m2);
            console.log(m4);
            m1.value += "==";
            m2.value.name += "==";
            m4.name += "++";
        }
        return {
            m1,
            m2,
            m4,
            update,
        };
    },
});
</script>
```



### 7、计算属性与监视

-   computed 函数:

    -   与 computed 配置功能一致
    -   有 getter 和 setter

-   watch 函数

    -   与 watch 配置功能一致
    -   监视指定的一个或多个响应式数据, 一旦数据变化, 就自动执行监视回调
    -   默认初始时不执行回调, 但可以通过配置 immediate 为 true, 来指定初始时立即执行第一次
    -   通过配置 deep 为 true, 来指定深度监视

-   watchEffect 函数

    -   不用直接指定要监视的数据, 回调函数中使用的哪些响应式数据就监视哪些响应式数据
    -   默认初始时就会执行第一次, 从而可以收集需要监视的数据
    -   监视数据发生变化时回调

 **示例代码**

```vue
<template>
    <h1>计算属性和监视</h1>
    <fieldset>
        <legend>姓名操作</legend>
        姓氏:
        <input type="text" placeholder="请输入姓氏" v-model="user.firstName" />
        <hr />
        名字:
        <input type="text" placeholder="请输入名字" v-model="user.lastName" />
    </fieldset>
    <br />
    <fieldset>
        <legend>计算属性和监视的演示</legend>
        姓名: <input type="text" placeholder="显示姓名" v-model="fullName1" />
        <hr />
        姓名: <input type="text" placeholder="显示姓名" v-model="fullName2" />
        <hr />
        姓名: <input type="text" placeholder="显示姓名" v-model="fullName3" />
    </fieldset>
</template>

<script lang="ts">
import {
    defineComponent,
    computed,
    reactive,
    watch,
    ref,
    watchEffect,
} from "vue";

export default defineComponent({
    name: "App",
    setup() {
        let user = reactive({
            firstName: "东方",
            lastName: "不败",
        });

        // 显示第一个名字
        // 返回一个ref类型的对象
        let fullName1 = computed(() => {
            return user.firstName + "_" + user.lastName;
        });

        // 显示第二个名字
        let fullName2 = computed({
            get() {
                return user.firstName + "_" + user.lastName;
            },
            set(val: string) {
                let names = val.split("_");
                user.firstName = names[0];
                user.lastName = names[1];
            },
        });

        // 显示第三名字 watch实现
        // let fullName3 = ref("");
        // watch(
        //     user,
        //     ({ firstName, lastName }) => {
        //         fullName3.value = user.firstName + "_" + user.lastName;
        //     },
        //     { immediate: true, deep: true }
        // );
        // // immediate 默认会执行一次 watch， deep 深度监听
        // watch(fullName3, (val) => {
        //     let names = val.split("_");
        //     user.firstName = names[0];
        //     user.lastName = names[1];
        // });

        // 显示第三名字 watchEffect实现
        let fullName3 = ref("");
        watch(
            user,
            ({ firstName, lastName }) => {
                fullName3.value = user.firstName + "_" + user.lastName;
            },
            { immediate: true, deep: true }
        );
        watchEffect(() => {
            let names = fullName3.value.split("_");
            user.firstName = names[0];
            user.lastName = names[1];
        });

        watch([() => user.firstName, () => user.lastName, fullName3], () => {
            // 这里的代码就没有执行,fullName3是响应式的数据,但是,user.firstName,user.lastName不是响应式的数据
            console.log("====");
        });

        return {
            user,
            fullName1,
            fullName2,
            fullName3,
        };
    },
});
</script>
```



### 8、生命周期

**Vue3.x 中的生命周期执行优先于 Vue2.x 中的生命周期。**



#### **与 2.x 版本生命周期相对应的组合式 API**

| Vue2.x        | Vue3.x            | 说明             |
| ------------- | ----------------- | ---------------- |
| beforeCreate  | setup()           | 数据加载前       |
| created       | setup()           | 数据加载后       |
| beforeMount   | onBeforeMount()   | 页面挂载前       |
| mounted       | onMounted()       | 页面挂载后       |
| beforeUpdate  | onBeforeUpdate()  | 数据更新前       |
| updated       | onUpdated()       | 数据更新后       |
| beforeDestroy | onBeforeUnmount() | 页面卸载前       |
| destroyed     | onUnmounted()     | 页面卸载后       |
| errorCaptured | onErrorCaptured() | 子组件错误捕获时 |

#### **新增的钩子函数**

-   组合式 API 还提供了以下调试钩子函数：
    -   onRenderTracked：跟踪虚拟 DOM 重新渲染时调用。
    -   onRenderTriggered：当虚拟 DOM 重新渲染被触发时调用。

**示例代码**

```vue
// App.vue<template>
    <h1>生命周期</h1>
    <h3>App</h3>
    <button @click="isShow = !isShow">显示隐藏</button>
    <hr />
    <Child v-if="isShow" />
</template>

<script lang="ts">
import { defineComponent, ref } from "vue";
import Child from "./components/Child.vue";

export default defineComponent({
    name: "App",
    components: { Child },
    setup() {
        let isShow = ref(true);
        return {
            isShow,
        };
    },
});
</script>

// Child.vue
<template>
    <h3>Child</h3>
    <button @click="update">更新数据</button>
    <h3>msg: {{ msg }}</h3>
</template>

<script lang="ts">
import {
    defineComponent,
    onBeforeMount,
    onBeforeUnmount,
    onBeforeUpdate,
    onMounted,
    onUnmounted,
    onUpdated,
    ref,
} from "vue";

export default defineComponent({
    name: "Child",
    // Vue2.x中的生命周期
    beforeCreate() {
        console.log("Vue2.x中的 beforeCreate ...");
    },
    created() {
        console.log("Vue2.x中的 created ...");
    },
    beforeMount() {
        console.log("Vue2.x中的 beforeMount ...");
    },
    mounted() {
        console.log("Vue2.x中的 mounted ...");
    },
    beforeUpdate() {
        console.log("Vue2.x中的 beforeUpdate ...");
    },
    updated() {
        console.log("Vue2.x中的 updated ...");
    },
    beforeUnmount() {
        console.log("Vue2.x中的 beforeUnmount ...");
    },
    unmounted() {
        console.log("Vue2.x中的 unmounted ...");
    },
    setup() {
        // Vue3.x中的生命周期
        console.log("Vue3.x中的 setup ...");
        onBeforeMount(() => console.log("Vue3.x中的 onBeforeMount ..."));
        onMounted(() => console.log("Vue3.x中的 onMounted ..."));
        onBeforeUpdate(() => console.log("Vue3.x中的 onBeforeUpdate ..."));
        onUpdated(() => console.log("Vue3.x中的 onUpdated ..."));
        onBeforeUnmount(() => console.log("Vue3.x中的 onBeforeUnmount ..."));
        onUnmounted(() => console.log("Vue3.x中的 onUnmounted ..."));

        let msg = ref("数据更新了");
        function update() {
            msg.value += "+++";
        }
        return {
            msg,
            update,
        };
    },
});
</script>
```



### 9、自定义 hook 函数

-   使用 Vue3 的组合 API 封装的可复用的功能函数
-   自定义 hook 的作用类似于 vue2 中的 mixin 技术
-   自定义 Hook 的优势: 很清楚复用功能代码的来源, 更清楚易懂

**需求 1: 收集用户鼠标点击的页面坐标**

**示例代码**

./hooks/useMousePosition.ts

```ts
import { onBeforeUnmount, onMounted, ref } from "vue";

export default function() {
    const x = ref(0);
    const y = ref(0);
    const handlerClick = (e: MouseEvent) => {
        x.value = e.pageX;
        y.value = e.pageY;
    };
    onMounted(() => {
        window.addEventListener("click", handlerClick);
    });
    onBeforeUnmount(() => {
        window.removeEventListener("click", handlerClick);
    });
    return {
        x,
        y,
    };
}
```

App.vue

```vue
<template>
    <h1>自定义hook函数</h1>
    <h3>X坐标：{{ x }}</h3>
    <h3>Y坐标：{{ y }}</h3>
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";
import useMousePosition from "./hooks/useMousePosition";

export default defineComponent({
    name: "App",
    setup() {
        const { x, y } = useMousePosition();
        return {
            x,
            y,
        };
    },
});
</script>
```



**需求 2: 封装发 ajax 请求的 hook 函数, 利用 TS 泛型强化类型检查**

**示例代码**

./hooks/useRequest.ts

```ts
import { ref } from "vue";
import axios from "axios";

export default function useRequest<T>(url: string) {
    const loading = ref(true);
    const result = ref<T | null>(null);
    const errMsg = ref(null);

    axios
        .get(url)
        .then((res) => {
            setTimeout(() => {
                loading.value = false;
                result.value = res.data;
            }, 2000);
        })
        .catch((err) => {
            loading.value = false;
            errMsg.value = err.message || "未知错误";
        });

    return {
        loading,
        result,
        errMsg,
    };
}
```

App.vue

```vue
<template>
    <h3>作者信息</h3>
    <h4 v-if="loading1">LOADING......</h4>
    <div v-else>
        <p>姓名：{{ result1.name }}</p>
        <p>性别：{{ result1.gender }}</p>
        <p>年龄：{{ result1.age }}</p>
    </div>
    <hr />
    <h3>书本名称</h3>
    <h4 v-if="loading2">LOADING......</h4>
    <div v-else>
        <ul v-for="(item, index) in result2" :key="index">
            <li>书名：{{ item.name }}</li>
            <li>价格：{{ item.price }}</li>
            <li>分类：{{ item.category }}</li>
        </ul>
    </div>
</template>

<script lang="ts">
import { defineComponent, watch } from "vue";
import useMousePosition from "./hooks/useMousePosition";
import useRequest from "./hooks/useRequest";

interface User {
    name: string;
    age: number;
    gender: string;
}

interface Book {
    name: string;
    price: number;
    ctaegory: string;
}

export default defineComponent({
    name: "App",
    setup() {
        const { x, y } = useMousePosition();
        const { loading: loading1, result: result1 } = useRequest<User>(
            "/data/user.json"
        );
        const { loading: loading2, result: result2 } = useRequest<Book[]>(
            "/data/books.json"
        );

        watch(result2, () => {
            if (result2.value) {
                console.log(result2.value.length);
            }
        });

        return {
            x,
            y,
            result1,
            loading1,
            result2,
            loading2,
        };
    },
});
</script>
```



### 10、toRefs

-   把一个响应式对象转换成普通对象，该普通对象的每个 property 都是一个 ref
-   应用: 当从合成函数返回响应式对象时，toRefs 非常有用，这样消费组件就可以在不丢失响应式的情况下对返回的对象进行分解使用
-   问题: reactive 对象取出的所有属性值都是非响应式的
-   解决: 利用 toRefs 可以将一个响应式 reactive 对象的所有原始属性转换为响应式的 ref 属性

 **示例代码**

```vue
<template>
    <h2>toRefs</h2>
    <h3>foo: {{ foo }}</h3>
    <h3>bar: {{ bar }}</h3>
    <h3>foo2: {{ foo2 }}</h3>
    <h3>bar2: {{ bar2 }}</h3>
</template>

<script lang="ts">
import { defineComponent, reactive, toRefs } from "vue";

export default defineComponent({
    setup() {
        const state = reactive({
            foo: "a",
            bar: "b",
        });

        const stateAsRefs = toRefs(state);

        setTimeout(() => {
            state.foo += "++";
            state.bar += "++";
        }, 2000);

        const { foo2, bar2 } = useReatureX();

        return {
            // ...state,
            ...stateAsRefs,
            foo2,
            bar2,
        };
    },
});
function useReatureX() {
    const state = reactive({
        foo2: "a",
        bar2: "b",
    });

    setTimeout(() => {
        state.foo2 += "++";
        state.bar2 += "++";
    }, 2000);

    return toRefs(state);
}
</script>
```



### 11、ref 获取元素

-   利用 ref 函数获取组件中的标签元素
-   功能需求: 让输入框自动获取焦点

```vue
<template>
    <h1>ref 获取元素</h1>
    <input type="text" />
    <hr />
    <input type="text" ref="inputRef" />
</template>

<script lang="ts">
import { defineComponent, onMounted, ref } from "vue";

export default defineComponent({
    name: "App",
    setup() {
        const inputRef = ref<HTMLElement | null>(null);

        onMounted(() => {
            inputRef.value && inputRef.value.focus();
        });
        return {
            inputRef,
        };
    },
});
</script>
```
