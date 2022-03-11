Title: Install Ubuntu in a VM on Windows using Hyper-V
Date: 2022-02-23
Category: Snippets
Tags: linux, windows
Author: Rehan Haider
Summary: Step by step guide to install Ubuntu 20.04 in a VM on Windows using Hyper-V
Keywords: linux, windows, hyper-v, virtualization, ubuntu
Course_Tag: linux

I wrote earlier about how to install [Ubuntu 20.04 using WSL2 on Windows]({filename}99999965-install-wsl2.md), and also how to [configure Hyper-V on Windows 10/11 Home edition]({filename}99999961-enable-hyperv-windows10-home.md). IN this post I will show you how to install Ubuntu 20.04 in a VM on Windows using Hyper-V.

You need to have Hyper-V enabled on your Windows 10/11, you can follow [this guide]({filename}99999961-enable-hyperv-windows10-home.md) to enable it.

## Download the Ubuntu ISO

Download the Ubuntu 20.04 ISO from [here](https://ubuntu.com/download/desktop).

## Create a New VM

### Step 1: Open the Hyper-V Manager

Open the start menu and search for "Hyper-V Manager". Click on "Open", to start the Hyper-V Manager.

![open-hyperv-manager]({static}/images/s0045/open-hyperv-manager.png)


### Step 2: Create a new VM
Next, in the Hyper-V Manager, click on "**New**" in "**Actions**" panel on right, then select "**Virtual Machine**". This will start the "**New Virtual Machine Wizard**"

![hyperv-new]({static}/images/s0045/hyperv-new.png)

### Step 3: Configure the VM
1. **Before You Begin** - This is an informational panel, click on **Next** to continue.
2. **Specify Name and Location** - Enter a name for the VM. You can leave the location to default. Press **Next**.
3. **Specify Generation** - Select the generation of the VM, choose "**Generation 2**" and press **Next**.
4. **Assign Memory** - Select the amount of memory to assign to the VM. You can leave the default, I chose 2048 MB. Press **Next**.
5. **Configure Networking** - Click on **Connection** and choose **Default Switch**. Press **Next**.
6. **Connect Virtual Hard Disk** - You can leave the defaults. Press **Next**.
7. **Installation Options** - Select the "**Install an operating system from bootable image file**, browse to select the Ubuntu ISO you downloaded earlier, and press **Next**.
8. **Summary** - Click on **Finish** to finish configuration and create a VM.


Now you should see a new VM in the "Virtual Machines" list.

![virtual-machines-list]({static}/images/s0045/virtual-machines-list.png)

### Configure Boot Options

Before you can start you Ubuntu VM, you need to configure UEFI settings. Right click on the VM you created and select "**Settings**".

In the settings menu that opens, click on **Security**. Then under **Secure Boot**, check the **Enable Secure Boot** checkbox then in **Template** dropdown, choose **Microsoft UEFI Certificate Authority**.

Now click on **Apply** and then on **OK** to close the settings menu.

### Start the VM

Now, right click on the VM you want to start, then click on **Connect**. In the dialog that opens, click on **Start**.
![ubuntu-demo-conn]({static}/images/s0045/ubuntu-demo-conn.png)

If you see a boot menu, don't do anything it will skip in a few seconds. 

On the first boot, the Installation Wizard will guide you. Follow the steps to complete the Ubuntu Installation. 

### [Bonus] Configure Ubuntu Installation

Follow the below steps, these are recommended by me personally, but you can choose as per your convinience.

1. **Welcome** - Select the Language (English), then click on **Install Ubuntu**.
2. **Keyboard layout** - Select your keyboard layout and language and press **Continue**. I chose defaults English (US as both language and keyboard layout).
3. **Updates and other software** - Leave the defaults, press **Continue**.
4. **Installation type** - Leave the defaults, press **Install Now**. In the confirmation dialogue for **Write the changes to disks**, click on **Continue**.
5. **Where are you** - You can choose your timezone, usually the default is correct. Press **Continue**.
6. **Who are you** - You can choose your name, username, password. The computer name is generated automatically, but you can override and choose as per your need. Press **Continue**. 

This will start the installation process, it will take a few minutes to complete. After the installation is complete, you will get a prompt to restart the VM. Click on **Restart**. 

If restart process get stuck, go back to the Hyper-V Manager and right click on VM and click on **Turn off**. Then right click again, click on "**Connect**" and then click on "**Start**".

### [Bonus] Configure your Ubuntu Profile

On the first login a configuration will guide you through profile settings. 

1. **Connect Your Online Accounts** - Choose one of the accounts in the option or skip by pressing "**Skip**" on top right.
2. **Livepatch** - You can setup up Livepatch or skip by pressing "**Next**" on top right.
3. **Help improve Ubuntu** - I chose "**No, don't send system info** to disable telemetry. Click on **Next**.
4. **Privacy** - I chose to turn off Location Services. Click on **Next**.
5. **You're ready to go** - Choose any additional software you want to install. Click on **Done**.

This should complete the setup. 
![ubuntu-dektop-small]({static}/images/s0045/ubuntu-dektop-small.png)


<!--
### [Bonus] Configure you Ubuntu to be full screen

If you notice above, the resolution and aspect of the VM is not the same as the monitor. You will also not be able to change this in the display settings.

-->