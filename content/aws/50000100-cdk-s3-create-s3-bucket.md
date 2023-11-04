Title: Create S3 bucket using CDK
Date: 2023-11-04
Category: AWS Academy
Series: AWS CDK
series_index: 100
Tags: aws, cdk, python
Author: Rehan Haider
Summary: How to create an S3 bucket in CDK using Python
Keywords: AWS, cdk, python, s3


This guide will walk you through the process of creating and configuring an S3 bucket using the AWS CDK in Python. 

After creating the S3 bucket, we will also learn how to configure the following:

1. Retention Policies
2. Versioning
3. Encryption
4. Access Control
5. Lifecycle Rules
6. Event Notifications

## Create an S3 bucket

CDK has both [L1 and L2 constructs]({filename}50000040-cdk-constructs.md) for S3 buckets that can be used to create an S3 bucket.

> L1 constructs are low-level constructs that map directly to the underlying CloudFormation resources. L2 constructs are high-level constructs that provide a simpler API to work with.

### Create an S3 bucket using L1 construct (CfnBucket)

Let's start by creating an S3 bucket using the L1 construct. 

```python
# filename: cdk_app/s3_stack.py

from aws_cdk import (
    Stack,
    aws_s3 as s3,
)

from constructs import Construct


class S3Stack(Stack):
    BUCKET_ID = "MyS3Bucket"

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        my_bucket = s3.CfnBucket(
            self,
            id=self.BUCKET_ID,
        )
```

The above code will create an S3 bucket with an automatically generated unique name.

You can create the CDK app by modifying the `app.py` file as follows:

```python
# filename: app.py

import aws_cdk as cdk
from cdk_app.s3_stack import S3Stack

app = cdk.App()

s3_stack = S3Stack(app, "S3Stack")

app.synth()
```

Deploy by running `cdk deploy`.

!!! warning
    If you destroy the stack by running `cdk destroy`, the S3 bucket will not be deleted. This is because the default removal policy for S3 buckets is `Retain`. You will manually have to delete the S3 bucket from the AWS console.


### Create an S3 bucket using L2 construct (Bucket)

While using L1 `CfnBucket` construct is a valid way to create an S3 bucket, it is not the recommended way as `Bucket` provies a more abstraction.

Let's create an S3 bucket using the L2 `Bucket` construct.

```python
# filename: cdk_app/s3_stack.py

from aws_cdk import (
    Stack,
    aws_s3 as s3,
)

from constructs import Construct


class S3Stack(Stack):
    BUCKET_ID = "MyS3Bucket"

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # 👇🏽 Use Bucket instead of CfnBucket
        my_bucket = s3.Bucket(
            self,
            id=self.BUCKET_ID,
        )
```

The above code will create an S3 bucket with a unique name. You can deploy the app by running `cdk deploy`.

As in previous example, if you destroy the stack by running `cdk destroy`, the S3 bucket will not be deleted. This is because the default removal policy for S3 buckets is `Retain`. You will manually have to delete the S3 bucket from the AWS console.

### Configure Removal Policies

What if you want the bucket to be automatically deleted when you destroy the stack? You can do this by setting the `removal_policy` property of the `Bucket` construct to `DESTROY`.

```python
# filename: cdk_app/s3_stack.py

from aws_cdk import (
    Stack,
    aws_s3 as s3,
    RemovalPolicy,  # 👈🏽 Import the RemovalPolicy class
)

from constructs import Construct


class S3Stack(Stack):
    BUCKET_ID = "MyS3Bucket"

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        my_bucket = s3.Bucket(
            self,
            id=self.BUCKET_ID,
            # 👇🏽 Set the removal policy to destroy
            removal_policy=RemovalPolicy.DESTROY,
        )
```

In the above code, we have set the removal policy to `DESTROY`. This means that when you destroy the stack, the S3 bucket will also be deleted.


### Configure Bucket Name

By default, the bucket name is automatically generated. You can specify a custom bucket name by setting the `bucket_name` property of the `Bucket` construct.

```python
# filename: cdk_app/s3_stack.py

from aws_cdk import (
    Stack,
    aws_s3 as s3,
    RemovalPolicy,
)

from constructs import Construct


class S3Stack(Stack):
    BUCKET_ID = "MyS3Bucket"

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        my_bucket = s3.Bucket(
            self,
            id=self.BUCKET_ID,
            removal_policy=RemovalPolicy.DESTROY,
            # 👇🏽 Set the bucket name
            bucket_name="my-custom-bucket-name",
        )
```

The `bucket_name` value must be globally unique. If you try to deploy the app with a bucket name that already exists, you will get an error.


## Additional Configuration for S3 buckets

You also also read how to configure the following for S3 buckets:

1. [Import an existing S3 bucket]({filename}50000105-cdk-s3-import-existing-bucket.md)
2. [Versioning]({filename}50000110-cdk-s3-configure-versioning.md)
3. [Encryption]({filename}50000120-cdk-s3-configure-encryption.md)
4. [Access Control]({filename}50000130-cdk-s3-access-control.md)
5. [Lifecycle Rules]({filename}50000140-cdk-s3-lifecycle-rules.md)
6. [Event Notifications using EventBridge]({filename}50000150-cdk-s3-eventbridge-notifications.md)
7. [Event Notificationsusing Bucket Notifications]({filename}50000160-cdk-s3-event-notifications.md) 
