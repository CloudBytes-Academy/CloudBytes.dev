"""
# --*-- coding: utf-8 --*--
# Minify HTML Files
"""

import glob
import logging
import minify_html


from pelican import signals

logger = logging.getLogger()


def main(pelican):
    """
    # Minify HTML Files
    """
    for file in glob.iglob(pelican.output_path + "/**/*.html", recursive=True):
        logger.info(f"Processing {file}")
        try:
            with open(file, "r", encoding="utf-8") as html:
                minified = minify_html.minify(html.read(), do_not_minify_doctype=True)
            with open(file, "w", encoding="utf-8") as html:
                html.write(minified)
        except Exception as e:
            logger.error(f"Error while minifying {file}: {e}")


def register():
    """
    # Register Plugin
    """
    signals.finalized.connect(main)
