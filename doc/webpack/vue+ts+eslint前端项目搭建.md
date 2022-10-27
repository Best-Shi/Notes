# webpack + vue + ts + eslint 前端项目搭建

项目开发一个简单后台管理系统，使用 `vue` 框架 + `typescript` 进行开发，打包工具使用 `webpack`；项目使用 `eslint` 进行语法校验，使用 `prettier` 进行格式化。

项目中使用 `vuex` 作为数据仓库，使用 `vue-router` 实现单页面路由，使用 `axios` 二次封装作为项目接口请求函数。

## 安装 webpack 搭建基本功能

1. 安装 webpack 依赖

```bash
npm init -y
npm install -D webpack webpack-cli webpack-dev-server webpack-merge
```

2. 安装 ts 依赖

```bash
npm install -D ts-loader typescript ts-node
```

3. 初始化 ts 配置文件

```bash
npx tsc --init
```

4. 创建基本目录及文件

```
├── node_modules
├── public
├── ├── favicon.icon
├── └── index.html
├── src
├── ├── assets
├── ├── components
├── ├── modules
├── ├── routers
├── ├── └──index.ts
├── ├── utils
├── ├── App.vue
├── └── main.ts
├── package-lock.json
├── package.json
├── shims-vue.d.ts
├── tsconfig.json
├── webpack.common.ts
├── webpack.dev.ts
├── webpack.prod.ts
```

5. 基本配置

`index.html`

```html
<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta http-equiv="X-UA-Compatible" content="IE=edge" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <link rel="icon" href="<%= BASE_URL %>favicon.ico" />
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>
  <body>
    <div id="app"></div>
  </body>
</html>
```

`tscconfig.json`

```json
{
  "compilerOptions": {
    "target": "esnext",
    "module": "commonjs",
    "esModuleInterop": true,
    "forceConsistentCasingInFileNames": true,
    "strict": true,
    "skipLibCheck": true
  }
}
```

`webpack.common.ts`

```ts
import path from 'path';

import webpack, { DefinePlugin } from 'webpack';
import HtmlWebpackPlugin from 'html-webpack-plugin';

const common: webpack.Configuration = {
  entry: './src/main.ts',
  output: {
    filename: 'js/[name].[hash:8].js',
    path: path.resolve(__dirname, 'dist'),
  },
  module: {
    rules: [
      {
        test: /\.ts$/i,
        loader: 'ts-loader',
        exclude: /node_modules/,
      },
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      title: 'BestShi',
      template: './public/index.html',
    }),
    new DefinePlugin({
      BASE_URL: '"./"',
    }),
  ],
};

export default common;
```

`webpack.dev.ts`

```ts
import { merge } from 'webpack-merge';
import common from './webpack.common';

import 'webpack-dev-server';

export default merge(common, {
  mode: 'development',
  devtool: 'source-map',
  devServer: {
    hot: 'only',
    open: true,
  },
});
```

`package.json`

```json
{
  ...
  "scripts": {
    "dev": "webpack server --config ./webpack.dev.ts"
  }
  ...
}
```

## 添加 vue 及 ts 支持

1. 安装依赖

```bash
npm install vue@next
npm install -D vue-loader@next @vue/compiler-sfc
```

2. 添加 vue 类型文件

在项目跟目录下添加 `vue` 类型文件。

`shims-vue.d.ts`

```ts
declare module '*.vue' {
  import type { DefineComponent } from 'vue';
  const component: DefineComponent<{}, {}, any>;
  export default component;
}
```

3. 修改配置文件

`webpack.common.ts`

```ts
import { VueLoaderPlugin } from 'vue-loader';

resolve: {
    alias: {
      '@': '/src',
    },
    extensions: ['.ts', '.vue', '...'],
};
rules: [
  {
    test: /\.vue$/i,
    loader: 'vue-loader',
    exclude: /node_modules/,
  },
];
plugins: [new VueLoaderPlugin()];
```

