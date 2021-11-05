[![Open in VSCode](resources/ovs.svg)](https://open.vscode.dev/CloudBytesDotDev/CloudBytes.dev)
[![Deploy](https://github.com/CloudBytesDotDev/CloudBytes.dev/actions/workflows/workflow.yml/badge.svg)](https://github.com/CloudBytesDotDev/CloudBytes.dev/actions/workflows/workflow.yml)
[![Code Quality](https://github.com/CloudBytesDotDev/CloudBytes.dev/actions/workflows/codeql.yml/badge.svg)](https://github.com/CloudBytesDotDev/CloudBytes.dev/actions/workflows/codeql.yml)

# [CloudBytes/dev>](https://cloudbytes.dev)
CloudBytes/dev> ☁ is a community that provides detail guides and how-tos🤔 explaining Cloud ☁☁, Python🐍 and Computer Science💻🧪 concepts , designed for new 🆕 adopters focused on making things work. 

But most importantly making your experience of learning some complex topics from scratch a bit easier and hopefully more fun 🎉🎈😁. 

## Engage with the community
You can open a new discussion here on this repository's [Help / Discussion Community Forum](https://github.com/CloudBytesDotDev/CloudBytes.dev/discussions) to ask for help, or even provide suggestions / feedback.

## Contributing to the project

You can contribute 🤝🏽to this project in various ways, or simply reuse the repository for learning and building something yourself as outlined below.
### 1. Guest Post and Typo corrections

If you want to post an article yourself , you can add a new file in the 👉🏽 `content/snippet/` folder using the `Add file` inline file editor option.  Once done, submit a Pull Request (PR). 

For correcting ✅ any typos ❌do the same by using GitHub's inline editor and submit a PR. 

Once the PR is merged, your article will be posted directly on the website using the Continuous Delivery (CD) pipeline in place. 

> *If you know what you're doing* 😉, *feel free to fork the repository and add the guest post in the folder mentioned above.* ☝🏽

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

This will create a Docker Container with Python, NodeJS and Firebase CLI installed, add all of the cloned files in that and install all the dependencies defined under `requirements.txt`

No need for any virtual environment of conflicting packages. 

## Running the site locally

This repository comes packaged with Firebase Hosting Emulator tool that can be used to serve the website locally. 

Open the terminal in VSCode and run the below to continously regenerate the output
```
make dev
```

Open another terminal in VSCode and runt he below to serve on localhost:8080
```
make firebase
```
Open the URL `localhost:8080` in your browser. 
## Repository Structure

The repository has the following structure:

1. `.devcontainer`: [VSCode Devcontainer](https://code.visualstudio.com/docs/remote/containers) Dockerfile for easy configuration
2. `.github/workflows`: Contains the script for automated deployment using this custom [action](https://github.com/rehanhaider/pelican-build-deploy-anywhere).
3. `app/content`: Where the content resides
4. `plugins`: Custom plugins to add additional features
5. `design`: Themes for the website. The current version is nicknamed `alexis`.


Additionally, the following files are of importance

1. `app/pelicanconf.py`: The Pelican 🦢 configuration being used by the website used for local development
2. `Makefile`: An alternate method to generate website without the need for installation of other tools
3. `app/publishconf.py`: Configuration for publishing the website used for final website generation
4. `requirements.txt`: All the python dependencies used
5. `tasks.py`: Pre-configured build tasks that can be customised as per need
6. `addons.py`: Hook to run any post-build actions not covered by Pelican plugins




