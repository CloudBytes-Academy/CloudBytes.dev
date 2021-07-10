Title: Initialise Firebase with Python copy 3
Date: 2021-03-15
Category: Snippets
Tags: github, python
Author: Rehan Haider
Summary: A simple guide to initialising Firebase with Python
Status: Hidden

This is how you initialise Firebase in Python

step 1: install firebase by running 

Assuming you are using devcontainers, if not, follow this guide

then run to automatically detect your OS and installa accordingly

```bash
curl -sL https://firebase.tools | bash
```

if you have npm

```bash
npm install -g firebase-tools
```

then authenticate yourself by running firebase login

then run firebase init hosting 

select an existing project (you can create a new one as well)-> choose our project

choose the build output folder, e.g. in pelican it is output. it could be others

configure as single-page app -> choose no

choose the repository you want to upload

this will configure the service account and update it to the repository secrets and create two actions

git add .

git commit -m "FEAT: Firebase hosting enabled"

git push

preview the deployment. still doing. try #5git 