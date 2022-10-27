# MongoDB 进阶

## MongoDB 索引

> 索引是对数据库表中一列或多列的值进行排序的一种结构，使用索引可快速访问数据库表中的特定信息。

### 1、获取现有索引

```shell
db.student.getIndexes()
```

> Mongodb 默认索引 \_id 字段



### 2、创建索引

```shell
db.student.ensureIndex({name:1})
# 1：表示索引升序排序
# -1：表示索引降序排序
```



### 3、复合索引

```shell
db.student.ensureIndex({name:1,age:-1})
# 1：表示索引升序排序
# -1：表示索引降序排序
```

**复合索引查询表达式必须遵循指定的索引的顺序。**



### 4、数组索引

```json
// 数据格式
{
    "address": {
        "city": "Los Angeles",
        "state": "California",
        "pincode": "123"
    },
    "tags": ["music", "cricket", "blogs"],
    "name": "Tom Benzamin"
}
```

```shell
db.blogs.ensureIndex({tags:1})
```

**在数组中创建索引，需要对数组中的每个字段依次建立索引。**

### 5、唯一索引

```shell
db.blogs.ensureIndex({name:1},{unique:true})
```

### 6、删除索引

```shell
db.blogs.dropIndex({tags:1})
```

### 7、ensureIndex()中的其它参数

| 参数               | 类型          | 说明                                                                                                                                         |
| ------------------ | ------------- | -------------------------------------------------------------------------------------------------------------------------------------------- |
| background         | Boolean       | 建索引过程会阻塞其它数据库操作，background 可指定以后台方式创建索引，即增加 "background" 可选参数。 "background" 默认值为 false。            |
| unique             | Boolean       | 建立的索引是否唯一。指定为 true 创建唯一索引。默认值为 false.                                                                                |
| name               | string        | 索引的名称。如果未指定，MongoDB 的通过连接索引的字段名和排序顺序生成一个索引名称。                                                           |
| dropDups           | Boolean       | 在建立唯一索引时是否删除重复记录,指定 true 创建唯一索引。默认值为 false.                                                                     |
| sparse             | Boolean       | 对文档中不存在的字段数据不启用索引；这个参数需要特别注意，如果设置为 true 的话，在索引字段中不会查询出不包含对应字段的文档.。默认值为 false. |
| expireAfterSeconds | integer       | 指定一个以秒为单位的数值，完成 TTL 设定，设定集合的生存时间。                                                                                |
| v                  | index version | 索引的版本号。默认的索引版本取决于 mongod 创建索引时运行的版本。                                                                             |
| weights            | document      | 索引权重值，数值在 1 到 99,999 之间，表示该索引相对于其他索引字段的得分权重。                                                                |
| default_language   | string        | 对于文本索引，该参数决定了停用词及词干和词器的规则的列表。 默认为英语                                                                        |
| language_override  | string        | 对于文本索引，该参数指定了包含在文档中的字段名，语言覆盖默认的 language，默认值为 language.                                                  |

### 8、索引限制

#### **额外开销**

-   每个索引占据一定的存储空间，在进行插入，更新和删除操作时也需要对索引进行操作。所以，如果你很少对集合进行读取操作，建议不使用索引。

#### **内存(RAM)使用**

-   由于索引是存储在内存(RAM)中,你应该确保该索引的大小不超过内存的限制。
-   如果索引的大小大于内存的限制，MongoDB 会删除一些索引，这将导致性能下降。

#### **查询限制**

-   索引不能被以下的查询使用：
    -   正则表达式及非操作符，如 $nin, $not, 等。
    -   算术运算符，如 \$mod, 等。
    -   \$where 子句
    -   所以，检测你的语句是否使用索引是一个好的习惯，可以用 explain 来查看。

#### **索引键限制**

-   从 2.6 版本开始，如果现有的索引字段的值超过索引键的限制，MongoDB 中不会创建索引。

#### **插入文档超过索引键限制**

-   如果文档的索引字段值超过了索引键的限制，MongoDB 不会将任何文档转换成索引的集合。与 mongorestore 和 mongoimport 工具类似。

#### **最大范围**

