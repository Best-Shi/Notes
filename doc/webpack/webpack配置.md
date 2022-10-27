# webpack 配置

## 处理 HTML

处理 HTML 时，使用 [html-webpack-plugin](https://github.com/jantimon/html-webpack-plugin) 插件。

基本配置：

```bash
npm install -D html-webpack-plugin
```

**webpack.config.js**

```js
plugins: [
  new HtmlWebpackPlugin({
    title: 'My App',
    template: 'index.html',
  }),
];
```

**index.html**

```html
<!DOCTYPE html>
<html>
  <head>
    <meta charset="utf-8" />
    <title><%= htmlWebpackPlugin.options.title %></title>
  </head>
  <body></body>
</html>
```

## 处理 css

处理 css 使用 [style-loader](https://github.com/webpack-contrib/style-loader)(把 css 样式添加到 style 标签中)、[css-loader](https://github.com/webpack-contrib/css-loader)，如果使用其它 css 编译器时，应加上对应 loader，如使用 scss 时，应使用 [sass-loader](https://github.com/webpack-contrib/sass-loader)。

TODO: 生产模式 css 处理

在处理 css 的时候需要根据项目项目设置的浏览器兼容，为 css 添加兼容代码并且把 css 新属性转换成兼容浏览器能识别的属性(如：#008c8c56 => rgba(0,140,140,0.34))。css 兼容使用 [postcss-loader](https://github.com/webpack-contrib/postcss-loader)。

在使用 [postcss-loader](https://github.com/webpack-contrib/postcss-loader) 时需要使用插件去查询项目需要兼容的浏览器信息。常用插件：[autoprefixer](https://github.com/postcss/autoprefixer)、[postcss-preset-env](https://github.com/csstools/postcss-preset-env)(包含 autoprefixer)。

查询浏览器信息的时候会使用 [browserslist](https://github.com/browserslist/browserslist) 工具根据配置文件去 [caniuse](https://caniuse.com/usage-table)查询对应的浏览器信息。

基本配置：

```bash
npm install -D style-loader css-loader sass-loader sass postcss-loader postcss postcss-preset-env
```

**.browserslistrc**

```
> 1%
last 2 version
not dead
```

**postcss.config.js**

```js
module.exports = {
  plugins: ['postcss-preset-env'],
};
```

**webpack.config.js**

```js
module: {
  rules: [
    {
      test: /\.css$/i,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            // 配置之前多少 loader 应用于 @import 导入的 CSS 资源。
            importLoaders: 1,
          },
        },
        'postcss-loader',
      ],
    },
    {
      test: /\.s[ac]ss$/i,
      use: [
        'style-loader',
        {
          loader: 'css-loader',
          options: {
            // 配置之前多少 loader 应用于 @import 导入的 CSS 资源。
            importLoaders: 2,
          },
        },
        'postcss-loader',
        'sass-loader',
      ],
    },
  ];
}
```

## 处理 JavaScript

在处理 js 的时候也需要根据需要兼容的浏览器，通过 [balbel](https://babel.dev/) 把代码转换成浏览器能识别的代码。babel 在处理 js 代码的时候会根据 `.browserslistrc` 配置进行代码转换。也可以单独配置需要兼容的浏览器(不建议)。webpack 中需要使用 [babel-loader](https://github.com/babel/babel-loader)完成代码转换，babel-loader 依赖 [@babel/preset-env](https://babel.dev/docs/en/babel-preset-env)。

babel 在代码转换的时候需要为浏览器添加 [polyfill](<https://en.wikipedia.org/wiki/Polyfill_(programming)>)。在添加 `polyfill` 时使用的是 [@babel/polyfill](https://babel.dev/docs/en/babel-polyfill)(Babel 7.4.0 以后弃用)，建议使用 `regenerator-runtime` 和 `core-js`。

基本配置：

```bash
npm install -D babel-loader @babel/core @babel/preset-env
npm install regenerator-runtime core-js
```

**webpack.config.js**

```js
module: {
  rules: [
    {
      test: /\.js$/i,
      use: 'babel-loader',
      exclude: /node_modules/,
    },
  ];
}
```

**babel.config.js**

```js
module.exports = {
  presets: [
    '@babel/preset-env',
    {
      useBuiltIns: 'usage',
      corejs: '3.20',
    },
  ],
};
```

## 处理额外资源

### 处理图片

**webpack.config.js**

```js
module: {
  rules: [
    {
      test: /\.(png|jpe?g|gif|webp|svg)$/i,
      type: 'asset',
      generator: {
        filename: 'images/[name].[hash:8][ext]',
      },
      parser: {
        dataUrlCondition: {
          maxSize: 8 * 1024,
        },
      },
    },
  ];
}
```

### 处理字体

**webpack.config.js**

```js
module: {
  rules: [
    {
      test: /\.(woff2?|eot|ttf|otf)$/i,
      type: 'asset',
      generator: {
        filename: 'fonts/[name].[hash:8][ext]',
      },
    },
  ];
}
```

### 处理媒体文件

**webpack.config.js**

```js
module: {
  rules: [
    {
      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/i,
      type: 'asset',
      generator: {
        filename: 'media/[name].[hash:8][ext]',
      },
    },
  ];
}
```

## 处理 vue

vue 3.2.13 之后 [vue-loader](https://vue-loader.vuejs.org/zh/)在处理 `.vue` 文件时需要使用 [@vue/compiler-sfc](https://github.com/vuejs/vue-next/tree/master/packages/compiler-sfc) 编译器。

vue 3.2.13 之前 `vue-loader` 在处理 `.vue` 文件时需要使用 `vue-template-compiler` 编译器。

vue-loader 默认已经添加热更新功能。

基本配置：

```bash
npm install -D vue-loader@next @vue/compiler-sfc
npm install vue@next
```

**webpack.config.js**

```js
const { VueLoaderPlugin } = require('vue-loader');
module: {
  rules: [
    {
      test: /\.vue$/i,
      loader: 'vue-loader',
    },
  ];
}
puglins: [new VueLoaderPlugin()];
```

**main.js**

```js
import { createApp } from 'vue';
import App from './App.vue';

const app = createApp(App);

app.mount('#app');
```

## 处理 React(.jsx)

处理 `.jsx` 文件需要使用 [@babel/preset-react](https://babeljs.io/docs/en/babel-preset-react)预设进行解析。

如果用 React 开发，默认并不会开启热更新，需要手动设置。配置时需要依赖 ['react-refresh-webpack-plugin'](https://github.com/pmmmwh/react-refresh-webpack-plugin)、`react-refresh` 插件。

基本配置：

```bash
npm install -D @babel/core @babel/preset-env @babel/preset-react babel-loader react-refresh-webpack-plugin react-refresh
npm install core-js regenerator-runtime react react-dom
```

**webpack.config.js**

```js
const ReactRefreshWebapckPlugin = require('@pmmmwh/react-refresh-webpack-plugin');

devServer: {
  hot: true;
}
module: {
  rules: [
    {
      test: /\.jsx?$/i,
      exclude: /node_modules/,
      loader: 'babel-loader',
    },
  ];
}
plugins: [new ReactRefreshWebapckPlugin()];
```

**babel.config.js**

```js
module.exports = {
  presets: [
    [
      '@babel/preset-env',
      {
        useBuiltIns: 'usage',
        corejs: '3.20',
      },
    ],
    ['@babel/preset-react'],
  ],
  plugins: [['react-refresh/babel']],
};
```

**main.jsx**

```jsx
import React, { Component } from 'react';
import ReactDOM from 'react-dom';

class App extends Component {
  constructor(props) {
    super(props);
    this.state = {
      message: 'Hello BestShi',
    };
  }
  render() {
    return (
      <div>
        <h2>{this.state.message}</h2>
      </div>
    );
  }
}
ReactDOM.render(<App />, document.getElementById('app'));
```

## 处理 ts

处理 `ts` 时，需要在项目根目录创建 `tsconfig.jons` 配置文件。使用 `tsc --init` 名创建配置文件。

在处理 `.ts` 文件时需要使用到 [ts-loader](https://github.com/TypeStrong/ts-loader)，也可以使用 `babel-loader` 处理。在使用 `babel-loader` 处理 `ts` 时，需要依赖 [@babel/preset-typescript](https://babeljs.io/docs/en/babel-preset-typescript)预设。

如果使用 `ts-loader` 处理项目中 `ts` 代码的时候会出现一个问题，就是需要浏览器兼容的时候 `ts-loader` 不能添加 `polyfill`。

如果使用 `babel-loader` 处理项目中的 `ts` 代码的时候能添加 `polyfill`，但是没有 `ts` 的语法校验。

推荐：在开发环境中，使用 `ts-loader` 进行代码类型校验，在生产模式中，先使用 `tsc` 进行类型检测，然后再使用 `babel-loader` 为代码添加 `polyfill`。

基本设置：

```bash
npm install -D typesrcipt ts-loader babel-loader @babel/core @babel/preset-env @babel/preset-typescript core-js regenerator-runtime
```

**webpack.config.js**

```js
module: {
  rules: [
    // development
    {
      test: /\.ts$/i,
      loader: 'ts-loader',
      options: {
        appendTsSuffixTo: [/\.vue$/],
      },
    },
    // production
    {
      test: /\.ts$/i,
      loader: 'babel-loader',
    },
  ];
}
```

**babel.config.json**

```json
{
  "presets": [
    [
      "@babel/preset-env",
      {
        "useBuiltIns": "usage",
        "corejs": "3.20"
      }
    ],
    [
      "@babel/preset-typescript",
      {
        "allExtensions": true
      }
    ]
  ]
}
```

