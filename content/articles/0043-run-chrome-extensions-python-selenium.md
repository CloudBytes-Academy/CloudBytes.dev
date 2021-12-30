Title: Run Chrome extensions with Python Selenium on AWS Lambda
Date: 2021-12-25
Category: Snippets
Tags: python, aws, selenium
Author: Rehan Haider
Summary: A detailed guide to use Selenium and Chrome with extensions on AWS Lambda
Keywords: aws, lambda, selenium, python, chrome, chromedriver



I earlier wrote about how to [run Chrome AWS Lambda using Python and Selenium webdriver]({filename}0019-run-selenium-in-aws-lambda.md), but running Chrome with extensions is a different ball game. So let's unpack the problem first, and then we'll get to the solution. 

Chrome, when started in headless mode will start without browser UI, it is just a webpage viewport sans anything else. 

![chrome-comparison]({static}/images/s0043/chrome-comparison.png)

> You can take a screenshot by running the command `google-chrome --headless --disable-gpu --screenshot https://cloudbytes.dev`


## Why your Chrome extensions are not working using Selenium in headless mode?

As demonstrated above, because your Chrome is running in headless mode, it will not have any UI and thus no extensions are loaded. This is not a bug, it is a feature as explained here on [chromium website](https://bugs.chromium.org/p/chromium/issues/detail?id=706008).

So to be able to load extensions, you need to run Chrome in non-headless mode. Which is problematic considering AWS Lambda doesn't have a display so you cannot really run Chrome GUI. 

**Or can you** 
Yes you can, of course you can, I'll show you how.


## How to run Chrome with extensions in AWS Lambda

For this example, a reader asked to try to run [GoFullPage](https://chrome.google.com/webstore/detail/gofullpage-full-page-scre/fdpohaocaechififmbbbbbknoalclacl?hl=en) extension in AWS Lambda. This extension relies on user-interaction thus presents a complex problem.

Let's try and break this problem down.

1. Extensions do not work in Chrome headless mode, thus you need to run Chrome in non-headless mode, i.e. with a display
2. AWS Lambda doesn't have a display, so you need a virtual display to run Chrome GUI. We will use `Xvfb` with `pyvirtualdisplay` wrapper to do this
3. The extension relies on user-interaction, but, Selenium cannot be used for these interactions since it restricts user interaction to DOM elements and doesn't allow sending hotkeys to browser. Thus we will need to create a virtual keyboard to send keys to browser. In this case I chose to use `pyautogui`
4. PyAutoGUI is a Python wrapper around the `Xlib` library and relies on several linux packages that are NOT AVAILABLE on AWS Lambda's default image that uses Amazon Linux 2 (derivative of CentOS) . So we need to use Debian based image on AWS Lambda to run this example. I chose to use Python Buster image.

Now with that out of the way, let's get started.

## Setting up the development environment

**Step 1**: You need [VSCode](https://code.visualstudio.com/download), [Docker Desktop](https://www.docker.com/products/docker-desktop), and WSL2 as the development environment. You can find instructions on how to setup WSL2 [here]({filename}0039-install-wsl2.md)


**Step 2**: Start the VScode editor

a. Start the terminal and login to WSL2 by running `wsl`
b. Make a new directory `mkdir selenium-aws` and cd into it `cd selenium-aws`
c. Launch the VS Code editor by running `code .`

![start-vscode-wsl2]({static}/images/s0043/start-vscode-wsl2.gif)

**Step 3**: Reopen the folder in a devcontainer

a. While in VScode, press `Ctrl + Shift + P` to open command palette
b. Choose `Reopen in Container` from the drop down menu
c. Then click on `Show All Definitions`
d. Choose `Docker in Docker` from the drop down menu (Do not select `Docker from Docker`)
e. Leave the default selections and choose OK in the next two dialogues

![create-devcontainer]({static}/images/s0043/create-devcontainer.gif)


Next, install the following:

**Step 4**: [Install AWS CLI]({filename}0016-deploy-serverless-apps-with-aws-sam.md#install-aws-cli)

**Step 5**: [Install SAM CLI]({filename}0016-deploy-serverless-apps-with-aws-sam.md#install-aws-sam-cli)

And finally, configure AWS CLI as per below

**Step 6**: [Configure AWS & AWS CLI]({filename}0016-deploy-serverless-apps-with-aws-sam.md#configuring-aws-aws-cli)

## Running Chrome Extensions using Selenium in AWS Lambda
Unlike a [previous guide]({filename}0017-run-lambda-on-container-sam.md#create-a-new-app) we'll use a manual SAM templates to create a new Lambda app. 

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
│   ├── GoFullPage.crx
│   ├── install_chrome.sh
│   ├── install_driver.sh
│   └── requirements.txt
├── samconfig.toml
└── template.yaml
```
### a) \_\_init\_\_.py
Both the `__init__.py` files should be empty

### b) events/event.json
We will use a basic event structure that will trigger our lambda. The contents should be
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

### c) template.yaml

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
      DockerTag: python3.9-Selenium

Outputs:
  SeleniumApi:
    Description: "API Gateway endpoint URL for Prod stage for Selenium function"
    Value: !Sub "https://${ServerlessRestApi}.execute-api.${AWS::Region}.amazonaws.com/Prod/selenium/"
  SeleniumFunction:
    Description: "Selenium Lambda Function ARN"
    Value: !GetAtt Selenium.Arn
```

### d) src/Dockerfile
Our Dockerfile needs to do the following

1. Start from the python:buster image
2. Install AWS Lambda dependencies to run the Lambda function on custom image
3. Install Lambda Runtime Interface Client to implement Lambda Runtime API
4. Copy the extension, app.py and requirements.txt to the Docker image
5. Install the python dependencies
6. Install Chrome Browser
7. Install Chromedriver
8. Install Xvfb and dependencies
9. Configure Lambda Runtime API to execute the Lambda function

```Dockerfile
# Define function directory
ARG FUNCTION_DIR="/function"

FROM python:buster as build-image

# Install aws-lambda-cpp build dependencies
RUN apt-get update && export DEBIAN_FRONTEND=noninteractive

RUN apt-get install -y g++ make cmake unzip libcurl4-openssl-dev

# Include global arg in this stage of the build
ARG FUNCTION_DIR
# Create function directory
RUN mkdir -p ${FUNCTION_DIR}
# Copy function code
COPY app.py ${FUNCTION_DIR}

# Install the runtime interface client
RUN pip install \
    --target ${FUNCTION_DIR} \
    awslambdaric

# Multi-stage build: grab a fresh copy of the base image
FROM python:buster

# Include global arg in this stage of the build
ARG FUNCTION_DIR
# Set working directory to function root directory
WORKDIR ${FUNCTION_DIR}

# Copy setup & other temporary files
COPY *.sh requirements.txt GoFullPage.crx /tmp/

# Install the python dependencies
RUN pip install --upgrade pip -q
RUN pip install -r /tmp/requirements.txt -q

# Install chrome browser & chromedriver
RUN /bin/bash /tmp/install_chrome.sh
RUN /bin/bash /tmp/install_driver.sh

# Install Xvfb & dependencies
RUN apt-get install xvfb python3-tk python3-dev -y

# Copy in the build image dependencies
COPY --from=build-image ${FUNCTION_DIR} ${FUNCTION_DIR}

# Execute the Lambda function
ENTRYPOINT [ "/usr/local/bin/python", "-m", "awslambdaric" ]
CMD [ "app.handler" ]
```

### e) src/GoFullPage.crx

[Go Full Page](https://chrome.google.com/webstore/detail/gofullpage-full-page-scre/fdpohaocaechififmbbbbbknoalclacl?hl=en) is the chrome extension that we will use in this demo. 

There are many ways to download Chrome extensions, in this case I recommend running the below command

```bash
curl -L "https://clients2.google.com/service/update2/crx?response=redirect&\
os=win&arch=x64&os_arch=x86_64&nacl_arch=x86-64&prod=chromiumcrx&\
prodchannel=beta&prodversion=79.0.3945.53&lang=ru&acceptformat=crx3\
&x=id%3Dfdpohaocaechififmbbbbbknoalclacl%26installsource%3Dondemand%26uc" -o GoFullPage.crx
```

### f) src/install_chrome.sh

Next we install Chrome browser

```bash
#!/bin/bash

apt-get update && apt-get upgrade -y

echo "Download the latest Chrome .deb file..."
wget https://dl.google.com/linux/direct/google-chrome-stable_current_amd64.deb -q

echo "Install Google Chrome..."
dpkg -i google-chrome-stable_current_amd64.deb

echo "Fix dependencies..."
apt-get --fix-broken install -y

```

Make sure you make this file executable by running the following command

```bash
chmod +x src/install_chrome.sh
```

### g) src/install_driver.sh

Now we install a compatible chrome driver. The below script 

1. Gets the version of Chrome installed, 
2. Then gets the latest version of the chromedriver available, 
3. Compares if the versions are the same
4. Downloads the latest chromedriver if the version match
5. If not, it will exit with an error

If you have used the `install_chrome.sh` script to install Chrome, the versions should match. 

```bash
echo "Getting Chrome version..."
chrome_version=($(google-chrome-stable --version))
version=${chrome_version[2]}
chrome_version=${version%.*}
echo "Chrome version: ${chrome_version}"

echo "Getting latest chromedriver version"
chromedriver_version_full=$(curl "https://chromedriver.storage.googleapis.com/LATEST_RELEASE")
version=${chromedriver_version_full}
chromedriver_version=${version%.*}
echo "Chromedriver version: ${chromedriver_version}"

if [ "${chrome_version}" == "$chromedriver_version" ]; then
    echo "Compatible Chromedriver is available..."
    echo "Proceeding with installation..."
else
    echo "Compabible Chromedriver not available...exiting"
    exit 1
fi

echo "Downloading latest Chromedriver..."
mkdir -p "/opt/chromedriver/stable/"
curl -Lo "/opt/chromedriver/stable/chromedriver_linux64.zip" \
    "https://chromedriver.storage.googleapis.com/$chromedriver_version_full/chromedriver_linux64.zip"

unzip -q "/opt/chromedriver/stable/chromedriver_linux64.zip" \
    -d "/opt/chromedriver/stable/"

chmod +x "/opt/chromedriver/stable/chromedriver"
rm -rf "/opt/chromedriver/stable/chromedriver_linux64.zip"

echo "Chrome & Chromedriver installed"
```

Again, make sure you make this file executable by running the following command

```bash
chmod +x src/install_driver.sh
```

### h) src/app.py

The app.py file needs model the following user behavior 
1. Open the browser with the extension installed
2. Open `www.example.com`
3. Close extension welcome page
4. Start screenshot capture by pressing `Shift + Alt + P`
5. Navigate to the screenshot page
6. Download the screenshot to the default downloads directory by clicking on download button
7. Close the browser
8. Upload the screenshot(s) to S3

![user-behaviour]({static}/images/s0043/user-behaviour.gif)

We achive this by the following code. 

```python
# src/app.py
import time
import glob
import os
from selenium import webdriver
from selenium.webdriver.chrome.service import Service
from selenium.webdriver.common.keys import Keys
from selenium.webdriver.common.by import By
from selenium.webdriver.chrome.options import Options
from pyvirtualdisplay import Display
#from pyvirtualdisplay.smartdisplay import SmartDisplay



def handler(event=None, context=None):
    display = Display(visible=False, extra_args=[':25'], size=(2560, 1440), backend="xvfb") 
    display.start()
    print('Started Display')
    #Pyautogui requires os.environ["Display"] variable to be set. 
    import pyautogui

    chrome_options = Options()
    # Headless environment starts without browser UI so no extensions
    #chrome_options.add_argument("--headless") 
    chrome_options.add_argument("--no-sandbox")
    chrome_options.add_argument("--disable-dev-shm-usage")
    chrome_options.add_argument("--disable-gpu")
    chrome_options.add_argument("--disable-dev-tools")
    #chrome_options.add_argument("--no-zygote") #This will not load the extension
    #chrome_options.add_argument("--single-process") #Single process will break the app
    chrome_options.add_argument("window-size=2560x1440")
    chrome_options.add_argument("--remote-debugging-port=9222")
    chrome_options.add_argument("--user-data-dir=/tmp/chrome-user-data")
    chrome_options.add_extension("/tmp/GoFullPage.crx")
    download_directory = {"download.default_directory": "/tmp/"}
    chrome_options.add_experimental_option("prefs", download_directory)
    webdriver_service = Service("/opt/chromedriver/stable/chromedriver")
    browser = webdriver.Chrome(service=webdriver_service, options=chrome_options)

    browser.get("https://example.com")
    # Open Extension options
    print("Open Extension options...")
    browser.switch_to.window(browser.window_handles[1])
    browser.get("chrome-extension://fdpohaocaechififmbbbbbknoalclacl/options.html")

    # Provide Download Permission
    print("Provide Download Permission...")
    browser.find_element(By.ID, "perm-toggle").click()
    browser.find_element(By.NAME, "downloads").click()
    browser.switch_to.active_element
    time.sleep(1)
    pyautogui.press("tab")
    time.sleep(1)
    pyautogui.press("enter")

    # Close options
    print("Close options...")
    print(len(browser.window_handles)) #Expected 2
    browser.close()
    print(len(browser.window_handles)) #Expected 1
    time.sleep(1)
    # Take screenshot
    print("Take screenshot...")
    browser.switch_to.window(browser.window_handles[0])
    pyautogui.hotkey("shift", "alt", "p")
    time.sleep(5)
    print(len(browser.window_handles)) #Expected 2
    browser.switch_to.window(browser.window_handles[1])
    time.sleep(1)
    browser.find_element(By.ID, "btn-download").click()


    time.sleep(5)
    browser.quit()

    # importing earlier conflicts with selenium actions
    import boto3
    s3 = boto3.client("s3")
    BUCKET_NAME = "cloudbytes.dev" # replace with your bucket name

    for image in glob.iglob("/tmp/*.png"): 
        s3.upload_file(image, BUCKET_NAME, os.path.basename(image))

    return {"status":"success"}

```

Make sure you replace the `BUCKET_NAME` in the code with your bucket name. 


### i) src/requirements.txt
This will contain the python dependencies required for the Lambda function

```text
selenium
pyvirtualdisplay
pillow
keyboard
pyautogui
python-xlib
boto3
```

## Build & test Lambda app to run Chrome with extension

To build, just run the following command

```bash
sam build
```

This will result in a message similar to this (the build process typically takes a few minutes given your internet speed)

![sam-build-output]({static}/images/s0043/sam-build-output.png)

Finally, to test the Lambda function, run the following command

```text
sam local invoke
```

This will run the Lambda function locally and display the following output

![sam-invoke-output]({static}/images/s0043/sam-invoke-output.png)


### Check the results
Go to your AWS console and navigate to the S3 bucket that you chose in the step (i) above.

You should see the screenshot(s) that you uploaded to S3 for each test execution. 

![aws-s3-screenshots]({static}/images/s0043/aws-s3-screenshots.png)


## Deploying to AWS Lambda

Deploying to AWS Lambda is as simple as running the below

```bash
sam deploy --guided
```

This will launch a guided deployment process, you can use the following:

```text
Configuring SAM deploy
======================

        Looking for config file [samconfig.toml] :  Found
        Reading default arguments  :  Success

        Setting default arguments for 'sam deploy'
        =========================================
        Stack Name [selaws]: 
        AWS Region [us-east-1]: 
        #Shows you resources changes to be deployed and require a 'Y' to initiate deploy
        Confirm changes before deploy [y/N]: 
        #SAM needs permission to be able to create roles to connect to the resources in your template
        Allow SAM CLI IAM role creation [Y/n]: 
        #Preserves the state of previously provisioned resources when an operation fails
        Disable rollback [y/N]: 
        SeleniumFunction may not have authorization defined, Is this okay? [y/N]: y
        Save arguments to configuration file [Y/n]: 
        SAM configuration file [samconfig.toml]: 
        SAM configuration environment [default]: 
```

Now you can run the Lambda app from the AWS console. Alternatively, you can also run the Lambda function by calling the API we created by using the following command

```bash
curl https://<api-id>.execute-api.us-east-1.amazonaws.com/Prod/selenium/
```

You can get the API ID from deployment output of `sam deploy` as shown below:

![lambda-api-url]({static}/images/s0043/lambda-api-url.png)


## Final Code

The above code is available on [GitHub in this repository](https://github.com/rehanhaider/selenium-aws-chrome-extension). 