-   集合中索引不能超过 64 个
-   索引名的长度不能超过 125 个字符
-   一个复合索引最多可以有 31 个字段

### 9、explain()

> explain 能获得查询方面诸多有用的信息。只要对游标调用该方法，就可以得到查询细节。explain 会返回一个文档，而不是游标本身。

```shell
# 获取查询时间
db.blogs.find({tags:'music44444'}).explain('executionStats')
```



## MongoDB 聚合

 **使用到的数据**

```shell
db.mycol.insert([
    {
        title: "MongoDB Overview",
        description: "MongoDB is no sql database",
        by_user: "w3cschool.cc",
        url: "http://www.w3cschool.cc",
        tags: ["mongodb", "database", "NoSQL"],
        likes: 100,
    },
    {
        title: "NoSQL Overview",
        description: "No sql database is very fast",
        by_user: "w3cschool.cc",
        url: "http://www.w3cschool.cc",
        tags: ["mongodb", "database", "NoSQL"],
        likes: 10,
    },
    {
        title: "Neo4j Overview",
        description: "Neo4j is no sql database",
        by_user: "Neo4j",
        url: "http://www.neo4j.com",
        tags: ["neo4j", "database", "NoSQL"],
        likes: 750,
    },
]);
```



> MongoDB 中聚合(aggregate)主要用于处理数据(诸如统计平均值,求和等)，并返回计算后的数据结果。有点类似 sql 语句中的 count(\*), sum(), avg()。

**聚合表达式**

| 表达式     | 描述                                           | 实例                                                                                  |
| ---------- | ---------------------------------------------- | ------------------------------------------------------------------------------------- |
| \$sum      | 计算总和。                                     | db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$sum : "$likes"}}}]) |
| \$avg      | 计算平均值                                     | db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$avg : "$likes"}}}]) |
| \$min      | 获取集合中所有文档对应值得最小值。             | db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$min : "$likes"}}}]) |
| \$max      | 获取集合中所有文档对应值得最大值。             | db.mycol.aggregate([{$group : {_id : "$by_user", num_tutorial : {$max : "$likes"}}}]) |
| \$push     | 在结果文档中插入值到一个数组中。               | db.mycol.aggregate([{$group : {_id : "$by_user", url : {$push: "$url"}}}])            |
| \$addToSet | 在结果文档中插入值到一个数组中，但不创建副本。 | db.mycol.aggregate([{$group : {_id : "$by_user", url : {$addToSet : "$url"}}}])       |
| \$first    | 根据资源文档的排序获取第一个文档数据。         | db.mycol.aggregate([{$group : {_id : "$by_user", first_url : {$first : "$url"}}}])    |
| \$last     | 根据资源文档的排序获取最后一个文档数据         | db.mycol.aggregate([{$group : {_id : "$by_user", last_url : {$last : "$url"}}}])      |

## MongoDB 聚合管道

> MongoDB 的聚合管道将 MongoDB 文档在一个管道处理完毕后将结果传递给下一个管道处理。管道操作是可以重复的。

**聚合管道示意图：**



**使用的数据**

```shell
db.books.insert([
    { title: "Node.js", author: { last: "aaa", first: "bbb" }, copies: 11 },
    { title: "JavaScript", author: { last: "ccc", first: "ddd" }, copies: 33 },
    { title: "TypeScript", author: { last: "eee", first: "fff" }, copies: 22 },
    { title: "Vue", author: { last: "ggg", first: "hhh" }, copies: 44 },
    { title: "CSS", author: { last: "ggg", first: "ccc" }, copies: 44 }
]);
```

:::

### 1、\$project

> \$project：修改输入文档的结构。可以用来重命名、增加或删除域，也可以用于创建计算结果以及嵌套文档。

-   指定输出字段

```shell
#  只返回 title、copies 字段
db.books.aggregate({$project:{_id:0,title:1,copies:1}})

# 只返回 title、copies、author 中的 last 字段
db.books.aggregate({$project:{_id:0,title:1,'author.last':1,copies:1}})

# 返回 title、 lastName、copies 字段
db.books.aggregate({$project:{_id:0,title:1,lastName:"$author.last",copies:1}})
```



