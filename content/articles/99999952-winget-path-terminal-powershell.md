Title: Winget Installation and configuration on Windows Terminal and PowerShell
Date: 2025-07-06
Category: Snippets
Tags: Windows, PowerShell
Author: Rehan Haider
Summary: How to install, configure, and use Winget on Windows along with fixes for path issues in Windows Terminal and PowerShell
Keywords: winget, windows, powershell, terminal, path
Status: hidden


Install
```powershell
Add-AppxPackage -RegisterByFamilyName -MainPackage Microsoft.DesktopAppInstaller_8wekyb3d8bbwe
```

Add to PATH (User)
```
[Environment]::SetEnvironmentVariable("Path", $env:PATH + ";$env:LOCALAPPDATA\Microsoft\WindowsApps", "User")
```
