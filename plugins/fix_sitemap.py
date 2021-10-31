"""
# --*-- coding: utf-8 --*--
# Plugin to strip ".hmml" from sitemap.
# This is pecific for clean URLs in Firebase hosting
"""

import logging
from pelican import signals

logger = logging.getLogger(__name__)

# This function called when all_generators_finalized signal sent
def main(generators):
    """
    Remove .html from sitemap
    """
    try:
        with open("output/sitemap.xml", "r", encoding="utf-8") as file:
            original = file.read()
            corrected = original.replace(".html", "")
    except Exception as error:
        logger.critical(f"Opening sitemap failed with error: {error}")

    try:
        with open("output/sitemap.xml", "w", encoding="utf-8") as file:
            file.write(corrected)
    except Exception as error:
        logger.critical(f"Saving sitemap failed with error: {error}")


def register():
    """
    Run after everything is complete
    """
    signals.finalized.connect(main)
