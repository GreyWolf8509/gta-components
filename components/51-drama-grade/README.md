# Drama grade (GTA niche, #51)

The colour-grade beat creators drop on GTA footage for a dramatic moment: the shot drains to a real black-and-white (or silhouette / bleach / teal-orange) grade on a hit, holds, then colour comes back on the next beat. Long-form uses it for sad or shocking turns ("he never came back"); Shorts use the hard silhouette look across a few beat cuts.

- `a/` 16:9 long-form: noir drain with a lit seam, letterbox, swatch look label, title line, colour floods back from the subject through a feathered mask with light blooms.
- `b/` 9:16 Short: a hard cut on the beat into a silhouette grade (punch, contrast slam), held across beat cuts with one slow push, one colour kept (tail lights as glowing crimson lamps, carried across a match cut), then the red surges and the frame snaps to full colour on that wide sunset shot, lit from the tail lights, held 1.2 s (v01 colour -> v14 silhouette -> v24 silhouette -> v16 tail light kept -> v17 tail lights kept -> v17 colour).

## CONFIG (top of each index.html)
- `look`: which baked grade plays. A: `noir` | `bleach` | `tealorange`. B: `silhouette-red` | `noir`.
- `looks`: per-look label, number, seam colour, grain, vignette and the six greyed `swatches` the label drains to (B: `keep` = index of the swatch that stays coloured, -1 for none).
- `palette`: the six colours sampled from the clip (the label strip's colour state).
- `label`: show the look label (true/false; B defaults to false, creators don't name the grade). A also has `bloom` (lamp, sky) for the return flashes.
- A: `title`, `letterbox` (true/false), `iris` (x, y where colour floods back from), `timing` (hit, drain, label, title, back, flood, titleOut, barsOut, end).
- B: `push` (one slow push through the grade's hold; the colour shot plays at 1.0x), `cuts` (hit = the cut into the grade, beat = a beat cut inside the hold, red = the cut to the kept red), `timing` (snap, end). `timing.snap` must equal the last shot's `data-start` plus its bake's `--snapcol` / `--kick` time, and its `--surge` must be the frame before.

## Render
```
cd a && npx hyperframes render . -o out.mp4
cd b && npx hyperframes render . -o out.mp4
```
This is a full-frame treatment, so it always renders with footage (`bg` is kept for library consistency).

## Use your own clip
The looks are real LUTs plus halation, baked onto the clip so the curves are exact:
```
bash grade/grade.sh my-clip.mp4 noir a/media/my-clip-noir.mp4
bash grade/grade.sh my-clip.mp4 silhouette-red b/media/my-clip-sil.mp4 my-matte.png   # white where reds may be kept
SKYBLUR=6 bash grade/grade.sh ...   # optional: smooth a compressed sky away from the figure
```
Then point the plain `<video>` (before/after colour layers) at your clip and the `video.look` element for your look at the baked file, with the same `data-start` / `data-media-start`. The baked file keeps the source's frames and timestamps, so the two layers stay registered through the wipes.
B's layers are baked per frame with `grade/bake_b.py` (numpy + OpenCV, `/usr/bin/python3`): it cuts a 608x1080 window from a 16:9 clip, scales it to 1080x1920 and grades it; the kept red comes from a matte of the red object (`--keep tail`: lit tail lights, per-shot `--key` and `--band`), `--surge` swells its bloom into the snap, and `--snapcol` / `--kick` switch the clip to colour with the snap light (a soft sweep from one point to another, in source pixels):
```
/usr/bin/python3 grade/bake_b.py my-clip-h.mp4 b/media/my-sil.mp4 --x 1000 --look silhouette
/usr/bin/python3 grade/bake_b.py my-red-h.mp4 b/media/my-red.mp4 --x 350 --toe 0.1 --look silhouette --keep tail
# grade with the red kept until --snapcol, then colour with the snap light (--kick at,peak,x0,y0,x1,y1 in source px)
/usr/bin/python3 grade/bake_b.py my-last-h.mp4 b/media/my-last.mp4 --x 1230 --pan 1312,0,1 --colour --snapcol 0.3667 --look silhouette \
  --keep tail --surge 0.3333 --band 600,1000 --key=-10,12,0.68,0.45 --kick 0.3667,0.45,1388,374,1830,358
```
`tail_matte()` / `car_matte()` in bake_b.py are the mattes for the sample's red objects; write your own for yours (a garment, a car, a sign).
`grade/*.cube` are the same looks as plain 65^3 LUTs for Premiere, Resolve or CapCut (`python3 grade/make_luts.py` rebuilds them).

## Keywords
black and white beat, drama grade, sad edit, noir, silhouette, sin city red, red tail light, red car, colour pop, colour burst, hard cut, bleach bypass, teal orange, LUT, colour snap, letterbox, cinematic bars, halation, film grain, GTA 5 edit
