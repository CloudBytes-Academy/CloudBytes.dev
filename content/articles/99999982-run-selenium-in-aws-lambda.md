Title: Run Selenium in AWS Lambda for UI testing
Date: 2021-08-12
Modified: 2022-06-30
Category: Snippets
Tags: aws, selenium, python
Author: Rehan Haider
Summary: A guide about how to run selenium using headless chrome & chromium webdriver to automate UI testing
Keywords: Python, AWS, CloudFormation, lambda, serverless, docker, container, sam


[TOC]

**[LAST UPDATED: 29-July-2022]**

Let me begin by expressing my frustration 😡😡😡 with the fact that AWS doesn't have a pre-configured selenium image for **Lambda** on their public ECR marketplace. [Selenium](https://selenium.dev) is the go-to tool for UI testing and for building many kinds of bots but running it on **Lambda** is complicated. 

The easiest method is to use [SAM CLI for **Docker for Lambda**]({filename}99999983-run-lambda-on-container-sam.md) to create an image with **Selenium**, **Chrome / Chromium headless** and **webdriver**, but given the way Lambda restricts the environment making it work on Selenium is quite difficult but not impossible. 

In this tutorial I will provide a guide on how to do exactly that. 

## Prerequisites

Follow [these instructions to setup your development environment]({filename}/aws/00000100-setting-up-dev-env.md).

It will guide you to install and configure AWS CLI & SAM CLI.

## Create the app

