Title: Configure event notifications using S3 buckets notifications
Date: 2023-11-04
Category: AWS Academy
Series: AWS CDK
series_index: 150
Tags: aws, cdk, python
Author: Rehan Haider
Summary: Guide to configure bucket notifications for S3 buckets using CDK
Keywords: s3, notifications, event

Apart from [using EventBridge to gather events from S3 buckets and send them to a target]({filename}50000150-cdk-s3-eventbridge-notifications.md), you can also configure notifications on the S3 bucket itself. This is done using the `add_event_notification` method of the `Bucket` construct.


## Configure S3 bucket notifications

Bucket notifications can be configured using the `add_event_notification` method of the `Bucket` construct. This method takes two parameters:


### Import the required modules

We need to import the `s3_notifications` module to create the S3 bucket notification.

```python
# filename: cdk_app/s3_stack.py

from aws_cdk import (
    Stack,
    aws_s3 as s3,
    aws_s3_notifications as s3n,  # 👈🏽 Import the s3 notifications module
    RemovalPolicy,
    aws_lambda as _lambda,
)

from constructs import Construct
```

### Initialise the stack and create the S3 bucket

We will initialise the stack and create the S3 bucket as we did in the previous examples. 

```python
class S3Stack(Stack):
    BUCKET_ID = "MyS3Bucket"

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        my_bucket = s3.Bucket(
            self,
            self.BUCKET_ID,
            # 👇🏽 Block all public access
            removal_policy=RemovalPolicy.DESTROY,
        )
```

### Create the Lambda function

We will create a simple Lambda function that will be triggered when an object is created in the S3 bucket. The Lambda function will simply print `File Uploaded` message to console.

```python
        # 👇🏽 Create a lambda function
        my_lambda_fn = _lambda.Function(
            self,
            "MyLambda",
            runtime=_lambda.Runtime.PYTHON_3_7,
            code=_lambda.Code.from_inline("def main(event, context):\n\tprint('File Uploaded')"),
            handler="index.main",
        )
```

### Create the S3 bucket notification

We use the `add_event_notifications` method of the `Bucket` construct to create the notification. This method takes three parameters:

1. `event`: The type of event that will trigger the notification. We will use `s3.EventType.OBJECT_CREATED` to trigger the notification when an object is created in the bucket.
2. `destination`: The destination of the notification. We will use the Lambda function we created earlier as the destination.
3. `filters`: The filters to apply to the notification. We can use this to specify the `prefix` and `suffix` of the object key that will trigger the notification. E.g. if all objects are being stored in a folder named `images` we can use `prefix="images/"` to trigger the notification.

```python
        # 👇🏽 Create the S3 bucket notification
        my_bucket.add_event_notification(
            s3.EventType.OBJECT_CREATED, # 👈🏽 Trigger the notification when an object is created
            s3n.LambdaDestination(my_lambda_fn), # 👈🏽 Use the Lambda function as the destination
        )
```

### Deploy the stack

After the above changes, the full code will look like this:


```python
# filename: cdk_app/s3_stack.py

from aws_cdk import (
    Stack,
    aws_s3 as s3,
    aws_s3_notifications as s3n,  # 👈🏽 Import the s3 notifications module
    RemovalPolicy,
    aws_lambda as _lambda,
)

from constructs import Construct


class S3Stack(Stack):
    BUCKET_ID = "MyS3Bucket"

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        my_bucket = s3.Bucket(
            self,
            self.BUCKET_ID,
            # 👇🏽 Block all public access
            removal_policy=RemovalPolicy.DESTROY,
        )

        # 👇🏽 Create a lambda function
        my_lambda_fn = _lambda.Function(
            self,
            "MyLambda",
            runtime=_lambda.Runtime.PYTHON_3_7,
            code=_lambda.Code.from_inline("def main(event, context):\n\tprint('File Uploaded')"),
            handler="index.main",
        )

        # 👇🏽 Configure bucket notifications
        my_bucket.add_event_notification(
            s3.EventType.OBJECT_CREATED,
            s3n.LambdaDestination(my_lambda_fn),
        )
```

You can use `cdk deploy` to deploy the app.

The app will look like the below.

```python
# filename: app.py

import aws_cdk as cdk
from cdk_app.s3_stack import S3Stack

app = cdk.App()

s3_stack = S3Stack(app, "S3Stack")

app.synth()
```

## Configuring filters in event notifications

Let's say we wanted to configure a filter wheere if a new object is created in `uploads/` folder in S3 bucket and is a `.png` file, it triggers the notification. We can do this by adding a `prefix` and `suffix` to the notification.

```python
        # 👇🏽 Create the S3 bucket notification
        my_bucket.add_event_notification(
            s3.EventType.OBJECT_CREATED, # 👈🏽 Trigger the notification when an object is created
            s3n.LambdaDestination(my_lambda_fn), # 👈🏽 Use the Lambda function as the destination
            # 👇🏽 Add a prefix and suffix to the notification
            prefix="uploads/",
            suffix=".png",
        )
```

## EventBridge vs S3 bucket notifications

While both are acceptable ways to configure notifications for S3 buckets, I personally prefer using EventBridge as it provides more flexibility.

Also, Bucket Notification are configured as a workaround and you would notice in the AWS console that the notification is configured using a Lambda to configure the S3. This is because S3 bucket notifications are not natively supported by CDK. CDK uses a Lambda function to configure the S3 bucket notification.

