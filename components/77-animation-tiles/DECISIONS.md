# 77 Animation count tiles: decisions

Instanced 2026-11-21 from the film kit object in films/gta6-rdr2-gta5 (assets/kit/film.js, `tiles` + `pill`), over the
official GTA VI footage the film used under it. Rebuilt for the gauntlet in round 1.

## Evidence
- No census frame for this exact object (manifest note). Nearest census objects: 37 clip-grid counter (a bold counter
  over a grid of same-size tiles on darkened, graded footage), 36 ranking board (rows down the frame, coloured numerals,
  fill-in percentages), 34 stat card. Creators count things with same-size objects laid in rows and a big number.
- The job: an honest scale object for a numbers claim. One tile = 55,000 animations; GTA V fills one, RDR2 five and a half,
  GTA VI eleven. The count ticks up as the tiles land; the GTA VI row filling is the payoff.
- Standing rule: no stacked stat cards (kicker + number + caption). The claim stays a physical count of same-scale objects.

## Variant A (16:9)
- A navy board (Three.js extruded slab, clearcoat, bevelled edge) rises onto darkened footage (brightness .55, contrast 1.15,
  saturate 1.1; blacks kept). Three rows: game name (Oswald 600 40 px) and count (Oswald 700 64 px, tabular, identity colour)
  in the left column, optically aligned to the first tile's edges (name cap-top to the tile top, count ink-bottom to the tile
  bottom); the tile run from x 560.
- Tiles are Three.js instanced bevelled slabs (96 px, rounded, bevel 7/6, 27 px thick), MeshPhysicalMaterial clearcoat 1 in the
  identity colour (GTA V #46B64F, RDR2 #A3262F, GTA VI #F2558E), PMREM env, warm key with PCF-soft shadow map onto the board
  (real contact shadows) and a hemisphere fill, ACES. The RDR2 half tile is the same slab cut by a clipping plane: three
  bevelled sides and one straight cut.
- Each tile drops from 140 px (gravity curve, slight tilt), presses 3 px into the board on landing, and takes a 1-frame
  colour lift (impact). Steps 0.10 / 0.08 / 0.06 s. The count ticks per landing (value × landed / count, to the nearest
  1,000) with a 4-frame scale punch, and ends on the row's label.
- A point light rakes along each row as it fills (strongest on GTA VI); the counts are DOM.
- Payoff at 3.35 s: the eleventh GTA VI tile lands on a cut (beach → gym shot), the rake sweeps the row at 2× (0.45 s), the
  row's tiles and count take a 3-frame localised expose (brightness, no veil), the board shakes 3 px for 3 frames. Hold 1.3 s.
- Exit at 5.1 s: the tiles sink into the board in a wave (occluded by the board surface, never see-through), the labels wipe
  left, the board drops out of frame with directional blur, the grade clears, and the cut to the bar shot lands at 5.75.
  End 6.25 s. Source pill (NYT via TechRadar · animations per game) at 192/912, in at 0.45, out with the board.
- Shots (a/assets/clips, official GTA VI): t2-031 beach 0–3.35, t2-012 gym 3.28–5.75, t2-030 bar 5.68–6.25, each with a
  2-frame underlap (lesson 25).
- Legend "1 TILE = 55,000 ANIMATIONS" (36 px) top-right of the board so the scale reads without narration.

## Variant B (9:16), phone-first (lesson 26)
- Same object and CONFIG rows, stacked: the board spans x 72–960, three rows of 70 px tiles (830 px, ~77% of the frame) at
  y 746 / 946 / 1146, each with its name (44 px) left and count (84 px, identity colour) right on one baseline above the tiles,
  aligned to the first and last tile's ink edges. Same drop / press / rake / payoff / sink exit. Pill at 72/1396 with the
  short source ("NYT via TechRadar").
- Footage: the same official clips, centre-cropped (cover), dimmed under the board.

## Hero times
A 3.55 s, B 3.55 s (the rake sweep over the full GTA VI row, counts lit).

## Round 1 (7/7, no defects): judged "premium analytics widget"
Built: one navy board (Three.js extruded slab) with 33 recessed sockets, instanced bevelled clearcoat tiles dropping in,
PCF-soft contact shadows, rake light, count ticks, hold, sink exit. Critic: the single panel reads as a dashboard, name-over-
number columns read as stat-card grammar, the eleventh tile lands like the first.

## Round 2 (7/7, one defect): rails
- Replaced the panel with three socket rails (one extruded slab per game, 11 sockets each) that slide in one per row, footage
  between them, a 40% radial scrim behind. A: name + count inline on the rail, left of the run. B: name left / count right on
  one line over each rail, stroked.
- The eleventh GTA VI tile is the beat: deeper 240 px drop over 0.28 s, the rail dips 10 px, the count punches 1.18 -> 1
  elastic, 3-frame localised lift of the row (brightening the hue, not lerping to white), rake sweep. No jitter.
- Half tile is a real bevelled slab of half width. Bigger bevels, key +40%, rim light, roughness 0.3.
- Kept Oswald (the lead's brief says Oswald only); the critic's Barlow/Archivo note is noted, not taken.
- Defect found: the beach source clip has an internal cut at 1.533 s and s0 ran to 1.62 (3-frame boat flash).

## Round 3
- s0 ends at 1.50, s1 starts at 1.43 (2-frame underlap kept). First rail at 0.12 s (row 1 at 0.34).
- 16:9 type 48 / 80 px, tiles 80 px at x 760 (count clears the first socket by ~42 px). Rail bevel 4 px, sockets 11 px deep,
  slab #1A2150; a ShadowMaterial catcher behind the rails lands their shadow on the footage.
- Names and counts rise and drop through overflow windows (no clip-path typewriter remnants). Bed brightness 0.7, contrast 1.2.
