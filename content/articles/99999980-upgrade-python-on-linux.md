Title: Upgrade Python to latest version (3.10) on Ubuntu Linux
Date: 2021-08-29
Category: Snippets
Tags: python, ubuntu
Author: Rehan Haider
Summary: A complete guide on how to upgrade Python to the latest version (Python 3.10) on Ubuntu Linux and solve associated issues
Keywords: Linux, Python, Ubuntu, Python 3.10, 
Slug: upgrade-python-to-latest-version-on-ubuntu-linux

**Last Updated:** 2022-08-11

Linux systems come with Python install by default, but, they are usually not the latest. Python also cannot be updated by a typical `apt upgrade` command as well. 

To check the version of Python installed on your system run
```bash
python3 --version
```
> `python` keyword is used for Python 2.x versions which has been deprecated

In this guide we will

1. Update Python to the latest version
2. Fix pip & other Python related issues
3. While doing the above two, ensure your Ubuntu which is heavily dependent on Python does not break

## Updating Python to the latest version 
Ubuntu's default repositories do not contain the latest version of Python, but an open source repository named `deadsnakes` does.

> !!! warning "Python3.10 is not officially available on Ubuntu 20.04, ensure you backup your system before upgrading."

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

![apt list check if python is present]({static}/images/99999980-apt_list.png)

### Step 2: Install Python 3.10
Now you can install Python 3.10 by running

```bash 
sudo apt install python3.10
```

Now though Python 3.10 is installed, if you check the version of your python by running `python3 --version` you will still see an older version. This is because you have two versions of Python installed and you need to choose Python 3.10 as the default. 

### Set an alias for pip3.10

Running this commands will use python3.10 to run python3 and pip commands:
```bash
echo 'alias pip="python3.10 -m pip"' >> ~/.bashrc
echo 'alias python3="python3.10"' >> ~/.bashrc

source ~/.bashrc


###  Install pip & distutils

```bash
sudo apt install python3.10-distutils
```

### Fix pip-env errors when using venv

Now, since we made an alias to execute `python3.10` when typing into the shell `python3`, when you try to create a new virtual environment using `python3 -m venv venv`, you may into the following error. 
```bash
Error: Command '['/path/to/env/bin/python3', '-Im', 'ensurepip', '--upgrade', '--default-pip']' returned non-zero exit status 1
```

You can fix this by installing venv for `python3.10` by running

```bash
sudo apt install python3.10-venv
```

All should be done now. It is not that hard to follow previous commands.

You can now enjoy a safe Python3.10 experience.

### Extra
If you have [oh-my-zsh](https://ohmyz.sh/) installed, you can avoid typing out `python3` by running
```bash
echo "alias py=/usr/bin/python3.10" >> ~/.zshrc
echo "alias python=/usr/bin/python3.10" >> ~/.zshrc
```
Now you can run your files with `py` or `python`.
