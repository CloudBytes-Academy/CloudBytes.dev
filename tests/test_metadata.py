"""
# --*-- coding: utf-8 --*--
# Path: tests/test_metadata.py
# Test the website metadata
"""
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
        sitemap_urls.append(url)

    return sitemap_urls


# check if the a link has valid favicons
@pytest.mark.parametrize("URL", get_sitemap_links())
def test_favicon(URL):
    """
    Test if the a link has a valid favicon
    """
    response = requests.get(URL)
    soup = BeautifulSoup(response.text, "html5lib")
    favicon = soup.find("link", {"rel": "icon"})
    assert favicon is not None


# Check if the a link has valid title
@pytest.mark.parametrize("URL", get_sitemap_links())
def test_title(URL):
    """
    Test if the a link has a valid title
    """
    response = requests.get(URL)
    soup = BeautifulSoup(response.text, "html5lib")
    title = soup.find("title")
    assert title is not None
