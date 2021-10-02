Title: Set the default command in Python Typer CLI
Date: 2021-10-01
Category: Articles
Tags: python, typer
Author: Rehan Haider
Summary: A short guide to setting a default command using callback when making multiple commands in Python Typer 
Keywords: Python, Typer


TL;DR - jump to the [solution](#setting-a-default-command).

As I mentioned previously, [Typer is great]({filename}0025-disable-python-typer-cli-autocompletion.md), but it's documentation isn't. 

While building a Typer app that has only one `@app.command()` decorated function that function is treated as the default command.

```python
import typer

app = typer.Typer(add_completion=False)

@app.command()
def foo(lat: float = None, long: float = None, method: str = None):
    typer.echo(f"{lat}, {long}, {method}")

if __name__ == "__main__":
    app()

```

E.g. if you run the above program 
```bash
/usr/bin/python3 main.py --lat 20.5 --long 88.3 --method cartesian
```

You will get an output like below
```text
20.5 88.3 cartesian
```

This is the expected behaviour because Typer has set foo() as the default action if the program is run. But if you create two commands like the example below

```python
import typer

app = typer.Typer(add_completion=False)


@app.command()
def foo(lat: float = None, long: float = None, method: str = None):
    typer.echo(f"{lat}, {long}, {method}")


@app.command()
def bar():
    typer.echo("I'm just here to mess things up...")


if __name__ == "__main__":
    app()
```

If you re-run this program

```bash
/usr/bin/python3 main.py --lat 20.5 --long 88.3 --method cartesian
```

You will rightly get an error as below stating there are no such options
```text
Usage: main.py [OPTIONS] COMMAND [ARGS]...
Try 'main.py --help' for help.

Error: No such option: --lat
```

The reason is, since there are two commands, typer is expecting to see at least one of them. 
```bash
/usr/bin/python3 main.py --help
```
Checking using help option

As you can see below, there are no default options and two commands, and Typer doesn't know which one to use as default. 
```text
Usage: main.py [OPTIONS] COMMAND [ARGS]...

Options:
  --help  Show this message and exit.

Commands:
  bar
  foo
```

## Setting a default command
The answer to out problems? Callbacks!

Typer has a callback functionality allows the developer to create CLI parameters for the main CLI application itself.

So in our example, we will make two changes
1. change foo() decorator from `@app.command()` to `@app.callback()`
2. Add `invoke_without_command=True` argument to the above


```python
import typer

app = typer.Typer(add_completion=False)


@app.callback(invoke_without_command=True)
def foo(lat: float = None, long: float = None, method: str = None):
    typer.echo(f"{lat}, {long}, {method}")


@app.command()
def bar():
    typer.echo("I'm just here to mess things up...")


if __name__ == "__main__":
    app()
```

If you check the help again, 

```text
Usage: main.py [OPTIONS] COMMAND [ARGS]...

Options:
  --lat FLOAT
  --long FLOAT
  --method TEXT
  --help         Show this message and exit.

Commands:
  bar
```
You don't see `foo()` since that has become the default action and the `--lat`, `--long`, & `--method` are added as default options. 

If you run the program again
```bash
/usr/bin/python3 main.py --lat 20.5 --long 88.3 --method cartesian
```

You will get an output like below
```text
20.5 88.3 cartesian
```
