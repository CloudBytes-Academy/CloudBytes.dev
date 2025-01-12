Title: Add CORS configuration to a S3 bucket using AWS CDK
Date: 2023-11-05
Category: AWS Academy
Series: AWS CDK
series_index: 1070
Tags: aws, cdk, python
Author: Rehan Haider
Summary: Learn how to setup and configure CORS for S3 buckets using CDK
Keywords: s3, cors


Cross-Origin Resource Sharing (CORS) is a mechanism that allows restricted resources on a web page to be requested from another domain outside the domain from which the first resource was served. 

Since all S3 buckets use `https://s3.amazonaws.com` as the domain, you need to configure CORS to allow access from other domains so be able to access the objects in the S3 bucket.

E.g. if a user tries to upload a file to an S3 bucket from a web page hosted on `https://example.com`, the browser will block the request unless CORS is configured to allow access from `https://example.com`.


## Setup CORS for S3 bucket

You can configure CORS on the S3 bucket by using the `cors` property of the `Bucket` construct.


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

        my_bucket = s3.Bucket(
            self,
            id=self.BUCKET_ID,
            # 👇🏽 Sset the CORS configuration
            cors=[
                {
                    "allowedMethods": [
                        s3.HttpMethods.PUT,
                    ],
                    "allowedOrigins": ["https://www.example.com"],
                    "allowedHeaders": ["*"],
                }
            ],
        )
```

In the above code, we have set the CORS configuration to allow PUT requests from `https://www.example.com` with any headers. This will allow users to upload files to the S3 bucket from `https://www.example.com`.


## Configure multiple CORS rules

You can configure multiple CORS rules by adding multiple dictionaries to the `cors` property.

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

        my_bucket = s3.Bucket(
            self,
            id=self.BUCKET_ID,
            # 👇🏽 Sset the CORS configuration
            cors=[
                {
                    "allowedMethods": [
                        s3.HttpMethods.PUT,
                    ],
                    "allowedOrigins": ["https://www.example.com"],
                    "allowedHeaders": ["*"],
                },
                {
                    "allowedMethods": [
                        s3.HttpMethods.GET,
                    ],
                    "allowedOrigins": ["https://www.example.com"],
                    "allowedHeaders": ["*"],
                },
            ],
        )
