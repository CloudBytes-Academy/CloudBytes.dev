Title: Using multiple environments AWS CLI and profiles with CDK
Date: 2025-01-12
Category: AWS Academy
Series: AWS CDK
series_index: 100
Tags: aws, cdk, python
Author: Rehan Haider
Summary: How to use multiple environments, AWS Accounts and profiles with AWS CDK
Keywords: AWS, cdk, python

So far we've been using the default `cdk deploy` command that uses the default AWS CLI profile that you have configured. However, AWS CLI and AWS CDK both supports using multiple profiles and environments. This is useful when you have multiple AWS accounts and you want to deploy your CDK stacks to different accounts.


## Environments

When we intantiate a stack in CDK, we can pass an `env` parameter that specifies the environment in which the stack will be deployed. This environment contains the AWS account and region where the stack will be deployed. 

E.g., working off a [new CDK app]({filename}50000020-cdk-new-app.md), we typically have the following code in the `app.py` file:

```python
import aws_cdk as cdk

from cdk_app.my_stack import MyStack

app = cdk.App()
my_stack = MyStack(
    app,
    "MyStack",
) #👈🏽 No env define

app.synth()
```

In the above code, we are not specifying the environment in which the stack will be deployed. This means that the stack will be deployed to the default AWS CLI profile that you have configured.

To specify the environment, we can pass an `env` parameter to the `MyStack` constructor:

```python
import aws_cdk as cdk

from cdk_app.my_stack import MyStack


env = {
    "account": "123456789012",
    "region": "us-east-1",
} #👈🏽 Define the environment


app = cdk.App()
my_stack = MyStack(
    app,
    "MyStack",
    env=env,
)

app.synth()
```

In the above code, we are specifying the environment in which the stack will be deployed. The `env` parameter is a dictionary that contains the `account` and `region` keys. The `account` key specifies the AWS account where the stack will be deployed, and the `region` key specifies the AWS region where the stack will be deployed.

## Using multiple profiles

To use multiple profiles, you can utilise `--profile`` flag to configure and use a different profile.

E.g. while configuring a new profile:

```bash
aws configure --profile my_profile
```

To use this profile with CDK, you can pass the `--profile` flag to the `cdk deploy` command:

```bash
cdk deploy --profile my_profile
```

This will deploy the stack using the `my_profile` profile that you have configured.