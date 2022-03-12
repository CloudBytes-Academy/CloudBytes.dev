Title: Make Ubuntu Fullscreen on Windows Hyper-V
Date: 2022-03-12
Category: Snippets
Tags: linux, windows
Author: Rehan Haider
Summary: How to run Ubuntu with full resolution in fullscreen mode on Windows Hyper-V
Keywords: linux, windows, hyper-v, virtualization, ubuntu


I previously explained how to install Ubuntu 20.04 in a VM on Windows using Hyper-V. However, by default the VM display will not run in full resolution. 

![99999959-ubuntu-hyperv-low-res]({static}/images/99999959-ubuntu-hyperv-low-res.png)


## How to run Ubuntu 20.04 in full resolution & fullscreen mode

First, open the terminal and run the following command to open grub settings using nano editor.

```bash
sudo nano /etc/default/grub
```

Then, change the `GRUB_CMDLINE_LINUX_DEFAULT` variable to the following:

```bash
GRUB_CMDLINE_LINUX_DEFAULT="quiet splash video=hyperv_fb:1920x1080"
```

![99999959-ubuntu-grub-update]({static}/images/99999959-ubuntu-grub-update.png)


Press `Ctrl+X` to exit nano editor and then `Y` followed by `Enter` to save the changes.

Next, run the following command to update grub settings.

```bash
sudo update-grub
```

Finally, restart Ubuntu by running the following command.
```bash
sudo reboot
```

Now, you have Ubuntu running in full screen mode with full resolution.

![99999959-ubuntu-hyperv-fullscreen]({static}/images/99999959-ubuntu-hyperv-fullscreen.png)