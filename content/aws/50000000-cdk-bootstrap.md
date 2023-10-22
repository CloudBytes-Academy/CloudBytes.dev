Title: CDK Bootstrap: Setting up your AWS account for CDK
Date: 2023-10-22
Category: AWS Academy
Series: AWS CDK
series_index: 3
Tags: aws, cdk
Author: Rehan Haider
Summary: This article explains what is CDK Bootstrap and how to setup your AWS account for use with CDK
Keywords: AWS, bootstrap, cdk, python

Before you can start using CDK, you need to configure your AWS account for use with CDK. This initial setup of AWS environment is done by `cdk bootstrap`` command. In this post, we'll delve into what CDK bootstrap does, why it's necessary, and how to use it effectively.

## What is CDK Bootstrap?

Bootstrap is a process that creates resources in your AWS account that are necessary for CDK to work. At its core, the CDK bootstrap is an initializer for your AWS environment, prepping it for subsequent CDK deployments.

### Why Do We Need to Bootstrap?

When you deploy a CDK stack, you're essentially asking the CDK to:

1. Synthesize an AWS CloudFormation template from your high-level code.
2. Store any necessary assets (Lambda code bundles, Docker images, etc.).
3. Use CloudFormation to deploy the defined resources based on the synthesized template and the stored assets.

To facilitate these steps, the CDK requires an environment where it can reliably store assets and manage the deployment. Bootstrapping creates that environment.

### Components of CDK Bootstrap

When you run the cdk bootstrap command, several resources are created:

1. **S3 Bucket**: This bucket is used to store assets for your CDK apps, such as Lambda deployment packages, Docker images, or CloudFormation templates. It's named cdktoolkit-stagingbucket-[unique ID].
2. **Ephemeral CloudFormation Stack**: Named CDKToolkit, this stack manages the resources required by the CDK, including the aforementioned S3 bucket and the IAM roles.
3. **IAM Roles**: The bootstrap process sets up roles that allow the CDK and CloudFormation to create and manage resources on your behalf.

![CDK Bootstrap cloudformation stack]({static}/images/aws-academy/50000000-cdk-bootstrap-stack.gif)


## How to Bootstrap Your AWS Account

1. **Initialization**: If you have already configured AWS CDK, and you're deploying a CDK app for the first time in an AWS environment (or a specific AWS region/account combination), you'll need to run:

```bash
cdk bootstrap
```