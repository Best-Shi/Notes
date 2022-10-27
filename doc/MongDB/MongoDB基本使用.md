
# MongoDB 基本使用

## MongoDB 介绍

> MongoDB 是一个介于关系数据库和非关系数据库之间的产品，是非关系数据库当中功能最丰富，最像关系数据库的 NoSql 数据库。他支持的数据结构非常松散，是类似 json 的 bson 格式，因此可以存储比较复杂的数据类型。Mongodb 最大的特点是他支持的查询语言非常强大，其语法有点类似于面向对象的查询语言，几乎可以实现类似关系数据库单表查询的绝大部分功能，而且还支持对数据建立索引。它的特点是高性能、易部署、易使用，存储数据非常方便。

## NoSQL 介绍

> NoSQL(NoSQL = Not Only SQL )，意即“不仅仅是 SQL”，它指的是非关系型的数据库，是以 key-value 形式存储，和传统的关系型数据库不一样，不一定遵循传统数据库的一些基本要求，比如说遵循 SQL 标准、ACID 属性、表结构等等。NoSQL 最早被提出是在 20 世纪 80 年代，在当时更多是强调的是与关系数据库区别对待，最近这些年被提及的更多是强调协助解决大数据等相关问题。NoSQL 在大数据时代有自己的意义。

## MongoDB 基本使用

### 1、连接数据库

```shell
mongo
```



### 2、查看所有数据库

```shell
show dbs
```



### 3、创建数据库

```shell
use test
```

-   如果数据库不存在，则创建数据库，否则切换到指定数据库。
-   如果真的想把这个数据库创建成功， ==那么必须插入一个== 。
-   数据库中不能直接插入数据，只能往集合(collections)中插入数据。

### 4、插入数据

```shell
db.user.insert({"name": "Best Shi", "age":22})
```



### 5、显示当前数据集合

```shell
show collections
```



### 6、删除指定集合

```shell
db.user.drop()
```



### 7、删除当前所在数据库

```shell
db.dropDatabase()
```



## MongoDB 查询数据

### 1、查找所有数据

```shell
db.user.find()
```

相当于：select \* from user;



### 2、条件查询

-   查询 name =xiaoli 的数据

```shell
db.admin.find({"name":"xiaoli"})
# 相当于：select * from admin where name="xiaoli"
```

-   查询 name =xiaoli 并且 age=22 的数据

```shell
db.admin.find({"name":"xiaoli","age":22})
# 相当于：select * from admin where name="xiaoli" and age=22;
```

-   查询 age>22 的数据

```shell
db.admin.find({"age":{"$gt":22}})
# 相当于：select * from admin where age>22;
```

-   查询 age>=22 的数据

```shell
db.admin.find({"age":{"$gte":22}})
# 相当于：select * from admin where age>=22;
```

-   查询 age<22 的数据

```shell
db.admin.find({"age":{"$lt":22}})
# 相当于：select * from admin where age<22;
```

-   查询 age<=22 的数据

```shell
db.admin.find({"age":{"$lte":22}})
# 相当于：select * from admin where age<=22;
```

-   查询 age>=22 并且 age<=25 的数据

```shell
db.admin.find({"age":{"$gte":22, "$lte":25}})
```

-   查询 age<=22 或者 age>=25 的数据

```shell
db.admin.find({"$or":[{"age":{"$lte":22}},{"age":{"$gte":25}}]})
# 相当于：select * from admin where age<=20 or age>=25
```

-   模糊查询

```shell
# 全模糊查询
db.admin.find({"name":/Best/})
# 相当于：select * from admin where name like "%Best%"

# 前模糊(以什么结尾)
db.admin.find({"name":/Shi$/})
# 相当于：select * from admin where name like "%Best"

# 后模糊（以什么开头）
db.admin.find({"name":/^Best/})
# 相当于：select * from admin where name like "Best%"
```

-   查询指定列的数据

```shell
db.admin.find({"age":{"$lte":22}},{"name":1})
# 相当于：select name from admin where age<=22;
```

> 当然 name 也可以用 true 或 false, 当用 ture 的情况下 name:1 效果一样，如果用 false 就是排除 name，显示 name 以外的列信息。

-   查询排序

```shell
# 升序 1
db.admin.find().sort({"age":1})

# 降序 -1
db.admin.find().sort({"age":-1})
```

-   查询第一条数据

```shell
db.admin.findOne()
# 相当于：selecttop 1 * from admin;
# db.admin.find().limit(1)
```

-   查询前 5 条数据

```shell
db.user.find().limit(5)
# 相当于：selecttop 5 * from admin;
```

-   查询 10 条以后的数据

```shell
db.user.find().skip(10)
```

-   分页查询

> limit 是 pageSize，skip 是(page-1)\*pageSize

```shell
# 每页 10 条数据，查询第 3 页的数据
db.user.find().limit(10).skip(20)
```

-   统计数量

```shell
db.user.find({"age":{"$gte":20}}).count()
# 相当于：select count(*) from user where age >= 20;

# 如果要返回限制之后的记录数量，要使用 count(true)或者 count(非 0)
db.user.find().limit(10).skip(20).count(true)
```

-   查询去掉后的当前聚集集合中的某列的重复数据

```shell
db.admin.distinct("name")
```

-   会过滤掉 name 中的相同项。
-   相当于：select distinct name from admin;



## MongoDB 修改数据

**语法：**

```shell
db.collection.update(
	<query>,
	<update>,
	{
		upsert: <boolean>,
		multi: <boolean>,
		writeConcern: <document>
	}
)
```

**参数说明：**

-   query : update 的查询条件，类似 sql update 查询内 where 后面的。
-   update : update 的对象和一些更新的操作符（如$,$inc...）等，也可以理解为 sql update 查询内 set 后面的
-   upsert : 可选，这个参数的意思是，如果不存在 update 的记录，是否插入 objNew,true 为插入，默认是 false，不插入。
-   multi : 可选，mongodb 默认是 false,只更新找到的第一条记录，如果这个参数为 true,就把按条件查出来多条记录全部更新。
-   writeConcern :可选，抛出异常的级别。

-   修改指定数据

```shell
db.student.update({"name":"小白"},{"$set":{"age":33}})
```

-   修改所有匹配条目

```shell
db.student.update({"sex":"男"},{"$set":{"age": 15}},{"multi":true})
```

-   替换整条数据

```shell
db.student.update({"sex":"nv"},{"name":"Best Shi","age":22,"sex":"男"})
```

## MongoDB 删除数据据

**语法：**

```shell
db.collection.remove(
	<query>,
	{
		justOne: <boolean>,
		writeConcern: <document>
	}
)
```

**参数说明：**

-   query :（可选）删除的文档的条件。
-   justOne : （可选）如果设为 true 或 1，则只删除一个文档。
-   writeConcern :（可选）抛出异常的级别。

-   删除指定数据

```shell
db.student.remove({"name":"Best Shi"})
```
