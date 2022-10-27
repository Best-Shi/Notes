# Git 学习

## 配置用户名和邮箱

```bash
git config --global user.name "Best Shi"
git config --global user.email "bestshi.com@gmail.com"

# 查看配置
git config --list
```

## 初始化仓库

```bash
# Git 版本 >= 2.28.0
git init --initial-branch=main
# or
git init -b main

# 早期版本
git init
git checkout -b main
```

## Git 基本命令

- git status: 显示工作树的状态（以及暂存区域的状态）。
  - 人们常常对“Git 不将添加空目录视为更改”感到惊讶。 这是因为 Git 只跟踪对文件（而非目录）的更改。
  - 有时，特别是在开发的初始阶段，你需要将空目录作为占位符。 常见的约定是在占位符目录中创建一个空文件，通常名为“.git-keep”。
- git add: 命令用于指示 Git 开始跟踪某些文件中的更改。
- git commit: 暂存要提交的某些更改后，可以通过调用 git commit 命令将工作保存到快照。
  - `--amend`: 修改最近一次的提交。
- git log: 可查看先前提交的相关信息。
  - `--oneline`: 单行显示。
  - `-nX`: 其中 X 是提交编号：1 是最近的提交，2 是其之前的提交，以此类推。
- git help: 获取帮助。
- git diff: 查看更改的内容。加号出现在已添加行的前面，而减号指示已删除的行。
  - 默认操作是使用 git diff 将工作树与索引进行比较。 它会显示尚未暂存（添加到 Git 的索引中）的所有更改。
  - 若要将工作树与上次提交进行比较，可以使用 git diff HEAD。
  - 可以使用 git diff HEAD^ 命令来比较最新提交和先前提交之间的差异。
- git rm: 删除文件。 此命令不仅会删除磁盘上的文件，还会让 Git 在索引中记录文件删除。
- git reset: 从 Git 取消对文件删除的暂存。
- git revert: 还原先前的提交。 其工作原理是：执行取消第一个提交的另一个提交。
  - `git revert HEAD`: 执行与上次提交完全相反的提交，撤消上次提交，同时保留所有历史记录。
  - `--mixed`: 默认类型，它会重置索引，但不会重置工作树；如果指定其他提交，它也会移动 HEAD。
  - `--soft`: 选项仅移动 HEAD，且保持索引和工作树不变。 此选项会像 git status 那样，将所有更改保留为“待提交更改”。
  - `--hard`: 重置会同时更改索引和工作树以匹配指定的提交；对跟踪文件所做的所有更改都会被丢弃。
  - `--no-edit`: 告诉 Git 我们不需要为此操作添加提交消息。
- git clone: 克隆存储库。
  - 当 Git 克隆某个存储库时，它将使用名称 origin 创建对称为“远程”的原始存储库的引用。
  - 它会设置克隆存储库，使克隆存储库从远程存储库拉取或检索数据。
- git pull: 将更改从远程存储库复制到本地存储库。
  - git pull 命令非常高效，因为它只复制新的提交和对象，然后将它们签入到工作树中。
