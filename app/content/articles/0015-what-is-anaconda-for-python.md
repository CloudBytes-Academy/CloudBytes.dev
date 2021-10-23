Title: What is Anaconda for Python?
Date: 2021-08-01
Category: Snippets
Tags: python
Author: Rehan Haider
Summary: A short introduction to Anaconda for Python, how to configure and use Anaconda.
Keywords: Python, Anaconda


Anaconda is a Python distribution platform. What that means is Anaconda takes the core Python and packages it along with some utilities pre-configured targeted at data science / machine learning applications. 

This makes it easy for developers who are building applications that rely on many popular data science python packages such as Numpy, Pandas, etc. to start working as soon as Anaconda is installed. 

## Why is Anaconda needed?

If you happen to download and install Python from [python.org](https://python.org) website, by default it comes with only the standard python libraries. 

So developers need to download additional libraries using tools such as `pip` or similar package managers. And if you have too many of them, the packages many a times conflict with each other. Python tries to solve this by using [venv]({filename}0001-create-a-python-virtual-environment.md) which is largely a command line utility. 

An alternative approach is using Anaconda which has a GUI and its `conda` package manager. But the key appeal of Anaconda is its dependency management whereby for any environment, it will ensure there are not package conflicts. 

Additionally, Anaconda comes with multiple additional SDKs bundled together to make development easier such as Jupyter, SciPy, etc. 

![Anaconda bundle]({static}/images/s0015/anaconda.png)

## How to install Anaconda

To install Anaconda, just go to its [Individual Edition](https://www.anaconda.com/products/individual) page and download it for your OS then run the executable to install.

Anaconda Individual Edition is free of cost but is limited for use by individuals and not organisations. For organisations, there are several other editions which have their own license fee.


