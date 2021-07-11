import xml.etree.ElementTree as ET


sitemap = ET.parse("output/sitemap.xml")
map = sitemap.getroot()

for url in map.iter("{http://www.sitemaps.org/schemas/sitemap/0.9}loc"):
    if url.text != "https://uberpython.com/":
        url.text = url.text[:-5]

sitemap.write("output/sitemap.xml")