Follow the instructions in [this guide to create Lambda with Docker]({filename}99999983-run-lambda-on-container-sam.md#create-a-new-app).

Your folder structure should look like below. 
```
.
├── README.md
├── __init__.py
├── events
│   └── event.json
├── hello_world
│   ├── Dockerfile
│   ├── __init__.py
│   ├── app.py
│   └── requirements.txt
├── template.yaml
└── tests
    ├── __init__.py
    └── unit
        ├── __init__.py
        └── test_handler.py
```

## Customising the app

First, change the name of `hello-world` directory to `src`.

### __init__.py
Both the `__init__.py` files should be empty

### Events: events/event.json
Leave the contents of the `event.json` file unchanged.

### Application: src/app.py
We write a simple Python program that uses selenium webdriver to scape a website. 

Change the contents of the file to below. 

```python
## Run selenium and chrome driver to scrape data from cloudbytes.dev
import time
import os.path
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options



def handler(event=None, context=None):
    chrome_options = webdriver.ChromeOptions()
    chrome_options.binary_location = "/opt/chrome/stable/chrome"
    chrome_options.add_argument("--headless")
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--disable-dev-tools")
    chrome_options.add_argument("--no-zygote")
    chrome_options.add_argument("--single-process")
    chrome_options.add_argument("window-size=2560x1440")
    chrome_options.add_argument("--user-data-dir=/tmp/chrome-user-data")
    chrome_options.add_argument("--remote-debugging-port=9222")
    chrome_options.add_argument("--user-data-dir=/tmp/chrome-user-data")
    chrome = webdriver.Chrome("/opt/chromedriver/stable/chromedriver", options=chrome_options)
    chrome.get("https://cloudbytes.dev/")
    description = chrome.find_element(By.NAME, "description").get_attribute("content")
    
    return description
```
### Dependencies: src/requirements.txt

Capture the app dependencies in `requirements.txt`
```
selenium
requests
pandas
```
### Dockerfile: src/Dockerfile

Change the contents of the file to below.


```Dockerfile
FROM public.ecr.aws/lambda/python:3.9 as base


# Hack to install chromium dependencies
RUN yum install -y -q unzip
RUN yum install -y https://dl.google.com/linux/direct/google-chrome-stable_current_x86_64.rpm


# Install Chromium
COPY install-browser.sh /tmp/
RUN /usr/bin/bash /tmp/install-browser.sh

# Install Python dependencies for function
COPY requirements.txt /tmp/
RUN pip install --upgrade pip -q
RUN pip install -r /tmp/requirements.txt -q

COPY app.py ./

CMD [ "app.handler" ]
```

### Script to install browser: src/install-browser.sh
Create a file at `src/install-browser.sh`. We will use a simple shell script to install the latest Chrome and Chrome webdriver.

```bash
#!/usr/bin/bash

declare -A chrome_versions

# Enter the list of browsers to be downloaded
### Using Chromium as documented here - https://www.chromium.org/getting-involved/download-chromium
chrome_versions=( ['89.0.4389.47']='843831' )
chrome_drivers=( "89.0.4389.23" )
#firefox_versions=( "86.0" "87.0b3" )
#gecko_drivers=( "0.29.0" )

# Download Chrome
for br in "${!chrome_versions[@]}"
do
    echo "Downloading Chrome version $br"
    mkdir -p "/opt/chrome/stable"
    curl -Lo "/opt/chrome/stable/chrome-linux.zip" \
    "https://www.googleapis.com/download/storage/v1/b/chromium-browser-snapshots/o/Linux_x64%2F${chrome_versions[$br]}%2Fchrome-linux.zip?alt=media"
    unzip -q "/opt/chrome/stable/chrome-linux.zip" -d "/opt/chrome/stable/"
    mv /opt/chrome/stable/chrome-linux/* /opt/chrome/stable/
    rm -rf /opt/chrome/stable/chrome-linux "/opt/chrome/stable/chrome-linux.zip"
done

# Download Chromedriver
for dr in ${chrome_drivers[@]}
do
    echo "Downloading Chromedriver version $dr"
    mkdir -p "/opt/chromedriver/stable/"
    curl -Lo "/opt/chromedriver/stable//chromedriver_linux64.zip" \
    "https://chromedriver.storage.googleapis.com/$dr/chromedriver_linux64.zip"
    unzip -q "/opt/chromedriver/stable//chromedriver_linux64.zip" -d "/opt/chromedriver/stable/"
    chmod +x "/opt/chromedriver/stable/chromedriver"
    rm -rf "/opt/chromedriver/stable/chromedriver_linux64.zip"
done

echo "Chrome & Chromedriver installed"
```

Then run the below command to make the script executable.

```bash
chmod +x src/install-browser.sh
```

### template.yaml
Change the contents to below. Based on the complexity of your app, you may need to increase the memory and timeout values under Globals:Function.


```yaml
AWSTemplateFormatVersion: '2010-09-09'
Transform: AWS::Serverless-2016-10-31
Description: >
  python3.9

  Sample SAM Template for selenium

Globals:
  Function:
    Timeout: 120
    MemorySize: 128 # Adjust as per your app needs

Resources:
  SeleniumFunction:
    Type: AWS::Serverless::Function 
    Properties:
      PackageType: Image
      Architectures:
        - x86_64
      Events:
        Selenium:
          Type: Api 
          Properties:
            Path: /selenium
            Method: get
    Metadata:
      Dockerfile: Dockerfile
      DockerContext: ./src
      DockerTag: python3.9-v1

Outputs:
  SeleniumApi:
    Description: "API Gateway endpoint URL for Prod stage for Seleniumc function"
    Value: !Sub "https://${ServerlessRestApi}.execute-api.${AWS::Region}.amazonaws.com/Prod/selenium/"
  SeleniumFunction:
    Description: "Selenium Lambda Function ARN"
    Value: !GetAtt SeleniumFunction.Arn
  SeleniumFunctionIamRole:
    Description: "Implicit IAM Role created for Selenium function"
    Value: !GetAtt SeleniumFunctionRole.Arn
```

## Build & test the app

To build the app run, 
```bash
sam build
```

To test run
```bash
sam local invoke
```
### Output
You should see something similar to below depending on the URL you scraped

![sam local invoke success]({static}/images/99999982-sam_local_invoke_success.png)


## Deploy the app

To deploy the app for the first time run,

```bash
sam deploy --guided
```

This will start the interactive deployment to Lambda. You can use options as shown below.

![sam deploy guided]({static}/images/99999982-sam-deploy-guided.png)

This will also create a `samconfig.toml` file that will contain these configurations.

Next time after you build the app, just run `sam deploy` to deploy the app.

After a successful deployment, you should see something similar to below. Note the API URL in the output at the bottom.

![99999982-sam-deploy-success]({static}/images/99999982-sam-deploy-success.png)

## Test the app

Using the API URL from the output, you can test the app by running

```bash
curl -X GET <API URL>
```


## Using the GitHub repository directly

You need AWS SAM CLI installed and AWS credentials configured.

Open your terminal and run the following command to clone the [repository](https://github.com/rehanhaider/selenium-in-aws-lambda).

```git
git clone https://github.com/rehanhaider/selenium-in-aws-lambda.git
```

Navigate to the app directory. 

```bash
cd selenium-in-aws-lambda/selenium
```

Build the app.

```bash
sam build
```

Test the app locally.

```bash
sam local invoke
```

Deploy the app to AWS.

```bash
sam deploy --guided
```
