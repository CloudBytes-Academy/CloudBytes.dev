Title: Firebase Hosting Redirects using Wildcard
Date: 2021-10-24
Category: Snippets
Tags: firebase, pelican, python
Author: Rehan Haider
Summary: Configure redirects on Firebase Hosting using wildcards for groups of URLs
Keywords: Python, firebase, hosting, redirect, pelican


[Firebase Hosting](https://firebase.google.com/docs/hosting) is a popular choice for hosting [Jamstack]({filename}0004-what-is-jamstack.md) websites, mostly because it is free but also because it is [developer friendly]({filename}0008-automate-pelican-firebase-hosting.md) and has almost all features that you might want.


One of the most vital features Firebase Hosting has is the ability to do **URL Redirects** including 301 redirects. 

If you have a firebase project, you can configure Firebase Hosting following [these steps]({filename}0008-automate-pelican-firebase-hosting.md#2-create-configure-the-firebase-project).

Then, if you want to redirect a URL "*www.example.com/articles/my-brilliant-article*" to "*www.example.com/post/my-brilliant-post*"  you just need to add a directive in `firebase.json` file that was created as part of the above configuration

```json
{
  "hosting": {
    "public": "output",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "redirects": [
        {
            "source": "/articles/my-brilliant-article",
            "destination": "/posts/my-brilliant-post",
            "type": 301
        }
    ]
}
```

It's as simple as that. 

But what if you wanted to rename your article category to post, i.e. everything that was `www.example.com/article/some-url` now has to become `www.example.com/post/same-url`. 

You might be tempted to use regex or **wilcard* but it won't work because regex helps in selection of the URLs not naming what it will be in future, essentially what you want to do is capture the `some-url` in the above example and use it as `same-url` in the redirect. 

# Using Variables in Firebase Hosting Redirects
You can define a variable as part of the redirect url by appending it with colon (:), e.g. `:path`. 

So the above example would become,
```json
{
  "hosting": {
    "public": "output",
    "ignore": [
      "firebase.json",
      "**/.*",
      "**/node_modules/**"
    ],
    "redirects": [
        {
            "source": "/articles/:path",
            "destination": "/posts/:path",
            "type": 301
        }
    ]
}
```

This will redirect all URLs that match the source pattern starting with `/articles/` to `/posts` while keeping the path of the file same. 

If you were looking for some other solution, feel free to create a new discussion from the link below.