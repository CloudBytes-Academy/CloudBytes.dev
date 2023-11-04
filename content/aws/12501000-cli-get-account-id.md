Title: Get your AWS Account ID using AWS CLI
Date: 2023-10-28
Category: AWS Academy
Series: AWS CLI
Series_index: 2
Tags: aws, linux
Author: Rehan Haider
Summary: A guide to how to get your AWS Account ID using AWS CLI
Keywords: AWS, cli



If you have not already done so, [install and configure AWS CLI]({filename}12500000-aws-cli-intro.md). 

## Get your AWS Account ID

To get your AWS Account ID, run the following command:

```bash
aws sts get-caller-identity --query Account --output text
```

This command uses the Security Token Service (STS) get-caller-identity function, which returns details about the IAM user or role making the call. The --query Account fetches only the Account ID, and --output text ensures the result is displayed as plain text.

![STS caller identify]({static}/images/aws/12501000-01-cli-id-output-text.png)


### Understanding the output

The output of the `get-caller-identity` command provides three pieces of information:

* `UserId`: The unique identifier for the entity making the call. For an IAM user, this is the user's unique ID.
* `Account`: Your AWS Account ID.
* `Arn`: The Amazon Resource Name (ARN) of the IAM user or role making the call.

By using the `--query Account` parameter, we specifically extract the Account value.


### Saving the output to file

You can save the output of the `get-caller-identity` command to a file using the `>` operator as shown below:

```bash
aws sts get-caller-identity --query Account --output text > account-id.txt
```

This will save the output to a file called `account-id.txt` in the current directory.

![STS caller identify]({static}/images/aws/12501000-02-cli-id-to-file.png)