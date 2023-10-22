Title: Setup your dev environment for use with AWS
Date: 2023-10-22
Category: AWS Academy
Series: AWS CDK
series_index: 1
Tags: aws
Author: Rehan Haider
Summary: Instructions on how to setup the optimial development environment for use with AWS and this course
Keywords: AWS


To complete this course, configure your system as per the instructions below per your OS. I personally use **Windows 10/11** with **WSL2** and **Ubuntu 22.04 LTS**. 

However, follow the instructions below as per your OS of choice:

1. **[WSL2 on Windows 10/11](#wsl2-on-windows-1011)**
2. **[Ubuntu Linux](#ubuntu-linux)**
3. **[Windows 10/11](#windows-1011)**
4. **[MacOS](#macos)**

We will install the following tools:

1. **VSCode** for editing code
2. **Docker Desktop** for running containers
3. **AWS CLI** for interacting with AWS


After that we will install **AWS CDK** for creating and managing AWS resources.

## WSL2 on Windows 10/11

a) Install the following prerequisites:

1. Install **Windows Terminal** from **[Microsoft Store](https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701?hl=en-us&gl=US)**.
2. Install VSCode from **[Microsoft VSCode Website](https://code.visualstudio.com/download)**
3. Install **[Docker for Desktop](https://www.docker.com/products/docker-desktop/)**

b) After that, follow the below instructions to install and configure WSL2 on Windows 10/11.

1. Install **WSL2 (Windows Subsystem for Linux 2)** on you PC by following **[these instructions]({filename}/articles/99999965-install-wsl2.md)**
2. Open ***Windows Terminal*** and run `wsl` to login to your **WSL2 environment**

c) Once you're logged into your WSL2 environment, follow the below instructions to install and configure AWS CLI.

1. Follow **[these instructions]({filename}/aws/12500000-aws-cli-intro.md)** to install and configure **AWS CLI**


Now you can proceed to [CDK installation instructions below](#install-aws-cdk).


## Ubuntu Linux

a) Install the following prerequisites:

1. Install VSCode from **[Microsoft VSCode Website](https://code.visualstudio.com/download)**
2. Install **[Docker for Desktop](https://www.docker.com/products/docker-desktop/)**

b) After that, follow the below instructions to install and configure AWS CLI.

1. Follow **[these instructions]({filename}/aws/12500000-aws-cli-intro.md)** to install and configure **AWS CLI**


Now you can proceed to [CDK installation instructions below](#install-aws-cdk).

## Windows 10/11

a) Install the following prerequisites:

1. Install **Windows Terminal** from **[Microsoft Store](https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701?hl=en-us&gl=US)**.
2. Install VSCode from **[Microsoft VSCode Website](https://code.visualstudio.com/download)**
3. Install **[Docker for Desktop](https://www.docker.com/products/docker-desktop/)**


b) After that, follow the below instructions to install and configure AWS CLI.

1. Download and install the **[AWS CLI MSI Installer](https://awscli.amazonaws.com/AWSCLIV2.msi)**
2. Use these **[instructions to configure AWS CLI for usage]({filename}/aws/12500000-aws-cli-intro.md#configuring-aws-cli-for-use)**

Now you can proceed to [CDK installation instructions below](#install-aws-cdk).



## MacOS

a) Install the following prerequisites:

1. Install VSCode from **[Microsoft VSCode Website](https://code.visualstudio.com/download)**
2. Install **[Docker for Desktop](https://www.docker.com/products/docker-desktop/)**

b) Proceed to **AWS CLI** installation instructions below. You need `sudo` access.

To install **AWS CLI** on **MacOS**, first download the latest AWS CLI package from AWS by running

```bash
curl "https://awscli.amazonaws.com/AWSCLIV2.pkg" -o "AWSCLIV2.pkg"
```

Next, install the package by running

```bash
sudo installer -pkg AWSCLIV2.pkg -target /
```

Verify that AWS CLI has been installed & added to path by running

```bash
aws --version
```
c) You have to configure **[AWS CLI for usage by following these instructions]({filename}/aws/12500000-aws-cli-intro.md#configuring-aws-cli-for-use)**


Now you can proceed to [CDK installation instructions below](#install-aws-cdk).

## Install AWS CDK

Now that we have installed all the prerequisites, [we can install AWS CDK by following this guide]({filename}/aws/00000100-cdk-installing-cdk-sam-cli.md).