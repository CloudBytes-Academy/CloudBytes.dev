Title: Run Selenium and Chrome on WSL2 using Python and Selenium webdriver
Date: 2021-11-11
Category: Snippets
Tags: ubuntu,selenium, wsl2, python
Author: Rehan Haider
Summary: A guide to installating, configuring and running Selenium and Chrome/Chromiums on Windows Subsystem for Linux (WSL2) and run tests using Python and Selenium webdriver.
Keywords: linux, chrome, chromium, selenium, webdriver, wsl2, ubuntu, ubuntu 20.04
slug: run-selenium-and-chrome-on-wsl2


[TOC]


[Selenium](https://www.selenium.dev/) combined with Headless [Chrome](https://developers.google.com/web/updates/2017/04/headless-chrome) is a great tool for creating automated UI tests for web applications. 
With Selenium libraries, Python can be used to create and run automated browser-based tests & tasks. 

This guide will show you how to install, configure and run Selenium and Chrome on WSL2 using Python and Selenium webdriver.
<a href="https://click.linksynergy.com/link?id=zOWbNCBDzko&offerid=1060092.1394254&type=2&murl=https%3A%2F%2Fwww.udemy.com%2Fcourse%2Fubuntu-server-fundamentals-manage-linux-server-with-ubuntu%2F"><IMG border=0 src="https://img-c.udemycdn.com/course/480x270/1394254_2eb5_6.jpg" ></a><IMG border=0 width=1 height=1 src="https://ad.linksynergy.com/fs-bin/show?id=zOWbNCBDzko&bids=1060092.1394254&type=2&subid=0" >

## Step 1: Install WSL2

On Windows 10 version 2004 or higher (Build 19041 and above) or windows 11, run the below. 

```powershell
wsl --install
```
This will take care of all the steps required, i.e.

1. Enable Windows Virtualisation Layer and WSL2
2. Update the Linux kernel to the latest version
3. Install the default Linux distribution, i.e. latest Ubuntu (Currently Ubuntu 20.04)

![Install WSL]({static}/images/s0036/install-wsl.gif)

Then type `wsl` in your terminal and press enter to login to WSL2. 

!!! warning " NOTE: All codeblocks below are formatted as multi-line commands so the entire block needs to be copy pasted and not line by line."

Ensure you go to your home directory, update the repository and any packages

**a) Change the working directory to the user home directory.**
```bash
cd "$HOME"
```

**b) Update the repository and any packages**
```bash
sudo apt update && sudo apt upgrade -y
```

## Step 2: Install latest Chrome for Linux

Chrome is not available in Ubuntu's official APT repository, so we will download the .deb directly from Google and install it. 

**a) Download the latest chrome .deb file**
```bash
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb
```

**b) Install the .deb file**
```bash
sudo dpkg -i google-chrome-stable_current_amd64.deb
```

**c) And finally, force install all the dependencies by running**
```bash
sudo apt --fix-broken install
```
> This feels a hackish way of installing the latest version of Chrome, but if someone figures out a better way, do let me know please. 

**d) Get the latest version of Chrome**
```bash
google-chrome-stable --version
```
In this case, it was `95.0.4638.69`.

![chrome-version]({static}/images/s0038/chrome-version.png)

## Step 3: Install compatible Chromedriver
To be able to run Chrome programmatically, we need to install a compatible [Chromedriver](https://chromedriver.chromium.org/home). For every version of Chrome, e.g. `95.0.4638.69`, there is a corresponding version of Chromedriver with same version number. 

**a) You can confirm the Chromedriver version**
```bash
chrome_driver=$(curl "https://chromedriver.storage.googleapis.com/LATEST_RELEASE") && \
echo "$chrome_driver"
```
![get-chrome-driver-version]({static}/images/s0038/get-chrome-driver-version.png)


**b) Download the latest Chromedriver**
```bash
curl -Lo chromedriver_linux64.zip "https://chromedriver.storage.googleapis.com/\
${chrome_driver}/chromedriver_linux64.zip"
```

**c) Install unzip**
```bash
sudo apt install unzip
```

