Title: All you need to know about creating AWS Lambda Functions using Python
Date: 2021-08-12
Category: Articles
Tags: python, aws
Author: Rehan Haider
Summary: A detailed tutorial on how to create complex AWS Lambda functions using Python on AWS
Keywords: Lambda, Docker, AWS, Python
Status: hidden

[TOC]

AWS changed the game with the launch of Lambda in 2015, since then all Cloud Service Providers (CSPs) have had to copy the Lambda concept to stay relevant. 

But even today, tutorials Lambda just print "Hello, World!"  and complex tutorials are far and few. In this tutorial, I will attempt to start from basic (Hello, world!) and work up towards a much more complex example using AWS Cloud Development Kit (CDK)

## Introduction to AWS Lambda 

The easiest way to understand Lambda is that you can execute a function(s) using Lambda without the need for any server or installation of any software, but the key advantage of Lambda is, you only pay for the time you use it for. 

So if my application was a simple reminder app that sends an email every morning 8am to work-out, I could just write a simple Python program that send an email and invoke the Lambda function automatically at 8am in the morning and pay less than a few cents for the entire month. 

### How to create AWS Lambda functions? 

There are several way to create an AWS Lambda function using official AWS resources. 

E.g. depending on the use case you can use any of the below

1. **AWS Console**: The management control using https://console.aws.amazon.com website
2. **AWS CLI**: Use [AWS CLI](https://aws.amazon.com/cli/) to create Lambda function from command line
3. **AWS SAM CLI**: [SAM](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/serverless-sam-cli-install.html) is a framework to build, test, and deploy serverless tool 
4. **AWS Chalice**: [Chalice](https://aws.github.io/chalice/) is a Python based framework to build serverless app that uses a Flask-like syntax
5. **AWS CDK**: Short for AWS [Cloud Development Kit](https://docs.aws.amazon.com/cdk/latest/guide/getting_started.html) that is a full-fledged cloud development toolkit

### What languages & deployments are supported in AWS Lambda

While AWS Lambda Supports several programming languages including Python, NodeJS, Go, Ruby, Java, & .NET Core, our tutorial will be using Python only.

Additionally, Lambda can be deployed in three methods
1. **Plain Lambda function**: That uses standard libraries bundled with runtime. E.g. in Python libraries such as `os`, `time`, `csv`, are part of the standard library and available by default
2. **Lambda Layers**: Basically creating a zip of non-standard libraries and uploading it as a layer. E.g. libraries such as `requests`, `pandas`, etc are not available by default and the binaries needs to be uploaded for the Lambda function to work
3. **Lambda on Container**: Use a `Dockerfile` to create your own Lambda execution environment.

## [Part 1] Create a simple Lambda function using AWS Console

Login to the [AWS Console ](https://console.aws.amazon.com) and search for Lambda in the search bar then navigate to it. 

Then click on `Create function`, choose `Author from scratch`. 
Under basic information, give the `Function name` as `hello_world`, select the `Runtime` as Python 3.9 (Latest). 

Leave everything else per defaults, then click on `Create Function` at the bottom.
![AWS Lambda Function create python 3.9 function]({static}/images/s0021/aws_console_lambda.png)

You should now see Lambda Function. Scroll down below and click on Code tab to see the code

```python
import json

def lambda_handler(event, context):
    # TODO implement
    return {
        'statusCode': 200,
        'body': json.dumps('Hello from Lambda!')
    }
```
To test this Lambda app, click on `Test` to bring up the test event configuration, give the `Event name` as `test_event` then scroll down to bottom and click on `Create`. 

Now finally, click on `Test` again to test the function, you should see a result such as below. 
![AWS Hello test]({static}/images/s0021/lambda_hello_test.png)

## [Part 2] Create a hello world app with SAM CLI

You need SAM CLI to be installed for this to work. Read the [setting up dev environmnt section of this guide]({filename}0016-deploy-serverless-apps-with-aws-sam.md#setting-up-the-development-environment) to configure the development environment.

Create a new directory named `lambda-sam-tutorial` and move to the directory

```bash
mkdir lambda-sam-tutorial && cd lambda-sam-tutorial
```

Then initialise a new SAM project by running

```bash
sam init
```

When prompted choose as per below
![initialise aws sam cli lambda applicaiotn]({static}/images/s0021/sam_init.png)

On successfull completion you should see a success message similar to below
```text
    -----------------------
    Generating application:
    -----------------------
    Name: sam-app
    Runtime: python3.9
    Dependency Manager: pip
    Application Template: hello-world
    Output Directory: .

    Next steps can be found in the README file at ./sam-app/README.md
```

Now navigate to the newly created `sam-app` directory
```bash
cd sam-app
```

And build the sample app by running

```bash
sam build
```

You will a message similar to below on successfult completion
![SAM CLI Build success message]({static}/images/s0021/sam_build.png)

To test this app locally, run
```text
sam local invoke
```

![SAM CLI local invoke success]({static}/images/s0021/sam_local_invoke_success.png)


Now finally deploy it to AWS by running

```bash
sam deploy --guided
```
> NOTE: `--guided` flag is only needed when deploying the app for the first time. 

You can leave all answers as default, except when prompted for *"HelloWorldFunction may not have authorization defined, Is this okay?"* select *Y* as show below

![sam deploy guided]({static}/images/s0021/sam_deploy_guided.png)

After that it will go through several automated steps but end with a summary similar to below
![sam deploy to aws cloud]({static}/images/s0021/sam_deploy.png)

Now you can go back to console and test the Lambda Functions using the instructions from earlier.

### What happened here? 
This was an extremely simple example where a Lambda function was invoked by a Get request to API Gateway (the value of the second block in the diagram above) and returned a simple hello message. 

The workflow of how this worked is show below. 



