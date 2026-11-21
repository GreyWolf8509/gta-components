"""Builds the freeze-frame layers for one variant from its frozen frame (media/frz.png) and a model cutout.

    /usr/bin/python3 prep_freeze.py <variant-dir> <cutout.png> [split]

Writes into <variant-dir>/media/:
  grade.png   the frozen frame with the subject painted out, in the cool steel freeze grade (blacks kept)
  subj.png    the subject alone (RGBA): warm lift, a gold light-wrap on the top edges, a little sharpening
  outline.js  window.FRZ_OUTLINE = {W, H, top:[x,y], left:"d", right:"d", lenL, lenR, bbox}: the keyline traced around him,
              split at the crown into two open paths (they draw down both sides at once); frame-edge runs are left out.
Needs numpy, PIL, scipy, cv2 (the macOS system python has them).
"""
import sys, json, os
import numpy as np
from PIL import Image, ImageFilter
import cv2
from scipy import ndimage as ndi

vdir, cutp = sys.argv[1], sys.argv[2]
split = sys.argv[3] if len(sys.argv) > 3 else ""
md = os.path.join(vdir, "media")
frz = np.asarray(Image.open(os.path.join(md, "frz.png")).convert("RGB")).astype(np.float32) / 255.0
H, W = frz.shape[:2]
a = np.asarray(Image.open(cutp).convert("RGBA"))[..., 3].astype(np.float32) / 255.0

# ---- keep only the hero: an optional split line (A: Franklin is right of his hoodie's left edge) + largest component
if split == "franklin-a":
    ys = [0, 540, 560, 600, 700, 800, 900, 1080]
    xs = [1060, 1030, 1000, 990, 970, 955, 946, 950]
    bx = np.interp(np.arange(H), ys, xs)
    X = np.arange(W)[None, :]
    a = a * np.clip((X - bx[:, None]) / 2.0 + 0.5, 0, 1)
    # right: his sleeve ends where the beige house wall begins (similar colour, so the model took both)
    rx = np.interp(np.arange(H), [0, 780, 805, 870, 948, 1080], [1800, 1640, 1617, 1628, 1648, 1670])
    a = a * np.clip((rx[:, None] - X) / 2.0 + 0.5, 0, 1)
hard = a > 0.5
lab, n = ndi.label(hard)
if n > 1:
    sizes = ndi.sum(hard, lab, range(1, n + 1))
    keep = 1 + int(np.argmax(sizes))
    hard = lab == keep
hard = ndi.binary_fill_holes(hard)
# soft matte limited to the kept component (a 3 px band keeps the model's soft edge)
near = ndi.binary_dilation(hard, iterations=3)
a = np.where(near, a, 0.0)
a = np.where(ndi.binary_erosion(hard, iterations=3), 1.0, a)
# tighten the edge a touch so no background halo rides along (the gold keyline sits outside it)
a = np.clip((a - 0.18) / 0.72, 0, 1)
a = cv2.GaussianBlur(a, (0, 0), 0.8)

# ---- subject: warm lift + sharpen + gold light-wrap concentrated on the upper edges
subj = frz.copy()
blur = cv2.GaussianBlur(subj, (0, 0), 1.6)
subj = np.clip(subj + (subj - blur) * (0.9 if W < H else 0.55), 0, 1)          # B is a 1.8x upscale: sharpen harder
subj = np.clip((subj - 0.5) * 1.07 + 0.5 + 0.015, 0, 1) * np.array([1.045, 1.0, 0.93], np.float32)
er = ndi.binary_erosion(a > 0.5, iterations=12).astype(np.float32)
band = np.clip(a - cv2.GaussianBlur(er, (0, 0), 7), 0, 1)
band = cv2.GaussianBlur(band, (0, 0), 3.0) * a
yy = np.linspace(1, 0, H, dtype=np.float32)[:, None]
# weight the wrap towards the top of the figure (the light comes from the gold title above him)
ys_, xs_ = np.nonzero(a > 0.5)
top, bot = ys_.min(), ys_.max()
wy = np.clip(1.0 - (np.arange(H) - top) / max(1, (bot - top) * 0.55), 0.18, 1.0)[:, None].astype(np.float32)
gold = np.array([1.0, 0.80, 0.42], np.float32)
wrap = (band * wy * 0.62)[..., None] * gold
subj = 1 - (1 - np.clip(subj, 0, 1)) * (1 - wrap)                                 # screen
rgba = np.dstack([np.clip(subj, 0, 1), a]).astype(np.float32)
Image.fromarray((rgba * 255 + 0.5).astype(np.uint8)).save(os.path.join(md, "subj.png"), optimize=True)

