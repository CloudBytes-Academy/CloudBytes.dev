Title: Run AWS Lambda using custom docker container
Date: 2021-08-08
Category: Articles
Tags: python, aws
Author: Rehan Haider
Summary: A short introduction to Anaconda for Python, how to configure and use Anaconda.
Keywords: Python, AWS, CloudFormation, lambda, serverless, docker, container, sam

[TOC]

I wrote about [building and deploying a AWS Lambda using SAM CLI]({filename}0016 deploy-serverless-apps-with-aws-sam.md) previously.

In this guide, we try to run a Lambda function inside a container. 

## Why run Lambda in Docker? 

For a very simple reason, Lambda runtimes are standardised environments where you can only use what they provide and they do not provide a lot. E.g. if your application required any binary to be installed you coudn't do that on Lambda. 

But in 2020 Re:invent, AWS launched [Container Image Support for Lambda](https://aws.amazon.com/blogs/aws/new-for-aws-lambda-container-image-support/) for container images up to 10 GB in size. While for this may not be important for "one-off functions", but for many use cases such as machine learning models etc, the developmental workflow typically includes Dockers and that is where it gets tricky deploying them to AWS Lambda.

## Setting up the development environment. 

You need [Docker](https://docs.docker.com/get-docker/) & [VSCode](https://code.visualstudio.com/download) to be installed on your system for this guide. Download fromt he provided links and install. 

Then follow the following steps. 

**Step 1**: Install Python using [these instructions]({filename}0013 how-to-check-python-version.md).

**Step 2**: [Install AWS CLI]({filename}0016 20deploy-serverless-apps-with-aws-sam.md#install-aws-cli)

**Step 3**: [Install SAM CLI]({filename}0016 deploy-serverless-apps-with-aws-sam.md#install-aws-sam-cli)

**Step 4**: [Configure AWS & AWS CLI]({filename}0016 deploy-serverless-apps-with-aws-sam.md#configuring-aws-aws-cli)


## Create a new app

Run the below in your terminal to create a new SAM application
```bash
sam init
```

This will start the interactive session to create your app. Choose Option as per below

```
Which template source would you like to use?
        1 - AWS Quick Start Templates
        2 - Custom Template Location
Choice: 1
What package type would you like to use?
        1 - Zip (artifact is a zip uploaded to S3)
        2 - Image (artifact is an image uploaded to an ECR image repository)
Package type: 2

Which base image would you like to use?
        1 - amazon/nodejs14.x-base
        2 - amazon/nodejs12.x-base
        3 - amazon/nodejs10.x-base
        4 - amazon/python3.8-base
        5 - amazon/python3.7-base
        6 - amazon/python3.6-base
        7 - amazon/python2.7-base
        8 - amazon/ruby2.7-base
        9 - amazon/ruby2.5-base
        10 - amazon/go1.x-base
        11 - amazon/java11-base
        12 - amazon/java8.al2-base
        13 - amazon/java8-base
        14 - amazon/dotnet5.0-base
        15 - amazon/dotnetcore3.1-base
        16 - amazon/dotnetcore2.1-base
Base image: 4

Project name [sam-app]:

Cloning from https://github.com/aws/aws-sam-cli-app-templates
```

After that you will be prompted to choose application template, choose `1 - Hello World Lambda Image Example`.

```
AWS quick start application templates:
        1 - Hello World Lambda Image Example
        2 - PyTorch Machine Learning Inference API
        3 - Scikit-learn Machine Learning Inference API
        4 - Tensorflow Machine Learning Inference API
        5 - XGBoost Machine Learning Inference API
Template selection: 1

    -----------------------
    Generating application:
    -----------------------
    Name: twitter
    Base Image: amazon/python3.8-base
    Dependency Manager: pip
    Output Directory: .

    Next steps can be found in the README file at ./twitter/README.md
```

### Understanding the SAM generated application template

First, go to the `sam-app` directory.

```bash
cd sam-app
```

You should see the following files

```
.
├── README.md
├── __init__.py
├── events
│   └── event.json
├── hello_world
│   ├── __init__.py
│   ├── app.py
│   ├── Dockerfile
│   └── requirements.txt
├── template.yaml
└── tests
```

[Compared to the standard Lambda example]({filename}0016 deploy-serverless-apps-with-aws-sam.md), this has an additional file, the `Dockerfile` that contains the instructions to build the container where the lambda will be executed. 

```Dockerfile
FROM public.ecr.aws/lambda/python:3.8

COPY app.py requirements.txt ./

RUN python3.8 -m pip install -r requirements.txt -t .

# Command can be overwritten by providing a different command in the template directly.
CMD ["app.lambda_handler"]
```

The first thing you notice is, this image is building on top of an image from [AWS's pubic container registry](https://gallery.ecr.aws/lambda/).

> !!! tip "NOTE: You can also use non-AWS images such as those based on Alpine or Debian, however, the container image must include [Lambda Runtime API](https://docs.aws.amazon.com/lambda/latest/dg/runtimes-api.html). So if you use a non-AWS image, you will need to add them manually otherwise your app will not work."

And the final line is responsible for running the `lambda_handler()` function that in defined under `twitter/hello_world/app.py`. 

## Build the project

To build the app, run the following
```bash
sam build
```
> You need Docker & Python3.8 to be installed for this to work

![Sam build success]({static}/images/s0017/sam-build-success.png)

### Test the build
To test if you application is working correctly, run
```bash
sam invoke local
```
> Again, you need Docker & Python3.8 to be installed for this to work

## Deploy the project

Before you can deploy the project, you need to deploy the custom image we created to the private ECR repository. 

First we'll create a repository by 
```bash
aws ecr create-repository --repository-name hello --image-scanning-configuration scanOnPush=true
```
This will result in an output similar to below, note the respositoryUri value from your output. 
```bash
{
    "repository": {
        "repositoryArn": "arn:aws:ecr:us-east-1:231871475778:repository/hello",
        "registryId": "231871475778",
        "repositoryName": "hello",
        "repositoryUri": "231871475778.dkr.ecr.us-east-1.amazonaws.com/hello",
        "createdAt": "2021-08-08T06:53:54+00:00",
        "imageTagMutability": "MUTABLE",
        "imageScanningConfiguration": {
            "scanOnPush": true
        },
        "encryptionConfiguration": {
            "encryptionType": "AES256"
        }
    }
}
```

Now there are three more steps that needs to be performed, but in our case, SAM CLI will do them in one go. 

These steps are (again, we don't need to do them if using SAM CLI)
1. We need to rename the tag of our docker container to push it to the repository. 
2. Login from Docker CLI to ECR repository
3. Push the image to ECR repository

All we need to do now is
```bash
sam deploy --guided
```

This will start an interactive delployment session, choose options as below (blank means leave the defaults)

```
Configuring SAM deploy
======================

        Looking for config file [samconfig.toml] :  Not found

        Setting default arguments for 'sam deploy'
        =========================================
        Stack Name [sam-app]: hello-world
        AWS Region [us-east-1]: 
        Image Repository for HelloWorldFunction: 231871475778.dkr.ecr.us-east-1.amazonaws.com/hello
          helloworldfunction:python3.8-v1 to be pushed to 231871475778.dkr.ecr.us-east-1.amazonaws.com/hello:helloworldfunction-37e1fa9d5777-python3.8-v1

        #Shows you resources changes to be deployed and require a 'Y' to initiate deploy
        Confirm changes before deploy [y/N]: 
        #SAM needs permission to be able to create roles to connect to the resources in your template
        Allow SAM CLI IAM role creation [Y/n]: 
        IPTwitterFunction may not have authorization defined, Is this okay? [y/N]: y
        Save arguments to configuration file [Y/n]: 
        SAM configuration file [samconfig.toml]: 
        SAM configuration environment [default]:
```
This will deploy your app to AWS. 