Title: Configure logging in AWS Lambda to CloudWatch using Python
Date: 2021-11-06
Category: Snippets
Tags: python, aws
Author: Rehan Haider
Summary: How to log events to CloudWatch during AWS Lambda execution using Python
Keywords: AWS, Lambda, Python



Logging events to CloudWatch log stream during execution is as simple as normal logging. You might be tempted to use `print`, and it may work, if it's not a good practice. 

Rather you should be using the `logging` module. 

Below in a rather simple example, I write a Lambda function that logs a "Hello, it is <current time\>!" message to CloudWatch log stream. 

## Getting Started
You should follow the steps in this [SAM guide to setup a basic Lambda function]({filename}).


