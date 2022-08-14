Title: How to Install and Run WordPress on an EC2 Instance
Date: 2022-08-12
Category: AWS Academy
Tags: aws, linux, wordpress
Author: Rehan Haider
Summary: A detailed guide on how to configure, install, and run WordPress on an EC2 instance. This guide will cover installation of NGINX, PHP, MySQL, and WordPress (LEMP stack) on Amazon Linux 2
Keywords: AWS, EC2, wordpress, nginx, php, mysql, lemp


There are few technologies that divides the Web Developers as sharply as [WordPress](https://wordpress.org/). Launched in 2003, WordPress is a content management system (CMS) for creating and managing web sites that is **estimated to power more than 42% of websites** in the world.

It is loved by users because of it's Free and Open Source (FOSS) nature but hated by developers due to it's clunky and bloated codebase under the hood. 

Nevertheless, WordPress is going nowhere hence in this guide we will cover how to install, configure, and run WordPress on an EC2 instance.

## How to install WordPress on an EC2 instance?

We will do the following steps to install WordPress on an EC2 instance:

1. [Create an EC2 instance](#create-an-ec2-instance)
2. [Install NGINX](#install-nginx)
3. [Install PHP](#install-php)
4. [Configure NGINX to serve PHP](#configure-nginx-to-serve-php)
5. [Install MySQL/MariaDB](#install-mysqlmariadb)
6. [Configure & Secure MySQL/MariaDB](#configure-secure-mysqlmariadb)
7. [Create the database](#create-the-database)
8. [Configure WordPress](#configure-wordpress)
9. [Start WordPress](#start-wordpress)

### Create an EC2 instance

We will use the instructions in this [previous guide]({filename}/aws/18750200-create-ec2-instance-using-cli.md) to create an EC2 instance using AWS CLI. 

If you wish to use AWS Management Console instead, follow the steps in [this guide]({filename}/aws/18750100-create-ec2-instance-console.md).


We will use `Amazon Linux 2` AMI and `t2.micro` instance for this tutorial.


a) Run the below script to create an EC2 instance:

```bash
AMI_ID=ami-090fa75af13c156b4
echo "Using AMI_ID: $AMI_ID"


INSTANCE_TYPE=t2.micro
echo "Using INSTANCE_TYPE: $INSTANCE_TYPE"

aws ec2 create-key-pair \
    --key-name my-key-pair \
    --query 'KeyMaterial' \
    --output text > my-key-pair.pem

chmod 400 my-key-pair.pem
echo "Created my-key-pair.pem"

SECURITY_GROUP=$(aws ec2 create-security-group \
    --group-name "my-web-sg" \
    --description "Web security group" \
    --query 'GroupId' \
    --output text) && \
echo "Security group created with id $SECURITY_GROUP"

aws ec2 authorize-security-group-ingress \
    --group-id $SECURITY_GROUP \
    --protocol tcp \
    --port 22 \
    --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
    --group-id $SECURITY_GROUP \
    --protocol tcp \
    --port 80 \
    --cidr 0.0.0.0/0

aws ec2 authorize-security-group-ingress \
    --group-id $SECURITY_GROUP \
    --protocol tcp \
    --port 443 \
    --cidr 0.0.0.0/0


SUBNET_ID=$(aws ec2 describe-subnets \
    --filters "Name=availability-zone,Values=us-east-1a" \
    --query "Subnets[0].SubnetId" --output text) && \
    echo "Subnet ID for us-east-1a: $SUBNET_ID"


INSTANCE_ID=$(aws ec2 run-instances \
    --image-id $AMI_ID \
    --count 1 \
    --instance-type $INSTANCE_TYPE \
    --key-name my-key-pair \
    --security-group-ids $SECURITY_GROUP \
    --subnet-id $SUBNET_ID \
    --associate-public-ip-address \
    --tag-specifications 'ResourceType=instance,Tags=[{Key=Name,Value=my-ec2-instance}]' \
    --block-device-mappings '[{"DeviceName":"/dev/xvda","Ebs":{"VolumeSize":20,"VolumeType":"gp2"}}]' \
    --query 'Instances[0].InstanceId' \
    --output text) && \
echo "Instance launched with id $INSTANCE_ID"
```

b) Next, let's assign a static Elastic IP address to the instance.

```bash
aws ec2 allocate-address \
    --domain vpc \
    --query 'AllocationId' \
    --output text > my-eip.txt

aws ec2 associate-address \
    --allocation-id $(cat my-eip.txt) \
    --instance-id $INSTANCE_ID
```

c) Get the IP address of the instance:

```bash
INSTANCE_IP=$(aws ec2 describe-instances \
    --instance-ids $INSTANCE_ID \
    --query 'Reservations[0].Instances[0].PublicIpAddress' \
    --output text)
echo "Instance IP: $INSTANCE_IP"
```

d) Login to the EC2 instance:

```bash
ssh -i my-key-pair.pem ec2-user@$INSTANCE_IP
```
Type `yes` to accept the RSA fingerprint and login to the server.

You should see the welcome message similar to below:

![Login to EC2 Instance]({static}/images/aws-academy/22575000-01-login-to-ec2-instance.png)


e) Update the packages by running the following command:

```bash
sudo yum update -y
```


f) Use the which command to confirm `amazon-linux-extras` is installed:

```bash
which amazon-linux-extras
```

You should see the following output:

```bash
/usr/bin/amazon-linux-extras
```

If you get an error, install the `amazon-linux-extras` package:

```bash
sudo yum install -y amazon-linux-extras
```

### Install NGINX

a) Check if NGINX is available from `amazon-linux-extras` repository:

```bash
sudo amazon-linux-extras list | grep nginx
```
This will list the latest version of NGINX available in the repository and its installation name.

![Check nginx amazon linux extras]({static}/images/aws-academy/22575000-02-check-nginx-amazon-extras.png)

b) Enable the NGINX package for installation:

```bash
sudo amazon-linux-extras enable nginx1
```

This will print out the modules that have been enabled.

c) Install NGINX:

```bash
sudo yum clean metadata && sudo yum install nginx -y
```

d) Confirm that NGINX is installed by checking the version:

