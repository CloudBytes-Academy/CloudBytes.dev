Title: Run Jupyter Notebooks with Python Virtual Environments
Date: 2022-10-10
Category: Snippets
Tags: python, jupyter
Author: Rehan Haider
Summary: Create an isolated Python virtual environment and use it with Jupyter Notebooks
Keywords: jupyter, notebook, virtual environment, python, venv, conda, ipykernel



Jupyter Notebooks are a great explaratory tool for writing code and testing out ideas. They are specially useful for data science and machine learning projects. However, like most Python projects, Jupyter Notebooks and dependencies can also get messy and hard to manage. One way to keep things organized is to use Python virtual environments. 

In this guide, we will see how to create a virtual environment and use it with Jupyter Notebooks.

## Install Jupyter Notebook

In case you want to install Jupyter Notebook from scratch, follow the steps in this [guide to install & run Jupyter Notebook]({filename}99999958-run-jupyter-from-terminal.md).

## Create a virtual environment

We will use `venv` to create a virtual environment. You can also use `conda` if you prefer.

A) Ensure you have `venv` installed. If not, run the following command:

```bash
sudo apt install python3-venv
```

B) Create a new virtual environment. We will call it `.env`. 

```bash
python3 -m venv .env
```

C) Activate the virtual environment. 

```bash
source .env/bin/activate
```

## Add the virtual environment to Jupyter Notebooks

A) Install `ipykernel` in the virtual environment. 

```bash
pip install ipykernel
```

B) Add the virtual environment to kernel list

```bash
python3 -m ipykernel install --user --name=.env
```

C) Start the notebook and select the virtual environment from the kernel list.

```bash
jupyter notebook
```

You should see the `.env` kernel in the list when you create a new notebook.

![Jupyter Notebook with virtual environment]({static}/images/99999955-01-list-of-kernel.png)