Title: Run Selenium in AWS Lambda for UI testing
Date: 2021-08-12
Category: Articles
Tags: python, aws
Author: Rehan Haider
Summary: A guide about how to run selenium using headless chrome & chromium webdriver to automate UI testing
Keywords: Python, AWS, CloudFormation, lambda, serverless, docker, container, sam
Status: Hidden

[TOC]

Let me begin by expressing my frustration 😡😡😡 with the fact that AWS doesn't have a pre-configured selenium image for Lambda on their public ECR marketplace. Selenium is the go-to tool for UI testing and for building many kinds of bots but running it on Lambda is complicated. 

The easiest method is, as [I explained earlier](0017-run-lambda-on-container-sam.md),  to to use Docker for Lambda to create an image with selenium, chrome / chromium headless and webdriver, but given the way Lambda restricts the environment making it work on selenium is quite difficult but not impossible. 

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
└── template.yaml
```
### __init__.py
Both the `__init__.py` files should be empty

### Events: events/event.json
The contents should be
```json
```

### Application: src/app.py
```python
```

requirements.txt
```
```
### Dockerfile: src/Dockerfile

```Dockerfile
```

### template.yaml

```yaml
```

## Build the app