**d) Unzip the binary file and make it executable**
```bash
mkdir -p "chromedriver/stable" && \
unzip -q "chromedriver_linux64.zip" -d "chromedriver/stable" && \
chmod +x "chromedriver/stable/chromedriver"
```


## Step 4: Configure Python and Install Selenium

Selenium webdriver is available as a Python package, but before installation we need to do some prep.

### Configure a Python virtual environment

Run `python3 --version` and note the version, e.g. in my case I get the version Python 3.8

![python-version]({static}/images/s0038/python-version.png)


Next, we need to install `venv`, choose the Python version based on what you have installed.
```
sudo apt install python3.9-venv -y
```

Then create a virtual environment
```bash
python3 -m venv .venv
```

Finally, activate the virtual environment by running 
```bash
source .venv/bin/activate
```

You should see your terminal change to the below with `(.venv)` in the prompt.

### Install Selenium

After activating the virtual environment, install Selenium using the pip command.

```bash
pip install selenium
```

>!!! tip "It is necessary to activate the Python virtual environment by running `source .venv/bin/activate` before executing the above command"


## Step 5: Run Selenium

Finally we're ready to start running our automated tests. We write a simple Python script to run Selenium and Chrome/Chromium.

Create a new folder, `selenium` and open VSCode by running the below
```bash
mkdir -p "selenium" && cd "selenium" && code .
```

**a) The Python program**

```python
"""
# Filename: run_selenium.py
"""

## Run selenium and chrome driver to scrape data from cloudbytes.dev
import time
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options

## Setup chrome options
chrome_options = Options()
chrome_options.add_argument("--headless") # Ensure GUI is off
chrome_options.add_argument("--no-sandbox")

# Set path to chromedriver as per your configuration
webdriver_service = Service("/home/cloudbytes/chromedriver/stable/chromedriver")

# Choose Chrome Browser
browser = webdriver.Chrome(service=webdriver_service, options=chrome_options)

# Get page
browser.get("https://cloudbytes.dev")

# Extract description from page and print
description = browser.find_element(By.NAME, "description").get_attribute("content")
print(f"{description}")

#Wait for 10 seconds
time.sleep(10)
browser.quit()
```

**b) Run the program**

Go back to your terminal and type `python3 selenium/run_selenium.py`

![run-selenium]({static}/images/s0038/run-selenium.png)


## Creating a script to automate the process

We can merge the above steps to create a simple bash script to help you automate this entire process. Save this to a file named `install-selenium.sh` and then make it executable by running `chmod +x install-selenium`.


```bash
#!/usr/bin/bash

echo "Changing to home directory..."
pushd "$HOME"

echo "Update the repository and any packages..."
sudo apt update && sudo apt upgrade -y

echo "Install prerequisite packages..."
sudo apt install wget curl unzip -y

echo "Download the latest Chrome .deb file..."
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb

echo "Install Google Chrome..."
sudo dpkg -i google-chrome-stable_current_amd64.deb

echo "Fix dependencies..."
sudo apt --fix-broken install -y

chrome_version=($(google-chrome-stable --version))
echo "Chrome version: ${chrome_version[2]}"

chromedriver_version=$(curl "https://chromedriver.storage.googleapis.com/LATEST_RELEASE")
echo "Chromedriver version: ${chromedriver_version}"

if [ "${chrome_version[2]}" == "$chromedriver_version" ]; then
    echo "Compatible Chromedriver is available..."
    echo "Proceeding with installation..."
else
    echo "Compabible Chromedriver not available...exiting"
    exit 1
fi

echo "Downloading latest Chromedriver..."
curl -Lo chromedriver_linux64.zip "https://chromedriver.storage.googleapis.com/${chromedriver_version}/chromedriver_linux64.zip"

echo "Unzip the binary file and make it executable..."
mkdir -p "chromedriver/stable"
unzip -q "chromedriver_linux64.zip" -d "chromedriver/stable"
chmod +x "chromedriver/stable/chromedriver"

echo "Install Selenium..."
python3 -m pip install selenium

popd
```

Alternatively, this script is also available on [GitHub as a repository](https://github.com/rehanhaider/selenium-wsl2-ubuntu.git).
