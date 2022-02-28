Title: Install Ubuntu in a VM on Windows using Hyper-V
Date: 2022-02-23
Category: Snippets
Tags: linux, windows
Author: Rehan Haider
Summary: Step by step guide to install Ubuntu 20.04 in a VM on Windows using Hyper-V
Keywords: linux, windows, hyper-v, virtualization, ubuntu
Status: Draft

I wrote earlier about how to install [Ubuntu 20.04 using WSL2 on Windows]({filename}0039-install-wsl2.md), and also how to [configure Hyper-V on Windows 10/11 Home edition]({filename}0044-enable-hyperv-windows10-home.md). IN this post I will show you how to install Ubuntu 20.04 in a VM on Windows using Hyper-V.

## Install Ubuntu on Hyper-V

You need to have Hyper-V enabled on your Windows 10/11, you can follow [this guide]({filename}0044-enable-hyperv-windows10-home.md) to enable it.

### Download the Ubuntu ISO

Download the Ubuntu 20.04 ISO from [here](https://ubuntu.com/download/desktop).

### Create a New VM

**Step 1**: Open the start menu and search for "Hyper-V Manager" and open it.

![open-hyperv-manager]({static}/images/s0045/open-hyperv-manager.png)

**Step 2**: Next, in the Hyper-V Manager, click on "New" in "Actions" and select "Virtual Machine". This will start the "New Virtual Machine Wizard"

**Step 3**: In the "New Virtual Machine Wizard", click on "Next". Then specify the new VM's name, then click on "Next".

**Step 4**: Choose the Generation 2 VM, then click on "Next".

**Step 5**: Specify the VM's memory size, then click on "Next". I have set it to 4 GB but choose a value based on your PC's RAM.

**Step 6**: In Configure Networking, select "Default Switch" and then click on "Next".

**Step 7**: In "Connect Virtual Hard Disk", Select "Create a virtual hard disk" and specify the name of the file and maximum size of the disk, then click on Next. I chose to keep the defaults. 

**Step 8**: In "Installation Options", select "Install an operating system from bootable image file" and browse to the Ubuntu ISO and select it. Then click on "Next".

**Step 9**: Click on Finish to create the VM.

Now you should see a new VM in the "Virtual Machines" list.

![virtual-machines-list]({static}/images/s0045/virtual-machines-list.png)

### Start the VM

In the Virtual Machines list, click on the VM's name and then click on "Connect", then click on "Start".