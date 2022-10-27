# TypeScript 基本项目搭建

基于`webpack`搭建简单得`TypeScript`开发环境。



## 1、webpack 配置

### 1.1、步骤

1. 初始化项目

    - 进入项目根目录，执行命令`npm init -y`。

2. 下载构建工具

    ```shell
    npm i -D webpack webpack-cli webpack-dev-server typescript ts-loader html-webpack-plugin clean-webpack-plugin
    ```

    - `webpack`打包构建工具
    - `webpack-cli`webpack 命令行工具
    - `webpack-dev-server`webpack 开发服务器
    - `typescript`ts 编译器
    - `ts-loader`ts 加载器，用于在 webpack 中编译 ts 文件
    - `html-webpack-plugin`webpack 中 html 插件，用来自动创建 html 文件
    - `clean-wepback-plugin`webpack 中的清除插件，每次构建都会先清除目录

3. 根目录下创建 webpack 配置文件`webpack.config.js`

    ```js
    const path = require("path");
    const HTMLWebpackPlugin = require("html-webpack-plugin");
    const { CleanWebpackPlugin } = require("clean-webpack-plugin");

    module.exports = {
        // 指定入口文件
        entry: "./src/index.ts",

        // 指定打包文件所在目录
        output: {
            // 指定打包文件所在目录
            path: path.resolve(__dirname, "./dist"),
            // 指定打包后文件的文件
            filename: "index.js",

            // 配置输出环境
            environment: {
                // 不使用箭头函数
                arrowFunction: false,
            },
        },

        // 指定webpack打包时要使用的模块
        module: {
            // 指定规则
            rules: [
                {
                    // test指定规则生效的文件
                    test: /\.ts$/,

                    // 需要使用的loader,从后往前执行
                    use: [
                        // 配置babel
                        {
                            loader: "babel-loader",
                            options: {
                                presets: [
                                    [
                                        // 指定环境插件
                                        "@babel/preset-env",
                                        // 配置信息
                                        {
                                            // 要兼容的目标浏览器
                                            targets: {
                                                chrome: "74",
                                                ie: "10",
                                            },
                                            // 指定corejs的版本
                                            corejs: "3",
                                            // 使用corejs的方式 "usage"表示按需加载
                                            useBuiltIns: "usage",
                                        },
                                    ],
                                ],
                            },
                        },
                        "ts-loader",
                    ],

                    // 要排除的文件
                    exclude: /node_modules/,
                },

                // 设置less文件处理
                {
                    test: /\.less$/,
                    use: [
                        "style-loader",
                        "css-loader",
                        // 引入postcss
                        {
                            loader: "postcss-loader",
                            options: {
                                postcssOptions: {
                                    plugins: [
                                        [
                                            "postcss-preset-env",
                                            {
                                                // 兼容最先两个版本浏览器
                                                browsers: "last 2 versions",
                                            },
                                        ],
                                    ],
                                },
                            },
                        },
                        "less-loader",
                    ],
                },
            ],
        },

        // 配置webpack插件
        plugins: [
            new HTMLWebpackPlugin({
                // title: "TypeScript项目配置",
                template: "./src/index.html",
            }),
            // 编译前先删除之前编译文件
            new CleanWebpackPlugin(),
        ],

        // 设置引用模块
        resolve: {
            extensions: [".ts", ".js"],
        },
    };
    ```

4. 在根目录下创建 ts 配置文件`tsconfig.josn`

    ```josn
    {
        "compilerOptions": {
            "target": "ES6",
            "module": "ES6",
            "strict": true,
            "removeComments": true,
            "noEmitOnError": true
        }
    }
    ```

5. 修改`package.json`配置文件

    ```json
    ...略...
    "scripts": {
        "test": "echo \"Error: no test specified\" && exit 1",
        "build": "webpack",
        "start": "webpack serve  --open Chrome.exe"
    },
    ...略...
    ```

## 2、Babel 处理 js 兼容

> 需要结合 babel 来对代码进行转换以使其可以兼容到更多的浏览器。

1. 安装依赖

    ```shell
    npm i -D @babel/core @babel/preset-env babel-loader core-js
    ```

    - `@babel/core`babel 的核心工具
    - `@babel/preset-env`babel 的预定义环境
    - `babel-loader`babel 在 webpack 中的加载器
    - `core-js`用来使老版本浏览器支持新版 ES 语法