### 2、\$match

> 用于过滤文档。用法类似于 find() 方法中的。

```shell
db.books.aggregate([{$project:{_id:0,title:1,lastName:"$author.last",copies:1}},{$match:{copies:{$gt:22}}}])
```



### 3、\$group

> 将集合中的文档进行分组，可用于统计结。

```shell
# 统计 author.last = ggg 的 copies 总和
db.books.aggregate({$group:{_id:'$author.last',total:{$sum:'$copies'}}})
```



### 4、\$sort

> 将集合中的文档进行排序。

```shell
db.books.aggregate([{$group:{_id:'$author.last',total:{$sum:'$copies'}}},{$sort:{total:-1}}])
```



### 5、`$limit 与 $skip`

```shell
# 查找第二页数据，每页显示两条
db.books.aggregate([{$project:{_id:0,title:1,lastName:"$author.last",copies:1}},{$sort:{copies:1}},{$skip:2},{$limit:2}])
```

**$limit要放在$skip 后面**



### 6、\$lookup

> 执行左连接到一个集合(unsharded)，必须在同一数据库中。
>
> \$lookup 添加了一个新的数组字段，该字段的元素是 joined 集合中的匹配文档。

**语法：**

```shell
{
   $lookup:
     {
       from: <collection to join>,   # 右集合
       localField: <field from the input documents>,  # 左集合 join字段
       foreignField: <field from the documents of the "from" collection>, # 右集合 join 字段
       as: <output array field>   # 新生成字段（类型array）
     }
}
```

| 参数         | 说明                                                                                                                             |
| ------------ | -------------------------------------------------------------------------------------------------------------------------------- |
| from         | 右集合（需要关联的集合），指定在同一数据库中执行连接的集合。此集合不能 shared 分片。                                             |
| localField   | 指定左集合（db.collectionname）匹配的字段。如果左集合不包含 localField，\$lookup 视为 null 值来匹配。                            |
| foreignField | 指定 from 集合（右集合）用来匹配的字段。如果集合不包含该字段，\$lookup 视为 null 值来匹配。                                      |
| as           | 指定要添加到输入文档的新数组字段的名称。新的数组字段包含 from 集合中匹配的文档。如果在文档中指定的名称已经存在，现有的领域覆盖。 |

 **需要的数据**

```shell
db.orders.insert([
    { uid: 1, sku: "abc", price: 12, quantity: 2 },
    { uid: 2, sku: "jkl", price: 20, quantity: 1 },
    { uid: 3 }
]);
db.inventory.insert([
    { uid: 1, sku: "abc", description: "product 1", instock: 120 },
    { uid: 2, sku: "def", description: "product 2", instock: 80 },
    { uid: 3, sku: "ijk", description: "product 3", instock: 60 },
    { uid: 4, sku: "jkl", description: "product 4", instock: 70 },
    { uid: 5, sku: null, description: "Incomplete" },
    { uid: 6 }
]);
```



```shell
db.orders.aggregate([{$lookup:{from:'inventory',localField:'sku',foreignField:'sku',as: 'items'}},{$project:{_id:0}}])
```

**查询结果：**

```json
{
	"uid": 1,
	"sku": "abc",
	"price": 12,
	"quantity": 2,
	"items": [{
		"_id": ObjectId("6081a9b715cd6acadc788896"),
		"uid": 1,
		"sku": "abc",
		"description": "product 1",
		"instock": 120
	}]
}
{
	"uid": 2,
	"sku": "jkl",
	"price": 20,
	"quantity": 1,
	"items": [{
		"_id": ObjectId("6081a9b715cd6acadc788899"),
		"uid": 4,
		"sku": "jkl",
		"description": "product 4",
		"instock": 70
	}]
}
{
	"uid": 3,
	"items": [{
		"_id": ObjectId("6081a9b715cd6acadc78889a"),
		"uid": 5,
		"sku": null,
		"description": "Incomplete"
	}, {
		"_id": ObjectId("6081a9b715cd6acadc78889b"),
		"uid": 6
	}]
}
```
