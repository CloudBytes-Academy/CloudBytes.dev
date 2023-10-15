"""
# -*- coding: utf-8 -*- #
# Pelican configuration file
"""

# --- Imports ---
from datetime import date
import os
import csv

# --- Environmental Variables ---
PUBLISH = os.environ.get("PUBLISH")
print(f"PUBLISH: {PUBLISH}")
CURRENTYEAR = date.today().year

# --- Basic Settings ---
TIMEZONE = "UTC"
DEFAULT_LANG = "en"
AUTHOR = "CloudBytes"
SITENAME = "CloudBytes/dev>"
SITEURL = "https://cloudbytes.dev" if PUBLISH else "http://localhost:8080"
# Delete output directory before build
DELETE_OUTPUT_DIRECTORY = True

# --- Paths & Directories ---
THEME_STATIC_DIR = "assets"
THEME = "design/alexis"
PATH = "content"  # Path to blog content
STATIC_PATHS = [
    "images",
    "extra/SW.js",
    "extra/robots.txt",
    "extra/ads.txt",
]
EXTRA_PATH_METADATA = {
    "extra/SW.js": {"path": "SW.js"},
    "extra/robots.txt": {"path": "robots.txt"},
    "extra/ads.txt": {"path": "ads.txt"},
}

# --- URL & Save Patterns ---
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

# --- Feed Settings ---
FEED_ALL_ATOM = "feeds/all.atom.xml"
CATEGORY_FEED_ATOM = "feeds/{slug}.atom.xml"
TRANSLATION_FEED_ATOM = None
AUTHOR_FEED_ATOM = None
AUTHOR_FEED_RSS = None
HOME_HIDE_TAGS = True


# --- Pagination Settings ---
DEFAULT_PAGINATION = 6
PAGINATION_PATTERNS = (
    (1, "{url}", "{save_as}"),
    (2, "{base_name}/{number}/", "{base_name}/{number}/index.html"),
)
PAGINATED_TEMPLATES = {"index": None,
                       "tag": None, "category": None, "author": None}

# Uncomment following line if you want document-relative URLs when developing
# RELATIVE_URLS = True


# --- Markdown Extensions ---
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
        "markdown.extensions.toc": {"title": "Table of Contents", "toc_depth": 3},
    },
    "output_format": "html5",
}


# --- Plugin Settings ---
# ---------------------------------------------

# --- Tag Cloud Settings ---
TAG_CLOUD_STEPS = 4
TAG_CLOUD_MAX_ITEMS = 100
TAG_CLOUD_SORTING = "size"
TAG_CLOUD_BADGE = True

# --- Sitemap Settings ---
SITEMAP = {
    "format": "xml",
    "priorities": {"articles": 1, "indexes": 1, "pages": 0.25},
    "changefreqs": {"articles": "weekly", "indexes": "daily", "pages": "monthly"},
}


# --- Algolia Settings ---
ALGOLIA_APP_ID = "XE8PCLJHAE"
ALGOLIA_SEARCH_API_KEY = "ec75de1d8ce87dee234a2fd47cec2d76"
ALGOLIA_INDEX_NAME = "cloudbytes_dev"
ALGOLIA_ADMIN_API_KEY = os.environ.get("ALGOLIA_ADMIN_API_KEY")

# --- Related Posts Settings ---
RELATED_POSTS_MAX = 5
# ---------------------------------------------

# --- Google Analytics Settings ---
# Following items are often useful when publishing
GTAG = "G-9VKX48YDBH" if PUBLISH else None


# --- Active Plugins ---
# Plugin configuration
# ---------------------------------------------
common_plugins = [
    "pelican.plugins.sitemap",
    "pelican.plugins.tag_cloud",
    "pelican.plugins.related_posts",
    "pelican.plugins.series",
    "plugins.fix_sitemap",
]

dev_plugins = common_plugins.copy()

prod_extra_plugins = [
    "plugins.search",
    "plugins.minify",
]

prod_plugins = common_plugins + prod_extra_plugins

PLUGINS = prod_plugins if PUBLISH else dev_plugins


# --- Udemy Affiliate Settings ---
# ---------------------------------------------
with open("resources/courses.csv") as csvfile:
    reader = csv.DictReader(csvfile)
    courses = list(reader)

COURSES = {course["tag"]: course for course in courses}

UDEMY = {
    "aid": "zOWbNCBDzko",  # Account ID
    "pid": "1060092",  # Product ID (Udemy)
}
