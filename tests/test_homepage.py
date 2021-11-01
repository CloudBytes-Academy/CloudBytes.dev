"""
# --*-- coding: utf-8 --*--
# Path: tests/test_base.py
# Test the base data
"""
from datetime import date
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


def test_footer():
    """
    # Test the footer
    """
    footer = soup.find("footer")

    # Test the footer exists
    assert footer is not None

    # check the class of elements in footer
    assert footer.find("div", {"class": "footer-row"}) is not None
    assert len(footer.find("div", {"class": "footer-row"}).findChildren(recursive=False)) == 3

    # check the links in the footer
    assert len(footer.find("div", {"class": "footer-row"}).find_all("a")) == 4
    assert len(footer.find("div", {"class": "footer-row"}).find("ul").find_all("a")) == 3

    # check the contents of the footer
    assert footer.find("a", {"href": "/terms"}).text.strip() == "Terms"
    assert footer.find("a", {"href": "/privacy"}).text.strip() == "Privacy Policy"
    assert footer.find("a", {"href": "/sitemap.xml"}).text.strip() == "Sitemap"

    # Check copyright message & year

    assert (
        footer.find("p", {"class": "copyright"}).text.strip()
        == f"Copyright © 2020 - {date.today().year} CloudBytes. All rights reserved."
    )


def test_content():
    """
    # Test the main content
    """
    content = soup.find("div", {"class": "content-main"})

    # Test the content exists
    assert content is not None

    # Check the content header
    assert content.find("h1").text.strip() == "Latest Code Snippets"

    # Check the card container
    assert content.find("div", {"class": "row-max-1"}) is not None

    # Check the number of cards
    assert len(content.find("div", {"class": "row-max-1"}).findChildren(recursive=False)) == 6

    # check the link to snippets
    assert content.find("a", {"href": "/snippets"}).text.strip() == "View all Code Snippets"
