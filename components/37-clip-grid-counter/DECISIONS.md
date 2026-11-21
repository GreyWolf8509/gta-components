# 37 Clip grid counter: decisions

Both variants are full kind (the bed footage always shows), 30 fps. Shared physical layer: `media/clipgrid3d.js` (identical copy in
`a/media` and `b/media`); counter outlines `media/glyphs.js` (Inter 900 / opsz 32 tabular digits, OFL, traced with fontkit by
`a/media/gen-glyphs.js`); tile clips `media/tiles/tNN.mp4` (960x540 hard-cut montages of library shots at 1.0x, built by
`a/media/make-tiles.py`, so no tile ever runs past a shot).

## The evidence (what creators ship)
- `yt-o4nNjj44d4M` t00024 (3.8M, "15 crazy new features in gta vi"): a 5x3 grid of rounded 16:9 clip tiles (~16% frame width each,
  grid x 8-92%, y 22-76%) with thin glowing pink borders, over a purple-washed city bed. A heavy rounded pink numeral "15" with a white
  inner highlight sits top centre (y 5-15%, ~10% frame height); a caption sits under the grid (y 83%) with one keyword in pink.
- Motion (t00020 -> t00024): the counter counts 0 -> 15 while the tiles pop in. t00028: three tiles enlarge forward with labels.
  t00744-748 (the recap): the tiles fly back in and each gets a green rounded-square check badge at its top-right corner.
- Vernacular: **grid of clip tiles + big counter numeral top centre + caption below; tiles get ticked as the list goes.**
  Rough: flat 2 px borders, default rounded font, linear pops, no light, no depth.

## Variant A: "Tile grid (3D)", 16:9, 7.3 s
**Layout = the evidence:** 5x3 tiles (300x169 screens, 24 px gaps, grid x 127-1793, y 250-846), counter top centre (cap 150, y 59-209),
caption "15 HIDDEN DETAILS IN GTA 5" at y 872 (Inter 900 78 px, white with an ink stroke, HIDDEN in pink).

**Our upgrade.**
- Every tile is real geometry: a dark plum clearcoat slab (rounded-rect extrusion, bevelled, catches the pink / violet softboxes of a
  PMREM studio), a footage screen recessed under the bezel (inner shadow, a glass reflection, neon spill on the glass edge), a real
  neon tube along the rim (TubeGeometry; white-hot core, pink at the grazing edge), an additive halo, and a soft contact shadow on
  the grid plane that spreads as the tile rises.
- State per tile: **pending** (footage dimmed to 0.5 / sat 0.45, tube dark glass) -> **current** (the tile lifts 150 px toward the
  camera and turns to face it, footage comes up to full, the neon ignites with a 7-frame flicker, a specular sweep crosses its glass)
  -> **done** (a green candy check badge with an extruded white check stamps onto its corner: drops from z +70 with squash and
  overshoot; the tile settles back with a damped dip past rest).
