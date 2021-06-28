#!/usr/bin/env python
# -*- coding: utf-8 -*- #

AUTHOR = "UberPython"
SITENAME = "UberPython"
SITEURL = ""

# THEME = "Flex"
THEME = "./design/alexis"

PATH = "content"

# To keep the structure of content folder
PATH_METADATA = "(?P<path_no_ext>.*)\..*"
ARTICLE_URL = ARTICLE_SAVE_AS = PAGE_URL = PAGE_SAVE_AS = "{path_no_ext}.html"

# Uncomment to structure the sites by category
# ARTICLE_URL = "{category}/{slug}"
# ARTICLE_SAVE_AS = "{category}/{slug}.html"

TIMEZONE = "UTC"

DEFAULT_LANG = "en"

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = "feeds/all.atom.xml"
CATEGORY_FEED_ATOM = "feeds/{slug}.atom.xml"
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None
HOME_HIDE_TAGS = True

# Blogroll
LINKS = (
    ("Pelican", "https://getpelican.com/"),
    ("Python.org", "https://www.python.org/"),
    ("Jinja2", "https://palletsprojects.com/p/jinja/"),
    ("You can modify those links in your config file", "#"),
)

# Social widget
SOCIAL = (
    ("twitter", "https://twitter.com/UberPython"),
    ("github", "https://twitter.com/UberPython"),
    ("youtube", "https://twitter.com/UberPython"),
    ("Another social link", "#"),
)

DEFAULT_PAGINATION = 10

# Uncomment following line if you want document-relative URLs when developing
# RELATIVE_URLS = True
