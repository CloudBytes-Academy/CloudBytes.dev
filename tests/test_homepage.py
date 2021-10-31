"""
# --*-- coding: utf-8 --*--
# Path: tests/test_base.py
# Test the base data
"""
import pytest
import requests
from bs4 import BeautifulSoup


BASE_URL = "http://localhost:8080"
response = requests.get(BASE_URL)
soup = BeautifulSoup(response.text, "html.parser")


def test_homepage():
    """
    # Test the homepage
    """
    assert response.status_code == 200


def test_title():
    """
    # Test the title
    """
    title = soup.find("title")

    # Test the title exits
    assert title is not None

    # Test the title contains the correct text
    assert title.text.strip() == "Home"


def test_navbar():
    """
    # Test the navbar
    """
    navbar = soup.find("nav", {"class": "navbar"})

    # Test the navbar exits
    assert navbar is not None

    # check if navbar contains four links
    assert len(navbar.find_all("a")) == 4

    # check the order of the links in the navbar
    for i, link in enumerate(navbar.find_all("a")):
        if i == 0:
            assert link.text.strip() == "Home"
        elif i == 1:
            assert link.text.strip() == "How-to Articles"
        elif i == 2:
            assert link.text.strip() == "Publications"
        elif i == 3:
            assert link.text.strip() == "Tags"

    # check if navbar contains the correct links
    assert navbar.find("a", {"href": "/"}).text.strip() == "Home"
    assert navbar.find("a", {"href": "/snippets"}).text.strip() == "How-to Articles"
    assert navbar.find("a", {"href": "/books"}).text.strip() == "Publications"
    assert navbar.find("a", {"href": "/tags"}).text.strip() == "Tags"

    # check if navbar links contains svg icons
    assert navbar.find("a", {"href": "/"}).find("svg") is not None
    assert navbar.find("a", {"href": "/snippets"}).find("svg") is not None
    assert navbar.find("a", {"href": "/books"}).find("svg") is not None
    assert navbar.find("a", {"href": "/tags"}).find("svg") is not None


def test_topnav():
    """
    # Test the content of the topnav
    """
    topnav = soup.find("nav", {"class": "topnav"})

    # Test the topnav exists
    assert topnav is not None

    # check the numeber of childs elements in the topnav
    assert len(topnav.findChildren(recursive=False)) == 6

    # check the ids of elements in topnav
    assert topnav.find("div", {"id": "search-open"}) is not None
    assert topnav.find("a", {"aria-label": "GitHub"}) is not None
    assert topnav.find("div", {"id": "themeButton"}) is not None
    assert topnav.find("div", {"id": "search"}) is not None
    assert topnav.find("div", {"id": "mega"}) is not None

    # check the contents of theme button and menu toggler
    assert len(topnav.find("div", {"id": "themeButton"}).find_all("div", {"class": "item"})) == 2
    assert len(topnav.find("menu-toggler").find_all("div", {"class": "item"})) == 2

    # Check if topnav contains svg icons
    assert topnav.find("div", {"id": "search-open"}).find("svg") is not None
    assert topnav.find("a", {"aria-label": "GitHub"}).find("svg") is not None
    assert len(topnav.find("div", {"id": "themeButton"}).find_all("svg")) == 2
    assert len(topnav.find("menu-toggler").find_all("svg")) == 2
