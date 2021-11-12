Title: Received & return a file from in-memory buffer using FastAPI
Date: 2021-10-15
Category: Snippets
Tags: python, fastapi
Author: Rehan Haider
Summary: How to receive a file to the in-memory buffer and then return the file from buffer using FastAPI without saving it to disk. 
Keywords: Python, fastAPI


FastAPI is fast becoming the go-to choice to write APIs using Python mostly due to its asynchronous nature. 

FastAPI by default will use `JSONResponse` method to return responses, however, it has the ability to return several custom responses including `HTMLResponse` and `FileResponse`. However, both of these messages returns files that are saved on the disk and requires a `PATH`. 

E.g. from [FastAPI Documentation](https://fastapi.tiangolo.com/advanced/custom-response/#fileresponse), 
```python
from fastapi import FastAPI
from fastapi.responses import FileResponse

file_path = "sample-file.mp4"
app = FastAPI()


@app.get("/", response_class=FileResponse)
async def main():
    return file_path
```

So what if you wanted to send a file that is currently in the memory buffer, directly without the additional step of saving it on the disk? 

## Why simply using StreamingResponse is not enough? 
The right way of sending a file from memory is by using `StreamingResponse`, but `StreamingResponse` requires an iterator object, e.g.
```python
from fastapi import FastAPI
from fastapi.responses import StreamingResponse

some_file_path = "large-video-file.mp4"
app = FastAPI()


@app.get("/")
def main():
    def iterfile():  
        with open(some_file_path, mode="rb") as file_like:  
            yield from file_like  

    return StreamingResponse(iterfile(), media_type="video/mp4")
```

But in reality the files e.g. images, etc. that you work with will rarely be an iterator object. Thus you are swapping one workaround with another workaround. 

## Using StreamingResponse correctly
Instead what we will do is, 
1. Receive the image directly in memory
2. Apply a `blur` PIL filter to the image method to the image
3. Return the image directly without saving


```python
from fastapi import FastAPI, File, UploadFile
from fastapi.responses import StreamingResponse
from io import BytesIO

app = FastAPI()

@app.post("/")
def image_filter(img: UploadFile = File(...)):
    original_image = Image.open(img.file)
    original_image = original_image.filter(ImageFilter.BLUR)

    filtered_image = BytesIO()
    original_image.save(filtered_image, "JPEG")
    filtered_image.seek(0)

    return StreamingResponse(filtered_image, media_type="image/jpeg")
```

### Testing the API
Save the above code in a file named app.py

You need to install the following libraries for this to work
```
pip install fastapi
pip install "uvicorn[standard]"
pip install Pillow
pip install python-multipart
```

Then fire up the FastAPI app by running
```bash
uvicorn app:app --reload
```

This should start the app on `127.0.0.1/8000` as shown below

![Uvicorn run]({static}/images/s0027/uvicorn_run.png)

Open the swaggerUI using any browser by openign the link `127.0.0.1/8000/docs`, then click on try it out, then choose a image from and press Execute. 

![Swagger UI]({static}/images/s0027/swagger_ui.png)
After that if you scroll below you should see a blurred image. 

An example of before and after is shown below, (but really this is just an excuse to show you a cat pic)
![Blurred Cat]({static}/images/s0027/cat_pic.jpg)


