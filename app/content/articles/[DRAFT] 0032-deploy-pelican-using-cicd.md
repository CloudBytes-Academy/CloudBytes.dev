Title: Deploy Pelican to Firebase using GitHub action and CI/CD pipeline
Date: 2021-11-3
Category: Snippets
Tags: github, pelican, python
Author: Rehan Haider
Summary: A comprehensive guide to deploying Pelican generated a static website to Firebase using GitHub action and CI/CD pipeline
Keywords: Github, pelican, devops, actions, artifacts
Status: Hidden

[TOC]

In this guide I will provide a step by step method to automatically deploy a Pelican website to Firebase using a CI/CD pipeline built using only GitHub Actions.

I currently use a highly customised CI/CD pipeline that is a mix of GitHub Actions, shell scripts and Docker that builds, tests and deploys [CloudBytes/Dev>](https://cloudbytes.dev) to to Firebase. 

But it doesn't have to be that complex and it can be applied to any Static Site Generator (SSG) generated website. 

## CloudBytes/Dev> CI/CD pipeline workflow
![CloudBytes CI CD]({filename}/images/s0032/cloudbytes-ci-cd.png)


