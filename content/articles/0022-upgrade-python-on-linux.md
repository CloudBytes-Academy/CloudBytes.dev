Title: Upgrade Python to latest version (3.10) on Ubuntu Linux
Date: 2021-08-29
Category: Snippets
Tags: python, ubuntu
Author: Rehan Haider
Summary: A complete guide on how to upgrade Python to the latest version (Python 3.10) on Ubuntu Linux and solve associated issues
Keywords: Linux, Python, Ubuntu, Python 3.10, 
Slug: upgrade-python-to-latest-version-on-ubuntu-linux

**Last Updated:** 2020-11-13

Linux systems come with Python install by default, but, they are usually not the latest. Python also cannot be updated by a typical `apt upgrade` command as well. 

To check the version of Python installed on your system run
```bash
python3 --version
```
> `python` keyword is used for Python 2.x versions which has been deprecated

## Updating Python to the latest version 
Ubuntu's default repositories do not contain the latest version of Python, but an open source repository named `deadsnakes` does.

### Step 1: Check if Python3.10 is available for install
```bash
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt update
```

Check if Python 3.10 is available by running

```bash
apt list | grep python3.10
```

This will produce the below result, if you see python3.10 it means you can install it

![apt list check if python is present]({static}/images/s0022/apt_list.png)

### Step 2: Install Python 3.10
Now you can install Python 3.10 by running

```bash 
sudo apt install python3.10
```

Now Python 3.10 is installed, if you check the version of your python by running `python3.10 --version` you will see the new version.

It is complicated, but this is how you update Python to latest version
