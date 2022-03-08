Title: Find and test invalid links and 404 errors using Python & Pytest
Date: 2021-11-01
Category: Snippets
Tags: python
Author: Rehan Haider
Summary: A short guide to scrape your own website, find invalid links, and highlight links that result in 404 errors
Keywords: python, beautifulsoup, sitemap, 404, scrape


TL;DR: Go to the [solution](#the-solution-workflow-to-validate-the-links) directly.

So, I recently managed to break something on [CloudBytes/dev>](https://cloudbytes.dev). All the internal links on the site were broken, and I published the website. 

I only noticed the error when the number of 404 erros increased significantly in the analytics report. So I set about creating a Python script to find the broken links and highlight them during the [Continous Integration process I have setup]({filename}99999971-building-cicd-pipelines-with-github-actions.md). 

## The Solution Workflow to validate the links

I came up with the following set of steps to first populate the links and then validate if they exist. 

To begin with: 

1. Fetch the sitemap.xml file from the website & create a list of all links on the website
2. For each link in the list, check if it exists on the website and fetch the webpage
3. Find all the links in the webpage
4. Then request the webpage for each link and check if it exists
5. If the page exists, then add it to the list of valid links


## Pytest Program to Scrawl & Test Website

```python
import pytest
import requests
from bs4 import BeautifulSoup

BASE_URL = "http://localhost:8080"
SITE_URL = "https://cloudbytes.dev"

def get_sitemap_links():
    """
    This function gets all links from the sitemap
    """
    sitemap_url = BASE_URL + "/sitemap.xml"
    sitemap_response = requests.get(sitemap_url)
    sitemap_soup = BeautifulSoup(sitemap_response.text, "lxml")
    sitemap_links = sitemap_soup.find_all("loc")

    sitemap_urls = []
    for link in sitemap_links:
        url = link.text.replace(SITE_URL, BASE_URL)
        sitemap_urls.append(url)

    return sitemap_urls


def get_page_links(url):
    """
    This function gets all links from a page
    """
    page_response = requests.get(url)
    page_soup = BeautifulSoup(page_response.text, "html5lib")
    page_links = page_soup.find_all("a")

    page_urls = []
    for link in page_links:
        url = link.get("href")
        if url is not None:
            if url.startswith("/"):
                url = BASE_URL + url
            elif url.startswith(BASE_URL):
                page_urls.append(url)
            else:
                pass

    return page_urls


def test_internal_links():
    """
    This function tests all internal links in the URLs on the sitemap
    """
    sitemap_urls = get_sitemap_links()
    valid_urls = []
    for url in sitemap_urls:
        page_urls = get_page_links(url)
        for page_url in page_urls:
            if page_url not in valid_urls:
                response = requests.get(page_url)
                assert response.status_code == 200
                valid_urls.append(page_url)
```

### Explanation

**Step 0:** Set the Site URL and Base URL

I set BASE_URL to localhost and SITE_URL to cloudbytes.dev. The reason for doing both is that in the CI process I use the localhost server to run the tests, but you can use the same program above to test a live website with minor changes.

```python
BASE_URL = "http://localhost:8080"
SITE_URL = "https://cloudbytes.dev"
```

**Step 1:** Fetch the sitemap.xml file from the website & create a list of all links on the website

```python
def get_sitemap_links():
    """
    This function gets all links from the sitemap
    """
    sitemap_url = BASE_URL + "/sitemap.xml"
    sitemap_response = requests.get(sitemap_url)
    sitemap_soup = BeautifulSoup(sitemap_response.text, "lxml")
    sitemap_links = sitemap_soup.find_all("loc")

    sitemap_urls = []
    for link in sitemap_links:
        url = link.text.replace(SITE_URL, BASE_URL)
        sitemap_urls.append(url)

    return sitemap_urls
```

I also create a function to get all the links from a webpage passed as an argument
```python
def get_page_links(url):
    """
    This function gets all links from a page
    """

    page_response = requests.get(url)
    page_soup = BeautifulSoup(page_response.text, "html5lib")
    page_links = page_soup.find_all("a")

    page_urls = []
    for link in page_links:
        url = link.get("href")
        if url is not None:
            if url.startswith("/"):
                url = BASE_URL + url
            elif url.startswith(BASE_URL):
                page_urls.append(url)
            else:
                pass

    return page_urls
```

**Step 2** For each link in the list, check if it exists on the website and fetch the webpage

We do this in the `test_internal_links` function, where we get all the links in the sitemap

```python
    sitemap_urls = get_sitemap_links()
```

**Step 3** Find all the links in the webpage
```python
    for url in sitemap_urls:
        page_urls = get_page_links(url)
```

**Step 4** Then request the webpage for each link and check if it exists
```python
        for page_url in page_urls:
            if page_url not in valid_urls:
                response = requests.get(page_url)
```

**Step 5** If the page exists, then add it to the list of valid links
```python
                assert response.status_code == 200
                valid_urls.append(page_url)
```

Finally, run this script by running the following command (You need to have `pytest` installed):

```bash
pytest
```

And this will scrape through the entire website and check if all the internal links are valid.