- The counter: extruded, bevelled Inter 900 digits on real odometer drums (each column is a drum of 10 digits, radius 2.5 cap, clipped
  to a window with a feathered edge, so digits roll up from below with real foreshortening; never crossing other type). Hot-pink faces
  (4-stop gradient #C8107F -> #FF2FAE -> #FF6CCB -> white-pink top, hue-preserving tone map), dark ink walls and an ink backing so it
  holds 2.5:1 against the washed bed, tilted 0.16 rad so the lit top walls read as the evidence's white highlight. The tens drum rolls
  in at 10 while the pair re-centres. Rolls get their own 24-sample shutter, so a roll reads as one blurred drum, not stepped copies.
- Camera: one perspective camera (FOV 28) on pre-integrated springs. It starts wide and yawed, dives to the first tile, then flies the
  grid in snake order (row 1 left->right, row 2 back, row 3 again), leading each tick, yawing into the travel direction. Tick
  intervals ease from 0.30 s to 0.13 s, so the run accelerates into the payoff.
- Bed: v12 / v36 / v38 / v44 / v41 city-at-dusk shots cut like an edit, 9 px defocus, brightness .6 / contrast 1.16 / sat 1.3, a
  purple colour wash (the creators' look, blacks kept), parallax against the camera.
- Motion blur: 12 shutter sub-frames (0.3 shutter) accumulated in half float during all motion; the settled hold renders single.

**Payoff (4.22 s, the 15th tick lands): the counter locks in.** "15" slams toward the camera in 2 frames (+20% scale, z punch) and
springs back with an undershoot; the faces go white-hot for 2 frames and are back to hot pink within ~0.15 s; a local rake glint
crosses the bevels; a pink bloom snaps on behind it and settles; a light ripple runs back across the grid from the last tile (neon
tube pulse 2.4x + badge bump + a specular sweep left to right). The camera has already pulled back to the full frontal grid during
the last row (the top row stays >= 40 px under the counter), and the caption rises word by word through a mask. Hold 4.3-6.6.

**Exit (6.55-7.2):** caption drops through its mask, badges pop off, tiles collapse into their centres in tick order (power3.in, motion
blurred), the counter recedes as its window closes to a line; cut at 7.3.

## Variant B: "Vertical grid", 9:16, 6.8 s
Same object and story for a Short: 2x3 grid of bigger tiles (392x221 screens, x 82-926, y 478-1246), counter top centre (cap 200,
y 234-434, single drum 0 -> 6), caption in two lines under the grid ("HIDDEN DETAILS" / "IN GTA 5", 96 px, y 1282-1474). All inside the
Shorts safe zone (x 72-936, y 230-1480), centred on x 504 to clear the right-hand buttons. The camera glides down the grid in
snake order (intervals 0.50 -> 0.36 s, so each lift reads on a phone), following the rows at 35% vertically so the top row never
rises into the counter. Payoff at 3.26 s (the 6th tick), hold to 6.0, exit, 6.6 end.

## Round log
- r01: first build. Self-review fixes before the critic: tile halos and the counter bloom rebuilt as analytic SDF / radial falloffs that
  reach zero inside their quads (the first render showed hard pink rectangles); counter drums widened (radius 2.5 cap, window 0.14)
  so the neighbour digits' back edges no longer poke into the window; brighter candy face (own exposure 1.25, emissive base); calmer
  camera (lower spring rates, yaw 0.08) and the pull-back starts 7 ticks before the end so the lock lands on a settled full grid;
  16 -> 12 shutter sub-frames; payoff light toned down (neon pulse 0.7, flash 0.3) so it adds light without a pink wash.
- r02 (critic r01: 7/7, 1 defect = the odometer roll flashed a lighter rectangle of stepped ghost copies; counter dusty mid-pink; lock
  read as a pastel lift). Fixes: sine roll ease + separate 24-sample counter shutter + feathered screen-space window mask (no ghost
  slab); hot-pink faces with a hue-preserving tone map, ink walls and an ink backing; lock slam (+20% scale pop), neon tube pulse
  raised and halo pulse cut (no pink wash), inner glass spill to 20%; shutter halved to 0.3; fly framing pulled back so the top row
  clears the counter. Self-review of the first r02 capture: the face flash + an unbounded rake light washed "15" near-white for
  ~0.3 s, so the flash is now a 2-frame hit with a fast decay and the rake is a local glint (cut-off distance 2.1 cap); [v1] the
  camera's follow of row 3 lifted the top row into the counter, so the fly follows rows at 35% vertically and the counter moved up
  18 px; [v1] the empty 0.3 s tail after the exit trimmed (6.8 -> 6.6 s); [v1] caption 96 px, badges inset 4 px further left.
- r02 critic: 8/8, no defects, no hard caps; sticky status PASSED (both variants locked). tile.json shows r02 for both.
