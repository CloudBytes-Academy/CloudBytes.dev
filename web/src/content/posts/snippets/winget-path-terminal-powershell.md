---
title: "Winget Installation and configuration on Windows Terminal and PowerShell"
description: "How to install, configure, and use Winget on Windows along with fixes for path issues in Windows Terminal and PowerShell"
pubDate: "2025-07-06"
category: "Snippets"
categorySlug: "snippets"
slug: "winget-path-terminal-powershell"
keywords:
    - "winget"
    - "windows"
    - "powershell"
    - "terminal"
    - "path"
author: "Rehan Haider"
authorSlug: "rehan-haider"
draft: true
---
Install
```powershell
Add-AppxPackage -RegisterByFamilyName -MainPackage Microsoft.DesktopAppInstaller_8wekyb3d8bbwe
```

Add to PATH (User)
```
[Environment]::SetEnvironmentVariable("Path", $env:PATH + ";$env:LOCALAPPDATA\Microsoft\WindowsApps", "User")
```
