Title: How to create a Lambda function in a ECR Docker image using AWS CDK in Python
Date: 2024-12-06
Category: AWS Academy
Series: AWS CDK
series_index: 1040
Tags: aws, cdk, python
Author: Rehan Haider
Summary: This article provides a walkthrough on how to deploy an AWS Lambda function using a AWS provided ECR Docker image with AWS CDK in Python
Keywords: lambda, cdk, docker, python, aws, ecr



In previous posts we looked at how to create using AWS CDK:

1. [Default Lambda function]({filename}50002000-cdk-fn-create-lambda.md), 
2. [Lambda function with Python dependencies using a Lambda layer]({filename}50002020-cdk-fn-lambda_layers.md)
3. [Lambda function with Python dependencies that uses AWS provided Docker image]({filename}50002030-cdk-fn-lambda-python-deps.md)

But in some cases, you may need to modify the Docker image that AWS Lambda uses. E.g. you may need to install additional dependencies or modify the runtime.

In this post, we'll look at how to create a Lambda function using a AWS provided Docker image.


## Prerequisites

1. Ensure that you have [AWS CDK and SAM CLI installed]({filename}00000100-cdk-installing-cdk-sam-cli.md). 
2. If needed [create a new CDK application]({filename}50000020-cdk-new-app.md).


## Create a Lambda function using a ECR Docker image

We will need to do the following:


1. Create the `Dockerfile` 
2. Create a `requirements.txt` file to specify the Python packages to be installed.
3. Write the lambda function.
4. Create the lambda stack.


### 1. Create the Dockerfile

Let's create a `lambda` directory in `cdk_app` to store the files for this function.

```Dockerfile
# filename: cdk_app/lambda/Dockerfile

FROM public.ecr.aws/lambda/python:3.12

# Copy requirements.txt
COPY requirements.txt ${LAMBDA_TASK_ROOT}

# Install the specified packages
RUN pip install -r requirements.txt

# Copy function code
COPY index.py ${LAMBDA_TASK_ROOT}

# Set the CMD to your handler
CMD [ "index.handler" ] 
```

Within this image we have:

1. Identified the image that we want to use. In this case we are using the AWS provided Python 3.12 image.
2. Copied the `requirements.txt` file to the image.
3. Installed the specified packages.
4. Copied the function code to the image.
5. Set the command to be executed when the container starts.

### 2. Create a requirements.txt file

Create a new file called `requirements.txt` in the `cdk_app/lambda` directory. Any Python packages that you may need to install can be added to this file.

```
requests
```

### 3. Create the lambda function

Within the `lambda` directory create a new file called `index.py`. This is the main Python file that will be executed by the Lambda function.

```python
# filename: cdk_app/lambda/index.py

import requests

def handler(event, context):
    response = requests.get("https://jsonplaceholder.typicode.com/todos/1")

    return {"statusCode": 200, "body": response.json()}
```


### 4. Create a lambda_stack.py file

We modify the `lambda_stack.py` file to create the CDK stack.

```python
# filename: cdk_app/lambda_stack.py

from aws_cdk import (
    Stack,
    aws_lambda as _lambda,
)
from constructs import Construct

class LambdaStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        fn = _lambda.DockerImageFunction(
            self,
            "LambdaFunction",
            code=_lambda.DockerImageCode.from_image_asset("cdk_app/lambda"),
        )
```

In the above code we use the `DockerImageFunction` construct to create the Lambda function. It takes the following arguments:

1. `self`: The construct itself.
2. `id`: The unique identifier for the function.
3. `code`: The Docker image code. In this case we are using the `DockerImageCode.from_image_asset` method to specify the path to the Docker image.
4. `environment`: The environment variables for the function. This is not required but is useful for testing purposes.

Compared to previous examples, we don't need to identify the handler function as this is specified in the `Dockerfile`.

Now finally, let's initialise the stack by creating the `app.py` file.

```python
# filename: app.py

import aws_cdk as cdk

from cdk_app.lambda_stack import LambdaStack

app = cdk.App()
lambda_stack = LambdaStack(app, "LambdaStack")

app.synth()
```

To deploy the stack, run `cdk deploy`. 

When the lambda function is deployed, you can go to the console and test the function. It should show the below output.

![Lambda function output]({static}/images/aws/50002040-01-aws-lambda-output.png)