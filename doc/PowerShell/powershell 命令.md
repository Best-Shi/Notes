# PowerShell 命令

## 查找命令

Get-Command：Get-Command cmdlet 列出系统上的所有可用 cmdlet。 筛选列表以快速找到所需的命令。

- `-Noun`: 查看与 `-` 后面匹配的命令。
- `-Verb`: 查看与 `-` 前面匹配的命令。

```powershell
  Get-Command -Noun File*
```

## 帮助命令

Get-Help：运行 Get-Help 核心 cmdlet，以调用内置帮助系统。 或者使用别名 help 命令来调用 Get-Help，但通过对响应进行分页来改善读取体验。

```powershell
Get-Help Get-FileHash -Examples
```

- 更新帮助文档

```powershell
Update-Help -UICulture en-US -Verbose
```

`-UICulture `标志。 它为该标志提供值 `en-US`，这将提取英语帮助文件。

- 帮助文档说明：

  - NAME：提供命令的名称。
  - SYNTAX：介绍如何通过使用标志组合（有时还可使用允许的参数）来调用命。
  - ALIASES：列出了命令的所有别名。 别名是命令的不同名称，可用于调用命。
  - REMARKS：提供有关要运行的命令的信息，以获取有关此命令的更多帮助。
  - PARAMETERS：提供有关参数的详细信息。 包括参数的类型、较长的说明和可接受的值（如果适用）。

- 帮助文档筛选：

  - Full：返回详细的帮助页面。 它指定了无法从标准响应中获取的参数、输入和输出等信息。
  - Detailed：返回与标准响应类似、但包含参数部分的响应。
  - Examples：仅返回示例（如果存在）。
  - Online：为命令打开一个网页。
  - Parameter：需要形参名称作为实参。 它列出特定参数的属性。

- Get-Member：调用命令时，响应是包含多个属性的对象。 运行 Get-Member 核心 cmdlet 向下钻取到该响应并了解其详细信息。
