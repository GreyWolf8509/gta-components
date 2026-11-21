# 72 Three-way split

A true GTA V → RED DEAD 2 → GTA VI live comparison: three plates of official footage with chrome dividers and identity chips
(accent spine + name + year), held like a comparison, then the winner's plate takes the whole frame.

- **A (16:9, 1920x1080, 6.4 s):** three 640 px columns. Long-form comparison beats ("GTA 6 vs RDR2 vs GTA 5", "which engine does it best").
- **B (9:16, 1080x1920, 6.4 s):** three stacked bands, phone-first, for Shorts / TikTok comparison hooks.

Both variants are HyperFrames projects (`a/index.html`, `b/index.html`) built on the shared `media/split.js` + `media/split.css`
(same files in `a/media` and `b/media`, by copy; port target: `films/gta6-rdr2-gta5/assets/kit/film.{css,js}` split3).

## CONFIG (top of each index.html)
- `axis`: `"x"` columns across (A) or `"y"` bands down (B). `W`, `H`: canvas.
- `order`: the three games left→right / top→bottom (`g5`, `rdr`, `g6`); `winner`: the game that takes the frame.
- `div`: divider thickness (px). `shake`: selector of the stage wrapper that takes the impacts.
- `band` (B only): `{ scale, ox, oy }` how the 1920x1080 sources sit inside each band.
- `chip.pos(i, cell, w, h)`: the settled chip position per plate; `chip.dock`: where the winner chip lands after the wipe.
- `t`: `cell[]` slam-in starts, `cellDur`, `divAt[]`, `chipAt[]`, `wipeAt`, `wipeDur`, `end`.
- Shots are the `<video class="clip">` elements in `#split`: `data-game` (`g5` / `rdr` / `g6`, plus `g6-full` for the winner's full-frame
  copy, same source and timing as the winner's last shot), `data-start`, `data-duration`, `data-media-start`, and on A `data-focus`
  (the source x kept centred in the column; the winner's last shot uses its own third, e.g. 1600 for the right column, so the reveal
  is continuous).

## Render
```
cd a && npx --yes hyperframes@0.9.72 render . -o out.mp4
cd b && npx --yes hyperframes@0.9.72 render . -o out.mp4
```
Full-kind component: it always shows footage (the `bg` variable has no effect).

## Swap in your own clips
Replace the `src` of the videos in `#split` with your own captures (1920x1080, 30 fps), keep `data-game`, set `data-start` /
`data-duration` / `data-media-start` so no clip runs past its source, and give the winner's last shot and `g6-full` the same source
and timing. On A set `data-focus` for where the column should look; chips, dividers and the wipe follow the config.

Keywords: comparison, split screen, triptych, GTA 6 vs RDR2 vs GTA 5, versus, side by side, graphics comparison, winner reveal.
