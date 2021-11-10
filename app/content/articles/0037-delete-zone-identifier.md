Title: WSL2: Find and Delete Zone.Identifier files
Date: 2021-11-10
Category: Snippets
Tags: linux, wsl2, ubuntu, windows
Author: Rehan Haider
Summary: Code snippet to find and delete Zone.Identifier files that gets auto-generated while copying files to WSL2
Keywords: Zone.Identifier, WSL2, ubuntu, windows


**TL;DR:**: Run the below code snippet to find and delete Zone.Identifier files that gets auto-generated while copying files to WSL2

```bash
find . -name "*:Zone.Identifier" -type f -delete
```

If you ended up here chances are these pesky `*:Zone.Identifier` files have broken something in your workflow. Otherwise they are harmless files that are generated while downloading a file by browsers & Windows explorer to store metadata about the file being downloaded. 

The technical details are unnecessary for this post and most use cases, but suffice to say its is a NTFS feature and just identifies the course of the file by using one of the [preidentified Security Zones that are defined by Microsoft](https://docs.microsoft.com/en-us/previous-versions/windows/internet-explorer/ie-developer/platform-apis/ms537183(v=vs.85)?redirectedfrom=MSDN). 

But because the file name contains a `:` colon, which actually is not a valid character in a file name, it can break certain automated workflows and scripts. For most cases, specially on WSL / Linux system you can just delete the file without any thought. 

To do so, just run the following command in the root of the directory where you want to search and delete these files, .e.g. 

```bash
cd "~/Downloads && find . -name "*:Zone.Identifier" -type f -delete"
```

## Microsoft says they have fixed it, but users think otherwise. 

Issues [#4609](https://github.com/microsoft/WSL/issues/4609) and [#7456](https://github.com/microsoft/WSL/issues/7456) on the official WSL repository provides more details, however, this issue is definitely not fixed in Windows 11. 
