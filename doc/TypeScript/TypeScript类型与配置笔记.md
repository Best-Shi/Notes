# TypeScript 类型与配置笔记

## 1、基本类型

### `1.1、类型声明`

> -   通过类型声明可以指定 TS 中变量（参数、形参）的类型。
> -   指定类型后，当为变量赋值时，TS 编译器会自动检查值是否符合类型声明，符合则赋值，否则报错。

**语法：**

```ts
let 变量: 类型;

let 变量: 类型 = 值;

function fn(参数: 类型, 参数: 类型): 类型{
    ...
}
```

### `1.2、自动类型判断`

> -   TS 拥有自动的类型判断机制。
> -   当对变量的声明和赋值是同时进行的，TS 编译器会自动判断变量的类型。
> -   所以如果你的变量的声明和赋值时同时进行的，可以省略掉类型声明。

### `1.3、类型`

|  类型   |       例子        |              描述               |
| :-----: | :---------------: | :-----------------------------: |
| number  |    1, -33, 2.5    |            任意数字             |
| string  | 'hi', "hi", `hi`  |           任意字符串            |
| boolean |    true、false    |      布尔值 true 或 false       |
| 字面量  |      其本身       |  限制变量的值就是该字面量的值   |
|   any   |        \*         |            任意类型             |
| unknown |        \*         |         类型安全的 any          |
|  void   | 空值（undefined） |     没有值（或 undefined）      |
|  never  |      没有值       |          不能是任何值           |
| object  |  {name:'孙悟空'}  |         任意的 JS 对象          |
|  array  |      [1,2,3]      |          任意 JS 数组           |
|  tuple  |       [4,5]       | 元素，TS 新增类型，固定长度数组 |
|  enum   |    enum{A, B}     |       枚举，TS 中新增类型       |

#### number

```ts
let decimal: number = 6; // 十进制
let hex: number = 0xf00d; // 十六进制
let binary: number = 0b1010; // 二进制
let octal: number = 0o744; // 八进制
let big: bigint = 100n; // 目标低于 ES2020 时，bigInt 文本不可用。
```

#### string

```ts
let str: string = "Best Shi";
```

#### boolean

```ts
let isShow: boolean = true;
```

#### 字面量

> 通过字面量可以确定变量的取值范围

```ts
let color: "red" | "blue" | "black";
let num: 1 | 2 | 3 | 4 | 5;
```

#### any

> `any` 表示的是任意类型，一个变量设置类型为`any`后相当于对该变量关闭了 TS 的类型检测。
>
> 使用 TS 时，不建议使用`any`类型。
>
> 声明变量如果不指定类型，则 TS 解析器会自动判断变量的类型为 any （隐式的 any）。

```ts
let d: any = "d";
d = 123;
```

#### unknown

> `unknown` 表示未知类型的值。
>
> `unknown` 实际上就是一个类型安全的`any`。
>
> `unknown` 类型的变量，不能直接赋值给其他变量。

```ts
let e: unknown;
e = 10;
e = "Best Shi";
e = d;

let s: string = "Best Shi";
s = e; // 不能将类型“unknown”分配给类型“string”。
```

#### void

> `void`类型像是与`any`类型相反，它表示没有任何类型。
>
> 当一个函数没有返回值时，其返回值类型是`void`。
>
> 声明一个`void`类型的变量，只能为它赋予`undefined`和`null`。

```ts
function fn(): void {}
```

#### undefined 和 null

> TypeScript 里，`undefined`和`null`两者各自有自己的类型分别叫做`undefined`和`null`。
>
> 默认情况下`null`和`undefined`是所有类型的子类型。
>
> 当指定了`--strictNullChecks`标记，`null`和`undefined`只能赋值给`void`和它们各自。

```ts
let u: undefined = undefined;
let n: null = null;
```

#### never

> `never`类型表示的是那些永不存在的值的类型。
>
> `never`类型是任何类型的子类型，也可以赋值给任何类型。
>
> 没有类型是`never`的子类型或可以赋值给`never`类型（除了`never`本身之外）。

```ts
function error(message: string): never {
    throw new Error(message);
}
```

#### object

> `object`表示一个 js 对象（没啥用）。

```ts
let a: object;
a = {};
a = function() {};
```

#### array

> 数组的类型声明：
>
> -   类型[]
> -   Array<类型>

```ts
let f: number[] = [1, 2, 3];
let g: Array<number> = [1, 2, 3];
```

#### tuple

> 元组，元组就是固定长度的数组。
>
> 语法：[类型, 类型, 类型]

```ts
let h: [string, number];
h = ["Best Shi", 26];
```

#### enum

