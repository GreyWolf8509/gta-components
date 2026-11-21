# 02 End screen

The last 10-20 s of a long-form GTA video: a held card with slots where YouTube places its end-screen elements (two video
elements and the subscribe element), a big "WATCH THIS NEXT" and a hand-drawn arrow, over the video's last shot. Long-form
YouTube (16:9). Put it on the last 6-20 s of the edit and line up YouTube Studio's end-screen elements with the slots.

- `a/index.html`, **Two slots + subscribe:** blurred bed, two 16:9 slots + round subscribe slot, the arrow picks slot 2.
- `b/index.html`, **Watch this next:** darkened drifting last shot, one big slot, avatar in a subscribe ring with a pill, the
  arrow lands and the slot powers on.

The slots, ring and title are real Three.js geometry (`media/es3d.js`: chrome bezels, extruded bevelled Archivo letters,
PMREM studio light). Screens and avatar are DOM layers posed to match the 3D camera exactly.

## CONFIG (top of each index.html)
- `title.runs[]`: `text`, `face` (3 colours, bottom to top), `side` (wall/bevel colour); `x` or `cx`, `baseline`, `cap`
  (cap height in px), `shear` (italic), `depth`, `bevel`. Letters available: A-Z 0-9 . , ' ! ? - & : #
- `slots[]`: screen rects `{cx, cy, w, h}` in px. Keep 16:9 and match the YouTube element you place there.
- `bezel`: `border`, `r`, `depth`, `bevel`, `chrome` colour and the `picked` colour it turns on the payoff.
- `subscribe`: ring centre, avatar radius `r`, `ring` width, colour, pill `label` and `pillY`.
  Replace `media/avatar.jpg` with your channel picture (square).
- `arrow`: Bezier points `p` (start, two controls, head base), width profile, head size, `fill`, `outline`.
- `bed`: blur / brightness / contrast / saturation of the background (B: `drift`).
- `timing`: entrance times, `pay` (the payoff) and `hold` (seconds the finished card holds before it dollies back to black).
  The exit and end follow from `pay + hold`. For a longer end screen (YouTube allows 5-20 s): raise `hold`, set the root
  `data-duration` to `pay + 1.52 + hold`, and extend the background / slot `<video>` durations (chain more clips).

## Swap in your own clips
Change the `src` of `#bgA` / `#bgB` (background) and the `.tv` videos inside each slot (`#tv0a`, `#tv0b`, `#tv1a`, `#tv1b`). Keep each
video's `data-start` + `data-duration` inside the clip's length (`data-media-start` sets the in-point).

## Render
```
cd a && npx hyperframes render . -o end-screen-a.mp4
cd b && npx hyperframes render . -o end-screen-b.mp4
```
It is a full-frame component (it is the end of the video), so it always renders with footage.

Keywords: end screen, end card, outro, watch this next, watch next, subscribe circle, video slots, end screen template,
YouTube end screen, thanks for watching, GTA 5, GTA Online, arrow.
