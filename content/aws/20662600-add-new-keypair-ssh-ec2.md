Title: Add new users with SSH access to EC2 instance
Date: 2025-04-30
Category: Snippets
Tags: aws, ec2
Author: Rehan Haider
Summary: How to new additional user with keypair for SSH access to EC2 instance
Keywords: aws, ec2, ssh, keypair


How do you deal with situations such as when you need to provide somebody else with SSH access to your EC2 instance? You can create a new user and add a new keypair for that user. This guide will show you how to do that.

## Pre-requisites

You need an EC2 instance running with SSH access. You can create a new EC2 instance through the [AWS Console]({filename}18750100-create-ec2-instance-console.md) or the [AWS CLI]({filename}aws/18750200-create-ec2-instance-using-cli.md).


## Login to the EC2 instance
You can login to the EC2 instance using the SSH keypair you created when launching the instance. For example, if you created a keypair named `my-key-pair`, you can login to the instance using the following command:

```bash
ssh -i <my-key-pair.pem> <username>@<public-ip-address>
```

Replace `<my-key-pair.pem>` with the path to your keypair file, `<username>` with the username of the instance (e.g., `ec2-user` for Amazon Linux, or `ubuntu` for Ubuntu), and `<public-ip-address>` with the public IP address of your EC2 instance.


## Create a new user
Once you are logged in to the EC2 instance, you can create a new user using the following command:

```bash
sudo adduser <new-username>
```

Replace `<new-username>` with the desired username for the new user. For example, if you want to create a user named `john`, you would run:

```bash
sudo adduser john
```
## Create a new SSH keypair

1. First, let's create a folder for the new user to store their SSH keys. You can do this by running the following command:

```bash
sudo mkdir /home/<new-username>/.ssh
```
2. Next, set the owner of the `.ssh` directory to the new user:

```bash
sudo chown <new-username>:<new-username> /home/<new-username>/.ssh
```

3. Next, set the correct permissions for the `.ssh` directory:

```bash
sudo chmod 700 /home/<new-username>/.ssh
```

4. You can create a new SSH keypair for the new user using the following command:

```bash
sudo ssh-keygen -t rsa -b 2048 -f /home/<new-username>/.ssh/id_rsa
```
Replace `<new-username>` with the username you created in the previous step. This command will create a new SSH keypair with a 2048-bit RSA key and save it to the specified location.
The private key will be saved as `/home/<new-username>/.ssh/id_rsa` and the public key will be saved as `/home/<new-username>/.ssh/id_rsa.pub`. You can change the file name and location as needed.

## Add public key to the authorized_keys file

1. Next, you need to add the public key to the `authorized_keys` file for the new user. You can do this by running the following command:
```bash
sudo cp /home/<newuser>/.ssh/id_rsa.pub /home/<newuser>/.ssh/authorized_keys
```

2. Set the correct ownership for the `authorized_keys` file:

```bash
sudo chown <newuser>:<newuser> /home/<newuser>/.ssh/authorized_keys
```

3. Set the correct permissions for the `authorized_keys` file:

```bash
sudo chmod 600 /home/<newuser>/.ssh/authorized_keys
```

## Ensure correct permissions for the .ssh directory

1. Set the owner of the `.ssh` directory to the new user:

```bash
sudo chown -R <newuser>:<newuser> /home/<newuser>/.ssh
```

2. Set the correct permissions for the `.ssh` directory:

```bash
sudo chmod 700 /home/<newuser>/.ssh
```

## Get the private key

The private key is saved in the file `/home/<newuser>/.ssh/id_rsa`. You can download this file to your local machine using `scp` or any other file transfer method. Make sure to keep the private key secure and do not share it with anyone else.
