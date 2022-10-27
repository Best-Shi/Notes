# MongoDB 权限

## 账户权限配置

### 1、创建超级管理用户

```shell
use admin
db.createUser({user:'admin',pwd:'admin',roles:[{role:'root',db:'admin'}]})
```

### 2、修改 MongoDB 配置文件

```cfg
<!-- 安装目录 bin 目录下 mongod.cfg 文件 -->
security:
    authorization: enabl
```

### 3、重启 MongoDB 服务

```shell
# 管理员运行 cmd，然后执行
net start MongoDB
```

### 4、超级管理员链接数据库

```shell
mongo admin -u 用户名 -p 密码
```

### 5、给数据库创建用户

```shell
use test
db.createUser({user:'xiaoli', pwd:'123456',roles:[{role:'dbOwner',db:'test'}]})
```

## 权限管理常用命令

### 1、查看当前库下的用户

```shell
show users;
```

### 2、删除用户

```shell
db.dropUser('xiaoli')
```

### 3、修改用户密码

```shell
db.updateUser('admin',{pwd:'123456'})
```

### 4、密码认证

```shell
db.auth('admin','123456')
```

## MongoDB 用户角色

1. 数据库用户角色：

    - read 角色包含读取所有非系统集合数据和订阅部分系统集合(system.indexes、system.js、system.namespaces)的权限。
    - readWrite 角色包含 read 角色的权限同时增加了对非系统集合数据的修改权限，但只对系统集合 system.js 有修改权限。

2. 数据库管理角色：

    - dbAdmin 角色包含执行某些管理任务(与 schema 相关、索引、收集统计信息)的权限，该角色不包含用户和角色管理的权限。
    - dbOwner 角色包含对数据所有的管理操作权限。即包含角色 readWrite、dbAdmin 和 userAdmin 的权限。
    - userAdmin 角色包含对当前数据库创建和修改角色和用户的权限。该角色允许向其它任何用户(包括自身)授予任何权限，所以这个角色也提供间接对超级用户(root)的访问权限，如果限定在 admin 数据中，也包括集群管理的权限。

3. 集群管理角色：

    - clusterManager 角色包含对集群监控和管理操作的权限。拥有此角色的用户能够访问集群中的 config 数据库和 local 数据库。
    - clusterMonitor 角色包含针对监控工具具有只读操作的权限。如工具 MongoDB Cloud Manager 和工具 Ops Manager。
    - hostManager 角色包含针对数据库服务器的监控和管理操作权限。
    - clusterAdmin 角色包含 MongoDB 集群管理最高的操作权限。该角色包含 clusterManager、clusterMonitor 和 hostManager 三个角色的所有权限，并且还拥有 dropDatabase 操作命令的权限。

4. 备份恢复角色：

    - backup 角色包含备份 MongoDB 数据最小的权限。
    - restore 角色包含从备份文件中还原恢复 MongoDB 数据(除了 system.profile 集合)的权限。

5. 所有数据库角色：

    - readAnyDatabase 角色包含对除了 config 和 local 之外所有数据库的只读权限。同时对于整个集群包含 listDatabases 命令操作。
    - readWriteAnyDatabase 角色包含对除了 config 和 local 之外所有数据库的读写权限。同时对于整个集群包含 listDatabases 命令操作。
    - userAdminAnyDatabase 角色包含类似于 userAdmin 角色对于所有数据库的用户管理权限，除了 config 数据库和 local 数据库。
    - dbAdminAnyDatabase 角色包含类似于 dbAdmin 角色对于所有数据库管理权限，除了 config 数据库和 local 数据库。同时对于整个集群包含 listDatabases 命令操作。

6. 超级用户角色：
    - root 角色包含角色 readWriteAnyDatabase、dbAdminAnyDatabase、userAdminAnyDatabase、clusterAdmin、restore 和 backup 联合之后所有的权限。
