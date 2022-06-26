Title: Run selenium in Jupyter Notebook on WSL2 or Ubuntu
Date: 2022-06-26
Category: Snippets
Tags: python, selenium, wsl2, linux
Author: Rehan Haider
Summary: A guide to install, configure and run selenium in Jupyter Notebook on WSL2 or Ubuntu
Keywords: python, jupyter, selenium, terminal, wsl2, linux, ubuntu


We've seen in past how to [install and run Selenium with Python]({filename}99999966-run-selenium-wsl2.md), in this guide we will try to do the same in Jupyter Notebook on WSL2.

The instructions should be same for both WSL2 and Ubuntu.

## Install WSL2

Follow the steps in this [guide to install WSL2]({filename}99999965-install-wsl2.md).

## Install Jupyter Notebook

Follow the steps in this [guide to install & run Jupyter Notebook]({filename}99999958-run-jupyter-from-terminal.md).

## Install & configure Selenium

Run the script in this guide to automatically [install and configure Selenium]({filename}99999966-run-selenium-wsl2.md#creating-a-script-to-automate-the-process). 

You can also download [this script from GitHub](https://github.com/rehanhaider/selenium-wsl2-ubuntu)

If for some reason the script is stuck, press `Ctrl+C` to stop the script and rerun it. Sometimes, chromedriver download crashes for no reason.

## Run Selenium

A) Start the notebook and import the dependencies.

```juypter
# In [1]
## Run selenium and chrome driver to scrape data from cloudbytes.dev
import time
import os.path
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
```

B) Next, set the chrome options.

```jupyter
# In [2]
## Setup chrome options
chrome_options = Options()
chrome_options.add_argument("--headless") # Ensure GUI is off
chrome_options.add_argument("--no-sandbox")
```

C) Now, set the chromedriver and Chrome browser path. Make sure you change `cloudbytes` below to your username

```jupyter
# In [3]

# Set path to chromedriver as per your configuration
homedir = os.path.expanduser("~")
webdriver_service = Service(f"{homedir}/chromedriver/stable/chromedriver")

# Choose Chrome Browser
browser = webdriver.Chrome(service=webdriver_service, options=chrome_options)
```

D) Fetch the page.

```jupyter
# In [4]
browser.get("https://cloudbytes.dev")
```

E) Print the description

```jupyter
# In [5]

description = browser.find_element(By.NAME, "description").get_attribute("content")
print(f"{description}")
```

D) Exit the browser

```jupyter
# In [6]
browser.quit()
```