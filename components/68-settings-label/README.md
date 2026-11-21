# 68 Settings label

Graphics-setting labels for "LOW vs ULTRA" comparison videos: the setting name in heavy caps with its quality level colour-coded (LOW red, MEDIUM yellow, ULTRA green). The level is a real 3D extruded word that flips to the next level on your cut and locks in with a localised colour light.

- **A (`a/`, 16:9 long-form):** a stacked settings readout top-left. Rows tick on one by one; the compared setting (row 0, hero size) flips LOW → ULTRA on the cut.
- **B (`b/`, 9:16 Shorts / TikTok):** one big setting label top-centre; the level flips LOW → MEDIUM → ULTRA with each cut, with a `1/4 → 2/4 → 4/4` slider fraction.

## CONFIG
A (`a/index.html`):
- `rows`: `{ name, levels: ["Low", "Ultra"], flip: 2.1 }` for the compared setting (rolls through any level in between at `flip`), `{ name, levels: ["Medium"] }` for fixed rows.
- `levelColor`: which palette entry each level word uses (`HIGH` defaults to yellow).
- `palette`: per level, enamel face (top / mid / bottom), side (near / far), bevel lip, hot light colour, emissive level `em`, glow rgb.
- `layout`: `left`, row centres `ys`, `heroName` / `heroLevel` (row 0) and `name` / `level` sizes, `colGap`.
- `reel`: extrusion `depth`, `bevel`, `tilt`, ink edge px, contact `shadow` and offset.
- `timing`: `in`, `rowStep`, `out`, `end`.

B (`b/index.html`):
- `name`: 1–2 lines (a trailing colon hangs outside the centring).
- `levels`: `{ text, color, frac, at }` per step; `at` is the cut where it flips in; the last is the payoff.
- `palette`, `reel` as above; `layout`: `axis` (centre x), `nameTop`, `nameSize`, `lineGap`, `levelY`, `levelSize`, `maxInk`, `fracGap`; `timing`.

Level words use only A–Z, 0–9 and `. , ' ! ? -` (the traced glyph set). To use another width or weight, regenerate `media/glyphs.js` with `media/gen-glyphs.js` (needs `fontkit`).

## Render
```
cd a && npx hyperframes render . --variables '{"bg":"none"}' --format webm -o overlay.webm   # transparent overlay
cd a && npx hyperframes render . -o out.mp4                                                    # over the sample footage
```
Same for `b/`.

## Your own clip
Put your clip in `a/media/` (or `b/`) and point the `<video>` tags at it. The sample replays one shot per setting (first with a CSS blur standing in for LOW, then clean); replace those with your real LOW / MEDIUM / ULTRA captures and set each level's `at` (B) or the row's `flip` (A) to your cut times. Or render `bg:none` and lay the overlay on your edit.

Keywords: graphics settings, low vs ultra, quality comparison, texture quality, settings label, level flip, RDR2 / GTA 5 graphics comparison, 3D text, overlay, Shorts.
