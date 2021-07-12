from glob import glob
import minify_html


def html(output_dir):
    files = glob(f"{output_dir}/**/*.html", recursive=True)

    for path in files:
        try:
            with open(path, "r") as file:
                html = file.read()
        except Exception as e:
            print(f"Opening path {path} failed with error: {e}")

        try:
            minified = minify_html.minify(html, minify_js=True, minify_css=True)
        except Exception as e:
            print(f"Minification of css at {path} failed with error {e}")

        try:
            with open(path, "w") as file:
                file.write(minified)
        except Exception as e:
            print(f"Saving css at {path} failed with error {e}")

    ##


#    try:
#        minified = minify_html.minify(css, minify_js=False, minify_css=True)
#    except SyntaxError as err:
#        print(err)

#    with open(output_css_path, "w") as file:
#        file.write(minified)
#    print("Successfully minified")
