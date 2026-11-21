# Builds the banknote textures for variant A (our own fictional "Los Santos 100" note, no real currency marks).
# Run with the system python (PIL + numpy):  /usr/bin/python3 make_notes.py
# Writes, next to this file:
#   note-front.png, note-back.png   colour (1536x654)
#   note-front-orm.png, note-back-orm.png   R = bump height, G = roughness, B = metalness (three.js channel layout)
import math, os
import numpy as np
from PIL import Image, ImageDraw, ImageFont, ImageFilter

HERE = os.path.dirname(os.path.abspath(__file__))
ROOT = os.path.abspath(os.path.join(HERE, "../../../.."))
FONT = os.path.join(ROOT, "gta/_shared/fonts/Archivo.ttf")
PORTRAIT = os.path.join(ROOT, "gta/_shared/shots/v06-franklin-lamar-portrait-v.jpg")
W, H = 1536, 654
S = W / 1024.0
rng = np.random.default_rng(22)

INK = (36, 69, 44)        # deep green intaglio (#24452C)
INK2 = (54, 104, 70)       # mid green
COPPER = (150, 104, 46)

def font(size, wght=800, wdth=100):
    f = ImageFont.truetype(FONT, int(size * S))
    f.set_variation_by_axes([wght, wdth])
    return f

def paper(base_l, base_r, tint=None):
    x = np.linspace(0, 1, W)[None, :, None]
    y = np.linspace(0, 1, H)[:, None, None]
    a = np.array(base_l, float)[None, None, :]; b = np.array(base_r, float)[None, None, :]
    img = a * (1 - x) + b * x
    # soft centre lift + edge darkening (handled paper)
    r = np.sqrt(((x - .5) / .62) ** 2 + ((y - .5) / .7) ** 2)
    img = img * (1.04 - .07 * np.clip(r, 0, 1.3))
    if tint is not None:
        c, cx, cy, rad, k = tint
        d = np.sqrt(((x - cx) / rad) ** 2 + ((y - cy) / (rad * W / H)) ** 2)
        m = np.clip(1 - d, 0, 1) ** 1.5 * k
        img = img * (1 - m) + np.array(c, float)[None, None, :] * m
    img = img + rng.normal(0, 3.2, (H, W, 1))
    return img

def guilloche_lines(draw, box, n, amp, freq, col, width=1, phase=0.0):
    x0, y0, x1, y1 = box
    for i in range(n):
        pts = []
        yy = y0 + (y1 - y0) * (i + .5) / n
        for xx in np.linspace(x0, x1, 400):
            t = (xx - x0) / (x1 - x0)
            pts.append((xx, yy + amp * math.sin(freq * t * 2 * math.pi + i * .55 + phase) + amp * .5 * math.sin(freq * 2.7 * t * 2 * math.pi - i * .3)))
        draw.line(pts, fill=col, width=width)

def rosette(draw, cx, cy, R, petals, rings, col, width=1):
    for k in range(rings):
        r0 = R * (0.35 + 0.65 * k / max(rings - 1, 1))
        pts = []
        for a in np.linspace(0, 2 * math.pi, 720):
            r = r0 * (0.82 + 0.18 * math.cos(petals * a + k * 0.4))
            pts.append((cx + r * math.cos(a), cy + r * math.sin(a)))
        draw.line(pts + [pts[0]], fill=col, width=width)

def border(draw, inset=14, band=26):
    i0, i1 = inset * S, (inset + band) * S
    draw.rectangle([i0, i0, W - i0, H - i0], outline=INK + (255,), width=int(3 * S))
    draw.rectangle([i1, i1, W - i1, H - i1], outline=INK + (230,), width=int(1.6 * S))
    # guilloche band: crossing sine families along all four sides
    m = (i0 + i1) / 2; a = (i1 - i0) * .34
    for ph in (0, math.pi):
        for side in range(4):
            pts = []
            L = (W - 2 * m) if side % 2 == 0 else (H - 2 * m)
            for s in np.linspace(0, 1, 900):
                off = a * math.sin(s * L / (9 * S) + ph)
                if side == 0: pts.append((m + s * (W - 2 * m), m + off))
                if side == 2: pts.append((m + s * (W - 2 * m), H - m + off))
                if side == 1: pts.append((W - m + off, m + s * (H - 2 * m)))
                if side == 3: pts.append((m + off, m + s * (H - 2 * m)))
            draw.line(pts, fill=INK2 + (210,), width=max(1, int(1.2 * S)))

