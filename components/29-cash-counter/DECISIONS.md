# 29 Cash counter: decisions

## Variant A: Cash HUD (16:9, 1920x1080, 7.0 s)

**Evidence.**
- `yt-5zKoq7EabvQ` t01346 (7.4M views) is the reference. A rounded pill (corner radius about 40% of its height) docks at the top of the frame, about 25% of the frame wide and 11–15% tall. It has a dark charcoal or slate translucent fill (about 75% opacity), a 2–3 px white outline, and a heavy condensed `$ 2,900,304` in lime green with a thin dark edge.
- In its gain state (t02061), the value turns neon green with a glow, gets a leading `+`, and the outline takes a green tint. It then settles into the new total (t02065).
- `yt-fp1Ywp3MmUU` t00076 is the "neon green money pop": a heavy italic sans in bright green with a strong neon bloom and no box.
- The evidence pill sits top-left. The manifest brief asks for top-right, which is also where GTA's own cash readout lives. A creator can move it with `CONFIG.pill.x`.

**Our upgrade.**
- **The pill is real geometry** (Three.js, `media/gloss3d.js`), built in two parts:
  - **Bezel.** A white enamel ring, 10 px, with a rounded 4–5 px bevel, clearcoat, and a studio PMREM environment (softbox above, hot bar behind, cool and warm side strips). The top lip catches light and the underside falls off.
  - **Body.** Smoked glass recessed under the bezel: a ramp from #1C2830 to #070B0E at 88% opacity, over a frosted backdrop (`blur 16px, brightness .4, saturate 1.2`). The footage reads as dark smoke behind it, never a grey veil.
  - **Light inside the glass.** A soft upper-half gloss reflection, a recess shadow under the bezel, and a green spill where the digits light the glass.
