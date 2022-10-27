# JavaScript 数组

> JavaScript 的 Array 对象是用于构造数组的全局对象，数组是类似于列表的高阶对象。

## 创建数组

**示例：**

```js
let arr1 = new Array(1, 3, 4, 4, 5, 3, 5, 32, 6, 67, 4, 9);
console.log(arr1); //  [1, 3, 4, 4, 5, 3, 5, 32, 6, 67, 4, 9]

let arr2 = [1, 3, 4, 4, 5, 3, 5];
console.log(arr2); // [1, 3, 4, 4, 5, 3, 5];
```

## length

> length 是 Array 的实例属性。返回或设置一个数组中的元素个数。

**示例：**

```js
console.log(arr1.length); // 12
```

## 数组修改器方法

> 修改器方法会改变数组本身

### 1、push

> 在数组的末尾增加一个或多个元素，并返回数组的新长度。

**示例：**

```js
console.log(arr1.push(90, 99)); // 14
console.log(arr1); // [1, 3, 4, 4, 5, 3, 5, 32, 6, 67, 4, 9, 90, 99]
```

### 2、pop

> 删除数组的最后一个元素，并返回这个元素。

**示例：**

```js
console.log(arr1.pop()); // 99
console.log(arr1); // [1, 3, 4, 4, 5, 3, 5, 32, 6, 67, 4, 9, 90]
```

### 3、unshift

> 在数组的开头增加一个或多个元素，并返回数组的新长度。

**示例：**

```js
console.log(arr1.unshift(55, 66)); // 15
console.log(arr1); // [55, 66, 1, 3, 4, 4, 5, 3, 5, 32, 6, 67, 4, 9, 90]
```

### 4、shift

> 删除数组的第一个元素，并返回这个元素。

**示例：**

```js
console.log(arr1.shift()); // 55
console.log(arr1); // [66, 1, 3, 4, 4, 5, 3, 5, 32, 6, 67, 4, 9, 90]
```

### 5、splice

> 在任意的位置给数组添加或删除任意个元素，返回被删除或者替换的元素。

**语法：**

```js
array.splice(start[, deleteCount[, item1[, item2[, ...]]]])
```

**参数说明：**

-   start：指定开始的位置（包含 start 位）。
    -   如果超出了数组的长度，则从数组末尾开始添加内容；
    -   如果是负值，则表示从数组末位开始的第几位（从-1 计数，这意味着-n 是倒数第 n 个元素并且等价于 array.length-n）；
    -   如果负数的绝对值大于数组的长度，则表示开始位置为第 0 位。
-   deleteCount：指定删除或替换的元素个数。
    -   如果 deleteCount 是 0 或者负数，则不移除元素。这种情况下，至少应添加一个新元素。
    -   如果 deleteCount 被省略了，或者它的值大于等于 array.length - start，那么 start 之后数组的所有元素都会被删除。
-   item：需要替换成的元素。

**示例：**

```js
// 删除元素，返回被删除的元素
console.log(arr1.splice(1, 3)); // [1, 3, 4]
console.log(arr1); //  [66, 4, 5, 3, 5, 32, 6, 67, 4, 9, 90]

// 替换元素，返回被替换的元素
console.log(arr1.splice(1, 3, 1, 2, 3, 4, 5)); // [4, 5, 3]
console.log(arr1); // [66, 1, 2, 3, 4, 5, 5, 32, 6, 67, 4, 9, 90]

// 插入元素，返回空数组
console.log(arr1.splice(1, 0, 22, 33, 44)); // []
console.log(arr1); // [66, 22, 33, 44, 1, 2, 3, 4, 5, 5, 32, 6, 67, 4, 9, 90]
```

### 6、reverse

> 颠倒数组中元素的排列顺序（翻转数组），返回翻转后的数组。

**示例：**

```js
console.log(arr1); // [66, 22, 33, 44, 1, 2, 3, 4, 5, 5, 32, 6, 67, 4, 9, 90]
console.log(arr1.reverse()); // [90, 9, 4, 67, 6, 32, 5, 5, 4, 3, 2, 1, 44, 33, 22, 66]
```

### 7、sort

> 对数组元素进行排序，并返回当前数组。

**语法：**

