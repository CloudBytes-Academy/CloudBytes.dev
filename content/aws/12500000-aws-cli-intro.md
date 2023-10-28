Title: How to install and configure AWS CLI on Linux with Autocompletion
Date: 2023-10-28
Category: AWS Academy
Series: AWS CLI
Series_index: 1
Tags: aws, linux
Author: Rehan Haider
Summary: A guide to how to install and configure AWS CLI on Ubuntu Linux with Autocompletion turned on
Keywords: AWS

[TOC]

AWS provides several tools to help you manage and automate your AWS environment. Some of the key ones are

1. **AWS CLI** - The command line interface for AWS
2. **AWS SAM CLI** - The command line interface for AWS Serverless Application Model
3. **AWS CDK** - The AWS Cloud Development Kit
4. **AWS Chalice** - The AWS Serverless Development Framework

## What is AWS CLI?

[AWS CLI](https://docs.aws.amazon.com/cli/latest/userguide/cli-chap-welcome.html) (Command Line Interface) is an [open source tool hosted on GitHub](https://github.com/aws/aws-cli) that allows you to interact with AWS services from the command line shell on Linux, Mac OS, or Windows. 

You can use AWS CLI on either [bash](https://www.gnu.org/software/bash/), [zsh](http://www.zsh.org/), or [tcsh](https://www.tcsh.org/) shells on Linux/MacOS and PowerShell on Windows. Additionally, AWS CLI is installed by default on all AWS Linux EC2 instances.

AWS CLI can manage all IaaS (Infrastructure as a Service) services that are available in AWS Management Console.

## Installing AWS CLI on Ubuntu Linux

**Step 1)** First, update your Ubuntu Linux system and install `unzip` and `curl` packages.

```bash
sudo apt update && sudo apt upgrade -y && sudo apt install unzip curl -y
```

**Step 2)** Then download & unzip AWS CLI.

```bash
curl "https://awscli.amazonaws.com/awscli-exe-linux-x86_64.zip" -o "awscliv2.zip" \
   && unzip awscliv2.zip
```

**Step 3)** Finally, install AWS CLI.

```bash
sudo ./aws/install
```

Verify that you can use the AWS CLI by running the following command:

```bash
aws --version
```

## Configuring AWS CLI for use

AWS CLI relies on **"Programmatic Access"** credentials to access AWS services.

Ideally, you should create an IAM User Account with only programmatic access to use with AWS CLI as shown below.

### Create a new IAM User Account with Admin Access

