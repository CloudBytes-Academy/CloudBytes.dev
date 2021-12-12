Title: Which Python Implementation you should use (Cpython, PyPy, etc.)?
Date: 2021-12-12
Category: Snippets
Tags: python
Author: Rehan Haider
Summary: A short introduction to the different Python implementations.
Keywords: cpython, jython, 

Python as you know it is not just a programming language. The Python that you download from the official [Python.org](https://www.python.org/) website is a **reference implementation**. What that means is it implements the Python language specifications, as defined by the [Python Software Foundation](https://www.python.org/dev/).

But Python.org's reference implementation is not the only Python implementation available. There are many other some with very specialised use cases and for beginners sometimes this can get confusing. So let's take a look at some key Python implementations available and when


## CPython
![python-logo]({static}/images/s0042/python-logo.png)

[CPython](https://www.python.org/downloads/)The officiis Python implementation that is used by the Python Software Foundation. Written in C and Python, it is the most popular Python implementation and is used by the vast majority of Python developers. CPython is considered the most mature and "production-quality" Python implementation.

If you're starting out with Python, you should definitely start with CPython as you're least likely to encounter any issues with it.

## PyPy
![pypy-logo]({static}/images/s0042/pypy-logo.png)

[PyPy](https://www.pypy.org/download.html) is a Python implementation written in Python (specifically RPython) and is a replacement for CPython. PyPy's main utility is that it is **really fast**, in fact, it claims to be [almost 5x faster than CPython](https://speed.pypy.org/).

However, PyPy can run most Python code except for when the code depends on CPython extensions which results in either inability to run or significant loss of performance.

PyPy is intended for advanced users who want to optimise their code for performance.

## Jython
![jython-logo]({static}/images/s0042/jython-logo.png)

[Jython](https://www.jython.org/download/) is a Python implementation written in Python and Java and is designed to run on Java platforms. The key use case for Jython is its ability to import Java classes and that Jython compiles the Python code into Java bytecode which can be run on Java Virtual Machines (JVM).

The typical use case of Jython is when Java classes are needed to be imported, e.g. you could build an Android app using a mix of Jython which can import Java Android packages and a toolkit like Kivy. 

## CircuitPython
![circuitpython-logo]({static}/images/s0042/circuitpython-logo.png)

[CircuitPython](https://circuitpython.org/) is maintained by [Adafruit](https://www.adafruit.com/) and is designed to run on certain microcontroller hardware such as the [Adafruit Feather M0](https://www.adafruit.com/product/3317) and [Adafruit Feather M4](https://www.adafruit.com/product/3316). Is is written in C and is not exlusive to Adafruit Microcontrollers and can be used for other supported microcontroller hardware as well. 

## Other notable Python implementations
1. [Numba](http://numba.pydata.org/) is a NumPy aware JIT compiler that can compile a subset of Python code into machine code for faster execution
2. [Pyston](https://www.pyston.org/) is a relatively new alternate Python implementation designed to be a drop-in replacement for CPython and optimised for performance with claimed improvements of 30% in speed
3. [RPython](https://rpython.readthedocs.io/en/latest/) is a restricted version of Python is a subset of CPython and is designed to be a framework for creating dynamic languages

## Conclusion
For most purposes, **CPython** is the implementation you should be using, unless you have a specific reason to use another implementation as described above.
