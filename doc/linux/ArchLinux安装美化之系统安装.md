# ArchLinux 安装美化之系统安装

## ArchLinux 系统安装

1. 制作 U 盘启动，推荐使用工具[Etcher](https://www.balena.io/etcher/)

2. 启动 u 盘系统，验证引导模式。

```bash
ls /sys/firmware/efi/efivars
```

如果命令结果显示了目录且没有报告错误，则系统以 UEFI 模式引导。 如果目录不存在，则系统可能以 BIOS 模式 (或 CSM 模式) 引导。

3. 连接网络

   - 查看是否启用网络接口。

   ```bash
   ip link
   ```

   - 检查网络连接状态

   ```bash
   ping www.baidu.com
   ```

   - 使用 NetworkManager 连接网络。

   a. 启动 NetworkManager

   ```bash
   systemctl start NetworkManager
   ```

   b. 查看可用 wifi

   ```bash
   nmcli device wifi list
   ```

   c. 连接 wifi

   ```bash
   nmcli device wifi connect [BSSID|SSID] password password
   ```

4. 更新系统时间

```bash
timedatectl set-ntp true
```

5.  建立应该盘分区

**BIOS 与 MBR**

| 挂载点 | 分区                | 分区类型   |
| ------ | ------------------- | ---------- |
| SWAP   | 交换分区(/dev/swap) | Linux swap |
| /mnt   | 根分区(/dev/root)   | Linux      |

**UEFI 与 GPT**

| 挂载点               | 分区                   | 分区类型     |
| -------------------- | ---------------------- | ------------ |
| /mnt/boot 或/mnt/efi | efi 系统分区(/dev/efi) | EFI 系统分区 |
| SWAP                 | 交换分区(/dev/swap)    | Linux swap   |
| /mnt                 | 根分区(/dev/root)      | Linux        |

6. 格式化分区

```bash
# 挂载根分区
mkfs.ext4 /dev/root

# 格式化交换分区
mkswap /dev/swap

# 格式化eif分区
mkfs.fat -F 32 /dev/eif
```

7. 挂载分区

```bash
# 挂载根分区
mount /dev/root /mnt

# 挂载交换分区
swapon /dev/swap
```

8. 修改镜像源

```bash
# 选择最近12小时同步的，并且位于中国的镜像，然后根据下载速度排序，最后将结果覆写到`/etc/pacman.d/mirrorlist`
reflector --country China --age 12 --protocol https --sort rate --save /etc/pacman.d/mirrorlist
```

9. 安装系统

```bash
pacstrap /mnt base base-devel linux linux-firmware vim
```

## 配置系统

1. 生成 fstab 文件

```bash
genfstab -U /mnt >> /mnt/etc/fstab
```

2. 切换到新系统

```bash
arch-chroot /mnt
```

3. 设置时区

```bash
ln -sf /usr/share/zoneinfo/Asia/Shanghai /etc/localtime
```

4. 生成 /etc/adjtime

```bash
hwclock --systohc
```

5. 本地化

编辑 `/etc/locale.gen`，然后取消掉 `en_US.UTF-8 UTF-8`、`zh_CN.UTF-8 UTF-8`、`zh_CN.GBK GBK`、`zh_CN GB2312`的注释。执行 `locale.gen`生成 `locale`信息。

```bash
locale.gen
```

设置系统语言创建`locale.conf`文件，设置 `LANG`变量（建议设置为英文，避免出现中文乱码）。

```bash
vim /etc/locale.conf
LANG=en_US.UTF-8
```

## 配置网络

1. 创建 `hostname` 文件

```bash
vim /etc/hostname
myhostname # 主机名
```

2. 添加 `hosts`文件

```bash
vim /etc/hosts
127.0.0.1	localhost
::1			localhost
127.0.1.1	myhostname # 主机名
```

3. 修改镜像源

```bash
reflector --country China --age 12 --protocol https --sort rate --save /etc/pacman.d/mirrorlist
```

4. 安装网络管理工具

```bash
pacman -S networkmanager
systemctl enable NetworkManager # 设置开机启动
```

## 配置用户

1. 设置 root 密码

```bash
passwd
```

2. 创建普通用户

```bash
useradd -m -G wheel shi # shi: 用户名
passwd shi # 设置普通用户密码
```

3. 让普通用户能使用 sudo 执行管理员命令

```bash
pacman -S sudo
vim /etc/sudoers # 取消 %wheel ALL=(ALL) ALL 前面的注释
```

## 安装微码和驱动

1. 安装微码

```bash
# amd cpu 安装这个
pacman -S amd-ucode

# intel cpu 安装这个
pacman -S intel-ucode
```

2. 安装驱动

```bash
# nvidia 显卡
pacman -S nvidia nvidia-utils

# amd 显卡或核显
pacman -S xf86-video-amdgpu

# intel 核显
pacman -S xf86-video-intel
```

## 安装引导程序

1. 安装引导工具

```bash
pacman -S grub
```

2. BIOS 启动安装引导

```bash
grub-install --target=i386-pc /dev/sdX # /dev/sdX: 整块磁盘
```

3. EFI 启动安装引导

- 挂载 EFI 系统分区

```bash
mkdeir /boot/efi
mount /dev/efi /boot/efi
```

- 安装引导

```bash
grub-install --target=x86_64-efi --efi-directory=esp --bootloader-id=Arch
```

- 多系统

```bash
pacman -S os-prober

vim /etc/default/grub

# 取消以下代码注释，没有的话在末尾添加
GRUB_DISABLE_OS_PROBER=false
```

**注意：**如果检测不到 Windows 的分区，可尝试安装 NTFS-3G。

4. 生成配置文件

```bash
grub-mkconfig -o /boot/grub/grub.cfg
```

## 重启

退出 chroot 环境

```bash
exit
umount -R /mnt
reboot
```
