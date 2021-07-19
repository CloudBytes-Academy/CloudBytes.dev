Title: Add a Table of Contents using Markdown in Pelican
Date: 2021-07-18
Category: Articles
Tags: python, pelican, markdown
Author: Rehan Haider
Summary: A guide to customising Markdown to add table of contents in Python Pelican
Keywords: pelican, python, markdown, toc



I've spoken about how [Pelican documentation is incoherent]({filename}0002 fixing-pelican-sitemap-error-on-google-search-console.md). One of the key features that Pelican keeps hinting towards but never explains in detail is how to customise the Markdown output. 

Pelican uses [Pygments](https://pygments.org/) as its code syntax highlighter, something that they mention several times. And Pelican uses [Python-Markdown](https://python-markdown.github.io/) to convert the Markdownto HTML, again something that is not explicitly mentioned just hinted at. 

**So how do you customise Markdown output?**
By using the official [Table of Content](https://python-markdown.github.io/extensions/toc/) extension from Python-Markdown. A key feature, not even hinted at in the Pelican Documentation. 


## How to add a TOC to Pelican?

Pelican uses `MARKDOWN` dictionary to store the configuration you want to use for `Python-Markdown`. To add a TOC, append this snippet in your `pelicanconf.py` 

```python
MARKDOWN = {
    "extension_configs": {
        # Needed for code syntax highlighting
        "markdown.extensions.codehilite": {"css_class": "highlight"},
        "markdown.extensions.extra": {},
        "markdown.extensions.meta": {},
        # This is for enabling the TOC generation
        "markdown.extensions.toc": {"title": "Table of Contents"},
    },
    "output_format": "html5",
}
```

After that, you just need to add the shortcode `[TOC]` in  your markdown file where you want to inser the TOC. 

This will do two things

1. Add the table of contents to the output of your article
2. Add the class name `toc` to the table of contents that you can format using CSS

## How is the Table of Content built?

After adding `[TOC]` in your markdown document, it is replaced by the nested list of headers in you documents, e.g., 

```md
[TOC]

# 1 Main header
Content under main header
## 1.1 Secondary header
COntent under secondary header
```

will be replaced by 

```html
<div class="toc">
  <ul>
    <li><a href="#1-main-header">1 Main header</a></li>
      <ul>
        <li><a href="#11-secondary-header">1.1 Secondary header</a></li>
      </ul>
  </ul>
</div>
<h1 id="1-main-header">Header 1</h1>
<p>Content under main header</p>
<h2 id="11-secondary-header">Header 2</h2>
<p>Content under secondary header</p>
```

You can use a bit of CSS to format your TOC by adding the below to your CSS stylesheets
```css
.toc {
    border-radius: 0.5em;
    margin-bottom: 1em;
    background: #222831;
    padding: .5em;
    margin-top: 1em;
    top: 30px;
    box-shadow: rgba(0, 0, 0, 0.7) 0px 10px 20px 0px;
}

.toc ul {
    list-style: none;
    padding: 0.5rem 1rem;
    margin: 0;
}

.toc ul li {
    padding: .25em;
}

.toc ul li a {
    color: #498afb;
    font-weight: 500;
    transition: color .4s;
}

.toc ul li a:hover {
    color: #9166cc;
    transition: color .4s;
    border-bottom: 1px solid #9166cc;
}

.toc ul li ul {
    font-size: .75em;
    font-weight: 500;
    margin-left: 5px;;;;;
}

.toc ul li ul a {
    color: #b2becd;
}
```
This is how you add a table of contents to a markdown document in Pelican.
