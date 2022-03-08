Title: Use VSCode Devcontainers instead of Python venv
Date: 2021-07-07
Category: Snippets
Tags: python, vscode, github
Author: Rehan Haider
Summary: VSCode Devcontainers are game changers that makes Python dependency management much easier. 
Keywords: Python, venv, virtual environment, vscode, containers, docker, devcontainers

I wrote about [why you need Python virtual environments]({filename}99999999-create-a-python-virtual-environment.md) and how to [create them]({filename}99999999-create-a-python-virtual-environment.md). 
All Python developers end up using some kind of environment manager like `venv` for any meaningful development effort. 

VSCode, a few years ago, released a concept called **devcontainers** that takes away the pain of managing many virtual environments for Python and other languages such as NodeJS, etc.

## VSCode's venv killer

Devcontainers or remote containers, work by opening you project folder inside a Docker Container giving you the flexibility of both Keeping the files on your system, and working in a secluded container with its own libraries and packages sanboxed from your other projects. 

This allows developers to use these Docker containers as a full-featured development environment with workspace files mounted from the local file system. 

![VSCode devcontainer architecture]({static}/images/s0003/architecture-containers.png)

Each such devcontainer also acts like a workspace and can have its own set of extensions, and preferences configured.

## How to use devcontainers

First, the appropriate version of [Docker Desktop](https://www.docker.com/products/docker-desktop), If you're using a Windows system, you need to [install WSL2]({filename}99999965-install-wsl2.md) and enable [Docker WSL2 backend](https://aka.ms/vscode-remote/containers/docker-wsl2) is recommended. 

Once you have these setup, open VSCode and from Getting started page, click on "Open Folder" to open the folder where your project is stored.

After that either click on the "Open Remote Window" button on bottom left (two overlapping arroheads) or press `Ctrl + Shift + P` to open the command palette and choose "Reopen in Container" 

![VSCode remote container]({static}/images/s0003/remote-container.png)

It will then ask you to choose one from ready-to-use configurations. Let's choose Python3 & PostgreSQL. This will trigger two actions

1. Create a folder named `.devcontainer` in your project root directory that with a `Dockerfile` and a `.devcontainer.json` that contains your user configuration
2. Start building the Docker container for you to use

Once the build process is complete, at the bottom left, you will see `Dev Container: Python3 & PostgreSQL` and you files will be still present.

## Preparing the environment

Now you have access to a functional actual Docker container running Debian Linux with Python and PostgreSQL already installed. 

If you are using `requirements.txt` to keep the list of dependencies, you will need to install your dependencies for the first time by opening the Terminal within VSCode and running

```bash
pip install requirements.txt
```

Or you can install them one by one and run the below to create a `requirements.txt`.

```bash
pip freeze > requirements.txt
```

## Enabling automatic installation

To enable VScode Remote Containers to install your dependencies, you should choose to rebuild the container, browse to the `.devcontainer` folder and open the `Dockerfile`

You need to uncomment the below block as shown below 👇🏽

```dockerfile
# [Optional] If your requirements rarely change, uncomment this section to add them to the image.
COPY requirements.txt /tmp/pip-tmp/
RUN pip3 --disable-pip-version-check --no-cache-dir install -r /tmp/pip-tmp/requirements.txt \
   && rm -rf /tmp/pip-tmp
```

This will reinstall any dependencies that you may have noted under `requirements.txt`. 

> Make sure you have requirements.txt file present before doing the above, attempt to rebuild the container without the file present will result in failure

### Pro-tip
If you use your GitHub profile to login into VSCode, you can push your changes back to you Github account without entering your credentials or any additional configuration