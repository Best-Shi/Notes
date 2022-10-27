# webpack + vue 企业级项目搭建

> 技术选型：typescript + webpack + vue + vue-router + pinia + axios + sass + eslint + prettier

## 初始化项目

```bash
npm init -y
git init -b main
```

- 创建 `.gitignore`文件。（[忽略规则](https://git-scm.com/docs/gitignore)自行添加）
  ```
  + node_modules
  + dist
  + .eslintcache
  + .npm
  ```
- 创建 `README.md`项目说明文件。（内容根据项目自己添加）

## webpack 安装配置

```bash
npm install -D webpack webpack-cli webpack-dev-server webpack-merge
```

- `webpack`: webpack 打包工具主程序。
- `webpack-cli`: 解析 webpack 配置文件。
- `webpack-dev-server`: webpack 构建开发服务器。
- `webpack-merge`: 合并 webpack 配置文件。

### 创建 webpack 配置文件

- `config/webpack.common.ts`: webpack 基本配置。
- `config/webpack.dev.ts`: webpack 开发环境配置。
- `config/webpack.prod.ts`: webpack 生产环境配置。

**注意：** 由于 webpack 配置文件使用 ts，所以得安装 `typescript ts-node @types/node @types/webpack`。

```bash
npm install -D typescript ts-node @types/node @types/webpack
```

- `typescript`: typescript。
- `ts-node`: 不需要编译成 `JavaScript`，能直接执行`.ts`文件。
- `@types/node`: node 类型声明文件。
- `@types/webpack`: webpack 类型声明文件。

### webpack 基本配置

- `config/webpack.common.ts`

  ```ts
  + import path from 'node:path';
  + import { Configuration } from 'webpack';
  + const common: Configuration = {
  +   context: path.resolve(__dirname, '..'),
  +   entry: './src/main.ts',
  + };
  + export default common;
  ```

- `config/webpack.dev.ts`

  ```ts
  + import { Configuration } from 'webpack';
  + import { merge } from 'webpack-merge';
  + import 'webpack-dev-server';
  + import common from './webpack.common';
  + const devConfig: Configuration = merge(common, {
  +   mode: 'development',
  +   devtool: 'source-map',
  +   devServer: {
  +     port: 8899,
  +     open: true,
  +     hot: 'only',
  +   },
  + });
  + export default devConfig;
  ```

- `config/webpack.prod.ts`
  ```ts
  + import path from 'node:path';
  + import { Configuration } from 'webpack';
  + import { merge } from 'webpack-merge';
  + import common from './webpack.common';
  + const pordConfig: Configuration = merge(common, {
  +   mode: 'production',
  +   output: {
  +     path: path.resolve(__dirname, '../dist'),
  +     filename: 'js/[name].[hash:8].js',
  +     clean: true,
  +     publicPath: './',
  +   },
  + });
  + export default pordConfig;
  ```

### `package.json` 中添加命令

```json
"scripts": {
 + "dev": "webpack server --config config/webpack.dev.ts",
 + "build": "webpack --config config/webpack.prod.ts"
},
```

## 创建项目基本目录

```bash
mkdir public
mkdir src/components
mkdir src/assets/fonts
mkdir src/assets/scss
mkdir src/assets/images
mkdir src/utils
mkdir src/routers
mkdir src/modules
```

## 添加路径别名

- `config/webpack.common.ts`
  ```ts
  const common: Configuration = {
  +  resolve: {
  +    alias: {
  +      '@': '/src',
  +      '@img': '/src/assets/images',
  +      '@utils': '/src/utils',
  +      '@comp': '/src/components',
  +    },
  +    extensions: ['.vue', '.ts', '.tsx', '...'],
  +  },
  }
  ```

## 处理 vue

### 安装依赖

```bash
npm install vue@next
npm install -D vue-loader@next
```

- `vue@next`: 最新版本 vue。
- `vue-loader@next`: 最新版本的 `vue-loader`。在 vue3 之前需要安装 `vue-template-compiler`。vue3 之后需要安装`@vue/compiler-sfc`

**注意：** vue 从 3.2.13+ 开始，`@vue/compiler-sfc`已经作为 vue 的依赖包含在内。所以无需显示安装。

### 添加 vue 配置

- `config/webpack.common.ts`
  ```ts
  + import { VueLoaderPlugin } from 'vue-loader';
  const common: Configuration = {
  +   module: {
  +     rules: [
  +       {
  +         test: /\.vue$/i,
  +         loader: 'vue-loader',
  +       },
  +     ],
  +   },
  +   plugins: [
  +      new VueLoaderPlugin()
  +   ],
  }
  ```

### 添加 vue 声明文件

- `src/shims-vue.d.ts`
  ```ts
  + declare module '*.vue' {
  +   import { defineComponent } from 'vue';
  +   const Component: ReturnType<typeof defineComponent>;
  +   export default Component;
  + }
  ```

### 添加 vue 主文件

- `src/App.vue`

  ```vue
  <template>
    <h2>Hello Vue</h2>
  </template>
  ```

- `src/main.ts`
  ```ts
  +  import { createApp } from 'vue';
  +  import App from '@/App.vue';
  +  const app = createApp(App);
  +  app.mount('#app');
  ```

### 添加 html，自动加载编译后的 js 文件

- 安装依赖

  ```bash
  npm install -D html-webpack-plugin
  ```

- 添加 html 模板 `public/index.html`
  ```html
  <!DOCTYPE html>
  <html lang="cn">
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
- 添加配置文件 `config/webpack.config.ts`

  ```ts
  -  import { Configuration } from 'webpack';
  +  import { Configuration, DefinePlugin } from 'webpack';
  +  import HtmlWebpackPlugin from 'html-webpack-plugin';
  plugins: [
  +  new DefinePlugin({
  +    BASE_URL: '"./"',
  +  }),
  +  new HtmlWebpackPlugin({
  +    title: 'CV 操作员',
  +    template: './public/index.html',
  +  }),
  ],
  ```

## 处理 ts、tsx

> 对于 ts 代码，使用 `ts-loader` 进行编译，并进行类型校验，然后使用 `babel-loader` 按照兼容的浏览器添加兼容代码。
>
> 对于 tsx 代码 则直接使用 `babel-loader` 进行编译，然后添加兼容代码，并使用 `eslint` 进行类型校验和语法校验。

### 安装依赖

```bash
npm install -D babel-loader @babel/core @babel/preset-env core-js @babel/preset-typescript @vue/babel-plugin-jsx babel-plugin-transform-remove-console babel-plugin-transform-remove-debugger
```

- `@babel/core`: babel 核心功能。
- `@babel/preset-env`: babel 默认预设。
- `core-js`: babel polyfill。
- `@babel/preset-typescript`: babel typescript 预设。
- `@vue/babel-plugin-jsx`: 解析 vue 中的 tsx。
- `babel-plugin-transform-remove-console`: 移除代码中的 console。
- `babel-plugin-transform-remove-debugger`: 移除代码中的 debugger。

### 添加 typescript 配置文件

- `tsconfig.json`
  ```json
  +   {
  +     "compilerOptions": {
  +       "module": "esnext",
  +       "target": "esnext",
  +       "strict": true,
  +       "esModuleInterop": true,
  +       "allowSyntheticDefaultImports": true,
  +       "forceConsistentCasingInFileNames": true,
  +       "skipLibCheck": true,
  +       "experimentalDecorators": true,
  +       "moduleResolution": "node",
  +       "baseUrl": ".",
  +       "jsx": "preserve",
  +       "sourceMap": true
  +     },
  +     "ts-node": {
  +       "compilerOptions": {
  +         "module": "CommonJS"
  +       }
  +     },
  +     "paths": {
  +       "@/*": "src/*",
  +       "@img/*": "src/assets/images/*",
  +       "@utils/*": ["src/utils/*"],
  +       "@comp/*": ["src/components/*"]
  +     },
  +     "include": ["src/**/*.ts", "src/**/*.vue"],
  +     "exclude": ["node_modules"]
  +   }
  ```
- `module`: 指定生成哪个模块系统代码。
- `target`: 指定 ECMAScript 目标版本。
- `strict`: 启用所有严格类型检查选项。开启严格模式，默认启用一下选项：
- `noImplicitAny`: 在表达式和声明上有隐含的 any 类型时报错。[参考地址](https://www.typescriptlang.org/zh/tsconfig#noImplicitAny)
- `noImplicitThis`: 当 this 表达式的值为 any 类型的时候，生成一个错误。[参考地址](https://www.typescriptlang.org/zh/tsconfig#noImplicitThis)
- `alwaysStrict`: 为每个源文件生成 `use strict`语句。[参考地址](https://www.typescriptlang.org/zh/tsconfig#alwaysStrict)
- `strictNullChecks`: null 和 undefined 拥有单独类型。[参考地址](https://www.typescriptlang.org/zh/tsconfig#strictNullChecks)
- `strictFunctionTypes`: 检测函数的子类子类型。[参考地址](https://www.typescriptlang.org/zh/tsconfig#strictFunctionTypes)，[参考地址](https://zh.wikipedia.org/wiki/%E5%AD%90%E7%B1%BB%E5%9E%8B)
- `strictPropertyInitialization`: 设置为 true 时，当构造函数中声明但未设置类属性时报错。[参考地址](https://www.typescriptlang.org/zh/tsconfig#strictPropertyInitialization)
- `strictBindCallApply`: 检测 `call`、`bind`、`apply`调用的参数是否正确。[参考地址](https://www.typescriptlang.org/zh/tsconfig#strictBindCallApply)
- `useUnknownInCatchVariables`: 在异常捕获中的值设置成 `unknown` 类型。[参考地址](https://www.typescriptlang.org/zh/tsconfig#useUnknownInCatchVariables)
- `esModuleInterop`: 开启 esModuleInterop 选项将会修复 TypeScript 转译中的这两个问题。
- `allowSyntheticDefaultImports`: 允许从没有设置默认导出的模块中默认导入。这并不影响代码的输出，仅为了类型检查。
- `forceConsistentCasingInFileNames`: 禁止对同一个文件的不一致的引用。
- `skipLibCheck`:忽略所有的声明文件（ \*.d.ts）的类型检查。
- `experimentalDecorators`: 启用实验性的 ES 装饰器。
- `moduleResolution`: 指定模块解析策略。

### 添加 babel 配置文件

- `babel.config.json`

  ```json
  +   {
  +     "presets": [
  +       [
  +         "@babel/preset-env",
  +         {
  +           "useBuiltIns": "usage",
  +           "corejs": "3.22"
  +         }
  +       ],
  +       [
  +         "@babel/preset-typescript",
  +         {
  +           "allExtensions": true,
  +           "isTSX": true
  +         }
  +       ]
  +     ],
  +     "plugins": ["@vue/babel-plugin-jsx"]
  +   }
  ```

### 添加 browserslist 配置文件

- `.browserslistrc`
  ```
  +  > 1%
  +  last 2 version
  +  not dead
  ```

### 修改 webpack 配置

- `webpack.common.ts`

  ```ts
  +    module: {
  +      rules: [
  +        {
  +          test: /\.ts$/i,
  +          exclude: /node_modules/,
  +          use: [
  +            'babel-loader',
  +             loader: 'babel-loader',
  +             options: {
  +               appendTsSuffixTo: [/\.vue$/],
  +             },
  +          ]
  +        },
  +      ],
  +    },
  ```

- `webpack.dev.ts`

  ```ts
  +    module: {
  +      rules: [
  +        {
  +          test: /\.tsx$/i,
  +          exclude: /node_modules/,
  +          loader: 'babel-loader',
  +        },
  +      ],
  +    },
  ```

- `webpack.prod.ts`

  ```ts
  +   module: {
  +     rules: [
  +       {
  +         test: /\.tsx$/i,
  +         exclude: /node_modules/,
  +         use: [
  +           {
  +             loader: 'babel-loader',
  +             options: {
  +               plugins: [
  +                 ['transform-remove-console', { exclude: ['error', 'warn'] }],
  +                 'transform-remove-debugger',
  +               ],
  +             },
  +           },
  +           {
  +             loader: 'ts-loader',
  +             options: {
  +               appendTsxSuffixTo: [/\.vue$/],
  +             },
  +           },
  +         ],
  +       },
  +       {
  +         test: /\.ts$/i,
  +         exclude: /node_modules/,
  +         use: [
  +           {
  +             loader: 'babel-loader',
  +             options: {
  +               plugins: [
  +                 ['transform-remove-console', { exclude: ['error', 'warn'] }],
  +                 'transform-remove-debugger',
  +               ],
  +             },
  +           },
  +           'ts-loader'
  +         ],
  +       },
  +     ],
  +   },
  ```

## 处理 css sass

### 安装依赖

```bash
npm install -D postcss postcss-loader postcss-preset-nev css-loader sass sass-loader css-minimizer-webpack-plugin mini-css-extract-plugin
```

- `postcss postcss-loader postcss-preset-env`: 处理 css 兼容。
- `css-loader`: 处理 @import 和 url() 。
- `sass, sass-loader`: 解析 cass。
- `css-minimizer-webpack-plugin`: 优化和压缩 css。
- `mini-css-extract-plugin`: 将 css 提取到单独的文件中。

### 修改配置文件

- `config/webpack.common.ts`
  ```ts
    module: {
      rules: [
  +      {
  +        test: /\.(c|sa|sc)ss$/i,
  +        use: [
  +          MiniCssExtractPlugin.loader,
  +          {
  +            loader: 'css-loader',
  +            options: {
  +              importLoaders: 2,
  +            },
  +          },
  +          'postcss-loader',
  +          'sass-loader',
  +        ],
  +      },
      ],
    },
  +  optimization: {
  +    minimizer: ['...', new CssMinimizerPlugin()],
  +  },
    plugins: [
  +    new MiniCssExtractPlugin({
  +      filename: 'css/[name].[hash:8].css',
  +    }),
    ],
  ```

## 处理资源文件

### 处理媒体文件

- `config/webpack.common.ts`
  ```ts
  module: {
    rules: [
  +    {
  +      test: /\.(mp4|webm|ogg|mp3|wav|flac|aac)$/i,
  +      type: 'asset',
  +      generator: {
  +        filename: 'media/[name].[hash:8][ext]',
  +      },
  +    },
    ];
  }
  ```

### 处理图片文件

- `config/webpack.common.ts`
  ```ts
  module: {
    rules:[
  +    {
  +      test: /\.(png|jpe?g|gif|webp|svg)$/i,
  +      type: 'asset',
  +      generator: {
  +        filename: 'images/[name].[hash:8][ext]',
  +      },
  +      parser: {
  +        dataUrlCondition: {
  +          maxSize: 10 * 1024,
  +        },
  +      },
  +    },
    ]
  }
  ```

### 处理字体文件

- `config/webpack.common.ts`
  ```ts
  module: {
    rules: [
  +    {
  +      test: /\.(woff2?|eot|ttf|otf)$/i,
  +      type: 'asset',
  +      generator: {
  +        filename: 'fonts/[name].[hash:8][ext]',
  +      },
  +    },
    ];
  }
  ```

## 处理公共文件

项目打包后应该把一些公共的不需要处理的文件复制到打包后的目录下。

### 安装依赖

```bash
npm install -D copy-webpack-plugin
```

- `copy-webpack-plugin`: 将文件或者目录复制到生成目录。

### 修改配置文件

- `config/webpack.prod.ts`
  ```ts
    plugins: [
  +    new CopyWebpackPlugin({
  +      patterns: [
  +        {
  +          from: 'public',
  +          globOptions: {
  +            ignore: ['**/index.html', '**/.DS_Store'],
  +          },
  +        },
  +      ],
  +    }),
    ],
  ```

## eslist 校验

> 在开发中，往往需要保证代码代码的准确性和统一性，所以需要添加 eslint 对代码进行风格校验。
>
> 因为 eslint 没法解析 vue 所以还要添加一个 vue 的插件来处理 vue 文件。

### 安装依赖

```bash
npm install -D eslint eslint-webpack-plugin @typescript-eslint/parser @typescript-eslint/eslint-plugin  eslint-config-airbnb-base eslint-plugin-vue @babel/eslint-parser
```

- `eslint`:eslint 主程序。
- `eslint-webpack-plugin`: webpack 的 eslint 插件。
- `@typescript-eslint/parser @typescript-eslint/eslint-plugin `: eslint 的 ts 解析器。
- `eslint-config-airbnb-base`: airbnb 代码建议。
- `eslint-plugin-vue`: 解析 vue 文件。
- `@babel/eslint-parser`: 解析 tsx。

### 修改配置文件

- `.eslintrc.json`

  ```json
  +   {
  +     "env": {
  +       "browser": true,
  +       "es2021": true
  +     },
  +     "extends": ["plugin:vue/essential", "airbnb-base"],
  +     "parserOptions": {
  +       "ecmaVersion": "latest",
  +       "parser": {
  +         "ts": "@typescript-eslint/parser",
  +         "tsx": "@babel/eslint-parser"
  +       },
  +       "sourceType": "module",
  +       "ecmaFeatures": {
  +         "tsx": true,
  +         "jsx": true
  +       }
  +     },
  +     "plugins": ["vue", "@typescript-eslint"],
  +     "rules": {}
  +   }
  ```

- `.eslintignore`

  ```
  +   node_modules
  +   dist
  +   !.*
  +   *.d.ts
  ```

- `config/webpack.common.ts`
  ```ts
  plugins: [
  +   new EslintWebpackPlugin({
  +     extensions: ['ts', 'tsx', 'js', 'vue'],
  +     quiet: true,
  +   }),
  ],
  ```

## prettier 格式化

> 多人开发项目时为了保证代码格式化风格一致，需要安装 `prettier` 插件。

### 安装依赖

```bash
npm install -D prettier eslint-plugin-prettier eslint-config-prettier
```

### 修改配置文件

- `.prettirerc`

  ```JSON
  +   {
  +     "singleQuote": true,
  +     "trailingComma": "all",
  +     "printWidth": 80,
  +     "tabWidth": 2,
  +     "proseWrap": "never",
  +     "arrowParens": "avoid",
  +     "overrides": [
  +       {
  +         "files": ".prettierrc",
  +         "options": {
  +           "parser": "json"
  +         }
  +       }
  +     ]
  +   }
  ```

- `.eslintrc.json`

  ```json
      {
  -     "extends": ["plugin:vue/essential", "airbnb-base"],
  +     "extends": ["plugin:vue/essential", "airbnb-base", "prettier"],
  -     "plugins": ["vue", "@typescript-eslint"],
  +     "plugins": ["vue", "@typescript-eslint", "prettier"],
      }
  ```

## 跨平台代码风格统一

> 同一个项目多个开发人员，不同平台，不同编辑器和 IDE 保持一致的编码风格。需要 vscode 安装 `EditorConfig for VS Code` 插件。

### 添加配置文件

- `.editorconfig`
  ```
  +   [*.{ts,tsx,vue,js,jsx}]
  +   indent_style = space
  +   indent_size = 2
  +   end_of_line = lf
  +   trim_trailing_whitespace = true
  +   insert_final_newline = true
  +   max_line_length = 80
  +   charset = utf-8
  ```

## router

> 路由使用 vue-router。路由规则根据根据项目中的模块自动生成。

### 安装依赖

```bash
npm install vue-router@next
```

### 配置路由

- `src/main.ts`

  ```ts
     import App from '@/App.vue';
  +  import router from './routers';
     const app = createApp(App);
  +  app.use(router);
  ```

- `src/routers/index.ts`

  ```ts
  +   import {
  +     createRouter,
  +     createWebHashHistory,
  +     RouteRecordRaw,
  +   } from 'vue-router';
  +   const routes: Array<RouteRecordRaw> = [
  +     {
  +       path: '/',
  +       name: 'Main',
  +       component: () =>
  +         import(/* webpackChunkName: "CVMain" */ '@/modules/main/index.vue'),
  +       children: [
  +         {
  +           path: '/home',
  +           name: 'Home',
  +           component: () =>
  +             import(/* webpackChunkName: "CVHome" */ '@/modules/home/index.vue'),
  +         },
  +       ],
  +     },
  +     {
  +       path: '/login',
  +       name: 'Login',
  +       component: () =>
  +         import(/* webpackChunkName: "CVLogin" */ '@/modules/login/index.vue'),
  +     },
  +   ];
  +   const router = createRouter({
  +     history: createWebHashHistory(),
  +     routes,
  +   });
  +   export default router;
  ```
