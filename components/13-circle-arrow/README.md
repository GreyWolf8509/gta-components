# 13 Circle and arrow

The red "look at this" annotation that GTA creators put on a player, car or detail: a hand-drawn circle with a curved arrow (long-form), or a thick block arrow with a short label (Shorts). Both variants are tracked to the subject in the sample clip.

- **A, `a/index.html` (16:9, 5.0 s), "Draw-on circle":** a chisel-tip red paint circle draws round the player in a crowded party, a curled brush arrow flicks in from the right and its two-flick brush head pops. Marker-ink material with dry-brush bristles, dark ink edge, tight contact shadow; on the payoff a white-hot bloom on the head and a glint that runs once round the ring.
- **B, `b/index.html` (9:16, 4.5 s), "Arrow + label":** a real 3D clear-coated red block arrow (Three.js) swoops in, lands with an overshoot and squash, bobs toward the target; "THAT'S ME" slams out of its tail; a quick brush circle loops his head.

## CONFIG
- `clip.src`, `clip.in` (in-point, s); B also `clip.crop` (object-position x % for the 9:16 reframe).
- `target` {x, y}: fixed annotation position, used when `track` is `null`.
- `track` {t0, fps, x[], y[]} (+ B `map` {scale, dx, dy}): per-frame subject position measured from the sample clip. **For your own clip set `track: null` and put `target` on your subject** (or paste your own per-frame track).
- A: `offset`, `circle` {rx, ry, tilt, start, sweep, width}, `arrow` {from, ctrl, aim, gap, width, barb, barbAngle, barbWidth}: the shaft curls from `from` round `ctrl` and its tip lands `gap` px off the ring at ring angle `aim` (degrees, -90 = top), so it follows any ring size.
- B: `label` {text, key}, `arrow` {dir, gap, length, headLen, headHalf, neck, tail, depth, color, side}, `circle`, `labelOffset`.
- `timing`: every beat in seconds.

## Render
```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay
cd a && npx hyperframes render . -o out.mp4                                                 # over the sample footage
```
Same for `b/`.

## Your own clip
Drop it in `a/media/` (or `b/media/`), point the `<video>` `src` and `CONFIG.clip.src` at it, set `CONFIG.track = null` and move `CONFIG.target` onto your subject, then retime `CONFIG.timing`.

Keywords: circle, arrow, red circle, pointer, look here, that's me, annotation, callout, hand-drawn, marker, tracked, GTA 5, GTA Online, Shorts.
