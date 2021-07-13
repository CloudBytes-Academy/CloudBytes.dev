Title: Beginner's guide to installing Pelican in a Container
Date: 2021-07-13
Category: Articles
Tags: python, pelican, vscode
Author: Rehan Haider
Summary: Install Pelican in a Docker Container for development of static websites
Status: Hidden

Pelican is a type of Static Site Generator (SSG) written in Python that follows the Jamstack architecture pattern. It is easily the most popular Python based SSG with Nikola and Lektor coming in a distant second and third. 

**Pelican's popularity is largely due to the fact that**<br>
a. It is written in Python<br>
b. It has a rich ecosystem of plugins and themes<br>
c. It uses Jinja2 as templating language, making it extremely easy to build your own theme<br>
d. It is extremely stable, having been around for almost a decade and well documented<br>
e. It is actively maintained by close to 400 contributors

![Pelican active maintained github]({static}/images/s0007/pelican_github_activity.png)

## Getting Started

First create your GitHub repository that will host the codebase. Then fire up VSCode and press `Shift+Ctrl+P` to bring up the command palette. Search for *"Clone Repository in Container Volume"*, then follow the steps to select the repository you want to clone. 

When asked to choose a container configuration, select *"Show all definition"* and search for Python 3, then select Python 3.9 from the dropdown. Also, choose to install NodeJS as well by selecting the checkbox when promtpted. 

While we don't need NodeJS for Pelican, you will need NPM (which gets installed together as a bundle) in future to work directly with Firebase. However, this is an optional step and required for this tutorial. 

You should now have a devcontainer configured. 




