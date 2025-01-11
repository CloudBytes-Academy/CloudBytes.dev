Title: Manage Python dependencies in AWS Lambda using AWS CDK
Date: 2023-11-05
Category: AWS Academy
Series: AWS CDK
series_index: 2030
Tags: aws, cdk, python
Author: Rehan Haider
Summary: We look at how to package, install and manage Python dependencies in AWS Lambda using AWS CDK
Keywords: lambda, cdk, docker, dependencies


We looked at how we can [install Python packages beyond the ones available by default in AWS Lambda]({filename}50002020-cdk-fn-lambda_layers.md#create-a-lambda-layer-in-aws-cdk-using-python-to-handle-dependencies). 

But I have always found it a bit cumbersome and unelegant to use Lambda layers to handle dependencies. Intead, I will show you an alternative way to handle Python dependencies in AWS Lambda using AWS CDK using an L2 construct called `PythonFunction`.

This is not availble in the `aws_cdk.aws_lambda` module, so we will have to install it using pip:

```bash
pip install aws-cdk.aws-lambda-python-alpha
```

## Create a lambda function using PythonFunction

```python
# filename: cdk_app/lambda_stack.py
from aws_cdk import (
    Stack,
)
# 👇🏽 import the python_alpha module
from aws_cdk import aws_lambda_python_alpha as python

from constructs import Construct


class LambdaStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # 👇🏽 create a python lambda function
        my_lambda = _lambda.PythonFunction(
            self,
            id="MyLambda",
            entry="cdk_app/lambda", # 👈🏽 Required
            runtime=_lambda.Runtime.PYTHON_3_10, # 👈🏽 Required
            index="index.py", # 👈🏽 Optional, defaults to index.py
            handler="handler", # 👈🏽 Optional, defaults to handler
        )
```

In the above code we use `PythonFunction` to define a lambda function. It takes the following parameters:

1. `scope`: The scope of the construct. In our case, it is the `LambdaStack` class.
2. `id`: The id of the construct. In our case, it is `MyLambda`, this will be used to refer to the function in CloudFormation templates
3. `entry`: The path to the directory where the lambda function is located. In our case, it is `lambda`
4. `index`: The name of the file that contains the lambda function. In our case, it is `index.py`
5. `handler`: The name of the handler function. In our case, it is `handler`

By default, the Construct will look for a `requirements.txt` file within the `entry` directory and install the dependencies listed in it. 

Let's create the `cdk_app/lambda/index.py` file:

```python
# filename: cdk_app/lambda/index.py

import requests

def handler(event, context):
    response = requests.get("https://jsonplaceholder.typicode.com/todos/1")
    return {
        "statusCode": 200,
        "body": response.json()
    }
```

We put a `requirements.txt` file in the same directory as our `index.py` file with the following contents:

```text
requests
```

Now let's create the `app.py` file:

```python
# filename: app.py

import aws_cdk as cdk
from cdk_app.lambda_stack import LambdaStack

app = cdk.App()

lambda_stack = LambdaStack(app, "LambdaStack")

app.synth()
```

Run `cdk deploy` to deploy the stack. 

Using this method, you just need to capture your dependencies in a `requirements.txt` file and the construct will take care of the rest.