# ---- background plate: paint the subject out (so the parallax never reveals a grey ghost), then the freeze grade
m = (ndi.binary_dilation(a > 0.05, iterations=14)).astype(np.uint8) * 255
small = cv2.resize((frz * 255).astype(np.uint8), (W // 2, H // 2), interpolation=cv2.INTER_AREA)
msmall = cv2.resize(m, (W // 2, H // 2), interpolation=cv2.INTER_NEAREST)
fill = cv2.inpaint(cv2.cvtColor(small, cv2.COLOR_RGB2BGR), msmall, 12, cv2.INPAINT_TELEA)
fill = cv2.cvtColor(cv2.resize(fill, (W, H), interpolation=cv2.INTER_CUBIC), cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
mf = cv2.GaussianBlur(m.astype(np.float32) / 255.0, (0, 0), 3)[..., None]
plate = frz * (1 - mf) + fill * mf
plate = cv2.GaussianBlur(plate, (0, 0), 1.2)                                       # a whisper of defocus: the subject pops
L = plate[..., 0] * 0.2126 + plate[..., 1] * 0.7152 + plate[..., 2] * 0.0722
L = np.clip((L - 0.5) * 1.18 + 0.5, 0, 1)                                          # contrast 1.18
stops = [(0.00, "#03060B"), (0.30, "#0E2134"), (0.58, "#2F5874"), (0.82, "#7FA8C2"), (1.00, "#D6E8F2")]
sx = np.array([s for s, _ in stops], np.float32)
sc = np.array([[int(h[i:i + 2], 16) / 255 for i in (1, 3, 5)] for _, h in stops], np.float32)
duo = np.stack([np.interp(L, sx, sc[:, k]) for k in range(3)], -1)
graded = duo * 0.86 + plate * 0.14                                                 # a little of the real colour survives
graded = np.clip(graded * 0.9, 0, 1)
Image.fromarray((graded * 255 + 0.5).astype(np.uint8)).save(os.path.join(md, "grade.png"), optimize=True)

# ---- keyline: outer contour of the hero, split at the crown, frame-edge runs dropped
cs, _ = cv2.findContours((a > 0.5).astype(np.uint8), cv2.RETR_EXTERNAL, cv2.CHAIN_APPROX_NONE)
c = max(cs, key=cv2.contourArea)[:, 0, :].astype(np.float32)
c = cv2.approxPolyDP(c.reshape(-1, 1, 2), 1.2, True)[:, 0, :]
ti = int(np.argmin(c[:, 1] + np.abs(c[:, 0] - c[:, 0].mean()) * 0.02))
c = np.roll(c, -ti, axis=0)                                                        # start at the crown
onedge = lambda p: p[0] <= 2 or p[0] >= W - 3 or p[1] >= H - 3 or p[1] <= 2
def chain(pts):
    out = []
    for p in pts:
        if onedge(p):
            break
        out.append(p)
    return out
fwd = chain(list(c) + [c[0]])          # crown -> one side
bwd = chain([c[0]] + list(c[::-1]))    # crown -> the other side
def d_of(pts):
    pts = [(round(float(x), 1), round(float(y), 1)) for x, y in pts]
    return "M" + " L".join("%s %s" % p for p in pts), float(sum(np.hypot(pts[i + 1][0] - pts[i][0], pts[i + 1][1] - pts[i][1]) for i in range(len(pts) - 1)))
# left = the chain whose mean x is smaller
if np.mean([p[0] for p in fwd]) > np.mean([p[0] for p in bwd]):
    fwd, bwd = bwd, fwd
dl, ll = d_of(fwd)
dr, lr = d_of(bwd)
x0, y0, bw, bh = cv2.boundingRect((a > 0.5).astype(np.uint8))
out = {"W": W, "H": H, "top": [float(c[0][0]), float(c[0][1])], "left": dl, "right": dr, "lenL": round(ll, 1), "lenR": round(lr, 1),
       "bbox": [int(x0), int(y0), int(x0 + bw), int(y0 + bh)]}
with open(os.path.join(md, "outline.js"), "w") as f:
    f.write("/* generated by prep_freeze.py: the subject keyline, crown -> down each side (frame px). */\nwindow.FRZ_OUTLINE = " + json.dumps(out) + ";\n")
print(json.dumps({k: out[k] for k in ("top", "lenL", "lenR", "bbox")}))
