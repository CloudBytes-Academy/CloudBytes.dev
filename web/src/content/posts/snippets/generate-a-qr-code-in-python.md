---
title: "How to generate a QR code in Python"
description:
    "How to generate QR codes in Python using the qrcode library: save a PNG from a URL, set the size, border and error correction, export
    an SVG for print, and make a Wi-Fi QR code."
pubDate: "2026-10-22"
category: "Snippets"
categorySlug: "snippets"
slug: "generate-a-qr-code-in-python"
tags:
    - "python"
    - "qrcode"
keywords:
    - "python"
    - "qrcode"
    - "qr code python"
    - "generate qr code python"
    - "python qr code svg"
    - "wifi qr code python"
author: "Rehan Haider"
authorSlug: "rehan-haider"
---

You need a QR code for a link, a poster, or your Wi-Fi network, and you want to make it from a script instead of an online tool. In Python,
the [qrcode](https://pypi.org/project/qrcode/) library does this in two lines.

In this post, we will:

1. Install the `qrcode` library
2. Make a PNG from a URL
3. Set the size, border, and error correction level
4. Save an SVG for print
5. Make a Wi-Fi QR code

If you only need one QR code and don't want to write any Python, I built [Fast QR](https://fast-qr.app), a free QR code generator you can
use instead.

## Install the qrcode library

I recommend you do this inside a [virtual environment]({filename}99999999-create-a-python-virtual-environment.md). Run the following
command:

```bash
pip install "qrcode[pil]"
```

The `[pil]` part also installs [Pillow](https://pypi.org/project/pillow/), which `qrcode` uses to make PNG images with custom colors. The
examples in this post use `qrcode` 8.2, which needs Python 3.9 or newer.

## Make a PNG from a URL

Create a file named `make_png.py`:

```python
# filename: make_png.py

import qrcode

img = qrcode.make("https://cloudbytes.dev")
img.save("cloudbytes.png")
```

Run it:

```bash
python make_png.py
```

You should now have a `cloudbytes.png` file in the same directory. In my case it was 330 x 330 pixels. Scan it with your phone camera and it
will open the URL.

`qrcode.make()` uses the default settings. To change them, use the `QRCode` class as shown in the next section.

## Set the size, border, and error correction level

Create a file named `custom_png.py`:

```python
# filename: custom_png.py

import qrcode

qr = qrcode.QRCode(
    version=None,
    error_correction=qrcode.constants.ERROR_CORRECT_H,
    box_size=20,
    border=4,
)
qr.add_data("https://cloudbytes.dev")
qr.make(fit=True)

img = qr.make_image(fill_color="black", back_color="white")
img.save("cloudbytes-large.png")

print(f"Version: {qr.version}")
print(f"Image size: {img.pixel_size} x {img.pixel_size} px")
```

Run it with `python custom_png.py` and you should see:

```text
Version: 3
Image size: 740 x 740 px
```

Let's see what each parameter does:

- `version` controls how many squares (called "modules") the code has. It is an integer from 1 to 40, and version 1 is a 21 x 21 grid. Set
  it to `None` and call `qr.make(fit=True)` to let the library pick the smallest version that fits your data.
- `box_size` is how many pixels wide each module is.
- `border` is how many modules wide the quiet zone around the code is. The default is 4, which is the minimum the QR code specification
  allows, so don't set it lower.
- `fill_color` and `back_color` set the module and background colors. They accept color names or RGB tuples such as `(55, 95, 35)`.

The image size is `(modules + 2 x border) x box_size`. In our case, version 3 is 29 modules wide, so the image is `(29 + 8) x 20 = 740`
pixels.

### Error correction levels

Error correction lets a scanner read the code even if part of it is dirty, damaged, or covered by a logo. The library has four levels:

| Constant          | Damage it can recover from |
| ----------------- | -------------------------- |
| `ERROR_CORRECT_L` | About 7%                   |
| `ERROR_CORRECT_M` | About 15% (default)        |
| `ERROR_CORRECT_Q` | About 25%                  |
| `ERROR_CORRECT_H` | About 30%                  |

A higher level adds more modules for the same data. E.g. our URL fits in version 2 at the default level `M`, but needs version 3 at level
`H`. The default `M` works for most codes. Use `Q` or `H` if the code is printed somewhere it can get damaged, or if you put a logo on top
of it.

For more detail on how each level works, see
[QR code error correction explained](https://fast-qr.app/learn/qr-code-error-correction-explained) on Fast QR.

## Save an SVG for print

A PNG gets blurry when you scale it up. For posters, flyers, and anything else that goes to a printer, save an SVG instead. An SVG is a
vector image, so it stays sharp at any size.

`qrcode` includes SVG image factories for this. Create a file named `make_svg.py`:

```python
# filename: make_svg.py

import qrcode
import qrcode.image.svg

img = qrcode.make(
    "https://cloudbytes.dev",
    image_factory=qrcode.image.svg.SvgPathImage,
)
img.save("cloudbytes.svg")
```

Run it with `python make_svg.py` and open `cloudbytes.svg` in your browser to check it.

`SvgPathImage` draws all the modules as a single path, which the library documentation recommends because it avoids thin white lines between
modules when you zoom in. It has no background, so everything except the dark modules is transparent. If you will print on a colored
background, use `qrcode.image.svg.SvgPathFillImage` instead, which adds a white background.

The `image_factory` argument also works with the `QRCode` class, so you can combine it with the size and error correction settings from the
previous section.

If you are not sure which format to use where, see [PNG vs SVG for QR codes](https://fast-qr.app/learn/qr-format-png-vs-svg) on Fast QR.

## Make a Wi-Fi QR code

A Wi-Fi QR code lets guests join your network by scanning the code instead of typing the password. Android and iOS 11 or later both support
it.

The QR code holds a plain text string in this format, documented on the
[ZXing barcode contents wiki](https://github.com/zxing/zxing/wiki/Barcode-Contents#wi-fi-network-config-android-ios-11):

```text
WIFI:T:WPA;S:mynetwork;P:mypass;;
```

- `T` is the authentication type: `WEP`, `WPA`, `WPA2-EAP`, or `nopass` for an open network. Use `WPA` for a normal password-protected
  network.
- `S` is the network name (SSID).
- `P` is the password. Leave it out if `T` is `nopass`.
- `H:true` is optional. Add it if your network is hidden.
- The string ends with `;;`.

The characters `\`, `;`, `,`, `"` and `:` must be escaped with a backslash if they appear in the SSID or password. The Wi-Fi Alliance
registered the `wifi` URI scheme with [IANA](https://www.iana.org/assignments/uri-schemes/prov/wifi), and the formal definition is in
section 7 of its WPA3 specification.

Create a file named `wifi_qr.py`:

```python
# filename: wifi_qr.py

import qrcode


def escape(value):
    # Escape the backslash first, then the other special characters
    for char in ["\\", ";", ",", '"', ":"]:
        value = value.replace(char, "\\" + char)
    return value


ssid = "CloudBytes Guest"
password = "pa;ss:word"

payload = f"WIFI:T:WPA;S:{escape(ssid)};P:{escape(password)};;"
print(payload)

qrcode.make(payload).save("wifi.png")
```

Replace `ssid` and `password` with your own network details, then run `python wifi_qr.py`. With the example values, it prints:

```text
WIFI:T:WPA;S:CloudBytes Guest;P:pa\;ss\:word;;
```

Notice that the `;` and `:` in the password are escaped. Without the escaping, the scanner would read the password as `pa` and fail to
connect.

!!! warning Anyone who scans or photographs a Wi-Fi QR code can read the password, so only put it where you would share the password.