```js
arr.sort([function]);
```

**参数说明：**

-   function：用来指定按某种顺序进行排列的函数。如果省略，元素按照转换为的字符串的各个字符的 Unicode 位点进行排序。

    -   firstEl：第一个用于比较的元素。
    -   secondEl：第二个用于比较的元素。

**示例：**

```js
// 降序排序
console.log(arr1.sort((a, b) => b - a));
// [90, 67, 66, 44, 33, 32, 22, 9, 6, 5, 5, 4, 4, 3, 2, 1]

// 升序排序
console.log(arr1.sort((a, b) => a - b));
// [1, 2, 3, 4, 4, 5, 5, 6, 9, 22, 32, 33, 44, 66, 67, 90]
```

### 8、fill

> 将数组中指定区间的所有元素的值，都替换成某个固定的值。

**语法：**

```js
arr.fill(value[, start[, end]])
```

**参数说明：**

-   value：用来填充数组元素的值。
-   start：起始索引，默认值为 0。
-   end：终止索引，默认值为 this.length。

**示例：**

```js
console.log(arr1.fill(444, 2, 4)); // [1, 2, 444, 444, 4, 5, 5, 6, 9, 22, 32, 33, 44, 66, 67, 90]
```

### 9、copyWithin

> 在数组内部，将一段元素序列拷贝到另一段元素序列上，覆盖原有的值。

**语法：**

```js
arr.copyWithin(target[, start[, end]])
```

**参数说明：**

-   target：0 为基底的索引，复制序列到该位置。如果是负数，target 将从末尾开始计算。
    -   如果 target 大于等于 arr.length，将会不发生拷贝。
    -   如果 target 在 start 之后，复制的序列将被修改以符合 arr.length。
-   start：0 为基底的索引，开始复制元素的起始位置。如果是负数，start 将从末尾开始计算。
    -   如果 start 被忽略，copyWithin 将会从 0 开始复制。
-   end：0 为基底的索引，开始复制元素的结束位置。copyWithin 将会拷贝到该位置，但不包括 end 这个位置的元素。如果是负数， end 将从末尾开始计算。
    -   如果 end 被忽略，copyWithin 方法将会一直复制至数组结尾（默认为 arr.length）。

**示例：**

```js
console.log(arr1); // [1, 2, 444, 444, 4, 5, 5, 6, 9, 22, 32, 33, 44, 66, 67, 90]
console.log(arr1.copyWithin(-5)); // [1, 2, 444, 444, 4, 5, 5, 6, 9, 22, 32, 1, 2, 444, 444, 4]

console.log(arr1); // [1, 2, 444, 444, 4, 5, 5, 6, 9, 22, 32, 33, 44, 66, 67, 90]
console.log(arr1.copyWithin(0, 5)); // [5, 5, 6, 9, 22, 32, 33, 44, 66, 67, 90, 33, 44, 66, 67, 90]

console.log(arr1); // [1, 2, 444, 444, 4, 5, 5, 6, 9, 22, 32, 33, 44, 66, 67, 90]
console.log(arr1.copyWithin(0, 5, 9)); // [5, 5, 6, 9, 4, 5, 5, 6, 9, 22, 32, 33, 44, 66, 67, 90]

console.log(arr1); // [1, 2, 444, 444, 4, 5, 5, 6, 9, 22, 32, 33, 44, 66, 67, 90]
console.log(arr1.copyWithin(-2, -8, -4)); // [1, 2, 444, 444, 4, 5, 5, 6, 9, 22, 32, 33, 44, 66, 9, 22]
```

## 数组访问方法

> 这些方法绝对不会改变调用它们的对象的值，只会返回一个新的数组或者返回一个其它的期望值。

### 1、slice

> 抽取当前数组中的一段元素组合成一个新数组（包含开始位，不包含结束位）。

**语法：**

```js
arr.slice([begin[, end]])
```

**参数说明：**

-   begin：起始索引（从 0 开始）。
    -   如果省略 begin，则从 0 开始。
    -   如果 begin 超出原数组的索引范围，则会返回空数组。
    -   如果该参数为负数，则表示从原数组中的倒数第几个元素开始提取
