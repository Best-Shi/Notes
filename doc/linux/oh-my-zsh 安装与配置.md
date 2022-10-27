# oh-my-zsh 安装与配置

## 安装 zsh

- Ubuntu
  ```bash
  sudo apt install zsh
  ```

## 切换 zsh

- 查看终端有那些 shell

  ```bash
  cat /etc/shells
  ```

- 切换到 zsh
  ```bash
  chsh -s /bin/zsh
  ```

## 安装 oh-my-zsh

[oh-my-zhs](https://ohmyz.sh/)

```bash
sh -c "$(curl -fsSL https://raw.github.com/ohmyzsh/ohmyzsh/master/tools/install.sh)"
```

## 控制台报错

```bash
curl: (7) Failed to connect to raw.githubusercontent.com port 443: Connection refused
```

这是由于 DNS 污染造成的，可以在本地添加 Host 解析规则：

```bash
# /etc/hosts
199.232.68.133 raw.githubusercontent.com
199.232.68.133 user-images.githubusercontent.com
199.232.68.133 avatars2.githubusercontent.com
199.232.68.133 avatars1.githubusercontent.com
```

## 安装 powerlevel10k

[powerlevel10k](https://github.com/romkatv/powerlevel10k)

```bash
git clone --depth=1 https://gitee.com/romkatv/powerlevel10k.git ~/powerlevel10k
echo 'source ~/powerlevel10k/powerlevel10k.zsh-theme' >>~/.zshrc
```

## 安装字体

### 下载字体

[Hack](https://github.com/source-foundry/Hack)

```bash
wget https://github.com/source-foundry/Hack/releases/download/v3.003/Hack-v3.003-webfonts.tar.gz
```

### 解压字体

```bash
tar -xvf Hack-v3.003-ttf.tar.xz
```

**注：** 字体通常安装在`/usr/share/fonts/`字体目录中，或者安装在以下目录中：`~/.local/share/fonts/`或`/usr/local/share/fonts`。

### 创建目录移动字体

```bash
mkdir -p ~/.local/share/fonts
mv Hack-*.ttf ~/.local/share/fonts
```

### 重新生成字体缓存

```bash
fc-cache -f -v
```

### 检测字体是否安装成功

```bash
fc-list |grep "Hack"
```

### 删除字体

先删除字体文件，然后重新生成字体缓存。

```bash
rm -rf ~/.local/share/fonts/Hack-*.ttf
fc-cache -f -v
```

## 修改终端默认字体

## 配置 powerlevel10k

配置命令：`10k configure`