> `enum`类型是对 JavaScript 标准数据类型的一个补充。
>
> -   默认情况下，从`0`开始为元素编号。
> -   如果标识符没有赋值，他的值就是下标。
> -   如果中间某个标识赋值后，后面标识符下标从前一个元素下标开始。

```ts
enum Gender {
    Male,
    Female,
}

let i: { name: string; gender: Gender };
i = {
    name: "孙悟空",
    gender: Gender.Male, // 'male'
};
```

### `1.4、类型断言`

> 类型断言，可以用来告诉解析器变量的实际类型。

**语法：**

```ts
(变量 as 类型) < 类型 > 变量;
```

```ts
let v: string;
let z: unknown;
z = "Best Shi";
v = z as string;
v = <string>z;
```

### `1.5、类型别名`

```ts
type myType = 1 | 2 | 3 | 4 | 5;
let aa: myType;
```

### `1.6、可选属性`

> 在属性后面加上`?`号，该属性为可选属性。
>
> `{}` 用来指定对象中可以包含哪些属性。

**语法：**

```ts
{属性名:属性值,属性名:属性值}
```

```ts
let k: { name: string; age?: number };

k = {
    name: "Best Shi",
};
```

### `1.7、任意属性`

```ts
let j: { name: string; [propName: string]: any };
j = {
    name: "Best Shi",
    age: 26,
    gender: "男",
};
```

### `1.8、设置函数的结构声明`

**语法：**

```ts
(形参:类型, 形参:类型 ...) => 返回值
```

```ts
let sum: (value1: number, value2: number) => number;
sum = function(a: number, b: number): number {
    return a + b;
};
```

### `1.9、可选参数`

> 在参数后面加上`?`号，该参数为可选参数。
>
> 可选参数只能放在参数最后面。

```ts
let sum1: (value1: number, value2: number, desc?: string) => number;
sum1 = function(a: number, b: number, desc: string): number {
    if (desc) {
        console.log(desc);
    }
    return a + b;
};
console.log(sum1(10, 23));
```

### `1.10、剩余参数`

```ts
function sum(...args: any[]): number {
    let num: number = 0;
    for (let i: number = 0; i < args.length; i++) {
        num += args[i];
    }
    return num;
}

console.log(sum(1, 2, 3, 4, 5)); // 15

function sum(a: number, ...args: any[]): number {
    let num: number = a;
    for (let i: number = 0; i < args.length; i++) {
        num += args[i];
    }
    return num;
}

console.log(sum(1, 2, 3, 4, 5)); // 15
```

### `1.11、默认参数`

```ts
function getInfo(name: string, age: number = 26): string {
    return `姓名: ${name}, 年龄: ${age}`;
}

console.log(getInfo("Best Shi")); // 姓名: Best Shi, 年龄: 26
```

### `1.12、函数重载`

```ts
function getInfo(name: string): string;
function getInfo(age: number): string;
function getInfo(str: any): string {
    if (typeof str === "string") {
        return `我的名字是: ${str}`;
    } else {
        return `我的年龄是: ${str}`;
    }
}

console.log(getInfo("Best Shi")); // 我的名字是: Best Shi
console.log(getInfo(26)); // 我的年龄是: 26

function getInfo(name: string): string;
function getInfo(name: string, age: number): string;
function getInfo(name: any, age?: any): string {
    if (age) {
        return `我的名字是: ${name}, 今年 ${age} 岁.`;
    } else {
        return `我的名字是: ${name}`;
    }
}

console.log(getInfo("Best Shi")); // 我的名字是: Best Shi
console.log(getInfo("Best Shi", 26)); // 我的名字是: Best Shi, 今年 26 岁.
```

## 2、编译选项

### `2.1、自动编译文件`

> 编译文件时，使用 -w 指令后，TS 编译器会自动监视文件的变化，并在文件发生变化时对文件进行重新编译。

```shell
tsc xxx.ts -w
```

### `2.2、自动编译整个项目`

> -   如果直接使用 tsc 指令，则可以自动将当前项目下的所有 ts 文件编译为 js 文件。
>
> -   但是能直接使用 tsc 命令的前提时，要先在项目根目录下创建一个 ts 的配置文件 tsconfig.json。
>
> -   tsconfig.json 是一个 JSON 文件，添加配置文件后，只需只需 tsc 命令即可完成对整个项目的编译。

### `2.3、常用配置选项`

#### `include`

> 定义需要编译文件的所在目录。
>
> **默认值：**["\*\*/\*"]。
>
>     - `**`表示任意目录。
>
> -   `*`表示任意文件。

```josn
{
    "include": ["./src/**/*"]
}
```

