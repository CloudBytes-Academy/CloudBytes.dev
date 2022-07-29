Title: Run Flask Apps on Elastic Beanstalk
Date: 2022-06-26
Category: AWS Academy
Tags: aws, python
Author: Rehan Haider
Summary: Create a simple Flask app and run on AWS Elastic Beanstalk
Keywords: AWS, Python, beanstalk, flask, elastic beanstalk
Status: Draft


We will use the simple flask app below

```python
from flask import Flask
app = Flask(__name__)


@app.route('/')
def hello_world():
    return 'Hello, World!'

if __name__ == '__main__':
    app.run()
```

Deploy the app to AWS Elastic Beanstalk using aws CLI

```bash




