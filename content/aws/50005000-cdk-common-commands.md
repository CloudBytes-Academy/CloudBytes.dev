Title: Basic AWS CDK Commands - list, diff, deploy, destroy
Date: 2023-10-25
Category: AWS Academy
Series: AWS CDK
series_index: 60
Tags: aws, cdk, python
Author: Rehan Haider
Summary: An introduction to some of the basic AWS CDK commands such as list, diff, deploy, and destroy
Keywords: AWS, cdk, python, list, diff, deploy, destroy


CDK has a set of basic commands that facilitate the management, deployment, and interactions of your cloud applications. This post will introduce you to some basic CDK commands that are essential for any developer starting their journey with the AWS CDK.

## Initialize a CDK project

To initialize a CDK project, run the following command:

```bash
cdk init app --language python
```

This needs to be run in an empty directory. This command will create a new directory called `cdk_app` with the following:

1. **CDK App**: Create a new CDK app in the current directory. It includes a `cdk.json` file that includes the configuration for the CDK app
2. **Stacks**: Create a folder called `cdk-app` in the current directory that includes the `stacks` that will be deployed
3. **Python Virtual Environment**: Create a Python virtual environment for the app in the .venv folder. It also creates a `requirements.txt` file that includes the Python dependencies for the app
4. **Git**: Create a git repository for the app including a `.gitignore` file

You can read more about this in the [Creating a new CDK app with Python]({filename}50001000-cdk-new-app.md) post.

## List the stacks

In most cases, you will have multiple stacks in your CDK app. To list all the stacks in your CDK app, run the following command:

```bash
cdk ls
```

You can also use `cdk list` instead of `cdk ls`.

## Synthesize the CloudFormation templates

Once you have created your CDK app, you can synthesize the CloudFormation templates for your stacks. To synthesize the CloudFormation templates, run the following command:

```bash
cdk synth
```

This will synthesize the CloudFormation templates for all the stacks in your CDK app. You can also synthesize the CloudFormation templates for a specific stack by running the following command:

```bash
cdk synth <stack_name>
```

Read more about working with multiple stacks in the [Working with multiple stacks]({filename}50004000-cdk-multiple-stacks.md) post.

## Compare between the current and the deployed stacks

After you have made changes to your CDK app, you can compare the changes between the current and the deployed stacks. To compare the changes, run the following command:

```bash
cdk diff
```

This will compare the changes between the current and the deployed stacks. You can also compare the changes for a specific stack by running the following command:

```bash
cdk diff <stack_name>
```

## Deploy the stacks

After you have made changes to your CDK app, you can deploy the stacks. To deploy the stacks, run the following command:

```bash
cdk deploy
```

This will deploy all the stacks in your CDK app. You can also deploy a specific stack by running the following command:

```bash
cdk deploy <stack_name>
```

## Destroy the stacks

If you want to delete all the resources created by your CDK app, you can destroy the stacks. To destroy the stacks, run the following command:

```bash
cdk destroy
```

This will destroy all the stacks in your CDK app. You can also destroy a specific stack by running the following command:

```bash
cdk destroy <stack_name>
```


