# Grunt 打包构建工具

> Grunt 是基于 Node.js 的项目构建工具。它可以自动运行你所设定的任务。
>



## Grunt 快速上手

### 1、初始化项目

```shell
# 安装 Grunt-cli
npm install -g grunt-cli
# 初始化项目
npm init -y
# 安装依赖
npm install -D grunt
```

### 2、创建 Gruntfile.js 配置文件

```js
// 在项目根目录下创建 Gruntfile.js 配置文件
module.exports = function(grunt) {
    // 任务配置
    grunt.initConfig({...});

    // 执行任务需要的插件
    grunt.loadNpmTasks("...");

    // 默认被执行的任务列表
    grunt.registerTask("default", ["..."]);
};
```



### 3、合并 js 文件

-   1、安装依赖

```shell
npm install -D grunt-contrib-concat
```

-   2、配置 Gruntfile.js 文件

```js
module.exports = function(grunt) {
    grunt.initConfig({
        concat: {
            options: {
                separator: ";",
            },
            dist: {
                src: ["src/js/**/*.js"],
                dest: "dist/js/build.js",
            },
        },
    });
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.registerTask("default", ["concat"]);
};
```

-   3、运行命令

```shell
grunt concat
# 或
grunt
```

### 4、js 语法检测

-   1、安装依赖

```shell
npm install -D grunt-contrib-jshint

```

-   2、配置 Gruntfile.js 文件

```js
module.exports = function(grunt) {
    grunt.initConfig({
        jshint: {
            options: {
                esversion: 6,
            },
            all: ["Gruntfile.js", "src/js/**/*.js"],
        },
    });
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.registerTask("default", ["jshint"]);
};
```

-   3、运行命令

```shell
grunt jshint
# 或
grunt
```

### 5、ES6 转换

-   1、安装依赖

```shell
npm install -D grunt-babel @babel/core @babel/preset-env
```

-   2、配置 Gruntfile.js 文件

```js
module.exports = function(grunt) {
    grunt.initConfig({
        babel: {
            options: {
                presets: ["@babel/preset-env"],
            },
            dist: {
                files: {
                    "dist/js/build.js": "dist/js/build.js",
                },
            },
        },
    });
    grunt.loadNpmTasks("grunt-babel");
    grunt.registerTask("default", ["babel"]);
};
```

-   3、运行命令

```shell
grunt babel
# 或
grunt
```

### 6、压缩 js

-   1、安装依赖

```shell
npm install -D grunt-contrib-uglify

```

-   2、配置 Gruntfile.js 文件

```js
module.exports = function(grunt) {
    grunt.initConfig({
        uglify: {
            options: {
                mangle: false, // 指定 false 为不改变代码中的变量名
            },
            target: {
                files: {
                    "dist/js/build.min.js": "dist/js/build.js",
                },
            },
        },
    });
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.registerTask("default", ["uglify"]);
};
```

-   3、运行命令

```shell
grunt uglify
# 或
grunt
```

### 7、处理 css

-   1、安装依赖

```shell
npm install -D grunt-contrib-cssmin

```

-   2、配置 Gruntfile.js 文件

```js
module.exports = function(grunt) {
    grunt.initConfig({
        cssmin: {
            target: {
                files: [
                    {
                        expand: true,
                        cwd: "src/css",
                        src: ["*.css", "!*.min.css"],
                        dest: "dist/css",
                        ext: ".css",
                    },
                ],
            },
        },
    });
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.registerTask("default", ["cssmin"]);
};
```

-   3、运行命令

```shell
grunt cssmin
# 或
grunt
```

### 8、处理 html

-   1、安装依赖

```shell
npm install -D grunt-contrib-htmlmin

```

-   2、配置 Gruntfile.js 文件

```js
module.exports = function(grunt) {
    grunt.initConfig({
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                },
                files: [
                    {
                        expand: true,
                        cwd: "src",
                        src: ["src/**/*.html", "*.html"],
                        dest: "dist",
                    },
                ],
            },
        },
    });
    grunt.loadNpmTasks("grunt-contrib-htmlmin");
    grunt.registerTask("default", ["htmlmin"]);
};
```

-   3、运行命令

```shell
grunt htmlmin
# 或
grunt
```

### 9、其它资源处理

-   1、安装依赖

```shell
npm install -D grunt-contrib-copy

```

-   2、配置 Gruntfile.js 文件

