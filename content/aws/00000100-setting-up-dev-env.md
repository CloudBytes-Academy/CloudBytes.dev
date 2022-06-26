Title: Setup you dev environment for use with AWS
Date: 2022-06-26
Category: AWS Academy
Tags: aws
Author: Rehan Haider
Summary: Instructions on how to setup the optimial development environment for use with AWS and this course
Keywords: AWS


To complete this course, configure your system as per the instructions below per your OS.

## Windows 10/11

Follow the below instructions to setup your dev environment for use with AWS.


1. Install **Windows Terminal** from **[Microsoft Store](https://apps.microsoft.com/store/detail/windows-terminal/9N0DX20HK701?hl=en-us&gl=US)**.
2. Install **WSL2 (Windows Subsystem for Linux 2)** on you PC by following **[these instructions]({filename}/articles/99999965-install-wsl2.md)**
3. Open ***Windows Terminal*** and run `wsl` to login to your **WSL2 environment**
4. Follow **[these instructions]({filename}/aws/12500000-aws-cli-intro.md)** to install and configure **AWS CLI**


## Linux

Follow **[these instructions]({filename}/aws/12500000-aws-cli-intro.md)** to install and configure **AWS CLI** on **Ubuntu Linux**. 

## MacOS

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