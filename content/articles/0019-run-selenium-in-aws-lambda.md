Title: Run Selenium in AWS Lambda for UI testing
Date: 2021-08-12
Category: Snippets
Tags: python, aws
Author: Rehan Haider
Summary: A guide about how to run selenium using headless chrome & chromium webdriver to automate UI testing
Keywords: Python, AWS, CloudFormation, lambda, serverless, docker, container, sam


[TOC]

Let me begin by expressing my frustration 😡😡😡 with the fact that AWS doesn't have a pre-configured selenium image for Lambda on their public ECR marketplace. Selenium is the go-to tool for UI testing and for building many kinds of bots but running it on Lambda is complicated. 

The easiest method is, as I explained [earlier]({filename}0017-run-lambda-on-container-sam.md), to to use Docker for Lambda to create an image with selenium, chrome / chromium headless and webdriver, but given the way Lambda restricts the environment making it work on selenium is quite difficult but not impossible. 

In this tutorial I will provide a guide on how to do exactly that. 

## Using the GitHub repository directly

You need [VSCode](https://code.visualstudio.com/download) & [Docker for Desktop](https://www.docker.com/products/docker-desktop) installed for this to work. On Windows systems, you will need to configure WSL2 as well. 

After that open VSCode, press `Ctrl+P`, type `Remote-Containers` and choose `Clone a repository in container volume`. When prompted paste the link to the following GitHub repository. 

```http
https://github.com/rehanhaider/selenium-in-aws-lambda.git
```


## Create the app

Unlike the [previous guide]({filename}0017-run-lambda-on-container-sam.md#create-a-new-app) we'll use a manual cloudformation template to create a new Lambda app. 

Your folder structure should look like below

```
.
├── __init__.py
├── events
│   └── event.json
├── src
│   ├── __init__.py
│   ├── app.py
│   ├── Dockerfile
│   └── requirements.txt
├── samconfig.toml
└── template.yaml
```
### __init__.py
Both the `__init__.py` files should be empty

### Events: events/event.json
The contents should be
```json
{
    "body": "{\"message\": \"hello world\"}",
    "resource": "/{proxy+}",
    "path": "/path/to/resource",
    "httpMethod": "POST",
    "isBase64Encoded": false,
    "queryStringParameters": {
        "foo": "bar"
    },
    "pathParameters": {
        "proxy": "/path/to/resource"
    },
    "stageVariables": {
        "baz": "qux"
    },
    "headers": {
        "Accept": "text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8",
        "Accept-Encoding": "gzip, deflate, sdch",
        "Accept-Language": "en-US,en;q=0.8",
        "Cache-Control": "max-age=0",
        "CloudFront-Forwarded-Proto": "https",
        "CloudFront-Is-Desktop-Viewer": "true",
        "CloudFront-Is-Mobile-Viewer": "false",
        "CloudFront-Is-SmartTV-Viewer": "false",
        "CloudFront-Is-Tablet-Viewer": "false",
        "CloudFront-Viewer-Country": "US",
        "Host": "1234567890.execute-api.us-east-1.amazonaws.com",
        "Upgrade-Insecure-Requests": "1",
        "User-Agent": "Custom User Agent String",
        "Via": "1.1 08f323deadbeefa7af34d5feb414ce27.cloudfront.net (CloudFront)",
        "X-Amz-Cf-Id": "cDehVQoZnx43VYQb9j2-nvCh-9z396Uhbp027Y2JvkCPNLmGJHqlaA==",
        "X-Forwarded-For": "127.0.0.1, 127.0.0.2",
        "X-Forwarded-Port": "443",
        "X-Forwarded-Proto": "https"
    },
    "requestContext": {
        "accountId": "123456789012",
        "resourceId": "123456",
        "stage": "prod",
        "requestId": "c6af9ac6-7b61-11e6-9a41-93e8deadbeef",
        "requestTime": "09/Apr/2015:12:34:56 +0000",
        "requestTimeEpoch": 1428582896000,
        "identity": {
            "cognitoIdentityPoolId": null,
            "accountId": null,
            "cognitoIdentityId": null,
            "caller": null,
            "accessKey": null,
            "sourceIp": "127.0.0.1",
            "cognitoAuthenticationType": null,
            "cognitoAuthenticationProvider": null,
            "userArn": null,
            "userAgent": "Custom User Agent String",
            "user": null
        },
        "path": "/prod/path/to/resource",
        "resourcePath": "/{proxy+}",
        "httpMethod": "POST",
        "apiId": "1234567890",
        "protocol": "HTTP/1.1"
    }
}
```

### Application: src/app.py
A simple Python program that uses selenium webdriver to scape a website

```python
from selenium import webdriver


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
    chrome.get("https://cloudbytes.dev")
    return chrome.find_element_by_xpath("//html").text
```
Capture the app dependencies in `requirements.txt`
```
selenium
requests
pandas
```
### Dockerfile: src/Dockerfile

```Dockerfile
FROM public.ecr.aws/lambda/python:3.8 as base

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

### Script to install browser
We will use a simple shell script to install two compatible chromium & chromium webdrivers

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
    "https://www.googleapis.com/download/storage/v1/b/chromium-browser-snapshots/o/\
    Linux_x64%2F${chrome_versions[$br]}%2Fchrome-linux.zip?alt=media"
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
    unzip -q "/opt/chromedriver/stable//chromedriver_linux64.zip" \
    -d "/opt/chromedriver/stable/"
    chmod +x "/opt/chromedriver/stable/chromedriver"
    rm -rf "/opt/chromedriver/stable/chromedriver_linux64.zip"
done

echo "Chrome & Chromedriver installed"
```


### template.yaml

```yaml
AWSTemplateFormatVersion: "2010-09-09"
Transform: AWS::Serverless-2016-10-31
Description: >
  python3.8
  Selenium on Lambda
Globals:
  Function:
    Timeout: 120

Resources:
  SeleniumFunction:
    Type: AWS::Serverless::Function
    Properties:
      PackageType: Image
      Events:
        Selenium:
          Type: Api 
          Properties:
            Path: /twitter
            Method: get
    Metadata:
      Dockerfile: Dockerfile
      DockerContext: ./src
      DockerTag: python3.8-Selenium

Outputs:
  SeleniumApi:
    Description: "API Gateway endpoint URL for Prod stage for Selenium function"
    Value: !Sub "https://${ServerlessRestApi}.execute-api.${AWS::Region}.amazonaws.com/Prod/selenium/"
  SeleniumFunction:
    Description: "Selenium Lambda Function ARN"
    Value: !GetAtt Selenium.Arn
```

### samconfig.toml
Finally create the `AWS SAM CLI` configuration in `samconfig.toml`

Before creating this file you will need to create a ECR repository and get the URL by running this command and copy the `repositoryUri` from the resulting output
```bash
aws ecr create-repository --repository-name selenium --image-scanning-configuration scanOnPush=true
```


```toml
version = 0.1
[default]
[default.deploy]
[default.deploy.parameters]
stack_name = "selenium"
s3_bucket = "aws-sam-cli-managed-default-samclisourcebucket-10au7y56c11fr"
s3_prefix = "selenium"
region = "us-east-1"
capabilities = "CAPABILITY_IAM"
image_repositories = ["SeleniumFunction=231871475778.dkr.ecr.us-east-1.amazonaws.com/plugins"]
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

![sam local invoke success]({static}/images/s0021/sam_local_invoke_success.png)


## Deploy the app

If you have configured the `template.yaml` correctly, just run

```bash
sam deploy
```

This will deploy it to Lambda. 
