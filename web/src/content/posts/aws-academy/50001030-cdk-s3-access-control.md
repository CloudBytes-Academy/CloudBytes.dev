---
title: "Configure public access control for S3 buckets using CDK"
description: "How to configure S3 public access control"
pubDate: "2023-11-04"
category: "AWS Academy"
categorySlug: "aws-academy"
slug: "configure-public-access-control-for-s3-buckets-using-cdk"
tags:
    - "aws"
    - "cdk"
    - "python"
keywords:
    - "s3"
    - "encryption"
    - "access"
    - "control"
author: "Rehan Haider"
authorSlug: "rehan-haider"
series: "AWS CDK"
seriesIndex: 1030
---
AWS provider the ability to [control public access to S3 buckets](https://docs.aws.amazon.com/AmazonS3/latest/userguide/access-control-block-public-access.html). 

There are four properties that can be set to control public access to S3 buckets:

1. `BlockPublicAcls`: Specifies if Amazon S3 should restrict public access control lists (ACLs) for this bucket and its objects
2. `BlockPublicPolicy`: Specifies if Amazon S3 should restrict public bucket policies for this bucket
3. `IgnorePublicAcls`: Specifies if Amazon S3 should ignore public ACLs for this bucket and its objects
4. `RestrictPublicBuckets`: Specifies whether Amazon S3 should restrict public bucket policies for this bucket


You can either configure them individually, or all together using the `BlockPublicAccess.BLOCK_ALL` configuration.


### Configure Access Control

You can configure access control on the S3 bucket by setting the `block_public_access` property of the `Bucket` construct to `BlockPublicAccess.BLOCK_ALL`.

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
            # 👇🏽 Block all public access
            block_public_access=s3.BlockPublicAccess.BLOCK_ALL,
            removal_policy=RemovalPolicy.DESTROY,
        )
```

This block all public access to the bucket and its objects.
