from pelican import signals
import minify_html


def minify(sender):
    input_css_path = "design/alexis/static/css/style.css"
    output_css_path = "output/assets/css/style.min.css"
    with open(input_css_path, "r") as file:
        css = file.read()

    try:
        minified = minify_html.minify(css, minify_js=False, minify_css=True)
    except SyntaxError as err:
        print(err)

    with open(output_css_path, "w") as file:
        file.write(minified)
    print("Successfully minified")


def register():
    signals.finalized.connect(minify)
