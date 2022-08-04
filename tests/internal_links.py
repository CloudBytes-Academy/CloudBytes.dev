"""
# --*-- coding: utf-8 --*--
# path: tests/test_internal_links.py
# This file tests the internal links and tries to access it to ensure there are no errors.
"""

import pytest
import requests
from bs4 import BeautifulSoup
import logging

logger = logging.getLogger(__name__)

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


def get_internal_urls():
    """
    This function gets all internal links from the site
    """

    internal_urls = []
    for url in get_sitemap_links():
        response = requests.get(url)
        soup = BeautifulSoup(response.text, "lxml")
        for link in soup.find_all("a"):
            href = link.get("href")
            logger.info(f"Found {link}")
            if href is not None and href.startswith(BASE_URL):
                internal_urls.append(href)
            elif href is not None and not href.startswith("http"):
                internal_urls.append(f"{BASE_URL}/{href}")
    return set(internal_urls)


def test_internal_links():
    """
    This function tests the internal links
    """
    internal_urls = get_internal_urls()
    for url in internal_urls:
        logger.info(f"Testing {url}")
        response = requests.get(url)
        assert response.status_code == 200


def test_404_page():
    """
    This function tests the 404 page
    """
    response = requests.get(f"{BASE_URL}/404")
    assert response.status_code == 404
