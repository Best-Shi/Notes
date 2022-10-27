# TypeScript 面向对象笔记

## 1、类（Class）

### 1.1、定义类

**语法：**

```ts
class 类名 {
    属性名: 类型;
    ...
    constructor(参数: 类型,...){
        this.属性名 = 参数;
        ...
    }
  	方法名():类型{
        ...
    }
}
```

**示例：**

```ts
class Person {
    name: string;
    age: number;
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
    sayHi(): void {
        console.log("Hello World!");
    }
}
```

### 1.2、继承

> 定义类的时候使用`extends`关键字实现继承。
>
> -   使用继承后，子类将会拥有父类所有的方法和属性。
> -   通过继承可以将多个类中共有的代码写在一个父类中。
> -   如果在子类中写了构造函数，在子类构造函数中必须使用`super`关键字对父类的构造函数进行调用。在类方法中`super`表示当前类的父类。
> -   如果在子类中添加了和父类相同的方法，则子类方法会覆盖掉父类的方法（方法重写）。

```ts
class Animal {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    sayHi(): void {
        console.log("动物再叫~~");
    }
}

class Dog extends Animal {
    age: number;
    constructor(name: string, age: number) {
        super(name); // 调用父类构造函数;     访问子类的 "this" 前，必须先调用 "super"。
        this.age = age;
    }
    sayHi(): void {
        super.sayHi();
        console.log("汪汪汪~~~");
    }
}

let dog = new Dog("花花", 3);
dog.sayHi();
```

### 1.3、类属性修饰符

> `public`公共的，修饰的属性可以在任意位置访问或修改（默认值）。
>
> `private` 私有属性，私有属性只能在类内部进行访问或修改。通过在类中添加方法使得私有属性可以被外部访问。
>
> `protected` 受保护的属性，只能在当前类和当前类的子类中访问或修改。
>
> `readonly`只读属性，只能读取，无法修改。只读属性必须在声明时或构造函数里被初始化。

#### `public`

```ts
class Person {
    public name: string; // 写或什么都不写都是public
    public age: number;

    constructor(name: string, age: number) {
        this.name = name; // 可以在类中修改
        this.age = age;
    }

    sayHello() {
        console.log(`大家好，我是${this.name}`);
    }
}

class Employee extends Person {
    constructor(name: string, age: number) {
        super(name, age);
        this.name = name; //子类中可以修改
    }
}
let emp = new Employee("Best Shi", 22);
console.log(emp); // Employee { name: 'Best Shi', age: 22 }
emp.name = "small shell";
console.log(emp); // Employee { name: 'small shell', age: 22 }
```

#### `private`

```ts
class Person {
    private name: string;
    private age: number;

    constructor(name: string, age: number) {
        this.name = name; // 可以在类中修改
        this.age = age;
    }

    sayHello() {
        console.log(`大家好，我是${this.name}`);
    }
}

class Employee extends Person {
    constructor(name: string, age: number) {
        super(name, age);
        this.name = name; // 属性“name”为私有属性，只能在类“Person”中访问。
    }
}
let emp = new Employee("Best Shi", 22);
console.log(emp);
emp.name = "small shell"; // 属性“name”为私有属性，只能在类“Person”中访问。
console.log(emp);
```

#### `protected`

```ts
class Person {
    protected name: string;
    protected age: number;

    constructor(name: string, age: number) {
        this.name = name; // 可以在类中修改
        this.age = age;
    }

    sayHello() {
        console.log(`大家好，我是${this.name}`);
    }
}

class Employee extends Person {
    constructor(name: string, age: number) {
        super(name, age);
        this.name = name; // 子类中可以修改
    }
}
let emp = new Employee("Best Shi", 22);
console.log(emp);
emp.name = "small shell"; // 属性“name”受保护，只能在类“Person”及其子类中访问。
console.log(emp);
```

#### `readonly`

```ts
class Person {
    readonly name: string;
    readonly age: number;

    constructor(name: string, age: number) {
        this.name = name; // 必须在声明时或构造函数里被初始化
        this.age = age;
    }

    sayHello() {
        console.log(`大家好，我是${this.name}`);
    }
}

class Employee extends Person {
    constructor(name: string, age: number) {
        super(name, age);
        this.name = name; // 无法分配到 "name" ，因为它是只读属性。
    }
}
let emp = new Employee("Best Shi", 22);
console.log(emp);
emp.name = "small shell"; // 无法分配到 "name" ，因为它是只读属性。
console.log(emp);
```

