"""
# -*- coding: utf-8 -*- #
# Pelican configuration file
"""
from datetime import date
import os

# ENVIRONMENT
PUBLISH = os.environ.get("PUBLISH")
print(f"PUBLISH: {PUBLISH}")
CURRENTYEAR = date.today().year

# General settings
TIMEZONE = "UTC"
DEFAULT_LANG = "en"
AUTHOR = "CloudBytes"
SITENAME = "CloudBytes/dev>"
SITEURL = "https://cloudbytes.dev" if PUBLISH else "http://localhost:8080"


# Paths
THEME_STATIC_DIR = "assets"
THEME = "design/alexis"
## Path to blog content
PATH = "content"
## Path to static folders
STATIC_PATHS = ["images", "extra/SW.js", "extra/robots.txt"]
EXTRA_PATH_METADATA = {"extra/SW.js": {"path": "SW.js"}, "extra/robots.txt": {"path": "robots.txt"}}

# Page naming convention
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


# Feed generation is usually not desired when developing
FEED_ALL_ATOM = "feeds/all.atom.xml"
CATEGORY_FEED_ATOM = "feeds/{slug}.atom.xml"
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None
HOME_HIDE_TAGS = True

# Delete output directory before build
DELETE_OUTPUT_DIRECTORY = True

# Pagination settings
DEFAULT_PAGINATION = 6
PAGINATION_PATTERNS = (
    (1, "{url}", "{save_as}"),
    (2, "{base_name}/{number}/", "{base_name}/{number}/index.html"),
)
PAGINATED_TEMPLATES = {"index": None, "tag": None, "category": None, "author": None}

# Uncomment following line if you want document-relative URLs when developing
# RELATIVE_URLS = True


## Python-Markdown extension configuration
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


# Plugin Settings
# ----------------

## Tag Cloud settings
TAG_CLOUD_STEPS = 4
TAG_CLOUD_MAX_ITEMS = 100
TAG_CLOUD_SORTING = "size"
TAG_CLOUD_BADGE = True

## Sitemap configuration
SITEMAP = {
    "format": "xml",
    "priorities": {"articles": 1, "indexes": 1, "pages": 0.25},
    "changefreqs": {"articles": "weekly", "indexes": "daily", "pages": "monthly"},
}


# Algolia Publish Data
ALGOLIA_APP_ID = "XE8PCLJHAE"
ALGOLIA_SEARCH_API_KEY = "ec75de1d8ce87dee234a2fd47cec2d76"
ALGOLIA_INDEX_NAME = "cloudbytes_dev"
ALGOLIA_ADMIN_API_KEY = os.environ.get("ALGOLIA_ADMIN_API_KEY")

# Related Post Settings
RELATED_POSTS_MAX = 5

# Following items are often useful when publishing

GTAG = "G-9VKX48YDBH" if PUBLISH else None

# Active Plugins
dev_plugins = [
    "pelican.plugins.sitemap",
    "pelican.plugins.tag_cloud",
    "pelican.plugins.related_posts",
    "plugins.fix_sitemap",
    "plugins.minify",
]
prod_plugins = [
    "pelican.plugins.sitemap",
    "pelican.plugins.tag_cloud",
    "pelican.plugins.related_posts",
    "plugins.fix_sitemap",
    "plugins.search",
    "plugins.minify",
]

PLUGINS = prod_plugins if PUBLISH else dev_plugins
