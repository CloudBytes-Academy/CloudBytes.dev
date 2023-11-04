Title: Configure S3 encryption using CDK
Date: 2023-11-04
Category: AWS Academy
Series: AWS CDK
series_index: 120
Tags: aws, cdk, python
Author: Rehan Haider
Summary: How to configure S3 encryption for objects using CDK including SSE-S3, SSE-KMS, and SSE-C
Keywords: s3, encryption, sse-s3, sse-kms, sse-c


AWS S3 encryption is the ability to [encrypt objects stored in S3](https://docs.aws.amazon.com/AmazonS3/latest/userguide/UsingEncryption.html). 

AWS S3 supports the follow encryption states:

1. `UNENCRYPTED`: - This is deprecated and no longer use for any new buckets. 
2. `S3_MANAGED`: [(SSE-S3)](https://docs.aws.amazon.com/AmazonS3/latest/userguide/specifying-s3-encryption.html) - S3 will use S3 managed keys for server side encryption. This is the default encryption state for all new buckets and will be used if no encryption state is specified.
3. `KMS_MANAGED`: [(SSE-KMS)](https://docs.aws.amazon.com/AmazonS3/latest/userguide/specifying-kms-encryption.html) - Server Side encryption with S3 will use KMS managed keys that you have created using AWS KMS service
4. `KMS`:[(SSE-C)](https://docs.aws.amazon.com/AmazonS3/latest/userguide/ServerSideEncryptionCustomerKeys.html) - S3 will use customer managed keys using an external KMS service
5. `DSSE_MANAGED`: [(DSSE-KMS)](https://docs.aws.amazon.com/AmazonS3/latest/userguide/specifying-dsse-encryption.html) - S3 uses Dual Layer Server-Side Encryption (DSSE) with AWS KMS managed keys
5. `DSSE`: [(DSSE-C)](https://docs.aws.amazon.com/AmazonS3/latest/userguide/ServerSideEncryptionCustomerKeys.html) - S3 uses Double Server-Side Encryption (SSE) with customer provided keys from an external KMS service


## Configure S3 encryption using CDK

You can enable encryption on the S3 bucket by setting the `encryption` property of the `Bucket` construct to `BucketEncryption.S3_MANAGED` which is the default way of encrypting data in S3.

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
            self.BUCKET_ID,
            # 👇🏽 Bucket encryption will use S3 managed keys
            encryption=s3.BucketEncryption.S3_MANAGED,
            removal_policy=RemovalPolicy.DESTROY,
        )
```

If you want to use KMS managed keys, you can use the `encryption_key` property of the `Bucket` construct to specify the KMS key to use for encryption. 

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

        # 👇🏽 Create a KMS key to use for encryption
        kms_key = kms.Key(self, "MyKmsKey")

        my_bucket = s3.Bucket(
            self,
            self.BUCKET_ID,
            # 👇🏽 Bucket encryption will use KMS managed keys
            encryption=s3.BucketEncryption.KMS_MANAGED,
            # 👇🏽 Specify the KMS key to use for encryption
            encryption_key=kms_key,
            removal_policy=RemovalPolicy.DESTROY,
        )
```

