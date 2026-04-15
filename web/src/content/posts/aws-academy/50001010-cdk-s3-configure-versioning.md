---
title: "Configure S3 versioning using CDK"
description: "How to configure S3 versioning using CDK"
pubDate: "2023-11-04"
category: "AWS Academy"
categorySlug: "aws-academy"
slug: "configure-s3-versioning-using-cdk"
tags:
    - "aws"
    - "cdk"
    - "python"
keywords:
    - "s3"
    - "versioning"
author: "Rehan Haider"
authorSlug: "rehan-haider"
series: "AWS CDK"
seriesIndex: 1010
---
AWS S3 versioning is the ability to [keep multiple versions of an object](https://docs.aws.amazon.com/AmazonS3/latest/userguide/Versioning.html) in one bucket. 

By default, versioning is disabled, however, if you enable it you cannot disable it. You can only suspend it.


## Configure S3 versioning using CDK

You can enable versioning on the S3 bucket by setting the `versioned` property of the `Bucket` construct to `True`.

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
            versioned=True,  # 👈🏽 Enable versioning
            removal_policy=RemovalPolicy.DESTROY,
        )
```

Configure the CDK app to use the `S3Stack` stack.

```python
# filename: app.py

import aws_cdk as cdk
from cdk_app.s3_stack import S3Stack

app = cdk.App()

s3_stack = S3Stack(app, "S3Stack")

app.synth()
```

To deploy the stack run `cdk deploy`.

If you go to the AWS console and check the S3 bucket, you will see that versioning is enabled.

![S3 versioning enabled](/images/50001010-01-s3-versioning-enabled.png)

## Suspending versioning

You can suspend versioning by setting the `versioned` property of the `Bucket` construct to `False`.

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
            versioned=False,  # 👈🏽 Suspend versioning
            removal_policy=RemovalPolicy.DESTROY,
        )
```

![S3 versioning suspended](/images/50001010-02-s3-versioning-suspended.png)


## Conclusion

Currently CDK doesn't support configuring MFADelete for S3 buckets. There is a [feature request](https://github.com/aws/aws-cdk/issues/5247) for it, however, most methods are workarounds.