def corner_100(draw, x, y, size, anchor, col=INK):
    draw.text((x * S, y * S), "100", font=font(size, 900, 100), fill=col + (255,), anchor=anchor)

def engrave(crop_box, out_w, out_h, period=3.6, tilt=0.0):
    im = Image.open(PORTRAIT).convert("L").crop(crop_box).resize((out_w, out_h), Image.LANCZOS)
    L = np.asarray(im, float) / 255.0
    L = np.clip((L - .18) / .62, 0, 1) ** 0.9        # contrast curve
    yy, xx = np.mgrid[0:out_h, 0:out_w].astype(float)
    u = yy + 1.6 * np.sin(xx / 23.0) + tilt * xx
    ph = (u / period) % 1.0
    d = np.abs(ph - .5) * period                     # px from line centre
    half = (1 - L) * period * .52 + .18
    cov = np.clip(half - d + .5, 0, 1)               # anti-aliased line screen
    # cross hatch only in the darkest tones
    u2 = yy * .55 - xx * .84
    d2 = np.abs(((u2 / (period * 1.1)) % 1.0) - .5) * period * 1.1
    dark = np.clip((.38 - L) / .38, 0, 1)
    cov = np.maximum(cov, np.clip(dark * period * .32 - d2 + .5, 0, 1))
    # oval vignette so it fades into the frame lines
    ox, oy = (xx / out_w - .5) / .5, (yy / out_h - .5) / .5
    r = np.sqrt(ox ** 2 + oy ** 2)
    cov *= np.clip((1.0 - r) / .08, 0, 1)
    return cov

def stamp(img_rgb, cov, x, y, col):
    h, w = cov.shape
    reg = img_rgb[y:y + h, x:x + w, :]
    a = cov[..., None]
    img_rgb[y:y + h, x:x + w, :] = reg * (1 - a) + np.array(col, float)[None, None, :] * a

def fibers(draw, n=170):
    for i in range(n):
        x, y = rng.uniform(0, W), rng.uniform(0, H)
        ang = rng.uniform(0, math.pi); L = rng.uniform(6, 16) * S
        col = (196, 64, 60, 120) if i % 2 else (60, 90, 190, 120)
        pts = [(x + math.cos(ang) * L * t + 2 * math.sin(t * 5), y + math.sin(ang) * L * t) for t in np.linspace(0, 1, 6)]
        draw.line(pts, fill=col, width=1)

