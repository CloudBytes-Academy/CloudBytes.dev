Title: Configure & Fix Pelican Sitemap Error on Google Search Console
Date: 2021-07-04
Category: Snippets
Tags: python, pelican
Author: Rehan Haider
Keywords: Python, pelican, SSG, google, webmaster, sitemap
Summary: A quick guide to correctly configurating sitemaps in Pelican & fixing URL errors thrown up by Google Search Console


**TL;DR** - Set the SITEURL variable in `publishconf.py` and use `publishconf.py` to generate your website instead of the default `pelicanconf.py`. This will fix your Google Search Console sitemap error. 

If you have have recently started using Pelican and have struggled with it comprehensive but incoherent documentation. One of the problems you might encounter is handing the SITEURL errors both while working on your local system and on the deployed webserver. 

## What is SITEURL?

Pelican's SITEURL refers to the URL of your website, e.g. example.com, or blog.example.com. In our website's case the SITEURL is "https://cloudbytes.dev". 

Pelican needs the SITEURL to define the `href` links in  your website correctly while publishing the website. 

## How to define SITEURL?

Make sure it is configured correctly in two places

1. `pelicanconf.py` : This file is typically used for local development. Running `pelican content` or `make html` or `invoke livereload` uses this file by **default**. 
2. `publishconf.py`: The setting in this file overrides the ones in `pelicanconf.py` and is meant for generating the static website for deployment. But Pelican doesn't use this by default. You need to run either `pelican content -s publishconf.py` or `make publish` to use this file as your settings. 

## Errors that you may encounter

If you don't configure SITEURL correctly the website will work on your system but not on the hosting provider you are using for your final website. 

Typically you may encounter the below error

![Pelican sitemap error on Google Search Console]({static}/images/99999998-google-search-console-error.png)

This is due to malformed URLs, and the typical reason is incorrect SITEURL configuration. 