### 1.4、存取器

> `TypeScript`支持通过`getters`/`setters`来截取对对象成员的访问。

```ts
class Person {
    private _name: string;
    constructor(name: string) {
        this._name = name;
    }
    get name(): string {
        return this._name;
    }
    set name(value: string) {
        this._name = value;
    }
}

let per = new Person("Best Shi");
console.log(per); // Person { _name: 'Best Shi' }

per.name = "small shell";
console.log(per); // Person { _name: 'small shell' }
```

### 1.5、静态属性、静态方法

> 静态属性（方法），也称为类属性。使用静态属性无需创建实例，通过类即可直接使用。
>
> 静态属性（方法）使用`static`开头。
>
> 在类中只有静态方法内能访问静态属性。

```ts
class Tools {
    static PI = 3.1415926;

    static sum(value1: number, value2: number): number {
        return value1 + value2;
    }
    run(): void {
        console.log(this.PI); // 属性 "PI" 不是类型为 "Tools" 的静态成员
    }
}

console.log(Tools.PI); // 3.1415926
console.log(Tools.sum(10, 20)); // 30
```

### 1.6、抽象类

> 抽象类是专门用来被其他类所继承的类，它只能被其他类所继承不能用来创建实例。
>
> 使用`abstract`开头的方法叫做抽象方法，抽象方法没有方法体只能定义在抽象类中，继承抽象类时抽象方法必须要实现。
>
> 使用`implements`关键字实现抽象类型。

```ts
abstract class Animal {
    abstract name: string;
    age: number;
    constructor(age: number) {
        this.age = age;
    }
    abstract sayHi(): void;
}

class Dog implements Animal {
    name: string;
    age: number;
    constructor(name: string, age: number) {
        this.name = name;
        this.age = age;
    }
    sayHi(): void {
        console.log("汪汪汪~~~");
    }
}
```

```ts
abstract class Animal {
    abstract name: string;
    abstract sayHi(): void;
}

class Cat {
    age: number;
    constructor(age: number) {
        this.age = age;
    }
    eat(): void {
        console.log("猫吃鱼");
    }
}

class A extends Cat implements Animal {
    name: string;
    constructor(name: string, age: number) {
        super(age);
        this.name = name;
    }
    sayHi(): void {
        console.log(this.name, this.age);
    }
}

let c = new A("小黑", 5);
c.eat(); // 猫吃鱼
c.sayHi(); // 小黑 5
```

## 2、接口（Interface）

> **接口的作用：**在面向对象的编程中，接口是一种规范的定义，它定义了行为和动作的规范；在程序设计里面，接口起到一种限制和规范的作用。
>
> 接口定义了某一批类所需要遵守的规范，接口不关心这些类的内部状态数据，也不关心这些类里方法的实现细节，它只规定这批类里必须提供某些方法，提供这些方法的类就可以满足实际需要。
>
> `TypeScript`中的接口类似于 java，同时还增加了更灵活的接口类型，包括属性、函数、可索引和类等。

```ts
interface Info {
    name: string;
    age: number;
}

function add(info: Info): boolean {
    console.log(info); // { name: 'Best Shi', age: 26 }
    return true;
}

console.log(add({ name: "Best Shi", age: 26 })); // true
```

### 2.1、接口可选参数

```ts
interface Info {
    name: string;
    age: number;
    gender?: string;
}

function add(info: Info): boolean {
    console.log(info); //
    return true;
}

add({ name: "Best Shi", age: 26 });
```

### 2.2、接口只读参数

> 一些对象属性只能在对象刚刚创建的时候修改其值。

```ts
interface Point {
    readonly X: number;
    readonly Y: number;
}
let point: Point = {
    X: 10,
    Y: 20,
};
console.log(point);
// point.X = 20 // 无法分配到 "X" ，因为它是只读属性。
```

### 2.3、函数类型接口

```ts
interface Encrypt {
    (value1: number, value2: number): number;
}

let sum: Encrypt = function(a: number, b: number): number {
    return a + b;
};

console.log(sum(10, 20)); // 30
```

