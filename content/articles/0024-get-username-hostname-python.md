Title: Get username, hostname and home directory using Python
Date: 2021-09-22
Category: Snippets
Tags: python
Author: Rehan Haider
Summary: A quick guide to fetching the username, hostname and home directory using Python on both Windows & Linux
Keywords: Python


For a variety of reason your Python app might want to know the username of the logged in user along with a few other details such as path to their home directory and their systems hostname. 

In Python, you can use use [getpass](https://docs.python.org/3/library/getpass.html) library to fetch these.

## Get the username

Run the below to get the username

```python
import getpass
username = getpass.getuser()

print(f"Hello {username}")
```
### Output
On Linux you see
![python find username linux]({static}/images/s0024/username-linux.png)

This will also work on Windows
![python find username windows]({static}/images/s0024/username-windows.png)

## Get the path to home directory

```python
import os.path

homedir = os.path.expanduser("~")
print(homedir)
```

### Output
On Linux
![python find homedir linux]({static}/images/s0024/homedir-linux.png)

And on Windows
![python find homedir windows]({static}/images/s0024/homedir-windows.png)


## Get the hostname

```python
import socket
hostname = socket.gethostname()
print(hostname)
```
### Output
On Linux
![python find hostname linux]({static}/images/s0024/hostname-linux.png)

And on Windows
![python find hostname windows]({static}/images/s0024/hostname-windows.png)
