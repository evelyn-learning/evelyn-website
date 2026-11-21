"""
Avatar samples: real in-between frames for a teacher's mouth and blink.

  python3 keystone-avatar-morph.py <portrait.png> <framesDir> <outDir> <crop x0,y0,size> <mouth cx,cy,rx,ry> <eyes cx,cy,rx,ry> [rifeDir]

The eleven mouth states are the resting face and the ten redrawn mouths
(A E O U F C M S L H). For every pair of states a frame-interpolation tool
makes the frames in between (RIFE when [rifeDir], the unpacked
rife-ncnn-vulkan folder, is given: five per pair; otherwise ffmpeg's
minterpolate: three per pair), so going from any mouth to any
other is real movement, not a fade. The same is done from open eyes to closed
(seven or five frames in between). Everything is packed into two picture sheets:

  base.jpg    the resting face, SIZE x SIZE
  mouth.jpg   cells: 11 states, then the in-betweens of each pair (pairs in order 0-1, 0-2 … 9-10)
  eyes.jpg    cells: the in-betweens, then closed
  morph.json  where the mouth and eye boxes sit and how the sheets are laid out

Coordinates are in the portrait's own pixels (1024 square). Needs ffmpeg.
"""
import json, os, subprocess, sys, tempfile
from PIL import Image, ImageDraw, ImageFilter

SIZE = 520
KEYS = ["R", "A", "E", "O", "U", "F", "C", "M", "S", "L", "H"]
portrait, frames, out, crop, mouth, eyes = sys.argv[1:7]
RIFE = sys.argv[7] if len(sys.argv) > 7 else None
STEPS, EYE_STEPS = (5, 7) if RIFE else (3, 5)
x0, y0, cs = [int(v) for v in crop.split(",")]
scale = SIZE / cs
os.makedirs(out, exist_ok=True)
base = Image.open(portrait).convert("RGB")

def soft(spec):
    cx, cy, rx, ry = [int(v) for v in spec.split(",")]
    m = Image.new("L", (1024, 1024), 0)
    ImageDraw.Draw(m).ellipse((cx - rx, cy - ry, cx + rx, cy + ry), fill=255)
    return m.filter(ImageFilter.GaussianBlur(14))

def box_of(spec, padx, pady):
    cx, cy, rx, ry = [int(v) for v in spec.split(",")]
    w, h = (rx + padx) * 2, (ry + pady) * 2
    w += w % 2; h += h % 2
    return (cx - w // 2, cy - h // 2, cx + w // 2, cy + h // 2)

def state(key, spec, box):
    if key == "R": return base.crop(box)
    return Image.composite(Image.open(f"{frames}/{key}.png").convert("RGB"), base, soft(spec)).crop(box)

def between(a, b, n):
    """n frames evenly between pictures a and b."""
    if RIFE:  # asked for 2(n+1) frames from two pictures, RIFE returns a, the n in-betweens, then b repeated
        with tempfile.TemporaryDirectory() as d:
            os.makedirs(f"{d}/in"); os.makedirs(f"{d}/out")
            a.save(f"{d}/in/0.png"); b.save(f"{d}/in/1.png")
            subprocess.run([os.path.join(RIFE, "rife-ncnn-vulkan"), "-m", "rife-v4.6", "-i", f"{d}/in", "-o", f"{d}/out", "-n", str(2 * (n + 1))],
                           check=True, cwd=RIFE, stdout=subprocess.DEVNULL, stderr=subprocess.DEVNULL)
            return [Image.open(f"{d}/out/{i:08d}.png").convert("RGB").copy() for i in range(2, n + 2)]
    with tempfile.TemporaryDirectory() as d:
        a.save(f"{d}/0.png"); b.save(f"{d}/1.png"); b.save(f"{d}/2.png")
        subprocess.run(["ffmpeg", "-v", "error", "-y", "-framerate", "1", "-i", f"{d}/%d.png", "-vf",
                        f"minterpolate=fps={n + 1}:mi_mode=mci:mc_mode=aobmc:me_mode=bidir:vsbmc=1:scd=none:search_param=64",
                        "-frames:v", str(n + 2), f"{d}/o%d.png"], check=True)
        return [Image.open(f"{d}/o{i}.png").convert("RGB").copy() for i in range(2, n + 2)]

def sheet(cells, cols, name):
    cw, ch = cells[0].size
    w, h = round(cw * scale), round(ch * scale)
    rows = -(-len(cells) // cols)
    s = Image.new("RGB", (cols * w, rows * h), (128, 128, 128))
    for i, c in enumerate(cells): s.paste(c.resize((w, h), Image.LANCZOS), ((i % cols) * w, (i // cols) * h))
    s.save(f"{out}/{name}", quality=88)
    return {"cols": cols, "rows": rows, "count": len(cells)}

def place(box):  # the box as fractions of the cropped picture
    return {"left": (box[0] - x0) / cs, "top": (box[1] - y0) / cs, "width": (box[2] - box[0]) / cs, "height": (box[3] - box[1]) / cs}

base.crop((x0, y0, x0 + cs, y0 + cs)).resize((SIZE, SIZE), Image.LANCZOS).save(f"{out}/base.jpg", quality=90)

mbox = box_of(mouth, 52, 39)
states = [state(k, mouth, mbox) for k in KEYS]
cells = list(states)
for i in range(len(KEYS)):
    for j in range(i + 1, len(KEYS)):
        cells += between(states[i], states[j], STEPS)
    print("mouth pairs from", KEYS[i], flush=True)
meta = {"keys": KEYS, "steps": STEPS, "mouth": {**place(mbox), **sheet(cells, 18, "mouth.jpg")}}

ebox = box_of(eyes, 30, 40)
closed = state("blink", eyes, ebox)
meta["eyes"] = {**place(ebox), **sheet(between(base.crop(ebox), closed, EYE_STEPS) + [closed], EYE_STEPS + 1, "eyes.jpg"), "steps": EYE_STEPS}
json.dump(meta, open(f"{out}/morph.json", "w"), indent=1)
print("wrote", out)
