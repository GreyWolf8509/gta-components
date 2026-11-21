"""review_tiles.py: clean 16:9 stage tiles (960x540) plus in-game previews for the owner's review page.

Reads gta/NN-slug/tile.json (written by each component's owner, see OWNER.md):
  {"a": {"round": 2, "mode": "overlay"|"lighten"|"card", "crop": [x0,y0,x1,y1], "hero": 3.2, "t0": 0.0, "t1": 5.4,
         "label": "optional display label"}, "b": {...}}
  overlay: the round's vN-none.webm, scaled so the graphic's steady box fills ~82% x 86% of the tile, centred on the stage;
           t0/t1 default to the first/last non-empty frame; an optional crop pins the box instead of measuring it.
  lighten: the round's vN.mp4, cropped, trimmed, lightened onto the stage (graphics on black drop out).
  card:    the round's vN.mp4, cropped, trimmed, shown as a rounded card on the stage.
Writes <out>/<NN-slug>-<a|b>-tile.mp4/.jpg and the in-game preview <out>/<NN-slug>-<a|b>.mp4/.jpg (1280x720 or 608x1080).
Skips outputs that are newer than tile.json and their source render.

NOTE: VP9 webm timestamps are in ms (33, 67, 100...). Overlaid on an exact-30fps lavfi colour source they repeat every
3rd frame (visible judder), so every input is retimed with setpts=N/(30*TB) first. tools/gtalib/judder.py checks it.

Usage: python3 tools/gtalib/review_tiles.py <out-media-dir> [gta/NN-slug ...]   (no dirs = every component with tile.json)
"""
import glob, json, os, subprocess, sys
import numpy as np
from PIL import Image, ImageDraw

