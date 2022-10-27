# rollup

**环境说明：**

```bash
nodejs: 17.6.0
npm: 8.5.1
rollup: 2.70.0
```

## rollup 快速上手

1. 安装 rollup

```bash
npm init -y
npm install -D rollup
```

2. 创建文件

   **main.js**

   ```javascript
   console.log('hello rollup');
   ```

3. 执行 rollup 命令

   - 编译成浏览器代码

   ```bash
    npx rollup main.js  --file bundle.js --format iife
   ```

   ```js
   (function () {
     'use strict';
     console.log('hello rollup');
   })();
   ```

   - 编译成 nodejs 代码

   ```bash
    npx rollup main.js  --file bundle.js --format cjs
   ```

   ```js
   'use strict';
   console.log('hello rollup');
   ```

   - 编译成 nodejs、浏览器代码

   ```bash
    npx rollup main.js  --file bundle.js --format umd
   ```

   ```js
   (function (factory) {
     typeof define === 'function' && define.amd ? define(factory) : factory();
   })(function () {
     'use strict';
     console.log('hello rollup');
   });
   ```

## rollup 配置文件

> 默认配置文件：rollup.config.js，可以通过 -c 或 --config 参数指定配置文件。
>
> rollup 配置文件默认是 ES 模块，如果想使用 CommonJS 模块，则需要把扩展名改成 `.cjs`。

```bash
npx rollup --config rollup.config.js
```

- 单入口文件配置

  ```js
  export default {
    input: 'src/main.js',
    output: {
      file: 'bundle.js',
      format: 'umd',
    },
  };
  ```

- 多入口文件配置

  ```js
  export default [
    {
      input: 'src/main1.js',
      output: {
        file: 'bundle1.js',
        format: 'umd',
      },
    },
    {
      input: 'src/main2.js',
      output: {
        file: 'bundle2.js',
        format: 'umd',
      },
    },
  ];
  ```

- 一个文件打包成多个

  ```js
  export default {
    input: 'src/main.js',
    output: [
      {
        file: 'bundle-es.js',
        format: 'es',
      },
      {
        file: 'bundle-cjs.js',
        format: 'cjs',
      },
    ],
  };
  ```

- 导出一个 Promise
  ```js
  export default Promise.all([fetch('get-config-1'), fetch('get-config-2')]);
  ```
- 导出一个函数

  导出一个函数时，函数参数是命令行参数。

  默认情况下命令行参数会覆盖配置文件中设置的参数；可以删除对应参数保证配置文件不被覆盖

  ```js
  export default commandLineArgs => {
    delete commandLineArgs.input;
    if (commandLineArgs.configDebug === true) {
      return debugConfig;
    }
    return defaultConfig;
  };
  ```

- 从 Node_Modules 包中加载配置文件
  ```bash
  rollup --config node:my-special-config
  ```

## 配置文件智能提示

- JSDoc 类型提示

  ```js
  // rollup.config.js
  /**
   * @type {import('rollup').RollupOptions}
   */
  const config = {
    // ...
  };

  export default config;
  ```

- 使用 defineConfig 帮助程序

  不支持 Promise；必须传入一个对象。

  ```js
  // rollup.config.js
  import { defineConfig } from 'rollup';
  export default defineConfig({
    // ...
  });
  ```

## 命令行参数

