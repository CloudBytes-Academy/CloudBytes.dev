import pytest
from bs4 import BeautifulSoup


def pagination_element_count(path):
    page = open(path, "r", encoding="utf-8")
    soup = BeautifulSoup(page, "html.parser")
    pagination = soup.find_all("ul", {"class": "pagination"})
    assert len(pagination) == 1


def test_pagination():
    paths = ["output/snippets/index.html"]
    for path in paths:
        pagination_element_count(path)
