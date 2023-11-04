Title: A brief introduction to AWS autoscaling
Date: 2022-06-28
Category: AWS Academy
Tags: aws
Author: Rehan Haider
Summary: AWS Autoscaling - introduction, explanation and examples
Keywords: AWS, Python, EC2, stress testing, autoscaling
Status: Draft


[TOC]

Amazon EC2 Autoscaling is a service that allows you to automatically scale your EC2 instances to meet fluctuating demand on your application.  

## What is autoscaling?

E.g. consider Uber's cab service. As shown in the image below, the demand for cab services is fluctuating and peaks between 5-8 PM. Compare that to the trough between 1-4 AM. From 10,000 bookings to 70,000 bookings, that represents a 7-fold increase in demand.

![3750000-01-uber-hour-of-day]({static}/images/aws/37500000-01-uber-hour-of-day.png)

From a technical standpoint, it means Uber needs to have 7x more compute power in evening compared to night. So Uber could choose to:

1. **Plan for the peak demand**: 7x more compute power in evening compared to night means not fully utilising their extremely expensive servers 16-20 hours a day. That's a lot of wasted money.
2. **Plan for the trough demand**: This would mean Uber can only  fulfill 10000 bookings an hour and refuse more than 250,000 bookings per day. That's a lot of lost revenue.
3. **Plan for optimum capacity**: They could potentially keep capacity for 50,000 bookings an hour. That way they only need to refuse about 100,000 bookings per day while fully utilising the servers 20+ hours a day. This is still a lot of lost revenue.

So what if Uber had the ability to somehow magically have more compute power in the evening than night without having to pay for it during off-peak hours? This is made possible by the AWS Autoscaling service.

![37500000-autoscaling-process.gif]({static}/images/aws/37500000-autoscaling-process.gif)

## How does AWS Autoscaling work?

Autoscaling requires the following components to be configured

1. **Autoscaling group**: This is the resource that defines the capacity of the EC2 instances.
2. **Launch configuration**: This is the resource that defines the EC2 instance type and the AMI to use.
3. **Scaling policy**: This is the resource that defines the scaling behavior.
5. **Target Group**: Typically autoscaling works with a load balancer that requires a target group to be defined

**Autoscaling group** configuration helps define the minimum, maximum, and desired capacity of the EC2 instances that are needed for application and then the scaling policy scales out or in as needed.

![37500000-02-autoscaling-terms]({static}/images/aws/37500000-02-autoscaling-terms.png)

## How to create an autoscaling group?

We will use two methods to create autoscaling groups

1. [Using AWS Console](#create-autoscaling-groups-using-aws-console)
2. [Using the AWS CLI](#create-authoscaling-groups-using-aws-cli)


### Create Autoscaling groups using AWS Console

#### Step 1: Create the base EC2 instance
This instance will be replicated to create other instances in the autoscaling group.

### Create Authoscaling groups using AWS CLI

Attach volume ec2 instance amazon linux

sdfssdf