| 参数 | 说明 | 原文 |
| --- | --- | --- |
| -c, --config <filename> | 使用此配置文件（如果使用参数但未指定值，则默认为 rollup.config.js） | Use this config file (if argument is used but value is unspecified, defaults to rollup.config.js) |
| -d, --dir <dirname> | 输出目录 | Directory for chunks (if absent, prints to stdout) |
| -e, --external <ids> | 需要排除的模块，用逗号分割 | Comma-separate list of module IDs to exclude |
| -f, --format <format> | 输出类型 (amd, cjs, es, iife, umd, system) | Type of output (amd, cjs, es, iife, umd, system) |
| -g, --globals <pairs> | 逗号分隔 `moduleID:Global` | Comma-separate list of `moduleID:Global` pairs |
| -h, --help | 显示帮助 | Show this help message |
| -i, --input <filename> | 入口文件 | Input (alternative to <entry file>) |
| -m, --sourcemap | 生成 sourcemap (`-m inline` 生成 inline map) | Generate sourcemap (`-m inline` for inline map) |
| -n, --name <name> | UMD 导出的名称 | Name for UMD export |
| -o, --file <output> | 单个输出文件 | Single output file (if absent, prints to stdout) |
| -p, --plugin <plugin> | 使用插件 | Use the plugin specified (may be repeated) |
| -v, --version | 显示版本 | Show version number |
| -w, --watch | 监听文件变动，并重新打包 | Watch files in bundle and rebuild on changes |
| --amd.id <id> | AMD 模块的 ID（默认为匿名） | ID for AMD module (default is anonymous) |
| --amd.autoId | 根据区块名称生成 AMD ID | Generate the AMD ID based off the chunk name |
| --amd.basePath <prefix> | 自动生成 AMD ID 的前置路径 | Path to prepend to auto generated AMD ID |
| --amd.define <name> | 用于替换“define”的函数 | `Function to use in place of `define` |
| --assetFileNames <pattern> | 已发出资产的名称模式 | Name pattern for emitted assets |
| --banner <text> | 要在捆绑包顶部插入的代码（外部包装） | Code to insert at top of bundle (outside wrapper) |
| --chunkFileNames <pattern> | 发出的次块的名称模式 | Name pattern for emitted secondary chunks |
| --compact | 缩小包装器代码 | Minify wrapper code |
| --context <variable> | 指定顶级“this”值 S | pecify top-level `this` value |
| --entryFileNames <pattern> | 发出的条目块的名称模式 | Name pattern for emitted entry chunks |
| --environment <values> | 传递到配置文件的设置（参见示例） | Settings passed to config file (see example) |
| --no-esModule | 不要添加\_esModule 属性 | Do not add \_\_esModule property |
| --exports <mode> | 指定导出模式（自动、默认、命名、无） | Specify export mode (auto, default, named, none) |
| --extend | 扩展由--name 定义的全局变量 | Extend global variable defined by --name |
| --no-externalLiveBindings | 不要生成支持实时绑定的代码 | Do not generate code to support live bindings |
| --failAfterWarnings | 如果生成生成了警告，则退出并显示错误 | Exit with an error if the build produced warnings |
| --footer <text> | 要在捆绑包末尾插入的代码（外部包装） | Code to insert at end of bundle (outside wrapper) |
| --no-freeze | 不要冻结命名空间对象 | Do not freeze namespace objects |
| --no-hoistTransitiveImports | 不要将可传递的导入提升到条目块中 | Do not hoist transitive imports into entry chunks |
| --no-indent | 不要缩进结果 | Don't indent result |
| --no-interop | 不包括互操作块 | Do not include interop block |
| --inlineDynamicImports | 使用动态导入时创建单个捆绑包 | Create single bundle when using dynamic imports |
| --intro <text> | 要在捆绑包顶部插入的代码（包装内） | Code to insert at top of bundle (inside wrapper) |
| --minifyInternalExports | 强制或禁用内部导出的缩小 | Force or disable minification of internal exports |
| --namespaceToStringTag | 创建合适的`。toString`名称空间的方法 | Create proper `.toString` methods for namespaces |
| --noConflict | 为 UMD 全局生成无冲突方法 | Generate a noConflict method for UMD globals |
| --outro <text> | 要在捆绑包末尾插入的代码（包装内） | Code to insert at end of bundle (inside wrapper) |
| --preferConst | 导出时使用'const'而不是'var' | Use `const` instead of `var` for exports |
| --no-preserveEntrySignatures | 避免门面块作为入口点 | Avoid facade chunks for entry points |
| --preserveModules | 保留模块结构 | Preserve module structure |
| --preserveModulesRoot | 将保留的模块放在根级别的此路径下 | Put preserved modules under this path at root level |
| --preserveSymlinks | 解析文件时不要遵循符号链接 | Do not follow symlinks when resolving files |
| --no-sanitizeFileName | 不要替换文件名中的无效字符 | Do not replace invalid characters in file names |
| --shimMissingExports | 为丢失的导出创建垫片变量 | Create shim variables for missing exports |
| --silent | 不要打印警告 | Don't print warnings |
| --sourcemapExcludeSources | 不要在源代码映射中包含源代码 | Do not include source code in source maps |
| --sourcemapFile <file> | 指定源映射的绑定位置 | Specify bundle position for source maps |
| --stdin=ext | 指定用于标准输入的文件扩展名 | Specify file extension used for stdin input |
| --no-stdin | 不要从标准文本中读取“-” | Do not read "-" from stdin |
| --no-strict | 不要发出“严格使用”在生成的模块中 | Don't emit `"use strict";` in the generated modules |
| --strictDeprecations | 为不推荐的功能抛出错误 | Throw errors for deprecated features |
| --systemNullSetters | 将空的 SystemJS setters 替换为“null” | `Replace empty SystemJS setters with `null` |
| --no-treeshake | 禁用树震动优化 | Disable tree-shaking optimisations |
| --no-treeshake.annotations | 忽略纯调用注释 | Ignore pure call annotations |
| --no-treeshake.moduleSideEffects | 假设模块没有副作用 | Assume modules have no side-effects |
| --no-treeshake.propertyReadSideEffects | 忽略财产访问的副作用 | Ignore property access side-effects |
| --no-treeshake.tryCatchDeoptimization | 不要关掉电源，试着抓住摇动的树 | Do not turn off try-catch-tree-shaking |
| --no-treeshake.unknownGlobalSideEffects | 假设未知全局变量不抛出 | Assume unknown globals do not throw |
| --waitForBundleInput | 等待 bundle 输入文件 | Wait for bundle input files |
| --watch.buildDelay <number> | 油门表重建 | Throttle watch rebuilds |
| --no-watch.clearScreen | 重建时不要清除屏幕 | Do not clear the screen when rebuilding |
| --watch.skipWrite | 观看时不要将文件写入磁盘 | Do not write files to disk when watching |
| --watch.exclude <files> | 将文件排除在监视范围之外 | Exclude files from being watched |
| --watch.include <files> | 限制对指定文件的监视 | Limit watching to specified files |
| --validate | 验证输出 | Validate output |