- **Digits.** A true odometer in Archivo 900 at 66% width and 86 px, matching the evidence's heavy condensed face:
  - each column is masked by the window (overflow, no mask-image);
  - the strip row pitch keeps neighbour digits outside the window at rest;
  - the face is a 4-stop lime gradient (#F2FFC4 → #9DFB72 → #43E66B → #14B451) on a 7 px dark edge, with a green glow;
  - motion blur is 3–7 stacked samples plus a vertical-only Gaussian, scaled to the column's speed.
  - The `$` and commas are fixed glyphs, and the group is optically centred in the window.
- **Gains.** A neon `+$25,000` (Inter 900 italic, 60 px) pops under the pill: `back.out(2.4)` scale, a 9 px blur resolve and a 2-frame opacity attack. It hangs for about 0.4 s, then shoots up, stretching and smearing, behind the frosted glass into the pill. On contact the pill squashes (sy 0.93), its bottom kicks back (rx +0.16, sprung) and it hops 10 px. The bezel flashes green and only the columns that change roll forward, right to left, landing with `back.out(1.35)`.
- **Payoff (state change).** `+$1,000,000` (84 px) pops over the cash table and is absorbed on the cut to the yacht (3.57 s). The pill enters the evidence's neon gain state: the bezel turns saturated green with an outer neon glow, the glass floods green, and every column spins a full turn, cascading right to left. At **4.11 s** the millions column locks in:
  - a 12% punch;
  - the digits flash white-hot (peak held for 3 frames) and settle neon;
  - one hard specular rake crosses bezel, glass and digits;
  - a green aura blooms on the object only;
  - a small impact and a 1.1 exposure lift hit the footage.

  The neon state cools back to the white bezel by 6.1 s.
- **Entrance and exit.** The pill enters big (1.34×), 170 px inward of the dock, swinging up from edge-on (rx −1.4 rad, sprung). It has a 9 px blur, a 2-frame opacity attack, and the boot roll (every column spins in, left to right). It glides to the dock at 0.98 s with a sideways swing and a 3% overshoot, then drifts very slightly so the environment light moves on the bezel. On exit (6.30 s) it winds up, then folds back edge-on into the top edge with a 7 px blur, and cuts at edge-on (6.62 s).

**Shots and cut points (r02, frame-exact).** v56 gameplay truck crash (0–2.6, gain 1) → v10 cash table (2.6–3.833, 37 of its 38 frames; the payoff chip hangs over the cash for more than 1 s) → v11 yacht (3.833–5.9; the chip is absorbed 1 frame before the cut, lock-in) → v18 pool skyline (5.9–7.0, hold and exit). All play at 1.0×, within their length.

**Payoff beat.** Lock-in at 4.34 s (r02); hero frame 4.62 s.

## Variant B: Cash pill (9:16, 1080x1920, 7.0 s)

**Evidence.**
- `yt-wZhwEgpeg9c` t00051 (26.6M views, Short) is a label over a value in the upper area, heavy sans with an outline. The value changes colour as it crosses thresholds (green → yellow → orange → red).
- `yt-5zKoq7EabvQ` gives the pill and its gain state; `yt-fp1Ywp3MmUU` gives the neon "+$" pop.
- The brief asks for a big money-green cash pill with a ticker and gains popping in.

**Our upgrade (r04, phone-first, lesson 26).**
- **The pill is a chunky real-3D slab** (Three.js, `media/gloss3d.js` with a perspective camera, D 2000 px, eye point low at (540, 1450)). The low eye keeps the face square and readable while the bottom wall shows. It is 740×236, 69% of the frame wide, centred at x 510 (settled x 126–902, y 254–672, inside x 72–936).
  - **Body:** a 72 px deep money-green block whose wall is a **reeded coin edge**: grooves every 9 px with a lit ridge line, done in the shader. It is the money cue that survives 360×640.
  - **Face:** a pillowed lacquer plate (#25C862 → #035A26, clearcoat) recessed 11 px under the bezel.
  - **Bezel:** a white enamel lip (18 px, rounded 6 px bevel) standing proud of the face.
  - **Light and shadow:** a contact shadow on the footage, and studio PMREM reflections that move with the idle drift.
  - The guilloche, DOM gloss and recess-shade layers are gone; they vanished at phone size.
- **Digits.** A raised odometer in Archivo 900, 66% width, 150 px:
  - a white enamel face on an 11 px ink edge with a solid 6 px extrusion;
  - pinned to the face plane with a CSS `perspective` that matches the camera;
  - `backface-visibility: hidden`.
- **Label.** "BANK BALANCE" in Archivo 900 at 86% width, 62 px, white with a 9 px ink stroke, on the slab's plane. It rolls to a gold "MILLIONAIRE" (overflow window).
- **Gains (one small, one payoff).**
  - `+$210,000`: a back.out pop, absorbed 1 frame before the 1.633 cut. It gets a small squash only.
  - `+$150,000` (128 px): slams in from 1.45×, hangs 1.07 s, and is absorbed at 3.567 s, 1 frame before the yacht cut.
- **Payoff (one beat).**
  - The new millions "1," grows in from its baseline as the slot opens. Only the target digit is printed in that strip, so no neighbour rows show.
  - The changed columns spin and land right to left. The leftmost lands on the **4.133 s cut to the sunlit tower**.
  - The lock: a 6.5% punch, then a hot front re-skins the slab from green to gold, face and reeded edge included, left to right over 0.4 s. The slab turns 0.13 rad into the key light, so the reflections move across the bezel, and one specular rake follows.
  - A tight gold aura stays on the object. There is no frame-wide exposure lift, only a small shake.
- **Entrance and exit.**
  - In: it drops out of the top, tipped face-down (the face always stays visible to the low eye), at opacity 1 from frame 1, and springs to rest (peak 1.06×). The boot roll runs as it lands.
  - Out: the label rolls up, the slab winds up, then launches out of the top edge with blur. There is no fade and no see-through frame.
- **No held yaw.** With the low eye, yaw reads as an in-plane roll, so the rest pose is level, with only a ±0.05 rad drift.

**Shots (r04, 2-frame overlaps, lesson 25).** Each incoming clip starts 2 frames early **under** the outgoing one (z-index 5→1), and `#root` is #0E0F13 on plate renders, so a late-painted frame can never show white. The cuts are:
- v30-v street explosion (0–1.633);
- v28-v tennis mansion (1.567–3.6);
- v11-v yacht (3.533–4.133);
- v37-v glass tower (4.067–6.0, gold lock on the 4.133 cut);
- v44-v bridge skyline (5.933–7.0, exit).

**Payoff beat.** Gold lock at 4.133 s, on the cut; hero frame 4.9 s (settled, level gold state).

## Round log
- r01 (7/7, 2 defects): first build of both variants.
- r02 fixes the critic's defects and its biggest gap (the roll):
  - **Exit sliver.** Reel samples now set `visibility: inherit`, so a hidden `#face` hides them. The frame is clean from the edge-on cut.
  - **Frozen frame.** Every clip is cut to whole frames inside its source; v10 uses 37 of its 38 frames.
  - **Roll legibility.** At most 3 motion samples, spread capped at 0.9 row and vertical blur at 6 px, so spinning numerals stay readable. Only the columns that change move. The payoff gives its changed column(s) one extra turn and keeps the rest razor sharp, so in A "+$1,000,000" visibly lands on the millions digit.
  - **Settle.** A mechanical detent replaces `back.out`. Columns arrive still moving and the detent absorbs it: under 0.08 row past the mark, settled in 4 frames.
  - **Chips.** Absorbed through an overflow window at the pill's bottom edge at full opacity, gone before the cut. There is no half-alpha ghost. A's payoff chip now hangs for more than 1 s over the cash table.
  - **A.** The lock punch is anchored at the pill's top-right corner (it no longer reaches the frame edge), and a hard specular rake crosses bezel, glass and digits right after the white-hot flash.
  - **B.** The new millions column rolls blank → 1 while the group spreads (0.24 s), so there's no reserved hole. The changed columns land right to left, the leftmost on the gold lock.
- r03 (v0 locked at 8 in r02 and untouched; SSIM 0.996 against r02), B only:
  - **Gain timing.** Each chip now pops only after the previous roll has settled: pops 1.0 / 2.0 / 2.98, merges 1.38 / 2.38 / 3.567. Rolls stagger by rank among the columns that actually move (0.04 s, 0.36 s each), and the boot roll is faster (0.45 s).
  - **Footage.** The green van, the dark cash table and the hazy yacht hold are gone (shots above). The gold re-skin lands exactly on the cut to the sunlit tower.
  - **Contact shadow.** `0 12px 28px rgba(0,0,0,.5)` plus a tight `0 4px 6px` under the pill.
  - **Lock punch.** Down from 10% to 6.5%, so transient frames stay closer to the safe edge.
- r03 result: v0 7 / v1 6, 1 defect. The r03 render had a white frame at the 6.067 s tower → bridge cut (the incoming shot painted one frame late), and the critic read v1 as an app widget at phone size. v0 stays locked from r02. After the round limit, `b/` was restored to its r02 source (best round: 7, no defects). The r03 variant is kept outside the project.
- Open for v1: the material doesn't survive at 360×640 (guilloche contrast, bevel inner shadow); the label face should be Archivo, not tracked Inter; overlap the shots by 2 frames at every cut.
- r04 (B only; v0 untouched, SSIM 0.9956 against r03):
  - B was rebuilt phone-first as a perspective 3D slab with a reeded coin edge, Archivo label and raised numerals.
  - There are now two gains with one payoff beat, and shots overlap by 2 frames.
  - The self-review fixed four problems before the critic: mirrored numerals on the entrance (the face turned past edge-on for the low eye), neighbour rows in the scaled millions column, the label exit dragging the old word back, and the 7-column overflow (stretch 72 → 66, width 720 → 740).
  - r04 result: v0 7 (still locked from r02) / v1 8, no defects. STATUS: PASSED.
