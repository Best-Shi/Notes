# Vue3 新组件

## Vue3 新组件

### 1、Fragment(片断)

-   在 Vue2 中: 组件必须有一个根标签
-   在 Vue3 中: 组件可以没有根标签, 内部会将多个标签包含在一个 Fragment 虚拟元素中
-   好处: 减少标签层级, 减小内存占用

### 2、Teleport(瞬移)

-   Teleport 提供了一种干净的方法，允许我们控制在 DOM 中哪个父节点下渲染了 HTML，而不必求助于全局状态或将其拆分为两个组件。

 **示例代码**

```vue
// App.vue
<template>
    <h2>App</h2>
    <modal-button></modal-button>
</template>

<script lang="ts">
import ModalButton from "./ModalButton.vue";

export default {
    setup() {
        return {};
    },

    components: {
        ModalButton,
    },
};
</script>
```

```vue
// ModalButton.vue
<template>
    <button @click="modalOpen = true">
        Open full screen modal! (With teleport!)
    </button>

    <teleport to="body">
        <div v-if="modalOpen" class="modal">
            <div>
                I'm a teleported modal! (My parent is "body")
                <button @click="modalOpen = false">
                    Close
                </button>
            </div>
        </div>
    </teleport>
</template>

<script>
import { ref } from "vue";
export default {
    name: "modal-button",
    setup() {
        const modalOpen = ref(false);
        return {
            modalOpen,
        };
    },
};
</script>

<style>
.modal {
    position: absolute;
    top: 0;
    right: 0;
    bottom: 0;
    left: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
}

.modal div {
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    background-color: white;
    width: 300px;
    height: 300px;
    padding: 5px;
}
</style>
```



### 3、Suspense(不确定的)

-   它们允许我们的应用程序在等待异步组件时渲染一些后备内容，可以让我们创建一个平滑的用户体验

**示例代码**

```vue
// App.vue
<template>
    <Suspense>
        <template v-slot:default>
            <AsyncComp />
            <!-- <AsyncAddress/> -->
        </template>

        <template v-slot:fallback>
            <h1>LOADING...</h1>
        </template>
    </Suspense>
</template>

<script lang="ts">
/* 
异步组件 + Suspense组件
*/
// import AsyncComp from './AsyncComp.vue'
import AsyncAddress from "./AsyncAddress.vue";
import { defineAsyncComponent } from "vue";
const AsyncComp = defineAsyncComponent(() => import("./AsyncComp.vue"));
export default {
    setup() {
        return {};
    },

    components: {
        AsyncComp,
        AsyncAddress,
    },
};
</script>
```

```vue
// AsyncComp.vue
<template>
    <h2>AsyncComp22</h2>
    <p>{{ msg }}</p>
</template>

<script lang="ts">
export default {
    name: "AsyncComp",
    setup() {
        // return new Promise((resolve, reject) => {
        //   setTimeout(() => {
        //     resolve({
        //       msg: 'abc'
        //     })
        //   }, 2000)
        // })
        return {
            msg: "abc",
        };
    },
};
</script>
```

```vue
// AsyncAddress.vue
<template>
    <h2>{{ data }}</h2>
</template>

<script lang="ts">
import axios from "axios";
export default {
    async setup() {
        const result = await axios.get("/data/address.json");
        return {
            data: result.data,
        };
    },
};
</script>
```

