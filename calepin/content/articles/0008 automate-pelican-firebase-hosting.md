Title: Auto Deploy Pelican Websites to Firebase Hosting
Date: 2021-07-13
Category: Articles
Tags: firebase, python, pelican
Author: Rehan Haider
Summary: A step by step guide to installing and configuring Pelican and hosting the final blog on Firebase Hosting
Keywords: pelican, firebase, github, python, github actions, deploy, hosting

[TOC]

In a previous article I wrote about [how you can host a simple Pelican static website on Github Pages]({filename}0005 automate-pelican-github-pages.md) and automate the deployment process using Github Action. 

GitHub Pages is brilliant and extremely useful for a simple blog or small webites, but quickly becomes limited in features if you're trying to build anything serious. 

For starters, if you recall from the [Jamstack explanation]({filename}0004 what-is-jamstack.md) and its principles, you rely on third party APIs. E.g. if you want to build a user management system into your website you will need to use a Auth API from a third party such as Okta, Azure, or AWS. 

This is where Firebase has a massive advantage by providing an integrated end to end development framework. Thus if you want to build more dynamic features into your Pelican / Jamstack website, you may want to use Firebase for your hosting purposes. 

In this guide, we will discuss how to setup Continous Deployments (CD) to Firebase Hosting so that your changes are deployed automatically on `git push`. 

## Getting started

After discovering VSCode devcontainers, I've just stopped using Python's virtual environment. So we will use devcontainers to clone the repository and prepare the development environment. 

So in this tutorial, we will

1. Set up the Pelican development environment insite a container and make a simple webpage using the default theme
2. Create a Firebase project that will be used to host the website
3. Create GitHub secrets that will be used to deploy the Pelican output to Firebase Hosting
4. Then create the action to deploy automatically to Firebase Hosting
5. Push the codebase back to GitHub repository & watch the fun unfold



## 1. Setting up Pelican 
Use the instructions in [this guide on how to install Pelican in a VSCode devcontainer]({filename}0007 install-pelican-in-devcontainer.md) and create a small blog. 

Then capture your dependencies by running

```bash
pip freeze > requirements.txt
```

## 2. Create & configure the Firebase Project
Visit the [Firebase Console Home](https://firebase.google.com/) page and register for an account, or sign-in if you already have an account. After that, click on "*Create a Project*". 

![Create a firebase project]({static}/images/s0008/firebase-create-project.png)

Give your project a name and then follow the instructuions to complete the setup.

After that you need to create two filê in workspace

`.firebaserc`: Contains the project list and aliases. If you open it you would see something like

```json
{
  "projects": {
    "default": "<your project name>"
  }
}
```

Instead of "uberpython-prod" you should see the project you chose during the configuration.

`firebase.json`: Contains the configuration of your services, 

```json
{
  "hosting": {
    "public": "output",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ]
  }
}
```

## 3. Create GitHub Secrets

[GitHub Secrets](https://docs.github.com/en/actions/reference/encrypted-secrets) is GitHub's Key Management System (KMS) that excrypts and stores API keys so it can be used in your projects without being visible to anybody, even you. 

We need to store the credentials to Firebase Hosting Project as a secret in GitHub so it can be used to push your code directly to Firebase. 

To do that 
### 3.1 Get the Service Account JSON

Go to Firebase -> Select your Project -> Click on the ⚙ Settings icon on the left navigation page, then click on *Project Settings*. 

Then click on the *Service accounts* tab, this will create a Service Account for your project. Service Account credentials are used to interact with Firebase Services. 

Scroll to the bottom -> Click on *Generate new private key* then in the popup box, click again on *Generate key*. 

You will be prompted to save the file ending in `.json` extension. 


**WARNING: Never share or upload this service account credentials including in GitHub repository.**

The right way to handle such credentials is via encrypted secrets. 

### 3.2 Store the secret in GitHub Secrets

Open you GitHub repository and on the `Settings` tab, scroll down and click on `Secrets` in the navigation pange on left. 

Then click on `New repository secret` button on the top right. Give it any memorable name, e.g. `FIREBASE_SERVICE_ACCOUNT` and paste the contents of the service account file that you download in previos section then click `Add secret` to save. 

![Github Repository Secret]({static}/images/s0008/github_repository_secret.png)

## 4. Create the action to deploy automatically to Firebase Hosting

Now we have all the building blocks ready, except the GitHub action definition. In VSCode, create a file at the path `.github/workflows/deploy-to-firebase.yml`.

Add the following content in the file
```yaml
name: Deploy

on:
  push:
    branches:
      - main

jobs:
  build_and_deploy:
    runs-on: ubuntu-latest
    steps:
    - uses: actions/checkout@v2
    - uses: justgoodin/pelican-build-action@v0.1.10
      env:
        PELICAN_CONFIG_FILE: calepin/publishconf.py
        PELICAN_CONTENT_FOLDER: calepin/content
    - uses: FirebaseExtended/action-hosting-deploy@v0
      with:
        repoToken: '${{ secrets.GITHUB_TOKEN }}'
        firebaseServiceAccount: '${{ secrets.FIREBASE_SERVICE_ACCOUNT}}'
        channelId: live
        projectId: <enter your project id>
```

YAML is a declarative syntax where it is easy to understand what is going on. 
In the first part above, we define that the action will work `on` `push` into the `main` `branch` of your GitHub repository. 

Then we created a `job`, and named it `build_and_deploy` that will run on `ubuntu-latest` version of operating system. 

After that we defined the `steps` that need to be followed which are, 

1. Use `actions/checkout@v2` to access the branch of your repository which contains your code
2. Use another action that I built named `justgoodin/pelican-build-action@v0.1.10` that will install all of your dependencies stored in `requirements.txt` and execute the `pelican content` command to generate the output in a folder named `output`
3. The above action is performed using the environmental variables under `env` that contains the path to the config file and the content folder where the markdown content is stored. 
4. Finally, we use official Firebase action to deploy the contents of `output` folder that the action will create into Firebase hosting 
5. The above action will be performed with a `repoToken` that is provided by GitHub automatically, the `FIREBASE_SERVICE_ACCOUNT` credentials that we stored in previous section, into the `live` channel and finally the `projectId` that you should change to the name of the project you had created on Firebase

## 5. Push the Code to GitHub and watch the fun unfold

Open the VSCode terminal and run the below command to add all your files to your GitHub repository tracking
```bash
git add .
```

Commit your changes to the repository by running
```bash
git commit -m "My cool comment"
```

Then push your code to the GitHub by running
```bash
git push
```

Now go to GitHub.com and browse to your repository page, click on `Actions` tab you will see the action being executed. Click on the action to see more details. 

![Github action success results]({static}/images/s0008/github_action_results.png)

Now your Pelican Blog is setup for auto deployment to firebase, everytime you push your code.
