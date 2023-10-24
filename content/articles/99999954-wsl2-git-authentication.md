Title: Fix or configure Git authentication in WSL2
Date: 2023-10-24
Category: Snippets
Tags: git, wsl2
Author: Rehan Haider
Summary: Configure Git authentication in WSL2 and avoid entering credentials every time
Keywords: git, wsl2, authentication, username, password


If you are using Git in WSL2, you might have noticed that you have to enter your username and password when working with private repositories or every time you push to a remote repository. This occurs because Git is not able to access the credentials stored in the Windows Credential Manager.

![Git auth error wsl2]({static}/images/99999954-01-git-auth-error.png)



Let's see how to fix this issue.

## Pre-requisites

You need the following to complete this guide:

1. WSL2 installed and configured [(Guide to configure WSL2 on Windows 10 or Windows 11)]({filename}99999965-install-wsl2.md)
2. Git CLI is installed - download from [here](https://git-scm.com/downloads)


## Configure Git authentication in WSL2

Open the WSL2 terminal and follow the steps below

### 1. Git configuration / config file

First, set your name by running the following command:

```bash
git config --global user.name "Your Name"
```

Next, set your email address by running the following command:

```bash
git config --global user.email "youremail@domain.com"
```

### 2. Configure Git Credential Manager

This part is important, and it depends on the version of Git installed on the Windows part of your OS (Not WSL2).

#### 2.1. Check Git version

Open the Microsoft Terminal / Powershell / CMD and run the following command:

```bash
git --version
```

![Git version windows]({static}/images/99999954-02-git-version-windows.png)


#### 2.2. Configure Git Credential Manager

Now go back to the **WSL2 terminal** and based on the Git version, run the appropriate command below:

* If the Git version is greater than `v2.39.0`, run the following command:

```bash
git config --global credential.helper "/mnt/c/Program\ Files/Git/mingw64/bin/git-credential-manager.exe"
```

* If the Git version is between `v2.36.1`, and `v2.39.0` run the following command:

```bash
git config --global credential.helper "/mnt/c/Program\ Files/Git/mingw64/libexec/git-core/git-credential-manager.exe"
```

* If, the Git version is less than `v2.36.1`, run the following command:

```bash
git config --global credential.helper "/mnt/c/Program\ Files/Git/mingw64/bin/git-credential-manager-core.exe"
```

### 3. Test Git authentication

Now, try to clone a private repository or push to a remote repository. You should not be prompted for credentials.