ROOT = os.path.dirname(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
W, H, STAGE = 960, 540, "0x0c0d0f"
FIT_W, FIT_H = 0.82, 0.86
ENC = ["-an", "-c:v", "libx264", "-crf", "21", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart"]
# click-to-play previews: lighter, so 70 components x 2 fit the artifact's 256 MB version limit
ENC_FULL = ["-an", "-c:v", "libx264", "-crf", "30", "-preset", "slow", "-pix_fmt", "yuv420p", "-movflags", "+faststart"]


def probe(f):
    j = json.loads(subprocess.check_output(["ffprobe", "-v", "error", "-select_streams", "v", "-show_entries",
                                            "stream=width,height", "-show_entries", "format=duration", "-of", "json", f]))
    s = j["streams"][0]
    return s["width"], s["height"], float(j["format"]["duration"])


def run(args):
    subprocess.run(["ffmpeg", "-v", "error", "-y"] + args, check=True)


def fresh(out, *srcs):
    return os.path.exists(out) and all(os.path.getmtime(out) > os.path.getmtime(s) for s in srcs if os.path.exists(s))


def poster(mp4, t, jpg):
    run(["-ss", f"{max(0.0, t):.2f}", "-i", mp4, "-frames:v", "1", "-q:v", "3", jpg])


def steady_box(webm):
    w, h, _ = probe(webm)
    sw, sh = w // 4, h // 4
    raw = subprocess.check_output(["ffmpeg", "-v", "error", "-c:v", "libvpx-vp9", "-i", webm, "-vf", f"scale={sw}:{sh}",
                                   "-pix_fmt", "rgba", "-f", "rawvideo", "-"])
    a = np.frombuffer(raw, np.uint8).reshape(-1, sh, sw, 4)[..., 3]
    boxes, idx = [], []
    for i, fr in enumerate(a):
        ys, xs = np.where(fr > 24)
        if len(xs):
            boxes.append([xs.min() * 4, ys.min() * 4, xs.max() * 4 + 4, ys.max() * 4 + 4]); idx.append(i)
    if not boxes:
        raise RuntimeError(f"{webm}: no visible pixels")
    b = np.array(boxes)
    box = [np.percentile(b[:, 0], 8), np.percentile(b[:, 1], 8), np.percentile(b[:, 2], 92), np.percentile(b[:, 3], 92)]
    return [float(x) for x in box], idx[0], idx[-1]


def overlay_tile(webm, spec, out, jpg):
    box, first, last = steady_box(webm)
    if spec.get("crop"):  # the owner/lead pinned the graphic's box (e.g. a watermark that drifts between corners)
        box = [float(x) for x in spec["crop"]]
    w, h, dur = probe(webm)
    t0 = spec.get("t0", max(0.0, first / 30 - 0.10)); t1 = min(dur, spec.get("t1", last / 30 + 0.45)); D = t1 - t0
    bw, bh = box[2] - box[0], box[3] - box[1]
    s = min(W * FIT_W / bw, H * FIT_H / bh, 1.6)
    cx, cy = (box[0] + box[2]) / 2, (box[1] + box[3]) / 2
    X, Y = round(W / 2 - s * cx), round(H / 2 - s * cy)
    sw, sh = round(w * s / 2) * 2, round(h * s / 2) * 2
    run(["-c:v", "libvpx-vp9", "-ss", f"{t0:.3f}", "-t", f"{D:.3f}", "-i", webm,
         "-f", "lavfi", "-i", f"color=c={STAGE}:s={W}x{H}:r=30",
         "-filter_complex", f"[0:v]setpts=N/(30*TB),scale={sw}:{sh}:flags=lanczos,format=rgba[fg];[1:v]setpts=N/(30*TB)[bg];"
                            f"[bg][fg]overlay=x={X}:y={Y}:shortest=1:eof_action=endall,format=yuv420p",
         "-t", f"{D:.3f}"] + ENC + [out])
    poster(out, spec.get("hero", t0 + D / 2) - t0, jpg)


def lighten_tile(mp4, spec, out, jpg):
    w, h, dur = probe(mp4)
    x0, y0, x1, y1 = spec.get("crop", [0, 0, w, h]); cw, ch = x1 - x0, y1 - y0
    t0 = spec.get("t0", 0.0); t1 = min(dur, spec.get("t1", dur)); D = t1 - t0
    s = min(W * 0.92 / cw, H * 0.86 / ch)
    fw, fh = round(cw * s / 2) * 2, round(ch * s / 2) * 2
    run(["-ss", f"{t0:.3f}", "-t", f"{D:.3f}", "-i", mp4, "-f", "lavfi", "-i", f"color=c={STAGE}:s={W}x{H}:r=30",
         "-filter_complex",
         f"[0:v]setpts=N/(30*TB),crop={cw}:{ch}:{x0}:{y0},scale={fw}:{fh}:flags=lanczos,fade=t=out:st={D - 0.22:.3f}:d=0.22,"
         f"pad={W}:{H}:(ow-iw)/2:(oh-ih)/2:black,format=gbrp[fg];[1:v]format=gbrp[bg];"
         f"[bg][fg]blend=all_mode=lighten:shortest=1,format=yuv420p",
         "-t", f"{D:.3f}"] + ENC + [out])
    poster(out, spec.get("hero", t0 + D / 2) - t0, jpg)


def card_tile(mp4, spec, out, jpg, tmp):
    w, h, dur = probe(mp4)
    x0, y0, x1, y1 = spec.get("crop", [0, 0, w, h]); cw, ch = x1 - x0, y1 - y0
    t0 = spec.get("t0", 0.0); t1 = min(dur, spec.get("t1", dur)); D = t1 - t0
    s = min(W * 0.90 / cw, H * 0.90 / ch)
    fw, fh = round(cw * s / 2) * 2, round(ch * s / 2) * 2
    m = Image.new("L", (fw * 4, fh * 4), 0)
    ImageDraw.Draw(m).rounded_rectangle([0, 0, fw * 4 - 1, fh * 4 - 1], 14 * 4, fill=255)
    m.resize((fw, fh), Image.LANCZOS).save(tmp)
    run(["-ss", f"{t0:.3f}", "-t", f"{D:.3f}", "-i", mp4, "-loop", "1", "-i", tmp,
         "-f", "lavfi", "-i", f"color=c={STAGE}:s={W}x{H}:r=30",
         "-filter_complex",
         f"[0:v]setpts=N/(30*TB),crop={cw}:{ch}:{x0}:{y0},scale={fw}:{fh}:flags=lanczos,format=rgba[c];[1:v]format=gray[m];"
         f"[c][m]alphamerge[fg];[2:v][fg]overlay=x=(W-w)/2:y=(H-h)/2:shortest=1,"
         f"fade=t=in:st=0:d=0.15,fade=t=out:st={D - 0.2:.3f}:d=0.2,format=yuv420p",
         "-t", f"{D:.3f}"] + ENC + [out])
    os.remove(tmp)
    poster(out, spec.get("hero", t0 + D / 2) - t0, jpg)


def ingame(mp4, spec, out, jpg):
    w, h, _ = probe(mp4)
    scale = "1280:720" if w > h else "608:1080"
    run(["-i", mp4, "-vf", f"scale={scale}:flags=lanczos"] + ENC_FULL + [out])
    poster(out, spec.get("hero", 1.0), jpg)


def build(comp_dir, outdir):
    tj = os.path.join(comp_dir, "tile.json")
    spec = json.load(open(tj))
    name = os.path.basename(comp_dir.rstrip("/"))
    done = []
    for side, v in (("a", "0"), ("b", "1")):
        sp = spec.get(side)
        if not sp:
            continue
        rd = os.path.join(comp_dir, "rounds", f"r{int(sp['round']):02d}")
        mp4, webm = os.path.join(rd, f"v{v}.mp4"), os.path.join(rd, f"v{v}-none.webm")
        tile, tjpg = os.path.join(outdir, f"{name}-{side}-tile.mp4"), os.path.join(outdir, f"{name}-{side}-tile.jpg")
        full, fjpg = os.path.join(outdir, f"{name}-{side}.mp4"), os.path.join(outdir, f"{name}-{side}.jpg")
        mode = sp.get("mode", "overlay")
        src = webm if mode == "overlay" else mp4
        if mode == "overlay" and not os.path.exists(webm):
            mode, src = "card", mp4  # no transparent render: fall back to a card of the full frame
        if not fresh(tile, tj, src):
            if mode == "overlay":
                overlay_tile(src, sp, tile, tjpg)
            elif mode == "lighten":
                lighten_tile(src, sp, tile, tjpg)
            else:
                card_tile(src, sp, tile, tjpg, os.path.join(outdir, f".mask-{name}-{side}.png"))
        if not fresh(full, tj, mp4):
            ingame(mp4, sp, full, fjpg)
        done.append(side)
    return name, done


if __name__ == "__main__":
    outdir = sys.argv[1]
    os.makedirs(outdir, exist_ok=True)
    dirs = sys.argv[2:] or sorted(os.path.dirname(p) for p in glob.glob(os.path.join(ROOT, "gta", "[0-9][0-9]-*", "tile.json")))
    for d in dirs:
        d = d if os.path.isabs(d) else os.path.join(ROOT, d)
        try:
            n, sides = build(d, outdir)
            print("ok", n, sides)
        except Exception as e:  # keep going: one bad component must not stop the page
            print("FAIL", d, e)
