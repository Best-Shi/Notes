# npm workspace 项目搭建及使用

## 初始化项目

```bash
npm init -y
```

## 创建包

1. 创建包目录

```bash
mkdir packages
```

2. 生成包

```bash
npm init -w ./packages/package1 -y
```

**注意：** 遇到如下错误，先执行 `npm install -g npm` 。

```bash
npm ERR! code ENOWORKSPACES
npm ERR! This command does not support workspaces.
```

## 给包中安装依赖

- 开发依赖

```bash
npm install uuid -w package1 -D
```

- 项目依赖

```bash
npm install uuid -w package1
```

## 包中代码相互引用

`./package1/index.js`

```js
export default function fn() {
  console.log('package1');
}
```

`./package2/index.js`

```js
import fn from 'package1';

fn();
```

