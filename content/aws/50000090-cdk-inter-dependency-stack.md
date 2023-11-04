Title: Managing dependency between stacks in CDK
Date: 2023-10-28
Category: AWS Academy
Series: AWS CDK
series_index: 90
Tags: aws, cdk, python
Author: Rehan Haider
Summary: How to specify dependency between stacks in CDK
Keywords: AWS, cdk, python, dependency, stack


Managing infrastructure means dealing with interconnected resources. In the AWS Cloud Development Kit (CDK), this often translates to specifying dependencies between different stacks. This post will guide you on how to define and manage these dependencies effectively within the CDK.


## Why Specify Dependencies?

The main use of specifying dependencies is to ensure that resources are deployed in the correct order. There are three main reasons why you would want to specify dependencies. For example, a Lambda function depends on an S3 bucket. The Lambda function needs to be deployed after the S3 bucket is created. This is because the Lambda function needs to access the S3 bucket. If the Lambda function is deployed before the S3 bucket, it will fail to access the S3 bucket.

Another reason is to ensure that resources are deleted in the correct order. For example, if you delete the S3 bucket before the Lambda function, the Lambda function will fail to access the S3 bucket. This is because the S3 bucket no longer exists.

## How to Specify Dependencies?

There are two ways to specify dependencies in CDK. The first way is to use the `add_dependency` method. The second way is to use the `depends_on` property.

### 1. Using the `add_dependency` Method

Taking the code example in previous post that talks about [how to import stack outputs]({filename}50000080-cdk-how-to-import-output.md), let's create a stack that creates an S3 bucket and exports its ARN as an Output.

You can use the `add_dependency` method to specify this dependency.

```python
import aws_cdk as cdk

from cdk_app.s3_stack import S3Stack
from cdk_app.lambda_stack import LambdaStack

app = cdk.App()

# LambdaStack depends on S3Stack

s3_stack = S3Stack(app, "S3Stack")
lambda_stack = LambdaStack(app, "LambdaStack")

# 👇🏽 Add the dependency to ensure S3Stack is deployed first
lambda_stack.add_dependency(s3_stack)

app.synth()
```

### 2. Using the `depends_on` Property

This is typically used if there a stack depends on more than one stack. For example, if you have a stack that contains a Lambda function that accesses an S3 bucket and a DynamoDB table, you can use the `depends_on` property to specify the dependencies.

You will need to specify the dependencies as a list of stacks.

```python
import aws_cdk as cdk

from cdk_app.s3_stack import S3Stack
from cdk_app.lambda_stack import LambdaStack
from cdk_app.dynamodb_stack import DynamoDBStack

app = cdk.App()

# LambdaStack depends on S3Stack

s3_stack = S3Stack(app, "S3Stack")
dynanodb_stack = DynamoDBStack(app, "DynamoDBStack")

# 👇🏽 Specify that the stack depends on both s3_stack and dynamodb_stack
lambda_stack = LambdaStack(app, "LambdaStack", depends_on=[s3_stack, dynamodb_stack])

app.synth()
```

You can use the below for the dynamodb_stack.py file:

```python
# filename: cdk_app/dynamodb_stack.py

from aws_cdk import (
    Stack,
    aws_dynamodb as ddb,
    RemovalPolicy,
)
from constructs import Construct

class DynamoDBStack(Stack):
    TABLE_ID = "MyDynamoDBTable"

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        myTable = ddb.Table(
            self,
            id=self.TABLE_ID,
            partition_key={"name": "id", "type": ddb.AttributeType.STRING},
            removal_policy=RemovalPolicy.DESTROY,
        )
```

## Limitations of CDK Dependencies

There are a few limitations of CDK dependencies that you should be aware of.

1. **Circular Dependencies**: Be cautious to avoid circular dependencies where Stack A depends on Stack B and vice versa. This will result in an error.
2. **Cross-Region Dependencies**: CDK doesn't support specifying dependencies across stacks in different AWS regions. For such scenarios, consider other synchronization methods or manually coordinating deployments.