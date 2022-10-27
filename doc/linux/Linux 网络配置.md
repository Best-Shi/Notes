# Linux 网络配置

- 修改网卡配置文件
  ```bash
  vi /etc/sysconfig/network-scripts/ifcfg-ens33
  ```
- 重启网络服务
  ```bash
  systemctl restart network
  ```

配置内容如下：

![Nginx安装-2022-09-04-01-14-56-20220904011456](https://images.bestshi.com/Nginx安装-2022-09-04-01-14-56-20220904011456.png!watermark)

## 公网 DNS

- 阿里

  ```txt
  223.5.5.5
  223.6.6.6
  ```

- 腾讯

  ```txt
  119.29.29.29
  182.254.118.118
  ```

- 百度

  ```txt
  180.76.76.76
  ```

- 114

  ```txt
  114.114.114.114
  114.114.115.115
  ```

- 谷歌

  ```txt
  8.8.8.8
  8.8.4.4
  ```
