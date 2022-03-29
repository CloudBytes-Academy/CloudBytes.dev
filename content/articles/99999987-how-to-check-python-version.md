Title: How to Install, Check Python Version and Update it
Date: 2021-07-25
Category: Snippets
Tags: python
Author: Rehan Haider
Summary: A simple guide on how to Install Python, how to check Python version installed and upgrade Python to the latest version
Keywords: Python, Install, version, upgrade, opensource

[TOC]

Python is one of the easiest languages to learn and has powerful extensibility which makes it the most popular programming loved by beginners, data-scientists, academics, and web-developers. 

![Python popular programming language]({static}/images/99999987-top-languages.png)

Part of the reason on Python's extensibility is the opensource nature of the language where community developes features, libraries, and packages. 

But that comes at the cost of [several distributions](https://wiki.python.org/moin/PythonDistributions) apart from the Official one available from [Python.org](https://python.org), each one of them optimised for different purpose, e.g.

1. **The Official CPython distribution**: The most authentic version of Python implemented in C for best performance
2. **PyPy**: Python implemented using Python, best known for its JIT
3. **Anaconda**: Targeted towards data scientists focused on resolving package conflicts 
4. **IPython**: An interactive implementation of Python upon which Jupyter and other interpreters are based upon. 

## 1. Check the version of Python installed

On Windows/Linux/MacOS, run the below command to print the version of your Python installed on the system

```powershell
python --version
```

!!! note "On some Linux / MacOS distributions where both Python 2 & Python 3 are installed, you will need to identify which one you want to check individually by  ```python3 --version```"

If you do not get the version, it means Python is not installed. To install Python, follow the instructions below.


## 2. How to install Python? 

So when you ask the question, "How to install Python", you first need to ask the question "Which version of Python to install?".

The answer, in most cases is the [Official version of Python](https://www.python.org/downloads/). 

!!! warning "Do not install Python from Microsoft Store as adding it to PATH can be problematic due to the the folder structure followed by Microsoft."

### Install the latest Python On Windows

Just go to the [downloads section on Python.org](https://www.python.org/downloads/), click on `Download Python 3.x.x` to download the latest installer. 

After that run the installer, on the first screen make sure to select "Add Python 3.x to PATH". After that you can use default selections and follow the instructions to install. 

### Install the latest Python on Linux / MacOS

You don't need to. On most Linux & MacOS distributions, Python is installed by default. 

But if you want the latest versions, follow the below instructions.

On Mac, go to [downloads section on Python.org](https://www.python.org/downloads/mac-osx/) and download the installer for the latest stable release. Run the installer and follow the instructions to install.

On Linux, just run the below (with major version) to install the latest, e.g. to install Python 3.8 run
```bash
sudo apt-get install python3.8
```
> Python version on Linux repositories are usually behind one version 


## 3. Upgrade Python version

On Windows & Mac you need to download and install the latest version again from [Python.org](https://python.org/downloads) Website. 

On Linux run the below the get the latest supported version by the Operating System.

```bash
sudo apt-get update
sudo apt-get upgrade
```
