Title: Auto Deploy Pelican Websites to Firebase Hosting
Date: 2021-07-13
Category: Articles
Tags: firebase, python
Author: Rehan Haider
Summary: A simple guide to initialising Firebase with Python
Keywords: pelican, firebase, github, python, github actions, deploy, hosting
Status: Hidden

In a previous article I wrote about [how you can host a simple Pelican static website on Github Pages]({filename}0005 automate-pelican-github-pages.md) and automate the deployment process using Github Action. 

GitHub Pages is brilliant and extremely useful for a simple blog or small webites, but quickly becomes limited in features if you're trying to build anything serious. 

For starters, if you recall from the [Jamstack explanation]({filename}0004 what-is-jamstack.md) and its principles, you rely on third party APIs. E.g. if you want to build a user management system into your website you will need to use a Auth API from a third party such as Okta, Azure, or AWS. 

This is where Firebase has a massive advantage by providing an integrated end to end development framework. Thus if you want to build more dynamic features into your Pelican / Jamstack website, you may want to use Firebase for your hosting purposes. 

In this guide, we will discuss how to setup Continous Deployments (CD) to Firebase Hosting so that your changes are deployed automatically on `git push`. 

## Getting starter

After discovering VSCode devcontainers, I've just stopped using Python's virtual environment. So in this tutorial, we will

1. clone your GitHub repository into a devcontainer, 
2. configure the Pelican blog, 
3. push the codebase back to GitHub Repository 
4. and then create the action to deploy automatically to Firebase Hosting

### Setting up the Pelican development environment
Use the instructions in [this guide to create a devcontainer with Python 3.9 installed]({filename}0003 replace-python-venv-with-vscode-devcontainers.md)

Then