def make_front():
    base = paper((207, 220, 194), (195, 209, 181), tint=((226, 200, 160), .78, .55, .22, .45))
    # engraved portrait in the centre oval
    ow, oh = int(206 * S), int(258 * S)
    ox, oy = int(W / 2 - ow / 2), int(H / 2 - oh / 2 - 4 * S)
    cov = engrave((236, 230, 916, 1080), ow, oh)
    stamp(base, cov, ox, oy, INK)
    img = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8)).convert("RGBA")
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    # background microprint guilloche, left and right fields
    guilloche_lines(d, (50 * S, 46 * S, 380 * S, 390 * S), 22, 7 * S, 3.2, INK2 + (40,), 1)
    guilloche_lines(d, (640 * S, 46 * S, 980 * S, 390 * S), 22, 7 * S, 2.6, INK2 + (38,), 1, 1.3)
    rosette(d, 230 * S, 262 * S, 70 * S, 14, 9, INK2 + (90,), 1)
    rosette(d, 856 * S, 196 * S, 84 * S, 18, 10, (120, 96, 52, 80), 1)
    fibers(d)
    border(d)
    # portrait oval frame
    cx, cy = W / 2, oy + oh / 2
    for k, (wd, al) in enumerate(((7, 255), (2, 230), (1, 200))):
        g = (k * 9 + 4) * S
        d.ellipse([cx - ow / 2 - g, cy - oh / 2 - g, cx + ow / 2 + g, cy + oh / 2 + g], outline=INK + (al,), width=max(1, int(wd * S / 1.5)))
    # seal (gear) on the left
    sx, sy, sr = 230 * S, 262 * S, 44 * S
    teeth = []
    for a in np.linspace(0, 2 * math.pi, 145):
        r = sr * (1 + .07 * (1 if math.sin(a * 36) > 0 else -1))
        teeth.append((sx + r * math.cos(a), sy + r * math.sin(a)))
    d.polygon(teeth, outline=INK2 + (255,), fill=(70, 128, 86, 70))
    d.ellipse([sx - sr * .78, sy - sr * .78, sx + sr * .78, sy + sr * .78], outline=INK2 + (255,), width=int(2 * S))
    d.text((sx, sy + 2 * S), "LS", font=font(34, 900, 112), fill=INK2 + (255,), anchor="mm")
    # type
    d.text((62 * S, 128 * S), "STATE OF SAN ANDREAS", font=font(19, 800, 118), fill=INK + (255,), anchor="ls")
    d.text((62 * S, 148 * S), "LOS SANTOS RESERVE NOTE", font=font(12, 700, 112), fill=INK2 + (255,), anchor="ls")
    d.text((W / 2, 388 * S), "ONE HUNDRED DOLLARS", font=font(17, 800, 120), fill=INK + (255,), anchor="ms")
    d.text((62 * S, 350 * S), "LS 04201337 A", font=font(16, 700, 100), fill=(40, 96, 62, 255), anchor="ls")
    d.text((742 * S, 108 * S), "LS 04201337 A", font=font(19, 700, 100), fill=(40, 96, 62, 255), anchor="ls")
    corner_100(d, 58, 52, 40, "lt")
    corner_100(d, 966, 52, 40, "rt")
    corner_100(d, 58, 384, 40, "lb")
    # security ribbon (blue foil, metal in the ORM map)
    rx0, rx1 = 690 * S, 716 * S
    d.rectangle([rx0, 40 * S, rx1, H - 40 * S], fill=(58, 112, 196, 255))
    for k in range(9):
        yy = (58 + k * 40) * S
        d.text(((rx0 + rx1) / 2, yy), "100", font=font(13, 900, 100), fill=(160, 210, 255, 255), anchor="mm")
    img = Image.alpha_composite(img, lay)
    # big colour-shift 100, bottom right, drawn on its own layer so we know its mask
    big = Image.new("RGBA", (W, H), (0, 0, 0, 0)); bd = ImageDraw.Draw(big)
    bd.text((966 * S, 384 * S), "100", font=font(100, 900, 112), fill=(255, 255, 255, 255), anchor="rb")
    mask = np.asarray(big, float)[..., 3] / 255.0
    yy, xx = np.mgrid[0:H, 0:W].astype(float)
    g = np.clip((xx / W - .62) / .32 + (yy / H - .5) * .4, 0, 1)[..., None]
    col = np.array(COPPER, float) * (1 - g) + np.array((38, 110, 74), float) * g
    arr = np.asarray(img, float)
    arr[..., :3] = arr[..., :3] * (1 - mask[..., None]) + col * mask[..., None]
    img = Image.fromarray(arr.astype(np.uint8))
    ribbon = np.zeros((H, W)); ribbon[int(40 * S):int(H - 40 * S), int(rx0):int(rx1)] = 1
    return img.convert("RGB"), mask, ribbon