`webpack.dev.ts`

```ts
rules: [
  {
    test: /\.ts$/i,
    loader: 'ts-loader',
    exclude: /node_modules/,
    options: {
      appendTsSuffixTo: [/\.vue$/i],
    },
  },
];
```

4. 修改入口文件

`src/main.ts`

```ts
import { createApp } from 'vue';

import App from './App.vue';
import router from './routers';

createApp(App).use(router).mount('#app');
```

5. 添加路由

```bash
npm install vue-router@4
```

`src/routers/index.ts`

```ts
import { createRouter, createWebHistory, RouteRecordRaw } from 'vue-router';

const routes: Array<RouteRecordRaw> = [];
const router = createRouter({
  history: createWebHistory(),
  routes,
});

export default router;
```

## 处理 css 及 scss

解析 `css` 时需要处理浏览器兼容，以及添加 `polyfill`。

1. 安装依赖

```bash
npm install -D style-loader css-loader sass-loader sass postcss-loader postcss postcss-preset-env
```

2. 添加配置文件

根目录添加浏览器兼容配置文件 `.browserslistrc`，添加 `postcss-loader` 配置文件 `.postcssrc`。

`.browserslistrc`

```yml
> 1%
last 2 version
not dead
```

`.postcssrc`

```json
{
  "plugins": ["postcss-preset-env"]
}
```

`webpack.dev.ts`

```ts
rules: [
  {
    test: /\.(c|sc|sa)ss$/i,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          importLoaders: 2,
        },
      },
      'postcss-loader',
      'sass-loader',
    ],
  },
];
plugins: [
  new DefinePlugin({
    __VUE_OPTIONS_API__: true,
    __VUE_PROD_DEVTOOLS__: true,
  }),
];
```

## 处理资源文件

1. 处理图片

`webpack.common.ts`

```ts
rules: [
  {
    test: /\.(png|jpe?g|gif|webp|svg)$/i,
    type: 'asset',
    generator: {
      filename: 'images/[name].[hash:8][ext]',
    },
    parser: {
      dataUrlCondition: {
        maxSize: 10 * 1024,
      },
    },
  },
];
```

2. 处理字体文件

`webpack.common.ts`

```ts
ruels: [
  {
    test: /\.(woff2?|eot|ttf|otf)$/i,
    type: 'asset',
    generator: {
      filename: 'fonts/[name].[hash:8][ext]',
    },
  },
];
```

3. 处理媒体文件

`webpack.common.ts`

```ts
rules: [
  {
    test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/i,
    type: 'asset',
    generator: {
      filename: 'media/[name].[hash:8][ext]',
    },
  },
];
```

## 添加 eslint 与 prettier

1. 安装依赖

```bash
npm install -D eslint
```

2. 初始化 eslint 配置文件

运行 `npx eslint --init` 根据自己需要，选择对应项目生成配置文件。

eslint 规则按需修改。

`.eslintrc.json`

```json
{
  "env": {
    "browser": true,
    "commonjs": true,
    "es2021": true
  },
  "extends": ["plugin:vue/essential", "airbnb-base"],
  "parserOptions": {
    "ecmaVersion": 13,
    "parser": "@typescript-eslint/parser",
    "sourceType": "module"
  },
  "plugins": ["vue", "@typescript-eslint"],
  "rules": {
    "import/no-extraneous-dependencies": 0,
    "linebreak-style": 0,
    "arrow-parens": 0,
    "import/no-unresolved": 0,
    "vue/multi-word-component-names": 0
  }
}
```

3. 添加 prettier 配置文件

`.prettierrc`

```json
{
  "singleQuote": true,
  "trailingComma": "all",
  "printWidth": 100,
  "tabWidth": 2,
  "proseWrap": "never",
  "arrowParens": "avoid",
  "overrides": [
    {
      "files": ".prettierrc",
      "options": {
        "parser": "json"
      }
    }
  ]
}
```