-   end：结束索引。
    -   如果 end 被省略，则 slice 会一直提取到原数组末尾。
    -   如果 end 大于数组的长度，slice 也会一直提取到原数组末尾。
    -   如果该参数为负数，则表示从原数组中的倒数第几个元素结束提取

**示例：**

```js
console.log(arr1); // [1, 2, 444, 444, 4, 5, 5, 6, 9, 22, 32, 33, 44, 66, 67, 90]
console.log(arr1.slice(3, 10)); // [444, 4, 5, 5, 6, 9, 22]
console.log(arr1.slice(-10, -3)); //[5, 6, 9, 22, 32, 33, 44]
```

### 2、join

> 连接所有数组元素组成一个字符串。

**语法：**

```js
arr.join([separator]);
```

**参数说明：**

-   separator：指定一个字符串来分隔数组的每个元素（默认：`,`）。

**示例：**

```js
console.log(arr1.join()); // 1,2,444,444,4,5,5,6,9,22,32,33,44,66,9,22
console.log(arr1.join("-")); // 1-2-444-444-4-5-5-6-9-22-32-33-44-66-9-22
```

### 3、toString

> 返回一个由所有数组元素组合而成的字符串。

**示例：**

```js
console.log(arr1.toString()); // 1,2,444,444,4,5,5,6,9,22,32,33,44,66,9,22
```

### 4、indexOf

> 返回在数组中可以找到一个给定元素的第一个索引，如果不存在，则返回-1。

**语法：**

```js
arr.indexOf(searchElement[, fromIndex])
```

**参数说明：**

-   searchElement：需要查找的元素。
-   fromIndex：开始查找的位置。
    -   如果该索引值大于或等于数组长度，返回-1。
    -   若果是负数，则表示从倒数第几位开始查找。

**示例：**

```js
console.log(arr1); // [1, 2, 444, 444, 4, 5, 5, 6, 9, 22, 32, 33, 44, 66, 67, 90]
onsole.log(arr1.indexOf(444)); // 2
```

### 5、lastIndexOf

> 数组中该元素最后一次出现的索引，如未找到返回-1。

**语法：**

```js
arr.indexOf(searchElement[, fromIndex])
```

**参数说明：**

-   searchElement：需要查找的元素。
-   fromIndex：从此位置开始逆向查找。
    -   如果该索引值大于或等于数组长度，整个数组都被查找。
    -   若果是负数，则表示从倒数第几位开始查找。

**示例：**

```js
console.log(arr1.lastIndexOf(444, -5)); // 3
```

### 6、concat

> 返回一个由当前数组和其它若干个数组或者若干个非数组值组合而成的新数组（合并数组）。

**语法：**

```js
var new_array = old_array.concat(value1[, value2[, ...[, valueN]]])
```

**参数说明：**

-   value：数组或值，将被合并到一个新的数组中。
    -   如果省略了 value 参数，则返回现存数组的一个浅拷贝。

**示例：**

```js
console.log(arr1.concat(123, 335));
// [1, 2, 444, 444, 4, 5, 5, 6, 9, 22, 32, 33, 44, 66, 9, 22, 123, 335]

console.log(arr1.concat([45, 33]));
// [1, 2, 444, 444, 4, 5, 5, 6, 9, 22, 32, 33, 44, 66, 9, 22, 45, 33]
```

### 7、includes

> 判断当前数组是否包含某指定的值，如果是返回 true，否则返回 false。

**语法：**

```js
arr.includes(valueToFind[, fromIndex])
```

**参数说明：**

-   valueToFind：需要查找的元素。
    -   比较字符串和字符时是区分大小写。
-   fromIndex：从 fromIndex 索引处开始查找 valueToFind。
    -   若果是负数，则从末尾开始往前跳 fromIndex 的绝对值个索引，然后往后搜寻。默认为 0。

**示例：**

```js
console.log(arr1.concat([45, 33]));
// [1, 2, 444, 444, 4, 5, 5, 6, 9, 22, 32, 33, 44, 66, 9, 22, 45, 33]
console.log(arr1.includes(33, -10)); // true
console.log(arr1.includes(3, -5)); // false
```

### 8、toLocaleString

> 返回一个由所有数组元素组合而成的本地化后的字符串。

**语法：**