1. Login to [AWS Management Console](https://console.aws.amazon.com/) and navigate to [IAM](https://console.aws.amazon.com/iam/home)
2. On the left navigation pane, click on **Users**
3. CLick on **Add users**
4. Choose a username & select only **Programmatic access** under **Select AWS access type**, then click **Next: Permissions**

![Add AWS User]({static}/images/aws-academy/12500000-aws-iam-type.png)

5. Then click on **Attach existing policies** and select **AdministratorAccess** from the list of available policies. Then click **Next: Tags**
6. You can leave the **Tags** empty and click **Next: Review**
7. Click **Create user** to create your new IAM User Account

Keep this window open for now, and notice the **Access key ID** & **Secret access key**. This will be needed in next step.

> !!! danger "WARNING: Never store this credentials anywhere or share them with anyone. An attacker can user your credentials to create AWS resources in your account. If you need to reconfigure, you can generate a new credentials from IAM screen."

![Add AWS User]({static}/images/aws-academy/12500000-aws-new-iam-user.png)



### Configure AWS CLI to use the new IAM User Account
Open a terminal and run the following command:

```bash
aws configure
```

This will start an interactive session, copy paste your access keys and secret access keys that was generated in previous step when prompted

```bash
aws configure
AWS Access Key ID [None]: <your access key id>
AWS Secret Access Key [None]: <your secret access key>
Default region name [None]: us-east-1
Default output format [None]: json
```

## Configuring AWS CLI for Autocompletion

AWS CLI relies on a module named `aws_completer` for autocompletion. This module should be installed while installing AWS CLI however, for it to work correctly it requires

1. `aws_completer` to be on the `PATH`
2. Enable command completion in the shell

### Ensure `aws_completer` is added to the PATH

First, check if the `aws_completer` is already on path by running the following command:

```bash
which aws_completer
```

This should result in the following output:
![Which AWS Completer]({static}/images/aws-academy/12500000-which-aws-completer.png)


If you get the above output, it means that the `aws_completer` is already on the `PATH`. So you can skip to [Enable command completion in the shell](#enable-command-completion-in-the-shell) section.

Otherwise if you don't see any output, it means that the `aws_completer` is not on the `PATH`, follow the steps below to add it to the `PATH`.

### Add `aws_completer` to the PATH

**Step 1**: Find `aws_completer` executable file by running the following command:

```bash
find / -name aws_completer
```

This will search for the `aws_completer` executable file in your filesystem. E.g. if you scroll through the results, you should see something similar to the following output:

![Find AWS Completer]({static}/images/aws-academy/12500000-aws-completer-path.png)

**Step 2**: Identify your shell and add the `aws_completer` to the `PATH`. 

Run `echo $SHELL` to see what shell you are using. 

![Echo Shell]({static}/images/aws-academy/12500000-shell-type.png)

If you are using some other shell, you will get a different output.

**Step 3**: Find the shell configuration file for your shell.

Depending on the shell you're using, your shell's profile file will be one of the following:

- **Bash**: `.bash_profile`, `.bash_login`, or `.profile`
- **Zsh**: `.zshrc`
- **Tcsh**: `.tcshrc`, `.cshrc`, or `.login`

Find your shell's profile file by running the following command and look for profile file as per above

```bash
ls -a ~/.bash_profile ~/.bash_login ~/.profile ~/.zshrc ~/.tcshrc ~/.cshrc ~/.login
```

You will get a bunch of "*No such file or directory*" errors except for the shell profile file.

E.g. in my case, I am using `bash` and my profile file is `.profile` thus running the above command will result in the following output:

![Find Shell Profile]({static}/images/aws-academy/12500000-bash-profile.png)

**Step 4**: Add the `aws_completer` to the `PATH`

Now open the shell profile using any text editor, e.g. `vi` or `nano` and add the following line to the end of the file and replace `<path to aws_completer directory>` with the path to the `aws_completer` executable file discovered in step 2:


```text
export PATH=<path to aws_completer directory>:$PATH
```

**Step 5**: Restart your shell

Depending upon the shell, restart your shell by running the following command by replacing `<your profile file>` with the name of your shell profile file as per step 4:


```text
source ~/<your profile file>
```

E.g. in my case, this would be `source ~/.profile`

### Enable command completion in the shell

After you have added the `aws_completer` to the `PATH`, you need to perform a few steps to enable command completion depending on your shell.

- **bash**: Open the `.bashrc` file in your home directory and add the following line to the end of the file:

```text
complete -C '<path to aws_completer directory>/aws_completer' aws
```

E.g. in my case, the above would be 

```text
complete -C '/usr/local/bin/aws_completer' aws
```

- **zsh**: Open the `.zshrc` file in your home directory and add the following line to the end of the file:

```text
autoload bashcompinit && bashcompinit
autoload -Uz compinit && compinit
complete -C '<path to aws_completer directory>/aws_completer' aws
```

- **tcsh**: Open the `.tcshrc` file in your home directory and add the following line to the end of the file:

```text
complete aws 'p/*/`aws_completer`/'
```

### Verify that the command completion is working

Reload your shell configuration file, replace `<your profile file>` with the appropriate shell configure file

```text
source ~/<your shell config file>
```

Then type `aws s3` and press `TAB` to see the list of available commands.

You AWS CLI is configure and autocomplete is working.