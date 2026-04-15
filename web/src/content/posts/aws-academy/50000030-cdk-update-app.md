---
title: "Update an existing CDK app"
description: "How to update an existing CDK app"
pubDate: "2023-10-22"
category: "AWS Academy"
categorySlug: "aws-academy"
slug: "update-an-existing-cdk-app"
tags:
    - "aws"
    - "cdk"
    - "python"
keywords:
    - "AWS"
    - "bootstrap"
    - "cdk"
    - "python"
author: "Rehan Haider"
authorSlug: "rehan-haider"
series: "AWS CDK"
seriesIndex: 30
---
In this post, we'll update an existing CDK app that uses Python as the programming language.

If you haven't created a new CDK app yet, follow the steps in [Creating a new CDK app with Python]({filename}50000020-cdk-new-app.md).

!!! note
    Ensure that [AWS CDK is installed & configured]({filename}00000100-cdk-installing-cdk-sam-cli.md) before proceeding.

## Updating an existing CDK app

We can simply update the stack bby modifying the `cdk_app/cdk_app_stack.py` file.

For example, we can change the retention policy by modifying the `cdk_app/cdk_app_stack.py` file as follows:

```python

from aws_cdk import (
    Stack,
    aws_s3 as s3,
    RemovalPolicy, # New Import
)

from constructs import Construct

class CdkAppStack(Stack):

    BUCKET_ID = "MyFirstBucket"

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Updated code. This will delete the bucket when the stack is deleted
        s3.Bucket(self, id="MyFirstBucket", removal_policy=RemovalPolicy.DESTROY)
```

Check the changes by running `cdk diff`. As you can see below, there is a change in Bucket policy being implemented.

![CDK diff](/images/50000030-01-cdk-cdk-diff-changes.png)


Now run `cdk deploy` to deploy the changes. When you destroy the stack by running `cdk destroy`, you'll notice that the bucket is deleted as well.
