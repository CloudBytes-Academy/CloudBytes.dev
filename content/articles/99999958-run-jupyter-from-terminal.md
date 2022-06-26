title: Running Jupyter Notebook from Terminal
Date: 2022-06-26
Category: Snippets
Tags: python
Author: Rehan Haider
Summary: How to install, and run Jupyter Notebook from Terminal
Keywords: python, jupyter

In this specific scenario, we're going to run Jupyter Notebook from WSL2, however, the method can be used in any other Linux environment.


## Install Jupyter Notebook

To do so, we will need to

1. [Update the packages to latest](#update-system-packages)
2. [Ensure Python is installed](#check-if-python-is-installed)
3. [Ensure pip is installed](#check-if-pip-is-installed)
4. Install Jupyter Notebook & dependencies
5. Run Jupyter Notebook
6. Open the notebook in a browser window


### Update system packages

Run the following command in the terminal to update the system packages:

```bash
sudo apt update && sudo apt upgrade -y
```

### Check if Python is installed

Run the below to check the Python version:

```bash
python3 --version
```

If you get an error, then you need to install Python by running the following command:

```bash
sudo apt install python3 -y
```

### Check if pip is installed

Run the below to check the pip version:

```bash
python3 -m pip --version
```
If you get an error, then you need to install pip by running the following command:

```bash
sudo apt install python3-pip -y
```

If you already have pip installed, upgrade it to the latest version by running the following command:

```bash
python3 -m pip install --upgrade pip
```


### Install Jupyter Notebook & dependencies
Run the following command to install Jupyter Notebook:

```bash
python3 -m pip install jupyter
```

## Run Jupyter Notebook

Logout & login again and open the terminal.Run the following command to start Jupyter Notebook:

```bash
jupyter notebook
```

You should see a message similar to below:

![99999958-run-jupyter-notebook]({static}/images/99999958-run-jupyter-notebook.png)

Copy one of two the URLs highlighted as shown above and open it in a browser window. 
This should start the Jupyter Notebook.