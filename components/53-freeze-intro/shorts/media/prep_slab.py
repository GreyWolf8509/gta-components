"""B (r06) bakes for the photo slab: the frozen frame printed on a Three.js slab (media/slab3d.js) on a dark stage.

    /usr/bin/python3 prep_slab.py <b-dir> [K]

Reads media/frz_h.png (the -h shot's frame 24, colour), media/grade_h.png (steel grade, Franklin painted out) and
media/subj_h.png (Franklin cut out, warm lift + gold light-wrap). Writes into <b-dir>/media/:
  slab_frz.png   the slab's frozen look: the steel-graded world with Franklin composited back in warm colour (1920x1080)
  stage.png      the stage around the slab (1080x1920): the Short's own frozen framing (-h x 1015-1622 scaled K) thrown far
                 out of focus (sigma 60), level x0.30, saturation x1.45, a deep teal cast, a warm key-light pool behind the
                 slab's upper right, a dark floor towards the bottom and the corners (blacks kept, never a grey bed; lesson 17)
  back_steel.png r07: the backdrop is the frozen frame itself (the critic: "keep the freeze full-frame"): the Short's framing
                 of the WHOLE frame (Franklin too) in the slab's steel grade (a luma -> RGB LUT fitted on grade_h outside him),
                 defocused (sigma 16), level x0.62, contrast 1.12, a warm key pool behind the slab, the bottom falling to ink
                 under the name (lesson 17: blacks kept, never a grey bed)
  back_col.png   the same in colour (the colour floods back on the release)
"""
import sys, os
import numpy as np, cv2
from PIL import Image

bdir = sys.argv[1]
K = float(sys.argv[2]) if len(sys.argv) > 2 else 1.7793
md = os.path.join(bdir, "media")
rd = lambda n: np.asarray(Image.open(os.path.join(md, n)).convert("RGBA" if n.startswith("subj") else "RGB")).astype(np.float32) / 255.0

col, grade, subj = rd("frz_h.png"), rd("grade_h.png"), rd("subj_h.png")
a = subj[..., 3:4]
# the steel world keeps its blacks and never goes milky: highlights (Lamar's white tee, the sky's bright clouds) roll off
# into a shoulder that tops out at 0.86, and the steel cast is saturated x1.25 so whites read steel-blue, not pale grey
g = grade.copy()
kk = 0.66
g = np.where(g > kk, kk + (0.86 - kk) * (1 - np.exp(-(g - kk) / (0.86 - kk))), g)
Lg = (g[..., 0:1] * 0.2126 + g[..., 1:2] * 0.7152 + g[..., 2:3] * 0.0722)
g = np.clip(Lg + (g - Lg) * 1.25, 0, 1)
frz = g * (1 - a) + subj[..., :3] * a
Image.fromarray((np.clip(frz, 0, 1) * 255 + 0.5).astype(np.uint8)).save(os.path.join(md, "slab_frz.png"), optimize=True)

