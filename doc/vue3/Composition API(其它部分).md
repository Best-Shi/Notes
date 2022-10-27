# Composition API(其它部分)

## Composition API(其它部分)

### 2、1、shallowReactive 与 shallowRef

-   shallowReactive : 只处理了对象内最外层属性的响应式(也就是浅响应式)

-   shallowRef: 只处理了 value 的响应式, 不进行对象的 reactive 处理

-   什么时候用浅响应式呢?

    -   一般情况下使用 ref 和 reactive 即可
    -   如果有一个对象数据, 结构比较深, 但变化时只是外层属性变化 ===> shallowReactive
    -   如果有一个对象数据, 后面会产生新的对象来替换 ===> shallowRef

 **示例代码**

```vue
<template>
    <h1>shallowReactive 与 shallowRef</h1>
    <h3>m1: {{ m1 }}</h3>
    <h3>m2: {{ m2 }}</h3>
    <h3>m3: {{ m3 }}</h3>
    <h3>m4: {{ m4 }}</h3>

    <hr />
    <button @click="update">更新数据</button>
</template>

<script lang="ts">
import {
    defineComponent,
    reactive,
    ref,
    shallowReactive,
    shallowRef,
    toRef,
    isRef,
} from "vue";

export default defineComponent({
    name: "App",
    setup() {
        const m1 = ref({
            name: "Best Shi",
            age: 20,
            wife: {
                name: "Small Shell",
                age: 18,
            },
        });
        const m2 = reactive({
            name: "Best Shi",
            age: 20,
            wife: {
                name: "Small Shell",
                age: 18,
            },
        });

        const m3 = shallowReactive({
            name: "Best Shi",
            age: 20,
            wife: {
                name: "Small Shell",
                age: 18,
            },
        });
        const m4 = shallowRef({
            name: "Best Shi",
            age: 20,
            wife: {
                name: "Small Shell",
                age: 18,
            },
        });

        const update = () => {
            console.log(m1);
            console.log(m2);

            console.log(m3.wife);
            console.log(m4);

            m1.value.wife.name += "==";
            m2.wife.name += "**";
            m3.wife.name += "---";
            m4.value.wife.name += "》》》";
        };
        return {
            m1,
            m2,
            m3,
            m4,
            update,
        };
    },
});
</script>
```



### 2、Readonly 与 shallowReadonly

-   readonly:
    -   深度只读数据
    -   获取一个对象 (响应式或纯对象) 或 ref 并返回原始代理的只读代理。
    -   只读代理是深层的：访问的任何嵌套 property 也是只读的。
-   shallowReadonly
    -   浅只读数据
    -   创建一个代理，使其自身的 property 为只读，但不执行嵌套对象的深度只读转换
-   应用场景:
    -   在某些特定情况下, 我们可能不希望对数据进行更新的操作, 那就可以包装生成一个只读代理对象来读取数据, 而不能修改或删除

### 3、toRaw 与 markRaw

-   toRaw
    -   返回由 reactive 或 readonly 方法转换成响应式代理的普通对象。
    -   这是一个还原方法，可用于临时读取，访问不会被代理/跟踪，写入时也不会触发界面更新。
-   markRaw
    -   标记一个对象，使其永远不会转换为代理。返回对象本身
-   应用场景:
    -   有些值不应被设置为响应式的，例如复杂的第三方类实例或 Vue 组件对象。
    -   当渲染具有不可变数据源的大列表时，跳过代理转换可以提高性能。

### 4、toRef

-   为源响应式对象上的某个属性创建一个 ref 对象, 二者内部操作的是同一个数据值, 更新时二者是同步的
-   区别 ref: 拷贝了一份新的数据值单独操作, 更新时相互不影响
-   应用: 当要将 某个 prop 的 ref 传递给复合函数时，toRef 很有用

### 5、customRef

-   创建一个自定义的 ref，并对其依赖项跟踪和更新触发进行显式控制
-   需求: 使用 customRef 实现 debounce 的示例

 **示例代码**

```vue
<template>
    <h1>customRef使用</h1>
    <input type="text" v-model="keyword" />
    <hr />
    <p>{{ keyword }}</p>
</template>

<script lang="ts">
import { customRef, defineComponent } from "vue";
import { set } from "vue/types/umd";

function useDebounce<T>(value: T, delay = 200) {
    let timeOutId: number;
    return customRef((track, trigger) => {
        return {
            get() {
                track();
                return value;
            },
            set(newVal: T) {
                clearTimeout(timeOutId);
                setTimeout(() => {
                    value = newVal;
                    trigger();
                }, delay);
            },
        };
    });
}

export default defineComponent({
    name: "App",
    setup() {
        const keyword = useDebounce("", 2000);
        return {
            keyword,
        };
    },
});
</script>
```

### 6、provide 与 inject

-   实现跨层级组件(祖孙)间通信

**示例代码**

```vue
// App.vue
<template>
    <h1>provide 与 inject</h1>
    <div>
        <h3>父级组件</h3>
        <input type="text" v-model="keyword" />
        <hr />
        <p>:{{ keyword }}</p>
        <Son></Son>
    </div>
</template>

<script lang="ts">
import { defineComponent, provide, ref } from "vue";
import Son from "./components/Son.vue";

export default defineComponent({
    name: "App",
    components: {
        Son,
    },
    setup() {
        const keyword = ref();
        provide("keyword", keyword);
        return {
            keyword,
        };
    },
});
</script>

<style>
div {
    border: 1px solid #008c8c;
    padding: 20px;
}
</style>
```

```vue
// ./components/Son.vue
<template>
    <div>
        <h3>子级组件</h3>
        <hr />
        <Grandson></Grandson>
    </div>
</template>

<script lang="ts">
import { defineComponent } from "vue";
import Grandson from "./Grandson.vue";

export default defineComponent({
    name: "Son",
    components: {
        Grandson,
    },
    setup() {
        return {};
    },
});
</script>
```

```vue
// ./components/Grandson.vue
<template>
    <div>
        <h3>子孙级组件</h3>
        <p>:{{ keyword }}</p>
    </div>
</template>

<script lang="ts">
import { defineComponent, inject } from "vue";

export default defineComponent({
    name: "Grandson",
    setup() {
        const keyword = inject("keyword");
        return {
            keyword,
        };
    },
});
</script>
```



### 7、响应式数据的判断

-   isRef: 检查一个值是否为一个 ref 对象
-   isReactive: 检查一个对象是否是由 reactive 创建的响应式代理
-   isReadonly: 检查一个对象是否是由 readonly 创建的只读代理
-   isProxy: 检查一个对象是否是由 reactive 或者 readonly 方法创建的代理
