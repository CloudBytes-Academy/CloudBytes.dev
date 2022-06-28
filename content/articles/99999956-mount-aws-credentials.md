Title: Mount AWS Credentials on VSCode Devcontainers
Date: 2022-06-28
Category: Snippets
Tags: python, aws, vscode
Author: Rehan Haider
Summary: A guide to install, configure and run selenium in Jupyter Notebook on WSL2 or Ubuntu
Keywords: python, aws, docker, devcontainers, vscode


I've written in past about my [preference of using VSCode's devcontainers for developing Python]({filename}99999997-replace-python-venv-with-vscode-devcontainers.md) applications. 

While I work extensively with Python & AWS, one of the problems I've faced is that everytime I create a new devcontainer or rebuild one, I need to enter my AWS credentials again.

So I set about fixing this problem. I explored the idea of creating environmental variables and loading them directly into the container. I thought about copying the credentials file itself onto the container during build. But of of them weren't clean ideas and had their own problems. 

Turns out all it requires is a simple statement on `devcontainer.json` file. 

## How to mount AWS credentials on VSCode Devcontainers

Edit the `.devcontainer/devcontainer.json` file, add the following line after `build` instructions:

```json
	"mounts": [
		"source=${localEnv:HOME}/.aws,target=/home/vscode/.aws,type=bind,consistency=cached"
	],
```
> This will only work if you're using WSL2-backed devcontainers.

If you are using pure Windows based devcontainers, the above instructions may not work as I discovered after following [this guide](https://prabhatsharma.in/blog/vscode-dev-container-aws-credentials/).