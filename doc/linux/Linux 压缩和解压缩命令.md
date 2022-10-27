# Linux 压缩和解压缩命令

## '.zip' 格式

### 压缩命令

```bash
zip [选项] 压缩包名 源文件或源目录
```

选项：

- `-r`： 压缩目录

```bash
zip test.zip abc bcd
```

### 解压命令

```bash
unzip [选项] 压缩包名
```

选项：

- `-d`： 指定解压缩位置

```bash
unzip test.zip
```

## '.gz' 格式

**注意：** 不会打包。

### 压缩命令

```bash
gzip [选项] 源文件或源目录
```

选项：

- `-c`： 将压缩数据输出到标准输出中，可以用于保留源文件。
- `-d`： 解压缩。
- `-r`： 压缩目录（把目录里面的文件单独压缩）。

```bash
gzip abc bcd
```

### 解压命令

```bash
gunzip 压缩包
gzip -d 压缩包
```

```bash
gzip -d abc bcd
```

## '.bz2' 格式

**注意：** 不能压缩目录。

### 压缩命令

```bash
bzip2 [选项] 源文件
```

选项：

- `-d`： 解压缩。
- `-k`： 压缩时保留源文件。
- `-v`： 显示压缩的详细信息。

```bash
bzip2 abc bcd
```

### 解压命令

```bash
bunzip2 压缩包
bzip2 -d 压缩包
```

```bash
bzip2 -d abc bcd
```

## '.tar' 格式

**注意：** 打包不会压缩。

### 打包命令

```bash
tar [选项] [-f 压缩包名] 源文件或目录
```

选项：

- `-c`： 打包。
- `-f`： 指定压缩包的文件名。
- `-v`： 显示打包过程。

```bash
tar -cvf test.tar abc bcd
```

### 解打包命令

```bash
tar [选项] 压缩包
```

选项：

- `-x`： 解打包。
- `-f`： 指定压缩包的文件名。
- `-v`： 显示打包过程。
- `-t`： 测试，不解打包，只是查看包中有哪些文件。
- `-C`： 指定解打包位置。

```bash
# 解打包到当前目录下
tar -xvf test.tar
```

## '.tar.gz' 和 '.tar.bz2' 格式

```bash
tar [选项] 压缩包 源文件或目录
```

选项：

- `-z`：压缩和解压缩`.tar.gz`格式。
- `-j`：压缩和解压缩`.tar.bz2`格式。

### 打包压缩

```bash
# .tar.gz 格式
tar -zcvf test.tar.gz abc bcd

# .tar.bz2 格式
tar -jcvf test.tar.bz2 abc bcd
```

### 解打包解压缩

```bash
# .tar.gz 格式
tar -zxvf test.tar.gz

# .tar.bz2 格式
tar -jxvf test.tar.bz2

# 只查看，不解压
tar -ztvf test.tar.gz

# 解压到指定位置
tar -zxvf test.tar.gz -C /temp

# 解压指定文件到指定位置
tar -zxvf test.tar.gz -C /temp abc
```
