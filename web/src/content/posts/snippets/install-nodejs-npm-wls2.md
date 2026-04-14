---
title: "How to install Node.js and NPM on WSL2"
description: "A short guide to installing Node.js and NPM on WSL2"
pubDate: "2021-12-12"
category: "Snippets"
categorySlug: "snippets"
slug: "install-nodejs-npm-wls2"
tags:
    - "wsl2"
    - "node"
keywords:
    - "wsl2"
    - "node.js"
    - "npm"
    - "install node.js"
    - "install npm"
author: "Rehan Haider"
authorSlug: "rehan-haider"
---
If you are using WSL2 / Ubuntu, you can try to install Node.js by running "sudo apt install nodejs", but this will not install the latest version of Node.js. You can the check the version of Node.js available in Ubuntu's default repository by running the below command:

```bash
apt list | grep nodejs
```
![apt-list-nodejs](/images/99999964-apt-list-nodejs.png)

This guide will walk you through the steps to install the latest version of Node.js on WSL2.

## Install NVM (Node Version Manager)

Install the latest version of NVM by running the following command:
```bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.1/install.sh | bash
```

>!!! note "NOTE: You can get the latest versionof the above command by vising the [NVM GitHub Repository](https://github.com/nvm-sh/nvm#installing-and-updating)"

Confirm your installation and check version of NVM by running the following command:
```bash
nvm --version
```
## Populate the NVM list

Fetch all versions available in NVM by running the following command:
```bash
nvm ls-remote
```

## Install Node.js & NPM

Now you can install the latest version of Node.js by running:
```bash
nvm install node
```
This will install both the latest version of Node.js and NPM.

`node` above is an alias for the latest version of Node.js. To install a specific version of Node.js, replace node by the version and run the command, e.g. to install ` v16.13.1` run:

```bash
nvm install v16.13.1
```

Now confirm the version of Node.js installed by running the following command:
```bash
node --version
```
You can also check the version of NPM by running the following command:
```bash
npm --version
```
