Title: Creating a new CDK app with Python
Date: 2023-10-22
Category: AWS Academy
Series: AWS CDK
series_index: 4
Tags: aws, cdk, python
Author: Rehan Haider
Summary: How to create a new CDK app that uses Python as the programming language
Keywords: AWS


In this post, we'll create a new CDK app that uses Python as the programming language. 

!!! note
    Ensure that [AWS CDK is installed & configured]({filename}00000100-cdk-installing-cdk-sam-cli.md) before proceeding.


## Creating a new CDK app

a) Create a new directory for the CDK app and navigate to it:

```bash
mkdir cdk-app && cd cdk-app
```


b) To create a new CDK app, run the following command:

```bash
cdk init app --language python
```

The above command will create the following:

1. **CDK App**: Create a new CDK app in the current directory. It includes a `cdk.json` file that includes the configuration for the CDK app
2. **Stacks**: Create a folder called `cdk-app` in the current directory that includes the `stacks` that will be deployed
3. **Python Virtual Environment**: Create a Python virtual environment for the app in the .venv folder. It also creates a `requirements.txt` file that includes the Python dependencies for the app
4. **Git**: Create a git repository for the app including a `.gitignore` file


c) Activate the Python virtual environment:

```bash
source .venv/bin/activate
```

If you are using Windows, run the following command instead:

```powershell
./source.bat
```

d) Install the Python dependencies:

```bash
pip install -r requirements.txt -r requirements-dev.txt
```

## Modifying the CDK app

a) Open the `app.py` file. This file includes the basic CDK app that includes a single stack called `CdkAppStack`. 

```python
import os
import aws_cdk as cdk

from cdk_app.cdk_app_stack import CdkAppStack


app = cdk.App()
CdkAppStack(app, "CdkAppStack",)

app.synth()
```

In the above code, we are importing the `CdkAppStack` class from the `cdk_app_stack.py` file. This file is located in the `cdk_app` folder.

b) Open the `cdk_app_stack.py` file. This file includes the `CdkAppStack` class that extends the `cdk.Stack` class. 

```python
from aws_cdk import (
    Stack,
)
from constructs import Construct

class CdkAppStack(Stack):

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # The code that defines your stack goes here

```

Currently, the `CdkAppStack` class does not include any resources. Let's add a S3 bucket to the stack.

c) Modify the `cdk_app_stack.py` file as follows:

```python
from aws_cdk import (
    Stack,
    aws_s3 as s3,
)

from constructs import Construct

class CdkAppStack(Stack):

    BUCKET_NAME = "MyFirstBucket"

    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        # The code that defines your stack goes here
        s3.Bucket(self, id=self.BUCKET_NAME)

```
Change the `BUCKET_NAME` variable to a name of your choice. This is not the name of the S3 bucket but the ID by which the S3 bucket will be referenced in the CDK app.

## Deploying the CDK app

a) Run `cdk synth` to synthesize the CDK app. Synth will generate a CloudFormation template for the CDK app. You can see the generated template in the `cdk.out` folder.

b) Run `cdk deploy` to deploy the CDK app. CDK will deploy the S3 bucket to your AWS account. You can see the deployed S3 bucket in the AWS Console.

![Deployed S3 bucket]({static}/images/aws-academy/50005000-cdk-deploy-cloudformation.png)

You can see the deployed S3 bucket in the AWS Console.

## Destroying the CDK app

To destroy the CDK app, run the following command:

```bash
cdk destroy
```

However, this will not delete the S3 bucket. You have to manually delete the S3 bucket from the AWS Console.
This is the default behaviour of CDK so you don't accidentally delete S3 buckets that contain important data. 
