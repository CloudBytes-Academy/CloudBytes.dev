Title: Limit article tags to allowed list in Pelican SSG
Date: 2021-11-04
Category: Snippets
Tags: python, pelican
Author: Rehan Haider
Summary: How to limit article tags to only an allowed list in Pelican SSG and not end up with too many tags.
Keywords: python, pelican


Pelican makes it easy to create tags for your articles, where you can simply define them as part of the article's metadata.

E.g., this posts has two tags: "python" and "pelican" which are defined in the posts's markdown metadata.

```markdown
Title: Limit tags and categories to allowed list in Pelican SSG
Date: 2021-11-04
Category: Snippets
Tags: python, pelican
Author: Rehan Haider
```

But this also means you can end up with too many tags they can get out of control. 

I try to provide a simple way to limit the tags to a list of allowed tags below. 

## How to limit tags in Pelican

First, create a variables in `pelicanconf.py` file (the Pelican configuration file). This will contain the list of allowed tags, e.g. below:

```python
# Add this to you pelicanconf.py file

ALLOWED_TAGS = ('python', 'pelican','firebase','aws')
```

Once these are defined, they can be called be used directly in your SSG theme templates for the Pelican website, e.g. in the `article.html` template to limit the categories to only the ones from the list above, we can create a small JINJA snippet to do this:

```html
<div class="article-tags">
    {% for tag in article.tags %}
    {% if tag in ALLOWED_TAGS %}
    <a href="/tags/{{tag}}"><{{tag}}</span></a>
    {% endif %}
    {% endfor %}
</div>
```
This will ensure that only the tags from the list defined in `pelicanconf.py` are displayed, and the rest are suppressed.

### Why not limit the tags at source?
Two reasons, the first is that Pelican's content is written in markdown, which is a plain text format so one cannot stop someone from adding a tag that wasn't approved in the article metadata. 

The second is, you can potentially stop Pelican from processing a file if it contains a tag that isn't approved listed in the `pelicanconf.py` file, but this just seems a bit messy specially if you have multple authors considering not all of them will be well versed with Pelican's internals and also the fact that this adds an additional layer of processing which can potentially slow down the generation of the website.

But the main reason I wouldn't limit it at generation is because pelican's internals are a bit fragile and I've managed to break it in a few ways, so I'm not sure if it's worth the risk.


If you have questions / suggestions feel free to create a new discussion on [CloudBytes\dev> Github discussions](https://github.com/CloudBytesDotDev/CloudBytes.dev/discussions)