```bash
nginx -v
```

e) Start NGINX:

```bash
sudo systemctl start nginx
```

Now if you open the IP address of the instance in your browser, you should see the following message:

![NGINX is running]({static}/images/aws-academy/22575000-03-nginx-is-running.png)

f) Configure NGINX to start on boot:

```bash
sudo systemctl enable nginx
```

### Install PHP

a) Check the versions of PHP available in the repository:

```bash
sudo amazon-linux-extras list | grep php
```

![Check php versions]({static}/images/aws-academy/22575000-04-php-versions.png)

b) Enable the PHP package for installation:

```bash
sudo amazon-linux-extras enable php8.0
```

c) Install PHP:

```bash
sudo yum clean metadata && sudo yum install yum install php-cli php-pdo php-fpm php-mysqlnd -y
```

d) Confirm that PHP is installed by checking the version:

```bash
php -v
```

e) Start PHP:

```bash
sudo systemctl start php-fpm
```

f) Configure PHP to start on boot:

```bash
sudo systemctl enable php-fpm
```

### Configure NGINX to serve PHP

By default NGINX is configured to use `/usr/share/nginx/html` as the web root with the directory owned by `root` user. 

So if you wanted to edit the `index.html` file, you would need to run the below command, you will get an `Permission denied` error message:

```bash
echo "Hello World" > /usr/share/nginx/html/index.html
```

To fix this we will need to change the ownership of the web root to `nginx` user and add `ec2-user` to the group.

a) First create a new group called `nginx`:

```bash
sudo groupadd www-data
```

b) Add `ec2-user` to the group:

```bash
sudo usermod -a -G nginx ec2-user
```

c) Change the ownership of the web root to `www-data` user:

```bash
sudo chown -R ec2-user:nginx /usr/share/nginx/html
```
d) Logout and login again to pick up the group and new permissions:

```bash
exit
```

e) Restart NGINX:

```bash
sudo systemctl restart nginx
```

