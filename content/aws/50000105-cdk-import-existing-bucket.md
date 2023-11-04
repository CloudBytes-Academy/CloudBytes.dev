Title: Import an existing S3 bucket in CDK
Date: 2023-11-05
Category: AWS Academy
Series: AWS CDK
series_index: 105
Tags: aws, cdk, python
Author: Rehan Haider
Summary: How to import an existing S3 bucket using different methods in CDK using Python
Keywords: AWS, cdk, python, s3


We learnt how to [create an S3 bucket using CDK]({filename}50000100-cdk-create-s3-bucket.md) in the previous guide. In this guide, we will learn how to import an existing S3 bucket in CDK using Python.

## Import an existing S3 bucket

There are three ways to import an existing S3 bucket in CDK:

1. `Bucket.from_bucket_name`: Import the bucket using bucket name
2. `Bucket.from_bucket_arn`: Import the bucket using bucket ARN
3. `Bucket.from_bucket_attributes`: Import the bucket using bucket attributes


### Import an existing S3 bucket using bucket name

You can import an existing S3 bucket using the `from_bucket_name` method of the `Bucket` construct. 

```python
# filename: cdk_app/s3_stack.py

from aws_cdk import (
    Stack,
    aws_s3 as s3,
)

from constructs import Construct


class S3Stack(Stack):
    BUCKET_ID = "MyS3Bucket"
    BUCKET_NAME = "my-existing-bucket"

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        my_bucket = s3.Bucket.from_bucket_name(
            self,
            id=self.BUCKET_ID, # 👈🏽 Used to identify the bucket within CDK
            bucket_name=self.BUCKET_NAME, # 👈🏽 Name of the existing bucket
        )
```


### Import an existing S3 bucket using bucket ARN

If you have the ARN of the existing S3 bucket, e.g. from [another stack]({filename}50000050-cdk-multiple-stacks.md), you can import the bucket using the `from_bucket_arn` method of the `Bucket` construct. 

```python
# filename: cdk_app/s3_stack.py

from aws_cdk import (
    Stack,
    aws_s3 as s3,
)

from constructs import Construct


class S3Stack(Stack):
    BUCKET_ID = "MyS3Bucket"
    BUCKET_ARN = "arn:aws:s3:::my-existing-bucket"

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        my_bucket = s3.Bucket.from_bucket_arn(
            self,
            id=self.BUCKET_ID, # 👈🏽 Used to identify the bucket within CDK
            bucket_arn=self.BUCKET_ARN, # 👈🏽 ARN of the existing bucket
        )
```

### Import an existing S3 bucket using bucket attributes

The above two methods are useful as long as the bucket is in the same region as the stack. If the bucket is in a different region, you can use the `from_bucket_attributes` method of the `Bucket` construct. 

```python
# filename: cdk_app/s3_stack.py

from aws_cdk import (
    Stack,
    aws_s3 as s3,
)

from constructs import Construct


class S3Stack(Stack):
    BUCKET_ID = "MyS3Bucket"
    BUCKET_NAME = "my-existing-bucket"
    BUCKET_REGION = "us-east-1"

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        my_bucket = s3.Bucket.from_bucket_attributes(
            self,
            id=self.BUCKET_ID, # 👈🏽 Used to identify the bucket within CDK
            bucket_name=self.BUCKET_NAME, # 👈🏽 Name of the existing bucket
            region=self.BUCKET_REGION, # 👈🏽 Region of the existing bucket
        )
```