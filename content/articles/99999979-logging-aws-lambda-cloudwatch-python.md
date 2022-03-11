Title: Configure logging in AWS Lambda to CloudWatch using Python
Date: 2021-11-06
Category: Snippets
Tags: aws, python
Author: Rehan Haider
Summary: How to log events to CloudWatch during AWS Lambda execution using Python
Keywords: AWS, Lambda, Python



Logging events to CloudWatch log stream during execution is as simple as normal logging. You might be tempted to use `print`, and it may work, if it's not a good practice. 

Rather you should be using the `logging` module. 

Below in a rather simple example, I write a Lambda function that logs a "Hello, today is <today's date\>!" message to CloudWatch log stream. 

## Getting Started
You should follow the steps in this [SAM guide to setup a basic Lambda function]({filename}99999984-deploy-serverless-apps-with-aws-sam.md) to setup a Lambda function.


## Writing a Lambda function to log to CloudWatch
Edit the Lambda function under `hellow_world/app.py`, and change the code to the following

```python
import logging
from datetime import datetime

logging.basicConfig()
logger = logging.getLogger("HELLO")
logger.setLevel(logging.INFO)

date_today = datetime.today().strftime("%Y-%m-%d")

def lambda_handler(event, context):
    logger.info(f"Hello, today is {date_today}!")
```

Then execute this by following the instructions here [instructions here]({filename}99999984-deploy-serverless-apps-with-aws-sam.md##test-the-app).

Now you can go to the Lambda function's CloudWatch log stream and see the message being printed everytime you execute the funcion.