# ---- stage: a dark, rich studio backdrop (deep teal-navy falling to ink), lit by the same frozen frame: its sky colour,
# far out of focus, tints the upper backdrop; a warm key-light pool sits behind the slab's upper right; the floor goes to ink
M = np.float32([[K, 0, -1015 * K], [0, K, 0]])
fr = cv2.warpAffine(frz, M, (1080, 1920), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)
fr = cv2.GaussianBlur(fr, (0, 0), 90)
Y, X = np.mgrid[0:1920, 0:1080].astype(np.float32)
t = np.clip(Y / 1920, 0, 1)[..., None]
top, mid, low = np.float32([0.050, 0.105, 0.150]), np.float32([0.030, 0.058, 0.085]), np.float32([0.010, 0.014, 0.020])
f = np.where(t < 0.45, top + (mid - top) * (t / 0.45), mid + (low - mid) * np.clip((t - 0.45) / 0.4, 0, 1))
# the frame's own sky, deep and saturated, only in the upper backdrop (so the stage belongs to the shot)
Lf = (fr[..., 0:1] * 0.2126 + fr[..., 1:2] * 0.7152 + fr[..., 2:3] * 0.0722)
sky = np.clip(Lf + (fr - Lf) * 1.6, 0, 1) * np.float32([0.55, 0.75, 1.0]) * 0.20
f = f + sky * np.clip(1.0 - Y / 900, 0, 1)[..., None]
# warm key-light pool spilling onto the backdrop behind the slab (upper right, where the key sits)
pool = np.exp(-(((X - 760) / 520) ** 2 + ((Y - 420) / 430) ** 2))
f = 1 - (1 - f) * (1 - pool[..., None] * np.float32([0.34, 0.22, 0.09]))
# a low warm bounce under the name (the gold title lights its floor)
bounce = np.exp(-(((X - 510) / 520) ** 2 + ((Y - 1330) / 190) ** 2))
f = 1 - (1 - f) * (1 - bounce[..., None] * np.float32([0.16, 0.10, 0.035]))
# corners fall off
r = np.sqrt(((X - 540) / 820) ** 2 + ((Y - 760) / 1300) ** 2)
f = f * np.clip(1.18 - 0.7 * r, 0.3, 1)[..., None]
# fine deterministic grain so the dark gradients never band
rng = np.random.default_rng(53)
f = np.clip(f + (rng.standard_normal((1920, 1080, 1)).astype(np.float32) * 0.006), 0, 1)
Image.fromarray((f * 255 + 0.5).astype(np.uint8)).save(os.path.join(md, "stage.png"), optimize=True)
print("ok", "stage mean", round(float(f.mean() * 255), 1), "top", round(float(f[:270].mean() * 255), 1), "bottom", round(float(f[1500:].mean() * 255), 1))

# ---- r07 backdrop: the frozen frame itself, out of focus, in the slab's steel grade (and in colour for the release)
Lc = col[..., 0] * 0.2126 + col[..., 1] * 0.7152 + col[..., 2] * 0.0722
outside = cv2.dilate((a[..., 0] > 0.02).astype(np.uint8), np.ones((25, 25), np.uint8)) == 0
bins = np.clip((Lc * 63).astype(int), 0, 63)
lut = np.zeros((64, 3), np.float32); cnt = np.zeros(64)
for c in range(3):
    lut[:, c] = np.bincount(bins[outside], weights=g[..., c][outside], minlength=64)
cnt = np.bincount(bins[outside], minlength=64)
ok = cnt > 20
for c in range(3):
    lut[:, c] = np.interp(np.arange(64), np.nonzero(ok)[0], lut[ok, c] / cnt[ok])
steel = lut[bins]
def backdrop(img):
    f = cv2.warpAffine(img, M, (1080, 1920), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)
    f = cv2.GaussianBlur(f, (0, 0), 16)
    f = np.clip((f - 0.5) * 1.12 + 0.5, 0, 1) * 0.62
    pool = np.exp(-(((X - 700) / 520) ** 2 + ((Y - 380) / 400) ** 2))
    f = 1 - (1 - f) * (1 - pool[..., None] * np.float32([0.22, 0.15, 0.06]))
    v = np.clip((Y - 1000) / 760, 0, 1) ** 1.1                       # the floor under the name falls to ink
    f = f * (1 - 0.78 * v[..., None])
    rr2 = np.sqrt(((X - 540) / 900) ** 2 + ((Y - 760) / 1350) ** 2)
    f = f * np.clip(1.15 - 0.6 * rr2, 0.35, 1)[..., None]
    f = np.clip(f + rng.standard_normal((1920, 1080, 1)).astype(np.float32) * 0.005, 0, 1)
    return (f * 255 + 0.5).astype(np.uint8)
Image.fromarray(backdrop(steel)).save(os.path.join(md, "back_steel.png"), optimize=True)
Image.fromarray(backdrop(col)).save(os.path.join(md, "back_col.png"), optimize=True)
bs = np.asarray(Image.open(os.path.join(md, "back_steel.png"))).astype(np.float32)
print("back_steel mean", round(float(bs.mean()), 1), "top", round(float(bs[:290].mean()), 1), "bottom(1450+)", round(float(bs[1450:].mean()), 1))
