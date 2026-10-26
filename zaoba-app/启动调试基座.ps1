# 早八课表 - 真机调试基座启动脚本

# 第一步：检查设备连接
Write-Host "检查设备连接..." -ForegroundColor Cyan
adb devices

Write-Host "`n请确认设备序列号是 <设备序列号>" -ForegroundColor Yellow
Read-Host "按回车键继续"

# 第二步：确保 HBuilderX 已导入项目
Write-Host "`n导入项目到 HBuilderX..." -ForegroundColor Cyan
& 'HBuilderX/cli.exe' project open --path 'zaoba-app'

Start-Sleep -Seconds 2

# 第三步：确认项目列表
Write-Host "`n当前项目列表：" -ForegroundColor Cyan
& 'HBuilderX/cli.exe' project list

Write-Host "`n请确认列表中有 zaoba-app" -ForegroundColor Yellow
Read-Host "按回车键继续"

# 第四步：获取设备序列号
Write-Host "`n请输入设备序列号（直接回车使用默认 <设备序列号>）：" -ForegroundColor Cyan
$deviceId = Read-Host
if ([string]::IsNullOrWhiteSpace($deviceId)) {
    $deviceId = "<设备序列号>"
}

Write-Host "使用设备：$deviceId" -ForegroundColor Green

# 第五步：启动调试基座
Write-Host "`n启动调试基座..." -ForegroundColor Cyan
Write-Host "注意：启动后会持续同步代码，保持窗口运行约 30 分钟" -ForegroundColor Yellow

& 'HBuilderX/cli.exe' launch app-android `
  --project 'zaoba-app' `
  --deviceId $deviceId `
  --playground standard

Write-Host "`n调试基座已启动！" -ForegroundColor Green
Write-Host "现在可以在手机上测试 App 了" -ForegroundColor Green
Write-Host "修改代码后会自动同步到手机" -ForegroundColor Yellow