2. 修改`webpack.config.js`配置文件

    ```js
    ...略...
    // 指定webpack打包时要使用的模块
    module: {
        // 指定规则
        rules: [
            {
                // test指定规则生效的文件
                test: /\.ts$/,
    
                // 需要使用的loader,从后往前执行
                use: [
                    // 配置babel
                    {
                        loader: "babel-loader",
                        options: {
                            presets: [
                                [
                                    // 指定环境插件
                                    "@babel/preset-env",
                                    // 配置信息
                                    {
                                        // 要兼容的目标浏览器
                                        targets: {
                                            chrome: "74",
                                            ie: "10",
                                        },
                                        // 指定corejs的版本
                                        corejs: "3",
                                        // 使用corejs的方式 "usage"表示按需加载
                                        useBuiltIns: "usage",
                                    },
                                ],
                            ],
                        },
                    },
                    "ts-loader",
                ],
            },
        ],
    },
    ...略...
    ```

## 3、CSS 样式处理

这里的 css 样式使用 less 预处理器。

1. 安装依赖

    ```shell
    npm i -D less less-loader css-loader style-loader
    ```

    - `less`less 编译器
    - `less-loader`less 加载器
    - `css-loader`css 加载器
    - `style-loader`样式加载器（把样式插入 DOM 中）

2. 修改`webpack.config.js`配置文件

    ```js
    ...略...
    // 指定webpack打包时要使用的模块
    module: {
        // 指定规则
        rules: [
            // 设置less文件处理
            {
                test: /\.less$/,
                use: [
                    "style-loader",
                    "css-loader",
                    "less-loader",
                ],
            },
        ],
    },
    ...略...
    ```

3. css 浏览器兼容配置

    3.1、 安装依赖

    ```shell
    npm i -D postcss postcss-loader postcss-preset-env
    ```

    3.2、 修改`webpack.config.js`配置文件

    ```js
    ...略...
    // 指定webpack打包时要使用的模块
    module: {
        // 指定规则
        rules: [
            // 设置less文件处理
            {
                test: /\.less$/,
                use: [
                    "style-loader",
                    "css-loader",
                    // 引入postcss
                    {
                        loader: "postcss-loader",
                        options: {
                            postcssOptions: {
                                plugins: [
                                    [
                                        "postcss-preset-env",
                                        {
                                            // 兼容最先两个版本浏览器
                                            browsers: "last 2 versions",
                                        },
                                    ],
                                ],
                            },
                        },
                    },
                    "less-loader",
                ],
            },
        ],
    },
    ...略...
    ```

## 4、TypeScript 配置文件说明