## rollup 基本使用

1. 初始化项目
   ```bash
   npm init -y
   ```
2. 安装依赖

   ```bash
    npm install -D rollup
   ```

3. 创建文件

   ```js
   // src/main.js
   import foo from './foo.js';
   export default function () {
     console.log(foo);
   }
   ```

   ```js
   // src/foo.js
   export default 'hello world!';
   ```

4. 创建配置文件

   ```js
   // rollup.config.js
   export default {
     input: 'src/main.js',
     output: {
       file: 'bundle.js',
       format: 'cjs',
     },
   };
   ```

   根据项目创建不同配置文件

   ```bash
   rollup --config rollup.config.dev.js
   rollup --config rollup.config.prod.js
   ```

5. 添加 rollup 命令

   ```json
   "scripts": {
    "build": "rollup --config rollup.config.js"
   },
   ```

6. 使用插件

   ```bash
   npm isntall -D @rollup/plugin-json
   ```

   ```js
   // src/main.js
   import { version } from '../package-lock.json';
   export default function () {
     console.log(version);
   }
   ```

   ```js
   // rollup.config.js
   import json from '@rollup/plugin-json';
   export default {
     input: 'src/main.js',
     output: {
       file: 'bundle.js',
       format: 'cjs',
     },
     plugins: [json()],
   };
   ```

7. 使用输出插件

   roolup 可以为每个输出配置不同的插件。

   ```bash
   npm install -D rollup-plugin-terser
   ```

   ```js
   // src/main.js
   import { version } from '../package-lock.json';
   export default function () {
     console.log(version);
   }
   ```

   ```js
   // rollup.config.js
   import json from '@rollup/plugin-json';
   export default {
     input: 'src/main.js',
     output: [
       {
         file: 'bundle.js',
         format: 'cjs',
       },
       {
         file: 'bundle.min.js',
         format: 'cjs',
         plugins: [terser()],
       },
     ],
     plugins: [json()],
   };
   ```

8. 代码分割

   rollup 默认会拆分异步加载的代码，或者根据入口拆分，也可以使用 `output.manualChunks` 指定要拆分的模块。

   可以通过`output.chunkFinlNames`和`output.entryFileName`定义输出名称。

   ```js
   // src/main.js
   export default function () {
     import('./foo.js').then(({ default: foo }) => console.log(foo));
   }
   ```
