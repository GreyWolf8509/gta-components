# 77 Animation count tiles

Same-scale tiles (one tile = 55,000 animations) fill in per game: GTA V one tile, RDR2 five and a half, GTA VI eleven. The
honest scale object for a numbers claim, built as a socketed navy tray (Three.js) with bevelled clearcoat tiles dropping into
the sockets, real contact shadows, a rake light along the row that is filling, and the GTA VI row filling as the payoff. The
names, counts, legend and source pill are DOM type (Oswald). Full-kind component: it always shows footage under the tray.

- **A (16:9)**: long-form. Label column left, one tile run per row, tray 1600 x 600 centred, pill bottom-left. 6.15 s.
- **B (9:16)**: Shorts, phone-first. Three stacked rows at ~77% of the frame width, 84 px counts over each run, pill under the
  tray. Same CONFIG rows. 6.15 s.

## CONFIG
- `unit`, `legend`: the scale legend ("1 tile = 55,000 animations").
- `games`: per game id `name`, `c` (tile material colour), `ink` (count colour, kept at 3:1+ on the tray).
- `rows[]`: `game`, `label` (the final count text), `value` (the number the ticks count toward), `count` (tiles, fractions
  allowed: 5.5 = five tiles and a cut tile), `at` (row start, s), `step` (seconds between tile landings). Same shape as the
  film kit `tiles` object (`films/gta6-rdr2-gta5/assets/kit/film.js`).
- `pill`: `parts` (source text segments), `game` (dot colour).
- `timing`: `boardIn`, `drop` (fall time), `lead` (first landing after the row start), `sweep` (payoff light sweep), `hold`
  (after the payoff), `end`. The payoff is the last tile of the last row; the exit follows `hold`.
- `grade`: footage dim under the tray (brightness / contrast / saturate; blacks kept).
- `layouts`: per canvas width: tray rect, tile size and gap, row tops, label sizes, legend and pill positions.

## Render
```
cd a && npx --yes hyperframes@0.9.72 render . --variables '{"bg":"plate"}' -o out.mp4
cd b && npx --yes hyperframes@0.9.72 render . --variables '{"bg":"plate"}' -o out.mp4
```
Full kind: `bg:none` keeps the footage.

## Swap your own clip
Replace the `<video class="clip shot">` sources (A: `assets/clips/`, B: `media/clips/`) and keep `data-start` /
`data-duration` inside each clip's length (`data-media-start` for in-points). Cuts overlap by 2 frames with the incoming clip
underneath.

## Files
- `a/index.html`, `b/index.html`: the two variants (same script; the layout is picked from the root `data-width`).
- `a/media/fonts/`, `b/media/fonts/`: Oswald variable (OFL) + `oswald.css`.
- `b/media/clips/`: the official GTA VI clips copied for the 9:16 variant.

Keywords: comparison, count, tiles, scale, animations, GTA VI vs RDR2 vs GTA V, numbers claim, same-scale objects, tray.
