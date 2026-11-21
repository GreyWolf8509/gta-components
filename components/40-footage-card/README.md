# 40 Footage card

A reference clip (or photo) inset in a white-bordered card with a credit line: the "here's the reference / the
original / the trailer shot" inset top GTA creators drop over their gameplay or talking head, in long-form videos
(A, 16:9) and Shorts (B, 9:16).

The card is a physical object: an extruded white porcelain bezel (Three.js, perspective camera) slides in at a tilt
and swings flat on a spring. On landing, the hinged black credit tag drops, slaps onto the bezel and bounces. Its
yellow lamp chip switches on, and the clip goes from a standby grade to full colour. On the plate render, the gameplay
behind racks out of focus and dims under the card. At the end the card swings out to the left.

- `a/index.html`: Inset card, 16:9 1920x1080, 6.1 s. A 1152 x 648 window (60% of the frame width), centred.
- `b/index.html`: Inset for Shorts, 9:16 1080x1920, 6.1 s. A square 792 x 792 window centred on the Shorts safe area.

## CONFIG

| Field | What it does |
|---|---|
| `title` | The credit's bold title, e.g. `"LOS SANTOS"` |
| `meta` | The source and year after it, e.g. `"  ·  GTA V (2013)"` |
| `clips` | Notes the clip files. Swap the `src` of the `<video id="c1/c2/c3">` tags (and their `data-start` / `data-duration`) |
| `center` | The card centre on the canvas, px |
| `window` | Picture window `w`, `h`, corner `r` |
| `bezel` | White border width, px |
| `tag` | Credit tag height, left offset from the card edge, font size |
| `colors` | Bezel ramp, graphite lip, tag ramp, lamp chip on/off |
| `rack` | The plate under the card: blur, brightness, contrast, saturation (bg:plate only) |
| `timing` | `in` (slide-in start), `drop` (tag release; the slap lands 0.2 s later), `out` (exit start), `end` |

## Render

```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent: frame, tag, shadow; the window is a clean hole
cd a && npx hyperframes render . -o out.mp4                                                    # with the sample footage
```

The same commands work for `b/`.

## Your own clip

- Put your file in `a/media/` (or `b/media/`).
- Point `<video id="c1">` at it, then set its `data-start` to the slide-in time (0.3) and its `data-duration` to cover
  the hold (up to 5.5 s). Delete `c2` and `c3` if you use one clip.
- For the transparent overlay, render `bg:none` and place your clip under the window in your editor. The window is
  a clean hole.

Keywords: footage card, reference clip, picture in picture, inset, b-roll card, credit line, source tag, white border,
photo frame, GTA 5, GTA V, GTA Online, comparison, Shorts.
