Title: Configure log retention and removal policy for Lambda function using AWS CDK in Python
Date: 2025-01-09
Category: AWS Academy
Series: AWS CDK
series_index: 1100
Tags: aws, cdk, python
Author: Rehan Haider
Summary: Learn how to configure CloudWatch logs retention and removal/deletion policy for a Lambda function using AWS CDK in Python
Keywords: lambda, cdk, s3, python, aws, cloudwatch


Each lambda invocation generates execution logs. By default, these logs are stored indefinitely in CloudWatch Logs. This means for a busy application you could have hundreds of thousans of log streams and log groups that are stored indefinitely. 

While in some scenarios this may be needed for certain compliances, but 9/10 times you don't need to store logs indefinitely. In this article, we will look at how to configure log retention for a Lambda function using AWS CDK in Python.

## Prerequisites
1. Ensure that you have [AWS CDK and SAM CLI installed]({filename}00000100-cdk-installing-cdk-sam-cli.md). 
2. If needed [create a new CDK application]({filename}50000020-cdk-new-app.md).


## Configuring log retention for a Lambda function

To do so, we first create a simple lambda function. We will need to store the function in a variable so that we can configure the log retention for it.

```python
# filename: cdk_app/my_stack.py

from aws_cdk import (
    Stack,
    aws_lambda as _lambda,
    aws_logs as logs,
    Duration,
    RemovalPolicy,
)
from constructs import Construct

class MyStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # 👇🏽 Create a Lambda function
        my_lambda = _lambda.Function(
            self,
            "MyLambda",
            runtime=_lambda.Runtime.PYTHON_3_12,
            handler="index.handler",
            code=_lambda.Code.from_inline("def handler(event, context): return 'Hello, World!'"),
            timeout=Duration.seconds(10),
        )
```

Next, we will configure the log retention for the lambda function. We will use the `LogGroup` class from the `aws_logs` module to configure the log retention. 

In the background, CDK creates another lambda function that deletes the older logs based on the retention policy. To do so it requires the name of the log group. The log group name is in the format `/aws/lambda/<function_name>`. We can get the function name using `my_lambda.function_name`.


```python
# filename: cdk_app/my_stack.py

from aws_cdk import (
    Stack,
    aws_lambda as _lambda,
    aws_logs as logs,
    Duration,
    RemovalPolicy,
)
from constructs import Construct

class MyStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # 👇🏽 Create a Lambda function
        my_lambda = _lambda.Function(
            self,
            "MyLambda",
            runtime=_lambda.Runtime.PYTHON_3_12,
            handler="index.handler",
            code=_lambda.Code.from_inline("def handler(event, context): return 'Hello, World!'"),
            timeout=Duration.seconds(10),
        )

        # 👇🏽 Create a log group for the Lambda function
        my_log_group = logs.LogGroup(
            self,
            "MyLogGroup",
            log_group_name=f"/aws/lambda/{my_lambda.function_name}", # 👈🏽 This is the log group name
            retention=logs.RetentionDays.ONE_WEEK,
            removal_policy=RemovalPolicy.DESTROY,
        )
```

In the above code, we create a log group for the lambda function. We set the retention policy to `ONE_WEEK`. This means that the logs will be retained for one week. After one week, the logs will be deleted. 

This also has the removal policy set to `DESTROY`. This means that when the stack is deleted, the log group will be deleted as well.

Now deploy the stack using the following commands:

```bash
cdk deploy
```

Once the stack is deployed, you can check the log group in the CloudWatch console. You will see that the log group has a retention policy of one week.

![cloudwatch log group retention policy]({static}/images/aws/50002100-01-cloudwatch-retention.png)