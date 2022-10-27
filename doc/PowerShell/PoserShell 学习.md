# PowerShell 学习

## PowerShell 配置文件

| 说明 | 路径 |
| --- | --- |
| 所有用户，所有主机 | $PSHOME\Profile.ps1 |
| 所有用户，当前主机 | $PSHOME\Microsoft.PowerShell_profile.ps1 |
| 当前用户，所有主机 | $Home[My ]Documents\PowerShell\Profile.ps1 |
| 当前用户，当前主机 | $Home[My ]Documents\PowerShell\Microsoft.PowerShell_profile.ps1 |

1. 确定要创建配置文件的级别。 可运行 `$Profile | Select-Object *` 来查看配置文件类型以及与它们关联的路径。
2. 使用如下所示的命令选择配置文件类型并在其位置创建文本文件：`New-Item -Path $Profile.CurrentUserCurrentHost`。

## 参数

1. 使用 `Param()` 声明参数。

   ```powershell
    Param($Name)
    Write-Host "Name: $Name"
   ```

2. 使用 `Parameter[]` 修饰器。
   ```powershell
   Param(
      [Parameter(Mandatory, HelpMessage = "请提供一个有效的 Name 参数！")]$Name
   )
   Write-Host "`$Name: $Name"
   #
   # cmdlet param.ps1 at command pipeline position 1
   # Supply values for the following parameters:
   # (Type !? for Help.)
   # Name: !?
   # 请提供一个有效的 Name 参数！
   # Name: BestShi
   # $Name: BestShi
   ```
3. 参数类型

   ```powershell
   Param(
      [string]$Name
   )
   Write-Host "`$Name: $Name"
   ```

4. 创建备份文件

   ```powershell
   $date = Get-Date -format "yyyy-MM-dd"
   Compress-Archive -Path './app' -CompressionLevel 'Fastest' -DestinationPath "./backup-$date"
   Write-Host "创建备份文件$('./backup-' + $date + '.zip')"
   ```

   - -Path，这是要压缩的文件的目录。
   - -CompressionLevel，用于指定文件的压缩量。
   - -DestinationPath，这是所生成的压缩文件的路径。

   ```powershell
   Param(
     [string][Parameter(Mandatory, HelpMessage = "请输入要备份的路径")]$Path,
     [string]$DestinationPath = './'
   )
   $date = Get-Date -format "yyyy-MM-dd"
   Compress-Archive -Path $Path -CompressionLevel 'Fastest' -DestinationPath "$($DestinationPath + 'backup-' + $date)"
   Write-Host "创建备份文件$($DestinationPath + 'backup-' +  $date + '.zip')成功"
   ```

## 流程控制

1. 使用 If、ElseIf 和 Else 管理输入和执行流。

2. PowerShell 提供了两个内置参数，用于确定表达式是 True 还是 False：
   - $True 指示表达式为 True。
   - - $False 指示表达式为 False。

```powershell
$Value = 3
If ($Value -eq 0)
{
  Write-Host "false"
} ElseIf ($Value -eq 3) {
  Write-Host "true"
} Else {
   Write-Host "false"
}
```

## 错误处理

1. 使用 Try/Catch/Finally 管理错误。
2. 可使用 $\_.exception.message 获取错误消息。
3. PowerShell 会使用 Write-Error cmdlet 通知你发生了问题。 脚本将继续运行。若要提高错误的严重性，可以使用参数（例如 -ErrorAction）来引发可通过 Try/Catch 捕获的错误。

```powershell
$Path = "1"
Try {
   If ($Path -eq 'aaaa') {
      Throw "Path not allowed"
   }
   Else {
      Get-Content './file.txt' -ErrorAction Stop
   }
}
Catch {
   Write-Error "$($_.exception.message)"
}
```

## 查看 powershell 版本

```powershell
$PSVersionTable.PSVersion
# or
pwsh -ver
```

## 什么是 PowerShell cmdlet

1. PowerShell 命令称为“cmdlet”（读成“command-let”）。 cmdlet 是操纵单个功能的命令。 术语“cmdlet”意在表示“小命令”。 按照惯例，cmdlet 作者应使 cmdlet 保持简单且用途单一。
2. 基本 PowerShell 产品附带可用于会话和后台作业等功能的 cmdlet。 你可将模块添加到 PowerShell 安装以获取操纵其他功能的 cmdlet。 例如，提供有第三方模块，可用于 ftp、管理操作系统、访问文件系统等。
3. Cmdlet 遵循谓词-名词命名约定，例如 Get-Process、Format-Table 和 Start-Service。 动词选择也有一个惯例：“get”用于检索数据、“set”用于插入或更新数据、“format”用于格式化数据、“out”用于将输出定向到目标等。