### 2.4、类类型接口

```ts
interface Animal {
    name: string;
    eat(food: string): void;
}

class Dog implements Animal {
    name: string;
    constructor(name: string) {
        this.name = name;
    }
    eat(food: string): void {
        console.log(`${this.name}正在吃${food}`);
    }
}

let d = new Dog("小黑");
d.eat("肉肉"); // 小黑正在吃肉肉
```

### 2.5、索引接口

#### 数组索引接口

```ts
interface Arr {
    [index: number]: string;
}

let a: Arr = ["a", "b", "c"];
console.log(a); // [ 'a', 'b', 'c' ]
```

#### 对象索引接口

```ts
interface Obj {
    [propName: string]: string;
}

let o: Obj = {
    name: "Best Shi",
    // age: 26 // 不能将类型“number”分配给类型“string”。所需类型来自此索引签名。
};
```

### 2.6、接口扩展

> 可以用`extends`实现接口继承并对接口进行扩展。

```ts
interface Person {
    name: string;
}

interface Role {
    roleId: number;
    roleName: string;
    [propName: string]: any;
}

interface Admin extends Person {
    role: Role;
}

class ZhangSan implements Admin {
    role: Role;
    name: string;
    constructor(name: string, role: Role) {
        this.role = role;
        this.name = name;
    }
    show(): void {
        console.log(`我叫: ${this.name}, 我的角色是: ${this.role.roleName}`);
    }
}

let zs = new ZhangSan("张三", { roleId: 123, roleName: "超级管理员" });
zs.show(); // 我叫: 张三, 我的角色是: 超级管理员
```

## 3、泛型（Generic）

> 定义一个函数或类时，有些情况下无法确定其中要使用的具体类型（返回值、参数、属性的类型不能确定），此时泛型便能够发挥作用。

### 3.1、泛型函数

```ts
function fn<T>(value: T): T {
    return value;
}

console.log(fn("123")); // 123
```

### 3.2、多个泛型

```ts
function fn1<T, K>(a: T, b: K): T {
    console.log(b); // 26
    return a;
}

console.log(fn1<string, number>("Best Shi", 26)); // Best Shi
```

### 3.3、泛型约束

```ts
interface Inter {
    length: number;
}

function fn3<T extends Inter>(value: T): number {
    return value.length;
}

console.log(fn3("interface")); // 9
```

### 3.4、泛型类

```ts
class Animal<T> {
    name: T;
    constructor(name: T) {
        this.name = name;
    }
}

let a = new Animal<string>("小黑");
console.log(a); // Animal { name: '小黑' }
```

## 4、模块与命名空间

> TypeScript 1.5 里术语名已经发生了变化。 “内部模块”现在称“命名空间”。 “外部模块”现在则简称为“模块”，这是为了与`ECMAScript 2015`里的术语保持一致。

### 4.1、模块

-   `index.ts`

    ```ts
    import { hi } from "./modules";
    import Animal from "./modules";
    import { name, age, gender } from "./modules";

    console.log(hi); // Hello world

    let dog = new Animal("小黑");
    dog.sayHi(); // 小黑   你好呀, 我是模块里面的

    console.log(name, age, gender); // Best Shi 26 男
    ```

-   `modules.ts`

    ```ts
    // 导出单个
    export const hi: string = "Hello world";
    
    // 默认导出
    export default class Animal {
        name: string;
        constructor(name: string) {
            this.name = name;
        }
        sayHi(): void {
            console.log(this.name);
            console.log("你好呀, 我是模块里面的");
        }
    }
    
    // 导出列表
    let name: string = "Best Shi";
    let age: number = 26;
    let sex: string = "男";
    export { name, age };
    
    // 重命名导出
    export { sex as gender };
    ```

### 4.2、命名空间

-   `index.ts`

    ```ts
    import A from "./spaceA";

    let dog = new A.Dog(); // namespaceA Dog
    ```

-   `spaceA.ts`

    ```ts
    namespace A {
        export class Dog {
            constructor() {
                console.log("namespaceA Dog");
            }
        }
    }
    
    export default A;
    ```

## 5、装饰器

