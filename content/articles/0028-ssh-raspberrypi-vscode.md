Title: Develop remotely on Raspberry Pi using VSCode Remote SSH
Date: 2021-10-16
Category: Snippets
Tags: python, raspberrypi
Author: Rehan Haider
Summary: How to connect and develop remotely on Raspberry PI by SSHing in using VSCode 
Keywords: Python, Raspberrypi, vscode, ssh


So you got yourself a Raspberry Pi and want to develop something on it. 

Raspberry Pi is of course lightweight, and consumes very little power but that also makes it quite unsuitable for developing anything small apps and running lightweight code editors such as Geany, Thonny etc. 

![Raspberry Pi]({static}/images/s0028/raspberry-pi.png)

You could use VIM, but then you need to login to your Raspberry Pi using either VNC Viewer, or SSH into Raspberry Pi using some form of terminal. But for a VSCode fan such as me, that's not an acceptable option specially because I don't want to reconfigure all of my preferences. 

So the compromise is, you can simply use VSCode on your PC and use VSCOde to SSH in to the Raspberry PI and develop remotely. 

## Add Raspberry Pi as recognised hosts

Fire up your VSCode and first search and install the Microsoft provided official [Remote - SSH extension](https://marketplace.visualstudio.com/items?itemName=ms-vscode-remote.remote-ssh). 

Then open the command Palette by pressing `Ctrl + Shift + P`, search for `Remote-SSH: Connect to a Host` then click on *"+ Add New SSH Host..."*.

Then in the prompt type `ssh pi@raspberrypi`, assuming you username is `pi` and the hostname of your Raspberry Pi is `raspberrypi`. Then press Enter.

![SSH Raspberry Pi]({static}/images/s0028/ssh-command.png)


When prompted to select SSH configuration file to update, choose the one under `C:\Users\YourName\.ssh\config`.

## Connect to Raspberry Pi

Then, open the Command Palette again by typing `Ctrl + Shift + P`, and search for `Remote-SSH: Connect to a Host` again. 
Choose `raspberrypi` from the dropdowns. 

![SSH Raspberry Pi]({static}/images/s0028/ssh-connect.png)

You will be prompted for password for your user on Raspberry Pi, enter the password. This will setup the VSCode Remote Server on the Raspberry PI. 

Once you're connected you should see the `SSH: raspberrypi` on bottom left part of your VSCode. 

## Opening a particular folder
Open the explorer on VSCode and you should see the following message. Click on *Open Folder*
![SSH Raspberry Pi]({static}/images/s0028/ssh-explorer.png)


You will get a dropdown, navigate to the folder you want to open and then press OK. Youl will be prompted for password again. And you should now be connected to Raspberry Pi and able to develop on it remotely. 
![SSH Raspberry Pi]({static}/images/s0028/ssh-vscode.png)