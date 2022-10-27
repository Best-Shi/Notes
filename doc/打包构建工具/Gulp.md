# Gulp 打包构建工具

> Gulp 特点:
>
> -   任务化
> -   基于流
> -   异步执行
>



## Gulp 快速上手

### 1、初始化项目

```shell
# 安装 Gulp-cli
npm install -g gulp-cli
# 初始化项目
npm init -y
# 安装依赖
npm install -D gulp
```

### 2、创建 gulpfile.js 配置文件

```js
// 在项目根目录下创建 gulpfile.js 配置文件

// 注册任务
function clean() {}

// 注册默认任务
exports.default = series(clean);
```



### 3、构建 js 文件

-   1、安装依赖

```shell
npm install -D gulp-concat gulp-uglify gulp-rename gulp-babel @babel/core @babel/preset-env
```

-   2、配置 gulpfile.js 文件

```js
const { src, dest, series } = require("gulp");
const concat = require("gulp-concat");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const babel = require("gulp-babel");

function js() {
    return src("src/js/*.js")
        .pipe(concat("build.js"))
        .pipe(
            babel({
                presets: ["@babel/env"], // 转为ES5
            })
        )
        .pipe(uglify())
        .pipe(rename({ suffix: ".min" }))
        .pipe(dest("dist/js"));
}

exports.default = series(js);
```

-   3、运行命令

```shell
gulp
```

### 4、构建 less 文件

-   1、安装依赖

```shell
npm install -D gulp-less
```

-   2、配置 gulpfile.js 文件

```js
const { src, dest, series } = require("gulp");
const less = require("gulp-less");

function handleLess() {
    return src("src/less/*.less")
        .pipe(less())
        .pipe(dest("src/css"));
}

exports.handleLess = handleLess;
```

-   3、运行命令

```shell
gulp handleLess
```

### 5、构建 css 文件

-   1、安装依赖

```shell
npm install -D gulp-clean-css
```

-   2、配置 gulpfile.js 文件

```js
const { src, dest, series } = require("gulp");
const cleanCss = require("gulp-clean-css");

function handleCss() {
    return src("src/css/*.css")
        .pipe(concat("build.css"))
        .pipe(cleanCss({ compatibility: "ie8" }))
        .pipe(rename({ suffix: ".min" }))
        .pipe(dest("dist/css"));
}

exports.handleCss = handleCss;
```

-   3、运行命令

```shell
gulp handleCss
```

### 6、压缩 html 文件

-   1、安装依赖

```shell
npm install -D gulp-htmlmin
```

-   2、配置 gulpfile.js 文件

```js
const { src, dest, series } = require("gulp");
const htmlmin = require("gulp-htmlmin");

function handleHtml() {
    return src("src/*.html")
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest("dist"));
}

exports.handleHtml = handleHtml;
```

-   3、运行命令

```shell
gulp handleHtml
```

### 7、实时监听

-   1、配置 gulpfile.js 文件

```js
watch("src/js/*.js", handleJs);
watch("src/less/*.less", handleLess);
watch("src/css/*.css", handleCss);
watch("src/*.html", handleHtml);
```

-   2、运行命令

```shell
gulp
```

### 8、完整配置文件

```js
const { src, dest, series, parallel, watch } = require("gulp");
const concat = require("gulp-concat");
const rename = require("gulp-rename");
const uglify = require("gulp-uglify");
const babel = require("gulp-babel");
const less = require("gulp-less");
const cleanCss = require("gulp-clean-css");
const htmlmin = require("gulp-htmlmin");

function handleJs() {
    return src("src/js/*.js")
        .pipe(concat("build.js"))
        .pipe(
            babel({
                presets: ["@babel/env"],
            })
        )
        .pipe(uglify())
        .pipe(rename({ suffix: ".min" }))
        .pipe(dest("dist/js"));
}

function handleLess() {
    return src("src/less/*.less")
        .pipe(less())
        .pipe(dest("src/css"));
}

function handleCss() {
    return src("src/css/*.css")
        .pipe(concat("build.css"))
        .pipe(cleanCss({ compatibility: "ie8" }))
        .pipe(rename({ suffix: ".min" }))
        .pipe(dest("dist/css"));
}

function handleHtml() {
    return src("src/*.html")
        .pipe(htmlmin({ collapseWhitespace: true }))
        .pipe(dest("dist"));
}

watch("src/js/*.js", handleJs);
watch("src/less/*.less", handleLess);
watch("src/css/*.css", handleCss);
watch("src/*.html", handleHtml);

exports.default = parallel(handleJs, handleHtml, series(handleLess, handleCss));
```
