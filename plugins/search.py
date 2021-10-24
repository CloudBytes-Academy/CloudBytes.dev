"""
Plugin to integrate and send data to Algolia
"""

import logging
import hashlib
from pelican import signals
from algoliasearch.search_client import SearchClient


logger = logging.getLogger()


def main(generator, writer):
    """
    Main function to configure and send data to Algolia
    """
    logger.debug("Searching for Algolia Credentials")
    ALGOLIA_INDEX_NAME = generator.settings.get("ALGOLIA_INDEX_NAME")
    ALGOLIA_APP_ID = generator.settings.get("ALGOLIA_APP_ID")
    ALGOLIA_ADMIN_API_KEY = generator.settings.get("ALGOLIA_ADMIN_API_KEY")

    if ALGOLIA_ADMIN_API_KEY and ALGOLIA_APP_ID and ALGOLIA_INDEX_NAME:
        logger.debug("Found Algolia credentials, proceeding to indexing...")
        client = SearchClient.create(ALGOLIA_APP_ID, ALGOLIA_ADMIN_API_KEY)
        index = client.init_index(ALGOLIA_INDEX_NAME)

        for article in generator.articles:
            print(f"Indexing article: {article.title}")
            records = {}
            records["title"] = article.title
            records["slug"] = article.slug
            records["url"] = article.url
            records["tags"] = []
            for tag in getattr(article, "tags", []):
                records["tags"].append(tag.name)
            records["content"] = article.content
            records["category"] = article.category
            logger.debug("Adding Algolia object...")
            records["objectID"] = hashlib.sha256(str(article.slug).encode("utf-8")).hexdigest()
            index.save_objects([records])
        logger.debug("Indexing complete...")
    else:
        logger.warning("No Algolia Configuration Found: Skipping Algolia update")


def register():
    """
    Register the plugin to Pelican
    """
    # WARNING: ALGOLIA PLUGIN needs to be run after writers finish,
    # Otherwise it conflicts with internal link rewrites.
    # Refer to bug https://github.com/getpelican/pelican-plugins/issues/314
    signals.article_writer_finalized.connect(main)
