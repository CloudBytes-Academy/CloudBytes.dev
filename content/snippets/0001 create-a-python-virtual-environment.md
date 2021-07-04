Title: Create a Python virtual environment using venv
Date: 2021-07-04
Category: Snippets
Tags: python
Author: Rehan Haider
Summary: A quick guide to why you need a virtual environment, how to create, activate and manage
Keywords: Python, venv, virtual environment, pip, virtualenv

Python is a popular and extremely versatile language, which means it is used by many developers in innumerably diverse ways. This is made possible by the plethora of Python packages published on [PyPi](https://pypi.org/) and many others. There are so many Python packages that you almost certainly can find a package to do something, as illustrated by my favourite web-comic, [xkcd](https://xkcd.com/353/).

![](https://imgs.xkcd.com/comics/python.png)

This is made possible by building packages that depends on other packages, e.g. a very popular library used by data science professionals, [Pandas](https://pandas.pydata.org/), uses and builds on top of 3 other packages, Numpy, python-dateutil, and pytz. 

## The problem

But this diversity could also create problems for developers due to conflicts in the dependencies of multiple libraries, e.g. installing Pandas ends up installing 10+ other packages due. This could also cause conflicts between versions of dependencies. 

## Python Virtual Environment

This is where virtual environments can help. You can create different instances of Python specific for the application you're building without them conflicting with each other. 

![Python virtual environments]({static}/images/s0001/python-virtual-environment.webp) 

### Create a virtual environment

Navigate to the folder that you want to place the virtual environment in and run `venv` module as shown below 👇🏽

```bash
python3 -m venv new-env
```

> `venv` is the recommended module for managing virtual environments now and `virtualenv` has been deprecated by Python 

This will create folder named `new-env` and place the virtual environment inside it including the Python interpreter, the standard library along with other supporting files. 

### Activate the virtual environment

After creating the virtual environment, you will need to activate it to be able to use it

On Windows, run:

```powershell
new-env\Scripts\activate
```

On Unix or MacOS, run:

```bash
source tutorial-env/bin/activate
```

### Use the virtual environment

Once the virtual environment has been created, you will notice `(new-env)` in the terminal prompt you are using. 

You can install any package using

```bash
python3 -m pip install <package-name>
```

If you have added the Python directory to path, you also use the below 

```bash
pip install <package-name>
```

### Deactivate the virtual environment

To deactivate, simply run

```bash
deactivate
```

