Title: Granting S3 permissions to a Lambda function using AWS CDK in Python
Date: 2025-01-03
Category: AWS Academy
Series: AWS CDK
series_index: 1060
Tags: aws, cdk, python
Author: Rehan Haider
Summary: Learn how to grant S3 permissions to a Lambda function and accessing files from an S3 bucket using AWS CDK in Python
Keywords: lambda, cdk, s3, python, aws


One of the most common serverless use cases is to have a Lambda function that processes files stored in an S3 bucket. However, typically you would keep the contents of your S3 bucket private and limit access through appropriate means. One of those means is you can create an IAM role that Lambda assumes when it runs and grant it permissions to access the S3 bucket.

In this article, we will look at how to:
1. Grant S3 read and write permissions to a Lambda function using AWS CDK in Python.
2. Read/write files from an S3 bucket using the Lambda function.

## Prerequisites

1. Ensure that you have [AWS CDK and SAM CLI installed]({filename}00000100-cdk-installing-cdk-sam-cli.md). 
2. If needed [create a new CDK application]({filename}50000020-cdk-new-app.md).


## Granting S3 permissions to a Lambda function

We will need to do the following:

1. Create an S3 bucket.
2. Create a Lambda function.
3. Grant the Lambda function permissions to access the S3 bucket.

### 1. Create an S3 bucket

First, let's create an S3 bucket in the stack.

```python
from aws_cdk import (
    Stack,
    aws_s3 as s3,
    RemovalPolicy,
)
from constructs import Construct


class MyStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # 👇🏽 create a bucket with random name
        bucket = s3.Bucket(
            self,
            "MyBucket",
            removal_policy=RemovalPolicy.DESTROY,  # 👈🏽 Delete the bucket with stack
            auto_delete_objects=True,  # 👈🏽 delete all objects before deleting bucket
        )
```

### 2. Create a Lambda function

We can create a simple Lambda function using any of the methods we have discussed in the previous posts. For this example we will use the CDK provided `PythonFunction` feature [that allows us to specify the python dependencies in AWS Lambda with ease]({filename}50001030-cdk-fn-lambda-python-deps.md).

**Step 1**: First we install the `aws-cdk.aws-lambda-python-alpha` module:

```bash
pip install aws-cdk.aws-lambda-python-alpha
```

**Step 2**: Then we create a Lambda function. We can also pass the name of the bucket to Lambda through the environment variables.

```python
#filename: cdk_app/lambda_stack.py
from aws_cdk import (
    Stack,
    aws_s3 as s3,
    aws_lambda_python_alpha as lambda_,  # 👈🏽 import the PythonFunction module
    RemovalPolicy,
)
from constructs import Construct


class MyStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        bucket = s3.Bucket(
            self,
            "MyBucket",
            removal_policy=RemovalPolicy.DESTROY,
            auto_delete_objects=True,
        )

        # 👇🏽 create a lambda function
        fn = lambda_.PythonFunction(
            self,
            id="MyFunction",
            entry="cdk_app/fn",
            index="index.py",
            handler="handler",
            runtime=lambda_.Runtime.PYTHON_3_12,
            # 👇🏽 pass the bucket name to the lambda function
            environment={"BUCKET_NAME": bucket.bucket_name},  
        )

```

**Step 3**: Now we the Lambda function code:

```python
# filename: cdk_app/fn/index.py

import requests

def handler(event, context):
    response = requests.get("https://jsonplaceholder.typicode.com/todos/1")

    return {"statusCode": 200, "body": response.json()}
```


**Step 4**: Add the Python dependencies in the `cdk_app/fn/requirements.txt` file:

```txt
requests
boto3
```


### 3. Grant the Lambda function permissions to access the S3 bucket

Finally, we need to grant the Lambda function permissions to access the S3 bucket.

```python
from aws_cdk import (
    Stack,
    aws_s3 as s3,
    aws_lambda_python_alpha as lambda_, 
    RemovalPolicy,
)
from constructs import Construct


class MyStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        bucket = s3.Bucket(
            self,
            "MyBucket",
            removal_policy=RemovalPolicy.DESTROY,
            auto_delete_objects=True,
        )

        # 👇🏽 create a lambda function
        fn = lambda_.PythonFunction(
            self,
            id="MyFunction",
            entry="cdk_app/fn",
            index="index.py",
            handler="handler",
            runtime=lambda_.Runtime.PYTHON_3_12,
            environment={"BUCKET_NAME": bucket.bucket_name},
        )

        # 👇🏽 grant the lambda function access to the bucket
        bucket.grant_read_write_data(fn)
```

In the above code, we use the `grant_read_write_data` method to grant the Lambda function read and write access to the S3 bucket.

Alternatively, you can use the `grant_read` or `grant_write` methods to grant only read or write access respectively.


## Accessing files from an S3 bucket using the Lambda function


Now that we have granted the Lambda function permissions to access the S3 bucket, we can read and write files from the bucket. To do so, we need to use the `boto3` library to interact with the S3 bucket.

```python
# filename: cdk_app/fn/index.py

import boto3
import requests

s3 = boto3.client("s3")

def handler(event, context):
    # 👇🏽 get the bucket name from the environment variables
    bucket_name = event["BUCKET_NAME"]

    response = requests.get("https://jsonplaceholder.typicode.com/todos/1")

    # 👇🏽 write the response to a file in the bucket
    s3.put_object(Bucket=bucket_name, Key="todos-1.json", Body=response.json())

    # 👇🏽 list all the objects in the bucket
    response = s3.list_objects_v2(Bucket=bucket_name)

    # 👇🏽 read the file and send the contexts as response
    stored_response = s3.get_object(Bucket=bucket_name, Key="todos-1.json")


    return {"statusCode": 200, "body": stored_response}
```

In the above code, we use the `boto3` library to interact with the S3 bucket. We first write the response from the API to a file in the bucket and then read the file and send the contents as a response. This method can be modified based on your exact use case.