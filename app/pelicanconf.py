#!/usr/bin/env python
# -*- coding: utf-8 -*- #


AUTHOR = "CloudBytes"
SITENAME = "CloudBytes"
SITEURL = "https://cloudbytes.dev"

THEME_STATIC_DIR = "assets"
THEME = "./design/alexis"

# Path to blog content
PATH = "content"

# Path to static folders
STATIC_PATHS = ["images", "extra/SW.js"]

EXTRA_PATH_METADATA = {"extra/SW.js": {"path": "SW.js"}}

# To keep the structure of content folder & remove .html extension
# PATH_METADATA = "(?P<path_no_ext>.*)\..*"
# ARTICLE_URL = PAGE_URL = "{path_no_ext}"
# ARTICLE_SAVE_AS = PAGE_SAVE_AS = "{path_no_ext}/index.html"

# To define no .html in all page types used for github pages
ARTICLE_URL = "{category}/{slug}"
ARTICLE_SAVE_AS = "{category}/{slug}/index.html"
AUTHOR_URL = "authors/{slug}"
AUTHOR_SAVE_AS = "authors/{slug}/index.html"
CATEGORY_URL = "{slug}"
CATEGORY_SAVE_AS = "{slug}/index.html"
TAG_URL = "tags/{slug}"
TAG_SAVE_AS = "tags/{slug}/index.html"
PAGE_URL = "{slug}.html"
PAGE_SAVE_AS = "{slug}.html"


TIMEZONE = "UTC"

DEFAULT_LANG = "en"

# Feed generation is usually not desired when developing
FEED_ALL_ATOM = "feeds/all.atom.xml"
CATEGORY_FEED_ATOM = "feeds/{slug}.atom.xml"
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None
HOME_HIDE_TAGS = True


# Pagination settings
DEFAULT_PAGINATION = 6
PAGINATION_PATTERNS = (
    (1, "{url}", "{save_as}"),
    (2, "{base_name}/{number}/", "{base_name}/{number}/index.html"),
)
PAGINATED_TEMPLATES = {"index": None, "tag": None, "category": None, "author": None}

# Uncomment following line if you want document-relative URLs when developing
RELATIVE_URLS = True


# Tag Cloud settings
TAG_CLOUD_STEPS = 4
TAG_CLOUD_MAX_ITEMS = 100
TAG_CLOUD_SORTING = "size"
TAG_CLOUD_BADGE = True


# Current Year
from datetime import date

CURRENTYEAR = date.today().year

# Sitemap configuration

SITEMAP = {
    "format": "xml",
    "priorities": {"articles": 1, "indexes": 1, "pages": 0.25},
    "changefreqs": {"articles": "weekly", "indexes": "daily", "pages": "monthly"},
}

MARKDOWN = {
    "extension_configs": {
        # Needed for code syntax highlighting
        "markdown.extensions.codehilite": {
            "css_class": "highlight",
        },
        "markdown.extensions.extra": {},
        "markdown.extensions.meta": {},
        "markdown.extensions.admonition": {},
        # This is for enabling the TOC generation
        "markdown.extensions.toc": {"title": "Table of Contents"},
    },
    "output_format": "html5",
}


PLUGINS = [
    "pelican.plugins.sitemap",
    "pelican.plugins.tag_cloud",
]