```json

// {
//     "compilerOptions": {
/* 访问https://aka.ms/tsconfig.json以了解有关此文件的更多信息 */
/* 基本选项 */
// "incremental": true,                         /* 启用增量编译 */
// "target": "es5",                             /* 指定ECMAScript目标版本：“ ES3”（默认），“ ES5”，“ ES2015”，“ ES2016”，“ ES2017”，“ ES2018”，“ ES2019”，“ ES2020”或“ ESNEXT”。 */
// "module": "commonjs",                        /* 指定模块代码生成：“ none”，“ commonjs”，“ amd”，“ system”，“ umd”，“ es2015”，“ es2020”或“ ESNext”。 */
// "lib": [],                                   /* 指定要包含在编译中的库文件。 */
// "allowJs": true,                             /* 允许编译javascript文件。 */
// "checkJs": true,                             /* 报告.js文件中的错误。 */
// "jsx": "preserve",                           /* 指定JSX代码生成：'preserve'，'react-native'或'react'。 */
// "declaration": true,                         /* 生成相应的'.d.ts'文件。 */
// "declarationMap": true,                      /* 为每个相应的'.d.ts'文件生成一个源映射。 */
// "sourceMap": true,                           /* 生成相应的'.map'文件。 */
// "outFile": "./",                             /* 连接并输出到单个文件。 */
// "outDir": "./",                              /* 将输出结构重定向到目录。 */
// "rootDir": "./",                             /* 指定输入文件的根目录。用于通过--outDir控制输出目录结构。 */
// "composite": true,                           /* 启用项目编译*/
// "tsBuildInfoFile": "./",                     /* 指定用于存储增量编译信息的文件*/
// "removeComments": true,                      /* 不发出注释以输出。 *
// "noEmit": true,                              /* 不发出输出。 */
// "importHelpers": true,                       /* Import从'tslib'发出辅助函数。 */
// "downlevelIteration": true,                  /* 在以'ES5'或'ES3'为目标时，以'for-of'，散布和解构形式提供对可迭代对象的全面支持。 */
// "isolatedModules": true,                     /* 将每个文件作为一个单独的模块进行编译（类似于'ts.transpileModule'）。 */
/* 严格的类型检查选项 */
// "strict": true,                              /* 启用所有严格的类型检查选项。 */
// "noImplicitAny": true,                       /* 在隐含“any”类型的表达式和声明上引发错误。 */
// "strictNullChecks": true,                    /* 启用严格的null检查。 */
// "strictFunctionTypes": true,                 /* 启用对函数类型的严格检查。 */
// "strictBindCallApply": true,                 /* 在函数上启用严格的“ bind”，“ call”和“ apply”方法。 */
// "strictPropertyInitialization": true,        /* 启用对类中属性初始化的严格检查。 */
// "noImplicitThis": true,                      /* 在隐含'any'类型的'this'表达式上引发错误。 */
// "alwaysStrict": true,                        /* 以严格模式解析，并对每个源文件发出“ use strict”。 */
/* 其他检查 */
// "noUnusedLocals": true,                      /* 报告未使用的本地错误。 */
// "noUnusedParameters": true,                  /* 报告未使用参数的错误。 */
// "noImplicitReturns": true,                   /* 当并非函数中的所有代码路径都返回值时，报告错误。 */
// "noFallthroughCasesInSwitch": true,          /* 在switch语句中报告失败情况的错误。 */
// "noUncheckedIndexedAccess": true,            /* 在索引签名结果中包含“未定义” */
/* 模块分辨率选项 */
// "moduleResolution": "node",                  /* 指定模块解析策略：“节点”（Node.js）或“经典”（TypeScript 1.6之前的版本）。 */
// "baseUrl": "./",                             /* 用于解析非绝对模块名称的基本目录。 */
// "paths": {},                                 /* 一系列条目，这些条目将导入重新映射到相对于'baseUrl'的查找位置。 */
// "rootDirs": [],                              /* 根目录列表，其组合内容表示运行时项目的结构。 */
// "typeRoots": [],                             /* 包含类型定义的文件夹列表。 */
// "types": [],                                 /* 键入要包含在编译中的声明文件。 */
// "allowSyntheticDefaultImports": true,        /* 允许从模块进行默认导入，而没有默认导出。这不影响代码发出，仅影响类型检查。 */
// "esModuleInterop": true,                     /* 通过为所有导入创建名称空间对象来启用CommonJS和ES模块之间的发射互操作性。暗示“ allowSyntheticDefaultImports”。 */
// "preserveSymlinks": true,                    /* 不要解析符号链接的真实路径。 */
// "allowUmdGlobalAccess": true,                /* 允许从模块访问UMD全局变量。 */
/* 源映射选项*/
// "sourceRoot": "",                            /* 指定调试器应在其中定位TypeScript文件的位置，而不是源位置。 */
// "mapRoot": "",                               /* 指定调试器应定位地图文件的位置，而不是生成的位置。 */
// "inlineSourceMap": true,                     /* 发出带有源映射的单个文件，而不是具有单独的文件。 */
// "inlineSources": true,                       /* 在单个文件中将源代码与源映射一起发射；需要设置“ --inlineSourceMap”或“ --sourceMap”。 */
/* 实验选项 */
// "experimentalDecorators": true,              /* 为ES7装饰器启用实验性支持。 */
// "emitDecoratorMetadata": true,               /* 为发布装饰器的类型元数据启用实验性支持。 */
/* 高级选项 */
// "skipLibCheck": true,                        /* 跳过声明文件的类型检查。 */
// "forceConsistentCasingInFileNames": true     /* 禁止对同一文件使用大小写不一致的引用。 */
//     }
// }

```
