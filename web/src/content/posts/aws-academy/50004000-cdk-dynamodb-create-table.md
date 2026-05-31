---
title: "Create a DynamoDB table using AWS CDK in Python"
description: "How to create a DynamoDB table with AWS CDK in Python, output the table name, add a sample item, and clean up the stack"
pubDate: "2026-05-31"
category: "AWS Academy"
categorySlug: "aws-academy"
slug: "create-dynamodb-table-using-aws-cdk-in-python"
tags:
    - "aws"
    - "cdk"
    - "python"
    - "dynamodb"
keywords:
    - "aws"
    - "cdk"
    - "python"
    - "dynamodb"
    - "dynamodb table"
    - "partition key"
    - "on demand billing"
author: "Rehan Haider"
authorSlug: "rehan-haider"
series: "AWS CDK DynamoDB"
seriesIndex: 1
---

In this post, we will create a DynamoDB table using AWS CDK in Python. We will keep the table simple in this first article: one partition
key, on-demand billing, and a CloudFormation output so we can test it from the terminal.

This is the first article in the DynamoDB CDK series. Once the table is in place, we can build on it with sort keys, indexes, queries, and
backup settings in later articles.

## Prerequisites

1. Ensure that you have [AWS CDK and SAM CLI installed]({filename}00000100-cdk-installing-cdk-sam-cli.md).
2. If needed, [create a new CDK application]({filename}50000020-cdk-new-app.md).
3. Configure your AWS CLI profile for the account and region where you want to deploy the table.

## What we will create

We will create the following:

1. A DynamoDB table named by CloudFormation.
2. A string partition key called `todo_id`.
3. On-demand billing so we do not need to configure read and write capacity.
4. Stack outputs for the table name and table ARN.

The project files we will edit are:

```text
app.py
cdk_app/dynamodb_stack.py
```

## Create the DynamoDB stack

Create a new file named `dynamodb_stack.py` inside the `cdk_app` directory:

```python
# filename: cdk_app/dynamodb_stack.py

from aws_cdk import (
    CfnOutput,
    RemovalPolicy,
    Stack,
    aws_dynamodb as dynamodb,
)
from constructs import Construct


class DynamoDbStack(Stack):
    def __init__(self, scope: Construct, construct_id: str, **kwargs) -> None:
        super().__init__(scope, construct_id, **kwargs)

        table = dynamodb.Table(
            self,
            "TodosTable",
            partition_key=dynamodb.Attribute(
                name="todo_id",
                type=dynamodb.AttributeType.STRING,
            ),
            billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,
            removal_policy=RemovalPolicy.DESTROY,
        )

        CfnOutput(self, "TableName", value=table.table_name)
        CfnOutput(self, "TableArn", value=table.table_arn)
```

In the above code:

1. `dynamodb.Table` creates a DynamoDB table using the CDK L2 construct.
2. `partition_key` defines the primary key for the table. In our case, it is a string attribute named `todo_id`.
3. `BillingMode.PAY_PER_REQUEST` enables on-demand billing, so DynamoDB charges based on requests instead of provisioned capacity.
4. `RemovalPolicy.DESTROY` lets `cdk destroy` delete the table when we clean up.
5. `CfnOutput` prints the table name and ARN after deployment.

!!! warning
    `RemovalPolicy.DESTROY` is useful for tutorials because cleanup is simple. For production tables, use `RemovalPolicy.RETAIN` unless you have a deliberate backup and deletion plan.

## Register the stack in app.py

Now update `app.py` so CDK knows about the new stack:

```python
# filename: app.py

import aws_cdk as cdk

from cdk_app.dynamodb_stack import DynamoDbStack


app = cdk.App()

DynamoDbStack(app, "DynamoDbStack")

app.synth()
```

## Deploy the stack

Before deploying, run `cdk synth` to check that CDK can generate the CloudFormation template:

```bash
cdk synth
```

If there are no errors, deploy the stack:

```bash
cdk deploy
```

After deployment, CDK will show the stack outputs. We will use the `TableName` output to write and read a test item.

## Get the table name

Run the following command to get the DynamoDB table name from the CloudFormation stack output:

```bash
table_name=$(aws cloudformation describe-stacks \
    --stack-name DynamoDbStack \
    --query "Stacks[0].Outputs[?OutputKey=='TableName'].OutputValue" \
    --output text)
```

You can confirm the value by printing it:

```bash
echo "$table_name"
```

## Add an item to the table

Now add a test item using the AWS CLI:

```bash
aws dynamodb put-item \
    --table-name "$table_name" \
    --item '{
        "todo_id": {"S": "todo-1"},
        "title": {"S": "Learn DynamoDB with CDK"},
        "status": {"S": "OPEN"}
    }'
```

In the above command:

1. `todo_id` is the partition key.
2. `title` and `status` are regular attributes.
3. `S` means the attribute value is a string.

## Read the item from the table

Read the item back using `get-item`:

```bash
aws dynamodb get-item \
    --table-name "$table_name" \
    --key '{
        "todo_id": {"S": "todo-1"}
    }'
```

You should see an `Item` object in the response with the same attributes you inserted.

## Add a sort key

Many DynamoDB tables use both a partition key and a sort key. You can add a sort key when you create the table:

```python
# filename: cdk_app/dynamodb_stack.py

table = dynamodb.Table(
    self,
    "TodosTable",
    partition_key=dynamodb.Attribute(
        name="user_id",
        type=dynamodb.AttributeType.STRING,
    ),
    sort_key=dynamodb.Attribute(
        name="todo_id",
        type=dynamodb.AttributeType.STRING,
    ),
    billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,
    removal_policy=RemovalPolicy.DESTROY,
)
```

If you use a sort key, every `get-item` request must include both key values:

```bash
aws dynamodb get-item \
    --table-name "$table_name" \
    --key '{
        "user_id": {"S": "user-1"},
        "todo_id": {"S": "todo-1"}
    }'
```

!!! warning
    The table key schema is part of the table design. Changing the partition key or sort key later usually means replacing the table or creating a new one and migrating the data.

## Cleanup

When you are done testing, destroy the stack:

```bash
cdk destroy
```

Because this tutorial used `RemovalPolicy.DESTROY`, the DynamoDB table and the data inside it will be deleted with the stack.

## Next steps

Now that we can create a basic DynamoDB table, the next useful topics are:

1. Configure point-in-time recovery and deletion protection.
2. Add a Global Secondary Index.
3. Query items by partition key and sort key.
4. Use the table from a Lambda function when you are ready to connect DynamoDB to an application workflow.
