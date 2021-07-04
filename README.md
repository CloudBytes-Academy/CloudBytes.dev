[![Deploy](https://github.com/UberPython/UberPython/actions/workflows/workflow.yml/badge.svg)](https://github.com/UberPython/UberPython/actions/workflows/workflow.yml)

# [UberPython](https://uberpython.com)
Short 🤏and succint snippets explaining Python 🐍 and Computer Science 💻🧪concepts , designed for new 🆕 adopters focused on doing. 

But most importly making your experience of learning easier and fun 🎉🎈😁. 

## Repository Structure

The repository has the following structure:

1. `.devcontainer`: [VSCode Devcontainer](https://code.visualstudio.com/docs/remote/containers) Dockerfile for easy configuration
2. `.github/workflows`: Contains the script for automated deployment using this [action](https://github.com/justgoodin/pelican-build-deploy-anywhere).
3. `content`: Where the content resides
4. `design`: Themes for the website. The current version is nicknamed `alexis`.

Additionally, the root folder contains the following files

1. `pelicanconf.py`: The Pelican configuration being used by the website
2. `Makefile`: An alternate method to generate website without the need for installation of other tools
3. `publishconf.py`: Configuration for publishing the website
4. `requirements.txt`: All the python dependencies used
5. `tasks.py`: Pre-configured build tasks that can be customised as per need

## Contributions

You can contribute 🤝🏽to this project in various ways, or simply reuse the repository for learning and building something yourself as outlined below.

### 1. Guest Post and Typo corrections

If you want to post an article yourself , you can add a new file in the 👉🏽 `content/snippet/` folder using the `Add file` inline file editor option.  Once done, submit a Pull Request (PR). 

For correcting ✅ any typos ❌do the same by using GitHub's inline editor and submit a PR. 

Once the PR is merged, your article will be posted directly on the website using the Continuous Delivery (CD) pipeline in place. 

> *If you know what you're doing* 😉*, feel free to fork the repository and add the guest post in the folder mentioned above.* ☝🏽

### 2. Add a new feature

You can use this method to add any cool new feature you want. To do so, you will need to fork the repository and work on the project on our own computer. 

To begin, fork the repository by clicking on the `Fork` button on top right on this page.  Depending upon your preferences, you can use one of the two below 👇🏽options.

#### Using VSCode Devcontainers - Easy & Recommended

You need to have [VSCode](https://code.visualstudio.com/download), [Git](https://git-scm.com/) and [Docker Desktop](https://www.docker.com/products/docker-desktop) installed for this option, and nothing else.

1. Open your VSCode and press `Ctrl + Shift + P`, 
2. Then type `git clone` and press Enter. 
3. Select `Clone from GitHub` and press enter
4. Choose  your forked repository then save it on your system
5. Open the cloned repository in VSCode
6. After a few seconds, you should get a prompt to reopen the repository in Container. Choose `Reopen in Container`

This will create a Docker Container with Python and NodeJS installed, add all of the cloned files in that and install all the dependencies defined under `requirements.txt`

No need for any virtual environment of conflicting packages. 

Alternatively ....

#### Cloning manually and creating a Python virtual environment

Yeah, 🤕😐I'm not gonna be part of this.  You're on your own.

## Running the site locally

Recommendation is to use the pelican inbuilt generation mechanism using `pelican content` to generate the static website and use `invoke` combined with `livereload` to serve the website during development. 

Open the terminal in VSCode, and run the below to generated the site

```bash
pelican content
```

To serve the website, run the below 👇🏽

```bash
invoke livereload
```
