# 46 Evolution timeline

The release-year tag from evolution and history videos ("GTA V 2013 vs 2022", "evolution of police cars"): a big white outlined year in the top-right corner that changes when the clip changes. Built as real 3D (Three.js): extruded, bevelled enamel numerals with the creators' thin black stroke and soft shadow, and a gold lock-in on the last year.

- **A (16:9 long-form, `a/index.html`), "3D timeline":** every stop year is a card on a spine that recedes into depth. The camera travels along it: each new year arcs in and drops onto the top-right slot on its cut (squash, bounce, lock-in); older years slide back into depth, joined by a flat white enamel bar with one engraved groove per year between them. Fast moves carry real motion blur. The last year fills with gold on the impact and ignites on the lock-in.
- **B (9:16 Shorts, `b/index.html`), "Year stack":** one big year at the top-right of the Short whose digits are mechanical drums; it rolls from one year to the next on each cut and slams into the last year in gold.

## CONFIG
- `stops`: the years the edit holds on (one clip each). The last is the payoff. A puts a collar on the rod for every year between; B rolls through every year between.
- `place`: A `{x, base}` front-slot ink centre and base line; B `{inkR, capTop}` right ink edge and cap top.
- `font.size`: Inter Black em in px (A 176 = cap 128; B 262 = cap 190).
- A `scene`: `pcx/pcy` principal point, `fov`, `elev` (camera height over the spine, rad), `yaw` (how steeply the past recedes), `step` (spine distance between stops), `gaps` (spine distance per gap), `recede` (older cards shrink), `cardYaw`, `lean` (0: passed years face the camera).
- `depth`, `bevel`, `ink`, `shadow`; B `tilt`, `yaw` (extrusion direction).
- `colors`: white enamel, dim (A, years not in the slot: white enamel a touch less lit), gold (payoff), rail (A's spine bar), hot (meniscus/bloom), ink.
- `timing`: A `enter` ([start, landed]), `travel` (one `[start, arrive]` per stop change; arrive on your cuts), `land` (`h` drop height per stop, `fall` time, `sq` contact squash per stop), `out`, `end`. B `enter`, `ticks` (one flip per year), `run` (the eased run of years), `land` (the last year, on the cut), `out`, `end`.

## Render
```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay
cd a && npx hyperframes render . -o out.mp4                                                 # over the sample footage
```
Same for `b/`.

## Your own clips
Set `bg` to `none` and lay the WebM over your edit, or replace the `<video>` sources in `#push` (keep `class="clip"`, unique ids, `data-start` / `data-duration` / `data-media-start`, and start each incoming clip 2 frames early). Match `timing.travel` arrivals (A) or `timing.ticks` / `timing.land` (B) to your cut times.

Glyph outlines: `media/glyphs.js` (Inter Black, tabular figures, OFL), regenerated with `media/gen-glyphs.js` (needs fontkit).

Keywords: evolution timeline, release year, year tag, then vs now, history, through the years, 3D year, year counter, odometer, GTA 5, GTA V, gold, extruded numbers.
