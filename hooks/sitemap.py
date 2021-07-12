def fix_sitemap():
    try:
        with open("output/sitemap.xml", "r") as file:
            original = file.read()
            corrected = original.replace(".html", "")
    except Exception as e:
        print(f"Opening sitemap failed with error: {e}")

    try:
        with open("output/sitemap.xml", "w") as file:
            file.write(corrected)
    except Exception as e:
        print(f"Saving sitemap failed with error: {e}")
