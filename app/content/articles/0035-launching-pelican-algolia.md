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

### What gets uploaded to Algolia

For every article that gets published, the following record gets uploaded to Algolia:

1. **Slug**: The slug of the article, e.g. the slug of this article is `launching-pelican-algolia-plugin-for-pelican` that can be seen in the URL of this article.
2. **Title**: Title of the article
3. **URL**: Full URL of the article, this is needed to ensure the results have correct links.
4. **tags**: Tags assigned to an article
5. **category**: Category assigned to an article
6. **content**: Full content of your article

With slug used as the primary key to avoid duplication.

## Creating a search box
To make a working search box, you need to do two things

1. Create a [HTML Search box](#1-html-search-box)
2. Include the [Javascript code](#2-javascript-code) in your HTML page


### 1. HTML Search box
Here's what I have on [CloudBytes/dev>](https://cloudbytes.dev)

```html
    <div class="algolia-hits">
        <div class="algolia-form-wrap">
            <input placeholder="Search for bytes ..." type="text" id="algolia-input" class="algolia-input"
                autocomplete="off" />
            <span id="search-close" class="algolia-close btn btn-red">X</span>
        </div>
    </div>
```
Note the `id=algolia-input` in the <input> tag above, this needs to be added to the JavaScript code below.

### 2. Javascript code
Place this right at the bottom of you HTML just before closing </html> tag.
Replace the `autocomplete('#algolia-input', ... ) with the ID of input field shown above.

The code below includes JINJA syntax so it needs to be added to your HTML templates to ensure they are correctly replaced during generation.

```javascript
<!-- Include AlgoliaSearch JS Client and autocomplete.js library -->
<script src="https://cdn.jsdelivr.net/algoliasearch/3/algoliasearch.min.js"></script>
<script src="https://cdn.jsdelivr.net/autocomplete.js/0/autocomplete.min.js"></script>
<!-- Initialize autocomplete menu -->
<script>
    var client = algoliasearch("{{ALGOLIA_APP_ID}}", "{{ALGOLIA_SEARCH_API_KEY}}");
    var index = client.initIndex('{{ALGOLIA_INDEX_NAME}}');
    //initialize autocomplete on search input (ID selector must match)
    autocomplete('#algolia-input',
        { hint: false }, {
        source: autocomplete.sources.hits(index, { hitsPerPage: 10 }),
        //value to be displayed in input control after user's suggestion selection
        displayKey: 'title',
        //hash of templates used when rendering dataset
        templates: {
            //'suggestion' templating function used to render a single suggestion
            suggestion: function (suggestion) {
                return '<a class="algolia-hit" href="' + suggestion.url + '">' +
                    '<h4>' +
                    '<span class="hit-title">' + suggestion._highlightResult.title.value + '</span>' +
                    '</h4>' +
                    '</a>'
            }
        }
    });
</script>
```

## What next?

On the horizon is the ability to choose which records gets published. For now, the plugin will publish all records.
