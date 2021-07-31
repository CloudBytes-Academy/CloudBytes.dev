Title: Python For Loops, using range vs enumerate
Date: 2021-07-31
Category: Articles
Tags: python
Author: Rehan Haider
Summary: How to use python for loops, using range vs enumerate
Keywords: Python, for loop


Python for loops are different to the conventional programming languages in a key aspect, its syntax doesn't use an iterator. 

But that is a feature not a bug, the '*Pythonic*' way to write for loop is to run it over a range or a list by item and not by using an index to refer to the next element like C or Java. E.g.

```python
fruits = ['apple', 'orange', 'banana', 'tomato', 'cucumber']

for fruit in fruits:
    print(fruit)
```

Will print out
```bash
apple
orange
banana
tomato
cucumber
```

If we wanted to do the same in C, not withstanding the complexities, it would look like,
```c
for (int i = 0, i < 5, i++)
{
    printf("%s", fruits[i])
}
```

## Range and Enumerate functions

But there are many scenarios where you might need to iterate using index. For such cases, Python has two in-builts functions `range()` and `enumerate()` that provides this feature. 

### range()

Range is used to iterate over a sequence of numbers, e.g. to print 0 - 4, 

```python
for i in range(5):
    print(i)
```

We can use this to iterate over out fruits list with an iterator

```python
fruits = ['apple', 'orange', 'banana', 'tomato', 'cucumber']

for i in range(5):
    print(fruits[i])
```

But you now have a new problem, in the first example, we didn't have to worry about the length of the list, with range you do. You can still solve it by usng `len()` method

```python
fruits = ['apple', 'orange', 'banana', 'tomato', 'cucumber']
for i in range(len(fruits)):
    print(fruits[i])
```

### enumerate()

Instead of calculating the length and iterating over the list, we can also simply use enumerate() to get the same results.

```python
fruits = ['apple', 'orange', 'banana', 'tomato', 'cucumber']
for i, item in enumerate(fruits):
    print(f"Using iterator: {fruits[i]}")
    print(f"Using item: {item}")
```

## Range vs Enumerate: What should you use? 

As with most things, the answer is, it depends! And more often than not, it will end up being a personal choice. 

But from purely a performance perspective, we can test it. 

### Performance testing range() and enumerate()

Let's start by setting up a baseline. We will generate a list with 10000 integers, and then compute if each one of them are prime number of not and add them to an output list. 

#### Baseline: Simple iteration
```python
from time import time

# start the time counter
start = time()

def prime(num):
    '''Function to compute if a number is prime'''
    for i in range(2, int(num/2)+1):
        if num % i == 0:
            return False
    return True

# Generating a list of integers
n = 9999
inputs = [i for i in range(n)]
outputs = []

for number in inputs:
    outputs.append(f"{number} is prime? {prime(number)}")

end = time()

print(end - start)
```

For me it took ~44.6 secs

#### Using range()

```python
from time import time

# start the time counter
start = time()

def prime(num):
    '''Function to compute if a number is prime'''
    for i in range(2, int(num/2)+1):
        if num % i == 0:
            return False
    return True

# Generating a list of integers
n = 9999
inputs = [i for i in range(n)]
outputs = []

for i in range(len(inputs)):
    outputs.append(f"{inputs[i]} is prime? {prime(inputs[i])}")
    
end = time()

print(end - start)
```

Took roughly ~47.7 seconds

### Using enumerate()

```python
from time import time

# start the time counter
start = time()

def prime(num):
    '''Function to compute if a number is prime'''
    for i in range(2, int(num/2)+1):
        if num % i == 0:
            return False
    return True

# Generating a list of integers
n = 9999
inputs = [i for i in range(n)]
outputs = []

for i in range(len(inputs)):
    outputs.append(f"{inputs[i]} is prime? {prime(inputs[i])}")
    
end = time()

print(end - start)
```
This took about ~45.76 seconds


## Conclusion

If you're iterating over a list, enumerate is probably the most optimal option. 