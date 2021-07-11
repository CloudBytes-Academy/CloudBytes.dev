import re

with open("output/sitemap.xml", "r") as file:
    original = file.read()
    corrected = original.replace(".html", "")

with open("output/sitemap.xml", "w") as file:
    file.write(corrected)