> 1. 装饰器：装饰器是一种特殊类型的声明，它能够被附加到类声明，方法，属性或参数上，可以修改类的行为。
> 2. 装饰器就是一个方法，可以注入到类、方法、属性参数上来扩展类、属性、方法、参数的功能。
> 3. 常见的装饰器有：类装饰器、属性装饰器、方法装饰器、参数装饰器。
> 4. 装饰器的写法：普通装饰器（无法传参） 、 装饰器工厂（可传参）
> 5. Javascript 里的装饰器目前处在建议征集的第二阶段，但在 TypeScript 里已做为一项实验性特性予以支持。
> 6. 若要启用实验性的装饰器特性，你必须在命令行或`tsconfig.json`里启用`experimentalDecorators`编译器选。

**命令行**

```shell
tsc --target ES5 --experimentalDecorators
```

**tsconfig.json**

```json
{
    "compilerOptions": {
        "target": "ES5",
        "experimentalDecorators": true
    }
}
```

### 5.1、类装饰器

> 类装饰器表达式会在运行时当作函数被调用，类的构造函数作为其唯一的参数。
>
> 如果类装饰器返回一个值，它会使用提供的构造函数来替换类的声明。

#### 普通装饰器（不克传参）

```ts
// 普通装饰器
function logClass(params: any): void {
    // params 表示当前装饰器装饰的类
    console.log(params); // 1. [Function: HttpClient]

    params.prototype.url = "动态扩展的属性";
    params.prototype.run = function(): void {
        console.log("我是装饰器里面的方法");
    };
}

@logClass
class HttpClient {
    constructor() {
        console.log("httpClient"); // 2. httpClient
    }
}

// 设置 any 阻止 (类型“HttpClient”上不存在属性“run”.)报错
let http: any = new HttpClient();
console.log(http.url); // 3. 动态扩展的属性
http.run(); // 4. 我是装饰器里面的方法
```

#### 装饰器工厂（可传参）

```ts
// 装饰器工厂
function logClass(params: string) {
    return function(target: any) {
        console.log(params); // 1. www.bestshi.com
        // target 表示当前装饰器装饰的类
        console.log(target); // 2. [Function: HttpClient]
        target.prototype.url = params;
    };
}

@logClass("www.bestshi.com")
class HttpClient {
    constructor() {
        console.log("HttpClient"); // 3. HttpClient
    }
}

let http: any = new HttpClient();
console.log(http.url); // 4. www.bestshi.com
```

#### 重写构造函数

```ts
// 重写构造函数
function logClass(target: any) {
    console.log("@logClass", target); // 1. @logClass [Function: HttpClient]
    return class extends target {
        url: string = "我是装饰器修改的url";
        getInfo(): void {
            console.log("@logClass", this.url); // 3. @logClass 我是装饰器修改的url
        }
    };
}

@logClass
class HttpClient {
    url: string;
    constructor(url: string) {
        console.log("Httpclient", url); // 2. Httpclient www.bestshi.com
        this.url = url;
    }
    getInfo(): void {
        console.log("Httpclient", this.url);
    }
}

let http = new HttpClient("www.bestshi.com");
http.getInfo();
```

### 5.2、属性装饰器

> 属性装饰器表达式会在运行时当作函数被调用，传入下列 2 个参数：
>
> 1. 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
> 2. 属性的名字。

```ts
// // 属性装饰器
function logProperty(params: string) {
    return function(target: any, attr: string) {
        console.log("logProperty", params); // 1. logProperty www.bestshi.com
        console.log("logProperty", target); // 2. logProperty { getInfo: [Function (anonymous)] }
        console.log("logProperty", attr); // 3. logProperty url
        target[attr] = params;
    };
}

class HttpClient {
    @logProperty("www.bestshi.com")
    url: string | undefined;
    constructor(url: string) {
        this.url = url;
    }
    getInfo(): void {
        console.log("Httpclient", this.url); // 4. Httpclient www.smallshell.com
    }
}

let http = new HttpClient("www.smallshell.com");
http.getInfo();
```

### 5.3、方法装饰器

> 方法装饰器表达式会在运行时当作函数被调用，传入下列 3 个参数：
>
> 1. 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
> 2. 方法的名字。
> 3. 成员的属性描述符。
>
> **注意: **如果代码输出目标版本小于`ES5`，*属性描述符*将会是`undefined`。

