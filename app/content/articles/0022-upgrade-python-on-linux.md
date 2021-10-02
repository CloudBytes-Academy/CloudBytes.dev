Title: Upgrade Python to latest version (3.9) on Ubuntu Linux
Date: 2021-08-29
Category: Articles
Tags: python
Author: Rehan Haider
Summary: A brief guide on how to upgrade Python to the latest version (Python 3.9) on Ubuntu Linux and solve associated issues
Keywords: Linux, Python
Slug: upgrade-python-to-latest-version-on-ubuntu-linux

Linux systems come with Python install by default, however, they are usually not the latest. Python also typically is not updated by a typical `apt-get upgrade` command as well. 

To check the version of Python installed on your system run
```bash
python3 --version
```
> Typically `python` keyword is used for Python 2.x versions which have been deprecated

## Updating Python to the latest version 
Typically Ubuntu's default repositories do not contain the latest version of Python, but an open source repository named `deadsnakes` does. Let's use that by running

### Step 1: Check if Python3.9 is available for install
```bash
sudo add-apt-repository ppa:deadsnakes/ppa
sudo apt-get update
```

Check if Python 3.9 is available by running

```bash
apt list | grep python3.9
```

This will produce the below result, if you see python3.9 it means you can install it

![apt list check if python is present]({static}/images/s0022/apt_list.png)

### Step 2: Install Python 3.9
Now you can install Python 3.9 by running

```bash 
sudo apt-get install python3.9
```

Now though Python 3.9 is installed, if you check the version of your python by running `python3 --version` you will still see an older version. This is because you have two version of Python installed and you need to choose Python 3.9 as the default. 

### Step 3: Set Python 3.9 as default
To do this you need to add both versions to an alternatives by running the below

```bash
sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.6 1
sudo update-alternatives --install /usr/bin/python3 python3 /usr/bin/python3.9 2
```

Now run 
```bash
sudo update-alternatives --config python3
```

Choose the selection corresponding to Python3.9 (if not selected by default). 
![Python alternatives on linux]({static}/images/s0022/apt_list.png)

Now run `python3 --version` again and you should see the latest Python as the output

## Fix pip and disutils
Installing the new version of Python will break pip as the `disutils` for Python3.9 is missing. You will see an error similar to the below

```text
ImportError: cannot import name 'sysconfig' from 'distutils' (/usr/lib/python3.9/distutils/__init__.py)
```

Or you might also see an error stating `No module named 'distutils.util'`. 

To fix this, we need to first remove the previous version of Python by running
```bash
sudo apt remove python3.8
sudo apt autoremove
```

Next to install `disutils`, run the below
```bash
sudo apt install python3.9-distutils
```

Reinstall the latest pip by running

```bash
curl https://bootstrap.pypa.io/get-pip.py -o get-pip.py
python3.9 get-pip.py
```

## Fix Python3-apt 

The update would also break python3-apt, that will generate an error like
```text
Traceback (most recent call last):   
    File "/usr/lib/command-not-found", line 28, in <module>     
        from CommandNotFound import CommandNotFound   
    File "/usr/lib/python3/dist-packages/CommandNotFound/CommandNotFound.py", line 19, in <module>     
        from CommandNotFound.db.db import SqliteDatabase   
    File "/usr/lib/python3/dist-packages/CommandNotFound/db/db.py", line 5, in <module>     
        import apt_pkg ModuleNotFoundError: No module named 'apt_pkg'
```

To fix this first remove the current version of python3-apt by running
```bash
sudo apt remove --purge python3-apt
```

Then do some cleanup
```bash
sudo apt autoremove
```

<!--
Finally install python3-apt by running
```bash
sudo apt install python3-apt
```
-->

It is complicated, but this is how you update Python to latest version