#### `exclude`

> 定义不需要编译的目录。
>
> **默认值：**["node_modules", "bower_components", "jspm_packages"]。
>
> -   `**`表示任意目录。
>
> *   `*`表示任意文件。

```josn
{
	...
    "exclude": ["./src/hello/**/*"]
}
```

#### `extends`

> 定义需要编译文件的所在目录。

```josn
{
    ...
    "extends": "./configs/base"
}
```

#### `files`

> 指定被编译文件的列表，只有需要编译的文件少时才会用到。

```josn
{
	...
    "files": [
    "core.ts",
    "sys.ts",
    "types.ts",
    "scanner.ts",
    "parser.ts",
    "utilities.ts",
    "binder.ts",
    "checker.ts",
    "tsc.ts"
  ]
}
```

#### `compilerOptions`

> -   编译选项是配置文件中非常重要也比较复杂的配置选项
>
> -   在 compilerOptions 中包含多个子选项，用来完成对编译的配置

1. `target`

    > 设置 ts 代码编译的目标版本。
    >
    > 可选值：ES3（默认）、ES5、ES6/ES2015、ES7/ES2016、ES2017、ES2018、ES2019、ES2020、ESNext

    ```json
    "compilerOptions": {
        "target": "ES6"
    }
    ```

2. `lib`

    > 指代码运行时所包含的库（宿主环境）
    >
    > 可选值：ES5、ES6/ES2015、ES7/ES2016、ES2017、ES2018、ES2019、ES2020、ESNext、DOM、WebWorker、ScriptHost ......

    ```json
    "compilerOptions": {
        "target": "ES6",
        "lib": ["ES6", "DOM"]
    }
    ```

3. `module`

    > 设置编译后代码使用的模块化系统。
    >
    > 可选值：none、commonjs、amd、system、umd、es6、es2015、es2020、esnext

    ```json
    "compilerOptions": {
        "module": "ES6"
    }
    ```

4. `outDir`

    > 编译后文件的所在目录。
    >
    > 默认情况下，编译后的 js 文件会和 ts 文件位于相同的目录，设置 outDir 后可以改变编译后文件的位置。

    ```json
    "compilerOptions": {
        "outDir": "dist"
    }
    ```

5. `outFile`

    > 将所有文件编译为一个 js 文件。
    >
    > 默认会将所有的编写在全局作用域中的代码合并为一个 js 文件，如果 module 制定了 None、System 或 AMD 则会将模块一起合并到文件之中。

    ```json
    "compilerOptions": {
        "outFile": "dist/app.js"
    }
    ```

6. `rootDir`

    > 指定代码的根目录，默认情况下编译后文件的目录结构会以最长的公共目录为根目录，通过 rootDir 可以手动指定根目录。

    ```json
    "compilerOptions": {
        "rootDir": "./src"
    }
    ```

7. `allowJs`

    > 是否对 js 文件编译。

    ```json
    "compilerOptions": {
        "allowJs": true
    }
    ```

8. `checkJs`

    > 是否对 js 文件进行检查。

    ```json
    "compilerOptions": {
        "allowJs": true,
        "checkJs": true
    }
    ```

9. `removeComments`

    > 是否删除注释。
    >
    > **默认值：**false

10. `noEmit`

    > 不生成编译后的文件。
    >
    > **默认值：**false

11. `sourceMap`

    > 生成相应的 `.map`文件。
    >
    > **默认值：**false

12. 严格检查

    - `strict`
        - 启用所有的严格检查，默认值为 true，设置后相当于开启了所有的严格检查
    - `alwaysStrict`
        - 总是以严格模式对代码进行编译
    - `noImplicitAny`
        - 禁止隐式的 any 类型
    - `noImplicitThis`
        - 禁止类型不明确的 this
    - `strictBindCallApply`
        - 严格检查 bind、call 和 apply 的参数列表
    - `strictFunctionTypes`
        - 严格检查函数的类型
    - `strictNullChecks`
        - 严格的空值检查
    - `strictPropertyInitialization`
        - 严格检查属性是否初始化

13. 额外检查

    - `noFallthroughCasesInSwitch`
        - 检查 switch 语句包含正确的 break
    - `noImplicitReturns`
        - 检查函数没有隐式的返回值
    - `noUnusedLocals`
        - 检查未使用的局部变量
    - `noUnusedParameters`
        - 检查未使用的参数

14. 高级

    - `allowUnreachableCode`
        - 检查不可达代码
        - 可选值：
            - true，忽略不可达代码
            - false，不可达代码将引起错误
    - `noEmitOnError`
        - 有错误的情况下不进行编译
        - 默认值：false
