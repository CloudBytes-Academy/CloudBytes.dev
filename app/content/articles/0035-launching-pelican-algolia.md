Title: Launching Pelican Algolia plugin for Pelican
Date: 2021-11-05
Category: Snippets
Tags: python, pelican, algolia
Author: Rehan Haider
Summary: Launching Pelican Algolia plugin, an open source software published on PyPi, that can help integrate Algolia Search in your Pelican blog.
Keywords: python, pelican, algolia, plugin


Pelican's preferred search tool, Tipue Search, is defunct. It is no longer maintained and the website has been shut down. 

So I decided to write a plugin for Pelican to integrate Algolia Search, and release it as a opensource software. 

The Github repository is available here: [pelican-algolia](https://github.com/rehanhaider/pelican-algolia)
The PyPi repository is available here: [pelican-algolia](https://pypi.org/project/pelican-algolia/)


## Installation of Pelican Algolia plugin
Installation is easy. Just install the plugin from PyPi.

```bash
pip install pelican-algolia
```

## Usage of Pelican Algolia plugin

Detailed instructions are available on the [GitHub repository](https://github.com/rehanhaider/pelican-algolia), however in summary you need to set the following in your pelican configuration file (`pelicanconf.py` or `publishconf.py` depending on your usage):

```python
# Algolia Publish Data

# Admin key is sensitive so fetching it from environment variable is recommended
import os
ALGOLIA_ADMIN_API_KEY = os.environ.get("ALGOLIA_ADMIN_API_KEY")


ALGOLIA_APP_ID = "<Your Algolia App ID>"
ALGOLIA_SEARCH_API_KEY = "<Your Search-only Api Key>"
ALGOLIA_INDEX_NAME = "<You Algolia App Index name>"
```

## What gets uploaded to Algolia

For every article that gets published, the following record gets uploaded to Algolia:
1. Slug
2. Title
3. URL
4. tags
5. category
6. content

With slug used as the primary key to avoid duplication.


## What next?

On the horizon is the ability to choose which records gets published. For now, the plugin will publish all records.
