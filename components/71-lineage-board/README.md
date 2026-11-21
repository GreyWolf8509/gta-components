# 71 Lineage board

Three physical year slabs (2013 · 2018 · 2026) on a lit navy board: the origin-story object that carries systems from one game to the next. Hero object of the film `films/gta6-rdr2-gta5` (part 1 hook). Full-kind component, Three.js, Oswald only.

- **A** `a/index.html`: 16:9 (1920×1080), the row. Long-form: the "13 years" beat of an explainer or thesis video.
- **B** `b/index.html`: 9:16 (1080×1920), the stack, phone-first: 2026 nearest and largest, "13 YEARS" headline in the hook zone. Shorts / TikTok.

Both: 30 fps, 5.5 s. Slabs drop in and land (2013 → 2018 → 2026), game names wipe in on the faces, the 13-year measure draws, a light runs 2013 → 2018, then the 2026 slab lifts and lights under a raking key (payoff 4.1 s), holds, and the slabs sink back into the board.

## Variables
- `mode`: `years` (default; the component), plus the film's other mounts `stuck`, `carry`, `tally`, `question`.
- `dur`: override the duration in seconds (0 = the mode's default).
- `bg`: unused here (the board is the background in both settings; the object is the whole frame).

## CONFIG (top of the script)
- `slabs[]`: `year`, `name` (the game label), `col` (identity colour), `x` (row spacing).
- `measure`: the measure label ("13 YEARS").
- `board`, `cap`, `base`, `ink`, `label`: materials and type colours.
- `years`: timings — `land` (per-slab drop start), `fall`, `measure` [draw start, end], `mlab` (label wipe), `baton` (the 2013 / 2018 light run), `payoff`, `exit`, `end`.

## Render
```
cd a && npx --yes hyperframes@0.9.72 render . -o lineage.mp4
cd b && npx --yes hyperframes@0.9.72 render . -o lineage-shorts.mp4
```
Other modes: `--variables '{"mode":"carry"}'`.

## Changing the content
Edit `CONFIG.slabs` (years are built from the bundled Oswald 700 outlines in `GLYPHS`, digits only) and `CONFIG.measure`. Fonts live in `media/fonts/` (Oswald variable, OFL). No footage is used; to put the board over your own clip, render with a transparent background is not supported (full-kind): composite the MP4 as a cutaway.

Keywords: timeline, lineage, year slabs, 2013 2018 2026, GTA V, Red Dead 2, GTA VI, origin story, comparison, 3D board.
