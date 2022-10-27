# nvm 安装与配置

[nvm-sh](https://github.com/nvm-sh/nvm)

## 安装 nvm

```bash
wget -qO- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

## 切换 node 源刷新配置文件

- zsh

```bash
# 切换 node 淘宝源
echo "export NVM_NODEJS_ORG_MIRROR=https://npm.taobao.org/mirrors/node/" >> ~/.zshrc
# 刷新配置
source ~/.zshrc
```
