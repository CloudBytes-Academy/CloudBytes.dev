Title: How to get the ARN of a resource using AWS CDK
Date: 2023-10-29
Category: AWS Academy
Tags: aws, cdk, python
Author: Rehan Haider
Summary: A guide on how to get the ARN of a resource using AWS CDK
Keywords: ARN, AWS, CDK


ARN (Amazon Resource Name) is a unique identifier automatically assigned to every AWS resource when it is created. The ARN is used to uniquely identify the resource across all of AWS including accounts, regions, and services.

# ARN Format

As explained in the [AWS documentation](https://docs.aws.amazon.com/IAM/latest/UserGuide/reference-arns.html), an ARN has the following format depending on the resource type:

```
arn:partition:service:region:account-id:resource-id
arn:partition:service:region:account-id:resource-type/resource-id
arn:partition:service:region:account-id:resource-type:resource-id
```

In the above format, the following placeholders are used:

1. `partition` - The partition that the resource is in. For standard AWS regions, the partition is `aws`. If you have resources in other partitions, the partition is `aws-cn` for China and `aws-us-gov` for AWS GovCloud (US).
2. `service` - The service namespace that identifies the AWS product (for example, `s3`, `iam`, `codecommit`, `ec2`, etc.).
3. `region` - The AWS Region that the resource resides in. For example, `us-east-1`.
4. `account-id`: The ID of the AWS account that owns the resource, without the hyphens. For example, `123456789012`.
5. `resource-type` - The resource type (for example, `instance`, `bucket`, `user`, etc.).
6. `resource-id`: The resource ID. This depends on the service namespace. For example, an Amazon S3 bucket is named using the path style `bucket_name`, and so is identified by `bucket_name`.


## How to get the ARN of a resource using AWS CDK

There are a few ways to get the ARN of a resource using AWS CDK. Some of them are:

1. [Using `<resource>_arn` property](#using-resource_arn-property)
2. [Using `attr_arn` method from CFN resource](#using-attr_arn-method-fromm-cfn-resource)
3. Using GetAtt method from Fn class

### Using `<resource>_arn` property

To get the ARN of a resource using AWS CDK, you can use the `<resource>_arn` property. For example, to get the ARN of an S3 bucket, you can use the `bucket_arn` property as shown below:

```python
# filename: cdk_app/s3_stack.py
from aws_cdk import (
    Stack,
    aws_s3 as s3,
    RemovalPolicy,
)

from aws_cdk import CfnOutput  # 👈🏽 Import the CfnOutput class
from constructs import Construct


class S3Stack(Stack):
    BUCKET_ID = "MyS3Bucket"

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        myBucket = s3.Bucket(self, id=self.BUCKET_ID, removal_policy=RemovalPolicy.DESTROY)
        bucket_arn = myBucket.bucket_arn  # 👈🏽 Get the ARN of the bucket

        # 👇🏽 Print the bucket ARN to console
        print(f"Bucker ARN: {bucket_arn}")

        # 👇🏽 Output the bucket ARN to use in other stacks
        CfnOutput(self, "S3BucketARN", value=myBucket.bucket_arn, export_name="MyS3BucketARN")
```

Similarly, to get the ARN of a DynamoDB table, you can use the `table_arn` property as shown below:

```python
# filename: cdk_app/dynamodb_stack.py
from aws_cdk import (
    Stack,
    aws_dynamodb as ddb,
    RemovalPolicy,
)

from constructs import Construct


class DynamoDBStack(Stack):
    TABLE_ID = "MyDynamoDBTable"

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        myTable = ddb.Table(
            self,
            id=self.TABLE_ID,
            partition_key={"name": "id", "type": ddb.AttributeType.STRING},
            removal_policy=RemovalPolicy.DESTROY,
        )

        # 👇🏽 Print the table ARN to console
        print(f"Table ARN: {myTable.table_arn}")
```

### Using `attr_arn` method fromm CFN resource

You can also use the `attr_arn` method from the [L1 CFN]({filename}50000040-cdk-constructs.md) resource to get the ARN of a resource. For example, let's modify our `s3_stack.py` to use the `attr_arn` method as shown below:


```python
# filename: cdk_app/s3_stack.py

from aws_cdk import (
    Stack,
    aws_s3 as s3,
    RemovalPolicy,
)

from aws_cdk import CfnOutput  # 👈🏽 Import the CfnOutput class
from constructs import Construct


class S3Stack(Stack):
    BUCKET_ID = "MyS3Bucket"

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        myBucket = s3.Bucket(self, id=self.BUCKET_ID, removal_policy=RemovalPolicy.DESTROY)

        # 👇🏽 Get the CFN Bucket resource. 
        cfn_bucket: s3.CfnBucket = myBucket.node.default_child

        bucket_arn = cfn_bucket.attr_arn # 👈🏽 Get the ARN of the bucket
        
        # 👇🏽 Output the bucket ARN
        CfnOutput(self, id="S3BucketARN", value=bucket_arn, export_name="MyS3BucketARN")
```

In the above code, we are using the `node.default_child` property to get the CFN resource for the S3 bucket. Then we are using the `attr_arn` method to get the ARN of the bucket.

!!! note 
    Notice we hinted the type of the `cfn_bucket` variable as `s3.CfnBucket`. This is because the `node.default_child` property returns a generic `CfnResource` type. We need to hint the type to `s3.CfnBucket` to get access to the `attr_arn` method.

## Using GetAtt method from Fn class

You can also use the `Fn.get_att` method to get the ARN of a resource. For example, let's modify our `s3_stack.py` to use the `Fn.get_att` method as shown below:

```python
# filename: cdk_app/s3_stack.py

from aws_cdk import (
    Stack,
    aws_s3 as s3,
    RemovalPolicy,
    Fn,  # 👈🏽 Import the Fn class
)

from aws_cdk import CfnOutput  # 👈🏽 Import the CfnOutput class
from constructs import Construct


class S3Stack(Stack):
    BUCKET_ID = "MyS3Bucket"

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        myBucket = s3.Bucket(self, id=self.BUCKET_ID, removal_policy=RemovalPolicy.DESTROY)

        # 👇🏽 Get the CFN Bucket resource
        cfn_bucket: s3.CfnBucket = myBucket.node.default_child

        bucket_arn = Fn.get_att(cfn_bucket.logical_id, "Arn").to_string()

        # 👇🏽 Output the bucket ARN
        CfnOutput(self, id="S3BucketARN", value=bucket_arn, export_name="MyS3BucketARN")
```

To use the `Fn.get_att` method, you need to pass the logical ID of the resource and the attribute name as arguments. We also need to convert the output of the `Fn.get_att` method to a string using the `to_string` method.


## Conclusion

The above methods are common ways of getting the ARN of a resource using AWS CDK. Using the `<resource>_arn` property is the easiest way to get the ARN of a resource. However, if you need to get the ARN of a resource that doesn't have a L2 construct yet and is not supported by AWS CDK, you can use the `attr_arn` method from the CFN resource or the `Fn.get_att` method from the Fn class.

```python
        myBucket = s3.Bucket(self, id=self.BUCKET_ID, removal_policy=RemovalPolicy.DESTROY)
        bucket_arn = myBucket.bucket_arn  # 👈🏽 Get the ARN of the bucket
```