# Collectible tracker (component 31)

The found-so-far and death-tally HUD that challenge videos keep in a top corner: "1/8 gold supercars found", "x3 deaths".

- **A, 16:9 long-form (`a/index.html`, 1920x1080, 5.4 s):** a 3D gold shield top-left with an extruded italic count and a gunmetal socket rail. On a find, a gold coin pops off the car in the shot, flies into the next socket and the count flips over (2/8 -> 3/8). Use it in collect-them-all and hunt videos.
- **B, 9:16 Shorts (`b/index.html`, 1080x1920, 5.8 s):** a 3D bone skull with a hinged jaw and an extruded "x N" multiplier, top-left. Each failed attempt flips the count, shakes the skull, snaps its jaw and lights its eyes red. Use it in "how many tries" and fail-compilation Shorts.

## CONFIG

A (`a/index.html`):
- `label`: the word printed along the shield top (our own word, no brands).
- `found`, `total`: the count before the find and the slot count (the find makes it `found + 1`; keep the digit count the same).
- `gold`, `goldDeep`, `enamel`, `railColor`: materials.
- `shield`: docked box `{x, y, w, h}` in canvas px. `rail`: socket row `{x0, cy, first, pitch, hole, coin, z}`.
- `find.from`: where the coin pops out of the shot (canvas px), e.g. over the car you found.
- `timing`: `drop`, `rail`, `fill`, `pop`, `fly`, `land`, `flip`, `out`, `end` (seconds).

B (`b/index.html`):
- `start`: count shown on entrance. `deaths`: seconds of each failed attempt (each ticks +1; put them on your crash frames).
- `skull`: `{x, y, size}` centre on the canvas. `number`: `{x, cap}` left edge of the "x" and digit cap height.
- `bone`, `boneSide`, `ink`, `digit`, `digitSide`, `red`: colours.
- `timing`: `in`, `num`, `out`, `end`.

## Render

```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay
cd a && npx hyperframes render . -o out.mp4                                                  # with sample footage
```
Same for `b/`.

## Your own clip

Replace the `<video>` sources in `#push` (keep `class="clip"`, unique ids, `data-start`, `data-duration`, `data-media-start`, `data-track-index`), or render `bg:none` and lay the WebM over your edit. Retime `timing` / `deaths` to your beats.

Numeral outlines are traced from Archivo (OFL) into `media/glyphs.js` (`media/gen-glyphs.js` regenerates them).

**Keywords:** collectible tracker, found counter, 1/8, collection badge, gold shield, coin slots, death counter, skull, x3, attempts, fails, tally, HUD, challenge, GTA 5.
