"""
# -*- coding: utf-8 -*- #

# This file is only used if you use `make publish` or
# explicitly specify it as your config file.
"""

import os
import sys

sys.path.append(os.curdir)
# This needs to be below the sys.path directive above to work
from app.pelicanconf import *

# If your site is available via HTTPS, make sure SITEURL begins with https://
SITEURL = "https://cloudbytes.dev"
RELATIVE_URLS = False

FEED_ALL_ATOM = "feeds/all.atom.xml"
CATEGORY_FEED_ATOM = "feeds/{slug}.atom.xml"

DELETE_OUTPUT_DIRECTORY = True

PLUGINS = [
    "pelican.plugins.sitemap",
    "pelican.plugins.tag_cloud",
    "plugins.fix_sitemap",
    "plugins.search",
    "plugins.minify",
]

# Following items are often useful when publishing
GTAG = "G-9VKX48YDBH"

# Algolia Publish Data
ALGOLIA_APP_ID = "XE8PCLJHAE"
ALGOLIA_SEARCH_API_KEY = "ec75de1d8ce87dee234a2fd47cec2d76"
ALGOLIA_INDEX_NAME = "cloudbytes_dev"
ALGOLIA_ADMIN_API_KEY = os.environ.get("ALGOLIA_ADMIN_API_KEY")
