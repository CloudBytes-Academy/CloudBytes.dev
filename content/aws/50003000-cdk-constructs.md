Title: Understanding Constructs in the AWS CDK
Date: 2023-10-22
Category: AWS Academy
Series: AWS CDK
series_index: 6
Tags: aws, cdk, python
Author: Rehan Haider
Summary: Dive deep into the fundamental building blocks of the AWS Cloud Development Kit: Constructs
Keywords: AWS, bootstrap, cdk, python, constructs


Constructs are fundamental building blocks of the AWS Cloud Development Kit. They represent cloud components in the form of programmable classes. When AWS CDK apps are synthesized, these Constructs are translated into CloudFormation templates which AWS can then deploy.

## What are Constructs?

Constructs are essentially classes that can be reused to create cloud resources. The stack that you define in your CDK app is a collection of initialised Constructs.

In previous posts, [we created a new CDK App]({filename}50001000-cdk-new-app.md) which used the `Bucket` Construct to create an S3 bucket.

```python
from aws_cdk import (
    Stack,
    aws_s3 as s3,
    RemovalPolicy,
)

from constructs import Construct

class CdkAppStack(Stack):

    BUCKET_ID = "MyFirstBucket"

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Create an S3 bucket
        s3.Bucket(self, self.BUCKET_ID) # This is a Construct
```

## What are the different types of Constructs?

![Types of constructs]({static}/images/aws-academy/50003000-01-cdk-constructs-types.png)

As shown in the diagram above, there are three types of Constructs:

1. **L1 Constructs: CFN Resources**: These are low-level constructs that map directly to CloudFormation resources . Each L1 Construct represents one CloudFormation resource type, such as an S3 Bucket or an EC2 Instance. These L1 Constucts are the foundation of all other Constructs and are automatically generated from the [CloudFormation Resource Specification](https://docs.aws.amazon.com/AWSCloudFormation/latest/UserGuide/cfn-resource-specification.html).

Example:
```python
from aws_cdk.aws_s3 import CfnBucket
bucket = CfnBucket(self, "MyBucket", bucket_name="my-bucket-name")
```

2. **L2 Constructs:  Curated Constructs**: These are higher-level abstractions that provide sensible defaults and ease-of-use. They encapsulate multiple L1 or L2 Constructs, providing additional functionality and a more intuitive interface. The difference between L1 and L2 Constructs is that L2 Constructs are created by AWS CDK developers and usually have certain defaults set. For example, the `Bucket` Construct is an L2 Construct that encapsulates the `CfnBucket` L1 Construct. The `Bucket` Construct automatically computes the `bucket_name` based on app name and bucket ID.

Example:
```python
from aws_cdk.aws_s3 import Bucket
bucket = Bucket(self, "MyBucket")
```

3. **L3 Constructs: Patterns**: These are the highest-level abstractions that are not part of the core AWS CDK library. They are usually created by AWS CDK developers and are available as separate libraries. These Constructs are not part of the core AWS CDK library because they are not generic enough to be used by everyone. 

Typically, L3 constructs are not part of the standar AWS CDK library and needs to be installed. You can find a list of available L3 constructs on the [AWS Constructs Hub](https://constructs.dev).


## Creating your own Constructs

You can create your own Constructs by extending the `Construct` class. 

Let's create a custom Construct that creates an S3 bucket with a lifecycle policy that deletes objects after 30 days.

```python
from aws_cdk import (
    Stack,
    aws_s3 as s3,
    RemovalPolicy,
)

from constructs import Construct

class CustomBucket(Construct):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Create an S3 bucket
        bucket = s3.Bucket(self, "MyBucket", removal_policy=RemovalPolicy.DESTROY)

        # Add lifecycle policy to delete objects after 30 days
        bucket.add_lifecycle_rule(expiration=Duration.days(30))
```

Now, we can use this custom Construct in our CDK app as follows:

```python
from aws_cdk import (
    Stack,
    aws_s3 as s3,
    RemovalPolicy,
)

from constructs import Construct

class CdkAppStack(Stack):

    BUCKET_ID = "MyFirstBucket"

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # Create an S3 bucket
        CustomBucket(self, self.BUCKET_ID)
```

You can deploy this app by running `cdk deploy`. When you destroy the stack by running `cdk destroy`.









