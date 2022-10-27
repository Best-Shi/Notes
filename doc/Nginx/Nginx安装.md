# Nginx 安装

> - 操作系统版本：CentOS Linux release 7.9.2009 (Core)
> - Nginx 版本：nginx-1.23.1.tar.gz

## Nginx 常用版本

- [Nginx 开源版](http://nginx.org/)
- [Nginx plus 商业版](https://www.nginx.com)
- [openresty](http://openresty.org/cn/)
- [tengine](http://tengine.taobao.org/)

## 解压

```bash
tar -zxvf nginx-1.23.1.tar.gz
```

## 编译安装

```bash
cd nginx-1.23.1
./configure --prefix=/usr/local/nginx
make
make install
```

### 报错处理

- 缺少 gcc 编译器

```bash
checking for OS
 + Linux 3.10.0-1160.el7.x86_64 x86_64
checking for C compiler ... not found

./configure: error: C compiler cc is not found

```

安装 gcc

```bash
yum install -y gcc
```

- 缺少 pcre 库

```bash
./configure: error: the HTTP rewrite module requires the PCRE library.
You can either disable the module by using --without-http_rewrite_module
option, or install the PCRE library into the system, or build the PCRE library
statically from the source with nginx by using --with-pcre=<path> option.
```

安装 pcre 库

```bash
yum install -y pcre pcre-devel
```

- 缺少 zlib 库

```bash
./configure: error: the HTTP gzip module requires the zlib library.
You can either disable the module by using --without-http_gzip_module
option, or install the zlib library into the system, or build the zlib library
statically from the source with nginx by using --with-zlib=<path> option.
```

安装 zlib 库

```bash
yum install -y zlib zlib-devel
```

## 启动 Nginx

进入安装好的目录 `/usr/local/nginx/sbin`

```bash
# 启动
./nginx

# 快速停止
./nginx -s stop

# 在退出前完成已接受的链接请求
./nginx -s quit

# 重新加载配置
./nginx -s reload
```

## 关于防火墙

测试时建议使用方式一。

- 方式一：

```bash
# 关闭防火墙
systemctl stop firewalld.service

# 禁止防火墙开机启动
systemctl disable firewalld.service
```

- 方式二：

```bash
# 放行端口
firewall-cmd --zone=public --add-port=80/tcp --permanent

# 移除放行端口
firewall-cmd --zone=public --remove-port=80/tcp --permanent

# 重启防火墙
firewall-cmd --reload
```

## 添加 Nginx 为系统服务

- 创建服务脚本

```bash
vi /usr/lib/systemd/system/nginx.service
```

脚本内容

```bash
[Unit]
Description=nginx - web server
After=network.target remote-fs.target nss-lookup.target

[Service]
Type=forking
PIDFile=/usr/local/nginx/logs/nginx.pid
ExecStartPre=/usr/local/nginx/sbin/nginx -t -c /usr/local/nginx/conf/nginx.conf
ExecStart=/usr/local/nginx/sbin/nginx -c /usr/local/nginx/conf/nginx.conf
ExecReload=/usr/local/nginx/sbin/nginx -s reload
ExecStop=/usr/local/nginx/sbin/nginx -s stop
ExecQuit=/usr/local/nginx/sbin/nginx -s quit
PrivateTmp=true

[Install]
WantedBy=multi-user.target
```

**注意：** `/usr/local/nginx/`为 Nginx 安装目录。

- 重新加载系统服务

```bash
systemctl daemon-reload
```

- 启动服务

```bash
systemctl start nginx.service
```

- 设置开机启动

```bash
systemctl enable nginx.service
```



