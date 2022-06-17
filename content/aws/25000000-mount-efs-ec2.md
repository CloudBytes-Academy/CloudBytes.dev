Title: Mount Amazon EFS Drive on EC2 Ubuntu Linux using NFS Utils
Date: 2022-06-12
Category: AWS Academy
Tags: aws, linux
Author: Rehan Haider
Summary: How to mount Amazon Elastic File Storage (EFS) on Ubuntu Linux using NFS Utils and then use it to serve files from the EFS drive
Keywords: AWS, Python
Status: Draft

[TOC]

The first question that you should be asking yourself is, why not use `amazon-efs-utils` to [mount the EFS drive](https://docs.aws.amazon.com/efs/latest/ug/installing-amazon-efs-utils.html)?

In short, `amazon-efs-utils` package is only available for Amazon Linux and other Linux versions require you to build it from scratch. Also the fact that EFS is supposed to act like a Network File System (NFS) and that almost all Linux versions have an already available & extensively tested NFS Utilities. 

But to be totally fair, EFS mount helper abstracts several steps and is comparatively easier to use and comes with several security features out-of-the-box that requires custom configuration. But nevertheless, some Linux Admins would still prefer using NFS Utilities. 

## What is Amazon EFS?
Amazon Elastic File Storage (EFS) is a network mountable elastic shared drive. Which means, you can attach/mount it to your Linux machine as a network drive and it starts with a capacity of almost 0 and can easily grow into Petabytes of storage. 

### EFS mount on EC2 - How it works?

The below architecture diagram explains a typical use case of how EFS is used with EC2.

![EFS EC2 Architecure diagram]({static}/images/aws-academy/25000000-architecture-diagram.png)

1. The VM(s) that will mount the drive  are typically in their own subnets and security groups. In the example above, a webserver is connected to internet using port 80 or 443 and kept in a publicly accessible subnet.
2. The EFS drive could should ideally be kept in a separate subnet and security group.
3. The two security groups DMZ SG (which contains the EC2 instance) and the NFS SG (which contains the EFS drive) are connected to allow traffic between them over port 2049

### Project Lab Setup

in this tutorial, we will 

1. Create an EC2 webserver with Apache installed
2. Create an EFS drive 
3. Mount the EFS drive on the EC2 webserver
4. Download a image file onto the EFS drive
5. Create a basic HTML page that will display image

## How to mount an Amazon EFS? 

As hinted above, there are two ways you could do it. 

1. Use [EFS Mount Helper](https://docs.aws.amazon.com/efs/latest/ug/installing-amazon-efs-utils.html) 
2. Use [NFS Utilities](#mount-efs-using-nfs-utilities)

### Step 1) Create the security groups




### Step 1) Create EFS drive
Log on to [AWS Console](https://console.aws.amazon.com/), search for EFS and then click on EFS.

![AWS Console EFS]({static}/images/aws-academy/25000000-efs-console.png)

Click on "**Create file system**", 

a. Choose a name for your file system, I chose **myEFS**.

b. Under **Availability and durability** section, choose **One Zone**. Under **Availability Zone** choose `us-east-1a` and then click on **Create** button.

Now you should see a File system created named **myEFS** under **File systems** section.

![EFS File system created]({static}/images/aws-academy/25000000-efs-filesystem-created.png)

### Step 2) Customise EFS & Configure Security Group
Because we used the quick create option and didn't customize our EFS file system, it was created with several default settings such as:

1. **Automatic backups**: Enabled
2. **Lifecycle management**: EFS Intelligent tiering is enabled, and configured to transition files from Standard to Standard-Infrequent Access tier after 30 days of inactivity and to transition out on first access.
3. **Performance mode**: Only **General Purpose** is available for **One ZOne**.
4. **Throughput mode**: **Bursting** is selected by default. The alternative is **Provisioned**.
5. **Encryption**: Enabled
6. **Network access**: Default VPC, default subnet, and default security group associated with the Availability Zone is selected

While 1 - 5 are file, we need to modify the **Network access** to enable the EFS to communicate with the EC2 instance on port 2049.

**So first, we need to create the appropriate security group associated with the Availability Zone.**

a. In the [AWS Console](https://console.aws.amazon.com/), search for EC2 and then click on EC2.

b. In the left navigation, scroll down to **Network & Security** section and click on **Security Groups**.

c. Click on **Create Security Group** and give it a name of **NFS** and description as **NFS Security Group**.

d. Next, under **Inbound rules**, click on **Add rule**. 

e. In the new rule that was added, under **Type** select **NFS** from the dropdown. Under source, select 


a. In the left hand panel, click on **File systems**, then under **File system**, click on **myEFS**. At the bottom, select the **Network** tab. Then click on **Manage** button.

![EFS Network Settings]({static}/images/aws-academy/25000000-network-settings.png)



### Create EC2 instance with Ubuntu 

### Install & Validate NFS Utils

### Mount EFS using NFS Utilities

### Configure Auto-mount NFS

