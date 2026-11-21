"""B (r03): the freeze is a window of the -h frame at 1.0x inside the Short (the -h cutout is prep_freeze.py run on the -h frame
with DECON=1 WRAP=0.36 ERO=6 and the franklin-a split, copied to subj_h.png / grade_h.png). Bakes:
  subj_h_shadow.png the -h cutout's soft drop shadow (offset 10,16, blur 12 px, 55%), cast onto the window and the fill
    /usr/bin/python3 prep_window.py <b-dir>
"""
import sys, os
import numpy as np, cv2
from PIL import Image
md = os.path.join(sys.argv[1], "media")
s = np.asarray(Image.open(os.path.join(md, "subj_h.png")))[..., 3].astype(np.float32) / 255.0
H, W = s.shape
M = np.float32([[1, 0, 10], [0, 1, 16]])
sh = cv2.warpAffine(s, M, (W, H))
sh = cv2.GaussianBlur(sh, (0, 0), 12) * 0.55
out = np.zeros((H, W, 4), np.uint8); out[..., 3] = (np.clip(sh, 0, 1) * 255 + 0.5).astype(np.uint8)
Image.fromarray(out).save(os.path.join(md, "subj_h_shadow.png"), optimize=True)
print("ok", sh.max())
