"""
# --*-- coding: utf-8 --*--
# path: tests/test_internal_links.py
# This file tests the internal links and tries to access it to ensure there are no errors.
"""

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
                page_urls.append(url)
            elif url.startswith(BASE_URL):
                page_urls.append(url)
            elif url.startswith("../"):
                url = url.replace("../", "/")
                url = BASE_URL + url
                page_urls.append(url)
    return page_urls


def test_internal_links():
    """
    This function tests all internal links in the URLs on the sitemap
    """
    sitemap_urls = get_sitemap_links()
    sitemap_urls.remove(f"{BASE_URL}/404")

    valid_urls = []

    for url in sitemap_urls:
        page_urls = get_page_links(url)
        for page_url in page_urls:
            if page_url not in valid_urls:
                response = requests.get(page_url)
                assert response.status_code == 200
                valid_urls.append(page_url)


def test_404_page():
    """
    This function tests the 404 page
    """
    response = requests.get(f"{BASE_URL}/404")
    assert response.status_code == 404
