import minify_html
import glob
import os
import sys

from pelican import signals


def main(pelican):
    for file in glob.iglob(pelican.output_path + "/**/*.html", recursive=True):
        print(f"Processing {file}")
        try:
            with open(file, "r", encoding="utf-8") as html:
                minified = minify_html.minify(html.read(), do_not_minify_doctype=True)
            with open(file, "w", encoding="utf-8") as html:
                html.write(minified)
        except Exception as error:
            print(error)


def register():
    signals.finalized.connect(main)
