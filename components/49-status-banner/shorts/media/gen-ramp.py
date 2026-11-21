#!/usr/bin/env python3
"""Builds the slow-motion death plate for variant B without synthesized frames.

v26-bridge-explosion-v (a static wide shot, 52 real frames) plays at 1.0x until the hit, eases to 0.48x over 0.22 s
and holds there. Each output frame is either a real source frame or a straight blend of the two nearest real frames
(no optical flow, so nothing warps; the camera is locked off, so a blend only softens what is actually moving).
A light unsharp (5x5, 0.5) offsets the 9:16 upscale.

  python3 media/gen-ramp.py <frames_dir_with_f001.png...> media/bridge-ramp-v.mp4
  ffmpeg -i media/bridge-ramp-v.mp4 -vf gblur=sigma=40:steps=3 -c:v libx264 -crf 18 -pix_fmt yuv420p media/bridge-ramp-glass-v.mp4

Timeline (variant B): the clip starts at 1.2 s (2 frames under the cut at 1.2667), the hit is at 1.58 s, the end 4.16 s.
"""
import sys, glob, subprocess
import numpy as np
from PIL import Image

FPS = 30
T_HIT = 0.38      # hit, in clip time (1.58 - 1.2)
RAMP = 0.22       # speed ease 1.0 -> R
R = 0.48          # held slow-motion speed
DUR = 2.9667      # 89 frames: 1.2 .. 4.1667
SNAP = 0.14       # fractional positions within this of a real frame use that frame unblended

def src_time(t):
    if t <= T_HIT:
        return t
    u = t - T_HIT
    if u <= RAMP:
        # speed(x) = 1 + (R - 1) * smoothstep(x / RAMP); integrate in closed form
        x = u / RAMP
        ss_int = x ** 3 - 0.5 * x ** 4          # integral of 3x^2 - 2x^3
        return T_HIT + u + (R - 1) * RAMP * ss_int
    return T_HIT + RAMP * (1 + R) / 2 + R * (u - RAMP)

def main(frames_dir, out):
    files = sorted(glob.glob(frames_dir + "/f*.png"))
    frames = [None] * len(files)
    def get(i):
        i = max(0, min(len(files) - 1, i))
        if frames[i] is None:
            frames[i] = np.asarray(Image.open(files[i]).convert("RGB"), dtype=np.float32)
        return frames[i]
    n = int(round(DUR * FPS))
    W, H = Image.open(files[0]).size
    p = subprocess.Popen(["ffmpeg", "-v", "error", "-y", "-f", "rawvideo", "-pix_fmt", "rgb24", "-s", f"{W}x{H}", "-r", str(FPS),
                          "-i", "-", "-vf", "unsharp=5:5:0.5:5:5:0", "-c:v", "libx264", "-preset", "slow", "-crf", "14", "-pix_fmt", "yuv420p",
                          "-movflags", "+faststart", out], stdin=subprocess.PIPE)
    last = None
    for k in range(n):
        s = src_time(k / FPS) * FPS
        i0 = int(np.floor(s)); w = s - i0
        if i0 >= len(files) - 1:
            raise SystemExit(f"ran past the shot at output frame {k} (source frame {s:.2f})")
        if w < SNAP:
            img = get(i0)
        elif w > 1 - SNAP:
            img = get(i0 + 1)
        else:
            img = get(i0) * (1 - w) + get(i0 + 1) * w
        p.stdin.write(np.clip(img + 0.5, 0, 255).astype(np.uint8).tobytes())
        last = s
    p.stdin.close(); p.wait()
    print(f"{n} frames, last source frame {last:.2f} of {len(files) - 1}")

if __name__ == "__main__":
    main(sys.argv[1], sys.argv[2])
