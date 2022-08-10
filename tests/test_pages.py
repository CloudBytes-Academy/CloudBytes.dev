"""
# --*-- coding: utf-8 --*--
# path: tests/test_internal_links.py
# This file tests the internal links and tries to access it to ensure there are no errors.
"""

import requests
import logging

logger = logging.getLogger(__name__)

BASE_URL = "http://localhost:8080"
SITE_URL = "https://cloudbytes.dev"


def test_404_page():
    """
    This function tests the 404 page
    """
    response = requests.get(f"{BASE_URL}/404")
    assert response.status_code == 404
