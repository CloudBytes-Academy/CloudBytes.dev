Title: How to import an existing lambda function using AWS CDK in Python
Date: 2023-11-05
Category: AWS Academy
Series: AWS CDK
series_index: 2010
Tags: aws, cdk, python
Author: Rehan Haider
Summary: A guide to importing an existing lambda function using AWS CDK in Python and applying changes to it
Keywords: lambda, cdk


We learnt [how to create a new lambda function using AWS CDK in Python]({filename}50002000-cdk-fn-create-lambda.md) in the previous post. 

But in a lot of cases, you might already have a lambda function that was created elsewhere and you want to import into your CDK app and apply changes to it. In this post, we will see how to do that.

There are three ways to import an existing lambda function, can use:

1. `from_function_arn`: This relies on the ARN of the lambda function.
2. `from_function_name`: You can also import the lambda function using its name.
3. `from_function_attributes`: This is typically used to import a lambda function that was created in a different AWS account or a different region.


## Import an existing lambda function using its ARN

To import an existing lambda function using its ARN, you can use the `from_function_arn` method of the `Function` construct. Let's see how to do that.

```python
# filename: cdk_app/lambda_stack.py

from aws_cdk import (
    Stack,
    aws_lambda as _lambda,
)

from constructs import Construct


class LambdaStack(Stack):

    FN_ARN = "arn:aws:lambda:us-east-1:123456789012:function:my-lambda"

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        my_lambda = _lambda.Function.from_function_arn(
            self,
            id="MyLambda",
            function_arn=self.FN_ARN,
        )
```

The `from_function_arn` method takes only three parameters:

1. `scope`: The scope of the construct. In this case, it is the `LambdaStack` class.
2. `id`: The ID that will be used within CDK/CloudFormation. In this case, we set it to `MyLambda` but it could be anything.
3. `function_arn`: The ARN of the lambda function that you want to import.

## Import an existing lambda function using its name


To import an existing lambda function using its name, you can use the `from_function_name` method of the `Function` construct. Let's see how to do that.

```python
# filename: cdk_app/lambda_stack.py

from aws_cdk import (
    Stack,
    aws_lambda as _lambda,
)

from constructs import Construct


class LambdaStack(Stack):

    FN_NAME = "my-lambda"

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        my_lambda = _lambda.Function.from_function_name(
            self,
            id="MyLambda",
            function_name=self.FN_NAME,
        )
```

The `from_function_name` method takes only three parameters:

1. `scope`: The scope of the construct. In this case, it is the `LambdaStack` class.
2. `id`: The ID that will be used within CDK/CloudFormation. In this case, we set it to `MyLambda` but it could be anything.
3. `function_name`: The name of the lambda function that you want to import.


## Import an existing lambda function using its attributes

This is typically used to import a lambda function when you have the Lambda function's ARN and you also need to specify or override other attributes. E.g. for instance, if you need to specify the execution role's ARN because you want to grant permissions or interact with the role in some way within your CDK app, this method would be more suitable.

To import an existing lambda function using its attributes, you can use the `from_function_attributes` method of the `Function` construct. Let's see how to do that.

```python
# filename: cdk_app/lambda_stack.py

from aws_cdk import (
    Stack,
    aws_lambda as _lambda,
    aws_iam as iam,
)

from constructs import Construct


class LambdaStack(Stack):
    FN_ARN = "arn:aws:lambda:us-east-1:123456789012:function:my-lambda"
    ROLE_ARN = "arn:aws:iam::123456789012:role/my-lambda-role"

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        my_role = iam.Role.from_role_arn(
            self,
            id="MyRole",
            role_arn=self.ROLE_ARN,
        )

        my_lambda = _lambda.Function.from_function_attributes(
            self,
            id="MyLambda",
            function_arn=self.FN_ARN,
            role=my_role,
        )
```

In the above we provided the `role` parameter to the `from_function_attributes` method. This is because we wanted to override the execution role of the lambda function. To do that, we first imported the role using the `Role.from_role_arn` method.