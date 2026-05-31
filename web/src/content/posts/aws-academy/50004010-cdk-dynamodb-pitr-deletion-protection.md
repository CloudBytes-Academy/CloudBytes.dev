---
title: "Configure DynamoDB point-in-time recovery and deletion protection using AWS CDK"
description: "How to enable point-in-time recovery and deletion protection for a DynamoDB table using AWS CDK in Python"
pubDate: "2026-05-31"
category: "AWS Academy"
categorySlug: "aws-academy"
slug: "configure-dynamodb-point-in-time-recovery-and-deletion-protection-using-aws-cdk"
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
    - "point in time recovery"
    - "pitr"
    - "deletion protection"
author: "Rehan Haider"
authorSlug: "rehan-haider"
series: "AWS CDK DynamoDB"
seriesIndex: 10
---

In the previous article, we created a basic DynamoDB table using AWS CDK. In this post, we will make the table safer by enabling
point-in-time recovery and deletion protection.

These two settings solve different problems:

1. **Point-in-time recovery** lets you restore a table to a previous point in time.
2. **Deletion protection** prevents accidental table deletion.

For a real table, especially one that stores user or business data, I would normally configure these before the table receives production
traffic.

## Prerequisites

1. Ensure that you have [AWS CDK and SAM CLI installed]({filename}00000100-cdk-installing-cdk-sam-cli.md).
2. Complete the previous article: [Create a DynamoDB table using AWS CDK in Python]({filename}50004000-cdk-dynamodb-create-table.md).
3. Configure your AWS CLI profile for the account and region where you want to deploy the table.

## What we will configure

We will update the DynamoDB stack to configure:

1. Point-in-time recovery.
2. Deletion protection.
3. A retain removal policy for safer stack deletion behavior.

The project file we will edit is:

```text
cdk_app/dynamodb_stack.py
```

## Update the DynamoDB table

Open `cdk_app/dynamodb_stack.py` and update the table definition:

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
            point_in_time_recovery_specification=dynamodb.PointInTimeRecoverySpecification(
                point_in_time_recovery_enabled=True,
            ),
            deletion_protection=True,
            removal_policy=RemovalPolicy.RETAIN,
        )

        CfnOutput(self, "TableName", value=table.table_name)
        CfnOutput(self, "TableArn", value=table.table_arn)
```

In the above code:

1. `dynamodb.Table` keeps the same construct we used in the first DynamoDB article.
2. `BillingMode.PAY_PER_REQUEST` keeps the table on on-demand billing.
3. `point_in_time_recovery_specification` enables point-in-time recovery.
4. `deletion_protection=True` prevents accidental table deletion.
5. `RemovalPolicy.RETAIN` tells CloudFormation to keep the table if the stack is deleted.

AWS CDK also has an older `point_in_time_recovery=True` option, but that property is now deprecated. Use `PointInTimeRecoverySpecification`
for new code.

!!! warning
    Do not use `RemovalPolicy.DESTROY` casually for a DynamoDB table that stores real data. If the table is important, use `RemovalPolicy.RETAIN` and make data deletion a deliberate manual step.

## Why not switch to TableV2 here?

AWS CDK also has a newer `dynamodb.TableV2` construct. It is useful for global table use cases and newer per-replica configuration options.

However, do not casually replace an existing `dynamodb.Table` construct with `dynamodb.TableV2` in a deployed stack. AWS documents this in
its
[Table to TableV2 migration guidance](https://aws.amazon.com/blogs/database/zero-downtime-dynamodb-construct-migration-from-table-to-tablev2-with-cdk-orphan/):
CloudFormation can treat that kind of construct migration as a resource replacement.

For this article, we are updating the table created in the previous lesson, so we keep using `dynamodb.Table`.

The table shape stays the same:

```python
partition_key=dynamodb.Attribute(
    name="todo_id",
    type=dynamodb.AttributeType.STRING,
)
```

And the billing mode stays the same:

```python
billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST
```

## Deploy the change

Before deploying, run `cdk diff`:

```bash
cdk diff
```

You should see that the DynamoDB table configuration will be updated.

If the diff looks correct, deploy the stack:

```bash
cdk deploy
```

After deployment, the table will have point-in-time recovery and deletion protection enabled.

## Verify point-in-time recovery

Get the table name from the stack output:

```bash
table_name=$(aws cloudformation describe-stacks \
    --stack-name DynamoDbStack \
    --query "Stacks[0].Outputs[?OutputKey=='TableName'].OutputValue" \
    --output text)
```

Then run:

```bash
aws dynamodb describe-continuous-backups \
    --table-name "$table_name"
```

In the response, check the `PointInTimeRecoveryDescription` section. The `PointInTimeRecoveryStatus` value should be `ENABLED`.

## Verify deletion protection

You can verify deletion protection with `describe-table`:

```bash
aws dynamodb describe-table \
    --table-name "$table_name" \
    --query "Table.DeletionProtectionEnabled"
```

The output should be:

```text
true
```

## What happens when you destroy the stack?

Because the table uses `RemovalPolicy.RETAIN`, CloudFormation will not delete the table when you destroy the stack. This is intentional.

Run the following command only if you are done testing the stack:

```bash
cdk destroy
```

After the stack is destroyed, the DynamoDB table can remain in your AWS account. That means you may still be charged for storage or requests
against the table.

## Fully delete the table

If this is only a tutorial table and you want to delete it completely, make deletion explicit.

First, update the table settings:

```python
# filename: cdk_app/dynamodb_stack.py

table = dynamodb.Table(
    self,
    "TodosTable",
    partition_key=dynamodb.Attribute(
        name="todo_id",
        type=dynamodb.AttributeType.STRING,
    ),
    billing_mode=dynamodb.BillingMode.PAY_PER_REQUEST,
    point_in_time_recovery_specification=dynamodb.PointInTimeRecoverySpecification(
        point_in_time_recovery_enabled=True,
    ),
    deletion_protection=False,
    removal_policy=RemovalPolicy.DESTROY,
)
```

Deploy the update:

```bash
cdk deploy
```

Then destroy the stack:

```bash
cdk destroy
```

!!! warning
    This deletes the DynamoDB table and the data inside it. Only do this for a tutorial table or after you have exported, backed up, or migrated the data.

## Next steps

Now that the table has basic safety settings, the next useful DynamoDB topic is to add a Global Secondary Index so we can query the same
table by a different access pattern.