def make_back():
    base = paper((190, 208, 174), (178, 197, 162))
    img = Image.fromarray(np.clip(base, 0, 255).astype(np.uint8)).convert("RGBA")
    lay = Image.new("RGBA", (W, H), (0, 0, 0, 0)); d = ImageDraw.Draw(lay)
    guilloche_lines(d, (44 * S, 44 * S, 980 * S, 392 * S), 40, 9 * S, 2.2, (40, 104, 62, 70), 1)
    fibers(d, 120)
    border(d)
    # central vignette: an engraved skyline in an oval
    cx, cy, rw, rh = 430 * S, 214 * S, 226 * S, 136 * S
    vig = Image.new("L", (W, H), 0); vd = ImageDraw.Draw(vig)
    vd.ellipse([cx - rw, cy - rh, cx + rw, cy + rh], fill=255)
    sky = Image.new("RGBA", (W, H), (0, 0, 0, 0)); sd = ImageDraw.Draw(sky)
    for k in range(int(rh * 2 / (3.2 * S))):
        yy = cy - rh + k * 3.2 * S
        sd.line([(cx - rw, yy), (cx + rw, yy)], fill=INK2 + (120 if yy < cy else 60,), width=1)
    x = cx - rw
    i = 0
    while x < cx + rw:
        bw = (18 + 26 * (math.sin(i * 12.9898) * 43758.5453 % 1)) * S
        bh = (34 + 120 * abs(math.sin(i * 78.233) * 9631.21 % 1) * (1 - abs((x - cx) / rw) * .7)) * S
        sd.rectangle([x, cy + rh * .55 - bh, x + bw - 2 * S, cy + rh], fill=INK + (235,))
        for wy in np.arange(cy + rh * .55 - bh + 6 * S, cy + rh, 7 * S):
            for wx in np.arange(x + 4 * S, x + bw - 6 * S, 6 * S):
                sd.rectangle([wx, wy, wx + 2 * S, wy + 3 * S], fill=(170, 200, 160, 200))
        x += bw; i += 1
    for k in range(int(rh * .45 / (2.6 * S)) + 1):
        yy = cy + rh * .55 + 2 * S + k * 2.6 * S
        sd.line([(cx - rw, yy), (cx + rw, yy)], fill=INK + (200,), width=max(1, int(1.2 * S)))
    sky.putalpha(Image.fromarray((np.asarray(sky)[..., 3] * (np.asarray(vig) / 255.0)).astype(np.uint8)))
    lay = Image.alpha_composite(lay, sky)
    d = ImageDraw.Draw(lay)
    d.ellipse([cx - rw, cy - rh, cx + rw, cy + rh], outline=INK + (255,), width=int(5 * S))
    d.ellipse([cx - rw - 9 * S, cy - rh - 9 * S, cx + rw + 9 * S, cy + rh + 9 * S], outline=INK2 + (220,), width=int(1.5 * S))
    d.text((cx, 64 * S), "IN LOS SANTOS WE TRUST", font=font(16, 800, 118), fill=INK + (255,), anchor="ms")
    d.text((cx, 390 * S), "ONE HUNDRED DOLLARS", font=font(18, 800, 120), fill=INK + (255,), anchor="ms")
    d.text((972 * S, 218 * S), "100", font=font(150, 900, 108), fill=(38, 100, 64, 255), anchor="rm")
    corner_100(d, 58, 52, 40, "lt"); corner_100(d, 58, 384, 40, "lb")
    img = Image.alpha_composite(img, lay)
    return img.convert("RGB")

def orm(color_img, metal_mask, rough_bias):
    g = np.asarray(color_img.convert("L"), float) / 255.0
    ink = np.clip((0.86 - g) / 0.6, 0, 1)
    bump = Image.fromarray((ink * 255).astype(np.uint8)).filter(ImageFilter.GaussianBlur(0.8))
    rough = 0.74 - 0.16 * ink
    met = np.zeros_like(g)
    for m, (mv, rv) in metal_mask:
        met = met * (1 - m) + mv * m
        rough = rough * (1 - m) + rv * m
    rough = np.clip(rough + rough_bias, 0, 1)
    out = np.stack([np.asarray(bump, float), rough * 255, met * 255], -1)
    return Image.fromarray(out.astype(np.uint8))

if __name__ == "__main__":
    front, big, ribbon = make_front()
    front.save(os.path.join(HERE, "note-front.png"))
    orm(front, [(big, (0.55, 0.34)), (ribbon, (1.0, 0.22))], 0).save(os.path.join(HERE, "note-front-orm.png"))
    back = make_back()
    back.save(os.path.join(HERE, "note-back-view.png"))
    # pre-mirrored for the back face of the plane
    back.transpose(Image.FLIP_LEFT_RIGHT).save(os.path.join(HERE, "note-back.png"))
    orm(back, [], 0.02).transpose(Image.FLIP_LEFT_RIGHT).save(os.path.join(HERE, "note-back-orm.png"))
    print("ok")
