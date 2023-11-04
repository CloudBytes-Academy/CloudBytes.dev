Title: Configure lifecycle rules for S3 buckets using CDK
Date: 2023-11-04
Category: AWS Academy
Series: AWS CDK
series_index: 140
Tags: aws, cdk, python
Author: Rehan Haider
Summary: How to configure S3 lifecycle rules like expiration and transition
Keywords: s3, encryption, lifecycle,


Lifecycle rules allow you to configure the lifecycle of objects in your S3 bucket. You can configure lifecycle rules to expire or transition objects to different storage classes.


## Configure Lifecycle Rules

You can configure lifecycle rules on the S3 bucket by using the `add_lifecycle_rule` method of the `Bucket` construct.

```python
# filename: cdk_app/s3_stack.py

from aws_cdk import (
    Stack,
    aws_s3 as s3,
    RemovalPolicy,
    Duration,  # 👈🏽 Import the Duration class
)

from constructs import Construct


class S3Stack(Stack):
    BUCKET_ID = "MyS3Bucket"

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        my_bucket = s3.Bucket(
            self,
            id=self.BUCKET_ID,
            # 👇🏽 Set the lifecycle rules
            lifecycle_rules=[
                s3.LifecycleRule(
                    enabled=True,
                    expiration=Duration.days(14),
                )
            ],
            removal_policy=RemovalPolicy.DESTROY,
        )
```

In the above code, we have set the following lifecycle rules:

1. `enabled=True` - Enable the lifecycle rule
2. `expiration=Duration.days(14)` - Delete the objects after 14 days

You also configure transition rules by setting the `transitions` property of the `LifecycleRule` class.

```python
# filename: cdk_app/s3_stack.py

from aws_cdk import (
    Stack,
    aws_s3 as s3,
    RemovalPolicy,
    Duration,  # 👈🏽 Import the Duration class
)

from constructs import Construct


class S3Stack(Stack):
    BUCKET_ID = "MyS3Bucket"

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        my_bucket = s3.Bucket(
            self,
            self.BUCKET_ID,
            # 👇🏽 Set the lifecycle rules
            lifecycle_rules=[
                s3.LifecycleRule(
                    enabled=True,
                    transitions=[
                        s3.Transition(
                            storage_class=s3.StorageClass.INFREQUENT_ACCESS,
                            transition_after=Duration.days(30),
                        ),
                        s3.Transition(
                            storage_class=s3.StorageClass.GLACIER,
                            transition_after=Duration.days(60),
                        ),
                    ],
                )
            ],
            removal_policy=RemovalPolicy.DESTROY,
        )
```

In the above example, we have set the following transition rules:

1. `storage_class=s3.StorageClass.INFREQUENT_ACCESS` - Move the objects to infrequent access storage class after 30 days
2. `storage_class=s3.StorageClass.GLACIER` - Move the objects to Glacier storage class after 60 days