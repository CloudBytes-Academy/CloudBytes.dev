#!/usr/bin/env python
# -*- coding: utf-8 -*- #

AUTHOR = "UberPython"
SITENAME = "UberPython"
SITEURL = ""

THEME = "./design/alexis"

PATH = "content"

# To keep the structure of content folder & remove .html extension
# PATH_METADATA = "(?P<path_no_ext>.*)\..*"
# ARTICLE_URL = PAGE_URL = "{path_no_ext}"
# ARTICLE_SAVE_AS = PAGE_SAVE_AS = "{path_no_ext}/index.html"


ARTICLE_URL = "{category}/{slug}"
ARTICLE_SAVE_AS = "{category}/{slug}/index.html"

AUTHOR_URL = "authors/{slug}"
AUTHOR_SAVE_AS = "authors/{slug}/index.html"
CATEGORY_URL = "{slug}"
CATEGORY_SAVE_AS = "{slug}/index.html"
TAG_URL = "tag/{slug}"
TAG_SAVE_AS = "tag/{slug}/index.html"


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


# Tag Cloud settings
TAG_CLOUD_STEPS = 4
TAG_CLOUD_MAX_ITEMS = 100
TAG_CLOUD_SORTING = "size"
TAG_CLOUD_BADGE = True