```js
module.exports = function(grunt) {
    grunt.initConfig({
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: "src/images",
                        src: ["**"],
                        dest: "dist/images",
                    },
                    {
                        expand: true,
                        cwd: "src/fonts",
                        src: ["**"],
                        dest: "dist/fonts",
                    },
                ],
            },
        },
    });
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.registerTask("default", ["copy"]);
};
```

-   3、运行命令

```shell
grunt copy
# 或
grunt
```

### 10、自动监视

-   1、安装依赖

```shell
npm install -D grunt-contrib-watch

```

-   2、配置 Gruntfile.js 文件

```js
module.exports = function(grunt) {
    grunt.initConfig({
        watch: {
            scripts: {
                files: "**/*.js",
                tasks: ["concat", "jshint", "babel", "uglify"],
                options: {
                    debounceDelay: 250,
                },
            },
            css: {
                files: "**/*.css",
                tasks: ["cssmin"],
                options: {
                    debounceDelay: 250,
                },
            },
            html: {
                files: "**/*.html",
                tasks: ["htmlmin"],
                options: {
                    debounceDelay: 250,
                },
            },
            copy: {
                files: "**/*.*",
                tasks: ["copy"],
                options: {
                    debounceDelay: 250,
                    event: ["added", "deleted"],
                },
            },
        },
    });
    grunt.loadNpmTasks("grunt-contrib-watch");
    grunt.registerTask("default", ["watch"]);
};
```

-   3、运行命令

```shell
grunt watch
# 或
grunt
```

### 11、完整配置文件

```js
module.exports = function(grunt) {
    grunt.initConfig({
        concat: {
            options: {
                separator: ";",
            },
            dist: {
                src: ["src/js/**/*.js"],
                dest: "dist/js/build.js",
            },
        },
        jshint: {
            options: {
                esversion: 6,
            },
            all: ["Gruntfile.js", "src/js/**/*.js"],
        },
        babel: {
            options: {
                presets: ["@babel/preset-env"],
            },
            dist: {
                files: {
                    "dist/js/build.js": "dist/js/build.js",
                },
            },
        },
        uglify: {
            options: {
                mangle: false, // 指定 false 为不改变代码中的变量名
            },
            target: {
                files: {
                    "dist/js/build.min.js": "dist/js/build.js",
                },
            },
        },
        cssmin: {
            target: {
                files: [
                    {
                        expand: true,
                        cwd: "src/css",
                        src: ["*.css", "!*.min.css"],
                        dest: "dist/css",
                        ext: ".css",
                    },
                ],
            },
        },
        htmlmin: {
            dist: {
                options: {
                    removeComments: true,
                    collapseWhitespace: true,
                },
                files: [
                    {
                        expand: true,
                        cwd: "src",
                        src: ["src/**/*.html", "*.html"],
                        dest: "dist",
                    },
                ],
            },
        },
        copy: {
            main: {
                files: [
                    {
                        expand: true,
                        cwd: "src/images",
                        src: ["**"],
                        dest: "dist/images",
                    },
                    {
                        expand: true,
                        cwd: "src/fonts",
                        src: ["**"],
                        dest: "dist/fonts",
                    },
                ],
            },
        },
        watch: {
            scripts: {
                files: "**/*.js",
                tasks: ["concat", "jshint", "babel", "uglify"],
                options: {
                    debounceDelay: 250,
                },
            },
            css: {
                files: "**/*.css",
                tasks: ["cssmin"],
                options: {
                    debounceDelay: 250,
                },
            },
            html: {
                files: "**/*.html",
                tasks: ["htmlmin"],
                options: {
                    debounceDelay: 250,
                },
            },
            copy: {
                files: "**/*.*",
                tasks: ["copy"],
                options: {
                    debounceDelay: 250,
                    event: ["added", "deleted"],
                },
            },
        },
    });
    // 加载包含 "uglify" 任务的插件。
    grunt.loadNpmTasks("grunt-contrib-concat");
    grunt.loadNpmTasks("grunt-contrib-jshint");
    grunt.loadNpmTasks("grunt-contrib-uglify");
    grunt.loadNpmTasks("grunt-babel");
    grunt.loadNpmTasks("grunt-contrib-cssmin");
    grunt.loadNpmTasks("grunt-contrib-htmlmin");
    grunt.loadNpmTasks("grunt-contrib-copy");
    grunt.loadNpmTasks("grunt-contrib-watch");

    // 默认被执行的任务列表。
    grunt.registerTask("default", [
        "concat",
        "jshint",
        "babel",
        "uglify",
        "cssmin",
        "htmlmin",
        "copy",
        "watch",
    ]);
    grunt.registerTask("dev", ["default", "watch"]);
};
```
