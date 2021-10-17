import logging
from pelican import signals

logger = logging.getLogger(__name__)

# This function called when all_generators_finalized signal sent
def main(generators):
    try:
        with open("output/sitemap.xml", "r") as file:
            original = file.read()
            corrected = original.replace(".html", "")
    except Exception as e:
        logger.critical(f"Opening sitemap failed with error: {e}")

    try:
        with open("output/sitemap.xml", "w") as file:
            file.write(corrected)
    except Exception as e:
        logger.critical(f"Saving sitemap failed with error: {e}")


def register():
    signals.finalized.connect(main)
