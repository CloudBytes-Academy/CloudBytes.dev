Title: Running Lambda Functions in a VPC with AWS CDK in Python
Date: 2025-03-24
Category: AWS Academy
Series: AWS CDK
series_index: 2080
Tags: aws, cdk, python
Author: Rehan Haider
Summary: Running Lambda Functions in a VPC with AWS CDK in Python
Keywords: lambda, cdk, vpc


We have created several lambda functions that are running in AWS owned default VPC. However, this means if you need to access any resources in your AWS account, the access is over the internet.

Hence, in several scenarios, you may need to run your lambda functions in a VPC, e.g.:

1. **Access to private resources such as EC2, RDS, etc**: If your Lambda function needs to access private resources inside a VPC (such as an RDS database that is not publicly accessible, an ElastiCache cluster, or an EC2 instance), you must place it inside the same VPC.
2. **Connecting to internal APIs or services**: If you have private APIs or services hosted inside the VPC, your Lambda function needs to be in the same VPC to call them.
3. **Using VPC Interface Endpoints (AWS PrivateLink)**: If your Lambda function needs to interact with AWS services like S3, DynamoDB, or SQS using VPC interface endpoints (AWS PrivateLink) for enhanced security (instead of going over the public internet).

This article will show you how to create a lambda function that is running in a VPC using AWS CDK in Python.


## Prerequisites

1. Ensure that you have [AWS CDK and SAM CLI installed]({filename}00000100-cdk-installing-cdk-sam-cli.md). 
2. If needed [create a new CDK application]({filename}50000020-cdk-new-app.md).
3. We need a VPC with private subnet. You can follow this [article]({filename}50002070-cdk-vpc-private-subnet.md) to create a VPC with private subnet.



## Creating a Lambda function in a VPC

We need the following 