f) Create a new file called `phpinfo.php` in the web root that calls `phpinfo()`:

```bash
echo "<?php phpinfo(); ?>" > /usr/share/nginx/html/phpinfo.php
```

g) Now open the `<ip-address>/phpinfo.php` in your browser and you should see the following message:

![PHP Info]({static}/images/aws-academy/22575000-05-php-info.png)


h) Delete the `phpinfo.php` file. It contains sensitive information about your system that you should not share.

```bash
rm /usr/share/nginx/html/phpinfo.php
```

### Install MySQL/MariaDB

MySQL is not really an open source software now, instead we will use the open source fork `MariaDB`.

a) Check the versions of MariaDB available in the repository:

```bash
sudo amazon-linux-extras list | grep mariadb
```

b) Enable the MariaDB package for installation:

```bash
sudo amazon-linux-extras enable mariadb10.5
```

c) Install MariaDB:

```bash
sudo yum clean metadata && sudo yum install mariadb -y
```

d) Confirm that MariaDB is installed by checking the version:

```bash
mysql --version
```

e) Start MariaDB:

```bash
sudo systemctl start mariadb
```

f) Configure MariaDB to start on boot:

```bash
sudo systemctl enable mariadb
```

### Configure & Secure MySQL/MariaDB

a) Start the interactive MariaDB installation shell:

```bash
sudo mysql_secure_installation
```

b) When prompted for current the root password, press `Enter` to accept the default. By default, there is no password set.

c) Next, you will be prompted to `Switch to unix_socket authentication [Y/n]`, type `Y` to accept. This will allow you to connect to the database using your EC2 command line directly.

d) Then change the root password to something secure. Type `Y` then enter the new password and reconfirm.

e) Next, you will be prompted to `Remove anonymous users [Y/n]`, type `Y` to accept.

f) Next, you will be prompted to `Disallow root login remotely [Y/n]`, type `Y` to accept.

g) Next, you will be prompted to `Remove test database and access to it [Y/n]`, type `Y` to accept.

h) Next, you will be prompted to `Reload privilege tables now [Y/n]`, type `Y` to accept.

This will complete the installation.

### Create the database 

a) Login to the MariaDB shell:

```bash
mysql -u root -p
```

b) Create a new database called `dbase`:

```bash
CREATE DATABASE dbase;
```

Exit the MariaDB shell:

```bash
exit
```

### Install WordPress

a) Download the latest WordPress release from [wordpress.org](https://wordpress.org/latest.zip).

```bash
wget https://wordpress.org/latest.zip
```

b) Unzip the WordPress release:

```bash
unzip latest.zip
```

c) Move the WordPress files to the web root:

```bash
mv wordpress/* /usr/share/nginx/html
```

d) Change the ownership of the web root to `nginx` user:

```bash
sudo chown -R ec2-user:nginx /usr/share/nginx/html
```

d) Delete the WordPress files:

```bash
rm -rf wordpress
```

### Configure WordPress

a) Navigate to the web root

```bash
cd /usr/share/nginx/html
```

b) Create a new file called `wp-config.php` from `wp-config-sample.php`:

```bash
cp wp-config-sample.php wp-config.php
```

c) Edit the `wp-config.php` 

```bash
nano wp-config.php
```
Make sure you don't use `sudo` when editing the file.

d) Make the following edits to the `wp-config.php` file:

1. Replace `database_name_here` with `dbase`.
2. Replace `username_here` with `root`.
3. Replace `password_here` with the password you set earlier.

Press `Ctrl+X` and `Y` followed by `Enter` to save and exit.

### Start WordPress

To start WordPress you will need to open the `<ip-address>/wp-admin/install.php` in your browser. You should see the following:

![Start WordPress]({static}/images/aws-academy/22575000-07-start-wordpress.png)

a) On `Information Needed` tab, provide the requested information and click `Install WordPress`. This should complete the installation process. Now you should be able to access the `<ip-address>/wp-admin/` in your browser and login using the username and password you set. 

b) Open the `<ip-address>` in your browser to see the newly created site.

![New Site]({static}/images/aws-academy/22575000-09-new-site.png)

