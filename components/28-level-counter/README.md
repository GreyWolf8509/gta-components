# 28 Level counter

The "LVL 1 to LVL 1,000,000" counter from GTA challenge videos (climb a tower, train a character, level up every jump): a heavy white outlined level number that rolls up through the video and lands on a milestone. Built as real 3D geometry (extruded, bevelled Inter Black glyphs in Three.js) with the creators' thick ink outline and drop shadow, and mechanical digits that flip over on short drums as they count.

- **A, "Level roll" (16:9 long-form, `a/index.html`).** Docked top-left. Rolls LVL 1 to 999,999 with a pulse on each new column, then carries over into LVL 1,000,000 and fills with gold. Use it as the persistent challenge tracker in a long-form video.
- **B, "Level slam" (9:16 Shorts, `b/index.html`).** A big centred level number that rolls to 99, trembles, and slams to 100 with a shake, a gold fill and a green "LEVEL UP!" kicker. Use it as the beat of a Short.

## CONFIG
A (`a/index.html`):
- `label`: the label text ("LVL"; letters available: L V E U P M A X !).
- `climbTo`, `ticks`, `max`: the climb target, the levels that tick in one by one, and the max the payoff carries into.
- `place`: `align` ("left" docks top-left, "center" docks top-centre), `x` (ink left of the label, for "left") and `capTop` (top of the digit caps), in px.
- `font`: `size` (digit em, px), `label` (label scale), `gap` (label to number, em).
- `depth`, `bevel`, `tilt`, `yaw`: the extrusion and which way it recedes.
- `ink`, `shadow`: outline width (px) and drop-shadow strength.
- `colors`: white enamel (face / side / lip), gold (4 stops: a hard horizon makes it read as metal), the hot meniscus, the ink.
- `timing`: `enter`, `climb` [start, end], `ticks`, `pay` (the max lands), `out`, `end` (s).

B (`b/index.html`): the same, plus `kicker` ("LEVEL UP!"), `climbTo` / `tick` / `max` (98 / 99 / 100), `place.cx`, `font.gap` (px), `font.space` (extra word space in the kicker, em), the green kicker colours, and `timing.tick`, `timing.land` (the slam).

Digits use tabular figures, so columns never shift while rolling. Glyph outlines live in `media/glyphs.js`; regenerate with `media/gen-glyphs.js` (fontkit) to add letters.

## Render
```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay
cd a && npx hyperframes render . -o out.mp4                                                  # over the sample footage
```
Same for `b/`.

## Your own clip
Replace the `<video class="clip shot">` sources in `#push` (keep `data-start`, `data-duration`, `data-media-start`, `data-track-index`), or render `bg:none` and lay the webm over your edit. Move `timing.pay` (A) or `timing.land` (B) onto your cut.

## Keywords
level counter, LVL, level up, rank up, odometer, rolling number, count up, challenge counter, 1 to 1,000,000, GTA challenge, climb, overlay, 3D type, extruded numbers, gold, Shorts, long-form