```js
arr.toLocaleString([locales[,options]]);
```

**参数说明：**

-   locales：带有 BCP 47 语言标记的字符串或字符串数组。
    -   关于 locales 参数的形式与解释，请看 [Intl](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Intl) 页面。
-   options：一个可配置属性的对象。
    -   对于数字 [Number.prototype.toLocaleString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Number/toLocaleString)。
    -   对于日期 [Date.prototype.toLocaleString()](https://developer.mozilla.org/zh-CN/docs/Web/JavaScript/Reference/Global_Objects/Date/toLocaleString)。

**示例：**

```js
console.log(
    arr3.toLocaleString("zh", {
        style: "currency",
        currency: "CNY",
    })
);
// ¥10.00,¥23.00,¥33.00
console.log(
    arr3.toLocaleString("zh", {
        style: "percent",
    })
);
// 1,000%,2,300%,3,300%
```

> currency：在货币格式化中使用的货币符号。
> "USD" 表示美元, "EUR" 表示欧元, 或者 "CNY"是人民币；更多请参考 [Current currency & funds code list](https://www.currency-iso.org/en/home/tables/table-a1.html)。
> 没有默认值，如果 style 是 “currency”，必须提 currency 属性。

## 数组迭代方法

### 1、forEach

> 为数组中的每个元素执行一次回调函数。没有返回值。

**语法：**

```js
arr.forEach(callback(currentValue [, index [, array]])[, thisArg])
```

**参数说明：**

-   callback：为数组中每个元素执行的函数，该函数接收一至三个参数：
    -   currentValue：当前元素。
    -   index：当前元素的索引。
    -   array：当前处理的数组。
-   thisArg：可选参数。当执行回调函数 callback 时，用作 this 的值。

**示例：**

```js
arr1.forEach((item, index) => {
    console.log(index, item);
});
```

### 2、map

> 返回一个由回调函数的返回值组成的新数组。

**语法：**

```js
var new_array = arr.map(function callback(currentValue[, index[, array]]) {
 // Return element for new_array
}[, thisArg])
```

**参数说明：**

-   callback：生成新数组元素的函数，使用三个参数：
    -   currentValue：当前元素。
    -   index：当前元素的索引。
    -   array：当前处理的数组。
-   thisArg：执行 callback 函数时值被用作 this。

**示例：**

```js
console.log(arr1); // [1, 2, 444, 444, 4, 5, 5, 6, 9, 22, 32, 33, 44, 66, 9, 22]
let arr4 = arr1.map((item) => {
    return item * 2;
});
console.log(arr4); // [2, 4, 888, 888, 8, 10, 10, 12, 18, 44, 64, 66, 88, 132, 18, 44]
```

### 3、filter

> 将所有在过滤函数中返回 true 的数组元素放进一个新数组中并返回。

**语法：**

```js
var newArray = arr.filter(callback(element[, index[, array]])[, thisArg])
```

**参数说明：**

-   callback：用来测试数组的每个元素的函数。返回 true 表示该元素通过测试，保留该元素，false 则不保留。它接受以下三个参数：
    -   element：当前元素。
    -   index：当前元素的索引。
    -   array：当前处理的数组。
-   thisArg：执行 callback 函数时值被用作 this。

**示例：**

```js
let arr5 = arr4.filter((item) => {
    return item > 50;
});
console.log(arr5); // [888, 888, 64, 66, 88, 132]
```

### 4、find

> 找到第一个满足测试函数的元素并返回那个元素的值，如果找不到，则返回 undefined。

**语法：**

```js
var newArray = arr.find(callback(element[, index[, array]])[, thisArg])
```

**参数说明：**

-   callback：在数组每一项上执行的函数。它接受以下三个参数：
    -   element：当前元素。
    -   index：当前元素的索引。
    -   array：当前处理的数组。
-   thisArg：执行 callback 函数时值被用作 this。

**示例：**

```js
let res6 = arr4.find((item) => {
    return item > 50;
});
console.log(res6); // 888
```

### 5、findIndex

> 找到第一个满足测试函数的元素并返回那个元素的索引，如果找不到，则返回 -1。

**语法：**

```js
var newArray = arr.findIndex(callback(element[, index[, array]])[, thisArg])
```

**参数说明：**

-   callback：在数组每一项上执行的函数。它接受以下三个参数：
    -   element：当前元素。
    -   index：当前元素的索引。
    -   array：当前处理的数组。
-   thisArg：执行 callback 函数时值被用作 this。

**示例：**

```js
let res7 = arr4.findIndex((item) => item > 50);
console.log(res7); // 2
```

### 6、every

> 如果数组中的每个元素都满足测试函数，则返回 true，否则返回 false。

**语法：**

```js
arr.every(callback(element[, index[, array]])[, thisArg])
```

**参数说明：**

-   callback：用来测试每个元素的函数，它可以接收三个参数：
    -   element：当前元素。
    -   index：当前元素的索引。
    -   array：当前处理的数组。
-   thisArg：执行 callback 函数时值被用作 this。

**示例：**

```js
console.log(arr5); // [888, 888, 64, 66, 88, 132, 'abc']
let res = arr5.every((item) => {
    return typeof item === "number";
});
console.log(res); // false
```

### 7、some

> 如果数组中至少有一个元素满足测试函数，则返回 true，否则返回 false。

**语法：**

```js
arr.some(callback(element[, index[, array]])[, thisArg])
```

**参数说明：**

-   callback：用来测试每个元素的函数，它可以接收三个参数：
    -   currentValue：当前元素。
    -   index：当前元素的索引。
    -   array：当前处理的数组。
-   thisArg：执行 callback 函数时值被用作 this。

**示例：**

```js
let res1 = arr5.some((item) => typeof item === "number");
console.log(res1); // true
```

### 8、reduce

> 从左到右为每个数组元素执行一次回调函数，并把上次回调函数的返回值放在一个暂存器中传给下次回调函数，并返回最后一次回调函数的返回值。

**语法：**

```js
arr.reduce(callback(accumulator, currentValue[, index[, array]])[, initialValue])
```

**参数说明：**

-   callback：执行数组中每个值 (如果没有提供 initialValue 则第一个值除外)的函数，包含四个参数：
    -   accumulator：累计器累计回调的返回值; 它是上一次调用回调时返回的累积值，或 initialValue。
    -   currentValue：数组中正在处理的元素。
    -   index：数组中正在处理的当前元素的索引。 如果提供了 initialValue，则起始索引号为 0，否则从索引 1 起始。
    -   array：调用 reduce()的数组。
-   initialValue：作为第一次调用 callback 函数时的第一个参数的值。 如果没有提供初始值，则将使用数组中的第一个元素。 在没有初始值的空数组上调用 reduce 将报错。

**示例：**

```js
// 数组求和
let arr = [1, 3, 4, 4];
let sum = arr.reduce((acc, cur) => acc + cur, 0);
console.log(sum); // 12

// 统计数组对象中的值
let arr = [{ x: 1 }, { x: 5 }, { x: 9 }];
let sum = arr.reduce((a, b) => a + b.x, 0);
console.log(sum); // 15

// 二维数组扁平化
let arr = [
    [1, 3],
    [3, 3],
    [4, 3],
];
let res = arr.reduce((a, b) => a.concat(b), []);
console.log(res); //  [1, 3, 3, 3, 4, 3]

// 统计元素出现的次数
let names = ["Alice", "Bob", "Tiff", "Bruce", "Alice"];

let res = names.reduce((a, b) => {
    if (b in a) {
        a[b]++;
    } else {
        a[b] = 1;
    }
    return a;
}, {});
console.log(res);
```

### 9、flat

> 按照一个可指定的深度递归遍历数组，并将所有元素与遍历到的子数组中的元素合并为一个新数组返回。

**语法：**

```js
var newArray = arr.flat([depth]);
```

**参数说明：**

-   depth：指定要提取嵌套数组的结构深度，默认值为 1。

**示例：**

```js
let arr = [
    [1, 3],
    [3, 3],
    [4, 3],
];
let res = arr.flat();
console.log(res); //  [1, 3, 3, 3, 4, 3]

let arr1 = [
    [1, 3],
    [3, 3],
    [4, [3, 5]],
];

console.log(arr1.flat(2)); //  [1, 3, 3, 3, 4, 3, 5]
```
