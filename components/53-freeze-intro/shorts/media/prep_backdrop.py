"""B backdrop bakes: the defocused world around the 1.0x window, and the head's contact shadow on the title.

    /usr/bin/python3 prep_backdrop.py <b-dir> [K]

Writes into <b-dir>/media/:
  frz_h.png        the -h shot's frame 24 in colour (the window's colour layer; the grade fades back to it on release)
  fill_grade.png   the backdrop for the hold: grade_h.png (steel grade, Franklin painted out) mapped to the Short's exact framing
                   (the -v shot is the -h shot's x 1015-1622 crop scaled K), defocused SIG px, contrast 1.2, x0.74
  fill_col.png     the same in colour (Franklin painted out of frz_h.png the way prep_freeze.py does it), for the release
  subj_h_contact.png  the head's contact shadow (straight down 20 px, blur 14 px, 75%), shown only above the window's top edge,
                   where his head breaks out over the title
"""
import sys, os, subprocess
import numpy as np, cv2
from PIL import Image
from scipy import ndimage as ndi

bdir = sys.argv[1]
K = float(sys.argv[2]) if len(sys.argv) > 2 else 1.7793
SIG, GAIN, CON = 14, 0.74, 1.2                                            # defocus (canvas px), level, contrast
md, sh = os.path.join(bdir, "media"), os.path.join(bdir, "assets", "shots")
hsrc = os.path.join(sh, "v06-franklin-lamar-portrait-h.mp4")
subprocess.run(["ffmpeg", "-v", "error", "-y", "-i", hsrc, "-vf", r"select=eq(n\,24)", "-frames:v", "1", os.path.join(md, "frz_h.png")], check=True)
M = np.float32([[K, 0, 685 - 1400 * K], [0, K, 913 - 513 * K]])          # -h px -> Short canvas px (the .hs fixed point)

def backdrop(img, sat):
    f = cv2.warpAffine(img, M, (1080, 1920), flags=cv2.INTER_CUBIC, borderMode=cv2.BORDER_REFLECT)
    f = cv2.GaussianBlur(f, (0, 0), SIG)
    L = (f @ np.float32([0.2126, 0.7152, 0.0722]))[..., None]
    f = L + (f - L) * sat
    return np.clip(np.clip((f - 0.5) * CON + 0.5, 0, 1) * GAIN, 0, 1)

g = np.asarray(Image.open(os.path.join(md, "grade_h.png")).convert("RGB")).astype(np.float32) / 255.0
Image.fromarray((backdrop(g, 1.0) * 255 + 0.5).astype(np.uint8)).save(os.path.join(md, "fill_grade.png"), optimize=True)

# colour plate with Franklin painted out (same recipe as prep_freeze.py's grade plate, without the grade)
frz = np.asarray(Image.open(os.path.join(md, "frz_h.png")).convert("RGB")).astype(np.float32) / 255.0
a = np.asarray(Image.open(os.path.join(md, "subj_h.png")))[..., 3].astype(np.float32) / 255.0
H, W = a.shape
m = ndi.binary_dilation(a > 0.05, iterations=14).astype(np.uint8) * 255
small = cv2.resize((frz * 255).astype(np.uint8), (W // 2, H // 2), interpolation=cv2.INTER_AREA)
fill = cv2.inpaint(cv2.cvtColor(small, cv2.COLOR_RGB2BGR), cv2.resize(m, (W // 2, H // 2), interpolation=cv2.INTER_NEAREST), 12, cv2.INPAINT_TELEA)
fill = cv2.cvtColor(cv2.resize(fill, (W, H), interpolation=cv2.INTER_CUBIC), cv2.COLOR_BGR2RGB).astype(np.float32) / 255.0
mf = cv2.GaussianBlur(m.astype(np.float32) / 255.0, (0, 0), 3)[..., None]
plate = frz * (1 - mf) + fill * mf
Image.fromarray((backdrop(plate, 0.8) * 255 + 0.5).astype(np.uint8)).save(os.path.join(md, "fill_col.png"), optimize=True)

# head contact shadow (in -h space, like subj_h_shadow.png)
s2 = cv2.warpAffine(a, np.float32([[1, 0, 0], [0, 1, 20]]), (W, H))
s2 = cv2.GaussianBlur(s2, (0, 0), 14) * 0.75
out = np.zeros((H, W, 4), np.uint8); out[..., 3] = (np.clip(s2, 0, 1) * 255 + 0.5).astype(np.uint8)
Image.fromarray(out).save(os.path.join(md, "subj_h_contact.png"), optimize=True)
print("ok")
