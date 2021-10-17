from pelican import signals
from algoliasearch.search_client import SearchClient


# ALGOLIA_ADMIN_API = os.environ.get("ALGOLIA_ADMIN_API")
# print(ALGOLIA_ADMIN_API)
# client = SearchClient.create("XE8PCLJHAE", "ALGOLIA_ADMIN_API")
# index = client.init_index("cloudbytes_dev")


def main(generator):
    ALGOLIA_INDEX_NAME = generator.settings.get("ALGOLIA_INDEX_NAME")
    ALGOLIA_APP_ID = generator.settings.get("ALGOLIA_APP_ID")
    ALGOLIA_ADMIN_API_KEY = generator.settings.get("ALGOLIA_ADMIN_API_KEY")

    client = SearchClient.create(ALGOLIA_APP_ID, ALGOLIA_ADMIN_API_KEY)
    index = client.init_index(ALGOLIA_INDEX_NAME)

    for article in generator.articles:
        print("Indexing article: '%s'" % article.title)
        records = {}
        records["title"] = article.title
        records["slug"] = article.slug
        records["url"] = article.url
        records["tags"] = []
        for tag in getattr(article, "tags", []):
            records["tags"].append(tag.name)
        records["content"] = article.content
        records["category"] = article.category
        print("Adding Algolia object...")
        index.save_objects([records], {"autoGenerateObjectIDIfNotExist": True})


def register():
    signals.article_generator_finalized.connect(main)
