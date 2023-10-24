Title: Creating multiple stacks in AWS CDK
Date: 2023-10-24
Category: AWS Academy
Series: AWS CDK
series_index: 7
Tags: aws, cdk, python
Author: Rehan Haider
Summary: Guide to the process of creating and managing multiple stacks in a single AWS CDK application
Keywords: AWS, cdk, python, constructs, stacks

In AWS CDK (Cloud Development Kit), a stack is a deployable unit that represents a collection of AWS resources. Sometimes, there's a need to manage multiple stacks either for logical separation, different environments, or to manage AWS resource limits. 

In this post, we will create multiple stacks in the app and deploy them.

## Why create multiple stacks?

1. **Logical Separation**: You might want to separate resources logically, like networking resources in one stack and database resources in another.
2. **Resource Limits**: AWS CloudFormation has a limit on the number of resources per stack; dividing resources among multiple stacks can be a solution.
3. **Environment Management**: Manage different environments like development, staging, and production with distinct stacks
4. **Maintainability**: It's easier to maintain multiple stacks than a single stack with a large number of resources.

## Creating multiple stacks

Start a new project by running the following command:

```bash
cdk init app --language python
```

### 1. Create the first stack

Rename the `cdk_app_stack.py` file to `first_stack.py` and modify the code as follows:

```python
from aws_cdk import (
    Stack,
    aws_s3 as s3,
    RemovalPolicy,
)

from constructs import Construct

class FirstStack(Stack):

    BUCKET_ID = "MyFirstBucket"

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        s3.Bucket(self, "MyFirstBucket", removal_policy=RemovalPolicy.DESTROY)
```

This is the same code that we used in the [previous post]({filename}50002000-cdk-update-app.md) to create a bucket with a destroy policy.


### 2. Create the second stack

Create a new file called `second_stack.py` under the `cdk_app` folder and modify the code as follows:

```python
from aws_cdk import (
    Stack,
    aws_lambda as _lambda
)

from constructs import Construct

class SecondStack(Stack):
    
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        _lambda.Function(self, "MyFirstLambda",
            runtime=_lambda.Runtime.PYTHON_3_7,
            code=_lambda.Code.from_inline("def main(event, context):\n\tprint('Hello World')"),
            handler="index.main",
        )
```

This simple stack creates a Lambda function that prints "Hello World" to the console when invoked.

### 3. Modify the app.py file

The original `app.py` only has the default single stack that was created when we initialized the project. This stack no longer exists, so we need to modify the `app.py` file to include the two new stacks.

We first import the two new stacks:

```python
from cdk_app.first_stack import FirstStack
from cdk_app.second_stack import SecondStack
```

Then we add the two stacks to the app:

```python
app = cdk.App()

FirstStack(app, "FirstStack")
SecondStack(app, "SecondStack")
```

The final `app.py` file looks like this:

```python
import os
import aws_cdk as cdk

from cdk_app.first_stack import FirstStack
from cdk_app.second_stack import SecondStack


app = cdk.App()

FirstStack(app, "FirstStack")
SecondStack(app, "SecondStack")

app.synth()
```

### 4. Synthesize multiple stacks

Synth of the stacks is done in the same way as before:

```bash
cdk synth
```

This will synthesise both stacks and create the CloudFormation templates for in the `cdk.out` folder.

### 5. Deploy multiple stacks

To get the list of stacks that are available in the app, run the following command:

```bash
cdk ls
```
![cdk ls output]({static}/images/aws-academy/50004000-01-cdk-ls-output.png)


While deploying, we can either deploy only one stack, or all stacks together. To deploy a single stack, we have to specify the stack name:

```bash
cdk deploy FirstStack
```

And to deploy all stacks, we can simply run the following command:

```bash
cdk deploy --all
```

### 6. Destroy multiple stacks

To destroy a single stack, we have to specify the stack name:

```bash
cdk destroy FirstStack
```

And to destroy all stacks, we can simply run the following command:

```bash
cdk destroy --all
```