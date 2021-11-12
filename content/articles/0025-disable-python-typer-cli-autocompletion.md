Title: Disable the default completion options in Python Typer CLI 
Date: 2021-09-25
Category: Snippets
Tags: python, typer
Author: Rehan Haider
Summary: A short guide to disable the default options such as install-completion and show-completion in Python Typer CLI, a popular CLI building tool
Keywords: Python, typer


TL;DR - jump to the [solution](#disable-completion-option).

[Typer](https://typer.tiangolo.com/) is a great! But it's documentation isn't. 

So I ran into a challenge while building a simple app where I didn't intend to provide the users autocompletion options and was wondering how to disable the typical output that it prints out while invoking the program

```text
Usage: app.py [OPTIONS]

Options:
  --lat FLOAT
  --long FLOAT
  --method TEXT
  --install-completion [bash|zsh|fish|powershell|pwsh]
                                  Install completion for the specified shell.
  --show-completion [bash|zsh|fish|powershell|pwsh]
                                  Show completion for the specified shell, to
                                  copy it or customize the installation.
  --help                          Show this message and exit.
```

As you can see, it is rather a simple app where only 3 inputs are provided and it just looks cluttered. So I wanted to disable it. 

Unfortunately, as I mentioned earlier, the documentation didn't talk about it. 

## Disable completion option

So eventually it took a bit of reading the source course to figure out how to disable it. The trick is to pass `add_completion=False` argument while initialising the `typer.Typer` app, as shown below

```python
import typer

app = typer.Typer(add_completion=False)

@app.command()
def foo(lat: float = None, long: float = None, method: str = None):
    typer.echo(f"{lat}, {long}, {method}")



if __name__ == "__main__":
    app()
```

And now the output unsurprisingly looks like

```text
Usage: app.py [OPTIONS]

Options:
  --lat FLOAT
  --long FLOAT
  --method TEXT
  --help         Show this message and exit.
```