Title: Install and configure AWS Cloud Development Kit (AWS CDK)
Date: 2023-10-15
Category: AWS Academy
Series: AWS CDK
series_index: 2
Tags: aws, cdk
Author: Rehan Haider
Summary: A guide to how to install and configure AWS CDK on Windows 10/11, MacOS, and WSL2/Linux.
Keywords: AWS

In this article, we will learn how to install and configure AWS CDK and SAM CLI. This is a prerequisite for the AWS CDK series. There are two steps to this process:
1. Install NVM and Node.js
2. Install AWS CDK CLI using NPM
3. Install AWS SAM CLI

Now you may think why do we need to install NVM and Node.js instead when we will use Python? 

Well, AWS CDK CLI is mainly available as a NPM package so installing it from NPM is the easiest way. This allows us to use the CDK CLI to create and manage CDK projects. 

The actual CDK project will be written in Python but we will use the CDK CLI to create and manage the project.

## Prerequisites

1. **AWS CLI**: Follow the guide [here]({filename}/aws/12500000-aws-cli-intro.md) to install and configure AWS CLI for your operating system.
2. **AWS SAM CLI**: Follow the guide [here](https://docs.aws.amazon.com/serverless-application-model/latest/developerguide/install-sam-cli.html) to install and configure AWS SAM CLI for your operating system.


## Install NPM & Node.js

1. [For WSL2 on Windows 10/11 or Linux](#for-wsl2-on-windows-1011)
2. [For Windows 10/11](#for-windows-1011)
3. [For MacOS](#for-macos) 


### For WSL2 on Windows 10/11 or Linux
We will be using Ubuntu 22.04 LTS on WSL2 on Windows 10/11 for this series. But this guide should work for any other version. We will install NVM, Node.js, AWS CDK, and AWS SAM CLI.

a) Let's first make sure curl is installed.
```bash
sudo apt-get install curl -y
```

b) Then, install NVM & NPM using the following command.
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/master/install.sh | bash
```

c) Then, restart the shell then run the below command to verify that NVM is installed.
```bash
nvm --version
```

d) Now, install Node.js using the following command. I prefeer installing the LTS version to ensure a bug-free experience.
```bash
nvm install --lts
```

![Install Node.js using NVM]({static}/images/aws-academy/00000000-01-wsl2-nvm-nodejs.png)

After this, jump to the [Install AWS CDK CLI](#install-aws-cdk-cli) section.

### For Windows 10/11

If WSL2 is not available, you can install Node.js on Windows 10/11 directly.

a) First, install `nvm-windows` by downloading the installer from [here](https://github.com/coreybutler/nvm-windows/releases/download/1.1.11/nvm-setup.exe).
![Install nvm-windows]({static}/images/aws-academy/00000000-02-nvm-windows-installer.png)


b) Confirm the installation by running the following command in PowerShell.
```powershell
nvm --version
```

c) Finally, install Node.js using the following command.
```powershell
nvm install lts
```

![Install Node.js using nvm-windows]({static}/images/aws-academy/00000000-03-windows-nvm-nodejs.png)

After this, jump to the [Install AWS CDK CLI](#install-aws-cdk-cli) section.

### For MacOS

a) For MacOS, you need `homebrew` installed. If you don't have it installed, you can install it using the following command.

```bash
/bin/bash -c "$(curl -fsSL https://raw.githubusercontent.com/Homebrew/install/HEAD/install.sh)"
```

b) Add `homebrew` to your PATH by running the following command.
```bash
echo "# Homebrew\nexport PATH=/opt/homebrew/bin:\$PATH" >> .zshrc
```

c) Then, restart the shell.
```bash
source ~/.zshrc
```

d) Install nvm using the following command.
```bash
brew install nvm
```

e) We will need to create a directory for nvm to store its files. Run the following command to create the directory.
```bash
mkdir ~/.nvm
```

f) Then, nvm to to your `~/.zshrc` profile.
```bash
echo "export NVM_DIR=~/.nvm\nsource \$(brew --prefix nvm)/nvm.sh" >> .zshrc
```

g) Restart the shell again.
```bash
source ~/.zshrc
```

h) Finally, install Node.js using the following command.
```bash
nvm install --lts
```

## Install AWS CDK CLI

Now that we have installed NVM and Node.js, we can install AWS CDK CLI using NPM.

Run the following command to install AWS CDK CLI.
```bash
npm install -g aws-cdk
```

![Install AWS CDK CLI]({static}/images/aws-academy/00000000-04-aws-cdk-install.png)