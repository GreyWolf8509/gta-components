"""B (r08) backdrop bake for the pop-out slab.

    /usr/bin/python3 prep_pop.py <b-dir> [K]

r08 lets Franklin's head break out above the slab's top rim, so the backdrop behind the slab must not carry a big blurred copy
of him (r07's back_steel.png did: his defocused face sat right behind the popped-out head). This bake is r07's backdrop (the
Short's framing of the frozen frame in the slab's steel grade, racked out of focus) with Franklin FILLED OUT by normalized
convolution of the world around him (a smooth continuation of the sky, palms and houses, no inpaint smear), racked out
less than r07 (sigma 12, so the clouds and palms still read as the frozen sky), level x0.62, contrast 1.15 (r09: it is the
frozen frame above and below the full-width band, the bed the r08 critic asked for) so the warm head reads against it, the warm key pool behind the head, and the floor under the name falling to ink
(lesson 17: blacks kept, never a grey bed). Writes media/back_pop.png (1080x1920).
"""
import sys, os
import numpy as np, cv2
from PIL import Image

bdir = sys.argv[1]
K = float(sys.argv[2]) if len(sys.argv) > 2 else 1.7793
md = os.path.join(bdir, "media")
rd = lambda n: np.asarray(Image.open(os.path.join(md, n)).convert("RGBA" if n.startswith("subj") else "RGB")).astype(np.float32) / 255.0
col, grade, subj = rd("frz_h.png"), rd("grade_h.png"), rd("subj_h.png")
a = subj[..., 3]

# the slab's steel grade (same as prep_slab.py): highlights roll off into a 0.86 shoulder, the steel cast saturated x1.25
g = grade.copy()
kk = 0.66
g = np.where(g > kk, kk + (0.86 - kk) * (1 - np.exp(-(g - kk) / (0.86 - kk))), g)
Lg = (g[..., 0:1] * 0.2126 + g[..., 1:2] * 0.7152 + g[..., 2:3] * 0.0722)
g = np.clip(Lg + (g - Lg) * 1.25, 0, 1)
# a luma -> RGB LUT fitted outside him, applied to the colour frame (the world in steel, with its real detail)
Lc = col[..., 0] * 0.2126 + col[..., 1] * 0.7152 + col[..., 2] * 0.0722
m = cv2.dilate((a > 0.02).astype(np.uint8), np.ones((31, 31), np.uint8)).astype(np.float32)
outside = m == 0
bins = np.clip((Lc * 63).astype(int), 0, 63)
lut = np.zeros((64, 3), np.float32)
cnt = np.bincount(bins[outside], minlength=64)
ok = cnt > 20
for c in range(3):
    s = np.bincount(bins[outside], weights=g[..., c][outside], minlength=64)
    lut[:, c] = np.interp(np.arange(64), np.nonzero(ok)[0], s[ok] / cnt[ok])
steel = lut[bins]

# Franklin filled out: normalized convolution of the world around him (sigma 130 -h px), blended in on a soft mask
w = 1.0 - m
num = cv2.GaussianBlur(steel * w[..., None], (0, 0), 130)
den = cv2.GaussianBlur(w, (0, 0), 130)[..., None]
fill = num / np.maximum(den, 1e-4)
ms = cv2.GaussianBlur(m, (0, 0), 12)[..., None]
world = steel * (1 - ms) + fill * ms

# the Short's framing (-h x 1015-1622 scaled K), racked out of focus, deeper, warm pool behind the head, floor to ink
M = np.float32([[K, 0, -1015 * K], [0, K, 0]])
Y, X = np.mgrid[0:1920, 0:1080].astype(np.float32)
f = cv2.warpAffine(world, M, (1080, 1920), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)
# r09: below the band the bed is the frozen frame itself, Franklin included (his body racked out in the steel grade); above it
# he stays filled out, so the head that breaks out of the band never sits over a blurred copy of itself. The seam (y 900-1150)
# is hidden behind the band (y ~545-1330).
whole = cv2.warpAffine(steel, M, (1080, 1920), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)
wb = np.clip((Y - 900) / 250, 0, 1)[..., None]
f = f * (1 - wb) + whole * wb
f = cv2.GaussianBlur(f, (0, 0), 12)
f = np.clip((f - 0.5) * 1.15 + 0.5, 0, 1) * 0.62
pool = np.exp(-(((X - 600) / 460) ** 2 + ((Y - 470) / 300) ** 2))
f = 1 - (1 - f) * (1 - pool[..., None] * np.float32([0.20, 0.13, 0.05]))
v = np.clip((Y - 1250) / 670, 0, 1) ** 1.3                      # falls towards ink only under the band, never a black slab
f = f * (1 - 0.6 * v[..., None])
rr2 = np.sqrt(((X - 540) / 900) ** 2 + ((Y - 760) / 1350) ** 2)
f = f * np.clip(1.15 - 0.6 * rr2, 0.35, 1)[..., None]
rng = np.random.default_rng(53)
f = np.clip(f + rng.standard_normal((1920, 1080, 1)).astype(np.float32) * 0.005, 0, 1)
out = (f * 255 + 0.5).astype(np.uint8)
Image.fromarray(out).save(os.path.join(md, "back_pop.png"), optimize=True)
o = out.astype(np.float32)
print("back_pop mean", round(float(o.mean()), 1), "top(<540)", round(float(o[:540].mean()), 1),
      "head band(380-620)", round(float(o[380:620].mean()), 1), "bottom(1450+)", round(float(o[1450:].mean()), 1))
