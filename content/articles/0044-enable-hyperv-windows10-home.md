Title: Enable Hyper-V on Windows 10/11 Home
Date: 2022-02-22
Category: Snippets
Tags: linux, windows
Author: Rehan Haider
Summary: Step by step guide to enable Hyper-V on Windows 10 Home or Windows 11 Home
Keywords: linux, windows, hyper-v, virtualization


Windows 10/11 Home edition doesn't come with Hyper-V by default, if you try to enable it from "Turn on Windows features" option from control panel you would not find Hyper-V listed.

This is because Hyper-V is a Professional and Enterprise edition feature, but it is [possible to enable it from the command line](https://docs.microsoft.com/en-us/answers/questions/29175/installation-of-hyper-v-on-windows-10-home.html).

![windows-features]({static}/images/s0044/windows-features.png)

## Enable Hyper-V from command line

We're going to use the [Windows Terminal](https://www.microsoft.com/en-us/p/windows-terminal/9n0dx20hk701) so make sure you install it from the [Windows Store](https://www.microsoft.com/en-us/p/windows-terminal/9n0dx20hk701).

### Step 1. Check Minimum System Requirements

Your PC should support Hardware virtualisation for Hyper-V to work. 

If you do not have hardware virtualisation, you will need to use an alternative such as [VirtualBox](https://www.virtualbox.org/) or [VMware Workstation Player](https://www.vmware.com/products/workstation-player.html).

!!! note "Note: Many Windows 10 PCs—and all PCs that come preinstalled with Windows 11—already have virtualization enabled, so you may not need to follow these steps."

For Windows 10, run the followind command in the terminal
```powershell
Get-ComputerInfo -property "HyperV*"
```
You should get the below output

![windows 10 virtualisation]({static}/images/s0044/virtualisation.png)

This means that your PC supports hardware virtualisation.

### Step 2. Enable Hyper-V

Create a file on your PC called "enable-hyperv.bat" and paste the following code in it.

```powershell
pushd "%~dp0"
dir /b %SystemRoot%\servicing\Packages\*Hyper-V*.mum >hyper-v.txt
for /f %%i in ('findstr /i . hyper-v.txt 2^>nul') do dism /online /norestart /add-package:"%SystemRoot%\servicing\Packages\%%i"
del hyper-v.txt
Dism /online /enable-feature /featurename:Microsoft-Hyper-V -All /LimitAccess /ALL
pause
```
Now run the batch file as an administrator, as shown below.
![enable-hyperv]({static}/images/s0044/enable-hyperv.png)

This will go through several steps and will take some time to complete. Though it might seem it's repeating the same steps, let it complete without interruption.

Once the process is complete, you should see the following message asking for confirmation to reboot your PC. Press Y to reboot. 

![enable-hyperv-complete]({static}/images/s0044/enable-hyperv-complete.png)

### Step 3. Check if Hyper-V is enabled

Open your teminal and run `optionalfeatures` to see the status of Windows features. You should be able to see a Hyper-V feature listed now. 

![hyperv-enabled]({static}/images/s0044/hyperv-enabled.png)


## Starting Hyper-V Manager

Go to the start menu and search for Hyper-V, open the Hyper-V Manager. 

![open-hyperv-manager]({static}/images/s0044/open-hyperv-manager.png)

From here you can start creating VMs, creating a new VM, or even creating a new VM template.

For a quick start, follow this [guide to installing Ubuntu on Hyper-V]({filename}0045-install-ubuntu-on-windows.md)