```ts
// 方法装饰器
function logMethod(params: string) {
    return function(target: any, methodName: string, desc: any) {
        console.log("logProperty", params); // 1. logProperty www.bestshi.com
        console.log("logProperty", target); // 2. logProperty { getInfo: [Function (anonymous)] }
        console.log("logProperty", methodName); // 3. logProperty getInfo
        console.log("logProperty", desc); // 4. logProperty {writable: true, enumerable: false, configurable: true, value: ƒ}

        // 把装饰器方法里面传入的所有参数改为string类型
        let oMethod = desc.value;
        desc.value = function(...args: any[]) {
            args = args.map((value) => {
                return String(value);
            });
            oMethod.apply(this, args);
        };
    };
}

class HttpClient {
    url: string | undefined;
    constructor(url: string) {
        this.url = url;
    }
    @logMethod("www.bestshi.com")
    getInfo(...args: any[]): void {
        console.log("Httpclient", args); // 5. Httpclient["Best Shi", "26"]
        console.log("Httpclient", this.url); // 6. Httpclient www.smallshell.com
    }
}

let http = new HttpClient("www.smallshell.com");
http.getInfo("Best Shi", 26);
```

### 5.4、方法参数装饰器

> 参数装饰器表达式会在运行时当作函数被调用，传入下列 3 个参数：
>
> 1. 对于静态成员来说是类的构造函数，对于实例成员是类的原型对象。
> 2. 方法的名字。
> 3. 参数在函数参数列表中的索引。

```ts
// 方法参数装饰器
function logParams(params: string) {
    return function(target: any, methodName: string, paramsIndex: number) {
        console.log("logParams", params); // 1. logParams www.bestshi.com
        console.log("logParams", target); // 2. logParams {constructor: ƒ, getInfo: ƒ}
        console.log("logParams", methodName); // 3. logParams getInfo
        console.log("logParams", paramsIndex); // 4. logParams 0
    };
}

class HttpClient {
    url: string | undefined;
    constructor(url: string) {
        this.url = url;
    }

    getInfo(@logParams("www.bestshi.com") name: string, age: number): void {
        console.log("Httpclient", name, age); // 5. Httpclient Best Shi 26
        console.log("Httpclient", this.url); // 6. Httpclient www.smallshell.com
    }
}

let http = new HttpClient("www.smallshell.com");
http.getInfo("Best Shi", 26);
```

### 5.5、装饰器执行顺序

> 属性》方法》方法参数》类
>
> 如果有多个同样的装饰器，它会先执行后面的。

```ts
// 装饰器执行顺序
function logClass1(params: string) {
    return function(target: any) {
        console.log("类装饰器1"); // 8
    };
}
function logClass2(params: string) {
    return function(target: any) {
        console.log("类装饰器2"); // 7
    };
}

function logAttribute1(params?: string) {
    return function(target: any, attrName: any) {
        console.log("属性装饰器1"); // 2
    };
}
function logAttribute2(params?: string) {
    return function(target: any, attrName: any) {
        console.log("属性装饰器2"); // 1
    };
}

function logMethod1(params?: string) {
    return function(target: any, attrName: any, desc: any) {
        console.log("方法装饰器1"); // 4
    };
}
function logMethod2(params?: string) {
    return function(target: any, attrName: any, desc: any) {
        console.log("方法装饰器2"); // 3
    };
}

function logParams1(params?: string) {
    return function(target: any, attrName: any, desc: any) {
        console.log("方法参数装饰器1"); // 6
    };
}

function logParams2(params?: string) {
    return function(target: any, attrName: any, desc: any) {
        console.log("方法参数装饰器2"); // 5
    };
}

@logClass1("http://www.itying.com/api")
@logClass2("xxxx")
class HttpClient {
    @logAttribute1()
    @logAttribute2()
    public apiUrl: string | undefined;
    constructor() {}

    @logMethod1()
    @logMethod2()
    getData() {
        return true;
    }

    setData(@logParams1() attr1: any, @logParams2() attr2: any) {}
}

var http: any = new HttpClient();

// 属性装饰器2
// 属性装饰器1
// 方法装饰器2
// 方法装饰器1
// 方法参数装饰器2
// 方法参数装饰器1
// 类装饰器2
// 类装饰器1
```
