# Skill: Extract Images from a Microsoft OneNote (.one) File

## Problem
You receive a `*.one` file (Microsoft OneNote binary) that contains screenshots
you need to view, but OneNote isn't available and the file can't be opened directly.

## Solution
OneNote stores embedded images as raw PNG/JPEG streams inside the binary. You can
"carve" them out using Python by scanning for image magic signatures.

```python
# Requires: pip install Pillow
import os, re
from PIL import Image

data = open('input.one', 'rb').read()
PNG_START = b'\x89PNG\r\n\x1a\n'
PNG_IEND  = b'IEND\xaeB\x60\x82'
os.makedirs('out', exist_ok=True)

count = 0
pos = 0
while True:
    s = data.find(PNG_START, pos)
    if s == -1: break
    e = data.find(PNG_IEND, s)
    if e == -1: break
    chunk = data[s:e+len(PNG_IEND)]
    if len(chunk) > 500:                       # skip tiny fragments
        count += 1
        open(f'out/img_{count}.png', 'wb').write(chunk)
    pos = e + len(PNG_IEND)
print(f'Carved {count} PNGs')

# Verify validity + dimensions
for f in sorted(os.listdir('out')):
    im = Image.open(f'out/{f}'); print(f, im.size)
```

## Gotchas
- JPEG carving needs `\xff\xd8\xff` start + `\xff\xd9` end markers — but OneNote
  often stores JPGs inside compressed wrappers, so PNG carving is more reliable.
- Some carved PNGs may be UI icons (tiny) — filter by `len > 1000` and dimensions.
- Pillow is required to validate; the raw carve can produce corrupt fragments if
  the end marker lands inside unrelated data. Always verify with `Image.open`.
- This worked for `N- OSS SNAPS.one` → 17 valid screenshots extracted to `extracted_imgs/`.
