"""
Avatar samples: turns one illustrated teacher portrait and its edited variants
(mouth shapes A E O U F C M, and a blink) into the layers the browser stacks.

  python3 keystone-avatar-frames.py <portrait.png> <framesDir> <outDir> <crop x0,y0,size> <mouth cx,cy,rx,ry> <eyes cx,cy,rx,ry>

Coordinates are in the portrait's own pixels. Only the mouth area of a mouth
frame and only the eye area of the blink frame are kept (soft-edged), so the
rest of the face never shifts between frames. Writes base.jpg and one
transparent PNG per frame, all SIZE x SIZE.
"""
import sys
from PIL import Image, ImageDraw, ImageFilter

SIZE = 360
portrait, frames, out, crop, mouth, eyes = sys.argv[1:7]
x0, y0, cs = [int(v) for v in crop.split(",")]
box = (x0, y0, x0 + cs, y0 + cs)

def mask(spec):
    cx, cy, rx, ry = [int(v) for v in spec.split(",")]
    m = Image.new("L", (1024, 1024), 0)
    ImageDraw.Draw(m).ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill=255)
    return m.filter(ImageFilter.GaussianBlur(14))

base = Image.open(portrait).convert("RGB")
base.crop(box).resize((SIZE, SIZE), Image.LANCZOS).save(f"{out}/base.jpg", quality=90)
for key, spec in [(k, mouth) for k in "AEOUFCM"] + [("blink", eyes)]:
    im = Image.open(f"{frames}/{key}.png").convert("RGB")
    im.putalpha(mask(spec))
    im = im.crop(box).resize((SIZE, SIZE), Image.LANCZOS)
    bb = im.getchannel("A").point(lambda v: 255 if v > 2 else 0).getbbox()
    layer = Image.new("RGBA", (SIZE, SIZE), (0, 0, 0, 0))
    layer.paste(im.crop(bb), bb[:2])
    layer.save(f"{out}/{key}.png", optimize=True)
print("wrote", out)
