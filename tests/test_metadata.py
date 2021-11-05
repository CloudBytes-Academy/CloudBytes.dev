"""
# --*-- coding: utf-8 --*--
# Path: tests/test_metadata.py
# Test the website metadata
"""
import os
import pytest
import requests
from bs4 import BeautifulSoup

BASE_URL = "http://localhost:8080"
SITE_URL = "https://cloudbytes.dev"

# Get list of all links in sitemap
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
        sitemap_urls.append(url.rstrip("/"))  # Remove trailing slash from certain urls

    return sitemap_urls


sitemap_urls = get_sitemap_links()

# Check if the a link has valid favicons
@pytest.mark.parametrize("URL", sitemap_urls)
def test_favicon(URL):
    """
    Test if the a link has a valid favicon
    """
    response = requests.get(URL)
    soup = BeautifulSoup(response.text, "html5lib")
    favicon = soup.find("link", {"rel": "icon"})
    assert favicon is not None


# Check if the a link has valid title
@pytest.mark.parametrize("URL", sitemap_urls)
def test_title(URL):
    """
    Test if the a link has a valid title
    """
    response = requests.get(URL)
    soup = BeautifulSoup(response.text, "html5lib")
    title = soup.find("title")
    assert title is not None


# Check if the a link has valid description
@pytest.mark.parametrize("URL", sitemap_urls)
def test_description(URL):
    """
    Test if the a link has a valid description
    """
    response = requests.get(URL)
    soup = BeautifulSoup(response.text, "html5lib")
    description = soup.find("meta", {"name": "description"})
    assert description is not None


# Check if a link has valid keywords
@pytest.mark.parametrize("URL", sitemap_urls)
def test_keywords(URL):
    """
    Test if the a link has a valid keywords
    """
    response = requests.get(URL)
    soup = BeautifulSoup(response.text, "html5lib")
    keywords = soup.find("meta", {"name": "keywords"})
    assert keywords is not None


# Check if a link has valid canonical url & it matches with expectd URL
@pytest.mark.parametrize("URL", sitemap_urls)
def test_canonical(URL):
    """
    Test if the a link has a valid canonical url
    """
    response = requests.get(URL)
    soup = BeautifulSoup(response.text, "html5lib")
    canonical = soup.find("link", {"rel": "canonical"})
    assert canonical is not None
    # Check if the canonical url matches with the expected URL
    if os.environ.get("TEST_ENV"):
        # In test environments, the base url served by firebase is localhost:8080
        URL = URL.replace(BASE_URL, SITE_URL)
    assert canonical["href"] == URL
